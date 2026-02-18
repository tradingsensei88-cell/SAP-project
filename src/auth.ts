import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import path from "path";

export const { auth, handlers, signIn, signOut } = NextAuth({
    ...authConfig,
    session: { strategy: "jwt" },
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    // Use better-sqlite3 directly — avoids Prisma singleton issues in auth context
                    // eslint-disable-next-line @typescript-eslint/no-require-imports
                    const Database = require("better-sqlite3");
                    const dbPath = path.join(process.cwd(), "dev.db");
                    const db = new Database(dbPath, { readonly: true });

                    const user = db.prepare(
                        "SELECT id, name, email, image, password, role, credits FROM User WHERE email = ?"
                    ).get(credentials.email as string) as {
                        id: string; name: string | null; email: string;
                        image: string | null; password: string | null;
                        role: string; credits: number;
                    } | undefined;

                    db.close();

                    if (!user || !user.password) return null;

                    const passwordsMatch = await bcrypt.compare(
                        credentials.password as string,
                        user.password
                    );

                    if (!passwordsMatch) return null;

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: user.role,
                        credits: user.credits,
                    };
                } catch (err) {
                    console.error("[authorize] error:", err);
                    return null;
                }
            },
        }),
    ],
});
