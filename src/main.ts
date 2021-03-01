import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import { ExceptionsFilter } from './validators/exceptions.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalFilters(new ExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
