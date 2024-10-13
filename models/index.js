const Eleve = require('./eleve.model');
const Classe = require('./classe.model');
const EnseignantClasse = require('./enseignantClasse.model');
const Enseignant = require('./enseignant.model');

// Set up associations after all models are defined

// One-to-Many: Classe -> Eleve
Classe.hasMany(Eleve, { foreignKey: 'classeId', as: 'eleves' });
Eleve.belongsTo(Classe, { foreignKey: 'classeId', as: 'classe' });

// Many-to-Many: Enseignant <-> Classe through EnseignantClasse
Enseignant.belongsToMany(Classe, { through: EnseignantClasse, foreignKey: 'enseignantId', as: 'classes' });
Classe.belongsToMany(Enseignant, { through: EnseignantClasse, foreignKey: 'classeId', as: 'enseignants' });

const initModels = async () => {
  try {
    // Ensure all models are initialized and synced here
    await Classe.sync(); // Sync Classe first as other models depend on it
    await Eleve.sync(); // Then sync Eleve
    await Enseignant.sync(); // Sync Enseignant next
    await EnseignantClasse.sync(); // Finally sync the junction table EnseignantClasse

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
  initModels,
};
