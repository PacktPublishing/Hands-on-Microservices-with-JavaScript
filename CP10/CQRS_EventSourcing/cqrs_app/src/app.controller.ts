import {Module} from '@nestjs/common'
import {AccountUnitController} from './api/account.controller'
import {CommandBus} from '@nestjs/cqrs' // Angenommen, dieser Service ist erforderlich

@Module({
  controllers: [AccountUnitController],
  providers: [CommandBus], // und andere benötigte Services
})
export class StorageModule {}
