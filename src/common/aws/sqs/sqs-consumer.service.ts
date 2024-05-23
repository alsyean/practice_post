import { Injectable, Logger } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';

@Injectable()
export class SqsConsumerService {
  
  private readonly logger = new Logger(SqsConsumerService.name);

  @SqsMessageHandler('batchJob', false)
  async batchMessage() {
    try {
    } catch (e) {}
  }
}
