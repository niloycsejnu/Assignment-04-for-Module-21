const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const { uploadFile } = require('../controllers/studentController');
const { getProfile, updateProfile } = require('../controllers/studentController');
const { deleteFile } = require('../controllers/studentController');

const router = express.Router();

// Read profile (protected route)
router.get('/profile', authMiddleware, getProfile);

// Update profile (protected route)
router.put('/profile', authMiddleware, updateProfile);

// File upload (protected route)
router.post('/upload', authMiddleware, uploadFile);

// File delete (protected route)
router.delete('/delete/:filename', authMiddleware, deleteFile);

module.exports = router;
