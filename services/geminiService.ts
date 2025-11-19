import { GoogleGenAI } from "@google/genai";
import { Booking, Task } from "../types";

// Initialize the Gemini API client
// Note: process.env.API_KEY is assumed to be injected at build time.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateInsight = async (
  context: string, 
  data: Booking[] | Task[]
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Simulation Mode: Gemini API Key not configured. Please add your API key to the environment variables to enable AI features. (Simulated response: Data looks healthy, occupancy is stable.)";
  }

  try {
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
      contents: prompt,
    });

    return response.text || "No insight generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate AI insights at this time. Please try again later.";
  }
};

export const draftGuestEmail = async (
  guestName: string, 
  type: 'check-in' | 'review-request'
): Promise<string> => {
  if (!process.env.API_KEY) {
    return `Simulation Mode: Dear ${guestName}, this is a simulated ${type} email because the API Key is missing.`;
  }

  try {
    const prompt = `
      Draft a polite, professional, and warm ${type} email for a guest named ${guestName}.
      Keep it under 100 words. Do not include subject line.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not draft email.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating draft.";
  }
};