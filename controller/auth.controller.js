const bcrypt = require('bcrypt');
const Superadmin = require('../models/superadmin.model'); // Import the Superadmin model
 
 // Register
// Signup route
const signup = async (req, res) => {
    const { username, password, avatar, role } = req.body;
  
    try {
      // Check if the username already exists
      const userExists = await Superadmin.findOne({ where: { username } });
      if (userExists) {
        return res.status(400).json({ error: 'Username already exists' });
      }
  
      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create the new user
      const newUser = await Superadmin.create({
        mdp: hashedPassword,
        username,
        avatar,
        role
      });
  
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          username: newUser.username,
          avatar: newUser.avatar,
          role: newUser.role
        }, // Return the newly created user (without the password)
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  module.exports = { signup }; // Export the login function using CommonJS syntax
