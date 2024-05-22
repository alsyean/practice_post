import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../../../auth/auth.module';
import { UserEntity } from '../../../entities/users.entity';
import { AwsModule } from '../../../common/aws/aws.module';
import { EmailModule } from "../../../common/email/email.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => AuthModule), // 순환 종속성 해결을 위해 forwardRef 사용
    AwsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
