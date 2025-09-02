import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}
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

  async getUserByEmail(email: string): Promise<UserModel | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
