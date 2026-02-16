const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

// Student Login
router.post('/login', async (req, res) => {
    const { keamAppNumber, password } = req.body;
    try {
        const student = await Student.findOne({ keamAppNumber });
        if (!student) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, student });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Student Register
router.post('/register', async (req, res) => {
    console.log('📝 Registration request received:', req.body);
    const { keamAppNumber, password } = req.body;
    try {
        console.log('🔍 Checking for existing student...');
        const existing = await Student.findOne({ keamAppNumber });
        if (existing) {
            console.log('⚠️  Student already exists');
            return res.status(400).json({ message: 'Already registered' });
        }

        console.log('🔐 Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('💾 Creating new student...');
        const student = new Student({ keamAppNumber, password: hashedPassword });
        await student.save();
        console.log('✓ Student saved:', student._id);

        const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        console.log('✓ Token generated, sending response');
        res.json({ token, student });
    } catch (err) {
        console.error('❌ Registration error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(400).json({ message: 'Admin not found' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: admin._id, role: 'admin', adminRole: admin.role, branch: admin.branch }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, admin: { username: admin.username, role: admin.role, branch: admin.branch } });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Seed Admin
router.post('/seed-admin', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = new Admin({ username: 'admin_gecw', password: hashedPassword, role: 'Admission Clerk' });
        await admin.save();
        res.json({ message: 'Admin seeded: admin_gecw / admin123' });
    } catch (err) {
        res.status(500).json({ message: 'Seed failed', error: err.message });
    }
});

module.exports = router;
