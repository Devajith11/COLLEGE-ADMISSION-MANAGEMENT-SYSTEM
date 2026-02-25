
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const KnowledgeBase = require('./backend/models/KnowledgeBase');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Clear existing knowledge base
        await KnowledgeBase.deleteMany({});
        console.log('Cleared existing knowledge base');

        // Correct seed data
        const seedData = [
            {
                keywords: ['keam', 'application', 'apply'],
                answer: 'To apply, you need your KEAM application number and a password. Complete the multi-step form and upload required documents.'
            },
            {
                keywords: ['document', 'upload', 'certificates'],
                answer: 'You need to upload your 10th marksheet, 12th marksheet, KEAM admit card, and caste certificate (if applicable).'
            },
            {
                keywords: ['contact', 'phone', 'office'],
                answer: 'You can contact the GEC Wayanad office at 04935-257321 or email admissions@gecw.ac.in.'
            },
            {
                keywords: ['branch', 'courses', 'eee', 'cse', 'ece', 'mechanical', 'ce'],
                answer: 'GEC Wayanad offers B.Tech in CSE, ECE, EEE, ME, and Civil Engineering.'
            },
            {
                keywords: ['hostel', 'accommodation', 'stay'],
                answer: 'GEC Wayanad has separate hostel facilities for boys and girls. Application for hostels can be submitted after completing college admission.'
            }
        ];

        await KnowledgeBase.insertMany(seedData);
        console.log('Knowledge base seeded correctly');

        process.exit();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

connectDB();
