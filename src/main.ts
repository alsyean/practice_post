import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerHelper } from './swagger/indext';
import { PostModule } from './post/post.module';
import { UsersModule } from './users/users.module';
import { loadPackage } from '@nestjs/common/utils/load-package.util';

async function bootstrap() {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const swaggerHelper = new SwaggerHelper();
  swaggerHelper.setApp(app);

  const { document: PostV1Doc } = swaggerHelper.getBoardSwaggerDocument({
    include: [PostModule],
    deepScanRoutes: true,
  });
  const { document: UserV1Doc } = swaggerHelper.getUserSwaggerDocument({
    include: [UsersModule],
    deepScanRoutes: true,
  });

  const swaggerUi = loadPackage('swagger-ui-express', 'SwaggerModule', () =>
    require('swagger-ui-express'),
  );
  // app.use(swaggerHelper.getPostApi(), swaggerUi.serveFiles(PostV1Doc, {}));
  app.use(
    swaggerHelper.getPostApi(),
    swaggerUi.serve,
    swaggerUi.setup(PostV1Doc),
  );
  app.use(swaggerHelper.getUserApi(), swaggerUi.serveFiles(UserV1Doc, {}));

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT);
}

bootstrap();
