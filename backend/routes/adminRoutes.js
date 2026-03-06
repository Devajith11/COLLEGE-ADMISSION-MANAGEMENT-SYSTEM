const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');

/**
 * Admin Routes
 * Handles administrative actions like reviewing students, verifying documents, and updating status.
 * All routes here are protected and require a valid 'Admission Clerk' or 'Super Admin' token.
 */

// 1. Fetch Students
// Retrieves a list of all applicants. For departmental admins, results are filtered by their branch.
router.get('/students', adminAuth, adminController.getStudents);

// 2. Verify Document
// Allows the admin to mark a specific uploaded file as 'Verified' or 'Rejected' with feedback.
router.post('/verify', adminAuth, adminController.verifyDocument);

// 3. Update Admission Status
// Changes the student's overall progress (e.g., from 'Registered' to 'Verified' or 'Admitted').
router.post('/update-status', adminAuth, adminController.updateStatus);

// 4. Send Remarks
// Allows an admin to send a custom notification or general correction request to the student's dashboard.
router.post('/update-remarks', adminAuth, adminController.updateRemarks);

module.exports = router;

