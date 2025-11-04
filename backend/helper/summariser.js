import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const summariser = async (text) => {
  try {
    // Try gemini-2.0-flash-exp first, fallback to gemini-pro
    let model;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    } catch (e) {
      console.log("gemini-2.0-flash-exp not available, trying gemini-pro");
      model = genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    const prompt = `Summarize the following text clearly and concisely.
Preserve only the key ideas and critical information.
Do not add your own opinions or details.
Output should be in 3 to 5 bullet points.

Text:
${text}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const summaryText = response.text();

    console.log("Summary generated:", summaryText);
    return summaryText;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate summary: ' + error.message);
  }
};

export default summariser;