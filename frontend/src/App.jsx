import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Chatbot from './pages/Chatbot';
import AdminDashboard from './pages/AdminDashboard';
import AdmissionForm from './pages/AdmissionForm';
import DocumentUpload from './pages/DocumentUpload';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth isRegister={false} />} />
            <Route path="/register" element={<Auth isRegister={true} />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/apply" element={<AdmissionForm />} />
            <Route path="/upload" element={<DocumentUpload />} />
            <Route path="/admin/login" element={<Auth isRegister={false} isAdmin={true} />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/chat" element={<Chatbot />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
