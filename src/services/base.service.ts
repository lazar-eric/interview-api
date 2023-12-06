import { ValidationError } from '@amaui/errors';
import { IMongoResponse } from '@amaui/models';

import { IRequest } from 'types';

export class BaseService<IModel> {

  public constructor(
    public Model: any,
    public table: string,
    public name: string
  ) { }

  public async add(req: IRequest): Promise<IModel> {
    // Todo
    // validate usage limits
    // for writes, or whatever
    const invoice = new this.Model(req.body);

    return invoice.add(req);
  }

  public async query(req: IRequest): Promise<IMongoResponse> {
    // const query = Query.fromRequest(req);

    // query.query = await this.Model.query(query.query, req);

    // query.sort = await this.Model.sort(query.sort, req);

    // const response = await this.Models.searchMany(query, { options: this.options, lookups: this.lookups });

    // return response;

    return;
  }

}

export default BaseService;
