"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Suspense } from "react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get('payment_id');

    return (
        <div className="pt-32 pb-20 px-6 max-w-lg mx-auto text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 bg-[var(--wonder-green)] rounded-full flex items-center justify-center mx-auto mb-8 text-black shadow-[0_0_30px_rgba(204,255,0,0.6)]"
            >
                <CheckCircle size={50} strokeWidth={2.5} />
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold mb-4"
            >
                Payment Successful!
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 mb-8"
            >
                Thank you for your purchase. Your account has been upgraded.
                {paymentId && <><br /><span className="text-sm text-gray-600 font-mono mt-2 block">Ref: {paymentId}</span></>}
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Link href="/courses">
                    <button className="bg-white text-black font-bold px-8 py-4 rounded-xl hover:bg-[var(--wonder-green)] hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all transform hover:-translate-y-1">
                        Start Learning Now
                    </button>
                </Link>
            </motion.div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <main className="min-h-screen bg-[var(--background)] text-white selection:bg-[var(--wonder-green)] selection:text-black">
            <Navbar />
            <Suspense fallback={<div className="pt-32 text-center">Loading...</div>}>
                <SuccessContent />
            </Suspense>
        </main>
    );
}
