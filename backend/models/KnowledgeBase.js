const mongoose = require('mongoose');

const KnowledgeBaseSchema = new mongoose.Schema({
    keywords: [{ type: String, lowercase: true }],
    answer: { type: String, required: true },
    category: { type: String, enum: ['Fees', 'Hostel', 'Transport', 'General'] },
});

module.exports = mongoose.model('KnowledgeBase', KnowledgeBaseSchema);
