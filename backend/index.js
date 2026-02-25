const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load .env from the backend directory (works regardless of cwd)
dotenv.config({ path: path.join(__dirname, '.env') });

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
});

// Root route
app.get('/', (req, res) => {
    res.send(' GECW Admission Management System API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Debug endpoint to check uploaded files
app.get('/api/debug/files', (req, res) => {
    const fs = require('fs');
    const uploadDir = path.join(__dirname, 'uploads');
    if (fs.existsSync(uploadDir)) {
        const files = fs.readdirSync(uploadDir);
        res.json({ folder: uploadDir, files });
    } else {
        res.status(404).json({ message: 'Uploads folder not found', path: uploadDir });
    }
});

// Connect to Database and start server
const startServer = async () => {
    try {
        await connectDB();

        // Seed/Update default admin
        console.log('🔍 Checking for default admin...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await Admin.findOneAndUpdate(
            { username: 'admin_gecw' },
            {
                password: hashedPassword,
                role: 'Admission Clerk',
                branch: 'All'
            },
            { upsert: true, new: true }
        );
        console.log('✅ Admin "admin_gecw" is ready with password "admin123"');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
    }
};

startServer();
