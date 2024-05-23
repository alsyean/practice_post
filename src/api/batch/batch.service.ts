import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SqsService } from '../../common/aws/sqs/sqs.service';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BatchService {
  constructor(private readonly sqsService: SqsService) {}
  private readonly logger = new Logger(BatchService.name);

  @Cron(CronExpression.EVERY_5_SECONDS, {
    name: 'batchUserPasswordExpired',
  })
  async batchUserPasswordExpired() {
    const message = {
      id: uuidv4(),
      body: 'handleUserPasswordExpired',
      timestamp: moment().utc().format(),
    };
    const res = await this.sqsService.sendMessage('batchJob', message);
    this.logger.verbose(
      { res },
      `[batch,${BatchService.name},batchUserPasswordExpired]`,
    );
    return res;
  }
}
