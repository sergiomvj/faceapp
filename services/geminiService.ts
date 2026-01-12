
import { GoogleGenAI, Type } from "@google/genai";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async summarizeArticle(title: string, content: string) {
    if (!process.env.API_KEY) return "Serviço de IA indisponível no momento.";
    
    try {
      // Use gemini-3-flash-preview for basic text tasks
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Por favor, resuma este artigo para uma leitura rápida de 1 minuto: \n\n Título: ${title} \n\n Conteúdo: ${content}`,
        config: {
          systemInstruction: "Você é um editor assistente da revista Facebrasil. Sua tarefa é criar resumos elegantes e informativos em português brasileiro para leitores expatriados.",
          temperature: 0.7,
        },
      });
      // Directly return the text property
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Não foi possível gerar o resumo por IA.";
    }
  },

  async searchGrounding(query: string) {
    if (!process.env.API_KEY) return null;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Traga informações atualizadas sobre: ${query}. Foco na comunidade brasileira nos EUA.`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      
      const text = response.text;
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = chunks.map((chunk: any) => ({
        title: chunk.web?.title || 'Fonte externa',
        uri: chunk.web?.uri || '#'
      }));

      return { text, sources };
    } catch (error) {
      console.error("Gemini Search Error:", error);
      return null;
    }
  }
};
