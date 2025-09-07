import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentModel } from './entity/comment.entity';
import { CommonModule } from 'src/common/common.module';
import { PostModule } from '../post.module';

@Module({
  imports: [TypeOrmModule.forFeature([CommentModel]), CommonModule, PostModule],
  exports: [CommentService],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
