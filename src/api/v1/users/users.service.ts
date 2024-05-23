import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/singupDto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../entities/users.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/login.dto';
import { AuthService } from '../../../auth/auth.service';
import { SqsService } from '../../../common/aws/sqs/sqs.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService,
    private readonly sqsService: SqsService,
  ) {}

  async signUp(body: SignupDto) {
    const { email, password } = body;

    const isEmailExists = await this.findByEmail(email);

    if (isEmailExists) {
      throw new UnauthorizedException('해당하는 유저는 이미 존재합니다.');
    }

    body.password = await bcrypt.hash(password, 10);
    const users = this.userRepository.create(body);
    const user = await this.userRepository.save(users);

    return users;
  }

  async updateUser(user: UserEntity): Promise<UserEntity | null> {
    return await this.userRepository.save(user);
  }
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

  async verifySend(email: string, name: string, user?: UserEntity) {
    return await this.authService.sendVerificationCode(email, name, user);
  }
}
