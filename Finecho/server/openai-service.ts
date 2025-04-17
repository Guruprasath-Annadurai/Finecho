import OpenAI from "openai";
import { Transaction } from "@shared/schema";

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

/**
 * Process voice command using OpenAI
 * @param command Text of the voice command
 * @param userId User ID for context
 * @returns Processed command response
 */
export async function processVoiceCommand(command: string, userId: number) {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are FinEcho, an AI financial assistant. Analyze the user's voice command 
          about their finances and provide a helpful response. Parse the command for intents related to:
          - Account balances
          - Spending analysis
          - Budget information
          - Savings goals
          - Money transfers
          - Financial advice
          
          Return a JSON response with appropriate action and message.`
        },
        {
          role: "user",
          content: command
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content || 
      '{"type":"error","message":"Failed to process command"}';
    return JSON.parse(content);
  } catch (error) {
    console.error("Error processing voice command with OpenAI:", error);
    return {
      type: "error",
      message: "Sorry, I couldn't process your request at the moment."
    };
  }
}

/**
 * Generate personalized financial insights based on transaction history
 * @param transactions User's transaction history
 * @returns Array of financial insights
 */
export async function generateFinancialInsights(transactions: Transaction[]) {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are a financial analyst. Based on the transaction data provided, generate 2-3 actionable financial insights.
          Each insight should be categorized as:
          - "warning" for concerning patterns
          - "success" for positive behaviors
          - "info" for neutral information
          
          Respond with JSON in this format:
          [
            {
              "type": "warning|success|info",
              "title": "short insight title",
              "description": "detailed explanation with specific numbers",
              "actionText": "suggested action text"
            }
          ]`
        },
        {
          role: "user",
          content: JSON.stringify(transactions)
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content || '[]';
    const insights = JSON.parse(content);
    return insights;
  } catch (error) {
    console.error("Error generating financial insights with OpenAI:", error);
    return [
      {
        type: "info",
        title: "AI Analysis Unavailable",
        description: "We're unable to generate personalized insights at the moment.",
        actionText: "Try Again Later"
      }
    ];
  }
}

/**
 * Categorize a transaction based on its description
 * @param description Transaction description or merchant name
 * @returns Suggested category
 */
export async function categorizeTransaction(description: string) {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are a financial categorization system. Analyze the transaction description 
          and categorize it into one of these categories:
          - Food & Dining
          - Shopping
          - Travel
          - Transportation
          - Entertainment
          - Health & Fitness
          - Bills & Utilities
          - Income
          - Education
          - Personal Care
          - Home
          - Other
          
          Return only the category name as a string.`
        },
        {
          role: "user",
          content: description
        }
      ]
    });

    return response.choices[0].message.content?.trim() || "Other";
  } catch (error) {
    console.error("Error categorizing transaction with OpenAI:", error);
    return "Other";
  }
}