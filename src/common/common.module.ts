import { BadRequestException, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { TEMP_FOLDER_PATH } from './const/path.const';
import { v4 as uuid } from 'uuid';
import { APP_FILTER } from '@nestjs/core';
import { MulterExceptionFilter } from './exception-filter/multer-exception-filter';

@Module({
  imports: [
    MulterModule.register({
      limits: { fileSize: 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);

        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
          return cb(
            new BadRequestException({
              statusCode: 400,
              message: 'jpg/jpeg/png 파일만 업로드 가능합니다.',
              timeStamp: new Date().toLocaleString('kr'),
              path: '/common/image',
            }),
            false,
          );
        }

        return cb(null, true);
      },
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, TEMP_FOLDER_PATH);
        },
        filename: function (req, file, cb) {
          cb(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  exports: [CommonService],
  controllers: [CommonController],
  providers: [
    CommonService,
    { provide: APP_FILTER, useClass: MulterExceptionFilter },
  ],
})
export class CommonModule {}
