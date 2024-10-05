const express = require('express');
const {
  createEnseignant,
  getAllEnseignants,
  getEnseignantById,
  updateEnseignant,
  deleteEnseignant
} = require('../controller/enseignant.controller');

const router = express.Router();

router.post('/enseignants', createEnseignant); // Create a new enseignant
router.get('/enseignants', getAllEnseignants); // Get all enseignants
router.get('/enseignants/:id', getEnseignantById); // Get a specific enseignant by ID
router.put('/enseignants/:id', updateEnseignant); // Update a specific enseignant by ID
router.delete('/enseignants/:id', deleteEnseignant); // Delete a specific enseignant by ID

module.exports = router;
