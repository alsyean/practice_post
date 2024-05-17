import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import {
  GET_METHOD,
  LOGIN_URL,
  PAGINATION_URL,
  POST_METHOD,
} from './constants';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (request.route.path === LOGIN_URL && request.method === POST_METHOD) {
      return next.handle(); // 인터셉터 작동을 스킵
    }

    if (
      PAGINATION_URL.includes(request.route.path) &&
      request.method === GET_METHOD
    ) {
      return next.handle().pipe(
        map((data) => ({
          success: true,
          page: data.page,
          total: data.total,
          count: data.count,
          pageCount: data.pageCount,
          data: data.data,
        })),
      );
    }

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
      })),
    );
  }
}
