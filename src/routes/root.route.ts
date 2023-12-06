import { Get, Route } from '@amaui/api';
import { Response } from '@amaui/models';

import { BaseRoute } from './base.route';

@Route(
  ''
)
export default class RootRoute extends BaseRoute {

  @Get(
    '/'
  )
  public async root() {
    return Response.fromAny('Okay');
  }

  @Get(
    '/health'
  )
  public async health() {
    return Response.fromAny('Okay');
  }

}
