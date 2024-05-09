import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerHelper } from './swagger/indext';
import { PostModule } from './post/post.module';
import { UsersModule } from './users/users.module';
import { loadPackage } from '@nestjs/common/utils/load-package.util';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

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

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT);
}

bootstrap();
