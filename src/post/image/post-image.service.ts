import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageModel } from 'src/common/entity/image.entity';
import { In, QueryRunner, Repository } from 'typeorm';
import { CreatePostImageDto } from './dto/create-post-image.dto';
import { join } from 'path';
import { TEMP_FOLDER_PATH } from 'src/common/const/path.const';
import { promises } from 'fs';

@Injectable()
export class PostImageService {
  constructor(
    @InjectRepository(ImageModel)
    private readonly imageRepository: Repository<ImageModel>,
  ) {}

  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<ImageModel>(ImageModel)
      : this.imageRepository;
  }

  async findByIdsForPost(ids: number[], postId: number, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    return repository.find({
      where: { id: In(ids), post: { id: postId } },
      relations: { post: true },
    });
  }

  async createPostImage(dto: CreatePostImageDto, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    const tempFilePath = join(TEMP_FOLDER_PATH, dto.path);

    try {
      await promises.access(tempFilePath);
    } catch {
      throw new BadRequestException('존재하지 않는 파일입니다.');
    }

    const result = await repository.save({ ...dto });

    return result;
  }

  async deletePostImage(id: number, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    const image = await repository.findOne({ where: { id } });

    await repository.delete(id);

    if (!image) {
      throw new InternalServerErrorException('저장된 이미지가 없습니다.');
    }

    return;
  }
}
