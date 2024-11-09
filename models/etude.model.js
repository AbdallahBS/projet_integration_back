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
    dayOfWeek: {
      type: DataTypes.STRING,
      allowNull: false,  // e.g., "Saturday"
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
    matiereId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Matiere,
        key: 'id',
      },
    },
  }, {
    timestamps: true,
    tableName: 'etudes',
  });
  
module.exports = Etude;
