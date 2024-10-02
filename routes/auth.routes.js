const express = require('express');
const { signup, signin, logout,resetPassword, updateUserDetails } = require('../controller/auth.controller');  // Import the signup function from the controller

const router = express.Router();

// Signup route
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', logout);
router.put('/updateUserDetails', updateUserDetails);
router.post('/resetpassword', resetPassword);

module.exports = router;

