require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("No GEMINI_API_KEY found in .env or .env.local");
    process.exit(1);
}

async function run() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.error.message);
            return;
        }

        if (data.models) {
            console.log("--- AVAILABLE GEMINI MODELS ---");
            const geminiModels = data.models.filter(m => m.name.includes("gemini"));
            geminiModels.forEach(m => {
                console.log(`- ${m.name.replace('models/', '')}`);
            });
        } else {
            console.log("No models returned:", data);
        }
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

run();
