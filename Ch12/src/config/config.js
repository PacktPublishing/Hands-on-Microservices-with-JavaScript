const dotenv = require('dotenv');
const Joi = require('joi');

const envVarsSchema = Joi.object()
    .keys({
        PORT: Joi.number().default(443),
        MONGODB_URL: Joi.string().required().description('Mongo DB url')
    })
    .unknown();

    function createConfig(configPath) {
        // Load environment variables from the .env file first if they exist
        dotenv.config({ path: configPath });
        // Now validate the environment variables, preferring those in process.env
        const { value: envVars, error } = envVarsSchema
            .prefs({ errors: { label: 'key' } })
            .validate({
                PORT: process.env.PORT || dotenv.config({ path: configPath }).parsed.PORT,
                MONGODB_URL: process.env.MONGODB_URL || dotenv.config({ path: configPath }).parsed.MONGODB_URL
            });
        if (error) {
            throw new Error(`Config validation error: ${error.message}`);
        }
        return {
            port: envVars.PORT,
            mongo: {
                url: envVars.MONGODB_URL,
            } }; }
    

module.exports = {
    createConfig,
};
