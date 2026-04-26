import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Updated: Award credits based on plan
            const { userId, planType } = await request.clone().json();

            if (userId && planType) {
                let creditsToAward = 0;
                let newMaxCredits = 30;

                if (planType === "LEARNER") {
                    creditsToAward = 100;
                    newMaxCredits = 130;
                } else if (planType === "PRO") {
                    creditsToAward = 500;
                    newMaxCredits = 530;
                }

                if (creditsToAward > 0) {
                    // Import prisma inside if needed or use global
                    const { prisma } = require("@/lib/prisma");
                    await prisma.user.update({
                        where: { id: userId },
                        data: {
                            credits: { increment: creditsToAward },
                            maxCredits: newMaxCredits
                        }
                    });
                }
            }

            return NextResponse.json({
                message: "success",
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
            });
        } else {
            return NextResponse.json({
                message: "fail",
            }, { status: 400 });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json({ error: "Error verifying payment" }, { status: 500 });
    }
}
