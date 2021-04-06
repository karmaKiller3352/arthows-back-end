import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';

import { ExceptionsFilter } from './validators/exceptions.filter';
import { AppModule } from './app.module';

const port = process.env.SERVER_PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(process.env.API);
  app.use(express.static(process.env.STATIC_FILES_FOLDER));
  app.use('upload', express.static(process.env.UPLOAD_PATH));
  app.use(cookieParser());
  app.useGlobalFilters(new ExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Arthows API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  Logger.log(`Server running on ${port}`);
}
bootstrap();
