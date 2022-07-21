import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  private userSelect = {
    id: true,
    name: true,
    email: true,
    walletUSD: true,
    walletGBP: true,
    transactions: true,
    updatedAt: true,
    createdAt: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const data: Prisma.UserCreateInput = {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    };
    return this.prisma.user.create({ data, select: this.userSelect });
  }

  findAll() {
    return this.prisma.user.findMany({ select: this.userSelect });
  }

  async verifyIdAndReturnUser(id: string) {
    const user: User = await this.prisma.user.findUnique({
      where: { id },
      select: this.userSelect,
    });

    if (!user) {
      throw new NotFoundException(`Id entry '${id}' not found.`);
    }

    return user;
  }

  findOne(id: string) {
    return this.verifyIdAndReturnUser(id);
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.verifyIdAndReturnUser(id);

    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: this.userSelect,
    });
  }

  async remove(id: string) {
    await this.verifyIdAndReturnUser(id);

    return this.prisma.user.delete({
      where: { id },
      select: this.userSelect,
    });
  }
}
