const Level = require('../models/level.model');
const Eleve = require('../models/eleve.model');

const levelController = {

// Create a new level
async createLevel(req, res) {
  try {
    const { niveau, nomDeLevel } = req.body;
    const newLevel = await Level.create({ niveau, nomDeLevel });
    res.status(201).json(newLevel);
  } catch (error) {
    res.status(500).json({ message: 'Error creating level', error });
  }
},

// Get all levels
async getAllLevels(req, res) {
  try {
    const levels = await Level.findAll(
    //{
    //  include: [{ model: Eleve, as: 'liste' }], // Include list of students
    //}
  );
    res.status(200).json(levels);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving levels', error });
  }
},

// Get a single level by ID
async getLevelById(req, res) {
  try {
    const { id } = req.params;
    const level = await Level.findByPk(id, {
      include: [{ model: Eleve, as: 'liste' }], // Include list of students
    });
    if (level) {
      res.status(200).json(level);
    } else {
      res.status(404).json({ message: 'Level not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving level', error });
  }
},

// Update a level
async updateLevel(req, res) {
  try {
    const { id } = req.params;
    const { niveau, nomDeLevel} = req.body;
    const updatedLevel = await Level.update(
      { niveau, nomDeLevel },
      { where: { id }, returning: true }
    );
    if (updatedLevel[1]) {
      res.status(200).json(updatedLevel[1][0]); // Send updated level back
    } else {
      res.status(404).json({ message: 'Level not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating level', error });
  }
},

// Delete a level
async deleteLevel(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Level.destroy({ where: { id } });
    if (deleted) {
      res.status(200).json({ message: 'Level deleted' });
    } else {
      res.status(404).json({ message: 'Level not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting level', error });
  }
},
}

module.exports = levelController;
