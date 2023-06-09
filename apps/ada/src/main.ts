/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import otelSDK from './tracing';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

import { version } from '../../../package.json';
import { name } from '../project.json';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  await otelSDK.start();

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Ada Demo')
    .setDescription('Ada the catface')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // const globalPrefix = 'api';
  // app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 Application ${name}:${version} is running on: http://localhost:${port}/`
  );
}

bootstrap();
