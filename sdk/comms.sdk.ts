import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import * as mockApi from '../services/mockApi';
import type { CampaignTemplate } from '../types';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

const listTemplates = (): Promise<CampaignTemplate[]> => mockApi.listTemplates();

const createTemplate = (data: Omit<CampaignTemplate, 'id' | 'createdAt'>): Promise<CampaignTemplate> => mockApi.createTemplate(data);

const updateTemplate = (id: string, data: Partial<Omit<CampaignTemplate, 'id'>>): Promise<CampaignTemplate> => mockApi.updateTemplate(id, data);

const deleteTemplate = (id: string): Promise<void> => mockApi.deleteTemplate(id);

// This function interacts with a third-party API and remains unchanged.
const generateTemplateContent = async (prompt: string): Promise<string> => {
  if (!prompt) return "";
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating template content:", error);
    // Throw a user-friendly error that the apiClient and useApi hook can catch
    throw new Error("Sorry, AI content generation failed. Please try again later.");
  }
};

export const commsApi = {
  listTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  generateTemplateContent,
};