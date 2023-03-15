import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Welcome to ada!' };
  }

  someOtherFunc(): { message: string } {
    return { message: 'Other message' };
  }
}
