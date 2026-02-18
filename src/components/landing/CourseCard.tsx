"use client";

import { motion } from "framer-motion";
import { Star, Clock, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CourseProps {
    course: {
        id: string;
        title: string;
        instructor: string;
        rating: number;
        reviews: number;
        duration: string;
        price: string;
        thumbnail: string;
        category: string;
    };
    index: number;
}

export default function CourseCard({ course, index }: CourseProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -10 }}
            className="group relative bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-[var(--wonder-green)]/50 transition-colors duration-300"
        >
            {/* Thumbnail */}
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-[var(--wonder-green)] border border-[var(--wonder-green)]/20">
                    {course.category}
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-center justify-between mb-3 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-white font-bold">{course.rating}</span>
                        <span className="text-xs">({course.reviews})</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{course.duration}</span>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-[var(--wonder-green)] transition-colors">
                    {course.title}
                </h3>

                <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
                    <User className="w-4 h-4" />
                    <span>{course.instructor}</span>
                </div>

                <div className="flex items-center justify-between mt-4 border-t border-white/10 pt-4">
                    <span className="text-xl font-bold text-white">{course.price}</span>
                    <Link href={`/course/${course.id}`}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-[var(--wonder-green)] transition-colors"
                        >
                            Enroll Now
                        </motion.button>
                    </Link>
                </div>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-[var(--wonder-green)] opacity-0 group-hover:opacity-5 pointer-events-none transition-opacity duration-300" />
        </motion.div>
    );
}
