import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

/**
 * AdminDashboard Component
 * The central hub for college staff to review student applications and verify documents.
 */
const AdminDashboard = () => {
    const navigate = useNavigate();

    // 1. State Management
    const [selectedStudent, setSelectedStudent] = useState(null); // The student currently being reviewed in the modal
    const [filter, setFilter] = useState('All');                  // Branch filter (CSE, ECE, etc.)
    const [students, setStudents] = useState([]);                 // List of all students fetched from server
    const [loading, setLoading] = useState(true);                 // Loading state for fetching data
    const [error, setError] = useState(null);                     // Error state
    const [selectedDocIndex, setSelectedDocIndex] = useState(0);  // Which document is currently visible in the previewer
    const [remarks, setRemarks] = useState('');                 // Text for 'Message to Student'
    const [docFeedback, setDocFeedback] = useState('');          // Text for specific document feedback

    // 2. Data Fetching
    // Fetches the list of all student applications from the backend
    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/students');
            setStudents(res.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch students. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Load data when the component first appears
    useEffect(() => {
        fetchStudents();
    }, []);

    // 3. Handlers for Admin Actions

    // Updates the overall application status (Verified, Admitted, Rejected)
    const handleVerifyStatus = async (studentId, status) => {
        try {
            await api.post('/admin/update-status', { studentId, status });
            fetchStudents();       // Refresh the list after update
            setSelectedStudent(null); // Close the review modal
        } catch (err) {
            alert('Failed to update status');
        }
    };

    // Verifies or Rejects a specific document (like SSLC, TC)
    const handleVerifyDoc = async (studentId, documentId, status) => {
        try {
            await api.post('/admin/verify', {
                studentId,
                documentId,
                status,
                adminFeedback: docFeedback
            });
            // Update local state immediately so the UI reflects the change without a full refresh
            setStudents(prev => prev.map(s => {
                if (s._id === studentId) {
                    const updatedDocs = s.documents.map(d => d._id === documentId ? { ...d, status, adminFeedback: docFeedback } : d);
                    return { ...s, documents: updatedDocs };
                }
                return s;
            }));
            // If the modal is currently open for this student, update its local data too
            if (selectedStudent?._id === studentId) {
                setSelectedStudent(prev => ({
                    ...prev,
                    documents: prev.documents.map(d => d._id === documentId ? { ...d, status, adminFeedback: docFeedback } : d)
                }));
            }
            setDocFeedback(''); // Clear the feedback text box
        } catch (err) {
            alert('Failed to verify document');
        }
    };

    // Sends a general remark to the student (e.g., "Please re-upload clearly")
    const handleSendRemarks = async () => {
        try {
            await api.post('/admin/update-remarks', {
                studentId: selectedStudent._id,
                adminRemarks: remarks
            });
            alert('Feedback sent to student successfully!');
            fetchStudents();
        } catch (err) {
            alert('Failed to send feedback');
        }
    };

    // 4. UI Helper Functions

    // Calculate statistics for the top cards
    const stats = [
        { label: 'Total Applications', value: students.length, icon: 'groups', color: 'primary' },
        { label: 'Verified', value: students.filter(s => s.status === 'Verified').length, icon: 'check_circle', color: 'accent' },
        { label: 'Submitted', value: students.filter(s => s.status === 'Submitted').length, icon: 'pending', color: 'amber-500' },
        { label: 'Admitted', value: students.filter(s => s.status === 'Admitted').length, icon: 'school', color: 'emerald-500' }
    ];

    // Calculate seat filling progress for each branch
    const branchSummary = ['CSE', 'ECE', 'EEE', 'ME', 'CE'].map(b => ({
        name: b,
        filled: students.filter(s => s.branch === b && s.status === 'Admitted').length,
        capacity: 60
    }));

    // Returns CSS classes for the status badges
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Verified': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'Action Required': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'Rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-background-dark p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[#111318] dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">dashboard</span>
                            Admission Desk Dashboard
                        </h1>
                        <p className="text-sm text-gray-500">Government Engineering College Wayanad</p>
                    </div>
                    {/* Action Buttons Row */}
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1e2532] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-gray-700 dark:text-white">
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                            Export Register
                        </button>
                        <button
                            onClick={fetchStudents}
                            className={`flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1e2532] border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-gray-700 dark:text-white ${loading ? 'opacity-50' : ''}`}
                            disabled={loading}
                        >
                            <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`} style={{ fontSize: '18px' }}>refresh</span>
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Stats Grid: Displays summary of applications */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white dark:bg-[#1e2532] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className={`material-symbols-outlined text-${stat.color}`} style={{ fontSize: '28px' }}>{stat.icon}</span>
                                <span className="text-2xl font-black text-[#111318] dark:text-white">{stat.value}</span>
                            </div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Branch Seat Tracker: Visual representation of seat availability */}
                <div className="bg-white dark:bg-[#1e2532] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm mb-8">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">Branch Seat Filling</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                        {branchSummary.map((b, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-primary">{b.name}</span>
                                    <span className="text-gray-400">{b.filled}/{b.capacity}</span>
                                </div>
                                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full"
                                        style={{ width: `${(b.filled / b.capacity) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Applications Table: List of all students with filtering */}
                <div className="bg-white dark:bg-[#1e2532] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
                    {/* Filter & Search Bar */}
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="relative w-full sm:w-64">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: '20px' }}>search</span>
                            <input
                                type="text"
                                placeholder="Search students..."
                                className="w-full bg-[#f8fafc] dark:bg-background-dark border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                            {['All', 'CSE', 'ECE', 'EEE', 'ME', 'CE'].map(b => (
                                <button
                                    key={b}
                                    onClick={() => setFilter(b)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filter === b ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {b}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Table Content */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#f8fafc] dark:bg-background-dark/50 text-[10px] uppercase tracking-widest font-black text-gray-400 border-b border-gray-100 dark:border-gray-800">
                                    <th className="px-6 py-4">App Number</th>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Branch</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {students.filter(s => filter === 'All' || s.branch === filter).map((student) => (
                                    <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-mono font-bold text-gray-400 group-hover:text-primary transition-colors">#{student.keamAppNumber}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-[#111318] dark:text-white">{student.personalDetails?.name || 'Incomplete'}</span>
                                                <span className="text-[10px] text-gray-500 font-medium">{new Date(student.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-md bg-primary/5 text-primary text-[10px] font-black uppercase tracking-wider border border-primary/10">
                                                {student.branch || 'None'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{student.category || 'N/A'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(student.status)}`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => {
                                                    setSelectedStudent(student);
                                                    setSelectedDocIndex(0); // Reset doc viewer to first doc
                                                }}
                                                className="px-4 py-2 bg-white dark:bg-[#1e2532] border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold hover:bg-primary hover:border-primary hover:text-white transition-all shadow-sm flex items-center gap-2 ml-auto"
                                            >
                                                Review
                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>visibility</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Application Review Overlay (Full screen modal) */}
            <AnimatePresence>
                {selectedStudent && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Background Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedStudent(null)}
                            className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm"
                        />
                        {/* Modal Box */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-6xl h-[90vh] bg-white dark:bg-[#1e2532] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-gray-800"
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-primary text-white">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined">person</span>
                                    </div>
                                    <div>
                                        <h2 className="font-bold">{selectedStudent.personalDetails?.name || 'Student Name'}</h2>
                                        <p className="text-[10px] opacity-80 uppercase tracking-widest font-black">App ID: {selectedStudent.keamAppNumber}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedStudent(null)}
                                    className="size-10 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
                                {/* Left Sidebar: Detailed Student Info */}
                                <div className="w-full lg:w-1/3 overflow-y-auto p-6 bg-[#f8fafc] dark:bg-black/20 border-r border-gray-100 dark:border-gray-800">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Student Information</h3>

                                    <div className="space-y-6">
                                        {/* Branch & Category Summary */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20">
                                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Allotted Branch</p>
                                                <p className="text-lg font-black text-primary">{selectedStudent.branch || 'N/A'}</p>
                                            </div>
                                            <div className="bg-white dark:bg-white/5 p-3 rounded-2xl border border-gray-200 dark:border-gray-800">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Category</p>
                                                <p className="text-lg font-black text-[#111318] dark:text-white">{selectedStudent.category || 'N/A'}</p>
                                            </div>
                                        </div>

                                        {/* Personal & Guardian Info Sections */}
                                        <div className="space-y-4">
                                            <div className="px-1">
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <span className="h-px bg-gray-200 dark:bg-gray-800 flex-grow"></span>
                                                    Personal Details
                                                    <span className="h-px bg-gray-200 dark:bg-gray-800 flex-grow"></span>
                                                </p>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-4">
                                                        <div className="size-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                                            <span className="material-symbols-outlined">call</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Phone</p>
                                                            <p className="text-sm font-black text-[#111318] dark:text-white">{selectedStudent.personalDetails?.phone || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="size-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                                                            <span className="material-symbols-outlined">mail</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Email</p>
                                                            <p className="text-sm font-black text-[#111318] dark:text-white">{selectedStudent.personalDetails?.email || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Academic Merit Highlights */}
                                            <div className="bg-primary p-5 rounded-2xl shadow-xl shadow-primary/10 text-white">
                                                <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-70">Academic Merit</p>
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase opacity-60">KEAM Rank</p>
                                                        <p className="text-2xl font-black">{selectedStudent.academicDetails?.keamRank || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase opacity-60">Plus Two %</p>
                                                        <p className="text-2xl font-black">{selectedStudent.academicDetails?.plusTwoMarks || 'N/A'}%</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Section: Remarks and Status Updates */}
                                        <div className="p-4 bg-white dark:bg-[#1e2532] rounded-xl border border-gray-200 dark:border-gray-800">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase mb-4">Message to Student</p>
                                            <textarea
                                                className="w-full bg-[#f8fafc] dark:bg-background-dark border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:ring-2 focus:ring-primary outline-none min-h-[80px]"
                                                placeholder="e.g. Please re-upload your TC, it's not clear."
                                                value={remarks}
                                                onChange={(e) => setRemarks(e.target.value)}
                                            />
                                            <button
                                                onClick={handleSendRemarks}
                                                className="mt-3 w-full py-2 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                                            >
                                                Send Message
                                            </button>
                                        </div>

                                        {/* Status Buttons */}
                                        <div className="space-y-3">
                                            <button
                                                onClick={() => handleVerifyStatus(selectedStudent._id, 'Verified')}
                                                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>verified_user</span>
                                                Verify Application
                                            </button>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    onClick={() => handleVerifyStatus(selectedStudent._id, 'Submitted')}
                                                    className="py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all flex items-center justify-center gap-1 text-xs"
                                                >
                                                    Reset Status
                                                </button>
                                                <button
                                                    onClick={() => handleVerifyStatus(selectedStudent._id, 'Admitted')}
                                                    className="py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-1 text-xs"
                                                >
                                                    Final Admit
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Content: Document Previewer */}
                                <div className="flex-grow overflow-hidden flex flex-col">
                                    <div className="p-4 bg-white dark:bg-[#1e2532] border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
                                        <span className="text-xs font-bold text-gray-400 px-2 tracking-widest uppercase">Document Viewer</span>
                                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                                            {/* Tab for each document */}
                                            {selectedStudent.documents.map((doc, idx) => (
                                                <button
                                                    key={doc._id}
                                                    onClick={() => setSelectedDocIndex(idx)}
                                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all ${selectedDocIndex === idx
                                                        ? 'bg-primary/10 text-primary border-primary/20'
                                                        : 'text-gray-400 border-transparent hover:bg-gray-100 dark:hover:bg-white/5'
                                                        }`}
                                                >
                                                    {doc.name}
                                                    {doc.status !== 'Pending' && (
                                                        <span className={`ml-1 ${doc.status === 'Verified' ? 'text-emerald-500' : 'text-red-500'}`}>
                                                            ●
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex-grow overflow-y-auto p-8 bg-gray-100 dark:bg-background-dark/50 flex flex-col items-center">
                                        {selectedStudent.documents.length > 0 ? (
                                            <>
                                                <div className="w-full mb-4 flex justify-between items-center px-2">
                                                    <span className="text-xs font-bold text-gray-500 uppercase">File: {selectedStudent.documents[selectedDocIndex].name}</span>
                                                </div>
                                                {/* The actual File Preview */}
                                                <div className="w-full max-w-2xl bg-white dark:bg-[#1e2532] shadow-2xl rounded-lg p-2 min-h-[600px] flex items-center justify-center border border-gray-200 dark:border-gray-800 mb-6 overflow-hidden">
                                                    {selectedStudent.documents[selectedDocIndex].url.toLowerCase().endsWith('.pdf') ? (
                                                        <iframe
                                                            src={`${api.defaults.baseURL.replace('/api', '')}${selectedStudent.documents[selectedDocIndex].url}#toolbar=0`}
                                                            width="100%"
                                                            height="600px"
                                                            className="rounded border-none"
                                                            title="PDF Preview"
                                                        />
                                                    ) : (
                                                        <img
                                                            src={`${api.defaults.baseURL.replace('/api', '')}${selectedStudent.documents[selectedDocIndex].url}`}
                                                            alt="Document Preview"
                                                            className="max-w-full h-auto rounded"
                                                        />
                                                    )}
                                                </div>
                                                {/* Document Approval/Rejection controls */}
                                                <div className="w-full max-w-2xl flex flex-col gap-4 pb-12">
                                                    <textarea
                                                        className="w-full bg-white dark:bg-[#1e2532] border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-xs focus:ring-2 focus:ring-primary outline-none"
                                                        placeholder="Add specific feedback for this document (optional)..."
                                                        value={docFeedback}
                                                        onChange={(e) => setDocFeedback(e.target.value)}
                                                    />
                                                    <div className="flex gap-4">
                                                        <button
                                                            onClick={() => handleVerifyDoc(selectedStudent._id, selectedStudent.documents[selectedDocIndex]._id, 'Verified')}
                                                            className="flex-grow py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/20"
                                                        >
                                                            Approve Document
                                                        </button>
                                                        <button
                                                            onClick={() => handleVerifyDoc(selectedStudent._id, selectedStudent.documents[selectedDocIndex]._id, 'Rejected')}
                                                            className="flex-grow py-3 bg-red-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-red-600/20"
                                                        >
                                                            Reject Document
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                                <span className="material-symbols-outlined text-6xl mb-4">no_sim</span>
                                                <p>No documents uploaded yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;

