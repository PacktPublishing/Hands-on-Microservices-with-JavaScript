import { INestApplication } from '@nestjs/common';
import { testConfiguration } from './test-configuration';
import * as request from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await testConfiguration();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  
  afterAll(async () => {
    await app.close();
  });

  it('/transactions (POST) should create a transaction', async () => {
    const createTransactionDto = {
      accountId: '6658ae5284432e40604018d5', // UUID
      description: 'Test transaction',
    };

    return request(app.getHttpServer())
      .post('/transaction')
      .send(createTransactionDto)
      .expect(400);
  }, 10000); 
});

