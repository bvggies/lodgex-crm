import { GoogleGenAI } from "@google/genai";
import { Booking, Task } from "../types";

export const generateInsight = async (
  context: string, 
  data: Booking[] | Task[]
): Promise<string> => {
  // Access the key at runtime to ensure it's available
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return "Simulation Mode: Gemini API Key not configured. (Simulated response: Data looks healthy, occupancy is stable.)";
  }

  try {
    // Initialize client inside the function scope for safety
    const ai = new GoogleGenAI({ apiKey });
    const modelId = 'gemini-2.5-flash';
    const prompt = `
      You are an AI assistant for a Property Management CRM called Lodgex.
      Analyze the following JSON data regarding ${context}.
      Provide a concise, professional summary (max 2 sentences) and one actionable recommendation.
      
      Data:
      ${JSON.stringify(data.slice(0, 5))}
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [{ text: prompt }]
      }
    });

    return response.text || "No insight generated.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Return the specific error message to the UI to aid debugging
    return `AI Service Error: ${error.message || error.toString() || "Unknown error"}. Please verify your API key and permissions.`;
  }
};

export const draftGuestEmail = async (
  guestName: string, 
  type: 'check-in' | 'review-request'
): Promise<string> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return `Simulation Mode: Dear ${guestName}, this is a simulated ${type} email because the API Key is missing.`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      Draft a polite, professional, and warm ${type} email for a guest named ${guestName}.
      Keep it under 100 words. Do not include subject line.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [{ text: prompt }]
      },
    });

    return response.text || "Could not draft email.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return `Error generating draft: ${error.message || "Service unavailable"}`;
  }
};