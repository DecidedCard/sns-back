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
import { PostService } from './post.service';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { User } from 'src/user/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IsPostMineOrAdminGuard } from './guard/is-post-mine-or-admin.guard';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { QueryRunner as QR } from 'typeorm';
import { PostImageService } from './image/image.service';
import { ImageModelType } from 'src/common/entity/image.entity';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly postImageService: PostImageService,
  ) {}

  @Get()
  @IsPublic()
  getPosts(@Query() query: PaginatePostDto) {
    return this.postService.paginatePosts(query);
  }

  @Get(':id')
  @IsPublic()
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getPostById(id);
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  async postPost(
    @User('id') id: number,
    @Body() body: CreatePostDto,
    @QueryRunner() qr: QR,
  ) {
    const post = await this.postService.createPost(id, body, qr);

    for (let i = 0; i < body.images.length; i++) {
      await this.postImageService.createPostImage(
        {
          post,
          order: i,
          path: body.images[i],
          type: ImageModelType.POST_IMAGE,
        },
        qr,
      );
    }

    return this.postService.getPostById(post.id, qr);
  }

  @Patch(':postId')
  @UseGuards(IsPostMineOrAdminGuard)
  patchPost(
    @Param('postId', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto,
  ) {
    return this.postService.updatePost(id, body);
  }

  @Delete(':postId')
  @UseGuards(IsPostMineOrAdminGuard)
  deletePost(@Param('postId', ParseIntPipe) id: number) {
    return this.postService.deletePost(id);
  }
}
