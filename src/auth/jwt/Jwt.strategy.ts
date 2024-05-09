import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Payload } from './jwt.payload';
// import { UsersRepository } from '../../users/users.repository';
import { UsersService } from "../../api/v1/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더에서 토큰 추출
      ignoreExpiration: false, // 만료 기간
      secretOrKey: process.env.JWT_SECRET, //시크릿 키
    });
  }

  async validate(payload: Payload) {
    const current_user = await this.usersService.findByIdWithoutPassword(
      payload.sub,
    );

    if (current_user) {
      return current_user; // request.user
    } else {
      throw new UnauthorizedException('접근 오류');
    }
  }
}
