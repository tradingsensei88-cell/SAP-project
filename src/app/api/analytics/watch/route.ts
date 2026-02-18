import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST /api/analytics/watch - track video watch time
export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { videoId, watchedSeconds, lastPosition, completed } = body;

    const progress = await prisma.videoProgress.upsert({
        where: { userId_videoId: { userId: session.user.id!, videoId } },
        create: {
            userId: session.user.id!,
            videoId,
            watchedSeconds: watchedSeconds || 0,
            lastPosition: lastPosition || 0,
            completed: completed || false,
        },
        update: {
            watchedSeconds: { increment: watchedSeconds || 0 },
            lastPosition: lastPosition || 0,
            completed: completed || false,
        },
    });

    return NextResponse.json(progress);
}
