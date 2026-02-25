import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Auth = ({ isRegister, isAdmin }) => {
    const [formData, setFormData] = useState({ keamAppNumber: '', password: '', username: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let endpoint = '';
            let payload = {};

            if (isAdmin) {
                endpoint = '/auth/admin/login';
                payload = { username: formData.username, password: formData.password };
            } else {
                endpoint = isRegister ? '/auth/register' : '/auth/login';
                payload = { keamAppNumber: formData.keamAppNumber, password: formData.password };
            }

            const res = await api.post(endpoint, payload);

            localStorage.setItem('token', res.data.token);
            if (isAdmin) {
                localStorage.setItem('admin', JSON.stringify(res.data.admin));
                window.dispatchEvent(new Event('authChange'));
                navigate('/admin/dashboard');
            } else {
                localStorage.setItem('user', JSON.stringify(res.data.student));
                window.dispatchEvent(new Event('authChange'));
                // Redirect to form if registering, otherwise go to dashboard
                if (isRegister) {
                    navigate('/apply');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            console.error('Auth Error:', err);
            if (!err.response) {
                setError(`Cannot connect to server at ${api.defaults.baseURL}. Please ensure the backend is running and CORS is allowed.`);
            } else {
                setError(err.response.data?.message || 'Authentication failed. Please check your credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-160px)] flex items-center justify-center p-4 bg-[#f8fafc] dark:bg-background-dark">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white dark:bg-[#1e2532] rounded-3xl shadow-xl shadow-primary/10 border border-gray-100 dark:border-gray-800 overflow-hidden"
            >
                <div className="p-8 sm:p-10">
                    <div className="flex flex-col items-center mb-8">
                        <div className={`size-16 rounded-2xl flex items-center justify-center mb-4 ${isAdmin ? 'bg-background-dark text-white' : 'bg-primary/10 text-primary'
                            }`}>
                            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>
                                {isAdmin ? 'admin_panel_settings' : (isRegister ? 'person_add' : 'lock')}
                            </span>
                        </div>
                        <h2 className="text-2xl font-black text-[#111318] dark:text-white text-center leading-tight">
                            {isAdmin ? 'Admin Portal' : (isRegister ? 'Create Account' : 'Student Login')}
                        </h2>
                        <p className="text-sm text-gray-500 mt-2 text-center">
                            {isAdmin ? 'Access the institution administration desk' : 'GEC Wayanad Admission Management System'}
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs font-bold mb-6 flex items-start gap-3"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isAdmin ? (
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">KEAM App Number</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: '20px' }}>badge</span>
                                    <input
                                        type="text"
                                        placeholder="Enter your 7-digit App No."
                                        className="w-full bg-[#f8fafc] dark:bg-background-dark/50 border border-gray-100 dark:border-gray-800 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                        required
                                        value={formData.keamAppNumber}
                                        onChange={(e) => setFormData({ ...formData, keamAppNumber: e.target.value })}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Admin Username</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: '20px' }}>account_circle</span>
                                    <input
                                        type="text"
                                        placeholder="Institution username"
                                        className="w-full bg-[#f8fafc] dark:bg-background-dark/50 border border-gray-100 dark:border-gray-800 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                        required
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: '20px' }}>key</span>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-[#f8fafc] dark:bg-background-dark/50 border border-gray-100 dark:border-gray-800 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${isAdmin
                                ? 'bg-background-dark text-white hover:bg-black'
                                : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
                                }`}
                        >
                            {loading ? (
                                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isAdmin ? 'Authenticate' : (isRegister ? 'Register' : 'Secure Login')}
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                        {!isAdmin ? (
                            <p className="text-sm text-gray-500 font-medium">
                                {isRegister ? 'Already have an admission account?' : "Don't have an account yet?"}{' '}
                                <button
                                    onClick={() => navigate(isRegister ? '/login' : '/register')}
                                    className="text-primary font-bold hover:underline"
                                >
                                    {isRegister ? 'Sign In' : 'Create One'}
                                </button>
                            </p>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="text-sm text-primary font-bold hover:underline"
                            >
                                Back to Student Portal
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
