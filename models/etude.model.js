const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const Enseignant = require('./enseignant.model');
const Matiere = require('./matiere.model');

const Etude = sequelize.define('Etude', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    niveau: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    startTime: {
      type: DataTypes.TIME,
      allowNull: false,  // e.g., "08:00"
    }, 
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,  // e.g., "10:00"
    },
    enseignantId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Enseignant,
        key: 'id',
      },
    },
    matiere: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: true,
    tableName: 'etudes',
  });
  
module.exports = Etude;
