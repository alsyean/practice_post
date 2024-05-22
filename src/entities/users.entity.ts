import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CommonEntity } from '../common/entities/common.entity'; // ormconfig.json에서 파싱 가능하도록 상대 경로로 지정
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { PostEntity } from './post.entity';
import { ApiProperty } from '@nestjs/swagger';
import { VerificationEntity } from './verification.entity';

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'users',
}) // USER : 테이블 명
export class UserEntity extends CommonEntity {
  @ApiProperty()
  @IsEmail({}, { message: '올바른 이메일을 작성해주세요.' })
  @IsNotEmpty({ message: '이메일을 작성해주세요.' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '이름을 작성해주세요.' })
  @Column({ type: 'varchar', nullable: false })
  username: string;

  @ApiProperty()
  @Exclude()
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @ApiProperty()
  @Column({ type: 'int', nullable: false, default: 0 })
  wrong_login_cnt: number;

  @ApiProperty()
  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @ApiProperty()
  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @OneToMany(() => VerificationEntity, (verification) => verification.user)
  verifications: VerificationEntity[];
}
