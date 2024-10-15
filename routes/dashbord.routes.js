const express = require('express');
const dashboardController = require('../controller/dashbord.controller');
const router = express.Router();

// Define a GET route for fetching dashboard data
router.get('/dashboard', dashboardController.getDashboardCounts);
router.get('/historique', dashboardController.getHistorique);

module.exports = router;
