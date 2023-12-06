import { Response, ResponseMeta } from '@amaui/models';
import { AmauiError } from '@amaui/errors';

import { INext, IRequest, IResponse } from '../types';

const method = async (value: AmauiError, req: IRequest, res: IResponse, next: INext) => {
  let status: number = value.status;
  let message = value.message;

  if (!status) {
    switch (value.name) {
      case 'AmauiError':
      case 'AmauiTestError':
      case 'AssertError':
      case 'ValidationError':
      case 'NotFoundError':
        status = 400;
        break;

      case 'AuthenticationError':
        status = 401;
        break;

      case 'AuthorizationError':
      case 'PermissionError':
        status = 403;
        break;

      case 'AmauiAmqpError':
      case 'AmauiAwsError':
      case 'AmauiMongoError':
      case 'ConnectionError':
      case 'DeveloperError':
        status = 500;
        break;

      default:
        status = 500;
    }
  }

  if (status >= 500) {
    // Todo
    // use sentry for important logs
    // and post to the slack channel for it
    console.error(`Error middleware`, message);

    // Hide error from the user
    message = `Error occured`;
  }

  return res.status(status).json(Response.fromAny(undefined, new ResponseMeta(status, message)));
};

export default method;
