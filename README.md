# GECW Admission Management System (GECW-AMS)

A centralized digital platform for the Government Engineering College Wayanad (GECW) to automate the admission lifecycle. Built with the MERN stack (MongoDB, Express, React, Node).

## 📁 Project Structure

```text
.
├── backend/                # Express server & API logic
│   ├── config/             # Database & middleware configurations (DB, Multer)
│   ├── middleware/         # Custom Express middlewares (Auth, Role checks)
│   ├── models/             # Mongoose schemas (Student, Admin, KnowledgeBase)
│   ├── routes/             # API route definitions
│   ├── uploads/            # Student document storage (PDF/Images)
│   ├── .env                # Server environment variables (Atlas URI, JWT Secret)
│   └── index.js            # Main entry point
├── frontend/               # React client application
│   ├── public/             # Static assets (Favicons, etc.)
│   ├── src/
│   │   ├── assets/         # Images and global styles
│   │   ├── components/     # Reusable UI components (Navbar, Footer)
│   │   ├── pages/          # Main application screens (Dashboard, Forms, Auth)
│   │   ├── services/       # API communication logic (Axios config)
│   │   ├── App.jsx         # Main React router & layout
│   │   └── main.jsx        # React DOM mount point
│   ├── .env                # Frontend environment variables (API URL)
│   └── vite.config.js      # Vite build configuration
├── docs/                   # Documentation (PRD, Manuals)
└── package.json            # Root configuration for running the full stack
```

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account (or local MongoDB)

### 2. Setup
Clone the repository and install all dependencies:
```bash
npm run install-all
```

### 3. Running the App
Run both frontend and backend in development mode:
```bash
npm run dev
```

The frontend will start on **http://localhost:5173** (or similar) and the backend on **http://localhost:5001**.

## 🛠 Features
- **Student Portal:** Multi-step admission form and document upload.
- **Admin Dashboard:** Clerk verification workflow and branch-wise statistics.
- **Helpdesk Chatbot:** Keyword-based AI assistant for admission queries.
- **Secure Auth:** JWT-based sessions with password hashing.

---
*Created for Government Engineering College Wayanad.*
