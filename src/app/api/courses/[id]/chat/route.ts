import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pinecone, indexName, embeddingModel } from "@/lib/ai/clients";

// Helper function to extract user ID from the request
import { auth } from "@/auth";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userId = session.user.id;
        const courseId = (await params).id;

        // 1. Verify Enrollment or Instructor Status
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        const isInstructor = await prisma.course.findFirst({
            where: { id: courseId, instructorId: userId }
        });

        if (!enrollment && !isInstructor) {
            return new NextResponse("Not enrolled in this course", { status: 403 });
        }

        const { query } = await req.json();

        if (!query) {
            return new NextResponse("Missing query", { status: 400 });
        }

        // 2. Log Query for Analytics (non-blocking)
        (prisma as any).aiQueryLog.create({
            data: {
                userId,
                courseId,
                query,
                response: "Processing...",
                foundAnswer: true
            }
        }).catch(console.error);

        // 3. Generate Embedding for User Query
        const result = await embeddingModel.embedContent(query);
        const queryEmbedding = result.embedding.values;

        // 4. Query Pinecone with Course ID Filter
        const index = pinecone.index(indexName);
        const queryResponse = await index.query({
            vector: queryEmbedding,
            topK: 5,
            includeMetadata: true,
            filter: {
                courseId: courseId,
            },
        });

        // 5. Construct Context from Retrieved Chunks
        let context = "";
        if (queryResponse.matches && queryResponse.matches.length > 0) {
            const contextStrings = queryResponse.matches.map((match: any) => {
                const metadata = match.metadata as any;
                return `Transcript: "${metadata.text}"`;
            });
            context = contextStrings.join("\n---\n");
        }

        // 6. Construct System Prompt
        const systemPrompt = `You are an expert, helpful AI Teaching Assistant for this specific course. 
Your purpose is to answer student questions, clarify doubts, and summarize the provided transcript text.

RULES:
1. If "CONTEXT PROVIDED" contains transcripts, use it as your primary source of truth.
2. If the context is empty or doesn't contain the answer, act as a normal helpful AI chatbot and answer from your general knowledge, but keep responses relevant to educational concepts.
3. Answer the question clearly and provide helpful summaries if asked. Do NOT provide any timestamps.
4. Your focus is solely on helping the student understand the educational material and course concepts.
5. LANGUAGE: Automatically detect the language of the user's query and reply in that same language.

CONTEXT PROVIDED:
${context || "No course transcript context is available. Please answer from your general knowledge."}`;

        // 7. Request Answer from Groq (Free & Fast)
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: query }
                ],
                temperature: 0.7,
                max_tokens: 1024,
            }),
        });

        if (!groqResponse.ok) {
            const errorData = await groqResponse.text();
            console.error("Groq API Error:", groqResponse.status, errorData);
            throw new Error(`Groq API error: ${groqResponse.status}`);
        }

        const groqData = await groqResponse.json();
        const responseText = groqData.choices[0]?.message?.content || "Sorry, I could not generate a response.";

        return NextResponse.json({ text: responseText });

    } catch (error: any) {
        console.error("============== AI Chat Error ==============");
        console.error("Message:", error.message);
        console.error("Object:", error);
        console.error("===========================================");
        return new NextResponse("Internal Error", { status: 500 });
    }
}
