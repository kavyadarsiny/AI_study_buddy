const { GoogleGenerativeAI } = require("@google/generative-ai");

const askGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here" || apiKey.trim() === "" || apiKey.startsWith("AQ.")) {
    console.warn("Gemini API Key is missing, placeholder, or invalid format. Using intelligent StudyBuddy fallback engine.");
    return null;
  }

  // Active production Gemini models in order of priority
  const models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];

  for (const modelName of models) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey.trim());
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text && text.trim()) return text;
    } catch (error) {
      console.warn(`Gemini model ${modelName} call failed:`, error.message);
    }
  }

  return null;
};

module.exports = { askGemini };


