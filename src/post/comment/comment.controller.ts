import { Controller, Get } from '@nestjs/common';
import { CommentService } from './comment.service';
import { IsPublic } from 'src/common/decorator/is-public.decorator';

@Controller('post/:postId/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @IsPublic()
  getComments() {}
}
