import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CivicReport, Urgency, AnalysisInput, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const REPORT_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    issue_type: { type: Type.STRING, description: "The category of the issue (e.g., Roads, Water, Safety)." },
    description: { type: Type.STRING, description: "A concise summary of the issue in English." },
    original_text: { type: Type.STRING, description: "The original text or transcription of the input." },
    original_language: { type: Type.STRING, description: "The detected language of the original input." },
    location: { type: Type.STRING, description: "The specific street, landmark, or address." },
    lga: { type: Type.STRING, description: "The 2nd Administrative Level (Town, District, LGA, County, or Municipality)." },
    state: { type: Type.STRING, description: "The 1st Administrative Level (State, Province, Region, or Major City)." },
    country: { type: Type.STRING, description: "The Country." },
    region: { type: Type.STRING, description: "A formatted string: 'Town, City, Country' (e.g., 'Jega, Kebbi, Nigeria')." },
    urgency: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
    predicted_escalation: { type: Type.STRING, enum: ["Low", "Medium", "High"], description: "Risk of escalation if not addressed." },
    
    // Updated Fields for Dual Recommendations
    gov_action: { type: Type.STRING, description: "A specific, authoritative operational plan for the government/organization to solve the issue (e.g., 'Dispatch maintenance crew to...')." },
    citizen_action: { type: Type.STRING, description: "Personal safety advice for the citizen reporting the issue (e.g., 'Avoid the lane', 'Boil water before drinking', 'Stay clear of the area')." },
    
    needs_clarification: { type: Type.BOOLEAN, description: "Set to true if CRITICAL information (especially specific location) is missing." },
    missing_info_question: { type: Type.STRING, description: "The question to ask the user to obtain the missing information (e.g., 'Please provide the location')." }
  },
  required: ["issue_type", "description", "original_text", "original_language", "urgency", "needs_clarification", "gov_action", "citizen_action"]
};

export const analyzeReport = async (inputs: AnalysisInput[]): Promise<AnalysisResult> => {
  try {
    const parts: any[] = [];

    let promptText = `
      You are CivifyAI, an intelligent government aide.
      Analyze the citizen report.
      
      CRITICAL TASK: GLOBAL LOCATION MAPPING
      You must identify the hierarchy of the location using standard administrative divisions:
      
      1. **Country**: The nation.
      2. **State/Province (Level 1)**: The primary subdivision (e.g., State in Nigeria/USA, Region in Morocco/France).
      3. **Town/District (Level 2)**: The secondary subdivision (e.g., LGA in Nigeria, City/Town in others).
      4. **Specific Location**: The street or landmark.

      Examples:
      - Input: "No light in Jega, Kebbi" -> Country: Nigeria, State: Kebbi, LGA: Jega.
      - Input: "Pothole in Rabat Agdal" -> Country: Morocco, State: Rabat-Salé-Kénitra, LGA: Rabat.
      - Input: "Trash in Manhattan, NY" -> Country: USA, State: New York, LGA: Manhattan.
      
      General Tasks:
      1. Transcribe audio if present.
      2. Detect language and translate description to English.
      3. Classify issue.
      4. Assess urgency.
      5. **Generate Two Actions:**
         - **Government Action:** What should the authorities DO? (e.g., Fix it, Dispatch Police).
         - **Citizen Action:** What should the user do to stay safe? (e.g., Drive carefully, Boil water).
      
      If location is missing, set 'needs_clarification' to true.
    `;

    // Process all inputs in order to build context
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const role = i === 0 ? "Initial Report" : "User Follow-up";
      
      promptText += `\n\n--- ${role} ---`;
      
      if (input.userLocation) {
        promptText += `\nSystem Detected Location Context: "${input.userLocation}"`;
      }
      
      if (input.text) {
        promptText += `\nUser Text: "${input.text}"`;
      }
      
      parts.push({ text: promptText });
      promptText = ""; 

      // Add Image
      if (input.image) {
        const base64Image = await fileToBase64(input.image);
        parts.push({
          inlineData: {
            mimeType: input.image.type,
            data: base64Image
          }
        });
      }

      // Add Audio
      if (input.audio) {
        const base64Audio = await blobToBase64(input.audio);
        parts.push({
          inlineData: {
            mimeType: "audio/mp3",
            data: base64Audio
          }
        });
      }
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: REPORT_SCHEMA,
        systemInstruction: "You are CivifyAI. Precise mapping of global administrative hierarchies is your highest priority. Provide distinct safety advice for citizens and operational plans for governments."
      }
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    const json = JSON.parse(response.text);
    return json as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing report:", error);
    throw error;
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};