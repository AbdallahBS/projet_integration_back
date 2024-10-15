const { DataTypes } = require('sequelize');
const sequelize = require('../db/database'); // Assuming you have a config for your Sequelize instance
const Historique = require('./historique.model'); // Import Historique model

const Superadmin = sequelize.define('Admin', {
  id: {
    type: DataTypes.UUID, // Using UUID for the id
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  mdp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  role: {
    type: DataTypes.ENUM('superadmin', 'admin'), 
    allowNull: false,
    defaultValue: 'superadmin',
  },

  
}, {
  timestamps: true,
  tableName: 'admins', 
});


module.exports = Superadmin;
