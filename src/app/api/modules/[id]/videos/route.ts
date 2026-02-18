import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST /api/modules/[id]/videos - add a video to a module
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "instructor") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const module = await prisma.module.findUnique({
        where: { id },
        include: { course: true },
    });
    if (!module || module.course.instructorId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const count = await prisma.video.count({ where: { moduleId: id } });

    const video = await prisma.video.create({
        data: {
            title: body.title,
            description: body.description || "",
            order: count,
            moduleId: id,
            cloudinaryUrl: body.cloudinaryUrl || null,
            cloudinaryPublicId: body.cloudinaryPublicId || null,
            duration: body.duration || null,
            status: body.cloudinaryUrl ? "ready" : "waiting",
        },
    });

    return NextResponse.json(video, { status: 201 });
}
