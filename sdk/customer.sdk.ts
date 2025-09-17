
import { GoogleGenAI } from "@google/genai";
import * as mockApi from '../services/mockApi';
import type { TopCustomer, Customer, CustomerFormData } from '../types';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

const getTopCustomers = (): Promise<TopCustomer[]> => mockApi.getTopCustomers();

const list = (): Promise<Customer[]> => mockApi.listCustomers();

const create = (data: CustomerFormData): Promise<Customer> => mockApi.createCustomer(data);

const update = (id: string, data: Partial<CustomerFormData>): Promise<Customer> => mockApi.updateCustomer(id, data);

const deleteById = (id: string): Promise<void> => mockApi.deleteCustomer(id);

async function* generateInsightsStream(customers: Customer[], prompt: string): AsyncGenerator<string> {
    if (!prompt || customers.length === 0) return;

    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a helpful CRM assistant. Analyze the following customer JSON data and answer the user's question. Provide concise, actionable insights. The data represents the entire customer list. Today's date is ${new Date().toLocaleDateString()}.`;
    
    const contents = `${systemInstruction}\n\nUSER QUESTION: "${prompt}"\n\nCUSTOMER DATA:\n${JSON.stringify(customers, null, 2)}`;

    try {
        const response = await ai.models.generateContentStream({
            model,
            contents,
        });

        for await (const chunk of response) {
            yield chunk.text;
        }
    } catch (error) {
        console.error("Error generating insights:", error);
        throw new Error("Sorry, AI analysis failed. Please try again later.");
    }
}

export const customerApi = {
  getTopCustomers,
  list,
  create,
  update,
  deleteById,
  generateInsightsStream,
};
