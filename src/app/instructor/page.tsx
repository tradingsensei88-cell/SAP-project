"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Upload, Video, Users, DollarSign, BarChart2, Plus, Edit, Trash2, Eye, EyeOff, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Course {
    id: string;
    title: string;
    status: string;
    category: string;
    level: string;
    price: number;
    thumbnail: string | null;
    _count: { enrollments: number };
    analytics: { impressions: number; totalRevenue: number } | null;
    modules: { id: string; _count: { videos: number } }[];
}

export default function InstructorDashboard() {
    const { data: session, status } = useSession();
    const [courses, setCourses] = useState<Course[]>([]);
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") window.location.href = "/login";
        if (status === "authenticated") fetchData();
    }, [status]);

    async function fetchData() {
        setLoading(true);
        const [coursesRes, analyticsRes] = await Promise.all([
            fetch("/api/courses?instructor=true"),
            fetch("/api/instructor/analytics"),
        ]);
        if (coursesRes.ok) setCourses(await coursesRes.json());
        if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
        setLoading(false);
    }

    async function togglePublish(course: Course) {
        setTogglingId(course.id);
        const newStatus = course.status === "published" ? "draft" : "published";
        await fetch(`/api/courses/${course.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });
        await fetchData();
        setTogglingId(null);
    }

    async function deleteCourse(id: string) {
        if (!confirm("Delete this course? This cannot be undone.")) return;
        setDeletingId(id);
        await fetch(`/api/courses/${id}`, { method: "DELETE" });
        await fetchData();
        setDeletingId(null);
    }

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <div className="text-white text-xl animate-pulse">Loading Studio...</div>
            </div>
        );
    }

    const stats = [
        { label: "Total Students", value: analytics?.totalStudents ?? 0, icon: Users },
        { label: "Total Revenue", value: `$${(analytics?.totalRevenue ?? 0).toFixed(2)}`, icon: DollarSign },
        { label: "Published Courses", value: analytics?.publishedCourses ?? 0, icon: Video },
        { label: "Total Impressions", value: analytics?.totalImpressions ?? 0, icon: BarChart2 },
    ];

    return (
        <main className="min-h-screen bg-[var(--background)] text-white">
            <Navbar />
            <div className="pt-24 px-6 max-w-7xl mx-auto pb-16">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Instructor Studio</h1>
                        <p className="text-gray-400 mt-1">Welcome back, <span className="text-[var(--wonder-green)]">{session?.user?.name}</span></p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/instructor/analytics">
                            <button className="bg-white/10 text-white px-5 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-white/20 transition-all">
                                <BarChart2 size={18} /> Analytics
                            </button>
                        </Link>
                        <Link href="/instructor/courses/new">
                            <button className="bg-[var(--wonder-green)] text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all">
                                <Plus size={18} /> Create Course
                            </button>
                        </Link>
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {stats.map((stat, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                            className="bg-[var(--wonder-gray)] p-6 rounded-2xl border border-white/5 hover:border-[var(--wonder-green)]/30 transition-all">
                            <div className="flex items-center justify-between mb-3 text-gray-400">
                                <span className="text-xs font-bold uppercase tracking-wide">{stat.label}</span>
                                <stat.icon size={18} className="text-[var(--wonder-green)]" />
                            </div>
                            <p className="text-3xl font-bold text-white">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Courses */}
                <div className="bg-[var(--wonder-gray)] rounded-3xl border border-white/5 overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-xl font-bold">Your Courses</h2>
                        <span className="text-sm text-gray-400">{courses.length} total</span>
                    </div>

                    {courses.length === 0 ? (
                        <div className="p-16 text-center">
                            <BookOpen size={48} className="text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg mb-2">No courses yet</p>
                            <p className="text-gray-600 text-sm mb-6">Create your first course to start teaching</p>
                            <Link href="/instructor/courses/new">
                                <button className="bg-[var(--wonder-green)] text-black px-6 py-3 rounded-full font-bold">
                                    Create Your First Course
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {courses.map((course, i) => (
                                <motion.div key={course.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                                    className="flex items-center gap-4 p-5 hover:bg-white/5 transition-colors">
                                    {/* Thumbnail */}
                                    <div className="w-20 h-14 rounded-xl overflow-hidden bg-black/40 flex-shrink-0">
                                        {course.thumbnail ? (
                                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Video size={20} className="text-gray-600" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white truncate">{course.title}</h3>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                            <span>{course.category}</span>
                                            <span>•</span>
                                            <span className="capitalize">{course.level}</span>
                                            <span>•</span>
                                            <span>{course.modules.reduce((s, m) => s + m._count.videos, 0)} videos</span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="hidden md:flex items-center gap-6 text-sm">
                                        <div className="text-center">
                                            <p className="font-bold text-white">{course._count.enrollments}</p>
                                            <p className="text-gray-500 text-xs">Students</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold text-[var(--wonder-green)]">${(course.analytics?.totalRevenue ?? 0).toFixed(0)}</p>
                                            <p className="text-gray-500 text-xs">Revenue</p>
                                        </div>
                                    </div>

                                    {/* Status badge */}
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${course.status === "published" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                                        }`}>
                                        {course.status === "published" ? "Published" : "Draft"}
                                    </span>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <Link href={`/instructor/courses/${course.id}/edit`}>
                                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Edit">
                                                <Edit size={16} className="text-gray-400 hover:text-white" />
                                            </button>
                                        </Link>
                                        <button onClick={() => togglePublish(course)} disabled={togglingId === course.id}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors" title={course.status === "published" ? "Unpublish" : "Publish"}>
                                            {course.status === "published"
                                                ? <EyeOff size={16} className="text-gray-400 hover:text-yellow-400" />
                                                : <Eye size={16} className="text-gray-400 hover:text-green-400" />
                                            }
                                        </button>
                                        <button onClick={() => deleteCourse(course.id)} disabled={deletingId === course.id}
                                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                                            <Trash2 size={16} className="text-gray-400 hover:text-red-400" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
