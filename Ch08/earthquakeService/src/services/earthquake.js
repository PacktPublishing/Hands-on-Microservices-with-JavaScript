const Kafka = require('node-rdkafka');
const { createConfig } = require('../config/config');
const path = require('path');

class EarthquakeEventProducer {
    constructor() {
        this.intervalId = null;
    }
    #generateEarthquakeEvent() {
        return {
            id: Math.random().toString(36).substring(2, 15),
            magnitude: Math.random() * 9, // Random magnitude between 0 and 9
            location: {
                latitude: Math.random() * 180 - 90, // Random latitude between -90 and 90
                longitude: Math.random() * 360 - 180, // Random longitude between -180 and 180
            },
            timestamp: Date.now(),
        };
    }

    async runEarthquake() {
        const configPath = path.join(__dirname, '../../configs/.env');
        const appConfig = createConfig(configPath);

        // Returns a new writable stream
        const stream = Kafka.Producer.createWriteStream({
            'metadata.broker.list': appConfig.kafka.brokers,
            'client.id': appConfig.kafka.clientID
        }, {}, {
            topic: appConfig.kafka.topic
        });

        // To make our stream durable we listen to this event
        stream.on('error', (err) => {
            console.error('Error in our kafka stream');
            console.error(err);
        });

       this.intervalId  = setInterval(async () => {
            const event = await this.#generateEarthquakeEvent();
            // Writes a message to the stream
            const queuedSuccess = stream.write(Buffer.from(JSON.stringify(event)));

            if (queuedSuccess) {
                console.log('The message has been queued!');
            } else {
                // If the stream's queue is full
                console.log('Too many messages in queue already');
            }
        }, 100);
    }

    stopEarthquake() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log('Earthquake event stream stopped.');
        } else {
            console.log('No running earthquake event stream to stop.');
        }
    }
}

module.exports = EarthquakeEventProducer;