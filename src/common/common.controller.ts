import {
  Controller,
  Post,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { CommonService } from './common.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterExceptionFilter } from './exception-filter/multer-exception-filter';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  @UseFilters(MulterExceptionFilter)
  postImage(@UploadedFile() file: Express.Multer.File) {
    return { fileName: file.filename };
  }
}
