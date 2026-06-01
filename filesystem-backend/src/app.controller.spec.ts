import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return API root message', () => {
    expect(controller.getRoot()).toEqual({
      message: 'Filesystem API is running',
      endpoint: '/filesystem?path=/host',
    });
  });
});

function expect(controller: AppController) {
  throw new Error('Function not implemented.');
}
