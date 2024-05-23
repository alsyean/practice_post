import { Injectable, Logger } from '@nestjs/common';
import { SqsService as NestSqsService } from '@ssut/nestjs-sqs';

@Injectable()
export class SqsService {
  constructor(private readonly sqsService: NestSqsService) {}

  private readonly logger = new Logger(SqsService.name);

  async sendMessage(queueName, params: any) {

    try {
      this.logger.verbose(
        { queueName, params },
        `[batch,queue,${SqsService.name},sendMessage]`,
      );

      const res = await this.sqsService.send(queueName, params);
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
