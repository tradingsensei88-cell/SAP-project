import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/videos/[id] - get video with signed URL (enrolled students only)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const video = await prisma.video.findUnique({
        where: { id },
        include: { module: { include: { course: true } } },
    });
    if (!video) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const course = video.module.course;
    const isInstructor = course.instructorId === session.user.id;

    if (!isInstructor) {
        // Check enrollment
        const enrollment = await prisma.enrollment.findUnique({
            where: { userId_courseId: { userId: session.user.id!, courseId: course.id } },
        });
        if (!enrollment) {
            return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
        }
    }

    // Get user's progress for this video
    const progress = await prisma.videoProgress.findUnique({
        where: { userId_videoId: { userId: session.user.id!, videoId: id } },
    });

    return NextResponse.json({
        ...video,
        lastPosition: progress?.lastPosition || 0,
        watchedSeconds: progress?.watchedSeconds || 0,
        completed: progress?.completed || false,
    });
}

// DELETE /api/videos/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "instructor") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const video = await prisma.video.findUnique({
        where: { id },
        include: { module: { include: { course: true } } },
    });
    if (!video || video.module.course.instructorId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.video.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
