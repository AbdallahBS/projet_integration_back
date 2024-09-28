const express = require('express');
const { signup } = require('../controller/auth.controller');  // Import the signup function from the controller

const router = express.Router();

// Signup route
router.post('/signup', signup);

module.exports = router;

