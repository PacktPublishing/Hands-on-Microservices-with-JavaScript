const express = require('express');
const EarthquakeEventProducer = require('./services/earthquake');

const app = express();
const earthquakeProducer = new EarthquakeEventProducer();

// Function to run streaming
app.post('/earthquake-events/start', async (req, res) => {
    earthquakeProducer.runEarthquake();
    res.status(200).send('Earthquake event stream started');
});

// Stop the earthquake event stream
app.post('/earthquake-events/stop', (req, res) => {
    earthquakeProducer.stopEarthquake();
    res.status(200).send('Earthquake event stream stopped');
});

module.exports = app;