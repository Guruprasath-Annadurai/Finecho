export interface TransactionType {
  id: number;
  merchant: string;
  amount: number;
  date: string;
  category: string;
}

export interface SpendingCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface FinancialDataType {
  totalBalance: number;
  monthlyExpenses: number;
  savings: number;
  spendingByCategory: SpendingCategory[];
  recentTransactions: TransactionType[];
}

export const financialData: FinancialDataType = {
  totalBalance: 24562.05,
  monthlyExpenses: 3284.20,
  savings: 8341.23,
  spendingByCategory: [
    { category: "Food", amount: 700, percentage: 70 },
    { category: "Shopping", amount: 450, percentage: 45 },
    { category: "Housing", amount: 850, percentage: 85 },
    { category: "Transport", amount: 350, percentage: 35 },
    { category: "Health", amount: 250, percentage: 25 },
    { category: "Entertainment", amount: 550, percentage: 55 }
  ],
  recentTransactions: [
    {
      id: 1,
      merchant: "Whole Foods Market",
      amount: -86.45,
      date: "Today, 2:34 PM",
      category: "Groceries"
    },
    {
      id: 2,
      merchant: "Salary Deposit",
      amount: 3450.00,
      date: "Yesterday, 9:00 AM",
      category: "Income"
    },
    {
      id: 3,
      merchant: "Netflix Subscription",
      amount: -14.99,
      date: "Feb 15, 11:13 AM",
      category: "Entertainment"
    },
    {
      id: 4,
      merchant: "Uber Ride",
      amount: -22.15,
      date: "Feb 14, 8:30 PM",
      category: "Transport"
    }
  ]
};
