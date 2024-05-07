import { PickType } from '@nestjs/swagger';
import { PostEntity } from '../post.entity';

// PickType을 이용해서 기존 schema 에서 선택해서 사용
export class PostBoardDto extends PickType(PostEntity, [
  'title',
  'content',
  'images',
  'isOpen',
  'user',
] as const) {}
