"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, PlayCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContextAI() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string, time?: string }[]>([
        { role: 'ai', text: "Hi! I'm your Wonder AI assistant. Ask me anything about this video lesson!" }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        // User Message
        const newMessages = [...messages, { role: 'user' as const, text: input }];
        setMessages(newMessages);
        setInput("");

        // Simulate AI Response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'ai',
                text: "That's a great question! In this section (04:20), the instructor explains how ambient occlusion adds depth to the scene by simulating soft shadows in crevices.",
                time: "04:20"
            }]);
        }, 1500);
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-[var(--wonder-green)] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.3)] text-black font-bold"
            >
                {isOpen ? <X size={24} /> : <Bot size={28} />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-24 right-8 z-50 w-80 md:w-96 bg-black border border-[var(--wonder-green)]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]"
                    >
                        {/* Header */}
                        <div className="p-4 bg-[var(--wonder-gray)] border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[var(--wonder-green)]/20 flex items-center justify-center text-[var(--wonder-green)]">
                                    <Sparkles size={16} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">Wonder AI</h3>
                                    <p className="text-xs text-[var(--wonder-green)]">30 Credits Remaining</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-800">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.role === 'user'
                                        ? 'bg-[var(--wonder-green)] text-black rounded-tr-none'
                                        : 'bg-[var(--wonder-gray)] text-gray-200 rounded-tl-none border border-white/10'
                                        }`}>
                                        {msg.text}
                                        {msg.time && (
                                            <button className="block mt-2 text-xs font-bold text-[var(--wonder-green)] hover:underline flex items-center gap-1">
                                                <PlayCircle size={12} /> Jump to {msg.time}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-[var(--wonder-gray)] border-t border-white/10">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask about this video..."
                                    className="w-full bg-black/50 border border-white/10 rounded-full pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-[var(--wonder-green)] transition-colors"
                                />
                                <button
                                    onClick={handleSend}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[var(--wonder-green)] rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
