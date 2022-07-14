import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletsService {
  constructor(private readonly prisma: PrismaService) {}

  private walletSelect = {
    id: false,
    value: true,
  };

  async create(dto: CreateWalletDto) {
    const data: CreateWalletDto = {
      value: dto.value,
    };

    return this.prisma.wallet.create({ data, select: this.walletSelect });
  }

  async verifyIdAndReturnWallet(id: string) {
    const wallet: Wallet = await this.prisma.wallet.findUnique({
      where: { id },
      select: this.walletSelect,
    });

    if (!wallet) {
      throw new NotFoundException(`Wallet Id '${id}' not found. `);
    }
  }

  findOne(id: string) {
    return this.verifyIdAndReturnWallet(id);
  }
}
