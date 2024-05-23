import { HttpException, Injectable, Logger } from "@nestjs/common";
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import moment from "moment";
import { Repository } from "typeorm";
import { UserEntity } from "../../../entities/users.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class SqsConsumerService {
  private readonly logger = new Logger(SqsConsumerService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @SqsMessageHandler('batchJob', false)
  async batchMessage(message: AWS.SQS.Message) {
    this.logger.verbose(`[${SqsConsumerService.name}] Batch Start`);
    this.logger.verbose(
      `[${SqsConsumerService.name}] Batch Body ${message.Body}`,
    );

    try {
      if (message.Body === 'batchUserPasswordExpired') {
        this.handleUserPasswordExpired();
      } else {
        this.logger.warn(`Unknown message body: ${message.Body}`);
      }
    } catch (e) {}
  }

  async handleUserPasswordExpired() {
    const privacy = await this.userRepository.find();
    this.logger.verbose(privacy);
  }
}
