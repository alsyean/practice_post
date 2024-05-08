import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestErrorResponseDto {
  @ApiProperty({
    type: Number,
    description: 'Http Code',
    example: 400,
    required: true,
    default: 400,
  })
  readonly statusCode: number;

  @ApiProperty({
    type: String,
    description: 'API 성공 여부',
    required: true,
    example: false,
    default: false,
  })
  readonly isSuccess: boolean;

  @ApiProperty({
    oneOf: [
      { type: 'string' },
      {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    ],
    description: 'API 응답 메세지',
    required: true,
    example: '[{에러 내용}] | {에러내용}',
  })
  readonly message: string;

  @ApiProperty({
    type: Object,
    description: '응답 객체',
    required: false,
  })
  readonly data?: object;

  @ApiProperty({
    type: Date,
    description: '응답일',
    required: true,
  })
  readonly issuedAt?: Date;
}

export class CreateServerErrorResponseDto {
  @ApiProperty({
    type: Number,
    description: 'Http Code',
    example: 500,
    required: true,
    default: 500,
  })
  readonly statusCode: number;

  @ApiProperty({
    type: String,
    description: 'API 성공 여부',
    required: true,
    example: false,
    default: false,
  })
  readonly isSuccess: boolean;

  @ApiProperty({
    oneOf: [
      { type: 'string' },
      {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    ],
    description: 'API 응답 메세지',
    required: true,
    example: 'Internal Server Error',
  })
  readonly message: string;

  @ApiProperty({
    type: Object,
    description: '응답 객체',
    required: false,
  })
  readonly data?: object;

  @ApiProperty({
    type: Date,
    description: '응답일',
    required: true,
  })
  readonly issuedAt?: Date;
}
