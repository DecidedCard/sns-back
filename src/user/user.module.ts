import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './entity/user.entity';
import { UserImageService } from './image/user-image.service';
import { ImageModel } from 'src/common/entity/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel, ImageModel])],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService, UserImageService],
})
export class UserModule {}
