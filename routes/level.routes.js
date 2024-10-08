
const express = require('express');
const router = express.Router();
const {
    createLevel,
    getAllLevels,
    getLevelById,
    updateLevel,
    deleteLevel
  } = require('../controller/level.controller');

// Create a new level
router.post('/levels', createLevel);

// Get all levels
router.get('/levels', getAllLevels);

// Get a level by ID
router.get('/levels/:id', getLevelById);

// Update a level by ID
router.put('/levels/:id', updateLevel);

// Delete a level by ID
router.delete('/levels/:id', deleteLevel);

module.exports = router;
