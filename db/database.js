const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'admin', {
  host: 'localhost',
  dialect: 'postgres', // Specify your database dialect
  logging: false, // Set to true if you want to see SQL queries
});

module.exports = sequelize;