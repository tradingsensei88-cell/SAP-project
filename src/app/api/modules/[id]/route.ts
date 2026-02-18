import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// PUT /api/modules/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const updated = await prisma.module.update({
        where: { id },
        data: {
            title: body.title ?? module.title,
            description: body.description ?? module.description,
            order: body.order ?? module.order,
        },
        include: { videos: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json(updated);
}

// DELETE /api/modules/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    await prisma.module.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
