import { createContext, useContext, ReactNode } from "react";
import { User } from "firebase/auth";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<User>;
  signIn: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Use our custom Firebase Auth hook
  const auth = useFirebaseAuth();
  
  // The hook returns everything we need
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}