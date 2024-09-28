const { DataTypes } = require('sequelize');
const sequelize = require('../db/database'); // Assuming you have a config for your Sequelize instance

const Superadmin = sequelize.define('Superadmin', {
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
  avatar: {
    type: DataTypes.STRING, 
    allowNull: true,
  },
  
}, {
  timestamps: true,
  tableName: 'superadmins', 
});

module.exports = Superadmin;
