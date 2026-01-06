
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResponse, Urgency, AnalysisInput } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Fix: Removed 'Schema' from imports and relying on Type from @google/genai as per guidelines.
const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    suggested_description: { type: Type.STRING, description: "A clean, concise English description of the reported issue." },
    suggested_category: { type: Type.STRING, description: "Category: Roads, Power, Water, Waste, Security, Health." },
    suggested_urgency: { type: Type.STRING, description: "Low, Medium, or High." },
    is_high_risk: { type: Type.BOOLEAN, description: "True if there is immediate physical danger (fire, flood, live wires)." },
    safety_advice: { type: Type.STRING, description: "Crucial safety steps for the citizen. Leave empty if is_high_risk is false." },
    detected_language: { type: Type.STRING, description: "The language used in the voice or text input." },
    transcription: { type: Type.STRING, description: "The literal transcription of any audio input." },
    detected_location: {
      type: Type.OBJECT,
      properties: {
        address: { type: Type.STRING },
        lga: { type: Type.STRING, description: "Nigerian Local Government Area" },
        state: { type: Type.STRING, description: "Nigerian State" }
      }
    }
  },
  required: ["suggested_description", "suggested_category", "suggested_urgency", "is_high_risk", "detected_language"]
};

export const analyzeCivicInput = async (input: AnalysisInput): Promise<AIAnalysisResponse> => {
  const parts: any[] = [];
  
  let promptText = `
    You are the CivicLink AI assistant for Nigeria. 
    Analyze the citizen's report (text, image, or voice).
    
    GOAL: Assist the user in filling their report accurately.
    
    LOCALE: NIGERIA
    Ensure all location mapping is within the 36 Nigerian States and their respective LGAs.
    
    SAFETY LOGIC:
    Only provide 'safety_advice' if 'is_high_risk' is true. 
    High risk = Active fire, major flooding, collapsed building, live electricity wires, or violent crime.
    If it is a pothole, dirty street, or broken pipe, set is_high_risk to false and safety_advice to empty.
    
    TRANSLATION:
    If input is in Pidgin, Hausa, Igbo, or Yoruba, translate the 'suggested_description' to professional English.
  `;

  if (input.text) promptText += `\nUser Text: "${input.text}"`;
  if (input.userLocation) promptText += `\nDetected Context: "${input.userLocation}"`;
  
  parts.push({ text: promptText });

  if (input.image) {
    const data = await fileToBase64(input.image);
    parts.push({ inlineData: { mimeType: input.image.type, data } });
  }

  if (input.audio) {
    const data = await blobToBase64(input.audio);
    parts.push({ inlineData: { mimeType: "audio/mp3", data } });
  }

  // Fix: Use gemini-3-flash-preview as recommended for basic tasks and better capabilities
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA,
    }
  });

  // Fix: Directly accessing .text property as it is a property, not a method.
  return JSON.parse(response.text || '{}') as AIAnalysisResponse;
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
