const express = require('express');
const { signup, signin, logout,resetPassword } = require('../controller/auth.controller');  // Import the signup function from the controller

const router = express.Router();

// Signup route
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', logout);

router.post('/resetpassword', resetPassword);

module.exports = router;

