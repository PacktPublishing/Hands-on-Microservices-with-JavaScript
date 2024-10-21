const express = require('express');
const axios = require('axios'); // Requires the axios library for making HTTP requests

const app = express();
const port = 3001; // Port on which the server will listen

app.get('/posts/:id', async (req, res) => {
  const postId = req.params.id; // Extract the ID from the URL parameter

  try {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
    const post = response.data;

    if (post) {
      res.json(post); // Send the retrieved post data as JSON response
    } else {
      res.status(404).send('Post not found'); // Respond with 404 if post not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error'); // Handle errors with 500 status
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});