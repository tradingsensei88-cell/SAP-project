"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center text-center">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/60 z-10" /> {/* Overlay */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-50"
                >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Content */}
            <div className="relative z-20 max-w-4xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <h2 className="text-[var(--wonder-green)] text-lg tracking-[0.2em] font-mono mb-4">
                        FUTURE OF LEARNING
                    </h2>
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-white leading-tight">
                        UNLOCK YOUR <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                            TRUE POTENTIAL
                        </span>
                    </h1>

                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
                        Master premium skills with AI-powered guidance. Join the revolution of interactive education.
                    </p>

                    <a href="/register">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-[var(--wonder-green)] text-black text-lg font-bold rounded-full hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all"
                        >
                            START JOURNEY
                        </motion.button>
                    </a>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 z-20"
            >
                <div className="w-12 h-12 rounded-full border border-[var(--wonder-green)] flex items-center justify-center text-[var(--wonder-green)] animate-bounce">
                    <ArrowDown size={24} />
                </div>
            </motion.div>

            {/* Grid Overlay for texture */}
            <div className="absolute inset-0 z-[5] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        </section>
    );
}
