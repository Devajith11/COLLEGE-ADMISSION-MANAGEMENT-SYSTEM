import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    // Check auth state on mount and when localStorage changes
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const admin = JSON.parse(localStorage.getItem('admin') || 'null');
            setIsLoggedIn(!!token);
            setIsAdmin(!!admin);
        };
        checkAuth();

        // Listen for storage changes (e.g. login/logout from another tab)
        window.addEventListener('storage', checkAuth);
        // Custom event for same-tab updates
        window.addEventListener('authChange', checkAuth);
        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('authChange', checkAuth);
        };
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
        setIsLoggedIn(false);
        setIsAdmin(false);
        setMenuOpen(false);
        window.dispatchEvent(new Event('authChange'));
        navigate('/');
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="bg-primary text-white shadow-md sticky top-0 z-50">
            <div className="flex items-center p-4 justify-between max-w-7xl mx-auto w-full">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                    <div
                        className="bg-center bg-no-repeat bg-cover rounded-full size-10 bg-white shrink-0 border border-white/20 p-1"
                        style={{ backgroundImage: 'url("https://www.gecwyd.ac.in/wp-content/uploads/2017/01/cropped-logo.png")' }}
                    >
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-base font-bold leading-tight tracking-tight">GEC Wayanad</h1>
                        <span className="text-xs font-medium text-white/80">Govt. Engineering College</span>
                    </div>
                </Link>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    <Link to="/chat" className="hidden sm:flex items-center gap-1 text-sm font-medium hover:text-white/80 transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chat_bubble</span>
                        Helpdesk
                    </Link>

                    {/* Menu Button & Dropdown */}
                    <div className="relative" ref={menuRef}>
                        <button
                            id="navbar-menu-btn"
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="flex items-center justify-center rounded-full size-10 hover:bg-white/10 transition-colors"
                        >
                            <span className="material-symbols-outlined text-white" style={{ fontSize: '28px' }}>
                                {menuOpen ? 'close' : 'menu'}
                            </span>
                        </button>

                        {/* Dropdown Menu */}
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1e2532] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                                <nav className="py-2">
                                    {/* Always visible links */}
                                    <Link
                                        to="/"
                                        onClick={closeMenu}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary/5 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>home</span>
                                        Home
                                    </Link>

                                    <Link
                                        to="/chat"
                                        onClick={closeMenu}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary/5 dark:hover:bg-white/5 transition-colors sm:hidden"
                                    >
                                        <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>chat_bubble</span>
                                        Helpdesk
                                    </Link>

                                    {/* Logged-in student links */}
                                    {isLoggedIn && !isAdmin && (
                                        <>
                                            <Link
                                                to="/dashboard"
                                                onClick={closeMenu}
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary/5 dark:hover:bg-white/5 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>dashboard</span>
                                                My Dashboard
                                            </Link>
                                            <Link
                                                to="/apply"
                                                onClick={closeMenu}
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary/5 dark:hover:bg-white/5 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>edit_note</span>
                                                Admission Form
                                            </Link>
                                            <Link
                                                to="/upload"
                                                onClick={closeMenu}
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary/5 dark:hover:bg-white/5 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>upload_file</span>
                                                Upload Documents
                                            </Link>
                                        </>
                                    )}

                                    {/* Admin links */}
                                    {isLoggedIn && isAdmin && (
                                        <Link
                                            to="/admin/dashboard"
                                            onClick={closeMenu}
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary/5 dark:hover:bg-white/5 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>admin_panel_settings</span>
                                            Admin Dashboard
                                        </Link>
                                    )}

                                    {/* Divider */}
                                    <div className="h-px bg-gray-100 dark:bg-gray-700 my-1 mx-3"></div>

                                    {/* Auth actions */}
                                    {isLoggedIn ? (
                                        <button
                                            id="logout-btn"
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors w-full text-left"
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
                                            Logout
                                        </button>
                                    ) : (
                                        <>
                                            <Link
                                                to="/login"
                                                onClick={closeMenu}
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary/5 dark:hover:bg-white/5 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>login</span>
                                                Student Login
                                            </Link>
                                            <Link
                                                to="/register"
                                                onClick={closeMenu}
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-accent hover:bg-accent/5 transition-colors"
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>how_to_reg</span>
                                                Register
                                            </Link>
                                            <Link
                                                to="/admin/login"
                                                onClick={closeMenu}
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hover:bg-primary/5 dark:hover:bg-white/5 transition-colors"
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>shield_person</span>
                                                Admin Login
                                            </Link>
                                        </>
                                    )}
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
