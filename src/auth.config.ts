import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }: any) {
            const isLoggedIn = !!auth?.user;
            const role = (auth?.user as any)?.role;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
            const isOnInstructor = nextUrl.pathname.startsWith("/instructor");
            const isOnCourse = nextUrl.pathname.startsWith("/courses");
            const isOnAuthPage = nextUrl.pathname === "/login" || nextUrl.pathname === "/register";

            // Protect instructor routes - only instructors allowed
            if (isOnInstructor) {
                if (!isLoggedIn) return Response.redirect(new URL("/login", nextUrl));
                if (role !== "instructor") return Response.redirect(new URL("/dashboard", nextUrl));
                return true;
            }

            // Protect student dashboard - only students allowed
            if (isOnDashboard) {
                if (!isLoggedIn) return Response.redirect(new URL("/login", nextUrl));
                if (role === "instructor") return Response.redirect(new URL("/instructor", nextUrl));
                return true;
            }

            // Protect course routes
            if (isOnCourse && nextUrl.pathname.includes("/learn")) {
                if (isLoggedIn) return true;
                return Response.redirect(new URL("/login", nextUrl));
            }

            // Redirect authenticated users away from auth pages
            if (isLoggedIn && isOnAuthPage) {
                if (role === "instructor") {
                    return Response.redirect(new URL("/instructor", nextUrl));
                }
                return Response.redirect(new URL("/dashboard", nextUrl));
            }

            return true;
        },
        async jwt({ token, user, trigger, session }: any) {
            if (user) {
                token.role = (user as any).role;
                token.credits = (user as any).credits;
            }
            if (trigger === "update" && session) {
                if (session.name) token.name = session.name;
                if (session.image) token.picture = session.image;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (token.sub && session.user) {
                session.user.id = token.sub;

                // Update session from token to reflect any profile changes
                if (token.name) session.user.name = token.name;
                if (token.picture) session.user.image = token.picture;

                (session.user as any).role = token.role;
                (session.user as any).credits = token.credits;
            }
            return session;
        },
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
