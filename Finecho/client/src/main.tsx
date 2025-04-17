import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import App from "./App";
import "./index.css";

// Custom font from design reference
import "@/lib/speech-polyfill.js";

// Simple error-catching component to ensure something renders
function SafeApp() {
  const [error, setError] = useState<Error | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      // Check for Firebase config
      const hasFirebaseConfig = 
        import.meta.env.VITE_FIREBASE_API_KEY &&
        import.meta.env.VITE_FIREBASE_PROJECT_ID &&
        import.meta.env.VITE_FIREBASE_APP_ID;
      
      console.log("Firebase config status:", hasFirebaseConfig ? "Available" : "Missing");
      
      // Mark as loaded
      setIsLoaded(true);
    } catch (e) {
      console.error("Error during initialization:", e);
      setError(e instanceof Error ? e : new Error(String(e)));
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 className="text-red-600 text-xl font-bold mb-4">Application Error</h2>
          <p className="text-gray-800 mb-4">
            An error occurred while initializing the application:
          </p>
          <div className="bg-gray-100 p-3 rounded border border-gray-300 mb-4 overflow-auto">
            <code className="text-sm text-red-700">{error.message}</code>
          </div>
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

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading FinEcho...</p>
        </div>
      </div>
    );
  }

  // Only render App when all checks pass
  return <App />;
}

// Use the safe wrapper around our App
createRoot(document.getElementById("root")!).render(<SafeApp />);
