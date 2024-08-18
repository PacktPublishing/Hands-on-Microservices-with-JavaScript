import {Module, OnModuleInit} from '@nestjs/common';
import {CqrsModule} from '@nestjs/cqrs';
import {AccountUnitController} from './account.controller';
import {
  DisableAccountUnitHandler,
  EnableAccountUnitHandler,
  RegisterAccountUnitHandler,
  AccountDisabledEventHandler,
  AccountEnabledEventHandler,
  AccountRegisteredEventHandler
} from '../account/account.aggregate';
import {PaymentMechanismProjection} from "../paymentmechanism/paymentmechanism-total.projection";
import {client as eventStore} from '../eventstore'
import {streamNameFilter} from "@eventstore/db-client";

@Module({
  imports: [CqrsModule],
  controllers: [AccountUnitController],
  providers: [
    RegisterAccountUnitHandler,
    EnableAccountUnitHandler,
    DisableAccountUnitHandler,
    AccountRegisteredEventHandler,
    AccountEnabledEventHandler,
    AccountDisabledEventHandler,
    PaymentMechanismProjection,
  ],
})
export class AccountModule implements OnModuleInit {
  async onModuleInit() {
    this.startSubscription();
  }

  private startSubscription() {
    (async (): Promise<void> => {
      await this.subscribeToAll();
    })();
  }

  private async subscribeToAll() {
    const subscriptionList = eventStore.subscribeToAll({
      filter: streamNameFilter({ prefixes: ["Account-unit-stream-"] }),
    });

    for await (const subscriptionItem of subscriptionList) {
      console.log(
          `Handled event ${subscriptionItem.event?.revision}@${subscriptionItem.event?.streamId}`
      );
      const subscriptionData: any = subscriptionItem.event.data;
      console.log("subscription data:", subscriptionData);
    }
  }
}
