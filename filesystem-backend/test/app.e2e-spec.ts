import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return API root message', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(res => {
        expect(res.body).toEqual({
          message: 'Filesystem API is running',
          endpoint: '/filesystem?path=/host',
        });
      });
  });

  afterEach(async () => {
    await app.close();
  });
});