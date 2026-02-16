import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const res = await api.get('/api/student/profile');
                setStudent(res.data);
            } catch (err) {
                console.error('Fetch error:', err);
                if (err.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const getStatusStep = () => {
        if (!student) return 0;
        if (student.status === 'Admitted') return 3;
        if (student.status === 'Verified') return 2;
        if (student.personalDetails?.name) return 1;
        return 0;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-background-dark">
                <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-160px)] bg-[#f8fafc] dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#111318] dark:text-white">
                            Welcome, {student?.personalDetails?.name || 'Applicant'}!
                        </h1>
                        <p className="text-gray-500 font-medium">KEAM App No: <span className="text-primary font-bold">{student?.keamAppNumber}</span></p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/chat" className="px-6 py-3 bg-white dark:bg-[#1e2532] border border-gray-200 dark:border-gray-800 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                            <span className="material-symbols-outlined text-primary">smart_toy</span>
                            Support Bot
                        </Link>
                        <button
                            onClick={() => { localStorage.clear(); navigate('/login'); }}
                            className="px-6 py-3 bg-red-500/10 text-red-500 rounded-2xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Status Tracker */}
                <div className="bg-white dark:bg-[#1e2532] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl shadow-primary/5 mb-8">
                    <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-8">Current Admission Status</h2>
                    <div className="relative flex items-center justify-between max-w-4xl mx-auto">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 dark:bg-gray-800 z-0">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(getStatusStep() / 3) * 100}%` }}
                                className="h-full bg-primary"
                            />
                        </div>
                        {[
                            { step: 1, label: 'Form Filled', icon: 'edit_document' },
                            { step: 2, label: 'Verified', icon: 'verified' },
                            { step: 3, label: 'Admitted', icon: 'school' }
                        ].map((s) => (
                            <div key={s.step} className="relative z-10 flex flex-col items-center gap-2">
                                <div className={`size-12 rounded-full flex items-center justify-center transition-all duration-500 ${getStatusStep() >= s.step ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white dark:bg-background-dark text-gray-400 border-2 border-gray-100 dark:border-gray-800'}`}>
                                    <span className="material-symbols-outlined">{getStatusStep() >= s.step ? 'check' : s.icon}</span>
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${getStatusStep() >= s.step ? 'text-primary' : 'text-gray-400'}`}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-[#1e2532] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-lg group">
                        <div className="size-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>fact_check</span>
                        </div>
                        <h3 className="font-bold text-lg mb-2">Admission Form</h3>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">Update your personal, academic and category details to proceed.</p>
                        <Link to="/apply" className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:gap-3 transition-all">
                            {student?.personalDetails?.name ? 'Edit Details' : 'Start Application'}
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                        </Link>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-[#1e2532] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-lg group">
                        <div className="size-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>upload_file</span>
                        </div>
                        <h3 className="font-bold text-lg mb-2">Document Upload</h3>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">Submit your SSLC, TC, Allotment Memo and other certificates.</p>
                        <Link to="/upload" className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:gap-3 transition-all">
                            Manage Files
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                        </Link>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-[#1e2532] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-lg group">
                        <div className="size-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>help_center</span>
                        </div>
                        <h3 className="font-bold text-lg mb-2">Help Center</h3>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">Get instant answers for your admission related queries.</p>
                        <Link to="/chat" className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:gap-3 transition-all">
                            Launch Bot
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                        </Link>
                    </motion.div>
                </div>

                {/* Feedback Section */}
                {student?.adminRemarks && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 p-6 bg-red-500/10 rounded-3xl border border-red-500/20 flex gap-4 items-start shadow-xl shadow-red-500/5"
                    >
                        <div className="size-12 bg-red-500 rounded-2xl flex items-center justify-center shrink-0 text-white">
                            <span className="material-symbols-outlined">feedback</span>
                        </div>
                        <div>
                            <h4 className="font-black text-red-600 text-sm uppercase tracking-widest">Admin Feedback</h4>
                            <p className="text-red-700/80 text-sm mt-1 font-bold leading-relaxed whitespace-pre-wrap">
                                {student.adminRemarks}
                            </p>
                            <p className="text-[10px] text-red-400 mt-2 font-black uppercase tracking-widest">Please correct the mentioned issues and re-submit.</p>
                        </div>
                    </motion.div>
                )}

                {/* Rejected Documents Section */}
                {student?.documents?.some(d => d.status === 'Rejected') && (
                    <div className="mt-8 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Rejected Documents</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {student.documents.filter(d => d.status === 'Rejected').map((doc, idx) => (
                                <div key={idx} className="bg-white dark:bg-[#1e2532] p-4 rounded-2xl border border-red-200 dark:border-red-900/30 flex items-center gap-4">
                                    <div className="size-10 bg-red-500/20 text-red-500 rounded-lg flex items-center justify-center">
                                        <span className="material-symbols-outlined">error</span>
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="text-xs font-bold text-[#111318] dark:text-white">{doc.name}</h4>
                                        <p className="text-[11px] text-red-600 font-medium">Reason: {doc.adminFeedback || 'Incorrect or unclear document'}</p>
                                    </div>
                                    <Link to="/upload" className="text-[10px] font-black uppercase text-primary hover:underline">Re-upload</Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Info Note */}
                <div className="mt-8 p-6 bg-primary/5 rounded-3xl border border-primary/20 flex gap-4 items-start">
                    <span className="material-symbols-outlined text-primary">info</span>
                    <div>
                        <h4 className="font-bold text-primary text-sm">Next Steps</h4>
                        <p className="text-primary/70 text-xs mt-1 leading-relaxed">
                            Once you upload all documents, the admission clerk will review your application. You will see the **Verified** status here after successful document verification. You may be asked to bring originals for final physical verification at the college.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
