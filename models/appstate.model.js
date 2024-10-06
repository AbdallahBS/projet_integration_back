const { DataTypes } = require('sequelize');
const sequelize = require('../db/database'); // Assuming you have a config for your Sequelize instance

const Appstate = sequelize.define('Appstate', {
    isInitialized: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    superAdminId: {
        type: DataTypes.UUID,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'Appstate',
});

module.exports = Appstate;