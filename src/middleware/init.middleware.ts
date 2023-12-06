

import { AuthenticationError, DeveloperError } from '@amaui/errors';

import { INext, IRequest, IResponse } from '../types';

const method = async (req: IRequest, res: IResponse, next: INext) => {
  try {
    const token = (req.headers.authorization || req.query.company_token as string);

    // FYI
    // for the sake of quick example implanting dummy user
    // in reality of couse here we would validate the token
    // get the user, organization... validate that they exist and are active etc.

    // Only if there's a token
    if (token) {
      // Verify the token
      // const value = verify(token, !!req.headers.authorization) as any;

      // dummy
      const user = {
        id: 1,
        name: 'Lazar Eric',
        email: 'lazareric2@gmail.com',
        active: true
      };

      // request
      // user
      req.user = user;

      // organization
      // req.organization = organization;
    }

    return next();
  }
  catch (error) {
    next(error);
  }
};

export default method;
