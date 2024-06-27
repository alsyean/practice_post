import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './api/v1/users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './api/v1/post/post.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { RequestLoggerMiddleware } from './common/middlewares/logger.middleware';
import { S3Service } from './common/aws/s3/s3.service';
import { AwsModule } from './common/aws/aws.module';
import { AppConfigModule } from './common/config/config.module';
import { EmailService } from './common/email/email.service';
import { EmailModule } from './common/email/email.module';
import { BatchService } from './api/batch/batch.service';
import { BatchModule } from './api/batch/batch.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true, // 이 옵션을 설정하면 모듈을 전역적으로 사용할 수 있습니다.
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, 'common', 'uploads'),
      serveRoot: '/static',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/**.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV === 'development' ? true : false,
    }),
    UsersModule,
    AuthModule,
    PostModule,
    AwsModule,
    AppConfigModule,
    EmailModule,
    BatchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
