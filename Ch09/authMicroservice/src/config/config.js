const dotenv = require('dotenv');
const Joi = require('joi');

const envVarsSchema = Joi.object()
    .keys({
        PORT: Joi.number().default(3006),
        MONGODB_URL: Joi.string().required().description('Mongo DB url'),
        SECRET_ACCESS_TOKEN: Joi.string().hex().required(),
        SECRET_REFRESH_TOKEN: Joi.string().hex().required(),
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
        mongo: {
            url: envVars.MONGODB_URL,
        },
        jwt: {
            access_token: envVars.SECRET_ACCESS_TOKEN,
            refresh_token: envVars.SECRET_REFRESH_TOKEN
        }
    };
}

module.exports = {
    createConfig,
};
