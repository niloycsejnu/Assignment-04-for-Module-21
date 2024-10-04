const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new student
exports.registerStudent = async (req, res) => {
    const { name, email, password , dept, address} = req.body;
    try {
        // Check if student exists
        let student = await Student.findOne({ email });
        if (student) return res.status(400).json({ message: "Student already exists" });

        // Create new student
        student = new Student({ name, email, password , dept, address});
        await student.save();

        res.status(201).json({ message: "Student registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


// Login student
exports.loginStudent = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if student exists
        const student = await Student.findOne({ email });
        if (!student) return res.status(400).json({ message: "Invalid credentials" });

        // Compare passwords
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT token
        const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set token in cookie
        res.cookie('token', token, { httpOnly: true });

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};