import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mic, MicOff, AlertTriangle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useToast } from "@/hooks/use-toast";
import { analyzeFinancialCommand } from "@/lib/openai";

const VoiceInput = () => {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Use our custom Speech Recognition hook
  const { 
    transcript, 
    isListening, 
    startListening, 
    stopListening,
    hasRecognitionSupport 
  } = useSpeechRecognition({
    onEnd: () => {
      console.log("Speech recognition ended");
    }
  });

  // Check if browser supports speech recognition
  useEffect(() => {
    if (!hasRecognitionSupport) {
      setError("Your browser does not support speech recognition. Please try using Chrome, Edge, or Safari.");
    }
  }, [hasRecognitionSupport]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      // Clear previous results when starting new recording
      setResult(null);
      setError("");
      startListening();
    }
  };

  const handleSubmit = async () => {
    if (!transcript) {
      toast({
        title: "No voice input",
        description: "Please record your financial command first.",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    setError("");

    try {
      // In a production app, this would call the backend API
      // For now, we'll use the client-side OpenAI integration
      const analysis = await analyzeFinancialCommand(transcript);
      setResult(analysis);
      
      toast({
        title: "Command Processed",
        description: "Your financial voice command has been analyzed."
      });
    } catch (err: any) {
      console.error("Error processing voice command:", err);
      setError(err.message || "Failed to process your command. Please try again.");
      
      toast({
        title: "Processing Error",
        description: "Failed to analyze your voice command.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDone = () => {
    setLocation("/dashboard");
  };

  const micAnimationVariants = {
    listening: {
      scale: [1, 1.2, 1],
      transition: {
        repeat: Infinity,
        duration: 1.5
      }
    },
    idle: {
      scale: 1
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4 max-w-3xl">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center border-b pb-6">
            <CardTitle className="text-2xl md:text-3xl text-primary">Voice Command</CardTitle>
            <CardDescription>
              Speak your financial command clearly
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 flex flex-col items-center">
            {/* Error message if browser not supported */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Microphone Button */}
            <motion.div 
              className="mb-6"
              variants={micAnimationVariants}
              animate={isListening ? "listening" : "idle"}
            >
              <Button
                size="lg"
                className={`rounded-full w-24 h-24 ${
                  isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary/90'
                }`}
                onClick={handleToggleListening}
                disabled={!hasRecognitionSupport || processing}
              >
                {isListening ? (
                  <MicOff className="h-10 w-10" />
                ) : (
                  <Mic className="h-10 w-10" />
                )}
              </Button>
            </motion.div>
            
            {/* Status Text */}
            <p className="text-center mb-4 text-gray-600">
              {isListening 
                ? "Listening... Speak now" 
                : hasRecognitionSupport 
                  ? "Click the microphone to start" 
                  : "Speech recognition not supported"
              }
            </p>
            
            {/* Transcript Display */}
            {transcript && (
              <div className="w-full bg-gray-50 p-4 rounded-lg mb-6 border">
                <h3 className="font-medium text-gray-700 mb-2">Your command:</h3>
                <p className="text-lg">{transcript}</p>
              </div>
            )}
            
            {/* Result Display */}
            {result && (
              <div className="w-full bg-green-50 p-4 rounded-lg mb-6 border border-green-100">
                <h3 className="font-medium text-green-800 mb-2">Analysis:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-medium">${result.amount || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{result.category || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Merchant</p>
                    <p className="font-medium">{result.merchant || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{result.date || 'Today'}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-4 mt-4 w-full">
              <Button 
                onClick={handleSubmit} 
                disabled={!transcript || isListening || processing}
                className="flex-1"
              >
                {processing ? "Processing..." : "Analyze Command"}
              </Button>
              
              {result && (
                <Button 
                  onClick={handleDone}
                  variant="outline"
                  className="flex-1"
                >
                  Done <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default VoiceInput;