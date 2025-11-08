import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { generateCacheKey, cacheWrapper } from "../utils/cache.js";

dotenv.config();

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate summary using Gemini AI with Redis caching
 * Caches summaries based on input text hash to avoid redundant API calls
 */
const summariser = async (text) => {
  try {
    // Generate cache key based on text content
    // This ensures identical text gets the same cached summary
    const cacheKey = generateCacheKey('ai-summary', text);

    // Use cache wrapper to get cached summary or generate new one
    const summaryText = await cacheWrapper(
      cacheKey,
      async () => {
        console.log('🤖 Generating new AI summary (cache miss)...');

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
        const generatedSummary = response.text();

        console.log("✅ AI Summary generated successfully");
        return generatedSummary;
      },
      // Cache for 7 days (604800 seconds)
      // AI summaries for the same text won't change, thus long TTL 
      604800
    );

    return summaryText;
  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    throw new Error('Failed to generate summary: ' + error.message);
  }
};

export default summariser;