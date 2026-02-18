"use client";

import Navbar from "@/components/Navbar";
import CourseGrid from "@/components/landing/CourseGrid";

export default function CoursesPage() {
    return (
        <main className="min-h-screen bg-[var(--background)] text-white">
            <Navbar />
            <div className="pt-20">
                <CourseGrid />
            </div>
        </main>
    );
}
