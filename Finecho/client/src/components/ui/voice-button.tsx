import { FaMicrophone } from "react-icons/fa";

interface VoiceButtonProps {
  isListening: boolean;
  onClick: () => void;
}

const VoiceButton = ({ isListening, onClick }: VoiceButtonProps) => {
  return (
    <div className="voice-container relative">
      {isListening && <div className="voice-pulse absolute inset-0 rounded-full"></div>}
      <button 
        className={`h-16 w-16 rounded-full ${isListening ? 'bg-red-600' : 'bg-primary-600'} text-white flex items-center justify-center shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 ease-in-out`}
        onClick={onClick}
      >
        <FaMicrophone className="h-8 w-8" />
      </button>
    </div>
  );
};

export default VoiceButton;
