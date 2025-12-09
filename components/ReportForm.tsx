import React, { useState, useRef, useEffect } from 'react';
import { Mic, Image as ImageIcon, MapPin, Send, Loader2, StopCircle, X, MessageCircleQuestion } from 'lucide-react';
import { AnalysisInput } from '../types';

interface ReportFormProps {
  onSubmit: (input: AnalysisInput) => Promise<void>;
  isProcessing: boolean;
  clarificationQuestion?: string | null;
  onCancelClarification?: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ 
  onSubmit, 
  isProcessing, 
  clarificationQuestion,
  onCancelClarification 
}) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [location, setLocation] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-detect location on mount if not in clarification mode
  useEffect(() => {
    if ("geolocation" in navigator && !clarificationQuestion) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        },
        (error) => {
          console.warn("Location access denied or unavailable", error);
        }
      );
    }
  }, [clarificationQuestion]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Timer
      let seconds = 0;
      setRecordingDuration(0);
      timerRef.current = window.setInterval(() => {
        seconds++;
        setRecordingDuration(seconds);
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access is required for voice reports.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text && !image && !audioBlob) {
      alert("Please provide input (Text, Image, or Voice).");
      return;
    }
    
    await onSubmit({
      text,
      image,
      audio: audioBlob,
      userLocation: location
    });

    // Reset form after successful submission
    setText('');
    setImage(null);
    setAudioBlob(null);
    setRecordingDuration(0);
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className={`bg-white rounded-xl shadow-md border overflow-hidden transition-colors ${clarificationQuestion ? 'border-amber-200' : 'border-slate-200'}`}>
      
      {/* Header */}
      <div className={`p-6 border-b ${clarificationQuestion ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
        <h2 className={`text-lg font-semibold ${clarificationQuestion ? 'text-amber-800' : 'text-slate-800'}`}>
          {clarificationQuestion ? 'More Information Needed' : 'Submit a New Report'}
        </h2>
        <p className={`${clarificationQuestion ? 'text-amber-700' : 'text-slate-500'} text-sm mt-1`}>
          {clarificationQuestion || "Describe the issue, upload a photo, or record a voice message. CivifyAI will analyze it instantly."}
        </p>
      </div>

      {/* Clarification Alert Body */}
      {clarificationQuestion && (
        <div className="bg-amber-50 px-6 pb-2">
           <div className="flex items-start space-x-3 text-sm text-amber-800 bg-white/50 p-3 rounded-lg border border-amber-200">
              <MessageCircleQuestion className="w-5 h-5 shrink-0" />
              <span className="font-medium">{clarificationQuestion}</span>
           </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {clarificationQuestion ? "Your Reply" : "Description"}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={clarificationQuestion ? "Type your answer here..." : "Describe the issue... (e.g., 'Large pothole on 5th Avenue')"}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none h-32"
          />
        </div>

        {/* Media Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Audio Recorder */}
          <div className={`border rounded-lg p-4 flex flex-col items-center justify-center transition-colors ${isRecording ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
            <div className="mb-2 text-sm font-medium text-slate-600">
              {isRecording ? `Recording... ${formatDuration(recordingDuration)}` : audioBlob ? "Audio Recorded" : "Voice Report"}
            </div>
            
            {!isRecording && !audioBlob && (
              <button
                type="button"
                onClick={startRecording}
                className="p-4 bg-white rounded-full shadow-sm border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                <Mic className="w-6 h-6 text-slate-600" />
              </button>
            )}

            {isRecording && (
              <button
                type="button"
                onClick={stopRecording}
                className="p-4 bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-colors animate-pulse"
              >
                <StopCircle className="w-6 h-6 text-white" />
              </button>
            )}

            {audioBlob && !isRecording && (
              <div className="flex items-center space-x-3">
                <audio src={URL.createObjectURL(audioBlob)} controls className="h-8 w-32" />
                <button 
                  type="button" 
                  onClick={() => { setAudioBlob(null); setRecordingDuration(0); }}
                  className="p-1 hover:bg-slate-200 rounded-full"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div className="border border-slate-200 bg-slate-50 rounded-lg p-4 flex flex-col items-center justify-center relative">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            
            {image ? (
              <div className="relative w-full h-32 rounded-lg overflow-hidden group">
                <img 
                  src={URL.createObjectURL(image)} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setImage(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center space-y-2 w-full h-full justify-center py-4"
              >
                <div className="p-3 bg-white rounded-full shadow-sm border border-slate-200">
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                </div>
                <span className="text-sm font-medium text-slate-600">Upload Photo</span>
              </button>
            )}
          </div>
        </div>

        {/* Location Input - Hide if asking for location as it is redundant to the clarification question, but keep it available just in case user wants to type it there. Actually, let's keep it but maybe highlight it? */}
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location (e.g., 123 Main St, Springfield)"
            className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${clarificationQuestion && !location ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-300'}`}
          />
        </div>

        {/* Submit Button */}
        <div className="flex space-x-3">
          {clarificationQuestion && (
             <button
             type="button"
             onClick={onCancelClarification}
             className="px-6 py-4 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
           >
             Cancel
           </button>
          )}
          <button
            type="submit"
            disabled={isProcessing}
            className={`flex-1 py-4 rounded-lg font-bold text-white shadow-md flex items-center justify-center space-x-2 transition-all transform active:scale-[0.98] ${
              isProcessing 
                ? 'bg-slate-400 cursor-not-allowed' 
                : clarificationQuestion 
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{clarificationQuestion ? 'Updating...' : 'Analyzing Report...'}</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>{clarificationQuestion ? 'Send Reply' : 'Submit Report'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;