import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import fetch from 'axios';
import { Transaction } from './entities/transaction.entity';
type Wallet<T> = { walletUSD: T; walletGBP: T };
interface TransactionInfo {
  walletUSD: number;
  walletGBP: number;
  subtract: number;
  from: 'USD' | 'GBP';
  to: 'USD' | 'GBP';
}
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
    userId: true,
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

    const data: Prisma.TransactionCreateInput = {
      currencyActual: dto.currencyActual,
      currencyWanted: dto.currencyWanted,
      tradeValue: dto.tradeValue,
      currencyValue: conversor.result.toString(),
      user: {
        connect: {
          id: dto.userId,
        },
      },
    };

    async function getWalletValue(id: string): Promise<Wallet<number>> {
      const wallet: Wallet<string> = await prisma.user.findUnique({
        where: { id },
        select: { walletUSD: true, walletGBP: true },
      });
      const walletValue: Wallet<number> = {
        walletUSD: Number(wallet.walletUSD),
        walletGBP: Number(wallet.walletGBP),
      };
      return walletValue;
    }

    async function getTransactionInfo(): Promise<TransactionInfo> {
      const { walletGBP, walletUSD } = await getWalletValue(dto.userId);
      const value = Number(data.tradeValue);

      if (data.currencyActual !== 'USD' && data.currencyActual !== 'GBP')
        throw new BadRequestException('Currency not supported');

      if (data.currencyActual === 'USD' && data.currencyWanted === 'GBP') {
        if (walletUSD < value) {
          return { subtract: 0, walletGBP, walletUSD, from: 'USD', to: 'GBP' };
        } else {
          return {
            subtract: value,
            walletGBP,
            walletUSD,
            from: 'USD',
            to: 'GBP',
          };
        }
      }

      if (data.currencyActual === 'GBP' && data.currencyWanted === 'USD') {
        if (walletGBP < value) {
          return { subtract: 0, walletGBP, walletUSD, from: 'GBP', to: 'USD' };
        } else {
          return {
            subtract: value,
            walletGBP,
            walletUSD,
            from: 'GBP',
            to: 'USD',
          };
        }
      }
    }

    async function checkWalletValue() {
      const currency = data.currencyWanted;
      const tradeValue = Number(data.tradeValue);
      const converted = Number(data.currencyValue);
      const transaction = await getTransactionInfo();

      if (currency !== 'USD' && currency !== 'GBP') {
        throw new BadRequestException('Currency not supported.');
      } else if (transaction.subtract <= 0) {
        throw new BadRequestException(
          'User does not have the required amount on wallet.',
        );
      } else {
        const from = 'wallet' + transaction.from;
        const to = 'wallet' + transaction.to;
        const data = {
          [from]: (transaction[from] - tradeValue).toString(),
          [to]: (transaction[to] + converted).toString(),
        };
        await prisma.user.update({
          where: { id: dto.userId },
          data,
        });
        return { ...data, tradeValue, converted };
      }
    }

    await checkWalletValue();

    return this.prisma.transaction.create({
      data: {
        ...data,
      },
    });
  }

  findAll() {
    return this.prisma.transaction.findMany();
  }

  findByUser(id: string) {
    return this.prisma.transaction.findMany({ where: { user: { id } } });
  }

  async verifyIdAndReturnTransaction(id: string) {
    const transaction: Transaction = await this.prisma.transaction.findUnique({
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
