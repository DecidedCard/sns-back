import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  PayloadTooLargeException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MulterError } from 'multer';

@Catch(MulterError, PayloadTooLargeException)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: MulterError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res: Response = ctx.getResponse();
    const req: Request = ctx.getRequest();

    let status = HttpStatus.BAD_REQUEST;
    let message = '파일 업로드 중 오류가 발생했습니다.';

    if (exception instanceof (MulterError as any)) {
      if (exception.code === 'LIMIT_FILE_SIZE') {
        message = '파일 크기가 1MB를 초과했습니다.';
        status = HttpStatus.BAD_REQUEST;
      } else if (exception.code === 'LIMIT_UNEXPECTED_FILE') {
        message = '허용되지 않은 필드로 파일이 전달되었습니다.';
      } else {
        message = exception.message || message;
      }
    }

    if (exception instanceof PayloadTooLargeException) {
      message = '파일 크기가 1MB를 초과했습니다.';
      status = HttpStatus.BAD_REQUEST;
    }

    res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: status,
      message,
      timeStamp: new Date().toLocaleString('kr'),
      path: req.url,
    });
  }
}
