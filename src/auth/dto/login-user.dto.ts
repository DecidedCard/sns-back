import { PickType } from '@nestjs/mapped-types';
import { UserModel } from 'src/user/entity/user.entity';

export class LoginUserDto extends PickType(UserModel, ['email', 'password']) {}
