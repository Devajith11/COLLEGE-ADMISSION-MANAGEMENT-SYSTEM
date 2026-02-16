const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admission Clerk', 'HOD', 'Principal'], default: 'Admission Clerk' },
    branch: { type: String, enum: ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'All'], default: 'All' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Admin', AdminSchema);
