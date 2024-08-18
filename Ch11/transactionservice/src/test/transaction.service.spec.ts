import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '../transaction/transaction.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { KafkaService } from '../kafka/kafka.service';
import { CreateTransactionDto } from '../transaction/dto/create-transaction.dto';


describe('TransactionService', () => {
  let service: TransactionService;
  let prismaService: PrismaService;
  let httpService: HttpService;
  let kafkaService: KafkaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: PrismaService,
          useValue: {
            transaction: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              get: jest.fn(),
            },
          },
        },
        {
          provide: KafkaService,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    prismaService = module.get<PrismaService>(PrismaService);
    httpService = module.get<HttpService>(HttpService);
    kafkaService = module.get<KafkaService>(KafkaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a transaction with status CREATED if account status is new or active', async () => {
      const createTransactionDto: CreateTransactionDto = {
        accountId: '1',
        description: 'Test transaction',
      };

      const accountApiResponse = {
        data: {
          account: {
            id: '1',
            status: 'active',
          },
        },
      };

      jest.spyOn(httpService.axiosRef, 'get').mockResolvedValue(accountApiResponse);
      jest.spyOn(prismaService.transaction, 'create').mockResolvedValue({
        id: 1,
        accountId: '1',
        description: 'Test transaction',
        status: 'CREATED',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(createTransactionDto);

      expect(result).toEqual(expect.objectContaining({
        id: 1,
        accountId: '1',
        description: 'Test transaction',
        status: 'CREATED',
      }));
      expect(httpService.axiosRef.get).toHaveBeenCalledWith('http://localhost:3001/v1/accounts/1');
      expect(prismaService.transaction.create).toHaveBeenCalledWith({
        data: {
          accountId: '1',
          description: 'Test transaction',
          status: 'CREATED',
        },
      });
    });

    it('should create a transaction with status FAILED if account status is not new or active', async () => {
      const createTransactionDto: CreateTransactionDto = {
        accountId: '1',
        description: 'Test transaction',
      };

      const accountApiResponse = {
        data: {
          account: {
            id: 1,
            status: 'inactive',
          },
        },
      };

      jest.spyOn(httpService.axiosRef, 'get').mockResolvedValue(accountApiResponse);
      jest.spyOn(prismaService.transaction, 'create').mockResolvedValue({
        id: 1,
        accountId: '1',
        description: 'Test transaction',
        status: 'FAILED',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(createTransactionDto);

      expect(result).toEqual(expect.objectContaining({
        id: 1,
        accountId: '1',
        description: 'Test transaction',
        status: 'FAILED',
      }));
      expect(httpService.axiosRef.get).toHaveBeenCalledWith('http://localhost:3001/v1/accounts/1');
      expect(prismaService.transaction.create).toHaveBeenCalledWith({
        data: {
          accountId: '1',
          description: 'Test transaction',
          status: 'FAILED',
        },
      });
    });

    it('should throw an error if account is not found', async () => {
      const createTransactionDto: CreateTransactionDto = {
        accountId: '1',
        description: 'Test transaction',
      };

      const accountApiResponse = {
        data: {
          account: null,
        },
      };

      jest.spyOn(httpService.axiosRef, 'get').mockResolvedValue(accountApiResponse);

      await expect(service.create(createTransactionDto)).rejects.toThrow(
        'Transaction creation failed: Account not found',
      );

      expect(httpService.axiosRef.get).toHaveBeenCalledWith('http://localhost:3001/v1/accounts/1');
      expect(prismaService.transaction.create).not.toHaveBeenCalled();
    });
  });
});
