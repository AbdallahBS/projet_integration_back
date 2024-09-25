const express = require('express');
const app = express();
const PORT = 3000;

// Define a route
app.get('/', (req, res) => {
  res.send('ISETKELIBIA PROJECT');
});

// Start the server
app.listen(PORT, () => {
  console.log(` this our project server (isetkelibia) Server is running on http://localhost:${PORT}`);
});
