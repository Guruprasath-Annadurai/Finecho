import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { FaMicrophoneAlt, FaChartBar, FaWallet, FaHandHoldingUsd } from "react-icons/fa";
import { financialData } from "@/lib/financial-data";
import { Card } from "@/components/ui/card";

// Demo mode dashboard to bypass authentication issues
export function DemoMode() {
  const [, setLocation] = useLocation();
  const [firebaseStatus, setFirebaseStatus] = useState("Checking...");
  
  // Check if Firebase is configured
  useEffect(() => {
    try {
      const hasFirebaseConfig = 
        import.meta.env.VITE_FIREBASE_API_KEY &&
        import.meta.env.VITE_FIREBASE_PROJECT_ID &&
        import.meta.env.VITE_FIREBASE_APP_ID;
      
      setFirebaseStatus(hasFirebaseConfig 
        ? "Firebase keys detected ✓" 
        : "Firebase keys missing ✗");
    } catch (e) {
      console.error("Error checking Firebase config:", e);
      setFirebaseStatus("Error checking Firebase config");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaMicrophoneAlt className="text-xl" />
            <h1 className="text-xl font-bold">FinEcho Demo</h1>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-white border-white/30 hover:bg-white/10"
            onClick={() => window.location.reload()}
          >
            Restart
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar with feature cards */}
          <div className="md:col-span-1 space-y-4">
            <Card className="p-5 shadow-md">
              <h2 className="text-lg font-semibold mb-3 text-primary-800">App Status</h2>
              <div className={firebaseStatus.includes("✓") ? "text-green-600" : "text-yellow-600"}>
                {firebaseStatus}
              </div>
              <hr className="my-3" />
              <div className="text-green-600">Server running ✓</div>
              <div className="text-green-600">Demo mode active ✓</div>
            </Card>

            <Card className="p-5 shadow-md">
              <h2 className="text-lg font-semibold mb-3 text-primary-800">Features</h2>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <FaMicrophoneAlt className="text-primary-600" />
                  <span>Voice Commands</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaChartBar className="text-primary-600" />
                  <span>Spending Analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaWallet className="text-primary-600" />
                  <span>Budget Management</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaHandHoldingUsd className="text-primary-600" />
                  <span>Savings Goals</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            <Card className="p-5 shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-primary-800">Financial Overview</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">Balance</p>
                  <p className="text-2xl font-bold">£{financialData.totalBalance}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-600">Expenses</p>
                  <p className="text-2xl font-bold">£{financialData.monthlyExpenses}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Savings</p>
                  <p className="text-2xl font-bold">£{financialData.savings}</p>
                </div>
              </div>

              <h3 className="text-lg font-medium mb-2">Recent Transactions</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Merchant</th>
                      <th className="text-left py-2">Category</th>
                      <th className="text-left py-2">Date</th>
                      <th className="text-right py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialData.recentTransactions.slice(0, 5).map((tx) => (
                      <tr key={tx.id} className="border-b hover:bg-gray-50">
                        <td className="py-2">{tx.merchant}</td>
                        <td className="py-2">{tx.category}</td>
                        <td className="py-2">{new Date(tx.date).toLocaleDateString()}</td>
                        <td className="py-2 text-right font-medium">£{tx.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button 
                className="flex-1 bg-primary-700 hover:bg-primary-800"
                onClick={() => alert("This feature would activate voice input in the full app.")}
              >
                <FaMicrophoneAlt className="mr-2" /> Voice Command
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => alert("Feature implementation in progress.")}
              >
                <FaWallet className="mr-2" /> Set Budget Limit
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DemoMode;