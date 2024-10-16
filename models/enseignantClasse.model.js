const { DataTypes } = require('sequelize');
const sequelize = require('../db/database'); // Assuming you have a configured Sequelize instance
const Enseignant = require('./enseignant.model');
const Classe = require('./classe.model');

// Define the junction table for Enseignant and Classe with Matière
const EnseignantClasse = sequelize.define('EnseignantClasse', {
  enseignantId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'enseignants', // Reference to Enseignant table
      key: 'id',
    },
  },
  classeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'classes', // Reference to Classe table
      key: 'id',
    },
  },
  matiere: {
    type: DataTypes.STRING,
    allowNull: false, // Matière (subject) is required
  },
}, {
  timestamps: true,
  tableName: 'enseignant_classes',
});

module.exports = EnseignantClasse;
