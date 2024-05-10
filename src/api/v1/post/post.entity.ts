import { CommonEntity } from '../../../common/entities/common.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToOne } from "typeorm";
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserEntity } from '../users/users.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'post',
})
export class PostEntity extends CommonEntity {
  @IsString()
  @ApiProperty()
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  @Column({ type: 'varchar', unique: false, nullable: false })
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '내용을 입력해주세요.' })
  @Column({ type: 'varchar', unique: false, nullable: false })
  content: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Column({ type: 'varchar', nullable: true })
  images: string[];

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @Column({ type: 'boolean', default: false })
  isOpen: boolean;


  @ManyToOne(() => UserEntity, (user) => user.post_id)
  @JoinColumn({ name: 'user_id' }) // user_id는 데이터베이스에 실제로 존재하는 외래 키 컬럼이어야 함
  user: UserEntity;
}
