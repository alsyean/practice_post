import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { signupDto } from './dto/singupDto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { Request } from 'express';
import { LoginRequestDto } from '../auth/dto/LoginRequestDto';
import { User } from '../common/decorator/user.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@User() user: any) {
    console.log(user);
    return user;
  }

  @Post()
  async signUp(@Body() body: signupDto) {
    return await this.usersService.signUp(body);
  }

  @Post('login')
  logIn(@Body() body: LoginRequestDto) {
    const user = this.authService.jwtLogin(body);
    console.log(`user : ${JSON.stringify(user)}`);
    return user;
  }
}
