import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerHelper } from './swagger/indext';
import { PostModule } from './api/v1/post/post.module';
import { UsersModule } from './api/v1/users/users.module';
import { SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import * as path from 'path';
import { HttpExceptionFilter } from './common/exceptions/http-Exception.filter';

async function bootstrap() {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const swaggerHelper = new SwaggerHelper();
  swaggerHelper.setApp(app);

  const postDocument = swaggerHelper.getBoardSwaggerDocument({
    include: [PostModule],
    deepScanRoutes: true,
  });
  const userDocument = swaggerHelper.getUserSwaggerDocument({
    include: [UsersModule],
    deepScanRoutes: true,
  });

  SwaggerModule.setup('api/posts/docs', app, postDocument);
  SwaggerModule.setup('api/users/docs', app, userDocument);

  app.useStaticAssets(path.join(__dirname, './common', 'uploads'), {
    prefix: '/static',
  });
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT);
}

bootstrap();
