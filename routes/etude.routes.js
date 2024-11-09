// routes/etude.routes.js
const express = require('express');
const router = express.Router();
const etudeController = require('../controller/etude.controller');

// Create an Etude with associated Seances
router.post('/etudes', etudeController.createEtudeWithSeances);

//add eleves to etude
router.post('/addeleves', etudeController.addElevesToEtude);


//markpresentabsent
router.post('/etudes/:etudeId/seances/:seanceId/attendance', etudeController.markAttendance);



// Get all Etudes with associated Seances 
router.get('/etudes', etudeController.getAllEtudes);

// Get a specific Etude by ID with associated Seances
router.get('/etudes/:id', etudeController.getEtudeById);

// Update an Etude with associated Seances
router.put('/etudes/:id', etudeController.updateEtudeWithSeances);

// Delete an Etude and its associated Seances
router.delete('/etudes/:id', etudeController.deleteEtude);

module.exports = router;
