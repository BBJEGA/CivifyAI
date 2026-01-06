
import React from 'react';
import { ArrowRight, Brain, Languages, LayoutDashboard, Globe, Send, Cpu, BarChart3, ShieldCheck, PlayCircle, Mic, MapPin, FileText, AlertTriangle, Users, Building2 } from 'lucide-react';

interface LandingPageProps {
  onLaunch: () => void;
  onDemo: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLaunch, onDemo }) => {
  
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-cyan-200">
      
      {/* Navigation */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-200 transition-all">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-900 p-2 rounded-lg shadow-lg shadow-blue-900/20">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">CivicLink</span>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-blue-700 transition-colors cursor-pointer">Capabilities</a>
            <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="hover:text-blue-700 transition-colors cursor-pointer">How It Works</a>
            <a href="#audience" onClick={(e) => scrollToSection(e, 'audience')} className="hover:text-blue-700 transition-colors cursor-pointer">Who It's For</a>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onLaunch}
              className="bg-blue-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-800 transition-all hover:shadow-lg hover:shadow-blue-900/20 flex items-center"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden relative bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-cyan-50 border border-cyan-100 rounded-full px-4 py-1.5 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></span>
                <span className="text-sm font-bold text-cyan-800 tracking-wide uppercase">AI-Powered Governance • Nigeria</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                CivicLink – Smarter Reporting for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-500">Stronger Communities</span>.
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
                An AI-powered assistant for Nigeria that transforms citizen reports into structured insights for local governments. Connect issues to action instantly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button 
                  onClick={onLaunch}
                  className="w-full sm:w-auto px-10 py-5 bg-blue-900 text-white rounded-full font-bold text-lg hover:bg-blue-800 transition-all shadow-xl hover:shadow-blue-900/20 flex items-center justify-center gap-3 group"
                >
                  <span>Launch Portal</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            
            {/* Hero Visual */}
            <div className="lg:w-1/2 relative w-full perspective-1000">
              <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-[100px] opacity-60"></div>
              
              <div className="relative bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 transform rotate-y-12 hover:rotate-0 transition-transform duration-1000 ease-out">
                 <div className="flex justify-between items-center mb-8">
                    <div className="flex space-x-2">
                       <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                       <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">System Operational</div>
                 </div>

                 <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4 items-start">
                       <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                          <Mic className="w-5 h-5" />
                       </div>
                       <div>
                          <div className="h-2 w-20 bg-slate-200 rounded mb-2"></div>
                          <div className="h-2 w-48 bg-slate-100 rounded mb-1"></div>
                          <div className="h-2 w-32 bg-slate-100 rounded"></div>
                       </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-l-red-500 border-y border-r border-slate-100 flex gap-4 items-start scale-105 transform">
                       <div className="p-3 bg-red-50 text-red-600 rounded-lg shrink-0">
                          <AlertTriangle className="w-5 h-5" />
                       </div>
                       <div className="w-full">
                          <div className="flex justify-between items-center mb-1">
                             <span className="text-xs font-bold text-slate-800">High Urgency Detected</span>
                             <span className="text-xs text-red-500 font-bold">Nigeria Local</span>
                          </div>
                          <p className="text-sm text-slate-600 font-medium">Lagos Island structural hazard reported.</p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section id="features" className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Localized Intelligence</h2>
            <p className="text-lg text-slate-500">Built specifically for the Nigerian civic landscape.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Brain className="w-6 h-6 text-white" />}
              title="Voice & Image Parsing"
              desc="Record in Pidgin or local languages; our AI transcribes and understands the civic context."
              iconBg="bg-blue-600"
            />
            <FeatureCard 
              icon={<LayoutDashboard className="w-6 h-6 text-white" />}
              title="State-Level Hierarchy"
              desc="Automatic mapping to the 36 states and 774 Local Government Areas."
              iconBg="bg-cyan-600"
            />
            <FeatureCard 
              icon={<MapPin className="w-6 h-6 text-white" />}
              title="Hyper-Local Geocoding"
              desc="Detects coordinates and maps them to Nigerian street addresses instantly."
              iconBg="bg-emerald-600"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <ShieldCheck className="w-6 h-6 text-cyan-500" />
            <span className="text-lg font-bold text-white">CivicLink Nigeria</span>
          </div>
          
          <div className="text-sm font-medium">
             Unified Civic Portal
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, iconBg }: { icon: React.ReactNode, title: string, desc: string, iconBg: string }) => (
  <div className="p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all bg-white group hover:-translate-y-1">
    <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/5 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
  </div>
);

export default LandingPage;
