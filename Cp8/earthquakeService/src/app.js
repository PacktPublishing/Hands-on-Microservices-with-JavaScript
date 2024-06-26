const express = require('express');
const earthquake = require('./services/earthquake');

const app = express();

// Function to run streaming
app.post('/earthquake-events', async (req, res) => {
    new earthquake().runEarthquake();
});

module.exports = app;