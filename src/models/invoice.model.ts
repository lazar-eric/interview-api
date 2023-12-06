import { DataTypes, Op, Order, WhereOptions } from 'sequelize';

import { Query } from '@amaui/models';
import { AmauiDate } from '@amaui/date';

import BaseModel from './base.model';
import { mysql } from 'databases';
import { IRequest } from 'types';

export interface IInvoice {
  id: number;
  to: string;
  city: string;
  country: string;
  user: number;
  added_at: number;

  [p: string]: any;
}

export const InvoiceModel = mysql.sequelize.define('invoice', {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },

  to: {
    type: DataTypes.STRING(1500),
    allowNull: false
  },

  city: {
    type: DataTypes.STRING(500)
  },

  country: {
    type: DataTypes.STRING(500)
  },

  user: {
    type: DataTypes.INTEGER,
    allowNull: false,

    references: {
      model: 'users',
      key: 'id'
    }
  },

  added_at: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: () => AmauiDate.unix
  }
});

export default class Invoice extends BaseModel implements Partial<IInvoice> {
  public model = InvoiceModel;
  public id: number;
  public to: string;
  public city: string;
  public country: string;
  public user: number;
  public added_at: number;

  public static model = InvoiceModel;

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
    const response = await this.model.create(this.toObjectMySQL());

    return response;
  }

  public async query(req: IRequest) {
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

    const order: Order = [
      ['added_at', 'DESC']
    ];

    const response = await this.model.findAndCountAll({
      where,
      order,
      limit,
      offset
    });

    return response;
  }

  public toObjectMySQL() {
    const value: Partial<IInvoice> = {};

    const properties = ['id', 'to', 'city', 'country', 'added_at'];

    properties.forEach(item => {
      if (this[item] !== undefined) value[item] = this[item];
    });

    return value;
  }
}
