import { IsString, IsOptional, IsNotEmpty,IsUUID } from 'class-validator';


export class CreateTransactionDto {

  @IsUUID()
  @IsNotEmpty()
  accountId: string;


  @IsOptional()
  @IsString()
  description?: string;
}

