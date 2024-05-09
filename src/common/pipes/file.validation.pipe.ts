import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly maxvalueize = 1000000; // 최대 파일 크기 (예: 1MB)
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
  ]; // 허용 MIME 타입

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata,) {
    // "value" is an object containing the value's attributes and metadata
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v.size > this.maxvalueize) {
          throw new BadRequestException(
            `허용된 최대 파일 크기는 ${this.maxvalueize}바이트입니다.`,
          );
        }
        if (
          !this.allowedMimeTypes.includes(v.mimetype) &&
          v.mimetype !== undefined
        ) {
          throw new BadRequestException(
            `허용된 파일 타입은 ${this.allowedMimeTypes.join(', ')}입니다.`,
          );
        }
      });
    } else {
      // 단일 파일 처리
      if (value.size > this.maxvalueize) {
        throw new BadRequestException(
          `허용된 최대 파일 크기는 ${this.maxvalueize}바이트입니다.`,
        );
      }
      if (
        !this.allowedMimeTypes.includes(value.mimetype) &&
        value.mimetype !== undefined
      ) {
        throw new BadRequestException(
          `허용된 파일 타입은 ${this.allowedMimeTypes.join(', ')}입니다.`,
        );
      }
    }

    return value; // 검증을 통과한 파일 데이터 반환
  }
}
