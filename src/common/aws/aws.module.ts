import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigService } from '../config/config.service';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
@Module({
  imports: [
    ConfigModule,
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
      services: [S3],
    }),
  ],
  // AppConfigService는 nest-aws-sdk를 사용 안 하고 aws-sdk만 사용 할 경우
  providers: [S3Service, AppConfigService],
  exports: [S3Service],
})
export class AwsModule {}
