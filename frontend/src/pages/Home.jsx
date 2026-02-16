import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        const admin = JSON.parse(localStorage.getItem('admin') || 'null');

        if (token) {
            if (admin) navigate('/admin/dashboard');
            else if (user) navigate('/dashboard');
        }
    }, [navigate]);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <div className="@container">
                <div className="@[480px]:px-4 @[480px]:py-3 pt-0 max-w-7xl mx-auto w-full">
                    <div
                        className="relative bg-cover bg-center flex flex-col justify-end overflow-hidden bg-background-dark @[480px]:rounded-lg min-h-[300px] sm:min-h-[400px]"
                        style={{
                            backgroundImage: 'linear-gradient(180deg, rgba(20, 75, 184, 0.2) 0%, rgba(17, 22, 33, 0.9) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBjDav1HBxKVAOGTQpsvOooXo0c6X11JYC_YwwpzPVsHbnW5chV3bC1BUsP-m-czach7Ih6LFnvGjmdMnfWozzOCYOJulcgCKGfJVuF8UKixNK2iuQJcXRCdOmflFSJh_oz34yMQF7bS3tzSK46K2aFupprYc-ILMCDF8I78w6MZy77T7RYU4NG77Tx8bfIyA3FebTQBpnSBuck1CnM7T4o6NMgTiRatHrRs7tXNS-j-B9_R44FuMljpyr9uRyImFp_ZjMhKQ18PZg")'
                        }}
                    >
                        <div className="flex flex-col p-6 sm:p-10 pb-8">
                            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-accent/90 px-3 py-1 text-xs font-bold text-white mb-4 shadow-sm backdrop-blur-sm">
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>campaign</span>
                                Admission Open 2026-27
                            </span>
                            <h2 className="text-white tracking-tight text-[32px] sm:text-[42px] font-bold leading-tight drop-shadow-md max-w-2xl">
                                Welcome to Online Admission Portal
                            </h2>
                            <p className="text-white/80 text-base sm:text-lg mt-2 font-medium max-w-xl">
                                Secure your future at Government Engineering College Wayanad. Streamlined digital admission process for KEAM allotted students.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Grid Section */}
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6">
                <div className="pt-8 pb-4">
                    <h3 className="text-[#111318] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">Select Action</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10">
                    {/* Apply Online Card */}
                    <Link to="/register" className="flex flex-row md:flex-col gap-4 rounded-xl border border-accent/30 bg-white dark:bg-[#1e2532] dark:border-accent/20 p-6 items-center shadow-sm hover:shadow-xl transition-all group text-left md:text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-accent md:w-full md:h-1"></div>
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>how_to_reg</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight">Apply Online</h2>
                            <p className="text-[#637588] dark:text-[#9ca3af] text-sm">New applicants start registration here</p>
                        </div>
                        <span className="material-symbols-outlined ml-auto text-accent md:hidden">arrow_forward</span>
                    </Link>

                    {/* Student Login Card */}
                    <Link to="/login" className="flex flex-row md:flex-col gap-4 rounded-xl border border-[#dcdfe5] dark:border-[#2d3748] bg-white dark:bg-[#1e2532] p-6 items-center shadow-sm hover:shadow-xl transition-all group text-left md:text-center">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>school</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight">Student Login</h2>
                            <p className="text-[#637588] dark:text-[#9ca3af] text-sm">Access your admission dashboard</p>
                        </div>
                        <span className="material-symbols-outlined ml-auto text-primary/60 md:hidden">arrow_forward</span>
                    </Link>

                    {/* Admin Login Card */}
                    <Link to="/admin/login" className="flex flex-row md:flex-col gap-4 rounded-xl border border-[#dcdfe5] dark:border-[#2d3748] bg-white dark:bg-[#1e2532] p-6 items-center shadow-sm hover:shadow-xl transition-all group text-left md:text-center">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#111318]/5 text-[#111318] dark:bg-white/10 dark:text-white group-hover:bg-[#111318] group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>admin_panel_settings</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight">Admin Login</h2>
                            <p className="text-[#637588] dark:text-[#9ca3af] text-sm">Staff and faculty verification portal</p>
                        </div>
                        <span className="material-symbols-outlined ml-auto text-gray-400 md:hidden">arrow_forward</span>
                    </Link>
                </div>

                {/* Important Information List */}
                <div className="pt-4 pb-2">
                    <h3 className="text-[#111318] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">Important Information</h3>
                </div>

                <div className="flex flex-col gap-0 pb-12">
                    <a className="flex items-center justify-between py-5 border-b border-[#e5e7eb] dark:border-[#2d3748] hover:bg-black/5 dark:hover:bg-white/5 px-2 transition-colors" href="#">
                        <div className="flex items-center gap-4">
                            <div className="text-primary dark:text-primary/80">
                                <span className="material-symbols-outlined">fact_check</span>
                            </div>
                            <span className="text-[#111318] dark:text-white text-base font-medium">Eligibility Criteria & Guidelines</span>
                        </div>
                        <span className="material-symbols-outlined text-[#9ca3af]">chevron_right</span>
                    </a>

                    <a className="flex items-center justify-between py-5 border-b border-[#e5e7eb] dark:border-[#2d3748] hover:bg-black/5 dark:hover:bg-white/5 px-2 transition-colors" href="#">
                        <div className="flex items-center gap-4">
                            <div className="text-primary dark:text-primary/80">
                                <span className="material-symbols-outlined">payments</span>
                            </div>
                            <span className="text-[#111318] dark:text-white text-base font-medium">Fee Structure 2026-27</span>
                        </div>
                        <span className="material-symbols-outlined text-[#9ca3af]">chevron_right</span>
                    </a>

                    <a className="flex items-center justify-between py-5 border-b border-[#e5e7eb] dark:border-[#2d3748] hover:bg-black/5 dark:hover:bg-white/5 px-2 transition-colors" href="#">
                        <div className="flex items-center gap-4">
                            <div className="text-primary dark:text-primary/80">
                                <span className="material-symbols-outlined">calendar_month</span>
                            </div>
                            <span className="text-[#111318] dark:text-white text-base font-medium">Admission Schedule & Key Dates</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="rounded bg-red-100 dark:bg-red-900/30 px-2 py-0.5 text-xs font-bold text-red-700 dark:text-red-400">New</span>
                            <span className="material-symbols-outlined text-[#9ca3af]">chevron_right</span>
                        </div>
                    </a>

                    <a className="flex items-center justify-between py-5 hover:bg-black/5 dark:hover:bg-white/5 px-2 transition-colors" href="#">
                        <div className="flex items-center gap-4">
                            <div className="text-red-600 dark:text-red-500">
                                <span className="material-symbols-outlined">picture_as_pdf</span>
                            </div>
                            <span className="text-[#111318] dark:text-white text-base font-medium">College Prospectus Download</span>
                        </div>
                        <span className="material-symbols-outlined text-[#9ca3af]">download</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Home;
