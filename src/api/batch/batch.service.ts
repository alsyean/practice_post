import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SqsService } from '../../common/aws/sqs/sqs.service';

@Injectable()
export class BatchService {
  constructor(private readonly sqsService: SqsService) {}
  private readonly logger = new Logger(BatchService.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'batchUserPasswordExpired',
  })
  async batchUserPasswordExpired() {
    const res = await this.sqsService.sendMessage(
      'batchUserPasswordExpired',
      '',
    );
    this.logger.verbose(
      { res },
      `[batch,${BatchService.name},handleTvCertCode]`,
    );
    return res;
  }
}
