import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseModel } from './base.entity';
import { PostModel } from 'src/post/entity/post.entity';
import { IsEnum, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { join } from 'path';
import {
  POST_PUBLIC_IMAGE_PATH,
  USER_PUBLIC_IMAGE_PATH,
} from '../const/path.const';
import { UserModel } from 'src/user/entity/user.entity';

export enum ImageModelType {
  POST_IMAGE,
  USER_IMAGE,
}

@Entity()
export class ImageModel extends BaseModel {
  @Column({ enum: ImageModelType })
  @IsEnum(ImageModelType)
  type: ImageModelType;

  @Column()
  @IsString()
  @Transform(({ value, obj }: { value: string; obj: ImageModel }) => {
    if (obj.type === ImageModelType.POST_IMAGE) {
      return `/${join(POST_PUBLIC_IMAGE_PATH, value)}`;
    } else if (obj.type === ImageModelType.USER_IMAGE) {
      return `/${join(USER_PUBLIC_IMAGE_PATH, value)}`;
    } else {
      return value;
    }
  })
  path: string;

  @ManyToOne(() => PostModel, (post) => post.images, { onDelete: 'CASCADE' })
  post?: PostModel;

  @OneToOne(() => UserModel, (user) => user.image)
  @JoinColumn()
  author?: UserModel;
}
