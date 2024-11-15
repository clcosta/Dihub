import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/entities/user';
import { Repository } from 'typeorm';
import { BasicUserDTO, CreateUserDTO, UpdateUserDTO } from './users.dto';
import { HashService } from '../../providers/hash/hash.service';
import { LogService } from '../../providers/log/log.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
    private readonly logService: LogService,
  ) {}

  private userAdapter(user: User): BasicUserDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getAll(): Promise<BasicUserDTO[]> {
    const users = await this.userRepository.find();
    return users.map(this.userAdapter);
  }

  async get(id: number): Promise<BasicUserDTO> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    return this.userAdapter(user);
  }

  async create(user: CreateUserDTO): Promise<void> {
    const newUser = new User();
    newUser.name = user.name;
    newUser.email = user.email;
    const hashedPassword = await this.hashService.hash(user.password);
    newUser.password = hashedPassword;
    await this.userRepository.save(newUser);
    await this.logService.log(
      `User created: ${newUser.name} - ${newUser.email}`,
      'UserService',
      'create',
    );
  }

  async update(id: number, user: UpdateUserDTO): Promise<BasicUserDTO> {
    const userToUpdate = await this.userRepository.findOne({
      where: { id },
    })
    if (!userToUpdate) throw new NotFoundException('User not found');
    this.logService.log(
      `Updating user: ${userToUpdate.id}`,
      'UserService',
      'update',
    )
    userToUpdate.name = user.name;
    // FIXME: if email are unique in application, first check before update and throw error if email already exists
    userToUpdate.email = user.email;
    await this.userRepository.save(userToUpdate);
    return this.userAdapter(userToUpdate);
  }

  async delete(id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) throw new NotFoundException('User not found');
    await this.logService.log(
      `Deleting user: ${user.id}`,
      'UserService',
      'delete',
    );
    await this.userRepository.softDelete(user);
  }
}
