const morgan = require('morgan');
const { logger } = require('./log/logger-logstash');

// Custom JSON format string for request logging
const morganFormat = JSON.stringify({
    method: ':method',
    url: ':url',
    status: ':status',
    responseTime: ':response-time ms',
    // Add additional custom fields here as needed
});

// Custom message handler function for logging
function messageHandler(message) {
    const parsedMessage = JSON.parse(message.trim());
    logger.info('Request received for logging', parsedMessage);
}

// Create morgan middleware with custom format and stream
const morganMiddleware = morgan(morganFormat, {
    stream: {
        write: messageHandler,
    },
});

module.exports = morganMiddleware;
