const express = require('express');
const { signup, signin, logout, resetPassword, updateUserDetails, checkInit, initializeApp } = require('../controller/auth.controller');  // Import the signup function from the controller


const router = express.Router();

// Signup route
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', logout);
router.put('/updateUserDetails', updateUserDetails);
router.post('/resetpassword', resetPassword);
router.post('/initializeapp', initializeApp);
router.post('/checkinit', checkInit);

module.exports = router;

