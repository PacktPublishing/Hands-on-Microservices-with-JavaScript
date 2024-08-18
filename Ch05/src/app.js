const express = require('express');
const v1 = require('./routes/v1');

const app = express();

// service
app.use(express.json());


// V1 API
app.use('/v1', v1);

module.exports = app;
