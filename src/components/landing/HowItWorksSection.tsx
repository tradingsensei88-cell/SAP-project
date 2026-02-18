"use client";

import { motion } from "framer-motion";
import { UserPlus, Search, PlayCircle, Award } from "lucide-react";

const steps = [
    {
        icon: UserPlus,
        step: "01",
        title: "Create Your Account",
        description: "Sign up in seconds. No credit card required to get started.",
    },
    {
        icon: Search,
        step: "02",
        title: "Discover Courses",
        description: "Browse hundreds of expert-led courses across every discipline.",
    },
    {
        icon: PlayCircle,
        step: "03",
        title: "Learn at Your Pace",
        description: "Watch, rewind, and revisit lessons whenever and wherever you want.",
    },
    {
        icon: Award,
        step: "04",
        title: "Earn & Grow",
        description: "Complete courses, earn certificates, and unlock your next opportunity.",
    },
];

export default function HowItWorksSection() {
    return (
        <section className="py-28 px-6 bg-[var(--background)] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-72 h-72 bg-[var(--wonder-green)]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <p className="text-[var(--wonder-green)] font-mono text-sm tracking-[0.3em] mb-4">THE PROCESS</p>
                    <h2 className="text-4xl md:text-6xl font-black text-white">
                        How It Works
                    </h2>
                </motion.div>

                <div className="relative">
                    {/* Connecting line */}
                    <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[var(--wonder-green)]/30 to-transparent" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.15 }}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="relative mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-[var(--wonder-green)]/10 border border-[var(--wonder-green)]/30 flex items-center justify-center group-hover:bg-[var(--wonder-green)]/20 group-hover:border-[var(--wonder-green)]/60 transition-all duration-500">
                                        <step.icon className="w-7 h-7 text-[var(--wonder-green)]" />
                                    </div>
                                    <span className="absolute -top-3 -right-3 text-xs font-black text-[var(--wonder-green)] bg-black border border-[var(--wonder-green)]/40 rounded-full w-7 h-7 flex items-center justify-center">
                                        {step.step}
                                    </span>
                                </div>
                                <h3 className="text-white font-bold text-lg mb-3">{step.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
