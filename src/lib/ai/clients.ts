import { createClient } from "@deepgram/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Pinecone } from "@pinecone-database/pinecone";

// Initialize Deepgram
const deepgram = createClient(process.env.DEEPGRAM_API_KEY as string);

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
const chatModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Initialize Pinecone
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string,
});
const indexName = process.env.NEXT_PUBLIC_PINECONE_INDEX_NAME as string;

export { deepgram, embeddingModel, chatModel, pinecone, indexName };
