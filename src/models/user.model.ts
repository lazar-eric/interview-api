import { CreateOptions, ModelStatic, Op, Order, WhereOptions } from 'sequelize';

import { MongoResponse, Query } from '@amaui/models';

import BaseModel from './base.model';
import { IRequest } from 'types';

export interface IUser {
  id: number;
  name: string;
  email: string;
  added_at: number;

  [p: string]: any;
}

export default class User extends BaseModel implements Partial<IUser> {
  public id: number;
  public name: string;
  public email: string;
  public added_at: number;

  public static model: ModelStatic<any>;

  public constructor(value: IUser) {
    super();

    this.init(value);
  }

  public init(value: IUser) {
    // Only allowed values for the model
    if (value) {
      if (value.id !== undefined) this.id = value.id;

      if (value.name !== undefined) this.name = value.name;

      if (value.email !== undefined) this.email = value.email;

      if (value.added_at !== undefined) this.added_at = value.added_at;

      // Todo
      // add default values server inserted
      // ie. organization
    }

    return this;
  }

  public async add(options?: CreateOptions<any>, req?: IRequest) {
    // Todo
    // Some pre-add logic based on the request
    // or whatever
    const response = await User.model.create(this.toObjectMySQL(), options);

    return new User(response).toObjectResponse();
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

    const where: WhereOptions<IUser> = {};

    const value = query.query;

    if (value?.name !== undefined) {
      where.name = {
        [Op.like]: `%${value.name}%`
      };
    }

    if (value?.email !== undefined) {
      where.email = {
        [Op.like]: `%${value.email}%`
      };
    }

    const order: Order = [
      ['added_at', 'DESC']
    ];

    const result = await User.model.findAndCountAll({
      where,
      order,
      limit,
      offset
    });

    const response = new MongoResponse();

    response.response = result.rows.map(item => new User(item).toObjectResponse());

    response.total = result.count;

    return response;
  }

  public toObjectMySQL() {
    const value: Partial<IUser> = {};

    const properties = ['id', 'name', 'email', 'added_at'];

    properties.forEach(item => {
      if (this[item] !== undefined) value[item] = this[item];
    });

    return value;
  }
}
