import { PartialType, PickType } from '@nestjs/mapped-types';
import { UserModel } from '../entity/user.entity';
import { IsOptional, IsString } from 'class-validator';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';

export class UpdateUserDto extends PartialType(
  PickType(UserModel, ['nickname']),
) {
  @IsOptional()
  @IsString({ message: stringValidationMessage })
  image: string;
}
