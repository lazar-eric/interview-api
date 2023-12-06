import { getID, castParam } from '@amaui/utils';
import { AmauiDate } from '@amaui/date';

import { INext, IRequest, IResponse } from '../types';

const method = async (req: IRequest, res: IResponse, next: INext) => {
  try {
    // Start of the request
    req.id = getID();

    req.duration = { start: AmauiDate.milliseconds };

    console.debug('Start', req.id, req.method, req.originalUrl);

    // Cast params
    try {
      // Params
      Object.keys(req.params).forEach(key => req.params[key] = castParam(req.params[key]));

      // Query
      Object.keys(req.query).forEach(key => req.query[key] = castParam(req.query[key]));
    }
    catch (error) {
      console.error(error);
    }

    return next();
  }
  catch (error) {
    next(error);
  }
};

export default method;
