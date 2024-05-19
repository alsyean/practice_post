import { Injectable } from '@nestjs/common';
import { InjectAwsService } from 'nest-aws-sdk';
import { SQS } from 'aws-sdk';

@Injectable()
export class SqsService {
  constructor(@InjectAwsService(SQS) private readonly sqs: SQS) {}

  async sendMessage(queueUrl: string, messageBody: string): Promise<void> {
    const params = {
      QueueUrl: queueUrl,
      MessageBody: messageBody,
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
