import { Controller, Get, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { PaginatePostDto } from './dto/paginate-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @IsPublic()
  getPosts(@Query() query: PaginatePostDto) {
    return this.postService.paginatePosts(query);
  }
}
