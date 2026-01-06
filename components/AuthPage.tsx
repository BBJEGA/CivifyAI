
import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { ShieldCheck, MapPin, Loader2, Building2, User, ArrowRight, Mail, Lock, ChevronDown } from 'lucide-react';
import { NIGERIA_STATES, STATE_LGAS } from '../data/nigeria';

interface AuthPageProps {
  onLogin: (user: UserProfile) => void;
  onCancel: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onCancel }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<UserRole>('citizen');
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    orgName: '',
    email: '',
    password: '',
    state: '',
    lga: ''
  });

  const availableLGAs = formData.state ? (STATE_LGAS[formData.state] || ["General"]) : [];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate backend auth
    await new Promise(r => setTimeout(r, 1200));

    const user: UserProfile = {
      uid: `uid-${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name,
      organizationName: role === 'organization' ? formData.orgName : undefined,
      email: formData.email,
      role: role,
      location: {
        state: formData.state || 'Lagos',
        lga: formData.lga || 'Ikeja'
      }
    };

    setIsLoading(false);
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200">
        
        {/* Branding Side */}
        <div className="bg-[#1e3a8a] text-white p-10 md:p-12 md:w-5/12 flex flex-col justify-between relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <svg width="100%" height="100%"><pattern id="p" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="white"/></pattern><rect width="100%" height="100%" fill="url(#p)"/></svg>
          </div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-12">
              <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter">CivicLink</span>
            </div>
            <h2 className="text-4xl font-black mb-6 leading-tight">Empowering Nigerian Voices.</h2>
            <p className="text-blue-100 text-lg font-medium leading-relaxed opacity-90">
              Join the official platform for reporting infrastructure and safety issues directly to local authorities.
            </p>
          </div>
          <button onClick={onCancel} className="relative z-10 text-sm font-bold text-blue-300 hover:text-white transition-colors py-4">
            ← Back to Public Portal
          </button>
        </div>

        {/* Form Side */}
        <div className="p-8 md:p-12 md:w-7/12 overflow-y-auto max-h-[90vh]">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-3xl font-black text-slate-900">{isSignUp ? "Create Account" : "Sign In"}</h3>
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm font-bold text-blue-600 hover:underline">
              {isSignUp ? "Already have an account?" : "Need an account?"}
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('citizen')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'citizen' ? 'border-blue-600 bg-blue-50 text-blue-700 font-black' : 'border-slate-100 text-slate-400 font-bold'}`}
                >
                  <User className="w-6 h-6" />
                  <span className="text-[10px] uppercase tracking-widest">Citizen</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('organization')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'organization' ? 'border-blue-600 bg-blue-50 text-blue-700 font-black' : 'border-slate-100 text-slate-400 font-bold'}`}
                >
                  <Building2 className="w-6 h-6" />
                  <span className="text-[10px] uppercase tracking-widest">Organization</span>
                </button>
              </div>
            )}

            <div className="space-y-5">
              {isSignUp && (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                  <input 
                    required 
                    type="text"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800"
                    placeholder="John Obi"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              )}

              {isSignUp && role === 'organization' && (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Org / Dept Name</label>
                  <input 
                    required 
                    type="text"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800"
                    placeholder="Lagos Ministry of Works"
                    value={formData.orgName}
                    onChange={e => setFormData({...formData, orgName: e.target.value})}
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                <input 
                  required 
                  type="email"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800"
                  placeholder="name@civiclink.ng"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                <input 
                  required 
                  type="password"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>

              {isSignUp && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">State</label>
                    <div className="relative">
                      <select 
                        required
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl appearance-none outline-none font-bold text-slate-700 focus:ring-4 focus:ring-blue-100"
                        value={formData.state}
                        onChange={e => setFormData({...formData, state: e.target.value, lga: ''})}
                      >
                        <option value="">Select State</option>
                        {NIGERIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-4.5 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">LGA</label>
                    <div className="relative">
                      <select 
                        required
                        disabled={!formData.state}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl appearance-none outline-none font-bold text-slate-700 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
                        value={formData.lga}
                        onChange={e => setFormData({...formData, lga: e.target.value})}
                      >
                        <option value="">Select LGA</option>
                        {availableLGAs.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-4.5 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button 
              disabled={isLoading}
              className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:bg-slate-300 mt-4"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <span>{isSignUp ? "Create Account" : "Sign In"}</span>}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
