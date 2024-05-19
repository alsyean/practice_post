import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AppConfigService {
  private readonly s3: AWS.S3;
  private readonly transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      region: this.configService.get<string>('AWS_REGION'),
    });
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  get awsS3(): AWS.S3 {
    return this.s3;
  }

  get awsS3BucketName(): string {
    return this.configService.get<string>('AWS_S3_BUCKET_NAME');
  }

  get transPorter() {
    return this.transporter;
  }
}
