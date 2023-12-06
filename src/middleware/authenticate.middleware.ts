import { AuthenticationError } from '@amaui/errors';

import { INext, IRequest, IResponse } from '../types';

const method = async (req: IRequest, res: IResponse, next: INext) => {
  try {
    const {
      user
    } = req;

    if (!(
      user
    )) throw new AuthenticationError('Unauthenticated');

    return next();
  }
  catch (error) {
    next(error);
  }
};

export default method;
