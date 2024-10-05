const { DataTypes } = require('sequelize');
const sequelize = require('../db/database'); // Assuming you have a config for your Sequelize instance

const Enseignant = sequelize.define('Enseignant', {
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
  numerotel: {
    type: DataTypes.STRING,
    allowNull: false, // Assuming phone number is required
  },
  classe: {
    type: DataTypes.ARRAY(DataTypes.STRING), // List of classes
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'enseignants', // Define the table name
});

module.exports = Enseignant;
