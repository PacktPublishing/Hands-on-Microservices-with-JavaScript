import {Module} from '@nestjs/common'
import {AccountUnitController} from './api/account.controller'
import {CommandBus} from '@nestjs/cqrs'

@Module({
  controllers: [AccountUnitController],
  providers: [CommandBus], 
})
export class StorageModule {}
