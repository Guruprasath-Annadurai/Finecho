import { Link, useLocation } from "wouter";
import { Home, DollarSign, BarChart3, User, MicOff } from "lucide-react";
import VoiceButton from "../ui/voice-button";
import { useState, useCallback } from "react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useToast } from "@/hooks/use-toast";

const MobileNav = () => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [listening, setListening] = useState(false);

  const handleVoiceResult = useCallback((result: string) => {
    // Process voice command
    const command = result.toLowerCase();
    if (command.includes("dashboard")) {
      setLocation("/dashboard");
    } else if (command.includes("transaction")) {
      setLocation("/transactions");
    } else if (command.includes("insight")) {
      setLocation("/insights");
    } else if (command.includes("profile")) {
      setLocation("/profile");
    }
  }, [setLocation]);

  const handleVoiceEnd = useCallback(() => {
    setListening(false);
  }, []);

  const { startListening, stopListening, hasRecognitionSupport } = 
    useSpeechRecognition({
      onResult: handleVoiceResult,
      onEnd: handleVoiceEnd
    });

  const toggleListening = () => {
    if (listening) {
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
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
      <div className="grid grid-cols-5 h-16">
        <Link href="/dashboard">
          <div className={`flex flex-col items-center justify-center cursor-pointer ${location === '/dashboard' ? 'text-primary-600' : 'text-gray-500'}`}>
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </div>
        </Link>
        <Link href="/transactions">
          <div className={`flex flex-col items-center justify-center cursor-pointer ${location === '/transactions' ? 'text-primary-600' : 'text-gray-500'}`}>
            <DollarSign className="h-6 w-6" />
            <span className="text-xs mt-1">Transactions</span>
          </div>
        </Link>
        
        {/* Voice Command Button */}
        <Link href="/voice">
          <div className="flex flex-col items-center -mt-5">
            <div className="mb-0">
              <VoiceButton isListening={listening} onClick={toggleListening} />
            </div>
            <span className="text-xs mt-1 text-gray-500">Voice</span>
          </div>
        </Link>
        
        <Link href="/insights">
          <div className={`flex flex-col items-center justify-center cursor-pointer ${location === '/insights' ? 'text-primary-600' : 'text-gray-500'}`}>
            <BarChart3 className="h-6 w-6" />
            <span className="text-xs mt-1">Insights</span>
          </div>
        </Link>
        <Link href="/profile">
          <div className={`flex flex-col items-center justify-center cursor-pointer ${location === '/profile' ? 'text-primary-600' : 'text-gray-500'}`}>
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNav;
