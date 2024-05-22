import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../../../../entities/users.entity';

// PickType을 이용해서 기존 schema 에서 선택해서 사용
export class SignupDto extends PickType(UserEntity, [
  'email',
  'username',
  'password',
  'isAdmin',
  'verifications',
] as const) {}
