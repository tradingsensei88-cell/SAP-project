"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, CheckCircle, Circle, PlayCircle, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MODULES = [
    {
        id: 1,
        title: "Introduction to 3D Space",
        duration: "45m",
        lessons: [
            { id: "1-1", title: "Welcome & Overview", type: "video", duration: "5:00", completed: true },
            { id: "1-2", title: "Installing Blender", type: "text", duration: "10:00", completed: true },
            { id: "1-3", title: "Interface Basics", type: "video", duration: "30:00", completed: false },
        ]
    },
    {
        id: 2,
        title: "Modeling Fundamentals",
        duration: "2h 15m",
        lessons: [
            { id: "2-1", title: "Vertices, Edges, Faces", type: "video", duration: "15:00", completed: false },
            { id: "2-2", title: "Extrusion & Beveling", type: "video", duration: "45:00", completed: false },
            { id: "2-3", title: "Modifier Stack Explained", type: "video", duration: "1:15:00", completed: false },
        ]
    },
    {
        id: 3,
        title: "Materials & Shading",
        duration: "1h 30m",
        lessons: [
            { id: "3-1", title: "PBR Workflow", type: "video", duration: "20:00", completed: false },
            { id: "3-2", title: "Procedural Textures", type: "video", duration: "1:10:00", completed: false },
        ]
    }
];

export default function CourseSidebar() {
    const [openModules, setOpenModules] = useState<number[]>([1]);

    const toggleModule = (id: number) => {
        setOpenModules(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    return (
        <div className="w-full lg:w-96 bg-[var(--wonder-gray)] border-l border-white/5 h-full overflow-y-auto">
            <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white mb-2">Course Content</h2>
                <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>8 Lessons • 4h 30m Total</span>
                    <span className="text-[var(--wonder-green)]">25% Complete</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-1 bg-white/10 mt-3 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--wonder-green)] w-1/4" />
                </div>
            </div>

            <div className="flex flex-col">
                {MODULES.map((module) => (
                    <div key={module.id} className="border-b border-white/5">
                        <button
                            onClick={() => toggleModule(module.id)}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                        >
                            <div className="flex flex-col items-start">
                                <h3 className="text-sm font-bold text-gray-200">{module.title}</h3>
                                <span className="text-xs text-gray-500">{module.lessons.length} lessons • {module.duration}</span>
                            </div>
                            {openModules.includes(module.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>

                        <AnimatePresence>
                            {openModules.includes(module.id) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden bg-black/20"
                                >
                                    {module.lessons.map((lesson) => (
                                        <div
                                            key={lesson.id}
                                            className={`px-8 py-3 flex items-center gap-3 text-sm border-l-2 hover:bg-white/5 cursor-pointer transition-colors ${lesson.completed ? "border-[var(--wonder-green)]" : "border-transparent"}`}
                                        >
                                            <div className={lesson.completed ? "text-[var(--wonder-green)]" : "text-gray-600"}>
                                                {lesson.completed ? <CheckCircle size={16} /> : <Circle size={16} />}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`font-medium ${lesson.completed ? "text-white" : "text-gray-400"}`}>{lesson.title}</p>
                                                <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
                                                    {lesson.type === 'video' ? <PlayCircle size={12} /> : <FileText size={12} />}
                                                    <span>{lesson.duration}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}
