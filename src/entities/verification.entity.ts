import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { CommonEntity } from '../common/entities/common.entity'; // ormconfig.json에서 파싱 가능하도록 상대 경로로 지정
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './users.entity';

@Index('verify_user_index', ['code', 'user'], { unique: true })
@Entity({
  name: 'verifications',
}) // VERIFICATIONS : 테이블 명
export class VerificationEntity extends CommonEntity {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar' })
  code: string;

  @ApiProperty()
  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isUse: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @CreateDateColumn({
    type: 'timestamp' /* timestamp with time zone */,
  })
  expire_date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @ManyToOne(() => UserEntity, (user) => user.verifications)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
