const express = require('express');
const router = express.Router();
const classeController = require('../controller/classe.controller'); // Assuming the controller file is in this location

// Route to create a new class
router.post('/classes', classeController.createClasse);

// Route to get all classes
router.get('/classes', classeController.getAllClasses);

// Route to get a single class by ID
router.get('/classes/:id', classeController.getClasseById);

// Route to update a class
router.put('/classes/:id', classeController.updateClasse);

// Route to delete a class
router.delete('/classes/:id', classeController.deleteClasse);


router.get('/classes/niveau/:niveau', classeController.getClassesByNiveau);

module.exports = router;
