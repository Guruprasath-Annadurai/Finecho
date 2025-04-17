import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { AuthError } from "@/components/ui/auth-error";
// Direct route to demo page

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isConfigMissing, setIsConfigMissing] = useState(false);
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();
  const [, setLocation] = useLocation();

  // Check if Firebase configuration is available
  useEffect(() => {
    const hasFirebaseConfig = 
      import.meta.env.VITE_FIREBASE_API_KEY &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID &&
      import.meta.env.VITE_FIREBASE_APP_ID;
      
    setIsConfigMissing(!hasFirebaseConfig);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please provide both email and password",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isRegister) {
        await signUp(email, password);
        toast({
          title: "Account Created",
          description: "Welcome to FinEcho! Your account has been created successfully."
        });
      } else {
        await signIn(email, password);
        toast({
          title: "Welcome Back",
          description: "You've successfully logged in to FinEcho."
        });
      }
      
      // Redirect to Dashboard after successful login/registration
      setLocation("/dashboard");
    } catch (error: any) {
      console.error("Authentication error:", error);
      
      // Set error state for display in AuthError component
      setError(error.code || error.message || "unknown-error");
      
      toast({
        title: "Authentication Error",
        description: "Please check the form for details",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Skip authentication in demo mode
  const handleDemoLogin = () => {
    toast({
      title: "Demo Mode Activated",
      description: "You're now using FinEcho in demo mode with sample data."
    });
    
    // Navigate directly to the demo page
    setLocation("/demo");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isRegister ? "Create an Account" : "Welcome to FinEcho"}
          </CardTitle>
          <CardDescription>
            {isRegister 
              ? "Sign up to start managing your finances with FinEcho" 
              : "Your voice-first AI financial assistant"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isConfigMissing && (
            <Alert className="mb-6 bg-amber-50 border-amber-200">
              <InfoIcon className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Firebase Configuration Missing</AlertTitle>
              <AlertDescription className="text-amber-700">
                Firebase authentication is not configured. Please use Demo Mode to explore the app.
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleAuth} className="space-y-4">
            {error && <AuthError error={error} />}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isConfigMissing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isConfigMissing}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || isConfigMissing}
            >
              {isLoading ? (
                "Processing..."
              ) : isRegister ? (
                "Sign Up"
              ) : (
                "Log In"
              )}
            </Button>
            
            {!isConfigMissing && (
              <div className="text-center text-sm mt-4">
                <button
                  type="button"
                  className="text-primary hover:underline focus:outline-none"
                  onClick={() => setIsRegister(!isRegister)}
                >
                  {isRegister 
                    ? "Already have an account? Log in" 
                    : "Don't have an account? Sign up"}
                </button>
              </div>
            )}
          </form>
          
          <div className="mt-6 pt-6 border-t">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleDemoLogin}
            >
              Try Demo Mode
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              No account required. Experience the app with sample data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;