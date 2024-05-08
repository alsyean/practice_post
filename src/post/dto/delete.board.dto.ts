import { PickType } from '@nestjs/swagger';
import { PostEntity } from '../post.entity';

// PickType을 이용해서 기존 schema 에서 선택해서 사용
export class deletedBoardDto extends PickType(PostEntity, [
  'id',
] as const) {}
