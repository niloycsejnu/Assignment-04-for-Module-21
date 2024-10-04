const express = require('express');
const { registerStudent,loginStudent } = require('../controllers/authController');
const router = express.Router();

// Route for registering a student
router.post('/register', registerStudent);

// Login route
router.post('/login', loginStudent);

module.exports = router;
