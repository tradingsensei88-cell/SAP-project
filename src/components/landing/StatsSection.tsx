"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
    { value: 12000, label: "Students Enrolled", suffix: "+" },
    { value: 98, label: "Satisfaction Rate", suffix: "%" },
    { value: 200, label: "Expert Courses", suffix: "+" },
    { value: 50, label: "World-Class Instructors", suffix: "+" },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const duration = 2000;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [inView, target]);

    return (
        <span ref={ref} className="text-5xl md:text-6xl font-black text-white tabular-nums">
            {count.toLocaleString()}{suffix}
        </span>
    );
}

export default function StatsSection() {
    return (
        <section className="py-24 px-6 relative overflow-hidden bg-[var(--background)]">
            {/* Glowing orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[var(--wonder-green)]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.15 }}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className="relative mb-2">
                                <CountUp target={stat.value} suffix={stat.suffix} />
                                <div className="absolute -inset-2 bg-[var(--wonder-green)]/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                            <p className="text-gray-400 text-sm font-medium tracking-wide mt-2">{stat.label}</p>
                            <div className="w-8 h-0.5 bg-[var(--wonder-green)] mt-3 group-hover:w-16 transition-all duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
