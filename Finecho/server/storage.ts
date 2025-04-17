import { 
  users, type User, type InsertUser,
  transactions, type Transaction, type InsertTransaction,
  accounts, type Account, type InsertAccount,
  budgets, type Budget, type InsertBudget,
  goals, type Goal, type InsertGoal,
  voiceCommands, type VoiceCommand, type InsertVoiceCommand
} from "@shared/schema";

// Interface for storage methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Transaction methods
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  
  // Account methods
  createAccount(account: InsertAccount): Promise<Account>;
  getAccountsByUserId(userId: number): Promise<Account[]>;
  updateAccountBalance(accountId: number, newBalance: number): Promise<Account>;
  
  // Budget methods
  createBudget(budget: InsertBudget): Promise<Budget>;
  getBudgetsByUserId(userId: number): Promise<Budget[]>;
  
  // Goal methods
  createGoal(goal: InsertGoal): Promise<Goal>;
  getGoalsByUserId(userId: number): Promise<Goal[]>;
  updateGoalProgress(goalId: number, amount: number): Promise<Goal>;
  
  // Voice command methods
  recordVoiceCommand(command: InsertVoiceCommand): Promise<VoiceCommand>;
  processVoiceCommand(command: string, userId: number): Promise<any>;
  
  // Financial summary and insights
  getFinancialSummary(userId: number): Promise<any>;
  getFinancialInsights(userId: number): Promise<any>;
}

// Memory storage implementation for MVP
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private transactions: Map<number, Transaction>;
  private accounts: Map<number, Account>;
  private budgets: Map<number, Budget>;
  private goals: Map<number, Goal>;
  private voiceCommands: Map<number, VoiceCommand>;
  
  private userIdCounter: number;
  private transactionIdCounter: number;
  private accountIdCounter: number;
  private budgetIdCounter: number;
  private goalIdCounter: number;
  private voiceCommandIdCounter: number;

  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.accounts = new Map();
    this.budgets = new Map();
    this.goals = new Map();
    this.voiceCommands = new Map();
    
    this.userIdCounter = 1;
    this.transactionIdCounter = 1;
    this.accountIdCounter = 1;
    this.budgetIdCounter = 1;
    this.goalIdCounter = 1;
    this.voiceCommandIdCounter = 1;
    
    // Add demo user and data for the MVP
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create demo user
    const demoUser: InsertUser = {
      username: "johnsmith",
      password: "password123", // In a real app, this would be hashed
      name: "John Smith",
      email: "john@example.com",
      avatarUrl: null
    };
    
    const user = this.createUser(demoUser);
    
    // Create accounts
    this.createAccount({
      userId: user.id,
      name: "Main Checking",
      type: "checking",
      balance: 12500.82,
      currency: "USD",
      isActive: true
    });
    
    this.createAccount({
      userId: user.id,
      name: "Savings Account",
      type: "savings",
      balance: 8341.23,
      currency: "USD",
      isActive: true
    });
    
    this.createAccount({
      userId: user.id,
      name: "Credit Card",
      type: "credit",
      balance: -720.00,
      currency: "USD",
      isActive: true
    });
    
    // Create transactions
    this.createTransaction({
      userId: user.id,
      merchant: "Whole Foods Market",
      amount: -86.45,
      date: new Date(),
      category: "Groceries",
      description: "Weekly grocery shopping"
    });
    
    this.createTransaction({
      userId: user.id,
      merchant: "TechCorp Inc.",
      amount: 3450.00,
      date: new Date(Date.now() - 86400000), // Yesterday
      category: "Income",
      description: "Monthly salary deposit"
    });
    
    this.createTransaction({
      userId: user.id,
      merchant: "Netflix",
      amount: -14.99,
      date: new Date(Date.now() - 259200000), // 3 days ago
      category: "Entertainment",
      description: "Monthly subscription"
    });
    
    this.createTransaction({
      userId: user.id,
      merchant: "Uber",
      amount: -22.15,
      date: new Date(Date.now() - 345600000), // 4 days ago
      category: "Transport",
      description: "Ride to airport"
    });
    
    // Create budgets
    this.createBudget({
      userId: user.id,
      category: "Groceries",
      amount: 400.00,
      period: "monthly",
      startDate: new Date(new Date().setDate(1)), // First day of current month
      endDate: null
    });
    
    this.createBudget({
      userId: user.id,
      category: "Entertainment",
      amount: 200.00,
      period: "monthly",
      startDate: new Date(new Date().setDate(1)),
      endDate: null
    });
    
    // Create goals
    this.createGoal({
      userId: user.id,
      name: "Vacation Fund",
      targetAmount: 3000.00,
      currentAmount: 1250.00,
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      isCompleted: false
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...userData, id };
    this.users.set(id, user);
    return user;
  }

  // Transaction methods
  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const transaction: Transaction = { ...transactionData, id };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Account methods
  async createAccount(accountData: InsertAccount): Promise<Account> {
    const id = this.accountIdCounter++;
    const account: Account = { ...accountData, id };
    this.accounts.set(id, account);
    return account;
  }

  async getAccountsByUserId(userId: number): Promise<Account[]> {
    return Array.from(this.accounts.values())
      .filter(account => account.userId === userId);
  }

  async updateAccountBalance(accountId: number, newBalance: number): Promise<Account> {
    const account = this.accounts.get(accountId);
    if (!account) {
      throw new Error(`Account with ID ${accountId} not found`);
    }
    
    const updatedAccount: Account = { ...account, balance: newBalance };
    this.accounts.set(accountId, updatedAccount);
    return updatedAccount;
  }

  // Budget methods
  async createBudget(budgetData: InsertBudget): Promise<Budget> {
    const id = this.budgetIdCounter++;
    const budget: Budget = { ...budgetData, id };
    this.budgets.set(id, budget);
    return budget;
  }

  async getBudgetsByUserId(userId: number): Promise<Budget[]> {
    return Array.from(this.budgets.values())
      .filter(budget => budget.userId === userId);
  }

  // Goal methods
  async createGoal(goalData: InsertGoal): Promise<Goal> {
    const id = this.goalIdCounter++;
    const goal: Goal = { ...goalData, id };
    this.goals.set(id, goal);
    return goal;
  }

  async getGoalsByUserId(userId: number): Promise<Goal[]> {
    return Array.from(this.goals.values())
      .filter(goal => goal.userId === userId);
  }

  async updateGoalProgress(goalId: number, amount: number): Promise<Goal> {
    const goal = this.goals.get(goalId);
    if (!goal) {
      throw new Error(`Goal with ID ${goalId} not found`);
    }
    
    const newAmount = goal.currentAmount + amount;
    const isCompleted = newAmount >= goal.targetAmount;
    
    const updatedGoal: Goal = { 
      ...goal, 
      currentAmount: newAmount,
      isCompleted: isCompleted
    };
    
    this.goals.set(goalId, updatedGoal);
    return updatedGoal;
  }

  // Voice command methods
  async recordVoiceCommand(commandData: InsertVoiceCommand): Promise<VoiceCommand> {
    const id = this.voiceCommandIdCounter++;
    const command: VoiceCommand = { ...commandData, id };
    this.voiceCommands.set(id, command);
    return command;
  }

  async processVoiceCommand(commandText: string, userId: number): Promise<any> {
    try {
      // Import dynamically to avoid circular dependencies
      const { processVoiceCommand } = await import('./openai-service');
      
      // First try processing with OpenAI
      const aiResponse = await processVoiceCommand(commandText, userId);
      
      // If OpenAI provided a valid response, use it
      if (aiResponse && aiResponse.type && aiResponse.type !== 'error') {
        // If the AI response needs data, fetch it
        if (aiResponse.type === 'balance') {
          const accounts = await this.getAccountsByUserId(userId);
          const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
          return {
            ...aiResponse,
            data: { ...aiResponse.data, totalBalance, accounts }
          };
        } 
        else if (aiResponse.type === 'expense' || aiResponse.type === 'spending') {
          const transactions = await this.getTransactionsByUserId(userId);
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          
          const monthlyTransactions = transactions.filter(t => {
            const transDate = new Date(t.date);
            return transDate.getMonth() === currentMonth && 
                  transDate.getFullYear() === currentYear &&
                  t.amount < 0;
          });
          
          const totalExpenses = Math.abs(monthlyTransactions.reduce((sum, t) => sum + t.amount, 0));
          
          return {
            ...aiResponse,
            data: { 
              ...aiResponse.data, 
              totalExpenses, 
              transactions: monthlyTransactions 
            }
          };
        }
        else if (aiResponse.type === 'budget') {
          const budgets = await this.getBudgetsByUserId(userId);
          return {
            ...aiResponse,
            data: { ...aiResponse.data, budgets }
          };
        }
        
        // For other response types, return the AI response as is
        return aiResponse;
      }
      
      // Fallback to basic command processing logic if AI fails
      const lowerCommand = commandText.toLowerCase();
      
      if (lowerCommand.includes("balance") || lowerCommand.includes("how much")) {
        const accounts = await this.getAccountsByUserId(userId);
        const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
        
        return {
          type: "balance",
          message: `Your total balance is $${totalBalance.toFixed(2)}.`,
          data: { totalBalance }
        };
      } 
      else if (lowerCommand.includes("spend") || lowerCommand.includes("expense")) {
        const transactions = await this.getTransactionsByUserId(userId);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyTransactions = transactions.filter(t => {
          const transDate = new Date(t.date);
          return transDate.getMonth() === currentMonth && 
                transDate.getFullYear() === currentYear &&
                t.amount < 0;
        });
        
        const totalExpenses = Math.abs(monthlyTransactions.reduce((sum, t) => sum + t.amount, 0));
        
        return {
          type: "expenses",
          message: `Your expenses this month total $${totalExpenses.toFixed(2)}.`,
          data: { totalExpenses, transactions: monthlyTransactions }
        };
      } 
      else if (lowerCommand.includes("transfer") || lowerCommand.includes("move money")) {
        // Extract amount from command
        const amountMatch = commandText.match(/\$?(\d+(\.\d{1,2})?)/);
        let amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
        
        if (amount <= 0) {
          return {
            type: "error",
            message: "I couldn't determine the amount to transfer. Please try again with a specific amount."
          };
        }
        
        // For demo purposes, just return a success message
        return {
          type: "transfer",
          message: `I've initiated a transfer of $${amount.toFixed(2)} to your savings account.`,
          data: { amount }
        };
      } 
      else if (lowerCommand.includes("budget")) {
        const budgets = await this.getBudgetsByUserId(userId);
        
        return {
          type: "budget",
          message: "Here's your budget information for this month.",
          data: { budgets }
        };
      } 
      else {
        return {
          type: "unknown",
          message: "I'm sorry, I didn't understand that command. Please try again."
        };
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      return {
        type: "error",
        message: "I encountered an error processing your request. Please try again later."
      };
    }
  }

  // Financial summary and insights
  async getFinancialSummary(userId: number): Promise<any> {
    const accounts = await this.getAccountsByUserId(userId);
    const transactions = await this.getTransactionsByUserId(userId);
    
    // Calculate total balance from all accounts
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    
    // Calculate monthly expenses
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
      const transDate = new Date(t.date);
      return transDate.getMonth() === currentMonth && 
             transDate.getFullYear() === currentYear;
    });
    
    const expenses = monthlyTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const income = monthlyTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Get savings accounts total
    const savings = accounts
      .filter(a => a.type === "savings")
      .reduce((sum, a) => sum + a.balance, 0);
    
    // Calculate spending by category
    const categories = [...new Set(transactions
      .filter(t => t.amount < 0)
      .map(t => t.category))];
    
    const spendingByCategory = categories.map(category => {
      const amount = Math.abs(monthlyTransactions
        .filter(t => t.category === category && t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0));
      
      return { category, amount };
    });
    
    // Sort by amount and calculate percentages
    spendingByCategory.sort((a, b) => b.amount - a.amount);
    
    const maxAmount = Math.max(...spendingByCategory.map(c => c.amount));
    
    const spendingWithPercentages = spendingByCategory.map(cat => ({
      ...cat,
      percentage: Math.round((cat.amount / maxAmount) * 100)
    }));
    
    return {
      totalBalance,
      expenses,
      income,
      savings,
      spendingByCategory: spendingWithPercentages,
      recentTransactions: transactions.slice(0, 5)
    };
  }

  async getFinancialInsights(userId: number): Promise<any> {
    try {
      const transactions = await this.getTransactionsByUserId(userId);
      
      // Try to generate insights using OpenAI
      try {
        const { generateFinancialInsights } = await import('./openai-service');
        const aiInsights = await generateFinancialInsights(transactions);
        
        // If we got valid AI-generated insights, use them
        if (Array.isArray(aiInsights) && aiInsights.length > 0) {
          return aiInsights;
        }
      } catch (aiError) {
        console.error('Error generating AI insights:', aiError);
        // Fall back to rule-based insights if AI fails
      }
      
      // Fallback to rule-based insights generation
      const currentMonth = new Date().getMonth();
      const lastMonth = (currentMonth - 1 + 12) % 12;
      
      // Get current and last month's transactions
      const currentMonthTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth;
      });
      
      const lastMonthTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === lastMonth;
      });
      
      // Get spending by category for both months
      const getSpendingByCategory = (trans: Transaction[]) => {
        const categories = [...new Set(trans.filter(t => t.amount < 0).map(t => t.category))];
        
        return categories.map(category => {
          const amount = Math.abs(trans
            .filter(t => t.category === category && t.amount < 0)
            .reduce((sum, t) => sum + t.amount, 0));
          
          return { category, amount };
        });
      };
      
      const currentMonthSpending = getSpendingByCategory(currentMonthTransactions);
      const lastMonthSpending = getSpendingByCategory(lastMonthTransactions);
      
      // Generate insights
      const insights = [];
      
      // Compare spending by category
      currentMonthSpending.forEach(current => {
        const lastMonth = lastMonthSpending.find(l => l.category === current.category);
        
        if (lastMonth && lastMonth.amount > 0) {
          const percentChange = ((current.amount - lastMonth.amount) / lastMonth.amount) * 100;
          
          if (percentChange > 25) {
            insights.push({
              type: "warning",
              title: `${current.category} Spending Alert`,
              description: `Your ${current.category.toLowerCase()} spending is ${Math.round(percentChange)}% higher than last month. Consider adjusting your budget.`,
              actionText: "View Details"
            });
          } else if (percentChange < -20) {
            insights.push({
              type: "success",
              title: `${current.category} Spending Reduced`,
              description: `Great job! You've reduced your ${current.category.toLowerCase()} spending by ${Math.abs(Math.round(percentChange))}% compared to last month.`,
              actionText: "View Details"
            });
          }
        }
      });
      
      // Add some generic insights for demo purposes
      insights.push({
        type: "success",
        title: "Savings Opportunity",
        description: "You could save $45/month by switching to a no-fee checking account based on your transaction history.",
        actionText: "Learn More"
      });
      
      if (insights.length === 0) {
        insights.push({
          type: "info",
          title: "Financial Health Check",
          description: "Your spending patterns look consistent with last month. Keep up the good work!",
          actionText: "View Details"
        });
      }
      
      return insights;
    } catch (error) {
      console.error('Error getting financial insights:', error);
      return [
        {
          type: "info",
          title: "Insights Unavailable",
          description: "We couldn't generate personalized insights at the moment. Please try again later.",
          actionText: "Refresh"
        }
      ];
    }
  }
}

export const storage = new MemStorage();
