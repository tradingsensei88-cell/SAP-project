"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { BarChart2, Users, DollarSign, Eye, Clock, TrendingUp, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CourseStats {
    id: string;
    title: string;
    status: string;
    enrollments: number;
    impressions: number;
    revenue: number;
    totalWatchMinutes: number;
    completionRate: number;
    videoCount: number;
}

interface Analytics {
    totalStudents: number;
    totalRevenue: number;
    totalImpressions: number;
    totalCourses: number;
    publishedCourses: number;
    courseStats: CourseStats[];
}

function MiniBar({ value, max, color = "bg-[var(--wonder-green)]" }: { value: number; max: number; color?: string }) {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
        <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${color} rounded-full`} />
        </div>
    );
}

export default function InstructorAnalyticsPage() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/instructor/analytics")
            .then((r) => r.json())
            .then((d) => { setAnalytics(d); setLoading(false); });
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
            <div className="text-white animate-pulse">Loading analytics...</div>
        </div>
    );

    const maxEnrollments = Math.max(...(analytics?.courseStats.map((c) => c.enrollments) ?? [1]), 1);
    const maxRevenue = Math.max(...(analytics?.courseStats.map((c) => c.revenue) ?? [1]), 1);
    const maxWatch = Math.max(...(analytics?.courseStats.map((c) => c.totalWatchMinutes) ?? [1]), 1);

    return (
        <main className="min-h-screen bg-[var(--background)] text-white">
            <Navbar />
            <div className="pt-24 px-6 max-w-7xl mx-auto pb-16">
                <Link href="/instructor" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to Studio
                </Link>

                <h1 className="text-3xl font-bold mb-2">Analytics</h1>
                <p className="text-gray-400 mb-10">Track your course performance and student engagement</p>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: "Total Students", value: analytics?.totalStudents ?? 0, icon: Users, color: "text-blue-400" },
                        { label: "Total Revenue", value: `$${(analytics?.totalRevenue ?? 0).toFixed(2)}`, icon: DollarSign, color: "text-[var(--wonder-green)]" },
                        { label: "Total Impressions", value: analytics?.totalImpressions ?? 0, icon: Eye, color: "text-purple-400" },
                        { label: "Published Courses", value: analytics?.publishedCourses ?? 0, icon: BarChart2, color: "text-yellow-400" },
                    ].map((stat, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                            className="bg-[var(--wonder-gray)] p-6 rounded-2xl border border-white/5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-gray-400 uppercase tracking-wide">{stat.label}</span>
                                <stat.icon size={16} className={stat.color} />
                            </div>
                            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Per-Course Analytics */}
                {analytics?.courseStats && analytics.courseStats.length > 0 ? (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold mb-6">Course Breakdown</h2>
                        {analytics.courseStats.map((course, i) => (
                            <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="bg-[var(--wonder-gray)] rounded-2xl border border-white/5 p-6">
                                <div className="flex items-start justify-between mb-5">
                                    <div>
                                        <h3 className="font-bold text-lg">{course.title}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${course.status === "published" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                                            {course.status}
                                        </span>
                                    </div>
                                    <span className="text-[var(--wonder-green)] font-bold text-lg">${course.revenue.toFixed(2)}</span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs text-gray-400 flex items-center gap-1"><Users size={11} /> Students</span>
                                            <span className="text-sm font-bold">{course.enrollments}</span>
                                        </div>
                                        <MiniBar value={course.enrollments} max={maxEnrollments} color="bg-blue-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs text-gray-400 flex items-center gap-1"><Eye size={11} /> Impressions</span>
                                            <span className="text-sm font-bold">{course.impressions}</span>
                                        </div>
                                        <MiniBar value={course.impressions} max={Math.max(...analytics.courseStats.map((c) => c.impressions), 1)} color="bg-purple-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={11} /> Watch Time</span>
                                            <span className="text-sm font-bold">{course.totalWatchMinutes}m</span>
                                        </div>
                                        <MiniBar value={course.totalWatchMinutes} max={maxWatch} color="bg-yellow-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs text-gray-400 flex items-center gap-1"><TrendingUp size={11} /> Completion</span>
                                            <span className="text-sm font-bold">{course.completionRate}%</span>
                                        </div>
                                        <MiniBar value={course.completionRate} max={100} color="bg-[var(--wonder-green)]" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-[var(--wonder-gray)] rounded-2xl border border-white/5 p-16 text-center text-gray-400">
                        No course data yet. Create and publish a course to see analytics.
                    </div>
                )}
            </div>
        </main>
    );
}
