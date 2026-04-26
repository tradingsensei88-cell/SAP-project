import { NextResponse } from "next/server";
import { auth } from "@/auth";
import path from "path";

// Dynamically require better-sqlite3 to avoid Next.js build issues
const getDb = () => {
    const Database = require("better-sqlite3");
    const dbPath = path.join(process.cwd(), "dev.db");
    return new Database(dbPath);
};

import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

// Custom fetcher that bridges to the reliable python package
async function fetchTranscriptViaPython(videoId: string) {
    const scriptPath = path.join(process.cwd(), "scripts", "fetch_transcript.py");
    // Ensure python is executed depending on environment. 'python' usually works for Windows.
    const { stdout, stderr } = await execAsync(`python "${scriptPath}" ${videoId}`);

    if (stderr && !stdout) {
        throw new Error(`Python execution error: ${stderr}`);
    }

    try {
        const result = JSON.parse(stdout);
        if (result.error) {
            throw new Error(result.error);
        }
        return result.data;
    } catch (e) {
        throw new Error("Failed to parse python output: " + String(e));
    }
}

export async function POST(req: Request) {
    let db: any;
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { url } = await req.json();
        if (!url) {
            return NextResponse.json({ error: "YouTube URL is required" }, { status: 400 });
        }

        db = getDb();
        const user = db.prepare("SELECT credits FROM User WHERE id = ?").get(session.user.id);

        if (!user || user.credits < 10) {
            db.close();
            return NextResponse.json({ error: "Insufficient credits. You need at least 10 credits." }, { status: 403 });
        }

        // Extract video ID safely
        const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;

        if (!videoId || videoId.length !== 11) {
            db.close();
            return NextResponse.json({ error: "Invalid YouTube URL or Video ID" }, { status: 400 });
        }

        // Fetch transcript with robust custom fetcher
        const transcript = await fetchTranscriptViaPython(videoId);

        // Generate ID for history
        const crypto = require("crypto");
        const historyId = crypto.randomUUID();

        // Run in transaction
        const runTx = db.transaction(() => {
            db.prepare("UPDATE User SET credits = credits - 10 WHERE id = ?").run(session.user!.id);
            db.prepare(`
                INSERT INTO TranscriptHistory (id, userId, videoId, videoUrl, language)
                VALUES (?, ?, ?, ?, ?)
            `).run(historyId, session.user!.id, videoId, url, "en");
        });

        runTx();

        const updatedUser = db.prepare("SELECT credits FROM User WHERE id = ?").get(session.user!.id);
        db.close();

        return NextResponse.json({
            videoId,
            transcript,
            creditsRemaining: updatedUser.credits
        });

    } catch (error: any) {
        if (db) db.close();
        console.error("Transcript Error:", error);
        const message = error.message || "Failed to fetch transcript. Ensure captions are enabled for this video.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

