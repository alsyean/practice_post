import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../../api/v1/users/users.entity';

export class LoginRequestDto extends PickType(UserEntity, [
  'email',
  'password',
] as const) {}
