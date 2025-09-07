import { Body, Controller, Get, Patch, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UserModel } from './entity/user.entity';
import { User } from './decorator/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserImageService } from './image/user-image.service';
import { ImageModelType } from 'src/common/entity/image.entity';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { QueryRunner as QR } from 'typeorm';
import { OnCommit } from 'src/common/decorator/on-commit.decorator';
import { Fn } from 'src/common/type';
import { basename, join } from 'path';
import {
  TEMP_FOLDER_PATH,
  USER_IMAGE_PATH,
  USER_PUBLIC_IMAGE_PATH,
} from 'src/common/const/path.const';
import { promises } from 'fs';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userImageService: UserImageService,
  ) {}

  @Get()
  getUser(@User() user: UserModel) {
    return user;
  }

  @Patch()
  @UseInterceptors(TransactionInterceptor)
  async patchUser(
    @Body() body: UpdateUserDto,
    @User() author: UserModel,
    @QueryRunner() qr: QR,
    @OnCommit() onCommit: (fn: Fn) => void,
  ) {
    const updateUser = await this.userService.updateUser(author, body, qr);

    if (body.image) {
      if (author.image) {
        const path = author.image.path;
        await this.userImageService.deleteUserImage(author.image.id, qr);

        onCommit(async () => {
          const publicPath = join(USER_PUBLIC_IMAGE_PATH, path);

          try {
            await promises.rm(publicPath);
          } catch (e) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (e.code === 'ENOENT') return;
            console.error('[delete image failed]', path, e);
          }
        });
      }

      await this.userImageService.createUserImage(
        {
          path: body.image,
          type: ImageModelType.USER_IMAGE,
          author,
        },
        qr,
      );

      onCommit(async () => {
        const src = join(TEMP_FOLDER_PATH, body.image);
        const dst = join(USER_IMAGE_PATH, basename(body.image));

        try {
          await promises.rename(src, dst);
        } catch (e) {
          console.error('[move image failed]', body.image, e);
        }
      });
    }

    return updateUser;
  }
}
