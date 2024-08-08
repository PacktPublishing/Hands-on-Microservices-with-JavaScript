/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, HttpStatus, Res } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Response } from 'express';
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService  
  ) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto, @Res() response: Response) {
    try {
      const result = await this.transactionService.create(createTransactionDto);
      return response.status(HttpStatus.CREATED).json(result);
    } catch (e) {
      return response.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @Post(':id')
  fraud(@Param('id') id: string) {
    return this.transactionService.fraud(+id);
  }

  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }
}
