"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const role = (formData.get("role") as string) || "student";

    console.log("[register] Attempting registration for:", email);

    if (!email || !password || !name) {
        return { error: "Missing required fields" };
    }

    if (!["student", "instructor"].includes(role)) {
        return { error: "Invalid role selected" };
    }

    try {
        // Check if user exists in Prisma DB
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return { error: "An account with this email already exists" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role,
                credits: role === "student" ? 30 : 0,
            },
        });
        console.log("[register] User created successfully:", email);
        return { success: true };
    } catch (error) {
        console.error("[register] Error creating user:", error);
        return { error: "Something went wrong during registration" };
    }
}
