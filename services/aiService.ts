const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export interface TopicSuggestion {
    topic: string;
    source: string;
    score: number;
    aiSuggestion: string;
}

/**
 * Fetches trending topics and generates content suggestions using OpenRouter
 */
export const fetchAITopicSuggestions = async (): Promise<TopicSuggestion[]> => {
    if (!OPENROUTER_API_KEY) {
        console.error('OpenRouter API Key not found');
        return [];
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://facebrasil.app", // Optional
                "X-Title": "Facebrasil App", // Optional
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-001",
                "messages": [
                    {
                        "role": "system",
                        "content": "Você é um editor sênior de um portal para brasileiros nos EUA. Gere 3 sugestões de pautas quentes (trending topics) reais ou altamente prováveis para a comunidade brasileira na Flórida, Massachusetts e New Jersey. Retorne APENAS um JSON no formato: [{\"topic\": \"...\", \"source\": \"...\", \"score\": 95, \"aiSuggestion\": \"...\"}]"
                    },
                    {
                        "role": "user",
                        "content": "Quais são as pautas mais quentes para hoje?"
                    }
                ]
            })
        });

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Clean potential markdown code blocks from the response
        const jsonString = content.replace(/```json|```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error fetching AI suggestions:", error);
        return [];
    }
};
