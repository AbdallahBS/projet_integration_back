const express = require('express');

const sequelize = require('./db/database')  // Import the database connection pool
const authRoutes = require('./routes/auth.routes');  // 
const app = express();
const port = 3000;


// Middleware to parse JSON
app.use(express.json());

// Simple route to check if the server is working
app.get('/', (req, res) => {
  res.send('Server is running!');
});
app.use('/auth', authRoutes);



const startServer = async () => {
  try {
    await sequelize.authenticate(); // Test database connection
    console.log('Database connected successfully.');

    // Sync all models
    await sequelize.sync(); // Creates the tables if they do not exist (and does not remove existing ones)
    console.log('All models were synchronized successfully.');

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Start the server
startServer();