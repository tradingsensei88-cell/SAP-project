import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/courses - list published courses (or instructor's own courses)
export async function GET(req: NextRequest) {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const published = searchParams.get("published");
    const instructorOnly = searchParams.get("instructor");

    if (instructorOnly === "true") {
        if (!session?.user || (session.user as any).role !== "instructor") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const courses = await prisma.course.findMany({
            where: { instructorId: session.user.id! },
            include: {
                _count: { select: { enrollments: true } },
                analytics: true,
                modules: { include: { _count: { select: { videos: true } } } },
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(courses);
    }

    // Public: only published courses
    const courses = await prisma.course.findMany({
        where: { status: "published" },
        include: {
            instructor: { select: { name: true, image: true } },
            _count: { select: { enrollments: true } },
        },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(courses);
}

// POST /api/courses - create a new course
export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "instructor") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, category, level, price, thumbnail } = body;

    if (!title) {
        return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const course = await prisma.course.create({
        data: {
            title,
            description: description || "",
            category: category || "General",
            level: level || "beginner",
            price: parseFloat(price) || 0,
            thumbnail: thumbnail || null,
            instructorId: session.user.id!,
            status: "draft",
        },
    });

    // Create analytics record
    await prisma.courseAnalytics.create({
        data: { courseId: course.id },
    });

    return NextResponse.json(course, { status: 201 });
}
