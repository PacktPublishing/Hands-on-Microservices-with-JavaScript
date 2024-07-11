const express = require('express');
const axios = require('axios'); // Requires the axios library for making HTTP requests

const app = express();
const port = 3002; // Port on which the server will listen

app.get('/users/:id', async (req, res) => {
    const userId = req.params.id; // Extract the ID from the URL parameter

    try {
        const response = await axios.get(`https://api.github.com/users/${userId}`);
        const user = response.data;
        if (user) {
            res.json(user); // Send the retrieved employee data as JSON response
        } else {
            res.status(404).send('User not found'); // Respond with 404 if employee not found
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error'); // Handle errors with 500 status
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});