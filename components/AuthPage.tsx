import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { ShieldCheck, MapPin, Loader2, Building2, User, ArrowRight, Mail, Lock, Info, PlayCircle } from 'lucide-react';

interface AuthPageProps {
  onLogin: (user: UserProfile, coords?: {lat: number, lng: number}) => void;
  onCancel: () => void;
  onDemo: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onCancel, onDemo }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<UserRole>('citizen');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [detectedCoords, setDetectedCoords] = useState<{lat: number, lng: number} | undefined>(undefined);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    orgName: '', // New field for Organization Name
    email: '',
    password: '',
    country: '',
    state: '', // City/Region
    lga: ''    // Town/District
  });

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Store detected coords for later use on submit
          setDetectedCoords({ lat: latitude, lng: longitude });

          // Use OpenStreetMap Nominatim for free reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          if (data && data.address) {
            setFormData(prev => ({
              ...prev,
              country: data.address.country || '',
              state: data.address.state || data.address.city || data.address.region || '',
              lga: data.address.town || data.address.suburb || data.address.city_district || data.address.county || ''
            }));
          }
        } catch (error) {
          console.error("Failed to fetch location details", error);
          alert("Could not auto-detect address details. Please fill manually.");
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Location permission denied", error);
        setLoadingLocation(false);
        alert("Please allow location access to use this feature.");
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulating authentication
    const user: UserProfile = {
      id: `user-${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name || (isSignUp ? 'New User' : 'Demo User'),
      organizationName: role === 'organization' ? formData.orgName : undefined,
      email: formData.email,
      role: role,
      location: {
        country: formData.country || 'Nigeria',
        state: formData.state || 'Kebbi',
        lga: formData.lga || '' // Empty LGA means State/Federal level access
      }
    };

    // Save to local storage for persistence
    localStorage.setItem('civic_user', JSON.stringify(user));
    
    // Pass user and detected coords (if any) to App
    onLogin(user, detectedCoords);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200">
        
        {/* Left Side - Visual */}
        <div className="bg-slate-900 text-white p-12 md:w-5/12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
             <svg className="h-full w-full" width="100%" height="100%">
               <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                 <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
               </pattern>
               <rect width="100%" height="100%" fill="url(#grid)"></rect>
             </svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-8">
              <div className="bg-blue-600 p-2 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">CivifyAI</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">
              {isSignUp ? "Join the Movement." : "Welcome Back."}
            </h2>
            <p className="text-slate-400 leading-relaxed">
              {isSignUp 
                ? "Create an account to report issues, track progress, or manage civic operations for your community." 
                : "Log in to continue improving your community."}
            </p>
          </div>

          <div className="relative z-10 mt-12">
            <button onClick={onCancel} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center">
               &larr; Back to Home
            </button>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12 md:w-7/12 overflow-y-auto max-h-[90vh]">
          <div className="flex justify-end mb-6">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {isSignUp ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Role Selection (Only for Sign Up) */}
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setRole('citizen')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center text-center transition-all ${
                    role === 'citizen' 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-slate-100 hover:border-slate-300 text-slate-500'
                  }`}
                >
                  <User className={`w-6 h-6 mb-2 ${role === 'citizen' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="font-bold text-sm">Individual</span>
                  <span className="text-xs mt-1 opacity-75">Submit & Track Reports</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('organization')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center text-center transition-all ${
                    role === 'organization' 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-slate-100 hover:border-slate-300 text-slate-500'
                  }`}
                >
                  <Building2 className={`w-6 h-6 mb-2 ${role === 'organization' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="font-bold text-sm">Organization</span>
                  <span className="text-xs mt-1 opacity-75">View Dashboard & Act</span>
                </button>
              </div>
            )}

            {isSignUp && (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder={role === 'organization' ? "Admin Name" : "Your Name"}
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                {/* Organization Name Field - VISIBLE ONLY FOR ORGANIZATION */}
                {role === 'organization' && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Organization Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        required
                        className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g., Kebbi State Ministry of Works"
                        value={formData.orgName}
                        onChange={e => setFormData({...formData, orgName: e.target.value})}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  required
                  className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  required
                  className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {/* Location Section */}
            {isSignUp && (
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-4">
                <div className="flex justify-between items-center mb-4">
                   <div className="flex items-center space-x-2">
                     <MapPin className="w-4 h-4 text-slate-500" />
                     <label className="text-sm font-bold text-slate-700">
                       {role === 'organization' ? 'Jurisdiction Scope' : 'Your Location'}
                     </label>
                   </div>
                   <button
                     type="button"
                     onClick={detectLocation}
                     disabled={loadingLocation}
                     className={`text-xs flex items-center px-3 py-1.5 rounded-full transition-colors font-semibold ${detectedCoords ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                   >
                     {loadingLocation ? <Loader2 className="w-3 h-3 animate-spin mr-1"/> : null}
                     {loadingLocation ? "Detecting..." : detectedCoords ? "Location Detected" : "Auto-Detect"}
                   </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                   <div className="col-span-2">
                     <input 
                       type="text" 
                       placeholder="Country (e.g., Nigeria)"
                       className="w-full p-2 text-sm border rounded bg-white outline-none focus:ring-1 focus:ring-blue-400"
                       value={formData.country}
                       onChange={e => setFormData({...formData, country: e.target.value})}
                       required={role === 'organization'}
                     />
                   </div>
                   <div>
                     <input 
                       type="text" 
                       placeholder="State / City / Region"
                       className="w-full p-2 text-sm border rounded bg-white outline-none focus:ring-1 focus:ring-blue-400"
                       value={formData.state}
                       onChange={e => setFormData({...formData, state: e.target.value})}
                       required={role === 'organization'}
                     />
                   </div>
                   <div>
                     <input 
                       type="text" 
                       placeholder="Town / District (Optional)"
                       className="w-full p-2 text-sm border rounded bg-white outline-none focus:ring-1 focus:ring-blue-400"
                       value={formData.lga}
                       onChange={e => setFormData({...formData, lga: e.target.value})}
                       // LGA is OPTIONAL for organizations (to allow State-wide access)
                       required={role === 'organization' ? false : false} 
                     />
                   </div>
                </div>
                
                {role === 'organization' && (
                  <div className="flex items-start mt-2 text-amber-700 bg-amber-50 p-2 rounded text-xs">
                    <Info className="w-3 h-3 mr-1 mt-0.5 shrink-0" />
                    <p>Tip: Leave "Town" blank to access reports from ALL towns in the selected State/Region.</p>
                  </div>
                )}
                
                {role === 'citizen' && (
                  <p className="text-xs text-slate-400 mt-2 ml-1">
                    * Used to show you reports near your area.
                  </p>
                )}
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
            >
              <span>{isSignUp ? "Create Account" : "Log In"}</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>

             {/* Demo Divider */}
             <div className="flex items-center space-x-4 my-4">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-xs text-slate-400 uppercase font-bold">Or</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <button 
              type="button"
              onClick={onDemo}
              className="w-full py-3 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all flex items-center justify-center space-x-2"
            >
              <PlayCircle className="w-5 h-5 text-slate-500" />
              <span>Use Demo Without Login</span>
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;