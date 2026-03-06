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
                keywords: ['keam', 'admission', 'eligibility', 'documents', 'originals', 'deadline', 'phase', 'allotment', 'transfer', 'spot', 'sliding'],
                answer: 'Admission & Eligibility (KEAM 2026):\n- Mandatory Documents: Originals required (Allotment Memo, Admit Card, Data Sheet, TC, Conduct Certificate, Physical Fitness Certificate).\n- Eligibility: 10+2 marks (Usually 45% in PCM for General, 40% for Reserved).\n- Reporting Dates: Specific deadlines for Phase 1, 2, and 3 of KEAM allotments.\n- Transfer/Spot Admission: Procedures for sliding between branches (e.g., EEE to CSE) within GECW are available.'
            },
            {
                keywords: ['fee', 'fees', 'payment', 'structure', 'cost', 'concession', 'sc', 'st', 'oec', 'pta', 'bus', 'caution'],
                answer: 'Fee Structure (Branch-Wise):\n- General/OBC Fees: Total fee at admission approx. ₹34,600 for 2026.\n- SC/ST/OEC Concessions: Only need to pay Caution Deposit and PTA fund (approx. ₹1,500 - ₹3,000).\n- Payment Methods: Online Transfer via the portal.\n- Note: Distinguishes between Government-controlled fees and PTA/Bus fees.'
            },
            {
                keywords: ['department', 'branch', 'branches', 'cse', 'ece', 'eee', 'mechanical', 'me', 'civil', 'cee', 'intake', 'seats', 'placement', 'recruiters'],
                answer: 'Department & Intake Data:\n- Branches: Computer Science (CSE), Electronics & Communication (ECE), Electrical & Electronics (EEE), Mechanical Engineering (ME), and Civil & Environmental Engineering (CEE).\n- Seat Matrix: 60 seats per branch + Lateral Entry.\n- Placement Stats: Recent recruiters include TCS, Infosys, with high packages offered.'
            },
            {
                keywords: ['hostel', 'accommodation', 'mh', 'lh', 'mess', 'rent', 'transport', 'bus', 'location', 'wayanad', 'thalappuzha', 'railway'],
                answer: 'Campus Logistics & Hostel (The Wayanad Factor):\n- Location: Thalappuzha, 6km from Mananthavady. Nearest railway station is Thalasseri (71km).\n- Hostel Allotment: Men’s Hostel (MH) and Ladies’ Hostel (LH) based on distance and KEAM rank.\n- Hostel Fees: Monthly mess charges and rent apply.\n- Transportation: College bus routes (Mananthavady) and KSRTC timings.'
            },
            {
                keywords: ['contact', 'support', 'help', 'phone', 'office', 'hours', 'admission cell'],
                answer: 'Contact & Support:\n- Admission Cell: Please contact the college office at 04935-257321 for more info.\n- Office Hours: 9:30 AM to 4:30 PM.'
            }
        ];

        await KnowledgeBase.deleteMany({}); // Clear existing data
        await KnowledgeBase.insertMany(seedData);
        res.json({ message: 'Knowledge base seeded successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Seed failed', error: err.message });
    }
});

module.exports = router;
