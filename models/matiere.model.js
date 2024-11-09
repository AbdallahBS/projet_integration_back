// matiere.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/database'); // Adjust this path as per your setup

const Matiere = sequelize.define('Matiere', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Each subject should have a unique name
  },

}, {
  timestamps: true,
  tableName: 'matieres',
});

module.exports = Matiere;
