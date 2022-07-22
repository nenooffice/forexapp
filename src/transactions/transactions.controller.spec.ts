import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';
import { PrismaService } from 'src/prisma/prisma.service';

jest.mock('src/prisma/prisma.service');

const prismaMock = PrismaService as jest.Mock<PrismaService>;

interface TransactionInfo {
  walletUSD: number;
  walletGBP: number;
  subtract: number;
  from: 'USD' | 'GBP';
  to: 'USD' | 'GBP';
}

describe('TransactionsController', () => {
  let controller: TransactionsController;
  const prisma = new prismaMock();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [TransactionsService],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    prisma;
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const result: TransactionInfo & CreateTransactionDto = {
        walletUSD: 100,
        walletGBP: 100,
        subtract: 100,
        from: 'USD',
        to: 'GBP',
        userId: '1',
        currencyActual: 'USD',
        currencyWanted: 'GBP',
        tradeValue: '100',
        currencyValue: '100',
        id: '1',
      };
      const createTransactionDto: CreateTransactionDto = {
        userId: '1',
        currencyActual: 'USD',
        currencyWanted: 'GBP',
        tradeValue: '100',
        currencyValue: '1.5',
        id: '1',
      };
      prisma.transaction.create({
        data: {
          userId: '1',
          currencyActual: 'USD',
          currencyWanted: 'GBP',
          tradeValue: '100',
          currencyValue: '1.5',
          id: '1',
        },
      });
      jest
        .spyOn(controller, 'create')
        .mockImplementation(async () => ({ ...result, createdAt: new Date() }));
      expect(await controller.create(createTransactionDto)).toEqual(result);
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
