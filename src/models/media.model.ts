import { CreateOptions, ModelStatic, Op, Order, WhereOptions } from 'sequelize';

import { MongoResponse, Query } from '@amaui/models';

import BaseModel from './base.model';
import { IRequest } from 'types';

export interface IMedia {
  id: number;
  name: string;
  mime: string;
  size: number;
  added_at: number;

  [p: string]: any;
}

export default class Media extends BaseModel implements Partial<IMedia> {
  public id: number;
  public name: string;
  public mime: string;
  public size: number;
  public added_at: number;

  public static model: ModelStatic<any>;

  public constructor(value: IMedia) {
    super();

    this.init(value);
  }

  public init(value: IMedia) {
    // Only allowed values for the model
    if (value) {
      if (value.id !== undefined) this.id = value.id;

      if (value.name !== undefined) this.name = value.name;

      if (value.mime !== undefined) this.mime = value.mime;

      if (value.size !== undefined) this.size = value.size;

      if (value.added_at !== undefined) this.added_at = value.added_at;

      // Todo
      // add default values server inserted
      // ie. organization
    }

    return this;
  }

  public async add(options?: CreateOptions<any>, req?: IRequest): Promise<IMedia> {
    // Todo
    // Some pre-add logic based on the request
    // or whatever
    const response = await Media.model.create(this.toObjectMySQL(), options);

    return response;
  }

  public static async query(req: IRequest) {
    const query = Query.fromRequest(req);

    // Todo
    // Some pre-query logic based on the request
    // ie. add additional query filters
    // user from specific organization
    // or whatever
    const limit = query.limit;
    const offset = query.skip;

    const where: WhereOptions<IMedia> = {};

    const value = query.query;

    if (value?.name !== undefined) {
      where.name = {
        [Op.like]: `%${value.name}%`
      };
    }

    if (value?.mime !== undefined) {
      where.mime = {
        [Op.like]: `%${value.mime}%`
      };
    }

    const order: Order = [
      ['added_at', 'DESC']
    ];

    const result = await Media.model.findAndCountAll({
      where,
      order,
      limit,
      offset
    });

    const response = new MongoResponse();

    response.response = result.rows.map(item => new Media(item).toObjectResponse());

    response.total = result.count;

    return response;
  }

  public toObjectMySQL() {
    const value: Partial<IMedia> = {};

    const properties = ['id', 'name', 'mime', 'added_at'];

    properties.forEach(item => {
      if (this[item] !== undefined) value[item] = this[item];
    });

    return value;
  }
}
