"use client";

import { motion } from "framer-motion";
import { Brain, Zap, Shield, Globe, Trophy, Layers } from "lucide-react";

const features = [
    {
        icon: Brain,
        title: "AI-Powered Learning",
        description: "Personalized learning paths that adapt to your pace, style, and goals using cutting-edge AI.",
        color: "from-purple-500/20 to-purple-500/5",
        border: "border-purple-500/20",
        glow: "group-hover:shadow-purple-500/20",
    },
    {
        icon: Zap,
        title: "Lightning Fast Progress",
        description: "Structured micro-lessons designed for maximum retention. Learn more in less time.",
        color: "from-yellow-500/20 to-yellow-500/5",
        border: "border-yellow-500/20",
        glow: "group-hover:shadow-yellow-500/20",
    },
    {
        icon: Shield,
        title: "Verified Certificates",
        description: "Industry-recognized certificates that employers actually value and trust.",
        color: "from-[var(--wonder-green)]/20 to-[var(--wonder-green)]/5",
        border: "border-[var(--wonder-green)]/20",
        glow: "group-hover:shadow-[var(--wonder-green)]/20",
    },
    {
        icon: Globe,
        title: "Learn Anywhere",
        description: "Access your courses on any device, online or offline. Your classroom is everywhere.",
        color: "from-blue-500/20 to-blue-500/5",
        border: "border-blue-500/20",
        glow: "group-hover:shadow-blue-500/20",
    },
    {
        icon: Trophy,
        title: "Gamified Experience",
        description: "Earn credits, unlock achievements, and compete on leaderboards to stay motivated.",
        color: "from-orange-500/20 to-orange-500/5",
        border: "border-orange-500/20",
        glow: "group-hover:shadow-orange-500/20",
    },
    {
        icon: Layers,
        title: "Expert Curated Content",
        description: "Every course is hand-picked and reviewed by industry professionals before publishing.",
        color: "from-pink-500/20 to-pink-500/5",
        border: "border-pink-500/20",
        glow: "group-hover:shadow-pink-500/20",
    },
];

export default function FeaturesSection() {
    return (
        <section className="py-28 px-6 bg-[var(--wonder-gray)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--wonder-green)] to-transparent opacity-20" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--wonder-green)] to-transparent opacity-20" />

            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <p className="text-[var(--wonder-green)] font-mono text-sm tracking-[0.3em] mb-4">WHY WONDERLEARNING</p>
                    <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                        Built Different.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--wonder-green)] to-emerald-400">
                            Built for You.
                        </span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            whileHover={{ y: -6 }}
                            className={`group relative p-7 rounded-2xl bg-gradient-to-br ${feature.color} border ${feature.border} hover:shadow-2xl ${feature.glow} transition-all duration-500 cursor-default`}
                        >
                            <div className="flex items-start gap-5">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 shrink-0">
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
