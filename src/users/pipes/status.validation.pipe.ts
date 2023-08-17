import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class UserStatusValidationPipe implements PipeTransform {
  readonly statuses = ['DONE', 'IN-PROGRESS', 'DONE'];
  transform(value: any) {
    console.log(value);
    if (this.isValidStatus(value.status)) {
      return value;
    }
    throw new BadRequestException('status is not valid');
  }

  isValidStatus(status: string) {
    const idx = this.statuses.indexOf(status);
    return idx !== -1;
  }
}
