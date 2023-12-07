import { getObjectValue } from '@amaui/utils';

import { INext, IRequest, IResponse } from 'types';
import { requestDuration } from 'utils';
import config from 'config';

export class BaseRoute {

  public response(
    req: IRequest,
    res: IResponse,
    next: INext
  ) {
    return async (
      response: any
    ) => {
      // Done
      this.done(req);

      return res
        .status(getObjectValue(response, 'meta.code') || 200)
        .type('application/json')
        .json(response);
    }
  }

  public error(
    req: IRequest,
    res: IResponse,
    next: INext
  ) {
    return async (
      error: Error
    ) => {
      // Done
      this.done(req);

      return next(error);
    }
  }

  protected done(
    req: IRequest
  ) {
    const duration = requestDuration(req);

    const test = config.value.env === 'test';

    if (!test) console.debug('Done', req.id, duration);
  }

}
