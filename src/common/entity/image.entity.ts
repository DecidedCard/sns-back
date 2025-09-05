import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from './base.entity';
import { PostModel } from 'src/post/entity/post.entity';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { join } from 'path';
import { POST_PUBLIC_IMAGE_PATH } from '../const/path.const';

export enum ImageModelType {
  POST_IMAGE,
}

@Entity()
export class ImageModel extends BaseModel {
  @Column({ default: 0 })
  @IsInt()
  @IsOptional()
  order: number;

  @Column({ enum: ImageModelType })
  @IsEnum(ImageModelType)
  @IsString()
  type: ImageModelType;

  @Column()
  @IsString()
  @Transform(({ value, obj }: { value: string; obj: ImageModel }) => {
    if (obj.type === ImageModelType.POST_IMAGE) {
      return `/${join(POST_PUBLIC_IMAGE_PATH, value)}`;
    } else {
      return value;
    }
  })
  path: string;

  @ManyToOne(() => PostModel, (post) => post.images)
  post?: PostModel;
}
