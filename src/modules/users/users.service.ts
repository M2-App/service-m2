import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { HandleException } from 'src/common/exceptions/handler/handle.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  findOneByEmail = (email: string) => {
    return this.userRepository.findOneBy({ email });
  };
  update = async (user: UserEntity) => {
    const exists = await this.userRepository.existsBy({ email: user.email });
    if (!exists) {
      throw new BadRequestException('The user does not exist');
    }
    return this.userRepository.save(user);
  };

  getUserRoles = async (userId: number): Promise<string[]> => {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userRoles', 'userRoles.role'],
    });

    return user.userRoles.map((userRole) => userRole.role.name);
  };

  findById = async (userId: number) => {
    return await this.userRepository.findOneBy({ id: userId });
  };

  findSiteUsers = async (siteId: number) => {
    try {
      return await this.userRepository.findBy({ siteId: siteId });
    } catch (exception) {
      HandleException.exception(exception);
    }
  };

  findAllUsers = async () => {
    try {
      return await this.userRepository.find();
    } catch (exception) {
      HandleException.exception(exception);
    }
  };
}
