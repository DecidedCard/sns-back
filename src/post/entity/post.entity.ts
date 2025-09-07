import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { ImageModel } from 'src/common/entity/image.entity';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { UserModel } from 'src/user/entity/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CommentModel } from '../comment/entity/comment.entity';

@Entity()
export class PostModel extends BaseModel {
  @ManyToOne(() => UserModel, (user) => user.posts, { nullable: false })
  author: UserModel;

  @Column()
  @IsString({ message: stringValidationMessage })
  title: string;

  @Column()
  @IsString({ message: stringValidationMessage })
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;

  @OneToMany(() => ImageModel, (image) => image.post)
  images: ImageModel[];

  @OneToMany(() => CommentModel, (comment) => comment.post)
  comments: CommentModel[];
}
