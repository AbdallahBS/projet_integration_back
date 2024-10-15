const { DataTypes } = require('sequelize');
const sequelize = require('../db/database'); // Assuming you have a configured Sequelize instance
const Admin = require('./admin.model'); // Adjust the path as necessary

// Define the Historique model
const Historique = sequelize.define('Historique', {
  adminId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Admin, // Reference to Admin table
      key: 'id',
    },
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,  // Role of the admin is required
  },
  typeofaction: {
    type: DataTypes.STRING,
    allowNull: false,  // Type of action (e.g., 'إضافة تلميذ' - add student in Arabic)
    defaultValue: 'إضافة تلميذ',  // Default action
  },
  time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,  // Timestamp of the action, defaults to the current time
  },
}, {
  timestamps: true,  // Automatically adds createdAt and updatedAt fields
  tableName: 'historiques',  // Custom table name
});



module.exports = Historique;
