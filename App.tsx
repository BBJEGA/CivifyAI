import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ReportForm from './components/ReportForm';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import ReportCard from './components/ReportCard';
import AuthPage from './components/AuthPage';
import { CivicReport, AnalysisInput, ViewMode, Urgency, UserProfile } from './types';
import { analyzeReport } from './services/geminiService';
import { MapPin, User, Loader2, PlayCircle, Plus } from 'lucide-react';

// --- MOCK DATA SEEDER ---
const SEED_REPORTS: CivicReport[] = [
  // NIGERIA (Kebbi State)
  {
    id: 'seed-ng-1',
    userId: 'user-jega-1',
    issue_type: 'Roads',
    description: 'Deep potholes on the main market road causing accidents.',
    original_text: 'Deep potholes on the main market road',
    original_language: 'English',
    location: 'Central Market Road',
    lga: 'Jega', // Town/LGA
    state: 'Kebbi', // City/State
    country: 'Nigeria',
    region: 'Jega, Kebbi, Nigeria',
    coordinates: { lat: 12.2167, lng: 4.3833 },
    urgency: Urgency.High,
    predicted_escalation: Urgency.High,
    // Dual Actions
    gov_action: 'DEPLOY ROAD MAINTENANCE UNIT TO JEGA MARKET AXIS IMMEDIATELY',
    citizen_action: 'Drive slowly and avoid the center lane near the market entrance.',
    
    timestamp: Date.now() - 10000000,
    status: 'In Progress',
    source_type: 'text',
    upvotes: 12
  },
  {
    id: 'seed-ng-2',
    userId: 'user-aliero-1',
    issue_type: 'Water & Sanitation',
    description: 'No water supply in the university quarters for 3 days.',
    original_text: 'Babu ruwa a jami\'a',
    original_language: 'Hausa',
    location: 'University Quarters',
    lga: 'Aliero', // Town
    state: 'Kebbi', // State
    country: 'Nigeria',
    region: 'Aliero, Kebbi, Nigeria',
    coordinates: { lat: 12.3000, lng: 4.4833 },
    urgency: Urgency.Medium,
    predicted_escalation: Urgency.Medium,
    // Dual Actions
    gov_action: 'DISPATCH WATER TANKERS AND INSPECT PUMPING STATION',
    citizen_action: 'Store available water and boil before drinking until supply is restored.',

    timestamp: Date.now() - 5000000,
    status: 'New',
    source_type: 'voice',
    upvotes: 3
  },
  // NIGERIA (Sokoto State)
  {
    id: 'seed-ng-3',
    userId: 'user-sokoto-1',
    issue_type: 'Electricity',
    description: 'Transformer blown up near Sultan Palace area.',
    original_text: 'Wutar lantarki ta lalace',
    original_language: 'Hausa',
    location: 'Sultan Palace Area',
    lga: 'Bodinga', // Town
    state: 'Sokoto', // State
    country: 'Nigeria',
    region: 'Bodinga, Sokoto, Nigeria',
    coordinates: { lat: 13.0667, lng: 5.2333 },
    urgency: Urgency.High,
    predicted_escalation: Urgency.High,
    // Dual Actions
    gov_action: 'CONTACT PHCN FOR IMMEDIATE TRANSFORMER REPLACEMENT',
    citizen_action: 'Stay clear of the transformer area and disconnect sensitive appliances.',

    timestamp: Date.now() - 2000000,
    status: 'Resolved',
    source_type: 'text',
    upvotes: 5
  },
  // MOROCCO (Rabat)
  {
    id: 'seed-ma-1',
    userId: 'user-rabat-1',
    issue_type: 'Waste Management',
    description: 'Overflowing dumpsters near the Tramway station in Agdal.',
    original_text: 'Poubelles qui débordent près de la station Tramway',
    original_language: 'French',
    location: 'Avenue de France',
    lga: 'Agdal', // District/Town
    state: 'Rabat', // City/Region
    country: 'Morocco',
    region: 'Agdal, Rabat, Morocco',
    coordinates: { lat: 34.000, lng: -6.850 },
    urgency: Urgency.Medium,
    predicted_escalation: Urgency.High,
    // Dual Actions
    gov_action: 'DISPATCH SANITATION CREW TO AGDAL SECTOR',
    citizen_action: 'Avoid walking close to the overflow to prevent health risks.',

    timestamp: Date.now() - 9000000,
    status: 'New',
    source_type: 'text',
    upvotes: 8
  },
  // USA (New York)
  {
    id: 'seed-us-1',
    userId: 'user-ny-1',
    issue_type: 'Safety',
    description: 'Traffic light malfunction at busy intersection.',
    original_text: 'Traffic light stuck on red',
    original_language: 'English',
    location: '5th Ave & 42nd St',
    lga: 'Manhattan', // Borough/Town
    state: 'New York', // State/City
    country: 'USA',
    region: 'Manhattan, New York, USA',
    coordinates: { lat: 40.7580, lng: -73.9855 },
    urgency: Urgency.High,
    predicted_escalation: Urgency.High,
    // Dual Actions
    gov_action: 'ALERT DOT FOR SIGNAL REPAIR AND DEPLOY TRAFFIC CONTROL',
    citizen_action: 'Treat intersection as a 4-way stop and proceed with extreme caution.',

    timestamp: Date.now() - 12000000,
    status: 'New',
    source_type: 'image',
    upvotes: 2
  }
];

const App: React.FC = () => {
  // Navigation State
  const [showLanding, setShowLanding] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [currentView, setCurrentView] = useState<ViewMode>('submit');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showDemoForm, setShowDemoForm] = useState(false);
  
  // User Authentication State
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('civic_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // User Location State (Browser)
  const [userCoordinates, setUserCoordinates] = useState<{lat: number, lng: number} | null>(null);

  const [reports, setReports] = useState<CivicReport[]>(() => {
    try {
      const saved = localStorage.getItem('civic_reports');
      if (saved) {
        return JSON.parse(saved);
      }
      return SEED_REPORTS;
    } catch (error) {
      console.error("Failed to load reports from storage:", error);
      return SEED_REPORTS;
    }
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputHistory, setInputHistory] = useState<AnalysisInput[]>([]);
  const [clarificationQuestion, setClarificationQuestion] = useState<string | null>(null);

  // Persistence - ONLY if NOT in demo mode
  useEffect(() => {
    if (!isDemoMode) {
      localStorage.setItem('civic_reports', JSON.stringify(reports));
    }
  }, [reports, isDemoMode]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('civic_user', JSON.stringify(user));
      // Set default view based on role if just logged in
      if (user.role === 'organization' && currentView !== 'dashboard') setCurrentView('dashboard');
      if (user.role === 'citizen' && currentView === 'dashboard') setCurrentView('submit');
    } else {
      localStorage.removeItem('civic_user');
    }
  }, [user]);

  // Track User Location for "Near Me" - Run once on mount to check if permission already exists
  useEffect(() => {
    if ("geolocation" in navigator && !userCoordinates) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log("Location not available for Near Me features yet")
      );
    }
  }, []);

  const handleLogin = (loggedInUser: UserProfile, coords?: {lat: number, lng: number}) => {
    setUser(loggedInUser);
    
    // If we got coordinates from the auth page (auto-detect), use them immediately
    if (coords) {
      setUserCoordinates(coords);
    }

    setShowAuth(false);
    setShowLanding(false); // Ensure landing is hidden
    setIsDemoMode(false);
    
    if (loggedInUser.role === 'organization') {
      setCurrentView('dashboard');
    } else {
      setCurrentView('submit');
    }
  };

  const handleEnterDemo = () => {
    setIsDemoMode(true);
    setShowLanding(false);
    setShowAuth(false);
    setUser(null);
    setReports([...SEED_REPORTS]); // Reset to seed data for clean demo session
  };

  const handleLogout = () => {
    setUser(null);
    setIsDemoMode(false);
    setShowLanding(true);
    setShowAuth(false);
    setCurrentView('submit');
  };

  const handleReportSubmit = async (input: AnalysisInput) => {
    // In demo mode, we allow submit without user
    if (!user && !isDemoMode) return; 

    setIsProcessing(true);
    setError(null);

    const currentHistory = clarificationQuestion 
      ? [...inputHistory, input]
      : [input];

    try {
      if (userCoordinates && !input.userCoordinates) {
        input.userCoordinates = userCoordinates;
      }

      const analysis = await analyzeReport(currentHistory);

      if (analysis.needs_clarification) {
        setInputHistory(currentHistory);
        setClarificationQuestion(analysis.missing_info_question || "Please provide more details.");
        setIsProcessing(false);
        return;
      }

      const newReport: CivicReport = {
        id: crypto.randomUUID(),
        userId: user ? user.id : 'demo-user',
        issue_type: analysis.issue_type || "Unclassified",
        description: analysis.description || "No description provided",
        original_text: analysis.original_text || currentHistory[0].text || "Media input",
        original_language: analysis.original_language || "Unknown",
        location: analysis.location || input.userLocation || "Unknown Location",
        lga: analysis.lga,
        state: analysis.state,
        country: analysis.country || "Nigeria", 
        region: analysis.region || `${analysis.lga || 'Unknown'}, ${analysis.state || 'Unknown'}`,
        coordinates: userCoordinates || undefined, 
        urgency: (analysis.urgency as any) || "Low",
        predicted_escalation: (analysis.predicted_escalation as any) || "Low",
        
        // Map new dual actions
        gov_action: analysis.gov_action || (analysis as any).suggested_action || "Review required",
        citizen_action: analysis.citizen_action || "Exercise caution.",
        
        timestamp: Date.now(),
        status: 'New',
        source_type: input.audio ? 'voice' : input.image ? 'image' : input.text ? 'text' : 'mixed',
        upvotes: 0
      };

      setReports(prev => [...prev, newReport]);
      setInputHistory([]);
      setClarificationQuestion(null);
      
      // If demo mode, just close the form
      if (isDemoMode) {
         setShowDemoForm(false);
         alert("Report Submitted Successfully to Demo Dashboard!");
      } else {
         setCurrentView('my-reports');
      }

    } catch (err) {
      console.error("Submission failed", err);
      setError("Failed to analyze report. Please try again or check your API key configuration.");
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelClarification = () => {
    setInputHistory([]);
    setClarificationQuestion(null);
    setError(null);
  };

  const handleUpvote = (id: string) => {
    setReports(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, upvotes: r.upvotes + 1 };
      }
      return r;
    }));
  };

  // --- HELPER: Haversine Distance ---
  const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; 
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
  };

  const deg2rad = (deg: number) => deg * (Math.PI/180);

  // --- FILTERED LISTS ---
  const myReports = reports.filter(r => user && r.userId === user.id);
  
  const nearbyReports = reports.filter(r => {
    if (!userCoordinates || !r.coordinates) return false;
    if (user && r.userId === user.id) return false; // Exclude own
    const dist = getDistanceFromLatLonInKm(
      userCoordinates.lat, userCoordinates.lng,
      r.coordinates.lat, r.coordinates.lng
    );
    return dist < 50; 
  }).map(r => ({
    ...r,
    distance: userCoordinates && r.coordinates 
      ? getDistanceFromLatLonInKm(userCoordinates.lat, userCoordinates.lng, r.coordinates.lat, r.coordinates.lng)
      : 0
  })).sort((a,b) => a.distance - b.distance);


  // --- VIEW RENDERING LOGIC ---

  if (showLanding && !user && !isDemoMode) {
    return (
      <LandingPage 
        onLaunch={() => {
          setShowLanding(false);
          setShowAuth(true);
        }} 
        onDemo={handleEnterDemo}
      />
    );
  }

  if (showAuth && !user && !isDemoMode) {
    return (
      <AuthPage 
        onLogin={handleLogin} 
        onCancel={() => { 
          setShowAuth(false); 
          setShowLanding(true); 
        }}
        onDemo={handleEnterDemo}
      />
    );
  }

  // DEMO MODE UNIFIED DASHBOARD
  if (isDemoMode) {
    return (
      <div className="min-h-screen bg-slate-50 pb-12">
         <Header 
          onHomeClick={handleLogout} 
          currentView={'dashboard'} 
          onViewChange={() => {}} 
          user={null}
          onLogout={handleLogout}
          isDemoMode={true}
        />
        <main className="container mx-auto px-4 py-8">
           
           {/* Demo Controls */}
           <div className="mb-6 flex justify-between items-center">
             <div>
               <h2 className="text-2xl font-bold text-slate-900">Demo Operations Center</h2>
               <p className="text-slate-500">Unified view of both individual reporting and government response tools.</p>
             </div>
             <button 
               onClick={() => setShowDemoForm(!showDemoForm)}
               className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-bold shadow-lg flex items-center space-x-2 transition-all"
             >
               {showDemoForm ? <Plus className="w-5 h-5 rotate-45" /> : <Plus className="w-5 h-5" />}
               <span>{showDemoForm ? 'Close Form' : 'Submit Test Report'}</span>
             </button>
           </div>

           {/* Collapsible Report Form for Demo */}
           {showDemoForm && (
             <div className="mb-8 animate-in fade-in slide-in-from-top-4">
               <div className="max-w-2xl mx-auto bg-white p-1 rounded-xl shadow-xl ring-1 ring-slate-200">
                  <ReportForm 
                    onSubmit={handleReportSubmit} 
                    isProcessing={isProcessing}
                    clarificationQuestion={clarificationQuestion}
                    onCancelClarification={cancelClarification}
                  />
               </div>
             </div>
           )}

           <Dashboard 
             reports={reports} 
             isDemoMode={true}
           />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Header 
        onHomeClick={() => {
           // If user is logged in, Home goes to their default view. If not, Landing.
           if (user) {
             setCurrentView(user.role === 'organization' ? 'dashboard' : 'submit');
           } else {
             setShowLanding(true);
             setShowAuth(false);
           }
        }} 
        currentView={currentView}
        onViewChange={setCurrentView}
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-4 py-8">
        
        {/* VIEW: NEW REPORT (Citizens Only) */}
        {currentView === 'submit' && user?.role === 'citizen' && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Make Your Voice Heard</h2>
              <p className="text-slate-600">Submit a report instantly. We'll handle the rest.</p>
            </div>
            <ReportForm 
              onSubmit={handleReportSubmit} 
              isProcessing={isProcessing}
              clarificationQuestion={clarificationQuestion}
              onCancelClarification={cancelClarification}
            />
             {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
                  {error}
                </div>
              )}
          </div>
        )}

        {/* VIEW: DASHBOARD (Organizations Only) */}
        {currentView === 'dashboard' && user?.role === 'organization' && (
          <Dashboard 
            reports={reports} 
            lockedLocation={user.location} 
            organizationName={user.organizationName}
          />
        )}

        {/* VIEW: MY REPORTS (Citizens Only) */}
        {currentView === 'my-reports' && user?.role === 'citizen' && (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-full">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">My Submission History</h2>
                <p className="text-slate-500 text-sm">Track the status of your reported issues</p>
              </div>
            </div>

            <div className="space-y-4">
              {myReports.length === 0 ? (
                 <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500 mb-4">You haven't submitted any reports yet.</p>
                    <button 
                      onClick={() => setCurrentView('submit')}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Submit your first report
                    </button>
                 </div>
              ) : (
                myReports.slice().reverse().map(report => (
                  <ReportCard 
                    key={report.id} 
                    report={report} 
                    isMyReportView 
                    viewerRole={user.role} // Pass role to determine action text
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* VIEW: NEAR ME (Citizens Only) */}
        {currentView === 'nearby' && user?.role === 'citizen' && (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-emerald-100 p-2 rounded-full">
                <MapPin className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Community Reports Near You</h2>
                <p className="text-slate-500 text-sm">Verify existing issues to help prioritize them without duplication.</p>
              </div>
            </div>

            {!userCoordinates ? (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg flex items-center">
                <Loader2 className="w-5 h-5 animate-spin mr-3" />
                <span>Detecting your location to find nearby reports...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {nearbyReports.length === 0 ? (
                   <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                      <p className="text-slate-500">No reports found within 50km of your location.</p>
                   </div>
                ) : (
                  nearbyReports.map(report => (
                    <ReportCard 
                      key={report.id} 
                      report={report} 
                      isNearbyView 
                      distance={(report as any).distance}
                      onUpvote={handleUpvote}
                      viewerRole={user.role}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default App;