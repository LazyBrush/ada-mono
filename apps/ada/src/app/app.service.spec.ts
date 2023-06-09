import { Test } from '@nestjs/testing';

import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('getData', () => {
    it('should return "Welcome to ada!"', () => {
      expect(service.getData()).toEqual({ message: 'Welcome to ada!' });
    });
  });

  describe('someOtherFunc', () => {
    it('should return "Other message"', () => {
      expect(service.someOtherFunc()).toEqual({ message: 'Other message' });
    });
  });
});
