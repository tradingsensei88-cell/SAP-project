"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, BookOpen, GraduationCap, Loader2 } from "lucide-react";
import { authenticate, googleLogin } from "@/actions/login";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton({ role }: { role: string }) {
    const { pending } = useFormStatus();
    return (
        <button disabled={pending} className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-[var(--wonder-green)] transition-all flex items-center justify-center gap-2 group disabled:opacity-60">
            {pending
                ? <><Loader2 size={18} className="animate-spin" /> Signing in...</>
                : <>Login as {role === "student" ? "Student" : "Instructor"} <ChevronRight className="group-hover:translate-x-1 transition-transform" /></>
            }
        </button>
    );
}

export default function LoginPage() {
    const [role, setRole] = useState<"student" | "instructor">("student");
    const [state, dispatch] = useActionState(authenticate, undefined);
    const { data: session, status } = useSession();

    // Redirect after successful login based on role from server action
    useEffect(() => {
        if (state?.success && state.redirectUrl) {
            window.location.href = state.redirectUrl;
        } else if (status === "authenticated" && !state?.error) {
            // Fallback if session is already present but action state is lost/ignored
            const userRole = (session?.user as any)?.role;
            window.location.href = userRole === "instructor" ? "/instructor" : "/dashboard";
        }
    }, [state, status, session]);

    return (
        <main className="min-h-screen bg-[var(--background)] relative flex items-center justify-center overflow-hidden">
            <Navbar />
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[var(--wonder-green)]/10 rounded-full blur-[128px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[128px]" />

            <div className="w-full max-w-md z-10 p-6 pt-20">
                <h1 className="text-4xl font-bold text-white mb-2 text-center">Welcome Back</h1>
                <p className="text-gray-400 text-center mb-8">Sign in to your account</p>

                {/* Role Toggle */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    {(["student", "instructor"] as const).map((r) => (
                        <motion.button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${role === r
                                ? "border-[var(--wonder-green)] bg-[var(--wonder-green)]/10"
                                : "border-white/10 bg-white/5 hover:border-white/30"
                                }`}
                        >
                            {r === "student"
                                ? <BookOpen size={22} className={role === r ? "text-[var(--wonder-green)]" : "text-gray-400"} />
                                : <GraduationCap size={22} className={role === r ? "text-[var(--wonder-green)]" : "text-gray-400"} />
                            }
                            <span className={`text-xs font-bold uppercase ${role === r ? "text-white" : "text-gray-400"}`}>
                                {r}
                            </span>
                        </motion.button>
                    ))}
                </div>

                <form action={dispatch} className="space-y-4">
                    <input type="hidden" name="role" value={role} />
                    <input
                        name="email"
                        type="email"
                        className="w-full bg-[var(--wonder-gray)] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[var(--wonder-green)] outline-none"
                        placeholder="Email"
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        className="w-full bg-[var(--wonder-gray)] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[var(--wonder-green)] outline-none"
                        placeholder="Password"
                        required
                    />

                    {state?.error && <p className="text-red-500 text-center text-sm bg-red-500/10 rounded-xl py-2 px-3">{state.error}</p>}
                    {state?.success && <p className="text-green-400 text-center text-sm">Signed in! Redirecting...</p>}

                    <SubmitButton role={role} />
                </form>

                <div className="mt-6">
                    <form action={googleLogin}>
                        <button className="w-full bg-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                            Sign in with Google
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-white hover:text-[var(--wonder-green)] font-bold">Register</Link>
                </div>
            </div>
        </main>
    );
}
