import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        const enrollments = await prisma.enrollment.findMany({
            where: { userId },
            include: {
                course: {
                    include: {
                        modules: {
                            include: {
                                videos: {
                                    include: {
                                        videoProgress: {
                                            where: { userId }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        // Compute total hours roughly (if duration is available in videos)
        // Note: keeping it simple based on completed lessons for progress
        let totalWatchedSeconds = 0;

        const formatted = enrollments.map(enrollment => {
            const course = enrollment.course;
            let totalLessons = 0;
            let completedLessons = 0;

            course.modules.forEach(module => {
                module.videos.forEach(video => {
                    totalLessons++;
                    if (video.videoProgress.length > 0) {
                        const prog = video.videoProgress[0];
                        if (prog.completed) {
                            completedLessons++;
                        }
                        totalWatchedSeconds += (prog.watchedSeconds || 0);
                    }
                });
            });

            const progress = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

            return {
                id: course.id,
                title: course.title,
                thumbnail: course.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
                progress,
                totalLessons,
                completedLessons,
            };
        });

        const hoursLearned = Math.round(totalWatchedSeconds / 3600);

        return NextResponse.json({
            enrollments: formatted,
            stats: {
                hoursLearned
            }
        });

    } catch (error) {
        console.error("Fetch Enrollments Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
