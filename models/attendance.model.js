const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Attendance = sequelize.define('Attendance', {
      attendanceStatus: {
        type: DataTypes.ENUM('present', 'absent'),
        allowNull: false,
      },
      // You can also add other fields like date if you want to track attendance on specific days
    },
    {
        timestamps: true,
        tableName: 'attendances',
      }); 
  
  
  

module.exports = Attendance;
