const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const Etude = require('./etude.model');

const Seance = sequelize.define('Seance', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,  // e.g., "2024-10-03"
    },
    etudeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Etude,
        key: 'id',
      },
    },
  }, {
    timestamps: true,
    tableName: 'seances',
  });

// Associations to be set in index.js
module.exports = Seance;
