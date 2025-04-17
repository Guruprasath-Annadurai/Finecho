// Polyfill for browsers that don't support the Web Speech API
// This should be imported before any usage of SpeechRecognition

// Augment the window object with our missing Speech interfaces
// This is just a type declaration, not an actual implementation
if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
  console.warn("SpeechRecognition is not supported in this browser. Voice features may not work.");
  
  // Create a no-op placeholder for environments without Speech API
  class SpeechRecognitionPolyfill {
    constructor() {
      this.lang = 'en-US';
      this.continuous = false;
      this.interimResults = false;
      this.maxAlternatives = 1;
    }
    
    start() {
      // Simulate an error after a slight delay
      setTimeout(() => {
        if (this.onerror) {
          this.onerror({ error: 'not-supported', message: 'Speech recognition not supported' });
        }
        if (this.onend) {
          this.onend();
        }
      }, 100);
    }
    
    stop() {
      if (this.onend) {
        this.onend();
      }
    }
    
    abort() {
      if (this.onend) {
        this.onend();
      }
    }
  }
  
  // Assign polyfill to window
  window.SpeechRecognition = SpeechRecognitionPolyfill;
  window.webkitSpeechRecognition = SpeechRecognitionPolyfill;
}

// Export nothing - this file is only for its side effects
export {};