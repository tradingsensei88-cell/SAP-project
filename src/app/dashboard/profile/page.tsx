"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import {
    User,
    Mail,
    Camera,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Coins,
    TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CldUploadWidget } from "next-cloudinary";

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [profile, setProfile] = useState({
        name: "",
        bio: "",
        image: "",
        email: "",
        credits: 0,
        maxCredits: 30
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/user/profile");
            const data = await res.json();
            if (res.ok) {
                setProfile({
                    name: data.name || "",
                    bio: data.bio || "",
                    image: data.image || "",
                    email: data.email || "",
                    credits: data.credits || 0,
                    maxCredits: data.maxCredits || 30
                });
            }
        } catch (err) {
            console.error("Failed to fetch profile", err);
        } finally {
            setFetching(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: profile.name,
                    bio: profile.bio,
                    image: profile.image
                }),
            });

            if (!res.ok) throw new Error("Failed to update profile");

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);

            // Update session data
            await update({
                name: profile.name,
                image: profile.image
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const creditPercentage = Math.min((profile.credits / profile.maxCredits) * 100, 100);

    if (fetching) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <Loader2 className="text-[var(--wonder-green)] animate-spin" size={40} />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[var(--background)] text-white">
            <Navbar />

            <div className="pt-24 px-6 max-w-4xl mx-auto pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold mb-2">Edit <span className="text-[var(--wonder-green)]">Profile</span></h1>
                    <p className="text-gray-400">Manage your account information and track your credits.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Avatar & Credits */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-8"
                    >
                        {/* Avatar Card */}
                        <div className="bg-[var(--wonder-gray)] p-8 rounded-3xl border border-white/5 text-center">
                            <div className="relative w-32 h-32 mx-auto mb-6">
                                <div className="w-full h-full rounded-full overflow-hidden border-4 border-[var(--wonder-green)]/20">
                                    {profile.image ? (
                                        <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                            <User size={48} className="text-gray-500" />
                                        </div>
                                    )}
                                </div>

                                <CldUploadWidget
                                    uploadPreset="ml_default" // Ensure this is set in your Cloudinary dash
                                    onSuccess={(result: any) => {
                                        setProfile(prev => ({ ...prev, image: result.info.secure_url }));
                                    }}
                                >
                                    {({ open }) => (
                                        <button
                                            onClick={() => open()}
                                            className="absolute bottom-0 right-0 p-2 bg-[var(--wonder-green)] text-black rounded-full hover:scale-110 transition-all shadow-lg"
                                        >
                                            <Camera size={20} />
                                        </button>
                                    )}
                                </CldUploadWidget>
                            </div>
                            <h3 className="text-xl font-bold">{profile.name || "Student"}</h3>
                            <p className="text-gray-400 text-sm mt-1">{profile.email}</p>
                        </div>

                        {/* Credits Progress Card */}
                        <div className="bg-[var(--wonder-gray)] p-8 rounded-3xl border border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Coins size={20} className="text-yellow-500" />
                                    <span className="font-bold">Your Credits</span>
                                </div>
                                <span className="text-sm font-bold text-[var(--wonder-green)]">{profile.credits} / {profile.maxCredits}</span>
                            </div>

                            <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden mb-4">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${creditPercentage}%` }}
                                    className={`h-full bg-gradient-to-r ${profile.credits < 10 ? 'from-red-500 to-orange-500' : 'from-[var(--wonder-green)] to-green-400'}`}
                                />
                            </div>

                            <p className="text-xs text-gray-500 leading-relaxed">
                                You currently have <span className="text-white font-bold">{profile.credits}</span> credits remaining.
                                Each YouTube transcription costs 10 credits.
                            </p>

                            <button className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all border border-white/10">
                                Purchase More Credits
                            </button>
                        </div>
                    </motion.div>

                    {/* Right Column: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <form onSubmit={handleSave} className="bg-[var(--wonder-gray)] p-8 rounded-3xl border border-white/5 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[var(--wonder-green)] transition-all"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className="w-full bg-black/10 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-600 px-2 italic">Email cannot be changed.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Bio</label>
                                <textarea
                                    value={profile.bio}
                                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                                    rows={4}
                                    className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--wonder-green)] transition-all resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            <div className="pt-4 flex items-center justify-between">
                                <AnimatePresence>
                                    {success && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2 text-green-400 font-medium"
                                        >
                                            <CheckCircle2 size={20} />
                                            <span>Changes saved!</span>
                                        </motion.div>
                                    )}
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2 text-red-400 font-medium"
                                        >
                                            <AlertCircle size={20} />
                                            <span>{error}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="ml-auto px-10 py-4 bg-[var(--wonder-green)] text-black rounded-2xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(204,255,0,0.2)]"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={24} />
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
