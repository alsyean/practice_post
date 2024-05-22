import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from '../../../auth/auth.service';
import { SignupDto } from './dto/singupDto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../../auth/jwt/jwt.guard';
import { LoginRequestDto } from '../../../auth/dto/LoginRequestDto';
import { User } from '../../../common/decorator/user.decorator';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('api/v1/user')
@Controller('api/v1/users')
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

  @Post('verify')
  @ApiResponse({ status: 200, description: 'success verify' })
  verify(@Body() body: any) {
    const user = this.authService.validateVerificationCode(
      body.email,
      body.code,
    );
    return user;
  }

  @Post('verify/mail')
  @ApiResponse({ status: 200, description: 'success login' })
  sendVerifyMail(@Body() body: any) {
    const user = this.authService.sendVerificationCode(
      body.email,
      body.name,
      body.user,
    );
    return user;
  }
}
