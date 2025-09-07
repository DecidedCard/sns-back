import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Fn, Req } from '../type';

export const OnCommit = createParamDecorator((_, context: ExecutionContext) => {
  const req: Req & { onCommit: (fn: Fn) => void } = context
    .switchToHttp()
    .getRequest();

  return req.onCommit;
});
