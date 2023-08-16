import { LoggerMiddleware } from './logger.middleware';

describe('UsersMiddleware', () => {
  it('should be defined', () => {
    expect(new LoggerMiddleware()).toBeDefined();
  });
});
