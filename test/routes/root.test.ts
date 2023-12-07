import { IAmauiTestRequest, assert, request } from '@amaui/test';

import { app } from 'index';

group('Root', () => {
  let server: IAmauiTestRequest;

  pre(async () => {
    server = await request(app, { keepOpen: true });
  });

  to('/', async () => {
    const result = await server.get(`/`);

    assert(result.value.response).eql({ response: 'Okay', meta: { status: 200 } });
  });

  to('/health', async () => {
    const result = await server.get(`/`);

    assert(result.value.response).eql({ response: 'Okay', meta: { status: 200 } });
  });

});
