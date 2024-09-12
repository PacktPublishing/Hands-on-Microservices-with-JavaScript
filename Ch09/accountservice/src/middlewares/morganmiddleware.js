const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const { logger } = require('../log/logger-logstash');

// Custom JSON format string for request logging
const morganFormat = JSON.stringify({
    method: ':method',
    url: ':url',
    status: ':status',
    responseTime: ':response-time ms',
    // Add additional custom fields here as needed
});

// Path to the combined.log file
const logFilePath = path.join(__dirname, '../../combined.log');

// Create a write stream for the log file
const logFileStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Custom message handler function for logging
function messageHandler(message) {
    const parsedMessage = JSON.parse(message.trim());

    // Write log to logstash
    logger.info('Request received for logging', parsedMessage);

    // Also write the log to combined.log file
    logFileStream.write(`${message}\n`);
}

// Create morgan middleware with custom format and stream
const morganMiddleware = morgan(morganFormat, {
    stream: {
        write: messageHandler,
    },
});

module.exports = morganMiddleware;
