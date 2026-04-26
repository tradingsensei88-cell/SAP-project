"use client";

import Navbar from "@/components/Navbar";
import { Check, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PLANS = [
    {
        name: "Starter",
        price: "Free",
        amount: 0,
        credits: "30 Credits",
        features: ["Access to free courses", "Basic AI answers", "Community support"],
        popular: false,
    },
    {
        name: "Learner",
        price: "₹19", // Approx $0.22
        amount: 19,
        credits: "50 Credits",
        features: ["All Free features", "Priority AI response", "HD Video downloads", "Certificate of completion"],
        popular: true,
        color: "var(--wonder-green)"
    },
    {
        name: "Pro",
        price: "₹46", // Approx $0.55
        amount: 46,
        credits: "Unlimited",
        features: ["All Learner features", "Unlimited AI credits", "1-on-1 Instructor chat", "Offline mode"],
        popular: false,
    }
];

export default function PricingPage() {
    const { Razorpay } = useRazorpay();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handlePayment = async (plan: typeof PLANS[0]) => {
        if (plan.amount === 0) {
            router.push('/dashboard');
            return;
        }

        setLoading(true);

        try {
            // 1. Create Order
            const response = await fetch('/api/razorpay/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: plan.amount, // Amount in INR
                    currency: "INR",
                    receipt: `receipt_${Date.now()}_${plan.name}`,
                }),
            });

            const order = await response.json();

            if (!response.ok) {
                alert("Error creating order: " + order.error);
                setLoading(false);
                return;
            }

            // 2. Open Razorpay Modal
            const options: RazorpayOrderOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
                amount: order.amount.toString(),
                currency: order.currency,
                name: "Antigravity SAP",
                description: `Subscribe to ${plan.name} Plan`,
                order_id: order.orderId,
                handler: async (response: any) => {
                    // 3. Verify Payment
                    const verifyResponse = await fetch('/api/razorpay/verify', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
                    });

                    const verifyData = await verifyResponse.json();

                    if (verifyResponse.ok && verifyData.message === "success") {
                        router.push('/checkout/success?payment_id=' + response.razorpay_payment_id);
                    } else {
                        alert("Payment verification failed!");
                    }
                },
                prefill: {
                    name: "User Name", // You can fetch this from auth
                    email: "user@example.com", // You can fetch this from auth
                    contact: "9999999999",
                },
                theme: {
                    color: "#CCFF00",
                },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                        console.log("Checkout cancelled");
                    }
                }
            };

            const rzp1 = new Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error("Payment failed", error);
            alert("Something went wrong!");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[var(--background)] text-white selection:bg-[var(--wonder-green)] selection:text-black">
            <Navbar />

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
                >
                    INVEST IN YOUR <span className="text-[var(--wonder-green)]">FUTURE</span>
                </motion.h1>
                <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-16">
                    Choose the plan that fits your learning journey. Upgrade anytime.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {PLANS.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className={`relative p-8 rounded-3xl border ${plan.popular ? 'border-[var(--wonder-green)] bg-[var(--wonder-green)]/5' : 'border-white/10 bg-white/5'} flex flex-col items-start text-left hover:border-[var(--wonder-green)]/50 transition-all duration-300`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--wonder-green)] text-black font-bold px-4 py-1 rounded-full text-sm flex items-center gap-1 shadow-[0_0_15px_rgba(204,255,0,0.5)]">
                                    <Sparkles size={14} /> MOST POPULAR
                                </div>
                            )}

                            <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-[var(--wonder-green)]' : 'text-white'}`}>{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-1">
                                <span className="text-4xl font-bold text-white">{plan.price}</span>
                                <span className="text-gray-500 text-sm">/pack</span>
                            </div>
                            <p className="text-sm text-gray-400 mb-8 font-mono">{plan.credits}</p>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? 'bg-[var(--wonder-green)] text-black' : 'bg-white/10 text-white'}`}>
                                            <Check size={12} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handlePayment(plan)}
                                disabled={loading}
                                className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular
                                    ? 'bg-[var(--wonder-green)] text-black hover:shadow-[0_0_20px_rgba(204,255,0,0.4)]'
                                    : 'bg-white text-black hover:bg-gray-200'
                                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                {loading ? 'Processing...' : `Choose ${plan.name}`}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Payment Methods */}
                <div className="mt-20 pt-10 border-t border-white/5 flex flex-col items-center">
                    <p className="text-gray-500 text-sm mb-4">SECURE PAYMENT VIA RAZORPAY</p>
                    <div className="flex items-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Improved placeholders or icons could go here */}
                        <span className="text-xl font-bold">UPI</span>
                        <span className="text-xl font-bold">VISA</span>
                        <span className="text-xl font-bold">Mastercard</span>
                        <span className="text-xl font-bold">RuPay</span>
                    </div>
                </div>
            </div>
        </main>
    );
}
