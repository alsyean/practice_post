import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../../entities/users.entity';

export class LoginRequestDto extends PickType(UserEntity, [
  'email',
  'password',
] as const) {}
