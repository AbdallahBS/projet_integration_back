const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const { initModels } = require('./models');  // Import the initialization function

const sequelize = require('./db/database')  // Import the database connection pool
const authRoutes = require('./routes/auth.routes');  // 
const eleveRoutes = require('./routes/eleve.routes');  // 
const adminRoutes = require('./routes/admin.routes');
const enseignantRoutes = require('./routes/enseignant.routes');  // 
const classeRoutes = require('./routes/classe.routes');  // 
const enseignantClasseRoutes = require('./routes/enseignantClasse.routes');  // 
const dashboardRoutes = require('./routes/dashbord.routes');
const etudeRoutes = require('./routes/etude.routes');
const matiereRoutes = require('./routes/matiere.routes'); // Adjust the path as necessary


const app = express();
const port = 3000;
const host = process.env.HOST;

app.use(cors({
  origin: `http://${process.env.HOST}:4200`, // Allow requests from Angular app
  credentials: true, // If you need to send cookies or authorization headers
}));

//cors middlware

app.use(bodyParser.json());

// Middleware to parse JSON
app.use(express.json());

// Simple route to check if the server is working
app.get('/', (req, res) => {
  res.send('Server is running!');
});
app.use('/eleve', eleveRoutes);
app.use('/classe', classeRoutes);
app.use('/auth', authRoutes);
app.use('/enseignants', enseignantRoutes);
app.use('/api', adminRoutes);
app.use('/enseignantClasse', enseignantClasseRoutes);
app.use('/api', etudeRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', matiereRoutes); // All routes under '/api' will be handled by matiereRoutes


const startServer = async () => {
  try {
    await sequelize.authenticate(); // Test database connection
    console.log('Database connected successfully.');

    initModels();  // Initialize models and associations


    // Sync all models
    await sequelize.sync(); // Creates the tables if they do not exist (and does not remove existing ones)
    console.log('All models were synchronized successfully.');

    app.listen(port, host, () => {
      console.log(`Server running on http://${host}:${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Start the server
startServer();











