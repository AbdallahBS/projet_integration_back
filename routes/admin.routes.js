// admin.routes.js
const express = require('express');
const router = express.Router();
const {
  createAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} = require('../controller/admin.controller');

// Create a new Admin
router.post('/admins', createAdmin);

// Get all Admins
router.get('/admins', getAdmins);

// Get Admin by ID
router.get('/admins/:id', getAdminById);

// Update Admin by ID
router.put('/admins/:id', updateAdmin);

// Delete Admin by ID
router.delete('/admins/:id', deleteAdmin);

module.exports = router;
