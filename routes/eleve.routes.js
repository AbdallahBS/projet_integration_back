const express = require('express');
const {
    createEleve,
    getAllEleves,
    getEleveById,
    getElevesByClasseId,
    updateEleve,
    deleteEleve
  } = require('../controller/eleve.controller');
const router = express.Router();

router.post('/eleves', createEleve);

router.get('/eleves',getAllEleves);

router.get('/classe/:classeId/eleves', getElevesByClasseId);

router.get('/eleves/:id', getEleveById);

router.put('/eleves/:id', updateEleve);

router.delete('/eleves/:id', deleteEleve);

module.exports = router;
