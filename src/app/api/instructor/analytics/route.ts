import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/instructor/analytics
export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "instructor") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courses = await prisma.course.findMany({
        where: { instructorId: session.user.id! },
        include: {
            analytics: true,
            enrollments: true,
            modules: {
                include: {
                    videos: {
                        include: {
                            videoProgress: true,
                        },
                    },
                },
            },
        },
    });

    const totalStudents = courses.reduce((sum, c) => sum + c.enrollments.length, 0);
    const totalRevenue = courses.reduce((sum, c) => sum + (c.analytics?.totalRevenue || 0), 0);
    const totalImpressions = courses.reduce((sum, c) => sum + (c.analytics?.impressions || 0), 0);

    const courseStats = courses.map((course) => {
        const allVideos = course.modules.flatMap((m) => m.videos);
        const totalWatchSeconds = allVideos.reduce((sum, v) => {
            return sum + v.videoProgress.reduce((s, p) => s + p.watchedSeconds, 0);
        }, 0);
        const completedStudents = course.enrollments.filter((e) => e.completedAt).length;
        const completionRate = course.enrollments.length > 0
            ? Math.round((completedStudents / course.enrollments.length) * 100)
            : 0;

        return {
            id: course.id,
            title: course.title,
            status: course.status,
            enrollments: course.enrollments.length,
            impressions: course.analytics?.impressions || 0,
            revenue: course.analytics?.totalRevenue || 0,
            totalWatchMinutes: Math.round(totalWatchSeconds / 60),
            completionRate,
            videoCount: allVideos.length,
        };
    });

    return NextResponse.json({
        totalStudents,
        totalRevenue,
        totalImpressions,
        totalCourses: courses.length,
        publishedCourses: courses.filter((c) => c.status === "published").length,
        courseStats,
    });
}
