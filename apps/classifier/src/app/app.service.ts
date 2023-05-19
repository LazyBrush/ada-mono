import { Injectable } from '@nestjs/common';
import { InputDTO } from './input.dto';

export type ClassifyType = {
  message: string;
  length: number;
  name: string;
};

@Injectable()
export class AppService {
  classify(input: InputDTO): ClassifyType {
    const length = input.array.length;
    const name = input.name;
    return { message: 'classifed ok', length, name };
  }
}
