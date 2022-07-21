import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import fetch from 'axios';
import { Transaction } from './entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';

const prisma = new PrismaClient();

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  private transactionSelect = {
    id: false,
    createdAt: true,
    currencyActual: true,
    currencyWanted: true,
    tradeValue: true,
    currencyValue: true,
  };

  // async getAmountUSD(id: string) {
  //   const amountUSD: Partial<Wallet> = await this.prisma.wallet.findUnique({
  //     where: { id },
  //     select: { valueUSD: true },
  //   });

  //   return amountUSD;
  // }

  // async getAmountGBP(id: string) {
  //   const amountGBP: Partial<Wallet> = await this.prisma.wallet.findUnique({
  //     where: { id },
  //     select: { valueGBP: true },
  //   });

  //   return amountGBP;
  // }

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

    const data: Prisma.TransactionsCreateInput = {
      currencyActual: dto.currencyActual,
      currencyWanted: dto.currencyWanted,
      tradeValue: dto.tradeValue,
      currencyValue: conversor.result.toString(),
    };

    async function getWalletValue(id: string) {
      const walletUSD: Partial<User> = await prisma.user.findUnique({
        where: { id },
        select: { walletUSD: true },
      });

      const walletGBP: Partial<User> = await prisma.user.findUnique({
        where: { id },

        select: { walletGBP: true },
      });

      return { walletGBP, walletUSD };
    }

    async function checkUSDValue() {
      console.log(await getWalletValue(dto.userId));
      const walletUSD = (await getWalletValue(dto.userId)).walletUSD;

      const value = data.tradeValue;

      console.log(walletUSD);

      if (walletUSD < value) {
        return false;
      }

      return parseFloat(walletUSD.toString());
    }

    async function checkGBPValue() {
      const walletGBP = (await getWalletValue(dto.userId)).walletGBP;

      const value = data.tradeValue;

      if (walletGBP < value) {
        return false;
      }
      return parseFloat(walletGBP.toString());
    }

    async function checkWalletValue() {
      const currency = data.currencyWanted;
      const tradeValue = Number(data.tradeValue);
      const converted = Number(data.currencyValue);
      const walletUSD = await checkUSDValue();
      const walletGBP = await checkGBPValue();

      if (currency !== 'USD' && currency !== 'GBP') {
        throw new NotFoundException('Currency not supported.');
      } else if (currency === 'GBP') {
        if ((await checkUSDValue()) === false) {
          console.log('User does not have the required amount on wallet.');
        }
        // } else {
        //   walletUSD -= tradeValue;

        //   walletGBP += converted;

        //   await prisma.user.update({
        //     where: { id: dto.userId },
        //     data: {
        //       walletGBP: walletGBP.toString(),
        //       walletUSD: walletUSD.toString(),
        //     },
        //   });
        // }
      } else if (currency === 'USD') {
        checkGBPValue();
      }
    }

    checkWalletValue();

    return this.prisma.transactions.create({
      data,
      select: this.transactionSelect,
    });
  }

  findAll() {
    return this.prisma.transactions.findMany();
  }

  async verifyIdAndReturnTransaction(id: string) {
    const transaction: Transaction = await this.prisma.transactions.findUnique({
      where: { id },
      select: this.transactionSelect,
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction Id '${id}' not found.`);
    }

    return transaction;
  }

  findOne(id: string) {
    return this.verifyIdAndReturnTransaction(id);
  }
}
