"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Upload, ArrowLeft, ArrowRight, Check, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";

const CATEGORIES = ["Development", "Design", "Business", "Marketing", "3D & Animation", "Game Dev", "Music", "Photography", "Other"];
const LEVELS = ["beginner", "intermediate", "advanced"];

export default function NewCoursePage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [uploadingThumb, setUploadingThumb] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "Development",
        level: "beginner",
        price: "0",
        thumbnail: "",
    });

    function set(key: string, val: string) {
        setForm((prev) => ({ ...prev, [key]: val }));
    }

    async function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingThumb(true);
        try {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "wonder_learning");
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                { method: "POST", body: data }
            );
            const json = await res.json();
            if (json.secure_url) set("thumbnail", json.secure_url);
        } catch {
            setError("Thumbnail upload failed. Please try again.");
        }
        setUploadingThumb(false);
    }

    async function handleSubmit(publish = false) {
        if (!form.title.trim()) { setError("Title is required"); return; }
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, status: publish ? "published" : "draft" }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error || "Failed to create course"); setLoading(false); return; }
            router.push(`/instructor/courses/${data.id}/edit`);
        } catch {
            setError("Something went wrong");
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[var(--background)] text-white">
            <Navbar />
            <div className="pt-24 px-6 max-w-3xl mx-auto pb-16">
                {/* Back */}
                <Link href="/instructor" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to Studio
                </Link>

                <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
                <p className="text-gray-400 mb-10">Fill in the details below to set up your course</p>

                {/* Steps indicator */}
                <div className="flex items-center gap-2 mb-10">
                    {[1, 2].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? "bg-[var(--wonder-green)] text-black" : "bg-white/10 text-gray-400"
                                }`}>
                                {step > s ? <Check size={14} /> : s}
                            </div>
                            <span className={`text-sm ${step >= s ? "text-white" : "text-gray-500"}`}>
                                {s === 1 ? "Basic Info" : "Thumbnail"}
                            </span>
                            {s < 2 && <div className={`w-12 h-px ${step > s ? "bg-[var(--wonder-green)]" : "bg-white/10"}`} />}
                        </div>
                    ))}
                </div>

                <div className="bg-[var(--wonder-gray)] rounded-3xl border border-white/5 p-8">
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">Course Title *</label>
                                <input value={form.title} onChange={(e) => set("title", e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[var(--wonder-green)] outline-none"
                                    placeholder="e.g. Complete React Developer Course" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
                                <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4}
                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[var(--wonder-green)] outline-none resize-none"
                                    placeholder="What will students learn in this course?" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">Category</label>
                                    <select value={form.category} onChange={(e) => set("category", e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[var(--wonder-green)] outline-none">
                                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">Level</label>
                                    <select value={form.level} onChange={(e) => set("level", e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[var(--wonder-green)] outline-none">
                                        {LEVELS.map((l) => <option key={l} value={l} className="capitalize">{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">Price (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                    <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:border-[var(--wonder-green)] outline-none"
                                        placeholder="0.00" />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Set to 0 for a free course</p>
                            </div>
                            {error && <p className="text-red-400 text-sm">{error}</p>}
                            <button onClick={() => { if (!form.title.trim()) { setError("Title is required"); return; } setError(""); setStep(2); }}
                                className="w-full bg-[var(--wonder-green)] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all">
                                Next: Add Thumbnail <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-4">Course Thumbnail</label>
                                {form.thumbnail ? (
                                    <div className="relative rounded-2xl overflow-hidden h-56 mb-4">
                                        <img src={form.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                                        <button onClick={() => set("thumbnail", "")}
                                            className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs hover:bg-red-500/80 transition-colors">
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center h-56 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-[var(--wonder-green)]/50 transition-colors">
                                        {uploadingThumb ? (
                                            <Loader2 size={32} className="text-[var(--wonder-green)] animate-spin" />
                                        ) : (
                                            <>
                                                <ImageIcon size={40} className="text-gray-500 mb-3" />
                                                <p className="text-gray-400 font-medium">Click to upload thumbnail</p>
                                                <p className="text-gray-600 text-sm mt-1">PNG, JPG up to 10MB</p>
                                            </>
                                        )}
                                        <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} disabled={uploadingThumb} />
                                    </label>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                    💡 Tip: Add your Cloudinary upload preset <code className="text-[var(--wonder-green)]">wonder_learning</code> in your Cloudinary dashboard (Settings → Upload → Add upload preset, set to unsigned).
                                </p>
                            </div>

                            {error && <p className="text-red-400 text-sm">{error}</p>}

                            <div className="flex gap-3">
                                <button onClick={() => setStep(1)} className="flex-1 bg-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                                    <ArrowLeft size={18} /> Back
                                </button>
                                <button onClick={() => handleSubmit(false)} disabled={loading}
                                    className="flex-1 bg-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/20 transition-all disabled:opacity-50">
                                    {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Save as Draft"}
                                </button>
                                <button onClick={() => handleSubmit(true)} disabled={loading}
                                    className="flex-1 bg-[var(--wonder-green)] text-black font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <><Upload size={18} /> Publish</>}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </main>
    );
}
