// user.dto.ts
import { UserEntity } from '../../../../entities/users.entity';

export class UserDto {
  id: number;
  email: string;
  username: string;
  isAdmin: boolean;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.email = user.email;
    this.username = user.username;
    this.isAdmin = user.isAdmin;
  }
}
