import {Controller, Param, Post, Query} from '@nestjs/common'
import {CommandBus} from '@nestjs/cqrs'
import {
  DisableAccountUnitCommand,
  EnableAccountUnitCommand,
  RegisterAccountUnitCommand
} from '../account/account.commands'
import {v4 as uuid} from 'uuid'


@Controller('Account')
export class AccountUnitController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/register')
  async registerAccount(@Query('paymentmechanismCount') paymentmechanismCount: string): Promise<any> {
    const aggregateId = uuid()
    await this.commandBus.execute(new RegisterAccountUnitCommand(aggregateId, paymentmechanismCount))
    return { message: 'Request received as a command', aggregateId };
  }

  @Post('/:id/disable')
  async disableAccount(@Param('id') id: string): Promise<any> {
    await this.commandBus.execute(new DisableAccountUnitCommand(id))
    return { message: 'Request received as a command' };
  }

  @Post('/:id/enable')
  async enableAccount(@Param('id') id: string): Promise<any> {
    await this.commandBus.execute(new EnableAccountUnitCommand(id))
    return { message: 'Request received as a command' };
  }

}
