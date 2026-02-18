import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/courses/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();

    const course = await prisma.course.findUnique({
        where: { id },
        include: {
            instructor: { select: { name: true, image: true, id: true } },
            modules: {
                orderBy: { order: "asc" },
                include: {
                    videos: { orderBy: { order: "asc" } },
                },
            },
            _count: { select: { enrollments: true } },
            analytics: true,
        },
    });

    if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Only show draft courses to the instructor who owns them
    if (course.status === "draft") {
        if (!session?.user || session.user.id !== course.instructor.id) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
    }

    return NextResponse.json(course);
}

// PUT /api/courses/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const updated = await prisma.course.update({
        where: { id },
        data: {
            title: body.title ?? course.title,
            description: body.description ?? course.description,
            category: body.category ?? course.category,
            level: body.level ?? course.level,
            price: body.price !== undefined ? parseFloat(body.price) : course.price,
            thumbnail: body.thumbnail ?? course.thumbnail,
            status: body.status ?? course.status,
        },
    });

    return NextResponse.json(updated);
}

// DELETE /api/courses/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "instructor") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const course = await prisma.course.findUnique({ where: { id } });
    if (!course || course.instructorId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
