"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { BookOpen, Clock, Award, TrendingUp, Play, Coins, User } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const [realCredits, setRealCredits] = useState<number>(0);
    const [maxCredits, setMaxCredits] = useState<number>(30);

    const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
    const [dashboardStats, setDashboardStats] = useState({
        enrolled: 0,
        hours: 0,
        certificates: 0,
        avgProgress: 0,
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            window.location.href = "/login";
        }
        if (session?.user) {
            // Fetch profile credits
            fetch("/api/user/profile")
                .then(res => res.json())
                .then(data => {
                    setRealCredits(data.credits || 0);
                    setMaxCredits(data.maxCredits || 30);
                });

            // Fetch enrolled courses and compute stats
            fetch("/api/user/enrollments")
                .then(res => res.json())
                .then(data => {
                    if (data && data.enrollments) {
                        setEnrolledCourses(data.enrollments);

                        const enrolledCount = data.enrollments.length;
                        let totalProgress = 0;
                        let completedCourses = 0;

                        data.enrollments.forEach((e: any) => {
                            totalProgress += e.progress;
                            if (e.progress === 100) completedCourses++;
                        });

                        const avgProgress = enrolledCount > 0 ? Math.round(totalProgress / enrolledCount) : 0;

                        setDashboardStats({
                            enrolled: enrolledCount,
                            hours: data.stats?.hoursLearned || 0,
                            certificates: completedCourses,
                            avgProgress,
                        });
                    }
                });
        }
    }, [status, session]);

    const STATS = [
        { label: "Courses Enrolled", value: dashboardStats.enrolled.toString(), icon: BookOpen, color: "text-blue-400" },
        { label: "Hours Learned", value: dashboardStats.hours.toString(), icon: Clock, color: "text-green-400" },
        { label: "Certificates", value: dashboardStats.certificates.toString(), icon: Award, color: "text-yellow-400" },
        { label: "Avg. Progress", value: `${dashboardStats.avgProgress}%`, icon: TrendingUp, color: "text-[var(--wonder-green)]" },
    ];

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

    const creditPercentage = Math.min((realCredits / maxCredits) * 100, 100);

    return (
        <main className="min-h-screen bg-[var(--background)] text-white">
            <Navbar />

            <div className="pt-24 px-6 max-w-7xl mx-auto pb-12">
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl font-bold mb-2">Welcome back, <span className="text-[var(--wonder-green)]">{session.user?.name}</span>!</h1>
                        <p className="text-gray-400">Continue your learning journey</p>
                    </motion.div>

                    {/* Credits Bar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[var(--wonder-gray)] p-4 rounded-2xl border border-white/5 w-full md:w-80"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                <span className="p-1.5 bg-yellow-500/10 rounded-lg">
                                    <Coins size={14} className="text-yellow-500" />
                                </span>
                                <span className="text-sm font-bold">Credits</span>
                            </div>
                            <span className="text-xs font-bold text-[var(--wonder-green)]">{realCredits} / 100</span>
                        </div>
                        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((realCredits / 100) * 100, 100)}%` }}
                                className="h-full bg-gradient-to-r from-[var(--wonder-green)] to-green-400"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <Link href="/dashboard/transcribe">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-gradient-to-br from-[var(--wonder-gray)] to-black/40 p-6 rounded-3xl border border-white/5 hover:border-red-500/30 transition-all group flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-red-500/10 rounded-2xl text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                                    <Play size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">YouTube Transcriber</h3>
                                    <p className="text-sm text-gray-400">Extract text from videos instantly</p>
                                </div>
                            </div>
                            <motion.div
                                initial={{ x: 0 }}
                                whileHover={{ x: 5 }}
                                className="text-[var(--wonder-green)]"
                            >
                                →
                            </motion.div>
                        </motion.div>
                    </Link>

                    <Link href="/dashboard/profile">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-gradient-to-br from-[var(--wonder-gray)] to-black/40 p-6 rounded-3xl border border-white/5 hover:border-[var(--wonder-green)]/30 transition-all group flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-[var(--wonder-green)]/10 rounded-2xl text-[var(--wonder-green)] group-hover:bg-[var(--wonder-green)] group-hover:text-white transition-all text-black">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Edit Profile</h3>
                                    <p className="text-sm text-gray-400">Update your avatar and bio</p>
                                </div>
                            </div>
                            <motion.div
                                initial={{ x: 0 }}
                                whileHover={{ x: 5 }}
                                className="text-[var(--wonder-green)]"
                            >
                                →
                            </motion.div>
                        </motion.div>
                    </Link>
                </div>

                {/* Stats Grid */}

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
                        {enrolledCourses.map((course: any, i: number) => (
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
                        {enrolledCourses.map((course: any, i: number) => (
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
                                    <Link href={`/courses/${course.id}/learn`}>
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
