import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ReportForm from './components/ReportForm';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import ReportCard from './components/ReportCard';
import AuthPage from './components/AuthPage';
import { CivicReport, AIAnalysisResponse, ViewMode, UserProfile } from './types';
import { MapPin, User, Loader2, ArrowLeft, PlusCircle } from 'lucide-react';
import { db, collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc } from './services/firebase';

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reports, setReports] = useState<CivicReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('civiclink_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Role-based initial view
  const [currentView, setCurrentView] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('civiclink_user');
    if (saved) {
      const u = JSON.parse(saved) as UserProfile;
      return u.role === 'organization' ? 'dashboard' : 'submit';
    }
    return 'submit';
  });

  useEffect(() => {
    const q = query(collection(db, "reports"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reportsData = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as CivicReport[];
      setReports(reportsData);
      setLoadingReports(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('civiclink_user', JSON.stringify(user));
      setShowLanding(false);
      // Organization shouldn't see the submission form
      if (user.role === 'organization' && currentView === 'submit') {
        setCurrentView('dashboard');
      }
    } else {
      localStorage.removeItem('civiclink_user');
    }
  }, [user]);

  const handleUpdateStatus = async (reportId: string, newStatus: CivicReport['status']) => {
    try {
      const reportRef = doc(db, "reports", reportId);
      await updateDoc(reportRef, { status: newStatus });
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Permission denied. Only authorized officials can change status.");
    }
  };

  const handleFinalSubmit = async (data: { description: string; analysis: AIAnalysisResponse; location: any }) => {
    if (user?.role === 'organization') return;
    setIsSubmitting(true);
    try {
      const reportPayload = {
        userId: user?.uid || 'anonymous',
        user_description: data.description,
        ai_metadata: {
          category: data.analysis.suggested_category,
          urgency: data.analysis.suggested_urgency,
          is_high_risk: data.analysis.is_high_risk,
          safety_advice: data.analysis.safety_advice,
          suggested_description: data.analysis.suggested_description
        },
        location: {
          address: data.location.address,
          lga: data.location.lga || user?.location.lga || 'Unknown',
          state: data.location.state || user?.location.state || 'Lagos',
          coordinates: { lat: data.location.lat, lng: data.location.lng }
        },
        timestamp: Date.now(),
        status: 'New',
        upvotes: 1,
        source_type: 'mixed'
      };

      await addDoc(collection(db, "reports"), reportPayload);
      setIsSubmitting(false);
      setCurrentView('dashboard');
    } catch (err) {
      console.error("Submission failed", err);
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setShowLanding(true);
    setCurrentView('submit');
  };

  const handleLogin = (userData: UserProfile) => {
    setUser(userData);
    setShowAuth(false);
    setShowLanding(false);
    setCurrentView(userData.role === 'organization' ? 'dashboard' : 'submit');
  };

  if (showLanding && !user) {
    return <LandingPage onLaunch={() => { setShowLanding(false); setShowAuth(true); }} onDemo={() => { setShowLanding(false); setShowAuth(true); }} />;
  }

  if (showAuth && !user) {
    return <AuthPage onLogin={handleLogin} onCancel={() => { setShowAuth(false); setShowLanding(true); }} />;
  }

  const defaultView = user?.role === 'organization' ? 'dashboard' : 'submit';

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 pb-24 md:pb-12">
      <Header 
        onHomeClick={() => user ? setCurrentView(defaultView) : setShowLanding(true)}
        currentView={currentView}
        onViewChange={setCurrentView}
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentView !== defaultView && (
              <button 
                onClick={() => setCurrentView(defaultView)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-sm text-slate-800 font-black hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
            )}
            <div className="hidden md:flex flex-col">
              <h2 className="text-xl font-black text-slate-900 leading-none">
                {currentView === 'submit' ? 'Submit Report' : currentView === 'dashboard' ? 'Live Dashboard' : 'Regional Feed'}
              </h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {user?.role === 'organization' ? `${user?.organizationName} • Management` : `Active in ${user?.location.state}`}
              </span>
            </div>
          </div>

          {user?.role === 'citizen' && currentView !== 'submit' && (
             <button 
               onClick={() => setCurrentView('submit')}
               className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-black text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2 hover:bg-blue-700 active:scale-95 transition-all"
             >
               <PlusCircle className="w-5 h-5" />
               <span>New Report</span>
             </button>
          )}
        </div>

        {currentView === 'submit' && user?.role === 'citizen' && (
          <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>
                <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Connected to {user?.location.state}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">Empower Change.</h2>
              <p className="text-slate-500 font-bold text-base md:text-lg">Your report is submitted directly to the {user?.location.state} Ministry.</p>
            </div>
            <ReportForm onSubmit={handleFinalSubmit} isSubmitting={isSubmitting} />
          </div>
        )}

        {currentView === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <Dashboard reports={reports} user={user} onUpdateStatus={handleUpdateStatus} />
          </div>
        )}

        {currentView === 'nearby' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">State Activity</h2>
            <div className="grid gap-6">
              {reports.filter(r => r.location.state === user?.location.state).length === 0 ? (
                <EmptyState onAction={() => setCurrentView('submit')} showButton={user?.role === 'citizen'} />
              ) : (
                reports
                  .filter(r => r.location.state === user?.location.state)
                  .map(r => <ReportCard key={r.id} report={r} user={user} onUpdateStatus={handleUpdateStatus} />)
              )}
            </div>
          </div>
        )}

        {currentView === 'my-reports' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">My Timeline</h2>
            <div className="grid gap-6">
              {reports.filter(r => r.userId === user?.uid).length === 0 ? (
                <EmptyState onAction={() => setCurrentView('submit')} showButton={user?.role === 'citizen'} />
              ) : (
                reports.filter(r => r.userId === user?.uid).map(r => <ReportCard key={r.id} report={r} user={user} onUpdateStatus={handleUpdateStatus} />)
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const EmptyState = ({ onAction, showButton = true }: any) => (
  <div className="text-center py-20 bg-white rounded-[2rem] border-4 border-dashed border-slate-100 flex flex-col items-center">
    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
      <MapPin className="w-10 h-10 text-slate-200" />
    </div>
    <p className="text-slate-400 font-bold text-lg mb-6">No reports found in this area yet.</p>
    {showButton && (
      <button onClick={onAction} className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
        Create First Report
      </button>
    )}
  </div>
);

export default App;