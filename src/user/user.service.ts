import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entity/user.entity';
import { QueryRunner, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}
  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<UserModel>(UserModel)
      : this.userRepository;
  }

  async getUserByEmail(email: string): Promise<UserModel | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: { image: true },
    });
  }

  async createUser(user: Pick<UserModel, 'email' | 'nickname' | 'password'>) {
    const nicknameExists = await this.userRepository.exists({
      where: { nickname: user.nickname },
    });

    if (nicknameExists) {
      throw new BadRequestException('이미 존재하는 nickname입니다.');
    }

    const emailExists = await this.userRepository.exists({
      where: { email: user.email },
    });

    if (emailExists) {
      throw new BadRequestException('이미 가입한 이메일 입니다.');
    }

    const userObject = this.userRepository.save({
      nickname: user.nickname,
      email: user.email,
      password: user.password,
    });

    return userObject;
  }

  async updateUser(user: UserModel, dto: UpdateUserDto, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    if (dto.nickname) {
      user.nickname = dto.nickname;
    }

    const updateUser = await repository.save(user);

    return updateUser;
  }
}
