"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Play, Users, Clock, BookOpen, ChevronDown, ChevronUp, Lock, CheckCircle, Loader2 } from "lucide-react";

interface Video {
    id: string;
    title: string;
    duration: number | null;
    status: string;
    order: number;
}

interface Module {
    id: string;
    title: string;
    order: number;
    videos: Video[];
}

interface Course {
    id: string;
    title: string;
    description: string;
    category: string;
    level: string;
    price: number;
    thumbnail: string | null;
    instructor: { name: string; image: string | null };
    modules: Module[];
    _count: { enrollments: number };
}

export default function CourseDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { data: session } = useSession();
    const router = useRouter();
    const [course, setCourse] = useState<Course | null>(null);
    const [enrolled, setEnrolled] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [loading, setLoading] = useState(true);
    const [expandedModule, setExpandedModule] = useState<string | null>(null);

    useEffect(() => {
        fetchCourse();
        if (session?.user) checkEnrollment();
        // Track impression
        fetch("/api/analytics/impression", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courseId: id }),
        });
    }, [id, session]);

    async function fetchCourse() {
        const res = await fetch(`/api/courses/${id}`);
        if (res.ok) setCourse(await res.json());
        setLoading(false);
    }

    async function checkEnrollment() {
        const res = await fetch(`/api/enroll?courseId=${id}`);
        if (res.ok) {
            const data = await res.json();
            setEnrolled(data.enrolled);
        }
    }

    async function handleEnroll() {
        if (!session?.user) { router.push("/login"); return; }
        setEnrolling(true);
        const res = await fetch("/api/enroll", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courseId: id }),
        });
        if (res.ok) {
            setEnrolled(true);
            router.push(`/courses/${id}/learn`);
        }
        setEnrolling(false);
    }

    const totalVideos = course?.modules.reduce((s, m) => s + m.videos.length, 0) ?? 0;
    const totalDuration = course?.modules.reduce((s, m) =>
        s + m.videos.reduce((vs, v) => vs + (v.duration ?? 0), 0), 0) ?? 0;

    if (loading) return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
            <Loader2 size={32} className="text-[var(--wonder-green)] animate-spin" />
        </div>
    );

    if (!course) return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-white">
            Course not found
        </div>
    );

    return (
        <main className="min-h-screen bg-[var(--background)] text-white">
            <Navbar />

            {/* Hero */}
            <div className="relative pt-20">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-[var(--background)]" />
                {course.thumbnail && (
                    <img src={course.thumbnail} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-20" />
                )}
                <div className="relative max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-[var(--wonder-green)]/20 text-[var(--wonder-green)] text-xs font-bold px-3 py-1 rounded-full">{course.category}</span>
                            <span className="bg-white/10 text-gray-300 text-xs font-bold px-3 py-1 rounded-full capitalize">{course.level}</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                        <p className="text-gray-300 text-lg mb-6 leading-relaxed">{course.description}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                            <span className="flex items-center gap-1.5"><Users size={14} /> {course._count.enrollments} students</span>
                            <span className="flex items-center gap-1.5"><BookOpen size={14} /> {totalVideos} lessons</span>
                            <span className="flex items-center gap-1.5"><Clock size={14} /> {Math.round(totalDuration / 60)}m total</span>
                        </div>
                        <div className="flex items-center gap-3 mt-6">
                            {course.instructor.image && (
                                <img src={course.instructor.image} alt={course.instructor.name} className="w-10 h-10 rounded-full" />
                            )}
                            <div>
                                <p className="text-xs text-gray-500">Instructor</p>
                                <p className="font-bold">{course.instructor.name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Enroll Card */}
                    <div className="md:col-span-1">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-[var(--wonder-gray)] rounded-3xl border border-white/10 p-6 sticky top-24">
                            {course.thumbnail && (
                                <div className="rounded-2xl overflow-hidden h-40 mb-5">
                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <p className="text-3xl font-bold mb-1">
                                {course.price === 0 ? <span className="text-[var(--wonder-green)]">Free</span> : `$${course.price}`}
                            </p>
                            <p className="text-xs text-gray-500 mb-5">Full lifetime access</p>

                            {enrolled ? (
                                <button onClick={() => router.push(`/courses/${id}/learn`)}
                                    className="w-full bg-[var(--wonder-green)] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all">
                                    <Play size={18} /> Continue Learning
                                </button>
                            ) : (
                                <button onClick={handleEnroll} disabled={enrolling}
                                    className="w-full bg-[var(--wonder-green)] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all disabled:opacity-70">
                                    {enrolling ? <Loader2 size={18} className="animate-spin" /> : course.price === 0 ? "Enroll for Free" : `Enroll — $${course.price}`}
                                </button>
                            )}

                            <ul className="mt-5 space-y-2 text-sm text-gray-400">
                                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[var(--wonder-green)]" /> {totalVideos} video lessons</li>
                                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[var(--wonder-green)]" /> Full lifetime access</li>
                                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[var(--wonder-green)]" /> Progress tracking</li>
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Curriculum */}
            <div className="max-w-7xl mx-auto px-6 pb-16">
                <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
                <div className="space-y-3">
                    {course.modules.map((mod, i) => (
                        <div key={mod.id} className="bg-[var(--wonder-gray)] rounded-2xl border border-white/5 overflow-hidden">
                            <button onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                                className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/5 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-[var(--wonder-green)]/20 text-[var(--wonder-green)] flex items-center justify-center text-sm font-bold flex-shrink-0">
                                    {i + 1}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold">{mod.title}</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">{mod.videos.length} lessons</p>
                                </div>
                                {expandedModule === mod.id ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                            </button>
                            {expandedModule === mod.id && (
                                <div className="border-t border-white/5">
                                    {mod.videos.map((video) => (
                                        <div key={video.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors">
                                            {enrolled ? (
                                                <Play size={14} className="text-[var(--wonder-green)] flex-shrink-0" />
                                            ) : (
                                                <Lock size={14} className="text-gray-500 flex-shrink-0" />
                                            )}
                                            <span className={`text-sm flex-1 ${enrolled ? "text-white" : "text-gray-400"}`}>{video.title}</span>
                                            {video.duration && (
                                                <span className="text-xs text-gray-500">{Math.round(video.duration / 60)}m</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
