import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

/**
 * Chatbot Component
 * Provides an interactive AI-powered helpdesk for students.
 */
const Chatbot = () => {
    // 1. State Management
    const [input, setInput] = useState(''); // Text typed by the user in the input box
    const [messages, setMessages] = useState([
        // Initial welcome message from the bot
        { text: "Hello! I'm your GECW Admission Assistant. How can I help you today? You can ask me about fees, hostels, or transport.", sender: 'bot' }
    ]);
    const [isTyping, setIsTyping] = useState(false); // Controls the visibility of the "typing..." animation
    const scrollRef = useRef(null); // Reference to the chat window for automatic scrolling

    // 2. Auto-scroll logic
    // Every time a new message is added or the bot starts typing, scroll to the bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // 3. Message Handling
    const handleSend = async (e) => {
        e.preventDefault();
        // Prevent sending empty messages
        if (!input.trim()) return;

        // User's message structure
        const userMsg = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]); // Add to the conversation list
        setInput(''); // Clear input box
        setIsTyping(true); // Show "typing..." indicator

        try {
            // Send the user's query to the specialized chatbot API
            const res = await api.post('/chatbot/query', { query: input });
            // Add the bot's response to the conversation
            setMessages(prev => [...prev, { text: res.data.answer, sender: 'bot' }]);
        } catch (err) {
            // Fallback error message
            setMessages(prev => [...prev, { text: "I'm having trouble connecting. Please try again later.", sender: 'bot' }]);
        } finally {
            setIsTyping(false); // Hide "typing..." indicator
        }
    };

    return (
        <div className="min-h-[calc(100vh-160px)] bg-[#f8fafc] dark:bg-background-dark p-4 sm:p-8 flex items-center justify-center">
            {/* Chat Container */}
            <div className="w-full max-w-2xl h-[600px] bg-white dark:bg-[#1e2532] rounded-3xl shadow-xl shadow-primary/10 border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden">

                {/* Chat Header: Identifies the bot */}
                <div className="bg-primary p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="size-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>smart_toy</span>
                        </div>
                        <div>
                            <h2 className="font-bold text-lg leading-none">GECW Assistant</h2>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Online Helpdesk</span>
                        </div>
                    </div>
                </div>

                {/* Messages Area: Scrollable list of chat bubbles */}
                <div
                    ref={scrollRef}
                    className="flex-grow overflow-y-auto p-6 space-y-4 no-scrollbar bg-[#f8fafc] dark:bg-black/10"
                >
                    <AnimatePresence>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                            >
                                {/* Chat Bubble styling: Different for bot and user */}
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium shadow-sm transition-all ${msg.sender === 'bot'
                                    ? 'bg-white dark:bg-[#2d3748] text-[#111318] dark:text-white border border-gray-100 dark:border-gray-700 rounded-tl-none'
                                    : 'bg-primary text-white rounded-tr-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Typing Animation */}
                    {isTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                            <div className="bg-white dark:bg-[#2d3748] p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 flex gap-1">
                                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="size-1.5 bg-gray-400 rounded-full" />
                                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="size-1.5 bg-gray-400 rounded-full" />
                                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="size-1.5 bg-gray-400 rounded-full" />
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Input Area: Form for typing questions */}
                <form
                    onSubmit={handleSend}
                    className="p-6 bg-white dark:bg-[#1e2532] border-t border-gray-100 dark:border-gray-800 flex items-center gap-3"
                >
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="w-full bg-[#f8fafc] dark:bg-background-dark/50 border border-gray-100 dark:border-gray-800 rounded-2xl py-4 pl-6 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none text-[#111318] dark:text-white"
                        />
                    </div>
                    {/* Send Button */}
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="size-14 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>send</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;

