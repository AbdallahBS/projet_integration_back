const bcrypt = require('bcrypt');
const Superadmin = require('../models/superadmin.model'); // Import the Superadmin model
const Admin = require('../models/admin.model'); // Import the Superadmin model

const generateTokenAndSetCookie = require('../utils/generateTokenAndSendCookies');

const jwt = require('jsonwebtoken');


// Signup route
const signup = async (req, res) => {
  const { username, password, avatar, role } = req.body;

  try {
      // Check if the username already exists in both Admin and Superadmin tables
      const userExistsInSuperadmin = await Superadmin.findOne({ where: { username } });
      const userExistsInAdmin = await Admin.findOne({ where: { username } });
      
      if (userExistsInSuperadmin || userExistsInAdmin) {
          return res.status(400).json({ error: 'Username already exists' });
      }

      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);

      let newUser;

      // Check if the role is "admin" and save in Admin table, otherwise save in Superadmin table
      if (role === 'admin') {
          newUser = await Admin.create({
              mdp: hashedPassword,
              username,
              avatar,
              role
          });
      } else {
          newUser = await Superadmin.create({
              mdp: hashedPassword,
              username,
              avatar,
              role
          });
      }

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
//signin
const signin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists in Superadmin table
    let user = await Superadmin.findOne({ where: { username } });
    
    // If the user is not found in Superadmin, check the Admin table
    if (!user) {
      user = await Admin.findOne({ where: { username } });
    }

    // If the user is not found in both tables, return an error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.mdp);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Successful login
    generateTokenAndSetCookie(res, user.id,user.role);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
      }, // Return user info without password
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

   const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({success:true, message:"logged out successfully"});
  };

  
  // Reset Password (for specific user, superadmin can reset any user's password)
  const resetPassword = async (req, res) => {
    const { token, newPassword, userId } = req.body; // userId is the specific user to reset
   console.log(token);
   
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const requestingUserId = decoded.userId;
  
      // Find the requesting user
      const requestingUser = await Superadmin.findByPk(requestingUserId);
      if (!requestingUser) {
        return res.status(404).json({ error: 'Unauthorized. Only superadmin can reset other user\'s passwords' });
      }
  
      // Check if the requesting user is superadmin
      const isSuperadmin = requestingUser.role === 'superadmin';
  
      // If the requesting user is not superadmin, they can only reset their own password
      if (!isSuperadmin && requestingUserId !== userId) {
        return res.status(403).json({ error: 'Unauthorized. Only superadmin can reset other user\'s passwords' });
      }
  
      // Find the user whose password needs to be reset
      const userToReset = await Admin.findByPk(userId);
      if (!userToReset) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password
      userToReset.mdp = hashedPassword;
      await userToReset.save();
  
      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      console.error(error.message);
      
      // Check if the error is related to token expiration
      if (error.name === 'TokenExpiredError') {
        return res.status(400).json({ error: 'Reset token has expired' });
      }
  
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

  
  module.exports = { signup,resetPassword, signin,logout };
  


