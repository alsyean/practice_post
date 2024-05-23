import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { UsersRepository } from '../users/users.repository';
import * as bcrypt from 'bcrypt';
import { LoginRequestDto } from './dto/LoginRequestDto';
import { UsersService } from '../api/v1/users/users.service';
import { EmailService } from '../common/email/email.service';
import { S3Service } from '../common/aws/s3/s3.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationEntity } from '../entities/verification.entity';
import { UserEntity } from '../entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @InjectRepository(VerificationEntity)
    private verificationRepository: Repository<VerificationEntity>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly s3Service: S3Service,
  ) {}

  private verificationCodes: Map<string, { code: string; expires: number }> =
    new Map();

  async jwtLogin(data: LoginRequestDto) {
    const { email, password } = data;
    const users = await this.findUsersInfo(email);

    if (!users) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인 해주세요.');
    }

    if (users.user.wrong_login_cnt >= 5) {
      throw new UnauthorizedException(
        '로그인 실패 5번 이상 비밀번호 재설정 요망',
      );
    }

    const isValidPassword = await bcrypt.compare(password, users.user.password);

    if (!isValidPassword) {
      users.user.wrong_login_cnt += 1;
      await this.usersService.updateUser(users.user);
      throw new UnauthorizedException('비밀번호가 일치 하지 않습니다.');
    }

    const payload = { email: email, sub: users.user.id };

    return {
      token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }),
    };
  }

  async findUsersInfo(email: string) {
    const queryBuilder = this.verificationRepository.createQueryBuilder('v');

    queryBuilder
      .leftJoinAndSelect('v.user', 'u')
      .select(['v.isUse', 'v.expire_date', 'v.code']) // user에서 username과 email만 선택
      .addSelect(['u.id', 'u.email', 'u.password', 'u.wrong_login_cnt'])
      .where('u.email = :email', { email })
      .orderBy('v.id', 'DESC');

    return await queryBuilder.getOne();
  }

  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6자리 숫자 코드 생성
  }

  async sendVerificationCode(
    email: string,
    name: string,
    user?: UserEntity,
  ): Promise<VerificationEntity> {
    const code = this.generateVerificationCode();
    const expires = Date.now() + 3 * 60 * 1000; // 3분 후 만료
    const expirationDate = new Date(expires);

    const replacements = {
      name,
      code,
    };
    const template = await this.s3Service.loadTemplateFromS3();

    await this.emailService.sendVerificationEmail(
      email,
      template,
      replacements,
    );

    const verification = new VerificationEntity();
    verification.code = code;
    verification.expire_date = expirationDate;
    verification.user = user;
    await this.verificationRepository.save(verification);

    return verification;
  }

  async validateVerificationCode(
    email: string,
    code: string,
  ): Promise<boolean> {
    let isBoolean = false;

    const entry = await this.findUsersInfo(email);

    if (!entry || entry.expire_date.getTime() < Date.now()) {
      return isBoolean;
    }

    if (entry.code === code) {
      entry.isUse = true;
      await this.verificationRepository.update(
        { user: entry.user },
        { ...entry },
      );
      isBoolean = true;
    }

    return isBoolean;
  }
}
