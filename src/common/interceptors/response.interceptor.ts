import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (
      request.route.path === '/api/v1/users/login' &&
      request.method === 'POST'
    ) {
      return next.handle(); // 인터셉터 작동을 스킵
    }

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
      })),
    );
  }
}
