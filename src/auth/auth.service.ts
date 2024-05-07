import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { UsersRepository } from '../users/users.repository';
import * as bcrypt from 'bcrypt';
import { LoginRequestDto } from './dto/LoginRequestDto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

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

}
