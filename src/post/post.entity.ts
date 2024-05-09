import { CommonEntity } from '../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IsBoolean, IsNotEmpty} from 'class-validator';
import { UserEntity } from '../users/users.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'post',
})
export class PostEntity extends CommonEntity {
  @ApiProperty()
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  @Column({ type: 'varchar', unique: false, nullable: false })
  title: string;

  @ApiProperty()
  @IsNotEmpty({ message: '내용을 입력해주세요.' })
  @Column({ type: 'varchar', unique: false, nullable: false })
  content: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  images: string[];

  @ApiProperty()
  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isOpen: boolean;

  @ManyToOne(() => UserEntity, (user) => user.post_id)
  @JoinColumn({ name: 'user_id' }) // user_id는 데이터베이스에 실제로 존재하는 외래 키 컬럼이어야 함
  user: UserEntity;
}
