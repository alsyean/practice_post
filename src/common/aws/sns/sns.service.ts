import { Injectable } from '@nestjs/common';
import { InjectAwsService } from 'nest-aws-sdk';
import { SNS } from 'aws-sdk';
import { S3Service } from '../s3/s3.service';
import { v4 as uuidv4 } from 'uuid'; // UUID 라이브러리 사용

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

    const params = {
      Subject: subject,
      Message: body,
      TopicArn: process.env.SNS_TOPIC_ARN,
      MessageAttributes: {
        'AWS.SNS.SMS.SenderID': {
          DataType: 'String',
          StringValue: 'VerifyCode',
        },
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: 'Transactional',
        },
        'AWS.SNS.SMS.MaxPrice': {
          DataType: 'Number',
          StringValue: '0.50',
        },
      },
      MessageGroupId: 'register_verification_code', // FIFO 큐의 메시지 그룹 ID
      MessageDeduplicationId: new Date().toISOString() + uuidv4(), // 메시지 중복 제거를 위한 ID
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
