"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { BookOpen, Clock, Award, TrendingUp, Play } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const ENROLLED_COURSES = [
    { id: 1, title: "Advanced Blender Logic", progress: 75, totalLessons: 24, completedLessons: 18, thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" },
    { id: 2, title: "React Performance Mastery", progress: 45, totalLessons: 18, completedLessons: 8, thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2670&auto=format&fit=crop" },
    { id: 3, title: "Next.js 14 Complete Guide", progress: 20, totalLessons: 30, completedLessons: 6, thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2574&auto=format&fit=crop" },
];

const STATS = [
    { label: "Courses Enrolled", value: "3", icon: BookOpen, color: "text-blue-400" },
    { label: "Hours Learned", value: "42", icon: Clock, color: "text-green-400" },
    { label: "Certificates", value: "1", icon: Award, color: "text-yellow-400" },
    { label: "Avg. Progress", value: "47%", icon: TrendingUp, color: "text-[var(--wonder-green)]" },
];

export default function DashboardPage() {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            window.location.href = "/login";
        }
    }, [status]);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <main className="min-h-screen bg-[var(--background)] text-white">
            <Navbar />

            <div className="pt-24 px-6 max-w-7xl mx-auto">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold mb-2">Welcome back, <span className="text-[var(--wonder-green)]">{session.user?.name}</span>!</h1>
                    <p className="text-gray-400">Continue your learning journey</p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {STATS.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[var(--wonder-gray)] p-6 rounded-2xl border border-white/5 hover:border-[var(--wonder-green)]/30 transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <stat.icon className={`${stat.color}`} size={24} />
                                <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
                            </div>
                            <p className="text-sm text-gray-400 uppercase tracking-wide">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Progress Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-[var(--wonder-gray)] p-8 rounded-2xl border border-white/5 mb-12"
                >
                    <h2 className="text-2xl font-bold mb-6">Learning Progress</h2>
                    <div className="space-y-4">
                        {ENROLLED_COURSES.map((course, i) => (
                            <div key={i}>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium">{course.title}</span>
                                    <span className="text-sm text-[var(--wonder-green)]">{course.progress}%</span>
                                </div>
                                <div className="w-full bg-black/50 rounded-full h-2 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${course.progress}%` }}
                                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                                        className="h-full bg-gradient-to-r from-[var(--wonder-green)] to-green-400"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Enrolled Courses */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">Continue Learning</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {ENROLLED_COURSES.map((course, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + i * 0.1 }}
                                className="bg-[var(--wonder-gray)] rounded-2xl overflow-hidden border border-white/5 hover:border-[var(--wonder-green)]/30 transition-all group"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-300">{course.completedLessons}/{course.totalLessons} lessons</span>
                                            <span className="text-[var(--wonder-green)] font-bold">{course.progress}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <Link href={`/course/${course.id}`}>
                                        <button className="w-full bg-white/10 hover:bg-[var(--wonder-green)] hover:text-black text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(204,255,0,0.3)]">
                                            <Play size={18} /> Continue
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
