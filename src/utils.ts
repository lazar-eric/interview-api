import { AmauiDate, duration } from '@amaui/date';

import config from 'config';
import { IRequest } from 'types';

export const requestDuration = (req: IRequest): string => {
  // Initially set on request start duration
  const start = req.duration?.start;

  if (!start) return console.error('Request duration log', 'no start') as any;

  const end = AmauiDate.milliseconds;

  const value = end - start;

  // Slow request log
  // maybe have time values per routes
  if (value > config.value.log.request.slow) {
    console.log('!@ Request duration', duration(value), value);

    // Maybe report in Sentry or whatnot as well here
  }

  return duration(value);
};
