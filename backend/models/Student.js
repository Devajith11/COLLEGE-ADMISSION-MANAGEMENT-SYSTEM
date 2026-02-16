const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    keamAppNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    personalDetails: {
        name: String,
        email: String,
        phone: String,
        dob: Date,
        address: String,
    },
    guardianDetails: {
        name: String,
        relation: String,
        phone: String,
    },
    academicDetails: {
        keamRank: Number,
        keamRollNo: String,
        plusTwoMarks: Number,
        schoolName: String,
    },
    category: {
        type: String,
        enum: ['General', 'SC', 'ST', 'OEC', 'SEBC'],
    },
    branch: {
        type: String,
        enum: ['CSE', 'ECE', 'EEE', 'ME', 'CE'],
    },
    documents: [
        {
            name: String,
            url: String,
            status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
            adminFeedback: String,
        }
    ],
    status: {
        type: String,
        enum: ['Submitted', 'Verified', 'Admitted', 'Action Required'],
        default: 'Submitted',
    },
    adminRemarks: String,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Student', StudentSchema);
