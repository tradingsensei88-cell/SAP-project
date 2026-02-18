"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Course {
    id: string;
    title: string;
    category: string;
    level: string;
    price: number;
    thumbnail: string | null;
    instructor: { name: string };
    _count: { enrollments: number };
}

function CourseCard({ course, index }: { course: Course; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-black/40 rounded-3xl overflow-hidden border border-white/5 hover:border-[var(--wonder-green)]/40 transition-all duration-500"
        >
            <div className="relative h-48 overflow-hidden">
                {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--wonder-green)]/20 to-purple-500/20 flex items-center justify-center">
                        <span className="text-4xl">🎓</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                    <span className="bg-[var(--wonder-green)] text-black text-xs font-bold px-2 py-1 rounded-full">{course.category}</span>
                </div>
                <div className="absolute top-3 right-3">
                    <span className="bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-full capitalize">{course.level}</span>
                </div>
            </div>

            <div className="p-5">
                <h3 className="font-bold text-white text-lg leading-tight mb-2 group-hover:text-[var(--wonder-green)] transition-colors line-clamp-2">{course.title}</h3>
                <p className="text-sm text-gray-400 mb-3">by {course.instructor.name}</p>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{course._count.enrollments} students</span>
                    <span className="font-bold text-[var(--wonder-green)]">
                        {course.price === 0 ? "Free" : `$${course.price}`}
                    </span>
                </div>
                <Link href={`/courses/${course.id}`}>
                    <button className="mt-4 w-full py-2.5 rounded-xl bg-white/5 hover:bg-[var(--wonder-green)] hover:text-black text-white text-sm font-bold transition-all duration-300">
                        View Course
                    </button>
                </Link>
            </div>
        </motion.div>
    );
}

export default function CourseGrid() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/courses?published=true")
            .then((r) => r.json())
            .then((data) => { setCourses(Array.isArray(data) ? data : []); setLoading(false); });
    }, []);

    return (
        <section className="py-24 px-6 bg-[var(--wonder-gray)] relative overflow-hidden" id="courses">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--wonder-green)] to-transparent opacity-30" />

            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
                    <h2 className="text-[var(--wonder-green)] font-mono text-sm tracking-widest mb-4">DISCOVER THE UNKNOWN</h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-white">PREMIUM COURSES</h3>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-black/40 rounded-3xl h-72 animate-pulse border border-white/5" />
                        ))}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <p className="text-xl mb-2">No courses published yet</p>
                        <p className="text-sm">Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {courses.map((course, index) => (
                            <CourseCard key={course.id} course={course} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
