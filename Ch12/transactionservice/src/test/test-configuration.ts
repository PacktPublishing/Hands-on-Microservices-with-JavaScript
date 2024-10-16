// test/test-configuration.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionModule } from '../transaction/transaction.module';
import * as dotenv from 'dotenv';

dotenv.config();

export const testConfiguration = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: 5438,
        username: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
        database: process.env.POSTGRES_DB || 'tservice_db',
        autoLoadEntities: true,
        synchronize: true,
      }),
      ClientsModule.register([
        {
          name: 'KAFKA_SERVICE',
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'nestjs-kafka',
              brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
            },
            consumer: {
              groupId: 'nestjs-group',
            },
          },
        },
      ]),
      TransactionModule,
    ],
  }).compile();

  return moduleFixture;
};
