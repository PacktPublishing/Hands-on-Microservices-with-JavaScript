const { Kafka } = require('kafkajs');
const Account = require('../models/account');

const kafka = new Kafka({
    clientId: 'account-service',
    brokers: ['localhost:9092'], // Replace with your broker details
});

const consumer = kafka.consumer({ groupId: 'my-account-group' });

const consumerModule = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'transaction-service-topic' });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {

            const account = JSON.parse(message.value.toString());
            const accountId = account.accountId;
            try {
                const blockedAccount = await Account.findOne({ accountId, status: { $ne: 'blocked' } });

                if (!blockedAccount) {
                    const updatedAccount = await Account.updateOne({ accountId }, { $inc: { count: 1 } });
                    if (updatedAccount.count === 3)
                        await Account.updateOne({ accountId }, { status: 'blocked' });
                }
                else
                    console.log(`not a valid accountId ${accountId}`);
            }
            catch (error) {
                console.log(error);
            }
        },
    });
};

module.exports = consumerModule;
