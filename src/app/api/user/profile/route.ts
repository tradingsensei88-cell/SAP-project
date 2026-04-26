import { NextResponse } from "next/server";
import { auth } from "@/auth";
import path from "path";
import Database from "better-sqlite3";

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const dbPath = path.join(process.cwd(), "dev.db");
        const db = new Database(dbPath, { readonly: true });

        const user = db.prepare(
            "SELECT id, name, email, image, bio, credits, maxCredits, role FROM User WHERE id = ?"
        ).get(session.user.id) as any;

        db.close();

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Profile GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, bio, image } = body;

        const dbPath = path.join(process.cwd(), "dev.db");
        const db = new Database(dbPath);

        const updates: string[] = [];
        const params: any[] = [];

        if (name !== undefined) { updates.push("name = ?"); params.push(name); }
        if (bio !== undefined) { updates.push("bio = ?"); params.push(bio); }
        if (image !== undefined) { updates.push("image = ?"); params.push(image); }

        if (updates.length > 0) {
            params.push(session.user.id);
            db.prepare(`UPDATE User SET ${updates.join(", ")} WHERE id = ?`).run(...params);
        }

        // Fetch updated user to return
        const updatedUser = db.prepare("SELECT name, bio, image FROM User WHERE id = ?").get(session.user.id) as any;
        db.close();

        return NextResponse.json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Profile PATCH Error:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}

