export interface Transaction {
  id: number;
  merchant: string;
  amount: number;
  date: string;
  category: string;
}

export interface FinancialSummary {
  totalBalance: number;
  monthlyExpenses: number;
  savings: number;
}

export interface SpendingInsight {
  category: string;
  amount: number;
  percentage: number;
}

export interface FinancialInsight {
  id: number;
  type: 'warning' | 'success' | 'info';
  title: string;
  description: string;
  actionText?: string;
  actionUrl?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
}
