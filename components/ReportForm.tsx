
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Image as ImageIcon, MapPin, Send, Loader2, StopCircle, X, ShieldAlert, CheckCircle, Edit3 } from 'lucide-react';
import { AnalysisInput, AIAnalysisResponse, Urgency } from '../types';
import { analyzeCivicInput } from '../services/geminiService';

interface ReportFormProps {
  onSubmit: (finalData: { description: string; analysis: AIAnalysisResponse; location: any }) => Promise<void>;
  isSubmitting: boolean;
}

const ReportForm: React.FC<ReportFormProps> = ({ onSubmit, isSubmitting }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [location, setLocation] = useState({ address: '', lga: '', state: '', lat: 0, lng: 0 });
  
  // AI Assistive States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AIAnalysisResponse | null>(null);
  const [editedDescription, setEditedDescription] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          setLocation({
            address: data.display_name,
            lga: data.address.town || data.address.suburb || data.address.county || '',
            state: data.address.state || '',
            lat: latitude,
            lng: longitude
          });
        } catch (e) {
          console.warn("Reverse geocoding failed");
          setLocation(prev => ({ ...prev, lat: latitude, lng: longitude }));
        }
      });
    }
  }, []);

  const handleInitialProcess = async () => {
    if (!text && !image && !audioBlob) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeCivicInput({ text, image, audio: audioBlob, userLocation: location.address });
      setAiSuggestion(result);
      setEditedDescription(result.suggested_description);
    } catch (e) {
      alert("AI analysis failed. Please type your report manually.");
      setEditedDescription(text);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = () => setAudioBlob(new Blob(chunks, { type: 'audio/mp3' }));
    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const resetForm = () => {
    setText('');
    setImage(null);
    setAudioBlob(null);
    setAiSuggestion(null);
    setEditedDescription('');
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
      <div className="p-8 bg-slate-900 text-white">
        <h2 className="text-2xl font-black">Submit a Report</h2>
        <p className="text-slate-400 text-sm">Citizen-led reporting for a better Nigeria.</p>
      </div>

      <div className="p-8 space-y-6">
        {!aiSuggestion ? (
          <>
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Describe the issue</label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="What is happening? (e.g. Broken pipe in Ikeja, flood on 3rd Mainland bridge)"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all h-32 text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all ${isRecording ? 'bg-red-50 border-red-300 text-red-600 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-400 hover:bg-blue-50'}`}
              >
                {isRecording ? <StopCircle className="w-8 h-8 mb-2" /> : <Mic className="w-8 h-8 mb-2" />}
                <span className="text-xs font-bold uppercase">{isRecording ? "Stop Recording" : audioBlob ? "Voice Recorded" : "Voice Message"}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all ${image ? 'bg-emerald-50 border-emerald-300 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-400 hover:bg-blue-50'}`}
              >
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} />
                <ImageIcon className="w-8 h-8 mb-2" />
                <span className="text-xs font-bold uppercase">{image ? "Image Selected" : "Attach Photo"}</span>
              </button>
            </div>

            <button
              onClick={handleInitialProcess}
              disabled={isAnalyzing || (!text && !image && !audioBlob)}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg flex items-center justify-center space-x-3 shadow-xl shadow-blue-600/20 hover:bg-blue-700 disabled:bg-slate-300"
            >
              {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
              <span>{isAnalyzing ? "Analyzing..." : "Review Report"}</span>
            </button>
          </>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl relative">
              <button onClick={() => setAiSuggestion(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-4 h-4"/></button>
              <div className="flex items-center space-x-2 text-blue-700 mb-3">
                <CheckCircle className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">AI Assisted Report</span>
              </div>
              <textarea
                value={editedDescription}
                onChange={e => setEditedDescription(e.target.value)}
                className="w-full bg-white p-4 rounded-xl border border-blue-200 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 outline-none h-24"
              />
              <p className="text-[10px] text-blue-500 mt-2 italic font-medium">* You can edit the AI-suggested description above.</p>
            </div>

            {aiSuggestion.is_high_risk && aiSuggestion.safety_advice && (
              <div className="flex items-start p-4 bg-red-50 border border-red-100 rounded-2xl">
                <ShieldAlert className="w-5 h-5 text-red-600 mr-3 shrink-0" />
                <div>
                  <span className="text-xs font-black text-red-700 uppercase tracking-wider block mb-1">Critical Safety Advice</span>
                  <p className="text-sm text-slate-800 font-bold leading-snug">{aiSuggestion.safety_advice}</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
              <div className="flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Location Details</span>
                <span className="text-sm font-bold text-slate-800">{location.address || "Detecting..."}</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={resetForm}
                className="flex-1 py-4 text-slate-600 bg-slate-100 rounded-2xl font-bold"
              >
                Discard
              </button>
              <button
                onClick={() => onSubmit({ description: editedDescription, analysis: aiSuggestion, location })}
                disabled={isSubmitting}
                className="flex-[2] py-4 bg-blue-900 text-white rounded-2xl font-black flex items-center justify-center space-x-2 shadow-xl shadow-blue-900/20"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                <span>Final Submit</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportForm;
