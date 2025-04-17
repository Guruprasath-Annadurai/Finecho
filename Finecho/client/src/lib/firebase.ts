import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Use environment variables for Firebase config
// Note: These values need to be set in the environment
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_PROJECT_ID 
    ? `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com` 
    : undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_PROJECT_ID 
    ? `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com` 
    : undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate Firebase configuration
const isValidConfig = () => {
  const requiredKeys = ['apiKey', 'projectId', 'appId'];
  const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);
  
  if (missingKeys.length > 0) {
    console.warn(`Missing required Firebase configuration keys: ${missingKeys.join(', ')}`);
    return false;
  }
  
  return true;
};

let app;
let auth;

try {
  if (isValidConfig()) {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } else {
    console.error("Firebase initialization skipped due to missing configuration.");
    // Create a non-functional auth object that won't cause fatal errors
    auth = {
      onAuthStateChanged: (callback) => {
        callback(null);
        return () => {};
      },
      currentUser: null,
      signInWithEmailAndPassword: () => Promise.reject(new Error("Firebase not configured")),
      createUserWithEmailAndPassword: () => Promise.reject(new Error("Firebase not configured")),
      signOut: () => Promise.resolve()
    };
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
  // Same fallback as above
  auth = {
    onAuthStateChanged: (callback) => {
      callback(null);
      return () => {};
    },
    currentUser: null,
    signInWithEmailAndPassword: () => Promise.reject(new Error("Firebase not configured")),
    createUserWithEmailAndPassword: () => Promise.reject(new Error("Firebase not configured")),
    signOut: () => Promise.resolve()
  };
}

export { auth };