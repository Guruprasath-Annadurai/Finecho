import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AuthErrorProps {
  error: string;
}

/**
 * A component for displaying Firebase authentication related errors
 * Provides user-friendly error messages for common Firebase auth errors
 */
export function AuthError({ error }: AuthErrorProps) {
  if (!error) return null;
  
  const errorMessage = getReadableErrorMessage(error);
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Authentication Error</AlertTitle>
      <AlertDescription>{errorMessage}</AlertDescription>
    </Alert>
  );
}

/**
 * Converts Firebase auth error codes into user-friendly messages
 */
function getReadableErrorMessage(errorCode: string): string {
  switch (errorCode) {
    // Common Firebase Auth errors
    case "auth/email-already-in-use":
      return "This email is already registered. Try logging in instead.";
    case "auth/invalid-email":
      return "Invalid email format. Please enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/user-not-found":
      return "No account found with this email. Please check your email or register.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many unsuccessful login attempts. Please try again later or reset your password.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection and try again.";
    case "auth/internal-error":
      return "An internal error occurred. Please try again later.";
    case "auth/invalid-credential":
      return "The provided credentials are invalid or expired.";
    case "auth/operation-not-allowed":
      return "This login method is not enabled. Please contact support.";
    case "auth/popup-closed-by-user":
      return "Authentication popup was closed before completion. Please try again.";
      
    // Configuration errors
    case "auth/api-key-not-valid.-please-pass-a-valid-api-key.":
      return "The application is not properly configured. Please contact support with error: invalid API key.";
    case "auth/configuration-error":
      return "Firebase authentication is not properly configured. Please contact support.";
    case "auth/missing-api-key":
      return "Authentication configuration is missing. Please contact support.";
      
    // More specific errors
    case "auth/account-exists-with-different-credential":
      return "An account already exists with the same email but different sign-in credentials.";
    case "auth/cancelled-popup-request":
      return "The popup authentication request was cancelled.";
    case "auth/expired-action-code":
      return "The action code has expired. Please request a new one.";
    case "auth/invalid-action-code":
      return "The action code is invalid. This can happen if it's malformed or has already been used.";
    case "auth/invalid-verification-code":
      return "The verification code is invalid. Please try again with the correct code.";
    case "auth/missing-verification-code":
      return "The verification code is missing. Please provide a valid code.";
    case "auth/missing-verification-id":
      return "The verification ID is missing. Please try again.";
    case "auth/quota-exceeded":
      return "Quota exceeded. Please try again later.";
      
    default:
      // Log unknown errors for debugging
      console.error("Unknown Firebase Auth error code:", errorCode);
      return "An error occurred during authentication. Please try again.";
  }
}