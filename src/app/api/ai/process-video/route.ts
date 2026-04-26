import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { deepgram } from "../../../../lib/ai/clients";
import { chunkTranscript, embedChunks, storeChunks, TranscribedWord } from "../../../../lib/ai/processing";

// Note: In a production app, this endpoint should be secured with a secret key
// or triggered via a secure Background Job queue (like Inngest/QStash)
// to prevent timeout on serverless if the video is very long.

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { videoId, fetchAudioUrl } = body;

        if (!videoId || !fetchAudioUrl) {
            return NextResponse.json({ error: "Missing videoId or fetchAudioUrl" }, { status: 400 });
        }

        // 1. Get Video and Course Data
        const video = await prisma.video.findUnique({
            where: { id: videoId },
            include: { module: { include: { course: true } } },
        });

        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        // 2. Create Transcript record
        const transcript = await prisma.transcript.upsert({
            where: { videoId },
            update: { status: "processing" },
            create: {
                videoId,
                status: "processing",
                language: "en",
            }
        });

        // 3. Fetch audio and send to Deepgram
        // We use the url pointing directly to Cloudinary's audio version of the video
        // e.g. cloudinaryUrl.replace('/upload/', '/upload/f_m4a/')
        const response = await fetch(fetchAudioUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch audio from ${fetchAudioUrl}`);
        }

        const audioBuffer = await response.arrayBuffer();

        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
            Buffer.from(audioBuffer),
            {
                model: "nova-2",
                smart_format: true,
                punctuate: true,
                utterances: true,
            }
        );

        if (error || !result) {
            throw new Error(error?.message || "Deepgram transcription failed");
        }

        // Extract words with timestamps
        const words: TranscribedWord[] = result.results.channels[0].alternatives[0].words.map((w: any) => ({
            word: w.punctuated_word || w.word,
            start: w.start,
            end: w.end,
            confidence: w.confidence
        }));

        // 4. Chunk Transcript
        const metadataTemplate = {
            courseId: video.module?.course?.id || "unknown",
            moduleId: video.moduleId,
            videoId: video.id,
        };

        const chunks = await chunkTranscript(words, metadataTemplate);

        // 5. Embed Chunks using Gemini
        const embeddedChunks = await embedChunks(chunks);

        // 6. Store in Pinecone and SQLite
        await storeChunks(transcript.id, embeddedChunks);

        // 7. Mark transcript as Ready
        await prisma.transcript.update({
            where: { id: transcript.id },
            data: { status: "ready" }
        });

        return NextResponse.json({
            success: true,
            message: "Video processed successfully",
            chunksCreated: embeddedChunks.length
        });

    } catch (error: any) {
        console.error("Error processing video:", error);
        return NextResponse.json({
            error: "Internal server error",
            details: error.message
        }, { status: 500 });
    }
}
