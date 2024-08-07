/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { PrismaService } from "../prisma/prisma.service";
import { HttpService } from "@nestjs/axios";
import { AccountApiResponse } from "./dto/account.dto";
import { KafkaService } from "../kafka/kafka.service";
import { Status } from "@prisma/client";
@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly kafkaService: KafkaService
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const { accountId, description } = createTransactionDto;
    const accountApiResponse =
      await this.httpService.axiosRef.get<AccountApiResponse>(
        `http://localhost:3001/v1/accounts/${accountId}`
      );
    const { account } = accountApiResponse.data;
    if (!account) {
      throw new Error("Transaction creation failed: Account not found");
    }
    if (account.status == "new" || account.status == "active") {
      return this.prisma.transaction.create({
        data: { accountId, description, status: "CREATED" },
      });
    } else {
      return this.prisma.transaction.create({
        data: { accountId, description, status: "FAILED" },
      });
    }
  }

  findAll() {
    return this.prisma.transaction.findMany();
  }

  findOne(id: number) {
    return this.prisma.transaction.findUnique({
      where: { id },
    });
  }

  async fraud(id: number) {
    const transaction = await this.findOne(id);

    if (transaction.status !== "FRAUD" && transaction.status !== "FAILED") {
      const newTransaction = await this.prisma.transaction.update({
        where: { id },
        data: { status: "FRAUD" },
      });

      this.kafkaService.send(newTransaction, null);

      return newTransaction;
    } else throw new Error("Transaction is not in a valid status");
  }
}
