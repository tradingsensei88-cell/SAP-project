import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST /api/enroll - enroll a student in a course
export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { courseId } = body;

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course || course.status !== "published") {
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: session.user.id!, courseId } },
    });
    if (existing) {
        return NextResponse.json({ error: "Already enrolled" }, { status: 409 });
    }

    const enrollment = await prisma.enrollment.create({
        data: { userId: session.user.id!, courseId },
    });

    // Update analytics
    await prisma.courseAnalytics.upsert({
        where: { courseId },
        create: { courseId, totalRevenue: course.price },
        update: { totalRevenue: { increment: course.price } },
    });

    return NextResponse.json(enrollment, { status: 201 });
}

// GET /api/enroll - check enrollment status
export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ enrolled: false });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    if (!courseId) return NextResponse.json({ enrolled: false });

    const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: session.user.id!, courseId } },
    });

    return NextResponse.json({ enrolled: !!enrollment });
}
