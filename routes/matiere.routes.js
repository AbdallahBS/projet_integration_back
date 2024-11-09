const express = require('express');
const router = express.Router();
const matiereController = require('../controller/matiere.controller'); // Path to your controller

// Route to create a new Matiere
router.post('/matieres', matiereController.createMatiere);

module.exports = router;
 