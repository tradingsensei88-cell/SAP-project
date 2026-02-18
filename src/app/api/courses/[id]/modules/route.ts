import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/courses/[id]/modules
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const modules = await prisma.module.findMany({
        where: { courseId: id },
        orderBy: { order: "asc" },
        include: { videos: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json(modules);
}

// POST /api/courses/[id]/modules
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "instructor") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const course = await prisma.course.findUnique({ where: { id } });
    if (!course || course.instructorId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const count = await prisma.module.count({ where: { courseId: id } });

    const module = await prisma.module.create({
        data: {
            title: body.title,
            description: body.description || "",
            order: count,
            courseId: id,
        },
    });

    return NextResponse.json(module, { status: 201 });
}
