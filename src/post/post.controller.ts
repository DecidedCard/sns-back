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
import { OnCommit } from 'src/common/decorator/on-commit.decorator';
import { Fn } from 'src/common/type';
import { basename, join } from 'path';
import {
  POST_IMAGE_PATH,
  POST_PUBLIC_IMAGE_PATH,
  TEMP_FOLDER_PATH,
} from 'src/common/const/path.const';
import { promises } from 'fs';

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
    @OnCommit() onCommit: (fn: Fn) => void,
  ) {
    const post = await this.postService.createPost(id, body, qr);

    for (let i = 0; i < body.images.length; i++) {
      const path = body.images[i];

      await this.postImageService.createPostImage(
        {
          post,
          order: i,
          path,
          type: ImageModelType.POST_IMAGE,
        },
        qr,
      );

      onCommit(async () => {
        const src = join(TEMP_FOLDER_PATH, path);
        const dst = join(POST_IMAGE_PATH, basename(path));
        try {
          await promises.rename(src, dst);
        } catch (e) {
          console.error('[move image failed]', path, e);
        }
      });
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
  @UseInterceptors(TransactionInterceptor)
  async deletePost(
    @Param('postId', ParseIntPipe) id: number,
    @QueryRunner() qr: QR,
    @OnCommit() onCommit: (fn: Fn) => void,
  ) {
    const post = await this.postService.getPostById(id, qr);
    const images = post.images.map((img) => img) ?? [];

    for (const { id } of images) {
      await this.postImageService.deletePostImage(id, qr);
    }

    await this.postService.deletePost(id);

    onCommit(async () => {
      for (const { path } of images) {
        const publicPath = join(POST_PUBLIC_IMAGE_PATH, path);
        try {
          await promises.rm(publicPath);
        } catch (e) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (e.code === 'ENOENT') continue;
          console.error('[delete image failed]', path, e);
        }
      }
    });

    return { id };
  }
}
