import { Route, Post, Delete, Get } from '@amaui/api';
import { Response } from '@amaui/models';

import { BaseRoute } from './base.route';
import { MediaService } from 'services';
import { authenticate } from 'middleware';
import { IRequest, IResponse } from 'types';

@Route(
  '/medias',
  authenticate
)
export default class MediaRoute extends BaseRoute {

  @Post(
    '/',
    // validation is done
    // in the service after the form parse
  )
  public async add(req: IRequest) {
    try {
      const response = await MediaService.add(req);

      return Response.fromAdded(response);
    }
    catch (error) {
      console.log('add error', error);

      throw error;
    }
  }

  @Get(
    '/:id/read'
  )
  public async read(req: IRequest, res: IResponse) {
    const {
      media,
      response,
      headers,
      error,
      status
    } = await MediaService.read(req);

    if (error) res.status(status || 400).send();

    // cache
    // 30 days
    const period = 60 * 60 * 24 * 30;

    // response
    // send to the user
    res.set({
      'Cache-control': `public, max-age=${period}`,

      ...headers
    });

    res.status(status || 200).type(media.mime).send(response);

    return;
  }

  @Delete(
    '/:id'
  )
  public async remove(req: IRequest) {
    const response = await MediaService.remove(req);

    return Response.fromRemoved(response);
  }

}
