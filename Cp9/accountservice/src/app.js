const express = require('express');
const v1 = require('./routes/v1');
const consumerModule = require('./modules/kafkamodule');
const morganMiddleware = require('./morganmiddleware');

const app = express();

app.use(morganMiddleware);

consumerModule();

app.use(express.json());


// V1 API
app.use('/v1', v1);

module.exports = app;
