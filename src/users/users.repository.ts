// import { EntityRepository, Repository } from 'typeorm';
// import { UserEntity } from './users.entity';
// import { SignupDto } from './dto/singupDto';
//
// @EntityRepository(UserEntity)
// export class UsersRepository extends Repository<UserEntity> {
//   async createUsers(users: SignupDto) {
//     return this.save(users);
//   }
//   async findByEmail(email: string): Promise<UserEntity | undefined> {
//     return this.findOne({ where: { email } });
//   }
//
//   async findByIdWithoutPassword(email: string): Promise<UserEntity | null> {
//     const user = await this.findByEmail(email);
//     return user;
//   }
// }
