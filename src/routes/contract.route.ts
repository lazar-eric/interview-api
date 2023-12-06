import { Route, Get, Post, validate } from '@amaui/api';
import { Response } from '@amaui/models';

import { BaseRoute } from './base.route';
import validations from 'validations';
import { ContractService } from 'services';
import { authenticate } from 'middleware';
import { IRequest } from 'types';

@Route(
  '/contracts',
  authenticate
)
export default class PostRoute extends BaseRoute {

  @Post(
    '/',
    // permission(['contract_write']),
    validate(validations.contract('add'))
  )
  public async add(req: IRequest) {
    const response = await ContractService.add(req);

    return Response.fromAdded(response);
  }

  @Get(
    '/query'
    //  permission(['contract_read'])
  )
  public async query(req: IRequest) {
    const response = await ContractService.query(req);

    return Response.fromQuery(response);
  }

  @Post(
    '/query'
    // permission(['contract_read'])
  )
  public async queryPost(req: IRequest) {
    const response = await ContractService.query(req);

    return Response.fromQuery(response);
  }


  @Get(
    '/:id'
    // permission(['contract_read'])
  )
  public async get(req: IRequest) {
    const response = await ContractService.get(req);

    return Response.fromObject(response);
  }

}
