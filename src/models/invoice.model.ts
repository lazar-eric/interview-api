import { Includeable, ModelStatic, Op, Order, WhereOptions } from 'sequelize';

import { MongoResponse, Query } from '@amaui/models';

import BaseModel from './base.model';
import { IRequest } from 'types';
import User from './user.model';

export interface IInvoice {
  id: number;
  to: string;
  city: string;
  country: string;
  user: number;
  added_at: number;

  [p: string]: any;
}

export default class Invoice extends BaseModel implements Partial<IInvoice> {
  public id: number;
  public to: string;
  public city: string;
  public country: string;
  public user: number;
  public added_at: number;

  public static model: ModelStatic<any>;

  public constructor(value: IInvoice) {
    super();

    this.init(value);
  }

  public init(value: IInvoice) {
    // Only allowed values for the model
    if (value) {
      if (value.id !== undefined) this.id = value.id;

      if (value.to !== undefined) this.to = value.to;

      if (value.city !== undefined) this.city = value.city;

      if (value.country !== undefined) this.country = value.country;

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
    const response = await Invoice.model.create(this.toObjectMySQL());

    return new Invoice(response).toObjectResponse();
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

    const where: WhereOptions<IInvoice> = {};

    const value = query.query;

    if (value?.city !== undefined) {
      where.city = {
        [Op.like]: `%${value.city}%`
      };
    }

    if (value?.country !== undefined) {
      where.country = {
        [Op.like]: `%${value.country}%`
      };
    }

    const include: Includeable[] = [
      {
        model: User.model,
        where: {
          id: user.id
        },
        required: true
      }
    ];

    const order: Order = [
      ['added_at', 'DESC']
    ];

    const result = await Invoice.model.findAndCountAll({
      where,
      include,
      order,
      limit,
      offset
    });

    const response = new MongoResponse();

    response.response = result.rows.map(item => new Invoice(item).toObjectResponse());

    response.total = result.count;

    return response;
  }

  public toObjectMySQL() {
    const value: Partial<IInvoice> = {};

    const properties = ['id', 'to', 'city', 'country', 'user', 'added_at'];

    properties.forEach(item => {
      if (this[item] !== undefined) value[item] = this[item];
    });

    return value;
  }
}
