import { useState, useEffect } from "react";
import { FaMicrophoneAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const SplashScreen = () => {
  const [showDebugOptions, setShowDebugOptions] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState("Checking...");
  
  // Check Firebase configuration
  useEffect(() => {
    const checkFirebaseConfig = () => {
      const hasFirebaseConfig = 
        import.meta.env.VITE_FIREBASE_API_KEY &&
        import.meta.env.VITE_FIREBASE_PROJECT_ID &&
        import.meta.env.VITE_FIREBASE_APP_ID;
      
      setFirebaseStatus(hasFirebaseConfig 
        ? "Firebase configured with API keys ✓" 
        : "Firebase keys missing ✗");
    };
    
    checkFirebaseConfig();
  }, []);
  
  // Animation variants for the elements
  const logoVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut" 
      }
    }
  };
  
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.3, 
        duration: 0.6,
        ease: "easeOut" 
      }
    }
  };
  
  const subtextVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delay: 0.6, 
        duration: 0.8 
      }
    }
  };

  const handleActivateDemoMode = () => {
    // Navigate to the demo page with setLocation (safer with React Router)
    setLocation("/demo");
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
      <div className="text-center flex flex-col items-center">
        <motion.div 
          className="flex justify-center mb-6"
          initial="hidden"
          animate="visible"
          variants={logoVariants}
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-ping bg-white/30 rounded-full h-16 w-16" />
            </div>
            <FaMicrophoneAlt className="text-6xl text-white relative z-10" />
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80"
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          FinEcho
        </motion.h1>
        
        <motion.p 
          className="text-xl text-white/90 font-light mb-8"
          initial="hidden"
          animate="visible"
          variants={subtextVariants}
        >
          Your Voice-First AI Financial Assistant
        </motion.p>
        
        {/* Debug options button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <Button 
            variant="outline" 
            size="sm"
            className="border-white/30 text-white/70 hover:text-white hover:bg-white/10"
            onClick={handleActivateDemoMode}
          >
            Skip to Demo Mode
          </Button>
          
          <div className="mt-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs text-white/50 hover:text-white/80"
              onClick={() => setShowDebugOptions(!showDebugOptions)}
            >
              {showDebugOptions ? "Hide Diagnostics" : "Show Diagnostics"}
            </Button>
          </div>
          
          {showDebugOptions && (
            <div className="mt-4 p-4 bg-black/20 rounded-md text-left">
              <h3 className="text-sm font-medium mb-2">Configuration Status:</h3>
              <ul className="text-xs space-y-1">
                <li className={firebaseStatus.includes("✓") ? "text-green-300" : "text-yellow-300"}>
                  {firebaseStatus}
                </li>
                <li className="text-green-300">
                  Application server running ✓
                </li>
              </ul>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;