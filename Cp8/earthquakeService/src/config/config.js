const dotenv = require('dotenv');
const Joi = require('joi');

const envVarsSchema = Joi.object()
    .keys({
        PORT: Joi.number().default(3000),
        KAFKA_CLIENT_ID: Joi.string().required(),
        KAFKA_BROKERS: Joi.string().required(),
        KAFKA_TOPIC: Joi.string().required()
    })
    .unknown();

function createConfig(configPath) {
    dotenv.config({ path: configPath });

    const { value: envVars, error } = envVarsSchema
        .prefs({ errors: { label: 'key' } })
        .validate(process.env);

    if (error) {
        throw new Error(`Config validation error: ${error.message}`);
    }

    return {
        port: envVars.PORT,
        kafka: {
            clientID: envVars.KAFKA_CLIENT_ID,
            brokers: envVars.KAFKA_BROKERS,
            topic: envVars.KAFKA_TOPIC
        }
    };
}

module.exports = {
    createConfig,
};
