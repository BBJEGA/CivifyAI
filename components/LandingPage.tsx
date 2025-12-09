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
            <span className="text-xl font-bold tracking-tight text-slate-900">CivifyAI</span>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-blue-700 transition-colors cursor-pointer">Capabilities</a>
            <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="hover:text-blue-700 transition-colors cursor-pointer">How It Works</a>
            <a href="#audience" onClick={(e) => scrollToSection(e, 'audience')} className="hover:text-blue-700 transition-colors cursor-pointer">Who It's For</a>
          </div>
          <div className="flex items-center space-x-4">
             <button 
              onClick={onDemo}
              className="hidden md:flex items-center space-x-2 text-slate-600 hover:text-blue-700 font-semibold text-sm transition-colors group"
            >
              <PlayCircle className="w-4 h-4 group-hover:text-cyan-600 transition-colors" />
              <span>Demo Mode</span>
            </button>
            <button 
              onClick={onLaunch}
              className="bg-blue-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-800 transition-all hover:shadow-lg hover:shadow-blue-900/20 flex items-center"
            >
              Launch App
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
                <span className="text-sm font-bold text-cyan-800 tracking-wide uppercase">AI-Powered Governance</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                CivifyAI – Smarter Reporting for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-500">Stronger Communities</span>.
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
                An AI-powered assistant that transforms citizen reports into structured insights for local governments. Connect issues to action instantly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button 
                  onClick={onDemo}
                  className="w-full sm:w-auto px-8 py-4 bg-blue-900 text-white rounded-full font-bold text-lg hover:bg-blue-800 transition-all shadow-xl hover:shadow-blue-900/20 flex items-center justify-center gap-3 group"
                >
                  <PlayCircle className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  Try Demo
                </button>
                <button 
                  onClick={onLaunch}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center hover:border-blue-200"
                >
                  Log In
                </button>
              </div>
            </div>
            
            {/* Hero Visual */}
            <div className="lg:w-1/2 relative w-full perspective-1000">
              <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-[100px] opacity-60"></div>
              
              <div className="relative bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 transform rotate-y-12 hover:rotate-0 transition-transform duration-1000 ease-out">
                 {/* Decorative UI Elements */}
                 <div className="flex justify-between items-center mb-8">
                    <div className="flex space-x-2">
                       <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                       <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">System Operational</div>
                 </div>

                 {/* Mock Report Cards */}
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
                             <span className="text-xs text-red-500 font-bold">98% Match</span>
                          </div>
                          <p className="text-sm text-slate-600 font-medium">Main Street Bridge structural crack reported.</p>
                       </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4 items-start opacity-70">
                       <div className="p-3 bg-purple-50 text-purple-600 rounded-lg shrink-0">
                          <Globe className="w-5 h-5" />
                       </div>
                       <div>
                          <div className="h-2 w-24 bg-slate-200 rounded mb-2"></div>
                          <div className="h-2 w-40 bg-slate-100 rounded"></div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What CivifyAI Does */}
      <section id="features" className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">What CivifyAI Does</h2>
            <p className="text-lg text-slate-500">A complete ecosystem for modern civic engagement and management.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Brain className="w-6 h-6 text-white" />}
              title="Understands Any Input"
              desc="Process text, voice notes, and images seamlessly. Our AI parses meaning from unstructured data."
              iconBg="bg-blue-600"
            />
            <FeatureCard 
              icon={<LayoutDashboard className="w-6 h-6 text-white" />}
              title="Auto-Categorization"
              desc="Automatically detects if an issue is about roads, sanitation, electricity, or safety."
              iconBg="bg-cyan-600"
            />
            <FeatureCard 
              icon={<Languages className="w-6 h-6 text-white" />}
              title="Universal Translation"
              desc="Reports in Hausa, French, or Spanish are instantly translated to English for officials."
              iconBg="bg-indigo-600"
            />
            <FeatureCard 
              icon={<MapPin className="w-6 h-6 text-white" />}
              title="Location Extraction"
              desc="Pinpoints exact coordinates and administrative hierarchies (State, LGA, District) from descriptions."
              iconBg="bg-emerald-600"
            />
            <FeatureCard 
              icon={<FileText className="w-6 h-6 text-white" />}
              title="Smart Summaries"
              desc="Generates clean, professional executive summaries for government dashboards."
              iconBg="bg-violet-600"
            />
            <FeatureCard 
              icon={<AlertTriangle className="w-6 h-6 text-white" />}
              title="Urgency Evaluation"
              desc="Rates incidents as Low, Medium, or High priority to help allocate resources effectively."
              iconBg="bg-red-600"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-slate-200 z-0"></div>

            <StepCard 
              number="1"
              title="Submit Report"
              desc="Citizen sends a voice note, photo, or text describing the issue."
            />
            <StepCard 
              number="2"
              title="AI Analysis"
              desc="CivifyAI structures the data, detects location, and assesses risk."
            />
            <StepCard 
              number="3"
              title="Dashboard"
              desc="Government sees prioritized insights on a live map dashboard."
            />
            <StepCard 
              number="4"
              title="Resolution"
              desc="Teams are deployed faster with clear operational directives."
            />
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section id="audience" className="py-24 bg-white">
        <div className="container mx-auto px-6">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-slate-900">Who It Is For</h2>
           </div>

           <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Card 1: Local Gov */}
              <div className="bg-slate-50 rounded-3xl p-10 border border-slate-100 relative overflow-hidden group hover:shadow-xl transition-shadow">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Building2 className="w-32 h-32 text-blue-900" />
                 </div>
                 <div className="relative z-10">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-900">
                       <Building2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Local Governments</h3>
                    <ul className="space-y-3 text-slate-600">
                       <li className="flex items-start">
                          <ShieldCheck className="w-5 h-5 text-blue-600 mr-2 shrink-0" />
                          <span>Issue mapping & heatmaps</span>
                       </li>
                       <li className="flex items-start">
                          <ShieldCheck className="w-5 h-5 text-blue-600 mr-2 shrink-0" />
                          <span>Automatic prioritization</span>
                       </li>
                       <li className="flex items-start">
                          <ShieldCheck className="w-5 h-5 text-blue-600 mr-2 shrink-0" />
                          <span>Resource allocation analytics</span>
                       </li>
                    </ul>
                 </div>
              </div>

              {/* Card 2: Citizens */}
              <div className="bg-slate-50 rounded-3xl p-10 border border-slate-100 relative overflow-hidden group hover:shadow-xl transition-shadow">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Users className="w-32 h-32 text-cyan-600" />
                 </div>
                 <div className="relative z-10">
                    <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mb-6 text-cyan-700">
                       <Users className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Citizens</h3>
                    <ul className="space-y-3 text-slate-600">
                       <li className="flex items-start">
                          <ShieldCheck className="w-5 h-5 text-cyan-600 mr-2 shrink-0" />
                          <span>Simple, voice-first reporting</span>
                       </li>
                       <li className="flex items-start">
                          <ShieldCheck className="w-5 h-5 text-cyan-600 mr-2 shrink-0" />
                          <span>Instant safety advice</span>
                       </li>
                       <li className="flex items-start">
                          <ShieldCheck className="w-5 h-5 text-cyan-600 mr-2 shrink-0" />
                          <span>Transparent status tracking</span>
                       </li>
                    </ul>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Demo Mode Info Banner */}
      <section className="py-20 bg-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <svg className="h-full w-full" width="100%" height="100%">
             <pattern id="grid-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
               <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
             </pattern>
             <rect width="100%" height="100%" fill="url(#grid-pattern)"></rect>
           </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1 rounded-full text-sm font-bold tracking-wide uppercase mb-6">
            No Sign-up Required
          </div>
          <h2 className="text-4xl font-bold mb-6">Explore the full platform instantly</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Try both the Citizen Reporting interface and the Government Dashboard in our live Demo Mode. Data is temporary and safe to experiment with.
          </p>
          <button 
            onClick={onDemo}
            className="px-10 py-5 bg-cyan-500 text-white rounded-full font-bold text-xl hover:bg-cyan-400 transition-all shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center mx-auto gap-3"
          >
            <PlayCircle className="w-6 h-6" />
            Enter Demo Mode
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <ShieldCheck className="w-6 h-6 text-cyan-500" />
            <span className="text-lg font-bold text-white">CivifyAI</span>
          </div>
          
          <div className="text-sm font-medium">
             Built with <span className="text-white">Google Gemini 3 Pro</span>
          </div>

          <div className="flex space-x-6 mt-4 md:mt-0">
             <a href="#" className="hover:text-white transition-colors">Contact</a>
             <a href="#" className="hover:text-white transition-colors">Twitter</a>
             <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Subcomponents
const FeatureCard = ({ icon, title, desc, iconBg }: { icon: React.ReactNode, title: string, desc: string, iconBg: string }) => (
  <div className="p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all bg-white group hover:-translate-y-1">
    <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/5 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
  </div>
);

const StepCard = ({ number, title, desc }: { number: string, title: string, desc: string }) => (
  <div className="relative z-10 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center group hover:-translate-y-1 transition-transform duration-300">
    <div className="w-12 h-12 bg-white border-2 border-blue-600 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
      {number}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;