const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { auth, studentAuth } = require('../middleware/auth');
const upload = require('../config/multer');

// @route   GET api/student/profile
// @desc    Get current student profile
// @access  Private
router.get('/profile', [auth, studentAuth], async (req, res) => {
    try {
        const student = await Student.findById(req.user.id).select('-password');
        if (!student) return res.status(404).json({ message: 'Student profile not found in database.' });
        res.json(student);
    } catch (err) {
        console.error('Profile Fetch Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/student/update
// @desc    Update student details
// @access  Private
router.put('/update', [auth, studentAuth], async (req, res) => {
    const { personalDetails, guardianDetails, academicDetails, category, branch } = req.body;
    try {
        let student = await Student.findById(req.user.id);
        if (!student) return res.status(404).json({ message: 'Student not found. Please re-register.' });

        if (personalDetails) student.personalDetails = personalDetails;
        if (guardianDetails) student.guardianDetails = guardianDetails;
        if (academicDetails) student.academicDetails = academicDetails;
        if (category) student.category = category;
        if (branch) student.branch = branch;

        await student.save();
        res.json(student);
    } catch (err) {
        console.error('Student Update Error:', err.message);
        res.status(500).json({ message: 'Failed to update student profile', error: err.message });
    }
});

// @route   POST api/student/upload
// @desc    Upload documents
// @access  Private
router.post('/upload', [auth, studentAuth], upload.single('document'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'Please upload a file' });

        const student = await Student.findById(req.user.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const newDoc = {
            name: req.body.name || req.file.originalname,
            url: `/uploads/${req.file.filename}`,
            status: 'Pending'
        };

        student.documents.push(newDoc);
        await student.save();

        res.json(student);
    } catch (err) {
        console.error('Upload Error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
