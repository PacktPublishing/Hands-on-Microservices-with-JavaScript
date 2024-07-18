import {
  AggregateRoot,
  CommandHandler,
  EventPublisher,
  EventsHandler,
  ICommandHandler,
  IEventHandler,
} from '@nestjs/cqrs'
import {AccountDisabledEvent, AccountEnabledEvent, AccountRegisteredEvent} from './account.events'
import {DisableAccountUnitCommand, EnableAccountUnitCommand, RegisterAccountUnitCommand,} from './account.commands'
import {jsonEvent} from "@eventstore/db-client";
import {client as eventStore} from '../eventstore'

export class AccountAggregate extends AggregateRoot {
  private id: string;
  private paymentmechanismCount: string;
  disabled: boolean = false;

  constructor() {
    super();
  }

  registerAccount(aggregateId: string, paymentmechanismCount: string) {
    this.apply(new AccountRegisteredEvent(aggregateId, paymentmechanismCount));
  }

  enableAccount(): void {
    if(this.disabled) {
      this.apply(new AccountEnabledEvent(this.id, this.paymentmechanismCount))
    }
  }

  disableAccount() {
    if (!this.disabled) {
      this.apply(new AccountDisabledEvent(this.id, this.paymentmechanismCount));
    }
  }

  applyAccountRegisteredEventToAggregate(event: AccountRegisteredEvent): void {
    this.id = event.aggregateId;
    this.paymentmechanismCount = event.paymentmechanismCount;
    this.disabled = false;
  }

  accountDisabled() {
    this.disabled = true;
  }

  accountEnabled() {
    this.disabled = false;
  }

  static async loadAggregate(aggregateId: string): Promise<AccountAggregate> {
    const events = eventStore.readStream('Account-unit-stream-' + aggregateId);
    let count = 0;
    const aggregate = new AccountAggregate();

    for await (const event of events) {
      const eventData: any = event.event.data;
      try {
        switch (event.event.type) {
          case 'AccountUnitCreated':
            aggregate.applyAccountRegisteredEventToAggregate({
              aggregateId: eventData.id,
              paymentmechanismCount: eventData.paymentmechanismCount,
            });
            break;
          case 'AccountUnitDisabled':
            aggregate.accountDisabled();
            break;
          case 'AccountUnitEnabled':
            aggregate.accountEnabled();
            break;
          default:
            break
        }
      } catch(e) {
        console.error("Could not process event")
      }
      count++;
    }

    return aggregate;
  }
}

@CommandHandler(RegisterAccountUnitCommand)
export class RegisterAccountUnitHandler
  implements ICommandHandler<RegisterAccountUnitCommand>
{
  constructor(private readonly publisher: EventPublisher) {} 


  async execute(command: RegisterAccountUnitCommand): Promise<void> {

    const aggregate = this.publisher.mergeObjectContext(new AccountAggregate())
    aggregate.registerAccount(command.aggregateId, command.paymentmechanismCount)
    aggregate.commit()
  }
}

@CommandHandler(DisableAccountUnitCommand)
export class DisableAccountUnitHandler implements ICommandHandler<DisableAccountUnitCommand> {
  constructor(private readonly publisher: EventPublisher) {}

  async execute(command: DisableAccountUnitCommand): Promise<void> {
    const aggregate = this.publisher.mergeObjectContext(
        await AccountAggregate.loadAggregate(command.aggregateId)
    );
    if (!aggregate.disabled) {
      aggregate.disableAccount();
      aggregate.commit();
    }
  }
}

@CommandHandler(EnableAccountUnitCommand)
export class EnableAccountUnitHandler implements ICommandHandler<EnableAccountUnitCommand> {
  constructor(private readonly publisher: EventPublisher) {}

  async execute(command: EnableAccountUnitCommand): Promise<void> {
    const aggregate = this.publisher.mergeObjectContext(
        await AccountAggregate.loadAggregate(command.aggregateId)
    );
    if (aggregate.disabled) {
      aggregate.enableAccount();
      aggregate.commit();
    }
  }
}


interface AccountEvent {
  aggregateId: string;
  paymentmechanismCount: string;
}

async function handleAccountEvent(eventType: string, event: AccountEvent): Promise<void> {
  const eventData = jsonEvent({
    type: eventType,
    data: {
      id: event.aggregateId,
      paymentmechanismCount: event.paymentmechanismCount,
    },
  });

  await eventStore.appendToStream(
    'Account-unit-stream-' + event.aggregateId,
    [eventData],
  );
}

@EventsHandler(AccountRegisteredEvent)
export class AccountRegisteredEventHandler
  implements IEventHandler<AccountRegisteredEvent> {
  async handle(event: AccountRegisteredEvent): Promise<void> {
    await handleAccountEvent('AccountUnitCreated', event);
  }
}

@EventsHandler(AccountDisabledEvent)
export class AccountDisabledEventHandler implements IEventHandler<AccountDisabledEvent> {
  async handle(event: AccountDisabledEvent): Promise<void> {
    await handleAccountEvent('AccountUnitDisabled', event);
  }
}

@EventsHandler(AccountEnabledEvent)
export class AccountEnabledEventHandler implements IEventHandler<AccountEnabledEvent> {
  async handle(event: AccountEnabledEvent): Promise<void> {
    await handleAccountEvent('AccountUnitEnabled', event);
  }
}
