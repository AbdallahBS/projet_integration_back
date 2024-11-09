const Matiere = require('../models/matiere.model'); // Path to your Matiere model

// Controller to create a new Matiere
exports.createMatiere = async (req, res) => {
  try {
    const { name } = req.body; // Assuming you're sending 'name' in the body

    // Validate the input
    if (!name) {
      return res.status(400).json({ message: 'Matiere name is required' });
    }

    // Check if the Matiere already exists
    const existingMatiere = await Matiere.findOne({ where: { name } });
    if (existingMatiere) {
      return res.status(400).json({ message: 'Matiere with this name already exists' });
    }

    // Create the new Matiere
    const newMatiere = await Matiere.create({ name });

    // Return success response
    res.status(201).json({
      message: 'Matiere created successfully',
      data: newMatiere,
    });
  } catch (error) {
    console.error('Error creating Matiere:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
