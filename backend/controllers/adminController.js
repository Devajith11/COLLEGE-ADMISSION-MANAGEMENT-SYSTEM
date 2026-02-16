const Student = require('../models/Student');

exports.getStudents = async (req, res) => {
    try {
        let query = {};
        const adminBranch = req.user.branch;
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

exports.verifyDocument = async (req, res) => {
    const { studentId, documentId, status, adminFeedback } = req.body;
    try {
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const doc = student.documents.id(documentId);
        if (!doc) return res.status(404).json({ message: 'Document not found' });

        doc.status = status;
        if (adminFeedback) doc.adminFeedback = adminFeedback;
        await student.save();

        res.json({ message: `Document ${status}`, student });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateStatus = async (req, res) => {
    const { studentId, status } = req.body;
    try {
        const student = await Student.findByIdAndUpdate(
            studentId,
            { status },
            { new: true }
        ).select('-password');

        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

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
