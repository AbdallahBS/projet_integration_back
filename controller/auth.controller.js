const bcrypt = require('bcrypt');
const Admin = require('../models/admin.model'); 

const generateTokenAndSetCookie = require('../utils/generateTokenAndSendCookies');
const jwt = require('jsonwebtoken');

// Signup route
const signup = async (req, res) => {
  const { username, password, avatar, role } = req.body;

  try {

      const userExistsInAdmin = await Admin.findOne({ where: { username } });
      
      if ( userExistsInAdmin) {
          return res.status(400).json({ error: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      let newUser;


          newUser = await Admin.create({
              mdp: hashedPassword,
              username,
              avatar,
              role
       
      })
      

      res.status(201).json({
          message: 'Admin registered successfully',
          user: {
              id: newUser.id,
              username: newUser.username,
              avatar: newUser.avatar,
              role: newUser.role
          },
      });
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal server error' });
  }
};
//signin
const signin = async (req, res) => {
  console.log("signin called" , req.body.username,req.body.password);
  
  const { username, password } = req.body;

  try {

    
  
      user = await Admin.findOne({ where: { username } });
    

    // If the user is not found in both tables, return an error
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Compare the password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.mdp);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Successful login

    generateTokenAndSetCookie(res, user.id,user.username,password,user.role);

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

  
  const resetPassword = async (req, res) => {
    const { token, newPassword, userId } = req.body; // userId is the specific user to reset
   console.log(token);
   
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const requestingUserId = decoded.userId;
  
      // Find the requesting user
      const requestingUser = await Admin.findByPk(requestingUserId);
      if (!requestingUser) {
        return res.status(404).json({ error: 'Unauthorized. Only superadmin can reset other user\'s passwords' });
      }
  
      const isSuperadmin = requestingUser.role === 'superadmin';
  
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
  
  const updateUserDetails = async (req, res) => {
    const { userId, username, password } = req.body;
 console.log(userId, username , password);
 
    try {
        // Verify the token
        const token = req.headers.authorization.split(' ')[1]; // Assuming token is sent in the Authorization header
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const requestingUserId = decoded.userId;

        // Find the requesting user
        const requestingUser = await Admin.findByPk(requestingUserId);
        if (!requestingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the requesting user is a superadmin
        const isSuperadmin = requestingUser.role === 'superadmin';

        if (!isSuperadmin) {
            return res.status(403).json({ error: 'Unauthorized. Only superadmin can update user details' });
        }

        // Find the user to update
        const userToUpdate = await Admin.findByPk(userId);
        if (!userToUpdate) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the user's username
        userToUpdate.username = username;

        // If a new password is provided, hash and update it
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            userToUpdate.mdp = hashedPassword;
        }

        await userToUpdate.save();

        res.status(200).json({ message: 'User details updated successfully' });
    } catch (error) {
        console.error(error.message);
        
        // Check if the error is related to token expiration
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ error: 'Update token has expired' });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
};

  
  module.exports = { signup,resetPassword, signin,logout,updateUserDetails };
  


