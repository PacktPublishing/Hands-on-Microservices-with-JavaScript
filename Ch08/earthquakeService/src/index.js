const path = require('path');
const app = require('./app');
const { createConfig } = require('./config/config');

async function execute() {
    const configPath = path.join(__dirname, '../configs/.env');
    const appConfig = createConfig(configPath);

    const server = app.listen(appConfig.port, () => {
        console.log('earthquake service started', { port: appConfig.port });
    });

    const closeServer = () => {
        if (server) {
            server.close(() => {
                console.log('server closed');
                process.exit(1);
            });
        } else {
            process.exit(1);
        }
    };

    const unexpectedError = (error) => {
        console.log('unhandled error', { error });
        closeServer();
    };

    process.on('uncaughtException', unexpectedError);
    process.on('unhandledRejection', unexpectedError);
}

execute();
