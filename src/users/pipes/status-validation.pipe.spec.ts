import { UserStatusValidationPipe } from './status-validation.pipe';
import { BadRequestException } from '@nestjs/common';

describe('UserStatusValidationPipe', () => {
  let pipe: UserStatusValidationPipe;

  beforeEach(() => {
    pipe = new UserStatusValidationPipe();
  });

  it('should return value if status is valid', () => {
    const value = { status: 'DONE' };
    expect(pipe.transform(value)).toBe(value);
  });

  it('should throw error if status is invalid', () => {
    const value = { status: 'INVALID' };
    expect(() => pipe.transform(value)).toThrow(BadRequestException);
  });

  it('should validate status correctly', () => {
    expect(pipe.isValidStatus('DONE')).toBe(true);
    expect(pipe.isValidStatus('INVALID')).toBe(false);
  });
});
