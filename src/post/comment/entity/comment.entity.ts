import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { PostModel } from 'src/post/entity/post.entity';
import { UserModel } from 'src/user/entity/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class CommentModel extends BaseModel {
  @ManyToOne(() => UserModel, (user) => user.comments)
  author: UserModel;

  @ManyToOne(() => PostModel, (post) => post.comments)
  post: PostModel;

  @Column()
  @IsString({ message: stringValidationMessage })
  comment: string;
}
