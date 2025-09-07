import { Exclude } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { emailValidationMessage } from 'src/common/validation-message/email-validation.message';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { Column, Entity, OneToMany } from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { PostModel } from 'src/post/entity/post.entity';
import { CommentModel } from 'src/post/comment/entity/comment.entity';

@Entity()
export class UserModel extends BaseModel {
  @Column({ unique: true, length: 20 })
  @IsString()
  @Length(1, 20, { message: lengthValidationMessage })
  nickname: string;

  @Column({ unique: true })
  @IsString({ message: stringValidationMessage })
  @IsEmail({}, { message: emailValidationMessage })
  email: string;

  @Column()
  @IsString({ message: stringValidationMessage })
  @Length(5, 20, { message: lengthValidationMessage })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ enum: Object.values(RolesEnum), default: RolesEnum.USER })
  role: RolesEnum;

  @OneToMany(() => PostModel, (post) => post.author)
  posts: PostModel;

  @OneToMany(() => CommentModel, (comment) => comment.author)
  comments: CommentModel[];
}
