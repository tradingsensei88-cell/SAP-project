"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Video, Upload, ChevronDown, ChevronUp, Loader2, Save, Eye, EyeOff, Edit2, Check, X } from "lucide-react";
import Link from "next/link";

interface VideoItem {
    id: string;
    title: string;
    status: string;
    cloudinaryUrl: string | null;
    duration: number | null;
    order: number;
}

interface ModuleItem {
    id: string;
    title: string;
    order: number;
    videos: VideoItem[];
}

interface Course {
    id: string;
    title: string;
    description: string;
    category: string;
    level: string;
    price: number;
    thumbnail: string | null;
    status: string;
    modules: ModuleItem[];
}

export default function EditCoursePage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState("");
    const [addingModule, setAddingModule] = useState(false);
    const [expandedModule, setExpandedModule] = useState<string | null>(null);
    const [uploadingVideo, setUploadingVideo] = useState<string | null>(null);
    const [newVideoTitles, setNewVideoTitles] = useState<Record<string, string>>({});
    const [editingTitle, setEditingTitle] = useState(false);
    const [titleDraft, setTitleDraft] = useState("");

    useEffect(() => { fetchCourse(); }, [id]);

    async function fetchCourse() {
        const res = await fetch(`/api/courses/${id}`);
        if (res.ok) {
            const data = await res.json();
            setCourse(data);
            setTitleDraft(data.title);
        }
        setLoading(false);
    }

    async function saveTitle() {
        if (!course || !titleDraft.trim()) return;
        await fetch(`/api/courses/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: titleDraft }),
        });
        setCourse((prev) => prev ? { ...prev, title: titleDraft } : prev);
        setEditingTitle(false);
    }

    async function togglePublish() {
        if (!course) return;
        setSaving(true);
        const newStatus = course.status === "published" ? "draft" : "published";
        await fetch(`/api/courses/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });
        setCourse((prev) => prev ? { ...prev, status: newStatus } : prev);
        setSaving(false);
    }

    async function addModule() {
        if (!newModuleTitle.trim()) return;
        setAddingModule(true);
        const res = await fetch(`/api/courses/${id}/modules`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newModuleTitle }),
        });
        if (res.ok) {
            setNewModuleTitle("");
            await fetchCourse();
        }
        setAddingModule(false);
    }

    async function deleteModule(moduleId: string) {
        if (!confirm("Delete this module and all its videos?")) return;
        await fetch(`/api/modules/${moduleId}`, { method: "DELETE" });
        await fetchCourse();
    }

    async function handleVideoUpload(moduleId: string, file: File) {
        const videoTitle = newVideoTitles[moduleId] || file.name.replace(/\.[^/.]+$/, "");
        setUploadingVideo(moduleId);

        try {
            // Upload to Cloudinary
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "wonder_learning");
            formData.append("resource_type", "video");

            const cloudRes = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
                { method: "POST", body: formData }
            );
            const cloudData = await cloudRes.json();

            if (!cloudData.secure_url) throw new Error("Upload failed");

            // Save to DB
            await fetch(`/api/modules/${moduleId}/videos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: videoTitle,
                    cloudinaryUrl: cloudData.secure_url,
                    cloudinaryPublicId: cloudData.public_id,
                    duration: cloudData.duration,
                }),
            });

            setNewVideoTitles((prev) => ({ ...prev, [moduleId]: "" }));
            await fetchCourse();
        } catch (e) {
            alert("Video upload failed. Make sure your Cloudinary upload preset is configured.");
        }
        setUploadingVideo(null);
    }

    async function deleteVideo(videoId: string) {
        if (!confirm("Delete this video?")) return;
        await fetch(`/api/videos/${videoId}`, { method: "DELETE" });
        await fetchCourse();
    }

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
            <div className="pt-24 px-6 max-w-4xl mx-auto pb-16">
                <Link href="/instructor" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to Studio
                </Link>

                {/* Course Header */}
                <div className="flex items-start justify-between mb-8 gap-4">
                    <div className="flex-1">
                        {editingTitle ? (
                            <div className="flex items-center gap-2">
                                <input value={titleDraft} onChange={(e) => setTitleDraft(e.target.value)}
                                    className="text-2xl font-bold bg-white/10 border border-[var(--wonder-green)] rounded-xl px-4 py-2 text-white outline-none flex-1"
                                    onKeyDown={(e) => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") setEditingTitle(false); }}
                                    autoFocus />
                                <button onClick={saveTitle} className="p-2 bg-[var(--wonder-green)] text-black rounded-lg"><Check size={16} /></button>
                                <button onClick={() => setEditingTitle(false)} className="p-2 bg-white/10 rounded-lg"><X size={16} /></button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold">{course.title}</h1>
                                <button onClick={() => setEditingTitle(true)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                    <Edit2 size={14} className="text-gray-400" />
                                </button>
                            </div>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                            <span>{course.category}</span>
                            <span>•</span>
                            <span className="capitalize">{course.level}</span>
                            <span>•</span>
                            <span>${course.price}</span>
                        </div>
                    </div>
                    <button onClick={togglePublish} disabled={saving}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${course.status === "published"
                                ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                                : "bg-[var(--wonder-green)] text-black hover:shadow-[0_0_15px_rgba(204,255,0,0.4)]"
                            }`}>
                        {saving ? <Loader2 size={14} className="animate-spin" /> : course.status === "published" ? <><EyeOff size={14} /> Unpublish</> : <><Eye size={14} /> Publish</>}
                    </button>
                </div>

                {/* Modules */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Course Modules</h2>

                    {course.modules.length === 0 && (
                        <div className="bg-[var(--wonder-gray)] rounded-2xl border border-white/5 p-8 text-center text-gray-400">
                            No modules yet. Add your first module below.
                        </div>
                    )}

                    {course.modules.map((mod, i) => (
                        <motion.div key={mod.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="bg-[var(--wonder-gray)] rounded-2xl border border-white/5 overflow-hidden">
                            {/* Module Header */}
                            <div className="flex items-center gap-3 p-5 cursor-pointer" onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}>
                                <div className="w-7 h-7 rounded-full bg-[var(--wonder-green)]/20 text-[var(--wonder-green)] flex items-center justify-center text-sm font-bold flex-shrink-0">
                                    {i + 1}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold">{mod.title}</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">{mod.videos.length} video{mod.videos.length !== 1 ? "s" : ""}</p>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); deleteModule(mod.id); }}
                                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors mr-1">
                                    <Trash2 size={14} className="text-gray-500 hover:text-red-400" />
                                </button>
                                {expandedModule === mod.id ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                            </div>

                            {/* Module Content */}
                            {expandedModule === mod.id && (
                                <div className="border-t border-white/5 p-5 space-y-3">
                                    {/* Videos */}
                                    {mod.videos.map((video) => (
                                        <div key={video.id} className="flex items-center gap-3 bg-black/20 rounded-xl p-3">
                                            <Video size={16} className="text-[var(--wonder-green)] flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{video.title}</p>
                                                <p className="text-xs text-gray-500">
                                                    {video.duration ? `${Math.round(video.duration / 60)}m` : "—"}
                                                    {" · "}
                                                    <span className={video.status === "ready" ? "text-green-400" : "text-yellow-400"}>
                                                        {video.status}
                                                    </span>
                                                </p>
                                            </div>
                                            <button onClick={() => deleteVideo(video.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors">
                                                <Trash2 size={13} className="text-gray-500 hover:text-red-400" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Upload new video */}
                                    <div className="border-2 border-dashed border-white/10 rounded-xl p-4">
                                        <p className="text-sm font-medium text-gray-300 mb-3">Add Video</p>
                                        <input
                                            value={newVideoTitles[mod.id] || ""}
                                            onChange={(e) => setNewVideoTitles((prev) => ({ ...prev, [mod.id]: e.target.value }))}
                                            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[var(--wonder-green)] mb-3"
                                            placeholder="Video title (optional)" />
                                        <label className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-bold cursor-pointer transition-all ${uploadingVideo === mod.id
                                                ? "bg-white/5 text-gray-400 cursor-not-allowed"
                                                : "bg-[var(--wonder-green)]/20 text-[var(--wonder-green)] hover:bg-[var(--wonder-green)]/30"
                                            }`}>
                                            {uploadingVideo === mod.id ? (
                                                <><Loader2 size={14} className="animate-spin" /> Uploading to Cloudinary...</>
                                            ) : (
                                                <><Upload size={14} /> Upload Video</>
                                            )}
                                            <input type="file" accept="video/*" className="hidden"
                                                disabled={uploadingVideo !== null}
                                                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleVideoUpload(mod.id, f); }} />
                                        </label>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}

                    {/* Add Module */}
                    <div className="bg-[var(--wonder-gray)] rounded-2xl border border-dashed border-white/10 p-5">
                        <p className="text-sm font-bold text-gray-300 mb-3">Add New Module</p>
                        <div className="flex gap-3">
                            <input value={newModuleTitle} onChange={(e) => setNewModuleTitle(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") addModule(); }}
                                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[var(--wonder-green)] outline-none text-sm"
                                placeholder="e.g. Introduction to React" />
                            <button onClick={addModule} disabled={addingModule || !newModuleTitle.trim()}
                                className="bg-[var(--wonder-green)] text-black px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-[0_0_15px_rgba(204,255,0,0.3)] transition-all disabled:opacity-50">
                                {addingModule ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
