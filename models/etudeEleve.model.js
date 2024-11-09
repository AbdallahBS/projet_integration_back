// etudeEleve.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const Etude = require('./etude.model');
const Eleve = require('./eleve.model');

const EtudeEleve = sequelize.define('EtudeEleve', {
  etudeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Etude,
      key: 'id',
    },
  },
  eleveId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Eleve,
      key: 'id',
    },
  },
}, {
  timestamps: true,
  tableName: 'etude_eleve', // Define the join table name
});

module.exports = EtudeEleve;
