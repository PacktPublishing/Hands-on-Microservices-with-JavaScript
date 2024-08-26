const path = require('path');
const db = require('./db');
const app = require('./app');
const { createConfig } = require('./config/config');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(), // Log to the console
  ],
});

async function execute() {
    logger.info('preparing account service ...');
    const configPath = path.join(__dirname, '../configs/.env');
    const appConfig = createConfig(configPath);
    logger.info({configPath:configPath});
    await db.connect(appConfig);
    const port = process.env.PORT || appConfig.port;
    const server = app.listen(port, () => {
        logger.info('account service started', { port: port });
    });

    const closeServer = () => {
        if (server) {
            server.close(() => {
                logger.error('server closed');
                process.exit(1);
            });
        } else {
            process.exit(1);
        }
    };

    const unexpectedError = (error) => {
        logger.error('unhandled error', { error });
        closeServer();
    };

    process.on('uncaughtException', unexpectedError);
    process.on('unhandledRejection', unexpectedError);
}

execute();
