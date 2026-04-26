"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();
    const [mounted, setMounted] = useState(false);
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        setMounted(true);

        // Update time every second
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center mix-blend-difference text-white"
        >
            {/* Left: Status Indicators */}
            <div className="flex items-center space-x-6 text-xs font-mono tracking-widest text-gray-400">
                <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-[var(--wonder-green)] mb-1 animate-pulse"></div>
                    <span className="text-[var(--wonder-green)]">ONLINE</span>
                </div>

                <div className="flex flex-col items-center">
                    <span className="text-white font-bold mb-1">{currentTime}</span>
                    <span>TIME</span>
                </div>
            </div>


            {/* Center: Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
                <h1 className="text-2xl font-bold tracking-tight uppercase">
                    Wonder <span className="text-[var(--wonder-green)]">Learning</span>
                </h1>
            </div>

            {/* Right: Menu */}
            <div className="flex items-center space-x-8 text-sm font-medium uppercase tracking-wide ml-auto">
                {mounted && session ? (
                    <>
                        <Link href="/dashboard" className="hover:text-[var(--wonder-green)] transition-colors">Dashboard</Link>
                        <Link href="/dashboard/profile" className="hover:text-blue-400 transition-colors">Profile</Link>
                    </>
                ) : (
                    <Link href="/" className="hover:text-[var(--wonder-green)] transition-colors">Home</Link>
                )}
                <Link href="/courses" className="hover:text-[var(--wonder-green)] transition-colors">Courses</Link>
                <Link href="/pricing" className="hover:text-[var(--wonder-green)] transition-colors">Pricing</Link>

                {mounted && session ? (
                    <div className="flex items-center gap-4">
                        <button onClick={() => signOut()} className="hover:text-red-500 transition-colors">LOGOUT</button>
                    </div>
                ) : (
                    <Link href="/login" className="px-5 py-2 border border-white/20 rounded-full hover:bg-[var(--wonder-green)] hover:text-black hover:border-transparent transition-all duration-300">
                        Login
                    </Link>
                )}
            </div>
        </motion.nav>
    );
}
