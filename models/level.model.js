const { DataTypes } = require('sequelize');
const sequelize = require('../db/database'); // Assuming you have a config for your Sequelize instance
const Eleve = require('./eleve.model'); // Assuming Eleve model is defined in eleve.js

// Define the Level model
const Level = sequelize.define('Level', {
  id: {
    type: DataTypes.UUID, // Using UUID for the id
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  niveau: {
    type: DataTypes.ENUM('7', '8', '9'), // Limiting the values for niveau
    allowNull: false,
  },
  nomDeLevel: {
    type: DataTypes.STRING, // Name for the level
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'levels', // Define the table name
});

/**Level.hasMany(Eleve, {
  foreignKey: 'levelId', // Foreign key in Eleve table
  as: 'liste', // Alias for the list of students
});


Eleve.belongsTo(Level, {
  foreignKey: 'levelId',
  as: 'level',
});**/

module.exports = Level;
