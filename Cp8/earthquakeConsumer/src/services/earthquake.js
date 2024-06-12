const Kafka = require('node-rdkafka');
const { createConfig } = require('../config/config');
const path = require('path');

class EarthquakeEventConsumer {

    async consumeData() {
        const configPath = path.join(__dirname, '../../configs/.env');
        const appConfig = createConfig(configPath);

        // Read from the librdtesting-01 topic... note that this creates a new stream on each call!
        var stream = Kafka.KafkaConsumer.createReadStream({
            'metadata.broker.list': appConfig.kafka.brokers,
            'group.id': appConfig.kafka.groupID,
            'socket.keepalive.enable': true,
            'enable.auto.commit': false
        }, {}, {
            topics: appConfig.kafka.topic,
            waitInterval: 0,
            objectMode: false
        });

        stream.on('data', (message) => {
            console.log('Got message');
            console.log(JSON.parse(message));
        });
    }
}

module.exports = EarthquakeEventConsumer;