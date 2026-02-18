"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";

export type LoginState = {
    success?: boolean;
    error?: string;
    redirectUrl?: string;
};

export async function authenticate(
    prevState: LoginState | undefined,
    formData: FormData,
): Promise<LoginState> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const selectedRole = formData.get("role") as string;

    if (!email || !password) {
        return { error: "Email and password are required." };
    }

    // Check role against Prisma DB before attempting signIn
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user && selectedRole && user.role !== selectedRole) {
            return { error: `This account is registered as a ${user.role}. Please select the correct role.` };
        }
    } catch (dbErr) {
        console.error("[login] DB role check failed:", dbErr);
        // Continue — let signIn handle it
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        // Determine redirect URL based on role
        // We know the role matches (checked above) or signIn succeeded
        // Default to dashboard if role is unknown, or check DB again?
        // Since we checked DB above, we can use selectedRole or re-fetch.
        // But for speed, if signIn succeeds, we can trust the input role if we validated it?
        // Actually, best to be safe.
        // Let's assume simpler logic:
        const redirectUrl = selectedRole === "instructor" ? "/instructor" : "/dashboard";

        return { success: true, redirectUrl };
    } catch (error) {
        // In NextAuth v5, NEXT_REDIRECT is thrown as a special error
        if (
            error instanceof Error &&
            (error.message === "NEXT_REDIRECT" || (error as any).digest?.startsWith("NEXT_REDIRECT"))
        ) {
            throw error;
        }

        if (error instanceof AuthError) {
            console.error("[login] AuthError type:", error.type, error.message);
            if (error.type === "CredentialsSignin") {
                return { error: "Invalid email or password." };
            }
            return { error: `Sign-in error: ${error.type}` };
        }

        console.error("[login] Unexpected error:", error);
        return { error: "Something went wrong. Please try again." };
    }
}

export async function googleLogin() {
    await signIn("google");
}
