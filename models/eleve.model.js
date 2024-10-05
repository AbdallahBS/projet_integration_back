const { DataTypes } = require('sequelize');
const sequelize = require('../db/database'); // Assuming you have a config for your Sequelize instance

const Eleve = sequelize.define('Eleve', {
  id: {
    type: DataTypes.UUID, // Using UUID for the id
    defaultValue: DataTypes.UUIDV4,   
    primaryKey: true,
    allowNull: false,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  classe: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  niveau: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'eleves', // Define the table name
});

module.exports = Eleve;