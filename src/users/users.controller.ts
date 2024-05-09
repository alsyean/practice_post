import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { SignupDto } from './dto/singupDto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { LoginRequestDto } from '../auth/dto/LoginRequestDto';
import { User } from '../common/decorator/user.decorator';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('user')
@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'current user info' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getUser(@User() user: any) {
    return user;
  }

  @Post()
  @ApiCreatedResponse({ status: 201, description: 'success for singUp' })
  async signUp(@Body() body: SignupDto) {
    return await this.usersService.signUp(body);
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'success login' })
  logIn(@Body() body: LoginRequestDto) {
    const user = this.authService.jwtLogin(body);
    return user;
  }
}
