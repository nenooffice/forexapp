import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto.user';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  private userSelect = {
    id: true,
    name: true,
    email: true,
    updatedAt: true,
    createdAt: true,
  }
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<User | void> {
    const hashedPassword = await bcrypt.hash(dto.password, 8);

    const data: CreateUserDto = {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    };
  }

  remove(id: string) {
    throw new Error('Method not implemented.');
  }

  update(id: string, dto: UpdateUserDto): Promise<void | import("./entity/users.entity").User> {
    throw new Error('Method not implemented.');
  }

  findOne(id: string): Promise<import('./entity/users.entity').User> {
    throw new Error('Method not implemented.');
  }
}
