import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export abstract class CommonEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  // 해당 열이 추가된 시각을 자동으로 기록
  // 만일 Postgres의 time zone이 'UTC'라면 UTC 기준으로 출력하고 'Asia/Seoul'라면 서울 기준으로 출력한다.
  // DB SQL QUERY : set time zone 'Asia/Seoul'; set time zone 'UTC'; show timezone;
  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamp' /* timestamp with time zone */,
  })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Soft Delete : 기존에는 null, 삭제시에 timestamp를 찍는다.
  @ApiProperty()
  @Exclude()
  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt?: Date | null;
}
