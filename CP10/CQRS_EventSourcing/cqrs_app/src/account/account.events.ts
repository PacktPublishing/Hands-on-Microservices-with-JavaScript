import {UUID} from 'uuid'
import {IEvent} from "@nestjs/cqrs";

export class AccountEvent implements IEvent {
  constructor(
      public readonly aggregateId: UUID,
      public readonly paymentmechanismCount: string
  ) {}
}

export class AccountRegisteredEvent extends AccountEvent {}
export class AccountDisabledEvent extends AccountEvent {}
export class AccountEnabledEvent extends AccountEvent {}

