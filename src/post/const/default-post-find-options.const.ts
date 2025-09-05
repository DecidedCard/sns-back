import { FindManyOptions } from 'typeorm';
import { PostModel } from '../entity/post.entity';

export const DEFAULT_POST_FIND_OPTIONS: FindManyOptions<PostModel> = {
  relations: {
    author: true,
    images: true,
  },
};
