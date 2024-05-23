import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BatchService } from './batch.service';
import { AwsModule } from '../../common/aws/aws.module';

@Module({
  imports: [ScheduleModule.forRoot(), AwsModule],
  providers: [BatchService],
})
export class BatchModule {}
