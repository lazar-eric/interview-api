import { Includeable, ModelStatic, Op, Order, WhereOptions } from 'sequelize';

import { MongoResponse, Query } from '@amaui/models';

import BaseModel from './base.model';
import { IRequest } from 'types';
import User from './user.model';

export interface IContract {
  id: number;
  name: string;
  description: string;
  date: number;
  signature: string;
  reviewed: boolean;
  user: number;
  added_at: number;
}

export default class Contract extends BaseModel implements Partial<IContract> {
  public id: number;
  public name: string;
  public description: string;
  public date: number;
  public signature: string;
  public reviewed: boolean;
  public user: number;
  public added_at: number;

  public static model: ModelStatic<any>;

  public constructor(value: IContract) {
    super();

    this.init(value);
  }

  public init(value: IContract) {
    // Only allowed values for the model
    if (value) {
      if (value.id !== undefined) this.id = value.id;

      if (value.name !== undefined) this.name = value.name;

      if (value.description !== undefined) this.description = value.description;

      if (value.date !== undefined) this.date = value.date;

      if (value.signature !== undefined) this.signature = value.signature;

      if (value.reviewed !== undefined) this.reviewed = value.reviewed;

      if (value.user !== undefined) this.user = value.user;

      if (value.added_at !== undefined) this.added_at = value.added_at;

      // Todo
      // add default values server inserted
      // ie. organization
    }

    return this;
  }

  public async add(req: IRequest) {
    // Todo
    // Some pre-add logic based on the request
    // or whatever
    const response = await Contract.model.create(this.toObjectMySQL());

    return new Contract(response).toObjectResponse();
  }

  public static async query(req: IRequest) {
    const {
      user
    } = req;

    const query = Query.fromRequest(req);

    // Todo
    // Some pre-query logic based on the request
    // ie. add additional query filters
    // user from specific organization
    // or whatever
    const limit = query.limit;
    const offset = query.skip;

    const where: WhereOptions<IContract> = {};

    const value = query.query;

    if (value?.name !== undefined) {
      where.name = {
        [Op.like]: `%${value.name}%`
      };
    }

    if (value?.reviewed !== undefined) {
      where.reviewed = value.reviewed;
    }

    const include: Includeable[] = [
      {
        model: User.model,
        as: 'user_id',
        where: {
          id: user.id
        },
        required: true
      }
    ];

    const order: Order = [
      ['added_at', 'DESC']
    ];

    const result = await Contract.model.findAndCountAll({
      where,
      include,
      order,
      limit,
      offset
    });

    const response = new MongoResponse();

    response.response = result.rows.map(item => {
      const value = new Contract(item).toObjectResponse();

      value.user = new User(item.user_id).toObjectResponse();

      return value;
    });

    response.total = result.count;

    return response;
  }

  public toObjectMySQL() {
    const value: Partial<IContract> = {};

    const properties = ['id', 'name', 'description', 'date', 'signature', 'reviewed', 'user', 'added_at'];

    properties.forEach(item => {
      if (this[item] !== undefined) value[item] = this[item];
    });

    return value;
  }
}
