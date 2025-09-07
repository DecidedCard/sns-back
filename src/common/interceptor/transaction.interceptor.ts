import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { DataSource } from 'typeorm';
import { Fn, Req } from '../type';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req: Req & { onCommit: (fn: Fn) => void } = context
      .switchToHttp()
      .getRequest();

    const qr = this.dataSource.createQueryRunner();

    await qr.connect();

    await qr.startTransaction();

    req.queryRunner = qr;

    const postCommitTasks: Array<Fn> = [];
    req.onCommit = (fn: Fn) => postCommitTasks.push(fn);

    return next.handle().pipe(
      catchError(async (e) => {
        await qr.rollbackTransaction();
        await qr.release();

        throw new InternalServerErrorException(e);
      }),

      tap(() => {
        qr.commitTransaction()
          .then(() => qr.release())
          .then(async () => {
            for (const task of postCommitTasks) {
              try {
                await task();
              } catch (error) {
                console.error('[post-commit]', error);
              }
            }
          })
          .catch((e) => {
            console.error(e);
            throw new InternalServerErrorException(e);
          });
      }),
    );
  }
}
