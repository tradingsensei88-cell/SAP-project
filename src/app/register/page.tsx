"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ChevronRight, GraduationCap, BookOpen, Loader2 } from "lucide-react";
import { registerUser } from "@/actions/register";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

function SubmitButton({ role }: { role: string }) {
    const { pending } = useFormStatus();
    return (
        <button disabled={pending} className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-[var(--wonder-green)] transition-all flex items-center justify-center gap-2 group disabled:opacity-60">
            {pending
                ? <><Loader2 size={18} className="animate-spin" /> Creating Account...</>
                : <>Join as {role === "instructor" ? "Instructor" : "Student"} <ChevronRight className="group-hover:translate-x-1 transition-transform" /></>
            }
        </button>
    );
}

const initialState: any = { error: "", success: false };

export default function RegisterPage() {
    const [role, setRole] = useState<"student" | "instructor">("student");
    const [state, formAction] = useActionState(registerUser, initialState);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.push("/login");
        }
    }, [state?.success, router]);

    return (
        <main className="min-h-screen bg-[var(--background)] flex items-center justify-center relative overflow-hidden">
            <Navbar />
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[var(--wonder-green)]/10 rounded-full blur-[128px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[128px]" />

            <div className="w-full max-w-md z-10 p-6 mt-20">
                <h1 className="text-4xl font-bold text-white mb-2 text-center">Create Account</h1>
                <p className="text-gray-400 text-center mb-8">Join the Wonder Learning community</p>

                {/* Role Selector */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <motion.button
                        type="button"
                        onClick={() => setRole("student")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${role === "student"
                            ? "border-[var(--wonder-green)] bg-[var(--wonder-green)]/10"
                            : "border-white/10 bg-white/5 hover:border-white/30"
                            }`}
                    >
                        <BookOpen size={28} className={role === "student" ? "text-[var(--wonder-green)]" : "text-gray-400"} />
                        <div className="text-center">
                            <p className={`font-bold text-sm ${role === "student" ? "text-white" : "text-gray-400"}`}>STUDENT</p>
                            <p className="text-xs text-gray-500 mt-1">Learn & grow</p>
                        </div>
                        {role === "student" && (
                            <div className="w-2 h-2 rounded-full bg-[var(--wonder-green)]" />
                        )}
                    </motion.button>

                    <motion.button
                        type="button"
                        onClick={() => setRole("instructor")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${role === "instructor"
                            ? "border-[var(--wonder-green)] bg-[var(--wonder-green)]/10"
                            : "border-white/10 bg-white/5 hover:border-white/30"
                            }`}
                    >
                        <GraduationCap size={28} className={role === "instructor" ? "text-[var(--wonder-green)]" : "text-gray-400"} />
                        <div className="text-center">
                            <p className={`font-bold text-sm ${role === "instructor" ? "text-white" : "text-gray-400"}`}>INSTRUCTOR</p>
                            <p className="text-xs text-gray-500 mt-1">Teach & earn</p>
                        </div>
                        {role === "instructor" && (
                            <div className="w-2 h-2 rounded-full bg-[var(--wonder-green)]" />
                        )}
                    </motion.button>
                </div>

                {/* Role description */}
                <motion.div
                    key={role}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 rounded-xl px-4 py-3 mb-6 text-sm text-gray-400 text-center"
                >
                    {role === "student"
                        ? "📚 Access courses, track progress, and earn certificates."
                        : "🎓 Create courses, upload videos, and grow your audience."}
                </motion.div>

                <form action={formAction} className="space-y-4">
                    <input type="hidden" name="role" value={role} />
                    <input name="name" type="text" className="w-full bg-[var(--wonder-gray)] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[var(--wonder-green)] outline-none" placeholder="Full Name" required />
                    <input name="email" type="email" className="w-full bg-[var(--wonder-gray)] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[var(--wonder-green)] outline-none" placeholder="Email Address" required />
                    <input name="password" type="password" className="w-full bg-[var(--wonder-gray)] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[var(--wonder-green)] outline-none" placeholder="Create Password" required />

                    {state?.error && <p className="text-red-500 text-center text-sm bg-red-500/10 rounded-xl py-2 px-3">{state.error}</p>}
                    {state?.success && <p className="text-green-400 text-center text-sm">Account created! Redirecting...</p>}

                    <SubmitButton role={role} />
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Already have an account? <Link href="/login" className="text-white hover:text-[var(--wonder-green)] font-bold">Login</Link>
                </div>
            </div>
        </main>
    );
}
