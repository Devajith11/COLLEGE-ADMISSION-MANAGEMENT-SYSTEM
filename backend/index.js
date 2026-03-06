/**
 * College Admission Management System - Backend Server
 * This is the main entry point for the backend API.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// 1. Configuration: Load environment variables (like Database URI, Port, Secrets)
// We use path.join to ensure it finds the .env file correctly regardless of where the server is started from.
dotenv.config({ path: path.join(__dirname, '.env') });

// 2. Import Routes: These define the different API endpoints for our system
const authRoutes = require('./routes/authRoutes');      // Login, Register, Logout
const studentRoutes = require('./routes/studentRoutes');  // Admission form, document uploads
const adminRoutes = require('./routes/adminRoutes');    // Admin dashboard, approving applications
const chatbotRoutes = require('./routes/chatbotRoutes'); // Helpdesk chatbot responses
const connectDB = require('./config/db');               // Database connection logic
const Admin = require('./models/Admin');                // Admin user model
const bcrypt = require('bcryptjs');                     // Tool for encrypting passwords

const app = express();
const PORT = process.env.PORT || 5001; // The server will run on port 5001 or as defined in .env

// 3. Global Middlewares
// CORS allows our frontend (usually on port 5173 or 3000) to talk to this backend
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Tells Express to automatically parse incoming JSON data from requests
app.use(express.json());

// Makes the 'uploads' folder public so the frontend can display uploaded documents/images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple logger to see every request that hits the server in the terminal
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
});

// 4. API Route Definitions
// Base route to check if server is alive
app.get('/', (req, res) => {
    res.send('🎓 GECW Admission Management System API is running...');
});

// Connect specific URL paths to their respective route handlers
app.use('/api/auth', authRoutes);       // Example: http://localhost:5001/api/auth/login
app.use('/api/student', studentRoutes); // Example: http://localhost:5001/api/student/apply
app.use('/api/admin', adminRoutes);     // Example: http://localhost:5001/api/admin/stats
app.use('/api/chatbot', chatbotRoutes); // Example: http://localhost:5001/api/chatbot/query

// 5. Debug Tool: Helper to see what files are currently in the uploads folder
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

// 6. DB Connection & Server Bootup
// We wrap this in an async function to wait for the database to connect before starting the web server.
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Security: Create or update the default Administrator account
        // Username: admin_gecw | Password: admin123
        console.log('🔍 Checking for default admin configuration...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await Admin.findOneAndUpdate(
            { username: 'admin_gecw' },
            {
                password: hashedPassword,
                role: 'Admission Clerk',
                branch: 'All'
            },
            { upsert: true, new: true } // 'upsert' means create if it doesn't exist, update if it does.
        );
        console.log('✅ Default Admin "admin_gecw" is ready (Password: admin123)');

        // Finally, start listening for incoming connections
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
    }
};

// Execute the startup process
startServer();

