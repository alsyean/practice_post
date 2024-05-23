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
    try {
      if (message.Body === 'batchJob') {
        this.handleUserPasswordExpired();
      }
    } catch (e) {}
  }

  async handleUserPasswordExpired() {
    const privacy = await this.userRepository.find();
    this.logger.verbose(privacy);
  }
}
