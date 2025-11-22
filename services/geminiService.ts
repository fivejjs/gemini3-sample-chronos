import { GoogleGenAI } from "@google/genai";
import { MODEL_IDS } from '../constants';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment");
  }
  return new GoogleGenAI({ apiKey });
};

// Helper to clean base64 string
const cleanBase64 = (base64: string) => {
  return base64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
};

/**
 * Transforms an image based on a prompt (Time Travel or Edit)
 * Uses gemini-2.5-flash-image (Nano Banana)
 */
export const transformImage = async (base64Image: string, prompt: string): Promise<string> => {
  const ai = getAiClient();
  const cleanData = cleanBase64(base64Image);

  try {
    const response = await ai.models.generateContent({
      model: MODEL_IDS.EDITING,
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              data: cleanData,
              mimeType: 'image/jpeg', // Assuming JPEG for simplicity from canvas/camera
            },
          },
        ],
      },
    });

    // Extract image from response
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated in response");
  } catch (error) {
    console.error("Error transforming image:", error);
    throw error;
  }
};

/**
 * Analyzes an image
 * Uses gemini-3-pro-preview
 */
export const analyzeImage = async (base64Image: string): Promise<string> => {
  const ai = getAiClient();
  const cleanData = cleanBase64(base64Image);

  try {
    const response = await ai.models.generateContent({
      model: MODEL_IDS.ANALYSIS,
      contents: {
        parts: [
          {
            text: "Analyze this image in detail. Describe the person, the setting, the clothing, and the artistic style. Be concise but thorough.",
          },
          {
            inlineData: {
              data: cleanData,
              mimeType: 'image/jpeg',
            },
          },
        ],
      },
    });

    return response.text || "Analysis failed to produce text.";
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};