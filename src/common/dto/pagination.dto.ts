import { IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

//페이지네이션 요청 받을때 사용하는 클래스 양식
export class PaginationDto {
  //@IsOptional() 데코레이터는 undefined도 받을 수 있다.
  @Type(() => Number) // 입력 값을 숫자로 변환
  @IsInt({ message: 'limit must be an integer number' })
  @Min(1, { message: 'limit must not be less than 1' })
  page?: number = 1;

  @Type(() => Number) // 입력 값을 숫자로 변환
  @IsInt({ message: 'limit must be an integer number' })
  @Min(1)
  limit?: number = 10;

  @Type(() => String)
  @IsOptional()
  @IsIn(['ASC', 'DESC'], { message: 'Sort must be either ASC or DESC' })
  @Transform(({ value }) =>
    value === 'ASC' || value === 'DESC' ? value : 'DESC',
  )
  sort?: 'ASC' | 'DESC' = 'DESC';

  getOffset(): number {
    if (this.page < 1 || this.page === null || this.page === undefined) {
      this.page = 1;
    }

    if (this.limit < 1 || this.limit === null || this.limit === undefined) {
      this.limit = 10;
    }

    return (this.page - 1) * this.limit;
  }

  getLimit(): number {
    if (this.limit < 1 || this.limit === null || this.limit === undefined) {
      this.limit = 10;
    }
    return this.limit;
  }
}
