const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('postgres', 'postgres', 'admin', {
  //host: 'localhost',
  host: process.env.HOST,
  dialect: 'postgres', // Specify your database dialect
  logging: false, // Log SQL queries for debugging
  port: process.env.DB_PORT
  //port: 5433, // Set to true if you want to see SQL queries
});

module.exports = sequelize;