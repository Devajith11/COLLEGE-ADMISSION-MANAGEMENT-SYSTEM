const express = require('express');
const router = express.Router();
const KnowledgeBase = require('../models/KnowledgeBase');

router.post('/query', async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ message: 'Query is required' });

    const lowerQuery = query.toLowerCase();

    try {
        // Simple keyword matching logic
        const knowledge = await KnowledgeBase.find();
        let bestMatch = null;

        for (const item of knowledge) {
            if (item.keywords.some(kw => lowerQuery.includes(kw))) {
                bestMatch = item;
                break;
            }
        }

        if (bestMatch) {
            res.json({ answer: bestMatch.answer });
        } else {
            res.json({ answer: "I'm not sure about that. Please contact the college office at 04935-257321 for more info." });
        }
    } catch (err) {
        res.status(500).json({ message: 'Chatbot error' });
    }
});

// Seed Knowledge Base
router.post('/seed', async (req, res) => {
    try {
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
                keywords: ['branch', 'courses', 'eee', 'cse', 'ece', 'me', 'ce'],
                answer: 'GEC Wayanad offers B.Tech in CSE, ECE, EEE, ME, and Civil Engineering.'
            },
            {
                keywords: ['hostel', 'accommodation', 'stay'],
                answer: 'GEC Wayanad has separate hostel facilities for boys and girls. Application for hostels can be submitted after completing college admission.'
            }
        ];

        await KnowledgeBase.insertMany(seedData);
        res.json({ message: 'Knowledge base seeded' });
    } catch (err) {
        res.status(500).json({ message: 'Seed failed', error: err.message });
    }
});

module.exports = router;
