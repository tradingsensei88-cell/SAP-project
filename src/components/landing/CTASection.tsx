"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
    return (
        <section className="py-28 px-6 bg-[var(--wonder-gray)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--wonder-green)] to-transparent opacity-20" />

            {/* Glowing orbs */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-[var(--wonder-green)]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 bg-[var(--wonder-green)]/10 border border-[var(--wonder-green)]/30 rounded-full px-4 py-2 mb-8">
                        <Sparkles className="w-4 h-4 text-[var(--wonder-green)]" />
                        <span className="text-[var(--wonder-green)] text-sm font-mono tracking-widest">LIMITED TIME OFFER</span>
                    </div>

                    <h2 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
                        Start Learning<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--wonder-green)] to-emerald-400">
                            For Free Today
                        </span>
                    </h2>

                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                        Join over 12,000 students already transforming their careers on WonderLearning.
                        Get access to 30 free credits on signup — no credit card needed.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group flex items-center gap-3 px-8 py-4 bg-[var(--wonder-green)] text-black text-lg font-black rounded-full hover:shadow-[0_0_40px_rgba(204,255,0,0.4)] transition-all duration-300"
                            >
                                Get Started Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </Link>
                        <Link href="#courses">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white/5 border border-white/10 text-white text-lg font-bold rounded-full hover:bg-white/10 transition-all duration-300"
                            >
                                Browse Courses
                            </motion.button>
                        </Link>
                    </div>

                    {/* Trust badges */}
                    <div className="flex flex-wrap items-center justify-center gap-6 mt-14 text-gray-500 text-sm">
                        <span className="flex items-center gap-2">✓ <span>No credit card required</span></span>
                        <span className="flex items-center gap-2">✓ <span>30 free credits on signup</span></span>
                        <span className="flex items-center gap-2">✓ <span>Cancel anytime</span></span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
