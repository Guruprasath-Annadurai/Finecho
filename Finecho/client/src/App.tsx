import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import SplashScreen from "@/pages/SplashScreen";
import Dashboard from "@/pages/Dashboard";
import VoiceInput from "@/pages/VoiceInput";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import DemoMode from "@/pages/DemoMode";
import NotFound from "@/pages/not-found";

// A simplified app with direct routes

// Protected route component - only checks for user authentication
const ProtectedRoute = ({ component: Component }: { component: React.ComponentType }) => {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      setLocation("/login");
    }
  }, [user, loading, setLocation]);
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // Only render if user is authenticated
  return user ? <Component /> : null;
};

function Router() {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth();

  // Simpler routing logic
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/voice">
        <ProtectedRoute component={VoiceInput} />
      </Route>
      <Route path="/profile">
        <ProtectedRoute component={Profile} />
      </Route>
      <Route path="/demo" component={DemoMode} />
      <Route path="/" component={SplashScreen} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Add error boundary functionality
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Catch global errors
    const handleError = (event: ErrorEvent) => {
      console.error("Global error caught:", event.error);
      setHasError(true);
      setErrorMessage(event.error?.message || "An unknown error occurred");
      
      // Prevent the error from being hidden
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  // If we caught an error, show it to help with debugging
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 className="text-red-600 text-xl font-bold mb-4">Application Error</h2>
          <p className="text-gray-800 mb-4">
            An error occurred while loading the application:
          </p>
          <div className="bg-gray-100 p-3 rounded border border-gray-300 mb-4 overflow-auto">
            <code className="text-sm text-red-700">{errorMessage}</code>
          </div>
          <p className="text-gray-600 text-sm">
            Please check the browser console for more details or try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Normal app rendering
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
