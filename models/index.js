const Eleve = require('./eleve.model');
const Classe = require('./classe.model');
const EnseignantClasse = require('./enseignantClasse.model');
const Historique = require('./historique.model'); // Import Historique model
const Admin = require('./admin.model'); // Adjust the path as necessary
const Enseignant = require('./enseignant.model');

// Set up associations after all models are defined

// One-to-Many: Classe -> Eleve
Classe.hasMany(Eleve, { foreignKey: 'classeId', as: 'eleves' });
Eleve.belongsTo(Classe, { foreignKey: 'classeId', as: 'classe' });

// Many-to-Many: Enseignant <-> Classe through EnseignantClasse
Enseignant.belongsToMany(Classe, { through: EnseignantClasse, foreignKey: 'enseignantId', as: 'classes' });
Classe.belongsToMany(Enseignant, { through: EnseignantClasse, foreignKey: 'classeId', as: 'enseignants' });




Admin.hasMany(Historique, {
  foreignKey: 'adminId', // This should match the key in the Historique model
  sourceKey: 'id',
  as: 'historiques' // Optional alias for association
});

Historique.belongsTo(Admin, {
  foreignKey: 'adminId', // This should match the key in the Historique model
  targetKey: 'id',
  as: 'admin' // Optional alias for association
});
const initModels = async () => {
  try {
    // Ensure all models are initialized and synced here
    await Classe.sync(); // Sync Classe first as other models depend on it
    await Eleve.sync(); // Then sync Eleve
    await Enseignant.sync(); // Sync Enseignant next
    await EnseignantClasse.sync(); // Finally sync the junction table EnseignantClasse
    await Historique.sync(); // Sync Historique

    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing models:', error);
  }
};

module.exports = {
  Eleve,
  Classe,
  Enseignant,
  EnseignantClasse,
  Historique,

  initModels,
};
