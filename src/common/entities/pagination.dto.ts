// pagination.dto.ts
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @Type(() => Number) // 입력 값을 숫자로 변환
  @IsInt({ message: 'limit must be an integer number' })
  @Min(1, { message: 'limit must not be less than 1' })
  limit: number = 10;

  @Type(() => Number) // 입력 값을 숫자로 변환
  @IsInt({ message: 'page must be an integer number' })
  @Min(1, { message: 'page must not be less than 1' })
  page: number = 1;
  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
