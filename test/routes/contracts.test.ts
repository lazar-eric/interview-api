import { IAmauiTestRequest, assert, request } from '@amaui/test';

import { app } from 'index';
import { mysql } from 'databases';

group('Contracts', () => {
  let api: IAmauiTestRequest;

  pre(async () => {
    api = await request(app, { keepOpen: true });

    // Start mysql
    await mysql.connection();
  });

  to('add validation', async () => {
    const result = await api.post(`/contracts`, {
      body: {
        "date": 1701895962,
        "reviewed": true,
        "signature": "asd",
        "user": 1
      }
    });

    const response = result.value.response;

    assert(response.meta.status).eq(400);
    assert(response.meta.message).eq('Name is required');
  });

  to('add success', async () => {
    const result = await api.post(`/contracts`, {
      body: {
        "name": "C1",
        "date": 1701895962,
        "reviewed": true,
        "signature": "asd",
        "user": 1
      }
    });

    const response = result.value.response;

    assert(response.meta.status).eq(201);
    assert(response.response.name).eq('C1');
  });

  to('query', async () => {
    const result = await api.get(`/contracts/query`);

    const response = result.value.response;

    assert(response.response.length).eq(1);
    assert(response.meta.status).eq(200);
  });

});
