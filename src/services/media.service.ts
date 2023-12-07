import path from 'path';
import { Ranges } from 'range-parser';
import formidable, { Fields, Files, File } from 'formidable';

import { clamp, is, parse } from '@amaui/utils';
import { ValidationError } from '@amaui/errors';
import AmauiNode from '@amaui/node';

import BaseService from './base.service';
import { Media, User } from 'models';
import { IMedia } from 'models/media.model';
import { IRequest } from 'types';
import { mysql } from 'databases';
import { AWSService } from 'services';
import config from 'config';

// binaries
const wd = process.cwd();

const folders = {
  medias: path.join(wd, './src/medias')
};

export interface IMediaServiceForm {
  valid: boolean;
  fields: Fields;
  files: Files | File;
}

export interface IMediaServiceRead {
  media?: Media;
  response?: Buffer;
  headers?: any;
  error?: boolean;
  status?: number;
}

export class MediaService extends BaseService<IMedia> {

  public constructor() {
    super(Media, 'medias', 'media');
  }

  public async add(req: IRequest): Promise<Media> {
    const {
      user
    } = req;

    let filePath: string;

    try {
      const media: Media = new Media(req.body);

      // form
      const value = await MediaService.form(req);

      if (!value?.valid) throw new ValidationError(`Upload error`);

      const values: Media = {} as any;

      Object.keys(value.fields).forEach(item => values[item] = is('array', value.fields[item]) ? value.fields[item][0] : value.fields[item]);

      Object.keys(values).forEach(item => values[item] = parse(values[item]));

      // file
      const fileProperties = Object.keys(value.files);

      let file = value.files[fileProperties[0]] as File;

      if (is('array', file)) file = file[0];

      // path
      filePath = file.filepath;

      // max file size
      // 140 mb
      if (file.size > (140 * 1e6)) {
        // Remove from the storage
        if (filePath) await AmauiNode.file.remove(filePath);

        throw new ValidationError(`Maximum upload file size is 140mb`);
      }

      const fileData = await AmauiNode.file.get(filePath, true) as Buffer;

      // validation
      req.body = values;

      // mime
      req.body.mime = file.mimetype;

      // Todo
      // validate
      // await validateModel(validation.media('add'), req, 'body', { parse: false });

      // add to the object
      Object.keys(values).forEach(item => media[item] = values[item]);

      media.user = user.id;

      media.mime = file.mimetype;

      media.size = file.size;

      // Todo
      // Add analytics to transaction
      const response = await mysql.sequelize.transaction(async transaction => {
        const result = await media.add({ transaction }, req);

        const ID = String(result.id);

        // Add to AWS
        const toAdd: Array<{ id: string; value: Buffer }> = [];

        toAdd.push({ id: ID, value: fileData });

        // add
        // all the items to aws
        await Promise.all(toAdd.map(item => AWSService.s3.add(item.id, item.value)));

        return result;
      }) as Media;

      // Remove from the storage
      if (filePath) await AmauiNode.file.remove(filePath);

      return response;
    }
    catch (error) {
      // Remove from the storage
      if (filePath) await AmauiNode.file.remove(filePath);

      throw error;
    }
  }

  public async remove(req: IRequest): Promise<any> {
    const {
      user
    } = req;

    const id = req.params.id;

    const media = await Media.model.findOne({
      where: {
        id: +id
      },

      include: [
        {
          model: User.model,
          as: 'user_id',
          where: {
            id: user.id
          },
          required: true
        }
      ]
    });

    if (!media) throw new ValidationError(`No media found`);

    const response = await mysql.sequelize.transaction(async transaction => {
      const result = await Media.model.destroy({
        where: {
          id: media.id
        },

        transaction
      });

      // remove
      // aws
      // original, and all of the versions
      await AWSService.s3.remove(String(media.id));

      return result;
    });

    return response;
  }

  public async read(req: IRequest): Promise<IMediaServiceRead> {
    const {
      user
    } = req;

    const id = req.params.id;

    const media = await Media.model.findOne({
      where: {
        id: +id
      }
    }) as Media;

    if (!media) throw new ValidationError(`Media not found`);

    let result: any;

    const total = media.size;

    let bandwidth: number = total;

    const usesRange = req.get('range');

    const ID = String(media.id);

    if (usesRange) {
      const range = req.range(total);

      if (
        [undefined, -1, -2].includes(range as any) ||
        (range as any)?.type !== 'bytes'
      ) return {
        error: true,
        status: 416
      };

      // Only allow 1 range per the request
      const rangeItem = (range as Ranges)[0];

      // max 4 mb per chunk
      const maxChunk = 4 * 1e6;

      // Start
      if (rangeItem.start === 0 && rangeItem.end === total) {
        // const chunk = clamp(total, 0, maxChunk);

        const chunk = clamp(total * 0.25, 0, maxChunk);

        rangeItem.end = rangeItem.start + clamp(chunk, 0, total) - 1;
      }

      // max bytes part
      const bytePart = rangeItem.end - rangeItem.start;

      if (bytePart > maxChunk) rangeItem.end = clamp(rangeItem.start + maxChunk - 1, 0, total);

      bandwidth = rangeItem.end - rangeItem.start;

      // Get from AWS
      // partial bytes value
      const response = await AWSService.s3.get(
        ID,
        {
          Range: `bytes=${rangeItem.start}-${rangeItem.end}`
        }
      ) as Buffer;

      result = {
        media,
        response,
        headers: {
          'Accept-Range': 'bytes',
          'Content-Range': `bytes ${rangeItem.start}-${rangeItem.end}/${total}`,
          'Content-Length': response.length
        },
        status: 206
      };
    }
    else {
      // Get from AWS
      // original only for the moment
      const response = await AWSService.s3.get(ID) as Buffer;

      result = {
        media,
        response
      };
    }

    return result;
  }

  public static async form(req: IRequest): Promise<IMediaServiceForm> {
    const form = formidable({ maxFileSize: config.value.limits.media.document, hashAlgorithm: 'sha256' });

    try {
      let [fields, files] = await (form.parse(req) as unknown as Promise<[Fields, Files | File]>);

      return { valid: true, fields, files };
    } catch (error) {
      console.error(error);

      return error?.message || error;
    }
  }

}

export default new MediaService();
