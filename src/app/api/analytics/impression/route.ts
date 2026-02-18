import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST /api/analytics/impression - track course page view
export async function POST(req: NextRequest) {
    const body = await req.json();
    const { courseId } = body;

    await prisma.courseAnalytics.upsert({
        where: { courseId },
        create: { courseId, impressions: 1 },
        update: { impressions: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
}
