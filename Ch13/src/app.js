const express = require('express');
const v1 = require('./routes/v1');

const app = express();

// service
app.use(express.json());

// Define a route for the welcome page
app.get('/welcome', (req, res) => {
    res.send('<h1>Welcome to Express.js Application!</h1>');
});
// V1 API
app.use('/v1', v1);

module.exports = app;
