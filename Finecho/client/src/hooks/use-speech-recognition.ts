import { useState, useEffect, useCallback, useRef } from 'react';

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionHookProps {
  onResult?: (transcript: string) => void;
  onEnd?: () => void;
  language?: string;
  continuous?: boolean;
}

interface SpeechRecognitionHookReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  hasRecognitionSupport: boolean;
}

// Get appropriate Speech Recognition implementation based on browser
const SpeechRecognition = 
  window.SpeechRecognition || 
  window.webkitSpeechRecognition || 
  window.mozSpeechRecognition || 
  window.msSpeechRecognition;

export const useSpeechRecognition = ({
  onResult,
  onEnd,
  language = 'en-US',
  continuous = false
}: SpeechRecognitionHookProps = {}): SpeechRecognitionHookReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const hasRecognitionSupport = !!SpeechRecognition;

  // Initialize recognition instance
  useEffect(() => {
    if (!hasRecognitionSupport) return;

    // Create new instance
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    // Configure recognition
    recognition.continuous = continuous;
    recognition.interimResults = false;
    recognition.lang = language;

    // Event handlers
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const transcript = result[0].transcript;
      
      setTranscript(transcript);
      
      if (onResult) {
        onResult(transcript);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      
      if (onEnd) {
        onEnd();
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (onEnd) {
        onEnd();
      }
    };

    // Clean up on unmount
    return () => {
      if (recognition && isListening) {
        recognition.stop();
      }
    };
  }, [hasRecognitionSupport, language, continuous, onResult, onEnd, isListening]);

  // Start listening
  const startListening = useCallback(() => {
    if (!hasRecognitionSupport || isListening) return;

    try {
      recognitionRef.current.start();
      setIsListening(true);
      setTranscript('');
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  }, [hasRecognitionSupport, isListening]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (!hasRecognitionSupport || !isListening) return;

    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  }, [hasRecognitionSupport, isListening]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasRecognitionSupport
  };
};