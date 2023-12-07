import { IAmauiTestRequest, assert, request } from '@amaui/test';

import { app } from 'index';
import { mysql } from 'databases';

group('Invoices', () => {
  let api: IAmauiTestRequest;

  pre(async () => {
    api = await request(app, { keepOpen: true });

    // Start mysql
    await mysql.connection();
  });

  to('query', async () => {
    const result = await api.get(`/invoices/query`);

    const response = result.value.response;

    assert(response.response.length).eq(4);
    assert(response.meta.status).eq(200);
  });

});
