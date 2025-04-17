import OpenAI from "openai";

// Initialize OpenAI with API key from environment variables
// Note: For security, we should normally call OpenAI from the server side
// This is just for development and demonstration purposes
let openai: OpenAI;

try {
  openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'placeholder-key',
    dangerouslyAllowBrowser: true // Only for client-side use in development
  });
} catch (error) {
  console.error("Error initializing OpenAI:", error);
  // Create a mock instance for development without breaking the app
  openai = {
    chat: {
      completions: {
        create: async () => ({
          choices: [{ message: { content: '{"error": "OpenAI API key not configured"}' } }]
        })
      }
    }
  } as unknown as OpenAI;
}

/**
 * Process a financial voice command with OpenAI
 * @param command The voice command text to analyze
 * @returns Response object with financial analysis
 */
export async function analyzeFinancialCommand(command: string) {
  try {
    // Implement OpenAI API call to analyze the financial command
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a financial assistant parsing voice commands into structured financial data.
          Extract amount, merchant/vendor, date, and category from the text. If date is not provided, assume today.
          Respond with JSON containing these fields: amount, merchant, date (YYYY-MM-DD), and category.
          For categories, choose from: food, travel, shopping, entertainment, utilities, housing, healthcare, or other.`
        },
        {
          role: "user",
          content: command
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the response to get structured data
    const resultText = response.choices[0].message.content;
    
    if (!resultText) {
      throw new Error("No response from OpenAI");
    }
    
    return JSON.parse(resultText);
  } catch (error) {
    console.error("Error analyzing financial command:", error);
    // Return fallback data for development without API key
    return {
      amount: 0,
      merchant: "Unknown",
      date: new Date().toISOString().split('T')[0],
      category: "other"
    };
  }
}

/**
 * Generate personalized financial insights based on transaction data
 * @param transactions The user's transaction history
 * @returns Array of financial insights
 */
export async function generateFinancialInsights(transactions: any[]) {
  try {
    // In a real implementation, this would call OpenAI with transaction data
    // For now, return placeholder insights
    return [
      {
        id: 1,
        type: 'warning',
        title: 'High Spending on Food',
        description: 'Your food expenses are 20% higher than last month. Consider meal planning to reduce costs.'
      },
      {
        id: 2,
        type: 'success',
        title: 'Savings Goal Progress',
        description: 'You\'re on track to reach your savings goal by the end of the month!'
      }
    ];
  } catch (error) {
    console.error("Error generating insights:", error);
    return [];
  }
}

/**
 * Generate financial forecasts and predictions based on spending patterns
 * @param financialData User's financial data including transactions and account balances
 * @returns Financial forecast data
 */
export async function generateFinancialForecast(financialData: any) {
  try {
    // This would connect to OpenAI for advanced forecasting
    // Simplified version for development
    return {
      endOfMonthBalance: financialData.totalBalance - (financialData.monthlyExpenses / 2),
      savingsPotential: financialData.monthlyExpenses * 0.1,
      riskAreas: ['Entertainment', 'Dining'],
      recommendations: [
        'Reduce discretionary spending by 15%',
        'Set up automatic transfers to savings'
      ]
    };
  } catch (error) {
    console.error("Error generating forecast:", error);
    return null;
  }
}