const { DataTypes } = require('sequelize');
const sequelize = require('../db/database'); // Your Sequelize instance
const Eleve = require('./eleve.model'); // Import the Classe model

// Define the Classe model
const Classe = sequelize.define('Classe', {
  id: {
    type: DataTypes.UUID, // Using UUID for the id
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },

  nomDeClasse: {
    type: DataTypes.STRING, 
    allowNull: false,
  },

niveau: {
    type: DataTypes.ENUM('7','8','9'), 
    allowNull: false,
  },
  
}, {
  timestamps: true,
  tableName: 'classes', 
});


module.exports = Classe;
