import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerHelper } from './swagger/indext';
import { PostModule } from './api/v1/post/post.module';
import { UsersModule } from './api/v1/users/users.module';
import { SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import * as path from 'path';
import { HttpExceptionFilter } from './common/exceptions/http-Exception.filter';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

class Application {
  private logger = new Logger(Application.name);
  private readonly DEV_MODE: boolean;
  private readonly PORT: string;
  private readonly corsOriginList: string[];

  constructor(private readonly server: NestExpressApplication) {
    this.server = server;

    if (!process.env.JWT_SECRET) this.logger.error('Set "SECRET" env');
    this.DEV_MODE = process.env.NODE_ENV === 'production' ? false : true;
    this.PORT = process.env.PORT || '8000';
    this.corsOriginList = process.env.CORS_ORIGIN_LIST
      ? process.env.CORS_ORIGIN_LIST.split(',').map((origin) => origin.trim())
      : ['*'];
  }

  private setUpOpenAPIMiddleware() {
    const swaggerHelper = new SwaggerHelper();
    swaggerHelper.setApp(this.server);

    const postDocument = swaggerHelper.getBoardSwaggerDocument({
      include: [PostModule],
      deepScanRoutes: true,
    });
    const userDocument = swaggerHelper.getUserSwaggerDocument({
      include: [UsersModule],
      deepScanRoutes: true,
    });

    SwaggerModule.setup('api/posts/docs', this.server, postDocument);
    SwaggerModule.setup('api/users/docs', this.server, userDocument);
  }

  private async setUpGlobalMiddleware() {
    this.server.enableCors({
      origin: this.corsOriginList,
      credentials: true,
    });

    this.setUpOpenAPIMiddleware();
    this.server.useStaticAssets(path.join(__dirname, './common', 'uploads'), {
      prefix: '/static',
    });
    this.server.useGlobalPipes(new ValidationPipe());
    // this.server.useGlobalInterceptors(new ResponseInterceptor());
    this.server.useGlobalFilters(new HttpExceptionFilter());
  }

  async bootstrap() {
    await this.setUpGlobalMiddleware();
    await this.server.listen(this.PORT);
  }

  startLog() {
    if (this.DEV_MODE) {
      this.logger.log(
        `✅ Server on http://localhost:${this.PORT} && env : ${process.env.NODE_ENV}`,
      );
    } else {
      this.logger.log(`✅ Server on port ${this.PORT}...`);
    }
  }

  errorLog(error: string) {
    this.logger.error(`🆘 Server error ${error}`);
  }
}

async function loadEnvFile() {
  const envKey = `${process.env.NODE_ENV}/.env.${process.env.NODE_ENV}`; // S3에 저장된 .env 파일의 경로
  if (process.env.NODE_ENV === 'production') {
    const s3 = new AWS.S3();

    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const params = {
      Bucket: bucketName,
      Key: envKey,
    };

    try {
      const data = await s3.getObject(params).promise();
      fs.writeFileSync('.env', data.Body.toString());
      dotenv.config({ path: '.env' });
    } catch (error) {
      new Logger('init').error('Error downloading .env file from S3:', error);
      throw error;
    }
  } else {
    dotenv.config({ path: envKey });
  }
}

async function init(): Promise<void> {
  await loadEnvFile();

  const server = await NestFactory.create<NestExpressApplication>(AppModule);
  const app = new Application(server);
  await app.bootstrap();
  app.startLog();
}

init().catch((error) => {
  new Logger('init').error(error);
});
