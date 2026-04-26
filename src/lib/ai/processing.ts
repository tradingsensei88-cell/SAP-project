import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { deepgram, embeddingModel, pinecone, indexName } from "./clients";
import { prisma } from "../prisma";

export interface TranscribedWord {
    word: string;
    start: number;
    end: number;
    confidence: number;
}

export interface ChunkMetadata {
    text: string;
    startTime: number;
    endTime: number;
    courseId: string;
    moduleId: string;
    videoId: string;
    chunkIndex: number;
}

/**
 * Split transcript into meaningful semantic chunks
 */
export async function chunkTranscript(
    words: TranscribedWord[],
    metadataTemplate: { courseId: string; moduleId: string; videoId: string }
): Promise<ChunkMetadata[]> {
    // Combine words into a single string for Langchain splitter
    const fullText = words.map((w) => w.word).join(" ");

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
    });

    const chunks = await splitter.createDocuments([fullText]);
    const processedChunks: ChunkMetadata[] = [];

    let currentWordIndex = 0;

    for (let i = 0; i < chunks.length; i++) {
        const chunkText = chunks[i].pageContent;
        const chunkWords = chunkText.split(" ");

        // Find approximate start and end times for this chunk
        let startTime = words[currentWordIndex]?.start || 0;

        // Advance word index by approximately the number of words in this chunk
        currentWordIndex = Math.min(currentWordIndex + chunkWords.length, words.length - 1);
        let endTime = words[currentWordIndex]?.end || startTime + 5;

        processedChunks.push({
            text: chunkText,
            startTime,
            endTime,
            chunkIndex: i,
            ...metadataTemplate
        });
    }

    return processedChunks;
}

/**
 * Generate embeddings for chunks using Gemini
 */
export async function embedChunks(chunks: ChunkMetadata[]) {
    const embeddedChunks = await Promise.all(
        chunks.map(async (chunk) => {
            const result = await embeddingModel.embedContent(chunk.text);
            const embedding = result.embedding.values;
            return {
                ...chunk,
                embedding
            };
        })
    );
    return embeddedChunks;
}

/**
 * Store chunks in SQLite and Vectors in Pinecone
 */
export async function storeChunks(transcriptId: string, embeddedChunks: any[]) {
    const index = pinecone.index(indexName);

    // Prepare Pinecone vectors
    const vectors = embeddedChunks.map((chunk) => {
        // ID needs to be unique. Hash or composite
        const vectorId = `${chunk.videoId}-chunk-${chunk.chunkIndex}`;

        return {
            id: vectorId,
            values: chunk.embedding,
            metadata: {
                text: chunk.text,
                courseId: chunk.courseId,
                moduleId: chunk.moduleId,
                videoId: chunk.videoId,
                startTime: chunk.startTime,
                endTime: chunk.endTime,
            }
        };
    });

    // Batch Upsert to Pinecone
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
        const batch = vectors.slice(i, i + batchSize);
        // @ts-ignore
        await index.upsert(batch);
    }

    // Store metadata to SQLite using Prisma
    for (const chunk of embeddedChunks) {
        const vectorId = `${chunk.videoId}-chunk-${chunk.chunkIndex}`;
        await (prisma as any).transcriptChunk.create({
            data: {
                transcriptId,
                courseId: chunk.courseId,
                moduleId: chunk.moduleId,
                videoId: chunk.videoId,
                text: chunk.text,
                startTime: chunk.startTime,
                endTime: chunk.endTime,
                chunkIndex: chunk.chunkIndex,
                vectorId: vectorId
            }
        });
    }
}
