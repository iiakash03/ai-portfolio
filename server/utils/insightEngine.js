// server/utils/insightEngine.js

import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

/**
 * Generates AI-based insights for a given stock portfolio.
 * @param {Array} portfolio - Array of portfolio objects [{ticker, quantity, currentPrice}]
 * @returns {Promise<string>} - AI-generated insight text
 */
export const generateInsights = async (portfolio) => {
  const groq = new Groq({ apiKey: process.env.GROQ_KEY});

  // Create a meaningful summary of the portfolio
  const portfolioSummary = portfolio
    .map(
      (item) =>
        `${item.quantity} shares of ${item.ticker} at ₹${item.currentPrice}`
    )
    .join(", ");

  const prompt = `
A user has the following stock portfolio:
${portfolioSummary}

Give 3 personalized investment insights to improve their portfolio in terms of diversification, risk management, and long-term growth. Be specific and actionable.
`;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-70b-8192",
    });

    return response.choices?.[0]?.message?.content || "No insights generated.";
  } catch (error) {
    console.error("Error generating AI insights:", error.message);
    return "AI service failed to generate insights.";
  }
};
{}