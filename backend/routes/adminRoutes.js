const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/authController');
const { getDashboardStats } = require('../controllers/dashboardController');
const { protectAdmin } = require('../middleware/auth');

// Public route for login
router.post('/login', loginAdmin);

// Protected route for dashboard metrics
router.get('/dashboard', protectAdmin, getDashboardStats);

module.exports = router;
