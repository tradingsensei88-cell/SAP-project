"use client";

import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/course/VideoPlayer";
import CourseSidebar from "@/components/course/CourseSidebar";
import ContextAI from "@/components/course/ContextAI";
import { motion } from "framer-motion";
import { Info, Share2, Award } from "lucide-react";

export default function CoursePage() {
    const params = useParams();
    const courseId = params.id as string;

    return (
        <main className="min-h-screen bg-[var(--background)] text-white overflow-hidden flex flex-col">
            <Navbar />

            <div className="mt-20 flex-1 flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden">
                {/* Main Content (Left) */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Video Section */}
                        <div className="w-full max-w-5xl mx-auto">
                            <VideoPlayer />

                            {/* Meta Info */}
                            <div className="mt-8">
                                <h1 className="text-3xl font-bold mb-4">Cinematic 3D Rendering with Blender</h1>

                                <div className="flex items-center space-x-6 text-sm text-gray-400 mb-6 border-b border-white/10 pb-6">
                                    <div className="flex items-center space-x-2">
                                        <img src="https://i.pravatar.cc/150?u=alex" alt="Instructor" className="w-8 h-8 rounded-full" />
                                        <span className="text-white font-medium">Alex S.</span>
                                    </div>
                                    <span>Last updated Oct 2024</span>
                                    <span className="flex items-center gap-1 text-[var(--wonder-green)]">
                                        <Award size={16} /> Certificate Included
                                    </span>
                                </div>

                                <div className="prose prose-invert max-w-none text-gray-300">
                                    <h3 className="text-xl font-bold text-white mb-2">About this lesson</h3>
                                    <p>
                                        In this comprehensive module, we dive deep into the fundamentals of 3D rendering.
                                        You will learn how to set up your scene, lighting, and camera to achieve photorealistic results.
                                        We also cover the basics of the Cycles engine and how to optimize your render times.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar (Right) */}
                <CourseSidebar />
            </div>

            {/* Floating Tools */}
            <ContextAI />
        </main>
    );
}
