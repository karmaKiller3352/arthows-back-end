import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import { ExceptionsFilter } from './validators/exceptions.filter';
import { AppModule } from './app.module';

const port = process.env.SERVER_PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.use(cookieParser());
  app.useGlobalFilters(new ExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
  Logger.log(`Server running on ${port}`);
}
bootstrap();
