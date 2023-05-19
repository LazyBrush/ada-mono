import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { InputDTO } from './input.dto';

@ApiTags('Classifer')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  classify(@Body() input: InputDTO) {
    return this.appService.classify(input);
  }
}
