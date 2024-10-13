const { DataTypes } = require('sequelize');
const sequelize = require('../db/database'); // Assuming you have a config for your Sequelize instance
const Classe = require('./classe.model'); // Import the Classe model

const Eleve = sequelize.define('Eleve', {
  id: {
    type: DataTypes.UUID, // Using UUID for the id
    defaultValue: DataTypes.UUIDV4,   
    primaryKey: true,
    allowNull: false,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  classeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'classes', // 'classes' refers to table name
      key: 'id',
    },
  },
}, {
  timestamps: true,
  tableName: 'eleves', // Define the table name
});



//Eleve.belongsTo(Classe, {
///  foreignKey: 'classeId',
 // as: 'classe',
//});

module.exports = Eleve;