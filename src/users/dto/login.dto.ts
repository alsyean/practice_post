// user.dto.ts
import { UserEntity } from '../users.entity';

export class UserDto {
  email: string;
  username: string;
  isAdmin: boolean;

  constructor(user: UserEntity) {
    this.email = user.email;
    this.username = user.username;
    this.isAdmin = user.isAdmin;
  }
}
