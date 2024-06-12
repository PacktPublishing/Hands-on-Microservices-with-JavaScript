const express = require('express');
const earthquake = require('./services/earthquake');

const app = express();

// Function to handle incoming earthquake event data
app.post('/earthquake-events', async (req, res) => {
    new earthquake().runEarthquake();
});

module.exports = app;