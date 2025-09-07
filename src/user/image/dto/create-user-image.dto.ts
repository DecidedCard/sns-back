import { PickType } from '@nestjs/mapped-types';
import { ImageModel } from 'src/common/entity/image.entity';

export class CreateUserImageDto extends PickType(ImageModel, [
  'path',
  'author',
  'type',
]) {}
