import { PickType } from '@nestjs/mapped-types';
import { PostModel } from '../entity/post.entity';
import { IsOptional, IsString } from 'class-validator';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';

export class CreatePostDto extends PickType(PostModel, ['title', 'content']) {
  @IsString({ each: true, message: stringValidationMessage })
  @IsOptional()
  images: string[] = [];
}
