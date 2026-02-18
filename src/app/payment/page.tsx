"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { CheckCircle, CreditCard, Lock } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PaymentPage() {
    const [success, setSuccess] = useState(false);

    const handlePay = () => {
        setTimeout(() => setSuccess(true), 1500);
    };

    return (
        <main className="min-h-screen bg-[var(--background)] text-white flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-lg bg-[var(--wonder-gray)] border border-white/10 rounded-3xl p-8 relative overflow-hidden"
                >
                    {!success ? (
                        <>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Lock size={20} className="text-[var(--wonder-green)]" /> Secure Checkout
                            </h2>

                            <div className="bg-black/30 p-4 rounded-xl mb-6">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-400">Selected Plan</span>
                                    <span className="font-bold">Learner Pack</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-white">
                                    <span>Total</span>
                                    <span>$0.22</span>
                                </div>
                            </div>

                            <form className="space-y-4">
                                <div>
                                    <label className="text-xs uppercase font-bold text-gray-500">Card Number</label>
                                    <div className="relative mt-1">
                                        <CreditCard className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-[var(--wonder-green)] outline-none font-mono" placeholder="0000 0000 0000 0000" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs uppercase font-bold text-gray-500">Expiry</label>
                                        <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[var(--wonder-green)] outline-none font-mono mt-1" placeholder="MM/YY" />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase font-bold text-gray-500">CVC</label>
                                        <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[var(--wonder-green)] outline-none font-mono mt-1" placeholder="123" />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="button"
                                        onClick={handlePay}
                                        className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-[var(--wonder-green)] hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all"
                                    >
                                        Pay $0.22
                                    </button>
                                    <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                                        <Lock size={12} /> Encrypted & Secure
                                    </p>
                                </div>
                            </form>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-10"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-20 h-20 bg-[var(--wonder-green)] rounded-full flex items-center justify-center mx-auto mb-6 text-black"
                            >
                                <CheckCircle size={40} />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                            <p className="text-gray-400 mb-8">Your account has been credited with 50 credits.</p>
                            <Link href="/courses">
                                <button className="bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-[var(--wonder-green)] transition-all">
                                    Start Learning
                                </button>
                            </Link>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </main>
    );
}
