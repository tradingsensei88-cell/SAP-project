"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import {
    Youtube,
    Download,
    FileJson,
    FileText,
    Copy,
    Check,
    Loader2,
    AlertCircle,
    Coins
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TranscriptSegment {
    text: string;
    start: number;
    duration: number;
}

export default function TranscribePage() {
    const { data: session } = useSession();
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transcript, setTranscript] = useState<TranscriptSegment[] | null>(null);
    const [copied, setCopied] = useState(false);
    const [credits, setCredits] = useState<number | null>(null);

    const handleTranscribe = async () => {
        if (!url) return;
        setLoading(true);
        setError(null);
        setTranscript(null);

        try {
            const res = await fetch("/api/transcript", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to transcribe");

            setTranscript(data.transcript);
            setCredits(data.creditsRemaining);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const downloadAsJson = () => {
        if (!transcript) return;
        const blob = new Blob([JSON.stringify(transcript, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "transcript.json";
        a.click();
    };

    const downloadAsTxt = () => {
        if (!transcript) return;
        const text = transcript.map(s => `[${formatTime(s.start)}] ${s.text}`).join("\n");
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "transcript.txt";
        a.click();
    };

    const copyToClipboard = () => {
        if (!transcript) return;
        const text = transcript.map(s => s.text).join(" ");
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <main className="min-h-screen bg-[var(--background)] text-white">
            <Navbar />

            <div className="pt-24 px-6 max-w-5xl mx-auto pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                        <Youtube className="text-red-500" size={40} />
                        YouTube <span className="text-[var(--wonder-green)]">Transcriber</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Extract accurate transcripts from any YouTube video in seconds.
                        Each transcription costs <span className="text-[var(--wonder-green)] font-bold">10 credits</span>.
                    </p>
                </motion.div>

                {/* Input Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[var(--wonder-gray)] p-8 rounded-3xl border border-white/5 mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Paste YouTube video URL here..."
                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--wonder-green)] transition-all text-lg"
                            />
                        </div>
                        <button
                            onClick={handleTranscribe}
                            disabled={loading || !url}
                            className={`px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${loading || !url
                                ? "bg-white/5 text-gray-500 cursor-not-allowed"
                                : "bg-[var(--wonder-green)] text-black hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(204,255,0,0.2)]"
                                }`}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                "Transcribe"
                            )}
                        </button>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                        <Coins size={16} className="text-yellow-500" />
                        <span>Available Credits: <span className="text-white font-bold">{credits ?? (session?.user as any)?.credits ?? 0} / 100</span></span>
                    </div>
                </motion.div>

                {/* Error State */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl mb-8 flex items-start gap-4"
                        >
                            <AlertCircle className="text-red-500 shrink-0" size={24} />
                            <p className="text-red-200">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Result Section */}
                <AnimatePresence>
                    {transcript && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Actions Header */}
                            <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                <h2 className="text-xl font-bold">Transcript</h2>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={copyToClipboard}
                                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center gap-2 text-sm"
                                        title="Copy all text"
                                    >
                                        {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                        {copied ? "Copied" : "Copy All"}
                                    </button>
                                    <button
                                        onClick={downloadAsJson}
                                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center gap-2 text-sm"
                                    >
                                        <FileJson size={18} className="text-blue-400" />
                                        JSON
                                    </button>
                                    <button
                                        onClick={downloadAsTxt}
                                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center gap-2 text-sm"
                                    >
                                        <FileText size={18} className="text-orange-400" />
                                        TXT
                                    </button>
                                </div>
                            </div>

                            {/* Transcript Content */}
                            <div className="bg-[var(--wonder-gray)] rounded-3xl border border-white/5 overflow-hidden">
                                <div className="max-h-[600px] overflow-y-auto p-8 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                    {transcript.map((item, i) => (
                                        <div key={i} className="flex gap-6 group">
                                            <span className="text-[var(--wonder-green)] font-mono text-sm pt-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                                {formatTime(item.start)}
                                            </span>
                                            <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                                                {item.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
