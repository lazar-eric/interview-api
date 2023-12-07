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
    return this.Model.query(req);
  }

}

export default BaseService;
