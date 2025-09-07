import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentModel } from './entity/comment.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { paginateCommentDto } from './dto/paginate-comment.dto';
import { DEFAULT_COMMENT_FIND_OPTIONS } from './const/default-comment-find-options.const';
import { UserModel } from 'src/user/entity/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentModel)
    private readonly commentRepository: Repository<CommentModel>,
    private readonly commonService: CommonService,
  ) {}

  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<CommentModel>(CommentModel)
      : this.commentRepository;
  }

  async paginateComments(dto: paginateCommentDto, postId: number) {
    return this.commonService.paginate(
      dto,
      this.commentRepository,
      { ...DEFAULT_COMMENT_FIND_OPTIONS, where: { post: { id: postId } } },
      `post/${postId}/comment`,
    );
  }

  async getCommentById(id: number) {
    const comment = await this.commentRepository.findOne({
      ...DEFAULT_COMMENT_FIND_OPTIONS,
      where: { id },
    });

    if (!comment) {
      throw new BadRequestException(`${id} comment는 존재하지 않습니다.`);
    }

    return comment;
  }

  async createComment(
    author: UserModel,
    postId: number,
    dto: CreateCommentDto,
    qr?: QueryRunner,
  ) {
    const repository = this.getRepository(qr);

    return repository.save({ ...dto, post: { id: postId }, author });
  }

  async updateComment(dto: UpdateCommentDto, id: number) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    const updateComment = dto.comment;

    if (!comment) {
      throw new BadRequestException('존재하지 않는 코멘트입니다.');
    }

    if (updateComment) {
      comment.comment = updateComment;
    }

    const newComment = await this.commentRepository.save(comment);

    return newComment;
  }

  async deleteComment(id: number, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    const comment = await repository.findOne({ where: { id } });

    if (!comment) {
      throw new BadRequestException('존재하지 않는 코멘트입니다.');
    }

    await repository.delete(id);

    return { id };
  }

  async isCommentMine(userId: number, commentId: number) {
    return this.commentRepository.exists({
      where: { id: commentId, author: { id: userId } },
      relations: { author: true },
    });
  }
}
