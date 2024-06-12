const express = require('express');
const earthquake = require('./services/earthquake');

const app = express();

new earthquake().consumeData();

module.exports = app;