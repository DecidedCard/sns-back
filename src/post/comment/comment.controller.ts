import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { paginateCommentDto } from './dto/paginate-comment.dto';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { User } from 'src/user/decorator/user.decorator';
import { UserModel } from 'src/user/entity/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { QueryRunner as QR } from 'typeorm';
import { PostService } from '../post.service';
import { IsCommentMineOrAdminGuard } from './guard/is-comment-mine-or-admin.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('post/:postId/comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly postService: PostService,
  ) {}

  @Get()
  @IsPublic()
  getComments(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() query: paginateCommentDto,
  ) {
    return this.commentService.paginateComments(query, postId);
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  async postComment(
    @Param('postId', ParseIntPipe) postId: number,
    @User() user: UserModel,
    @Body() body: CreateCommentDto,
    @QueryRunner() qr: QR,
  ) {
    const res = await this.commentService.createComment(user, postId, body, qr);

    await this.postService.incrementCommentCount(postId, qr);

    return res;
  }

  @Patch(':commentId')
  @UseGuards(IsCommentMineOrAdminGuard)
  async patchComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() body: UpdateCommentDto,
  ) {
    return this.commentService.updateComment(body, commentId);
  }

  @Delete(':commentId')
  @UseGuards(IsCommentMineOrAdminGuard)
  @UseInterceptors(TransactionInterceptor)
  async deleteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @QueryRunner() qr: QR,
  ) {
    const res = await this.commentService.deleteComment(commentId, qr);

    await this.postService.decrementCommentCount(postId, qr);

    return res;
  }
}
