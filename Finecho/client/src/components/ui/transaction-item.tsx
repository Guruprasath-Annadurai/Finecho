import { ShoppingBag, CreditCard, Briefcase } from "lucide-react";
import { TransactionType } from "@/lib/financial-data";

interface TransactionItemProps {
  transaction: TransactionType;
}

const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const getIcon = () => {
    switch(transaction.category.toLowerCase()) {
      case 'groceries':
      case 'shopping':
        return <ShoppingBag className="h-6 w-6 text-primary-600" />;
      case 'income':
        return <Briefcase className="h-6 w-6 text-green-600" />;
      default:
        return <CreditCard className="h-6 w-6 text-primary-600" />;
    }
  };
  
  const getIconBackground = () => {
    if (transaction.amount > 0) {
      return 'bg-green-100';
    }
    return 'bg-primary-100';
  };

  return (
    <li className="p-4 hover:bg-gray-50">
      <div className="flex items-center space-x-4">
        <div className={`flex-shrink-0 h-10 w-10 ${getIconBackground()} rounded-full flex items-center justify-center`}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {transaction.merchant}
          </p>
          <p className="text-sm text-gray-500">
            {transaction.date}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-sm font-semibold ${transaction.amount > 0 ? 'text-green-500' : 'text-gray-900'}`}>
            {transaction.amount > 0 ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">{transaction.category}</p>
        </div>
      </div>
    </li>
  );
};

export default TransactionItem;
