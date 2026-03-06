const Student = require('../models/Student');

/**
 * Admin Controller
 * Logic for processing administrative tasks.
 */

// 1. Get Students
// Fetches students based on the admin's department (Branch).
// If the admin belongs to 'CS', they only see computer science applicants.
exports.getStudents = async (req, res) => {
    try {
        let query = {};
        const adminBranch = req.user.branch;

        // Filter by branch if the admin is not a 'Super Admin' (Branch: 'All')
        if (adminBranch && adminBranch !== 'All') {
            query.branch = adminBranch;
        }

        const students = await Student.find(query).select('-password');
        res.json(students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// 2. Verify Document
// Updates the verification status of a specific document within a student's profile.
exports.verifyDocument = async (req, res) => {
    const { studentId, documentId, status, adminFeedback } = req.body;
    try {
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        // Use Mongoose's .id() method to find the specific document in the sub-document array
        const doc = student.documents.id(documentId);
        if (!doc) return res.status(404).json({ message: 'Document not found' });

        doc.status = status; // Set status as 'Verified' or 'Rejected'
        if (adminFeedback) doc.adminFeedback = adminFeedback; // Attach feedback if rejected

        await student.save();
        res.json({ message: `Document ${status}`, student });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// 3. Update Status
// Updates the overall admission status of a student (e.g. Registered -> Verified -> Admitted).
exports.updateStatus = async (req, res) => {
    const { studentId, status } = req.body;
    try {
        const student = await Student.findByIdAndUpdate(
            studentId,
            { status },
            { new: true } // Returns the updated document instead of the old one
        ).select('-password');

        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// 4. Update Remarks
// Sends a general text feedback/remark to the student that appears on their dashboard.
exports.updateRemarks = async (req, res) => {
    const { studentId, adminRemarks } = req.body;
    try {
        const student = await Student.findByIdAndUpdate(
            studentId,
            { adminRemarks },
            { new: true }
        ).select('-password');

        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

