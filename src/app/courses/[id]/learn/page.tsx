"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { ChevronLeft, ChevronRight, CheckCircle, Play, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface VideoData {
    id: string;
    title: string;
    cloudinaryUrl: string | null;
    duration: number | null;
    lastPosition: number;
    watchedSeconds: number;
    completed: boolean;
}

interface Module {
    id: string;
    title: string;
    videos: { id: string; title: string; duration: number | null }[];
}

interface Course {
    id: string;
    title: string;
    modules: Module[];
}

export default function LearnPage() {
    const { id } = useParams<{ id: string }>();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session, status } = useSession();

    const [course, setCourse] = useState<Course | null>(null);
    const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);
    const [currentVideoId, setCurrentVideoId] = useState<string | null>(searchParams.get("video"));
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const videoRef = useRef<HTMLVideoElement>(null);
    const watchInterval = useRef<NodeJS.Timeout | null>(null);
    const sessionWatchSeconds = useRef(0);

    useEffect(() => {
        if (status === "unauthenticated") { router.push("/login"); return; }
        if (status === "authenticated") fetchCourse();
    }, [status]);

    useEffect(() => {
        if (currentVideoId) fetchVideo(currentVideoId);
    }, [currentVideoId]);

    async function fetchCourse() {
        const res = await fetch(`/api/courses/${id}`);
        if (res.ok) {
            const data = await res.json();
            setCourse(data);
            // Auto-select first video if none selected
            if (!currentVideoId && data.modules[0]?.videos[0]) {
                setCurrentVideoId(data.modules[0].videos[0].id);
            }
        }
        setLoading(false);
    }

    async function fetchVideo(videoId: string) {
        const res = await fetch(`/api/videos/${videoId}`);
        if (res.ok) {
            const data = await res.json();
            setCurrentVideo(data);
        } else if (res.status === 403) {
            router.push(`/courses/${id}`);
        }
    }

    function selectVideo(videoId: string) {
        saveProgress();
        setCurrentVideoId(videoId);
        sessionWatchSeconds.current = 0;
    }

    const saveProgress = useCallback(async () => {
        if (!currentVideoId || sessionWatchSeconds.current === 0) return;
        const pos = videoRef.current?.currentTime ?? 0;
        const dur = videoRef.current?.duration ?? 0;
        const completed = dur > 0 && pos / dur >= 0.9;

        await fetch("/api/analytics/watch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                videoId: currentVideoId,
                watchedSeconds: sessionWatchSeconds.current,
                lastPosition: pos,
                completed,
            }),
        });
        sessionWatchSeconds.current = 0;
    }, [currentVideoId]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !currentVideo) return;

        // Resume from last position
        const onLoaded = () => {
            if (currentVideo.lastPosition > 0 && currentVideo.lastPosition < (video.duration - 5)) {
                video.currentTime = currentVideo.lastPosition;
            }
        };
        video.addEventListener("loadedmetadata", onLoaded);

        // Track watch time every 10s
        watchInterval.current = setInterval(() => {
            if (!video.paused) sessionWatchSeconds.current += 10;
        }, 10000);

        // Save on pause/end
        video.addEventListener("pause", saveProgress);
        video.addEventListener("ended", saveProgress);

        return () => {
            video.removeEventListener("loadedmetadata", onLoaded);
            video.removeEventListener("pause", saveProgress);
            video.removeEventListener("ended", saveProgress);
            if (watchInterval.current) clearInterval(watchInterval.current);
            saveProgress();
        };
    }, [currentVideo, saveProgress]);

    // Get flat list of all videos for prev/next navigation
    const allVideos = course?.modules.flatMap((m) => m.videos) ?? [];
    const currentIndex = allVideos.findIndex((v) => v.id === currentVideoId);

    if (loading) return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
            <Loader2 size={32} className="text-[var(--wonder-green)] animate-spin" />
        </div>
    );

    return (
        <main className="min-h-screen bg-[var(--background)] text-white flex flex-col">
            <Navbar />
            <div className="pt-16 flex flex-1 overflow-hidden">
                {/* Main Content */}
                <div className={`flex-1 flex flex-col ${sidebarOpen ? "md:mr-80" : ""} transition-all`}>
                    {/* Video Player */}
                    <div className="bg-black aspect-video w-full relative">
                        {currentVideo?.cloudinaryUrl ? (
                            <video
                                ref={videoRef}
                                key={currentVideo.id}
                                src={currentVideo.cloudinaryUrl}
                                controls
                                className="w-full h-full"
                                controlsList="nodownload"
                                onContextMenu={(e) => e.preventDefault()}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <div className="text-center">
                                    <Play size={48} className="mx-auto mb-3 opacity-30" />
                                    <p>Select a video to start learning</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Video Info & Navigation */}
                    <div className="p-6 border-b border-white/5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <Link href={`/courses/${id}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 mb-2 transition-colors">
                                    <ArrowLeft size={12} /> Back to course
                                </Link>
                                <h1 className="text-xl font-bold">{currentVideo?.title ?? "Select a lesson"}</h1>
                                <p className="text-sm text-gray-400 mt-1">{course?.title}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button onClick={() => currentIndex > 0 && selectVideo(allVideos[currentIndex - 1].id)}
                                    disabled={currentIndex <= 0}
                                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-30">
                                    <ChevronLeft size={18} />
                                </button>
                                <span className="text-sm text-gray-400">{currentIndex + 1} / {allVideos.length}</span>
                                <button onClick={() => currentIndex < allVideos.length - 1 && selectVideo(allVideos[currentIndex + 1].id)}
                                    disabled={currentIndex >= allVideos.length - 1}
                                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-30">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className={`fixed right-0 top-16 bottom-0 w-80 bg-[var(--wonder-gray)] border-l border-white/5 overflow-y-auto transition-transform ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                        <h2 className="font-bold text-sm">Course Content</h2>
                        <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white text-xs">Hide</button>
                    </div>
                    {course?.modules.map((mod, mi) => (
                        <div key={mod.id}>
                            <div className="px-4 py-3 bg-black/20">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                                    {mi + 1}. {mod.title}
                                </p>
                            </div>
                            {mod.videos.map((video, vi) => (
                                <button key={video.id} onClick={() => selectVideo(video.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors ${currentVideoId === video.id ? "bg-[var(--wonder-green)]/10 border-r-2 border-[var(--wonder-green)]" : ""}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${currentVideoId === video.id ? "bg-[var(--wonder-green)] text-black" : "bg-white/10 text-gray-400"}`}>
                                        {currentVideoId === video.id ? <Play size={10} /> : vi + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm truncate ${currentVideoId === video.id ? "text-white font-medium" : "text-gray-300"}`}>{video.title}</p>
                                        {video.duration && <p className="text-xs text-gray-500">{Math.round(video.duration / 60)}m</p>}
                                    </div>
                                </button>
                            ))}
                        </div>
                    ))}
                </div>

                {!sidebarOpen && (
                    <button onClick={() => setSidebarOpen(true)}
                        className="fixed right-4 bottom-4 bg-[var(--wonder-green)] text-black p-3 rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all z-50">
                        <ChevronLeft size={20} />
                    </button>
                )}
            </div>
        </main>
    );
}
