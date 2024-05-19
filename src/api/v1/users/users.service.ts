import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/singupDto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/login.dto';
import { AuthService } from '../../../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  async signUp(body: SignupDto) {
    const { email, password } = body;

    const isEmailExists = await this.userRepository.findOne({
      where: { email },
    });

    if (isEmailExists) {
      throw new UnauthorizedException('해당하는 유저는 이미 존재합니다.');
    }

    body.password = await bcrypt.hash(password, 10);
    const users = this.userRepository.create(body);
    await this.userRepository.save(users);
    await this.authService.sendVerificationCode(body.email, body.username);

    return users;
  }

  // async createUsers(userData: CreateUserDto): Promise<UserEntity> {
  //   const newUser = this.userRepository.create(userData);
  //   return await this.userRepository.save(newUser);
  // }
  //
  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findByIdWithoutPassword(userId: number): Promise<UserDto | null> {
    const user = await this.userRepository.findOne({
      select: ['id', 'isAdmin', 'username', 'email'], // password 제외
      where: { id: userId },
    });
    if (!user) {
      console.log('No user found with the given ID.');
      return null;
    }

    const result = new UserDto(user);
    // 조회 결과가 있는 경우, UserDto를 반환
    return result;
  }
}
