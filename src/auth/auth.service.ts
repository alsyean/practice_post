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

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly s3Service: S3Service,
  ) {}

  private verificationCodes: Map<string, { code: string; expires: number }> =
    new Map();

  async jwtLogin(data: LoginRequestDto) {
    const { email, password } = data;
    const users = await this.usersService.findByEmail(email);

    if (!users) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인 해주세요.');
    }

    const isValidPassword = await bcrypt.compare(password, users.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('비밀번호가 일치 하지 않습니다.');
    }

    const payload = { email: email, sub: users.id };

    return {
      token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }),
    };
  }

  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6자리 숫자 코드 생성
  }

  async sendVerificationCode(email: string, name: string): Promise<void> {
    const code = this.generateVerificationCode();
    const expires = Date.now() + 3 * 60 * 1000; // 3분 후 만료

    this.verificationCodes.set(email, { code, expires });

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
    console.log(`Verification code sent to ${email}: ${code}`);
  }

  validateVerificationCode(email: string, code: string): boolean {
    const entry = this.verificationCodes.get(email);

    if (!entry) {
      return false;
    }

    if (entry.expires < Date.now()) {
      this.verificationCodes.delete(email); // 만료된 코드 제거
      return false;
    }

    return entry.code === code;
  }
}
