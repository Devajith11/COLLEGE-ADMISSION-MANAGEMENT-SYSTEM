import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdmissionForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Personal
        fullName: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        bloodGroup: '',
        address: '',
        // Step 2: Guardian
        guardianName: '',
        relation: '',
        guardianPhone: '',
        // Step 3: Academic
        keamRank: '',
        keamRollNo: '',
        plusTwoMarks: '',
        schoolName: '',
        // Step 4: Reservation
        category: 'General',
        income: '',
        branch: 'CSE',
        reservation: 'None'
    });

    const steps = [
        { id: 1, title: 'Personal', icon: 'person' },
        { id: 2, title: 'Guardian', icon: 'family_restroom' },
        { id: 3, title: 'Academic', icon: 'school' },
        { id: 4, title: 'Category', icon: 'fact_check' }
    ];

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/student/profile');

                if (res.data.personalDetails) {
                    setFormData(prev => ({
                        ...prev,
                        fullName: res.data.personalDetails.name || '',
                        email: res.data.personalDetails.email || '',
                        phone: res.data.personalDetails.phone || '',
                        dob: res.data.personalDetails.dob?.split('T')[0] || '',
                        address: res.data.personalDetails.address || '',
                        guardianName: res.data.guardianDetails?.name || '',
                        relation: res.data.guardianDetails?.relation || '',
                        guardianPhone: res.data.guardianDetails?.phone || '',
                        category: res.data.category || 'General',
                        branch: res.data.branch || 'CSE',
                        keamRank: res.data.academicDetails?.keamRank || '',
                        keamRollNo: res.data.academicDetails?.keamRollNo || '',
                        plusTwoMarks: res.data.academicDetails?.plusTwoMarks || '',
                        schoolName: res.data.academicDetails?.schoolName || '',
                    }));
                }
            } catch (err) {
                console.error('Fetch error:', err);
                if (err.response?.status === 403) {
                    alert('As an admin, you cannot access the student application form.');
                    navigate('/admin/dashboard');
                } else if (err.response?.status === 401) {
                    navigate('/login');
                }
                // If 404, we let them fill the form from scratch
            } finally {
                setInitialLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                personalDetails: {
                    name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    dob: formData.dob,
                    address: formData.address,
                },
                guardianDetails: {
                    name: formData.guardianName,
                    relation: formData.relation,
                    phone: formData.guardianPhone,
                },
                academicDetails: {
                    keamRank: formData.keamRank,
                    keamRollNo: formData.keamRollNo,
                    plusTwoMarks: formData.plusTwoMarks,
                    schoolName: formData.schoolName,
                },
                category: formData.category,
                branch: formData.branch
            };

            await api.put('/student/update', payload);

            navigate('/upload');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save application');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
                                <input
                                    type="text" name="fullName" value={formData.fullName} onChange={handleInputChange}
                                    className="rounded-lg border-gray-300 dark:border-gray-700 dark:bg-background-dark p-3 focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="as per SSLC" required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
                                <input
                                    type="email" name="email" value={formData.email} onChange={handleInputChange}
                                    className="rounded-lg border-gray-300 dark:border-gray-700 dark:bg-background-dark p-3 focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="yourname@example.com" required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Date of Birth</label>
                                <input
                                    type="date" name="dob" value={formData.dob} onChange={handleInputChange}
                                    className="rounded-lg border-gray-300 dark:border-gray-700 dark:bg-background-dark p-3 focus:ring-2 focus:ring-primary outline-none"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mobile Number</label>
                                <input
                                    type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                                    className="rounded-lg border-gray-300 dark:border-gray-700 dark:bg-background-dark p-3 focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="10-digit number" required
                                />
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Permanent Address</label>
                                <textarea
                                    name="address" value={formData.address} onChange={handleInputChange}
                                    className="rounded-lg border-gray-300 dark:border-gray-700 dark:bg-background-dark p-3 focus:ring-2 focus:ring-primary outline-none min-h-[80px]"
                                    required
                                />
                            </div>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Guardian Name</label>
                                <input
                                    type="text" name="guardianName" value={formData.guardianName} onChange={handleInputChange}
                                    className="rounded-lg border-gray-300 dark:border-gray-700 dark:bg-background-dark p-3 focus:ring-2 focus:ring-primary outline-none"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Relation</label>
                                <input
                                    type="text" name="relation" value={formData.relation} onChange={handleInputChange}
                                    className="rounded-lg border-gray-300 dark:border-gray-700 dark:bg-background-dark p-3 focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="e.g. Father" required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Guardian Mobile Number</label>
                                <input
                                    type="tel" name="guardianPhone" value={formData.guardianPhone} onChange={handleInputChange}
                                    className="rounded-lg border-gray-300 dark:border-gray-700 dark:bg-background-dark p-3 focus:ring-2 focus:ring-primary outline-none"
                                    required
                                />
                            </div>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">KEAM Entrance Rank</label>
                                <input
                                    type="number" name="keamRank" value={formData.keamRank} onChange={handleInputChange}
                                    className="rounded-lg border-gray-300 dark:border-gray-700 dark:bg-background-dark p-3 focus:ring-2 focus:ring-primary outline-none"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">KEAM Roll Number</label>
                                <input
                                    type="text" name="keamRollNo" value={formData.keamRollNo} onChange={handleInputChange}
                                    className="rounded-lg border-gray-300 dark:border-gray-700 dark:bg-background-dark p-3 focus:ring-2 focus:ring-primary outline-none"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Plus Two Marks (%)</label>
                                <input
                                    type="number" name="plusTwoMarks" value={formData.plusTwoMarks} onChange={handleInputChange}
                                    className="rounded-lg border-gray-300 dark:border-gray-700 dark:bg-background-dark p-3 focus:ring-2 focus:ring-primary outline-none"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Previous School Name</label>
                                <input
                                    type="text" name="schoolName" value={formData.schoolName} onChange={handleInputChange}
                                    className="rounded-lg border-gray-300 dark:border-gray-700 dark:bg-background-dark p-3 focus:ring-2 focus:ring-primary outline-none"
                                    required
                                />
                            </div>
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Category</label>
                                <select
                                    name="category" value={formData.category} onChange={handleInputChange}
                                    className="rounded-lg border-gray-300 dark:border-gray-700 dark:bg-background-dark p-3 focus:ring-2 focus:ring-primary outline-none"
                                    required
                                >
                                    <option value="General">General</option>
                                    <option value="SC">SC</option>
                                    <option value="ST">ST</option>
                                    <option value="OEC">OEC</option>
                                    <option value="SEBC">SEBC (OBC)</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Allotted Branch</label>
                                <select
                                    name="branch" value={formData.branch} onChange={handleInputChange}
                                    className="rounded-lg border-gray-300 dark:border-gray-700 dark:bg-background-dark p-3 focus:ring-2 focus:ring-primary outline-none"
                                    required
                                >
                                    <option value="CSE">Computer Science & Engineering</option>
                                    <option value="ECE">Electronics & Communication</option>
                                    <option value="EEE">Electrical & Electronics</option>
                                    <option value="ME">Mechanical Engineering</option>
                                    <option value="CE">Civil Engineering</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Annual Family Income</label>
                                <input
                                    type="number" name="income" value={formData.income} onChange={handleInputChange}
                                    className="rounded-lg border-gray-300 dark:border-gray-700 dark:bg-background-dark p-3 focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="as per income certificate" required
                                />
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Other Reservations</label>
                                <select
                                    name="reservation" value={formData.reservation} onChange={handleInputChange}
                                    className="rounded-lg border-gray-300 dark:border-gray-700 dark:bg-background-dark p-3 focus:ring-2 focus:ring-primary outline-none"
                                >
                                    <option value="None">None</option>
                                    <option value="PH">Physically Challenged</option>
                                    <option value="Ex-Servicemen">Ex-Servicemen Dependent</option>
                                    <option value="NCC">NCC/Sports Quota</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 mt-4">
                            <p className="text-xs text-primary font-medium flex gap-2">
                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>info</span>
                                Ensure all details match your uploaded certificates. Inaccurate data may lead to admission cancellation.
                            </p>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-background-dark">
                <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 bg-[#f8fafc] dark:bg-background-dark">
            <div className="max-w-4xl mx-auto">
                {/* Progress Header */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4 no-scrollbar">
                        {steps.map((s, idx) => (
                            <React.Fragment key={s.id}>
                                <div className="flex flex-col items-center gap-2 min-w-[80px]">
                                    <div className={`size-12 rounded-full flex items-center justify-center transition-all duration-300 ${step >= s.id ? 'bg-primary text-white shadow-lg' : 'bg-white dark:bg-[#1e2532] text-gray-400 border border-gray-200 dark:border-gray-800'
                                        }`}>
                                        <span className="material-symbols-outlined">{s.icon}</span>
                                    </div>
                                    <span className={`text-xs font-bold uppercase tracking-wider ${step >= s.id ? 'text-primary' : 'text-gray-400'
                                        }`}>{s.title}</span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className={`flex-1 h-1 mx-4 min-w-[20px] rounded-full ${step > s.id ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-800'
                                        }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="text-center">
                        <h1 className="text-3xl font-extrabold text-[#111318] dark:text-white">Admission Application Form</h1>
                        <p className="text-gray-500 mt-2">Academic Year 2026-27 - GECW Admission Cell</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-[#1e2532] rounded-3xl shadow-xl shadow-primary/5 border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="p-8 sm:p-12">
                        <AnimatePresence mode="wait">
                            {renderStep()}
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                            <button
                                onClick={prevStep}
                                disabled={step === 1}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${step === 1 ? 'opacity-0 cursor-default' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5'
                                    }`}
                            >
                                <span className="material-symbols-outlined">west</span>
                                Back
                            </button>

                            {step < 4 ? (
                                <button
                                    onClick={nextStep}
                                    className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                >
                                    Continue
                                    <span className="material-symbols-outlined">east</span>
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    className="flex items-center gap-2 bg-accent text-white px-10 py-3 rounded-xl font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
                                >
                                    Submit Application
                                    <span className="material-symbols-outlined">check_circle</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Helper Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>Need help? Contact college office at <span className="font-bold text-primary">04935 271 261</span> or use the <span className="underline cursor-pointer">Live Chatbot</span></p>
                </div>
            </div>
        </div>
    );
};

export default AdmissionForm;
