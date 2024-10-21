import {EventsHandler, IEventHandler} from '@nestjs/cqrs';
import {AccountDisabledEvent, AccountEnabledEvent, AccountRegisteredEvent} from '../account/account.events';

@EventsHandler(AccountRegisteredEvent, AccountDisabledEvent, AccountEnabledEvent)
export class PaymentMechanismProjection implements IEventHandler<AccountRegisteredEvent | AccountDisabledEvent | AccountEnabledEvent> {
  private currentPaymentMechanismTotal: number = 0;

  constructor() {
    console.log('Account info Projection instance created:', this);
  }

  handle(event: AccountRegisteredEvent | AccountDisabledEvent | AccountEnabledEvent): void {
    if (event instanceof AccountRegisteredEvent) {
      this.handleAccountRegistered(event);
    } else if (event instanceof AccountDisabledEvent) {
      this.handleAccountDisabled(event);
    } else if (event instanceof AccountEnabledEvent) {
      this.handleAccountEnabled(event);
    }
  }

  handleAccountRegistered(event: AccountRegisteredEvent) {
    const pmCount = parseInt(event.paymentmechanismCount,10);
    this.currentPaymentMechanismTotal += pmCount;
    console.log("currentPaymentMechanismTotal", this.currentPaymentMechanismTotal)
  }

  handleAccountDisabled(event: AccountDisabledEvent) {
    const pmCount = parseInt(event.paymentmechanismCount,10);
    this.currentPaymentMechanismTotal -= pmCount;
    console.log("currentPaymentMechanismTotal", this.currentPaymentMechanismTotal)
  }

  handleAccountEnabled(event: AccountEnabledEvent) {
    const pmCount = parseInt(event.paymentmechanismCount,10);
    this.currentPaymentMechanismTotal += pmCount;
    console.log("currentPaymentMechanismTotal", this.currentPaymentMechanismTotal)
  }
}
