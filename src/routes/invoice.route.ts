import { Route, Get, Post } from '@amaui/api';
import { Response } from '@amaui/models';

import { BaseRoute } from './base.route';
import { InvoiceService } from 'services';
import { authenticate } from 'middleware';
import { IRequest } from 'types';

@Route(
  '/invoices',
  authenticate
)
export default class PostRoute extends BaseRoute {

  @Get(
    '/query'
    //  permission(['invoice_read'])
  )
  public async query(req: IRequest) {
    const response = await InvoiceService.query(req);

    return Response.fromQuery(response);
  }

  @Post(
    '/query'
    // permission(['invoice_read'])
  )
  public async queryPost(req: IRequest) {
    const response = await InvoiceService.query(req);

    return Response.fromQuery(response);
  }

}
