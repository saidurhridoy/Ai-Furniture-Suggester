import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { FurnitureSuggestion, SuggestionCategory } from '../types';
import { imageUrlToBase64 } from "../utils/image";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const furnitureSuggestionSchema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: "The name of the furniture item, e.g., 'Mid-Century Modern Sofa'.",
    },
    description: {
      type: Type.STRING,
      description: "A brief one-sentence description of why this item fits the room and style.",
    },
    material: {
      type: Type.STRING,
      description: "The primary materials of the furniture, e.g., 'Oak wood and linen fabric'.",
    },
    url: {
      type: Type.STRING,
      description: "The direct URL to the product page on deltafurnishers.com.",
    },
    imageUrl: {
      type: Type.STRING,
      description: "The direct URL to the main product image.",
    }
  },
  required: ["name", "description", "material", "url", "imageUrl"],
};

const suggestionCategorySchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            category: {
                type: Type.STRING,
                description: "The name of the identified area in the room, e.g., 'Main Seating Area' or 'Accent Pieces'."
            },
            suggestions: {
                type: Type.ARRAY,
                items: furnitureSuggestionSchema
            }
        },
        required: ["category", "suggestions"],
    }
};


export const getFurnitureSuggestions = async (
  base64Image: string,
  stylePreference: string
): Promise<SuggestionCategory[]> => {
  try {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    };

    const textPart = {
        text: `Based on the attached image of a room and the user's preferred style of '${stylePreference}', act as an interior designer. First, analyze the image to identify distinct areas or potential uses of space (e.g., 'main seating area', 'empty corner', 'workspace'). Then, for each identified area, suggest 1-2 relevant furniture items exclusively from the website https://deltafurnishers.com. Group your suggestions by the area you identified. For each item, provide its name, a brief description, its material, the product page URL, and ensure you include the direct URL for the main product image, which should populate the 'imageUrl' field in the JSON response.`
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: suggestionCategorySchema,
      }
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("Received an empty response from the API.");
    }

    const parsedSuggestions: SuggestionCategory[] = JSON.parse(jsonText);
    return parsedSuggestions;

  } catch (error) {
    console.error("Error calling Gemini API for suggestions:", error);
    throw new Error("Failed to get furniture suggestions from AI. The model may be unable to process the request.");
  }
};

export const blendFurnitureIntoRoom = async (
  roomBase64: string,
  furniture: FurnitureSuggestion
): Promise<string> => {
  try {
    const furnitureImageBase64 = await imageUrlToBase64(furniture.imageUrl);
    
    const roomImagePart = {
      inlineData: { mimeType: 'image/jpeg', data: roomBase64 }
    };
    const furnitureImagePart = {
        inlineData: { mimeType: 'image/jpeg', data: furnitureImageBase64 }
    };
    const textPart = {
        text: `Seamlessly integrate the furniture from the second image into the first image (the room). Place it in a suitable, empty space. Adjust lighting, shadows, and perspective to make it look hyper-realistic, as if it were originally part of the photo. Do not add any text or annotations to the final image.`
    };
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [roomImagePart, furnitureImagePart, textPart],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }

    throw new Error("AI did not return a blended image.");
  } catch(error) {
      console.error("Error calling Gemini API for image blending:", error);
      throw new Error("Failed to visualize furniture with AI. " + (error instanceof Error ? error.message : ""));
  }
};
