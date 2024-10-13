const Enseignant = require('../models/enseignant.model'); // Assuming this is the model file
const Classe = require('../models/classe.model'); // Assuming this is the model file
const EnseignantClasse = require('../models/enseignantClasse.model'); // Assuming this is the model file

// Create a new Enseignant and associate with classes
const createEnseignant = async (req, res) => {
  const { nom, prenom, numerotel, classeIds, matiere } = req.body;

  try {
    // Create a new Enseignant
    const enseignant = await Enseignant.create({ nom, prenom, numerotel });

    // Associate the Enseignant with Classes if classeIds are provided
    if (classeIds && classeIds.length > 0) {
      const enseignantClasses = classeIds.map((classeId) => ({
        enseignantId: enseignant.id,
        classeId,
        matiere,
      }));
      await EnseignantClasse.bulkCreate(enseignantClasses);
    }

    return res.status(201).json({ message: 'Enseignant created successfully', enseignant });
  } catch (error) {
    console.error('Error creating Enseignant:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Get all Enseignants
const getEnseignants = async (req, res) => {
  try {
    const enseignants = await Enseignant.findAll({
      include: {
        model: Classe,
        as: 'classes',
        through: { attributes: ['matiere'] }, // Include 'matiere' from the junction table
      },
    });

    return res.status(200).json(enseignants);
  } catch (error) {
    console.error('Error fetching Enseignants:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Get a single Enseignant by ID
const getEnseignantById = async (req, res) => {
  const { id } = req.params;

  try {
    const enseignant = await Enseignant.findByPk(id, {
      include: {
        model: Classe,
        as: 'classes',
        through: { attributes: ['matiere'] }, // Include 'matiere' from the junction table
      },
    });
    
    if (!enseignant) {
      return res.status(404).json({ message: 'Enseignant not found' });
    }
    res.status(200).json(enseignant);
  } catch (error) {
    console.error('Error retrieving enseignant:', error);
    res.status(500).json({ message: 'Error retrieving enseignant', error: error.message });
  }
};

// Update an Enseignant by ID
const updateEnseignant = async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, numerotel, classeIds, matiere } = req.body;

  try {
    const enseignant = await Enseignant.findByPk(id);
    if (!enseignant) {
      return res.status(404).json({ message: 'Enseignant not found' });
    }

    // Update enseignant details
    enseignant.nom = nom;
    enseignant.prenom = prenom;
    enseignant.numerotel = numerotel;

    await enseignant.save();

    // Update associated classes
    await EnseignantClasse.destroy({ where: { enseignantId: enseignant.id } });
    if (classeIds && classeIds.length > 0) {
      const enseignantClasses = classeIds.map((classeId) => ({
        enseignantId: enseignant.id,
        classeId,
        matiere,
      }));
      await EnseignantClasse.bulkCreate(enseignantClasses);
    }

    res.status(200).json({ message: 'Enseignant updated successfully', enseignant });
  } catch (error) {
    console.error('Error updating enseignant:', error);
    res.status(500).json({ message: 'Error updating enseignant', error: error.message });
  }
};

// Delete an Enseignant by ID
const deleteEnseignant = async (req, res) => {
  const { id } = req.params;

  try {
    const enseignant = await Enseignant.findByPk(id);
    if (!enseignant) {
      return res.status(404).json({ message: 'Enseignant not found' });
    }

    await enseignant.destroy();
    // Optionally, you can also delete related records in EnseignantClasse
    await EnseignantClasse.destroy({ where: { enseignantId: enseignant.id } });

    res.status(200).json({ message: 'Enseignant deleted successfully' });
  } catch (error) {
    console.error('Error deleting enseignant:', error);
    res.status(500).json({ message: 'Error deleting enseignant', error: error.message });
  }
};

module.exports = {
  createEnseignant,
  getEnseignants,
  getEnseignantById,
  updateEnseignant,
  deleteEnseignant,
};
