"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const categories = [
    { name: "Web Development", icon: "🌐", count: "42 courses" },
    { name: "Data Science", icon: "📊", count: "31 courses" },
    { name: "UI/UX Design", icon: "🎨", count: "28 courses" },
    { name: "Machine Learning", icon: "🤖", count: "24 courses" },
    { name: "Cybersecurity", icon: "🔐", count: "19 courses" },
    { name: "Cloud & DevOps", icon: "☁️", count: "22 courses" },
    { name: "Mobile Dev", icon: "📱", count: "17 courses" },
    { name: "Blockchain", icon: "⛓️", count: "14 courses" },
];

export default function CategoriesSection() {
    return (
        <section className="py-28 px-6 bg-[var(--background)] relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <p className="text-[var(--wonder-green)] font-mono text-sm tracking-[0.3em] mb-4">EXPLORE</p>
                    <h2 className="text-4xl md:text-6xl font-black text-white">
                        Every Field.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--wonder-green)] to-emerald-400">
                            One Platform.
                        </span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.07 }}
                            whileHover={{ scale: 1.04, y: -4 }}
                            className="group relative p-5 rounded-2xl bg-white/3 border border-white/5 hover:border-[var(--wonder-green)]/40 hover:bg-[var(--wonder-green)]/5 transition-all duration-400 cursor-pointer text-center"
                        >
                            <div className="text-3xl mb-3">{cat.icon}</div>
                            <h3 className="text-white font-bold text-sm mb-1 group-hover:text-[var(--wonder-green)] transition-colors">{cat.name}</h3>
                            <p className="text-gray-500 text-xs">{cat.count}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
