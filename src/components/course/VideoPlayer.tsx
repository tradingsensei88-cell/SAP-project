"use client";

import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, ScanLine } from "lucide-react";
import { motion } from "framer-motion";

export default function VideoPlayer({
    src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster = "/course-poster.jpg"
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const duration = videoRef.current.duration;
            setProgress((current / duration) * 100);
        }
    };

    return (
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group border border-white/10 shadow-2xl">
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-cover"
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
            />

            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">

                {/* Progress Bar */}
                <div className="w-full h-1 bg-white/20 mb-4 rounded-full cursor-pointer overflow-hidden">
                    <motion.div
                        className="h-full bg-[var(--wonder-green)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button onClick={togglePlay} className="text-white hover:text-[var(--wonder-green)] transition-colors">
                            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                        </button>
                        <button onClick={() => setIsMuted(!isMuted)} className="text-white hover:text-[var(--wonder-green)] transition-colors">
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                        <span className="text-xs text-gray-400 font-mono">02:14 / 12:30</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 text-xs font-bold text-[var(--wonder-green)] bg-[var(--wonder-green)]/10 px-3 py-1 rounded-full hover:bg-[var(--wonder-green)] hover:text-black transition-colors">
                            <ScanLine size={14} />
                            <span>ASK AI</span>
                        </button>
                        <button className="text-white hover:text-[var(--wonder-green)] transition-colors">
                            <Maximize size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Play Overlay Button (Big) */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-[var(--wonder-green)]/90 flex items-center justify-center text-black backdrop-blur-sm animate-pulse">
                        <Play size={32} fill="currentColor" />
                    </div>
                </div>
            )}
        </div>
    );
}
