import { Injectable } from '@nestjs/common';
import { InjectAwsService } from 'nest-aws-sdk';
import { SNS } from 'aws-sdk';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class SnsService {
  constructor(
    @InjectAwsService(SNS) private readonly sns: SNS,
    private readonly s3Service: S3Service,
  ) {}

  private replacePlaceholders(
    template: string,
    replacements: { [key: string]: string },
  ): string {
    return template.replace(/{{(\w+)}}/g, (_, key) => replacements[key] || '');
  }

  async sendEmail(
    replacements: { [key: string]: string },
    email: string,
  ): Promise<void> {
    const template = await this.s3Service.loadTemplateFromS3(); // 경로를 실제 경로로 대체
    const subject = this.replacePlaceholders(template.subject, replacements);
    const body = this.replacePlaceholders(template.body, replacements);

    console.log(`process.env.SNS_TOPIC_ARN  : ${process.env.SNS_TOPIC_ARN}`)

    const params = {
      Subject: subject,
      Message: body,
      TopicArn: process.env.SNS_TOPIC_ARN,
    };

    try {
      await this.sns.publish(params).promise();
      console.log(`Email sent successfully to ${email}`);
    } catch (error) {
      console.error(
        `Failed to send email to ${email}. Error: ${error.message}`,
      );
      throw new Error(
        `Failed to send email to ${email}. Error: ${error.message}`,
      );
    }
  }
}
