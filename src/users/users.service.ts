// src/users/users.service.ts

import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { RegisterDto } from '../auth/dto/auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.findByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    const user = this.usersRepository.create(registerDto);
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      select: [
        'id',
        'name',
        'email',
        'role',
        'isActive',
        'createdAt',
        'lastLogin',
      ],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: [
        'id',
        'name',
        'email',
        'role',
        'isActive',
        'createdAt',
        'lastLogin',
      ],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      lastLogin: new Date(),
    });
  }

  async changePassword(userId: string, newPassword: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    user.password = newPassword;
    await this.usersRepository.save(user);
  }

  async toggleUserStatus(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    user.isActive = !user.isActive;
    return await this.usersRepository.save(user);
  }
}
