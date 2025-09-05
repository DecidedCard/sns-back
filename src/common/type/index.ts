import { Request } from 'express';
import { UserModel } from 'src/user/entity/user.entity';
import { QueryRunner } from 'typeorm';

export type Req = Request & { user: UserModel; queryRunner: QueryRunner };
