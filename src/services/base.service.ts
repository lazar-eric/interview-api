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
    return;
  }

  public async get(req: IRequest): Promise<IModel> {
    // const {

    // } = req;

    // const id = req.params.id;

    // const query = {
    //   // regional
    //   country: organization.country,

    //   _id: this.ID(id),

    //   'organization.id': organization._id
    // };

    // const response: any = await this.Models.findOne(query);

    // if (!response) throw new ValidationError(`${this.name} not found`);

    // return response;

    return;
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
