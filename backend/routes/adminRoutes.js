const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');

// @route   GET api/admin/students
// @desc    Get all students (filtered by branch if applicable)
// @access  Private/Admin
router.get('/students', adminAuth, adminController.getStudents);

// @route   POST api/admin/verify
// @desc    Verify or Reject a student document
// @access  Private/Admin
router.post('/verify', adminAuth, adminController.verifyDocument);

// @route   POST api/admin/update-status
// @desc    Update overall admission status of a student
// @access  Private/Admin
router.post('/update-status', adminAuth, adminController.updateStatus);

// @route   POST api/admin/update-remarks
// @desc    Send general remarks/feedback to a student
// @access  Private/Admin
router.post('/update-remarks', adminAuth, adminController.updateRemarks);

module.exports = router;
