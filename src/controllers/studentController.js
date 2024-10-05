const Student = require('../models/Student');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Get student profile
exports.getProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.student.id).select('-password'); // Exclude the password
        if (!student) return res.status(404).json({ message: 'Student not found' });

        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update student profile
exports.updateProfile = async (req, res) => {
    const { name, email, dept, address } = req.body;
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.student.id,
            { name, email, dept, address },
            { new: true, runValidators: true }
        ).select('-password'); // Exclude the password

        res.json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, req.student.id + '-' + Date.now() + path.extname(file.originalname)); // Filename format: studentID-timestamp.ext
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 900000000000000000000000000000 }, //  limit for example
}).single('file'); // Only single file upload

// File upload handler
exports.uploadFile = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Send the file path as a response
        res.json({ filePath: `/uploads/${req.file.filename}` });
    });
};


// File delete handler

exports.deleteFile = (req, res) => {
    const { filename } = req.params; // Extract filename from request parameters
    console.log('Received filename:', filename); // Log the received filename

    const filePath = path.join(process.cwd(), 'uploads', filename); // Construct the full file path
    console.log('Attempting to delete file at:', filePath); // Log the full file path
    fs.unlink(filePath, (err) => { // Try to delete the file
        if (err) {
            return res.status(400).json({ message: 'File not found' }); // Handle error if file is not found
        }
        res.json({ message: 'File deleted successfully' }); // Respond with success message
    });
};