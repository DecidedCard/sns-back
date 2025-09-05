import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Req } from '../type';

export const QueryRunner = createParamDecorator(
  (data, context: ExecutionContext) => {
    const req: Req = context.switchToHttp().getRequest();

    if (!req.queryRunner) {
      throw new InternalServerErrorException(
        'QueryRunner 데코레이터는 TransactionInterceptor와 함께 사용해야 합니다.',
      );
    }

    return req.queryRunner;
  },
);
