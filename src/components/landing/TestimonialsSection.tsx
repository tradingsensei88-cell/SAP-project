"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
    {
        name: "Priya Sharma",
        role: "Software Engineer @ Google",
        avatar: "PS",
        color: "from-purple-500 to-pink-500",
        text: "WonderLearning completely changed how I approach learning. The AI-powered paths are insanely accurate — it felt like having a personal tutor 24/7.",
        stars: 5,
    },
    {
        name: "Marcus Chen",
        role: "Product Designer @ Figma",
        avatar: "MC",
        color: "from-blue-500 to-cyan-500",
        text: "I landed my dream job 3 months after completing the UI/UX course. The certificate was recognized immediately in my interview. Worth every penny.",
        stars: 5,
    },
    {
        name: "Aisha Patel",
        role: "Data Scientist @ Tesla",
        avatar: "AP",
        color: "from-[#ccff00] to-emerald-400",
        text: "The gamification keeps me coming back every day. I've completed 8 courses in 4 months — something I never managed with other platforms.",
        stars: 5,
    },
    {
        name: "James Okafor",
        role: "Founder @ TechBridge",
        avatar: "JO",
        color: "from-orange-500 to-red-500",
        text: "As a self-taught developer, WonderLearning filled every gap in my knowledge. The structured curriculum is world-class.",
        stars: 5,
    },
    {
        name: "Sofia Reyes",
        role: "ML Engineer @ OpenAI",
        avatar: "SR",
        color: "from-violet-500 to-purple-500",
        text: "The instructors are actual industry experts, not just content creators. The depth of knowledge in each course is unmatched.",
        stars: 5,
    },
    {
        name: "Liam Thompson",
        role: "Full Stack Dev @ Stripe",
        avatar: "LT",
        color: "from-teal-500 to-green-500",
        text: "I tried 6 other platforms before WonderLearning. Nothing comes close to the quality and the community here. This is the future of education.",
        stars: 5,
    },
];

export default function TestimonialsSection() {
    return (
        <section className="py-28 px-6 bg-[var(--wonder-gray)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--wonder-green)] to-transparent opacity-20" />

            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <p className="text-[var(--wonder-green)] font-mono text-sm tracking-[0.3em] mb-4">STUDENT STORIES</p>
                    <h2 className="text-4xl md:text-6xl font-black text-white">
                        Real People.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--wonder-green)] to-emerald-400">
                            Real Results.
                        </span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            whileHover={{ y: -6 }}
                            className="relative p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-white/15 transition-all duration-500 flex flex-col gap-4"
                        >
                            <Quote className="w-8 h-8 text-[var(--wonder-green)]/40" />
                            <p className="text-gray-300 text-sm leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
                            <div className="flex items-center gap-1 mb-1">
                                {[...Array(t.stars)].map((_, s) => (
                                    <span key={s} className="text-yellow-400 text-xs">★</span>
                                ))}
                            </div>
                            <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-xs font-black text-black shrink-0`}>
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">{t.name}</p>
                                    <p className="text-gray-500 text-xs">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
