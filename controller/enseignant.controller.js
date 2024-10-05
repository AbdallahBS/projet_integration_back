const Enseignant = require('../models/enseignant.model'); // Assuming this is the model file

// Create a new Enseignant
const createEnseignant = async (req, res) => {
  const { nom, prenom, numerotel, classe } = req.body;
  console.log(nom,prenom,numerotel,classe);
  
  
  try {
    const newEnseignant = await Enseignant.create({ nom, prenom, numerotel, classe });
    res.status(201).json(newEnseignant);
  } catch (error) {
    res.status(500).json({ message: 'Error creating enseignant', error });
  }
};

// Get all Enseignants
const getAllEnseignants = async (req, res) => {
  try {
    const enseignants = await Enseignant.findAll();
    res.status(200).json(enseignants);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving enseignants', error });
  }
};

// Get a single Enseignant by ID
const getEnseignantById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const enseignant = await Enseignant.findByPk(id);
    if (!enseignant) {
      return res.status(404).json({ message: 'Enseignant not found' });
    }
    res.status(200).json(enseignant);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving enseignant', error });
  }
};

// Update an Enseignant by ID
const updateEnseignant = async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, numerotel, classe } = req.body;
  
  try {
    const enseignant = await Enseignant.findByPk(id);
    if (!enseignant) {
      return res.status(404).json({ message: 'Enseignant not found' });
    }

    enseignant.nom = nom;
    enseignant.prenom = prenom;
    enseignant.numerotel = numerotel;
    enseignant.classe = classe;

    await enseignant.save();
    res.status(200).json(enseignant);
  } catch (error) {
    res.status(500).json({ message: 'Error updating enseignant', error });
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
    res.status(200).json({ message: 'Enseignant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting enseignant', error });
  }
};

module.exports = {
  createEnseignant,
  getAllEnseignants,
  getEnseignantById,
  updateEnseignant,
  deleteEnseignant
};
