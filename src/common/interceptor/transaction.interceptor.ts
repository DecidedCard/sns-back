import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { catchError, Observable, tap } from 'rxjs';
import { UserModel } from 'src/user/entity/user.entity';
import { DataSource, QueryRunner } from 'typeorm';

type Req = Request & { user: UserModel; queryRunner: QueryRunner };

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req: Req = context.switchToHttp().getRequest();

    const qr = this.dataSource.createQueryRunner();

    await qr.connect();

    await qr.startTransaction();

    req.queryRunner = qr;

    return next.handle().pipe(
      catchError(async (e) => {
        await qr.rollbackTransaction();
        await qr.release();

        throw new InternalServerErrorException(e);
      }),

      tap(() => {
        qr.commitTransaction()
          .then(() => qr.release())
          .catch((e) => {
            console.error(e);
            throw new InternalServerErrorException(e);
          });
      }),
    );
  }
}
