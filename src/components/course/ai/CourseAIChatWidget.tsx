"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, User } from "lucide-react";

interface Message {
    id: string;
    role: "user" | "ai";
    content: string;
}

export function CourseAIChatWidget({ courseId }: { courseId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "ai",
            content: "Hi! I'm your AI Teaching Assistant for this course. Ask me anything about the lectures and I'll find the exact timestamp where the instructor discusses it.",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch(`/api/courses/${courseId}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: userMsg.content }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch response");
            }

            const data = await response.json();

            const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "ai", content: data.text };
            setMessages((prev) => [...prev, aiMsg]);

        } catch (error) {
            console.error(error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: "Sorry, I ran into an error processing your question. Please try again later."
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to parse timestamps to clickable buttons (Optional Advanced Feature)
    const renderMessageContent = (content: string) => {
        // Basic regex to find: **[Timestamp: 04:12 | Second: 252]**
        const timestampRegex = /\*\*\[Timestamp:\s*([^|]+)\s*\|\s*Second:\s*(\d+)\]\*\*/g;

        // We split strings and replace matches with interactive spans
        // For a production app, we would use a robust markdown parser with custom components
        const parts = content.split(timestampRegex);

        if (parts.length === 1) return <p className="whitespace-pre-wrap">{content}</p>;

        const elements: React.ReactNode[] = [];
        let i = 0;
        while (i < parts.length) {
            // Regular text
            elements.push(<span key={i} className="whitespace-pre-wrap">{parts[i]}</span>);

            // If there's a timestamp match ahead
            if (i + 2 < parts.length) {
                const timeStr = parts[i + 1].trim();
                const seconds = parseInt(parts[i + 2].trim());

                elements.push(
                    <button
                        key={`ts-${i}`}
                        onClick={() => {
                            // Fire a custom event that the video player component can listen to
                            window.dispatchEvent(new CustomEvent('aiSeekTo', { detail: { seconds } }));
                        }}
                        className="inline-flex items-center px-2 py-1 mx-1 text-xs font-semibold text-black bg-[var(--wonder-green)]/20 rounded hover:bg-[var(--wonder-green)]/40 transition-colors"
                    >
                        ⏭️ Jump to {timeStr}
                    </button>
                );
                i += 3;
            } else {
                break;
            }
        }

        return <p>{elements}</p>;
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="w-[350px] sm:w-[400px] h-[500px] bg-white border border-gray-200 shadow-2xl rounded-2xl flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="bg-[var(--wonder-green)] p-4 text-black flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-2">
                            <Bot className="w-6 h-6" />
                            <h3 className="font-semibold text-sm">Course AI Assistant</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:brightness-90 p-1 rounded transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 flex flex-col">
                        {messages.map((m) => (
                            <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${m.role === "user" ? "bg-gray-200" : "bg-[var(--wonder-green)]/20"}`}>
                                    {m.role === "user" ? <User className="w-5 h-5 text-gray-600" /> : <Bot className="w-5 h-5 text-[var(--wonder-green)]" />}
                                </div>
                                <div className={`max-w-[80%] p-3 text-sm ${m.role === "user" ? "bg-[var(--wonder-green)] text-black rounded-2xl rounded-tr-none" : "bg-white border border-gray-200 shadow-sm text-gray-800 rounded-2xl rounded-tl-none"}`}>
                                    {renderMessageContent(m.content)}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3 flex-row">
                                <div className="w-8 h-8 rounded-full bg-[var(--wonder-green)]/20 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-[var(--wonder-green)]" />
                                </div>
                                <div className="bg-white border border-gray-200 shadow-sm p-3 rounded-2xl rounded-tl-none flex gap-1 items-center h-[40px]">
                                    <div className="w-2 h-2 bg-[var(--wonder-green)] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-[var(--wonder-green)] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-[var(--wonder-green)] rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-200">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about the lectures..."
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--wonder-green)] text-sm disabled:opacity-50 text-black placeholder-gray-400"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="p-2 w-10 h-10 bg-[var(--wonder-green)] text-black rounded-full hover:brightness-110 disabled:opacity-50 disabled:hover:bg-[var(--wonder-green)] transition-colors flex items-center justify-center"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-[var(--wonder-green)] hover:brightness-110 text-black w-14 h-14 flex items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 border-[3px] border-white"
                >
                    <Bot className="w-7 h-7" />
                </button>
            )}
        </div>
    );
}
