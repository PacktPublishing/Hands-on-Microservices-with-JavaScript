const path = require('path');
const db = require('./db');
const app = require('./app');
const { createConfig } = require('./config/config');
//const { logger } = require('./log/logger');

async function execute() {
    const configPath = path.join(__dirname, '../configs/.env');
    const appConfig = createConfig(configPath);

    await db.connect(appConfig);
    const server = app.listen(appConfig.port, () => {
        //logger.info('account service started', { port: appConfig.port });
    });

    const closeServer = () => {
        if (server) {
            server.close(() => {
                //logger.info('server closed');
                process.exit(1);
            });
        } else {
            process.exit(1);
        }
    };

    const unexpectedError = (error) => {
        //logger.error('unhandled error', { stack: { error } });
        closeServer();
    };

    process.on('uncaughtException', unexpectedError);
    process.on('unhandledRejection', unexpectedError);
}

execute();
