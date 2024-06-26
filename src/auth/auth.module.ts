import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UsersModule } from '../api/v1/users/users.module';
import { AwsModule } from '../common/aws/aws.module';
import { EmailModule } from '../common/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationEntity } from '../entities/verification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([VerificationEntity]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1y' },
    }),
    forwardRef(() => UsersModule), // 순환 종속성 해결을 위해 forwardRef 사용
    AwsModule,
    EmailModule,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
