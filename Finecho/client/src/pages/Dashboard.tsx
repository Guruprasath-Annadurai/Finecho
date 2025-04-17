import { useState, useCallback, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import VoiceButton from "@/components/ui/voice-button";
import { Card, CardContent } from "@/components/ui/card";
import TransactionItem from "@/components/ui/transaction-item";
import InsightCard from "@/components/ui/insight-card";
import SpendingChart from "@/components/dashboard/SpendingChart";
import { TrendingUp, TrendingDown, Wallet, DollarSign, PiggyBank } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useToast } from "@/hooks/use-toast";
import { financialData, TransactionType } from "@/lib/financial-data";

const Dashboard = () => {
  const { toast } = useToast();
  const [transactions] = useState<TransactionType[]>(financialData.recentTransactions);
  const [listening, setListening] = useState(false);
  const [transcription, setTranscription] = useState("");
  const transcriptionRef = useRef("");

  // Store transcription in ref to avoid dependency issues
  const updateTranscription = useCallback((text: string) => {
    setTranscription(text);
    transcriptionRef.current = text;
  }, []);

  const handleVoiceCommand = useCallback(async (command: string) => {
    // First, set the command is being processed
    toast({
      title: "Processing your request...",
      description: "I'm analyzing your command"
    });
    
    try {
      // Try to use OpenAI for more sophisticated processing
      const { analyzeFinancialCommand } = await import('@/lib/openai');
      const response = await analyzeFinancialCommand(command);
      
      if (response && response.type && response.type !== 'error') {
        // Show the AI-generated response to the user
        toast({
          title: response.intent || "Command Processed",
          description: response.message,
          variant: response.type === 'warning' ? 'destructive' : 'default'
        });
        
        // Perform any additional actions based on the command type
        if (response.type === 'transfer' && response.data?.amount) {
          // Here we would typically call an API to initiate the transfer
          console.log(`Transfer initiated: $${response.data.amount}`);
        }
        
        return;
      }
    } catch (error) {
      console.error('Error processing with AI:', error);
      // Fall back to basic rule-based processing
    }
    
    // Basic command handling logic as fallback
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes("balance") || lowerCommand.includes("how much") || lowerCommand.includes("money")) {
      toast({
        title: "Your Balance",
        description: `Your current balance is $${financialData.totalBalance.toFixed(2)}`,
      });
    } else if (lowerCommand.includes("spend") || lowerCommand.includes("expense")) {
      toast({
        title: "Monthly Expenses",
        description: `Your monthly expenses are $${financialData.monthlyExpenses.toFixed(2)}`,
      });
    } else if (lowerCommand.includes("saving") || lowerCommand.includes("save")) {
      toast({
        title: "Your Savings",
        description: `Your current savings are $${financialData.savings.toFixed(2)}`,
      });
    } else {
      toast({
        title: "Command not understood",
        description: "Sorry, I didn't understand that command. Please try again.",
        variant: "destructive"
      });
    }
  }, [toast]);
  
  const handleSpeechResult = useCallback((result: string) => {
    updateTranscription(result);
  }, [updateTranscription]);
  
  const handleSpeechEnd = useCallback(() => {
    setListening(false);
    if (transcriptionRef.current) {
      handleVoiceCommand(transcriptionRef.current);
    }
  }, [handleVoiceCommand]);

  const { isListening, startListening, stopListening, hasRecognitionSupport } = 
    useSpeechRecognition({
      onResult: handleSpeechResult,
      onEnd: handleSpeechEnd
    });

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
      setListening(false);
    } else {
      if (!hasRecognitionSupport) {
        toast({
          title: "Browser not supported",
          description: "Your browser doesn't support speech recognition.",
          variant: "destructive"
        });
        return;
      }
      startListening();
      setListening(true);
    }
  }, [isListening, startListening, stopListening, hasRecognitionSupport, toast]);

  const exampleCommands = [
    "What's my current balance?",
    "How much did I spend on groceries?",
    "Transfer $500 to savings",
    "Show me my budget for this month"
  ];

  return (
    <MainLayout>
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Hello, John!</h1>
        <p className="text-gray-600">Here's your financial overview for today.</p>
      </div>

      {/* Balance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Total Balance Card */}
        <Card className="border-l-4 border-primary">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div className="text-2xl font-bold text-gray-900">${financialData.totalBalance.toFixed(2)}</div>
            <div className="flex items-center mt-1 text-sm">
              <span className="text-green-500 font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                2.5%
              </span>
              <span className="text-gray-500 ml-1">since last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Expenses Card */}
        <Card className="border-l-4 border-yellow-500">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-500">Monthly Expenses</h3>
              <DollarSign className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">${financialData.monthlyExpenses.toFixed(2)}</div>
            <div className="flex items-center mt-1 text-sm">
              <span className="text-red-500 font-medium flex items-center">
                <TrendingDown className="h-4 w-4 mr-1" />
                4.3%
              </span>
              <span className="text-gray-500 ml-1">since last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Savings Card */}
        <Card className="border-l-4 border-green-500">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-500">Savings</h3>
              <PiggyBank className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">${financialData.savings.toFixed(2)}</div>
            <div className="flex items-center mt-1 text-sm">
              <span className="text-green-500 font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                12.7%
              </span>
              <span className="text-gray-500 ml-1">since last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voice Assistant Container */}
      <div className="mb-8 bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <div className="p-5 bg-gradient-to-r from-primary-600 to-indigo-600 text-white">
          <h2 className="text-lg font-semibold mb-1">Voice Assistant</h2>
          <p className="text-sm text-white/80">Ask me anything about your finances</p>
        </div>
        <div className="p-5 flex flex-col items-center justify-center">
          {/* Voice Button Component */}
          <div className="mb-6">
            <VoiceButton isListening={listening} onClick={toggleListening} />
          </div>

          {/* Transcription display */}
          {transcription && (
            <div className="mb-4 text-sm text-center text-gray-700">
              "{transcription}"
            </div>
          )}

          {/* Example Commands */}
          <div className="w-full max-w-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Try asking:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {exampleCommands.map((command, index) => (
                <div 
                  key={index} 
                  className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition"
                  onClick={() => {
                    setTranscription(command);
                    handleVoiceCommand(command);
                  }}
                >
                  "{command}"
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spending Insights Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Spending Insights</h2>
        <Card>
          <CardContent className="p-0">
            {/* Chart Section */}
            <div className="p-4">
              <div className="flex justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">Monthly Spending by Category</h3>
                <div className="flex space-x-2">
                  <button className="px-2 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded hover:bg-primary-100">
                    This Month
                  </button>
                  <button className="px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded">
                    Last Month
                  </button>
                </div>
              </div>

              {/* Chart Component */}
              <SpendingChart data={financialData.spendingByCategory} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">View All</a>
        </div>
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-gray-200">
              {transactions.map((transaction, index) => (
                <TransactionItem key={index} transaction={transaction} />
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Financial Insights Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Insights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InsightCard 
            type="warning"
            title="Spending Alert"
            description="Your restaurant spending is 35% higher than last month. Consider adjusting your dining budget."
            actionText="View Details"
          />
          
          <InsightCard 
            type="success"
            title="Savings Opportunity"
            description="You could save $45/month by switching to a no-fee checking account based on your transaction history."
            actionText="Learn More"
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
