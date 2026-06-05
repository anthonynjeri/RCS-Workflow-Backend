import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import ValidationPipeOptionsConfig from './_utils/config/validation-pipe-options.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import SwaggerCustomOptionsConfig from './_utils/config/swagger-custom-options.config';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables, ServerConfig } from './_utils/config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app
    .setGlobalPrefix('Rcs-Workflow-Backend-API')
    .useGlobalPipes(new ValidationPipe(ValidationPipeOptionsConfig))
    .enableCors();

  const config = new DocumentBuilder()
    .setTitle('rcs-workflow-backend-api')
    .setDescription('RCS Workflow Backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, SwaggerCustomOptionsConfig);

  const configService = app.get(ConfigService<EnvironmentVariables, true>);

  return app.listen(configService.get<ServerConfig>('SERVER').PORT);
}
bootstrap();
