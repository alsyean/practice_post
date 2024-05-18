import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class AppConfigService {
  private readonly s3: AWS.S3;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  get awsS3(): AWS.S3 {
    return this.s3;
  }

  get awsS3BucketName(): string {
    return this.configService.get<string>('AWS_S3_BUCKET_NAME');
  }
}
