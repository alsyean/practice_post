import { Injectable } from '@nestjs/common';
import { InjectAwsService } from 'nest-aws-sdk';
import { SQS } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid'; // UUID 라이브러리 사용

@Injectable()
export class SqsService {
  constructor(@InjectAwsService(SQS) private readonly sqs: SQS) {}

  async sendMessage(messageBody: string): Promise<void> {
    const queueUrl = process.env.SQS_URL;
    const params = {
      QueueUrl: queueUrl,
      MessageBody: messageBody,
      MessageGroupId: 'register_verification_code', // FIFO 큐의 메시지 그룹 ID
      MessageDeduplicationId: new Date().toISOString() + uuidv4(), // 메시지 중복 제거를 위한 ID
    };

    try {
      await this.sqs.sendMessage(params).promise();
      console.log(`Message sent successfully to ${queueUrl}`);
    } catch (error) {
      console.error(
        `Failed to send message to ${queueUrl}. Error: ${error.message}`,
      );
      throw new Error(
        `Failed to send message to ${queueUrl}. Error: ${error.message}`,
      );
    }
  }
}
