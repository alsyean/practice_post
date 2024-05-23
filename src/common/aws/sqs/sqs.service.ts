import { Injectable, Logger } from "@nestjs/common";
import { InjectAwsService } from 'nest-aws-sdk';
import { SQS } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@aws-sdk/client-sqs';

@Injectable()
export class SqsService {
  public readonly queueUrl: string;
  constructor(@InjectAwsService(SQS) readonly sqs: SQS) {
    this.queueUrl = process.env.SQS_URL;
  }

  private readonly logger = new Logger(SqsService.name);

  async sendMessage(queueName, message: string) {
    const params = {
      QueueUrl: queueName,
      MessageBody: message,
    };

    try {
      this.logger.verbose(
        { queueName, params },
        `[batch,queue,${SqsService.name},sendMessage]`,
      );
      const res = await this.sqs.sendMessage(params).promise();
      this.logger.log(`Message sent successfully to ${queueName}`);
      return res;
    } catch (error) {
      this.logger.error(
        `Failed to send message to ${queueName}. Error: ${error.message}`,
      );
      throw new Error(
        `Failed to send message to ${queueName}. Error: ${error.message}`,
      );
    }
  }
}
