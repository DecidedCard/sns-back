import { Injectable, NotFoundException } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostModel } from './entity/post.entity';
import { Repository } from 'typeorm';
import { DEFAULT_POST_FIND_OPTIONS } from './const/default-post-find-options.const';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    private readonly commonService: CommonService,
  ) {}

  async paginatePosts(dto: PaginatePostDto) {
    return this.commonService.paginate(
      dto,
      this.postRepository,
      { ...DEFAULT_POST_FIND_OPTIONS },
      'post',
    );
  }

  async getPostById(id: number) {
    const post = await this.postRepository.findOne({
      ...DEFAULT_POST_FIND_OPTIONS,
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('존재하지 않는 포스트입니다.');
    }

    return post;
  }

  async createPost(authorId: number, postDto: CreatePostDto) {
    const post = await this.postRepository.save({
      author: { id: authorId },
      ...postDto,
      likeCount: 0,
      commentCount: 0,
    });

    return post;
  }

  async updatePost(id: number, postDto: UpdatePostDto) {
    const post = await this.postRepository.findOne({ where: { id } });
    const title = postDto.title;
    const content = postDto.content;

    if (!post) {
      throw new NotFoundException('존재하지 않는 포스트입니다.');
    }

    if (title) {
      post.title = title;
    }

    if (content) {
      post.content = content;
    }

    const newPost = await this.postRepository.save(post);

    return newPost;
  }

  async deletePost(id: number) {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException('존재하지 않는 포스트입니다.');
    }

    await this.postRepository.delete(id);

    return id;
  }

  isPostMine(userId: number, postId: number) {
    return this.postRepository.exists({
      where: { id: postId, author: { id: userId } },
      relations: { author: true },
    });
  }
}
