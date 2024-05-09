import { ValidatorOptions } from 'class-validator';
import { ValidationError } from '@nestjs/common';

export interface ValidationPipeOptions extends ValidatorOptions {
  transform?: boolean;
  disableErrorMessages?: boolean;
  exceptionFactory?: (errors: ValidationError[]) => any;
  enableDebugMessages: true;
  validationError: {
    target: true;
    value: true;
  };
}
