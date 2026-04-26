"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function CancelPage() {
    return (
        <main className="min-h-screen bg-[var(--background)] text-white selection:bg-[var(--wonder-green)] selection:text-black">
            <Navbar />

            <div className="pt-32 pb-20 px-6 max-w-lg mx-auto text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500"
                >
                    <XCircle size={50} strokeWidth={2.5} />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-bold mb-4"
                >
                    Payment Cancelled
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-400 mb-8"
                >
                    Your payment process was cancelled or failed. No charges were made.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Link href="/pricing">
                        <button className="bg-white text-black font-bold px-8 py-4 rounded-xl hover:bg-gray-200 transition-all">
                            Try Again
                        </button>
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
