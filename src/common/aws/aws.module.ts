import { forwardRef, Module } from '@nestjs/common';
import { S3Service } from './s3/s3.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigService } from '../config/config.service';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3, SQS, SNS } from 'aws-sdk';
import { SqsService } from './sqs/sqs.service';
import { SnsService } from './sns/sns.service';
import { SqsConsumerService } from './sqs/sqs-consumer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/users.entity';
import { UsersModule } from '../../api/v1/users/users.module';
import { SqsModule } from '@ssut/nestjs-sqs';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => UsersModule), // 순환 종속성 해결을 위해 forwardRef 사용
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        useFactory: (configService: ConfigService) => {
          return {
            region: configService.get<string>('AWS_REGION'),
            // IAM 등록 되어 있거나 Local에 등록되어 있으면 credentials skip
            // credentials: {
            //   accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
            //   secretAccessKey: configService.get<string>(
            //     'AWS_SECRET_ACCESS_KEY',
            //   ),
            // },
          };
        },
        imports: [ConfigModule],
        inject: [ConfigService],

      },
      services: [S3, SQS, SNS],
    }),
    SqsModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          consumers: [
            {
              name: 'batchJob',
              queueUrl: configService.get('SQS_URL'),
              region: configService.get('AWS_REGION'),
            },
          ],
          producers: [
            {
              name: 'batchJob',
              queueUrl: configService.get('SQS_URL'),
              region: configService.get('AWS_REGION'),
            },
          ],
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  // AppConfigService는 nest-aws-sdk를 사용 안 하고 aws-sdk만 사용 할 경우
  providers: [
    S3Service,
    AppConfigService,
    SqsService,
    SnsService,
    SqsConsumerService,
  ],
  exports: [S3Service, SnsService, SqsService],
})
export class AwsModule {}
