const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

/**
 * Auth Routes
 * Handles user registration, login, and secure token generation.
 */

// 1. Student Login
// Authenticates a student using their KEAM number and password.
router.post('/login', async (req, res) => {
    const { keamAppNumber, password } = req.body;
    try {
        // Find the student record in the database
        const student = await Student.findOne({ keamAppNumber });
        if (!student) return res.status(400).json({ message: 'User not found' });

        // Compare the provided password with the encrypted hash stored in DB
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate a secure JWT token that expires in 1 day
        const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, student });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// 2. Student Registration
// Creates a new student account and hashes their password for security.
router.post('/register', async (req, res) => {
    console.log('📝 Registration request received:', req.body);
    const { keamAppNumber, password } = req.body;
    try {
        // Prevent duplicate registrations
        console.log('🔍 Checking for existing student...');
        const existing = await Student.findOne({ keamAppNumber });
        if (existing) {
            console.log('⚠️  Student already exists');
            return res.status(400).json({ message: 'Already registered' });
        }

        // Security: Never store plain text passwords. Hashing makes them unreadable even if DB is compromised.
        console.log('🔐 Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('💾 Creating new student...');
        const student = new Student({ keamAppNumber, password: hashedPassword });
        await student.save();
        console.log('✓ Student saved:', student._id);

        // Auto-login after registration by sending a token
        const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        console.log('✓ Token generated, sending response');
        res.json({ token, student });
    } catch (err) {
        console.error('❌ Registration error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// 3. Admin Login
// Separated login for staff to access the management dashboard.
router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(400).json({ message: 'Admin not found' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Token includes admin-specific details like branch and role permissions
        const token = jwt.sign({ id: admin._id, role: 'admin', adminRole: admin.role, branch: admin.branch }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, admin: { username: admin.username, role: admin.role, branch: admin.branch } });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// 4. Utility: Seed Admin
// A quick way to create the initial admin user if the database is reset.
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

