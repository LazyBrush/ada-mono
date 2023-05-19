import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, lastValueFrom } from 'rxjs';

const classifierEndpoint =
  process.env.CLASSIFIER_ENDPOINT || 'http://calssifier:3002/';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly httpService: HttpService) {
    this.logger.log(`Configured with endpoint: ${classifierEndpoint}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async demo1(): Promise<any> {
    this.logger.log(`Using: ${classifierEndpoint}`);
    const resp = await lastValueFrom(
      this.httpService
        .post(classifierEndpoint, {
          array: [1, 2, 3, 4],
          name: 'demo1',
        })
        .pipe(
          map((response) => {
            return response.data;
          })
        )
    );
    return resp;
  }

  someOtherFunc(): { message: string } {
    return { message: 'Other message' };
  }
}
