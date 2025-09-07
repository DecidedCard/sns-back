import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModel } from './entity/post.entity';
import { CommonModule } from 'src/common/common.module';
import { ImageModel } from 'src/common/entity/image.entity';
import { PostImageService } from './image/post-image.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostModel, ImageModel]), CommonModule],
  controllers: [PostController],
  exports: [PostService],
  providers: [PostService, PostImageService],
})
export class PostModule {}
