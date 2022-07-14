import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import fetch from 'axios';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  private transactionSelect = {
    id: false,
    createdAt: false,
    currencyActual: true,
    currencyWanted: true,
    tradeValue: true,
    currencyValue: true,
  };
  async create(dto: CreateTransactionDto) {
    const conversor: {
      date: Date;
      historical: string;
      info: {
        rate: number;
        timestamp: number;
      };
      query: {
        amount: number;
        from: string;
        to: string;
      };
      result: number;
      success: boolean;
    } = await fetch(
      `https://api.apilayer.com/exchangerates_data/convert?amount=${dto.tradeValue}&from=${dto.currencyActual}&to=${dto.currencyWanted}`,
      {
        method: 'GET',
        headers: { apikey: 'cbOgd3dA5UfisFiVe70wE8V3VeMVmZFV' },
      },
    )
      .then((data) => data.data)
      .catch((error) => {
        throw new Error(error);
      });

    // const amountInWallet = this.prisma.wallet.findUnique({
    //   where: { id },
    //   select: value,
    // });

    const data: Prisma.TransactionsCreateInput = {
      currencyActual: dto.currencyActual,
      currencyWanted: dto.currencyWanted,
      tradeValue: dto.tradeValue,
      currencyValue: conversor.result.toString(),
    };
    return this.prisma.transactions.create({
      data,
      select: this.transactionSelect,
    });
  }

  findAll() {
    return this.prisma.transactions.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
