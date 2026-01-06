
import React from 'react';
import { ShieldCheck, MapPin, User, LayoutDashboard, PlusCircle, LogOut, ChevronDown, Bell } from 'lucide-react';
import { ViewMode, UserProfile } from '../types';

interface HeaderProps {
  onHomeClick: () => void;
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  user: UserProfile | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick, currentView, onViewChange, user, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  const NavItem = ({ view, icon: Icon, label }: { view: ViewMode, icon: any, label: string }) => (
    <button
      onClick={() => onViewChange(view)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all text-sm font-bold ${
        currentView === view 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
          : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 py-3">
          <div className="flex justify-between items-center">
            
            <button 
              onClick={onHomeClick}
              className="flex items-center space-x-3 group"
            >
              <div className="bg-blue-600 p-2 rounded-xl shadow-md group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">CivicLink</h1>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Nigeria Unified</span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 bg-slate-50 p-1 rounded-2xl border border-slate-200">
              <NavItem view="submit" icon={PlusCircle} label="Report" />
              <NavItem view="dashboard" icon={LayoutDashboard} label="Live Dashboard" />
              <NavItem view="nearby" icon={MapPin} label="Local Insights" />
              <NavItem view="my-reports" icon={User} label="My Activity" />
            </nav>

            <div className="flex items-center space-x-2 md:space-x-4">
              {user ? (
                <div className="flex items-center space-x-2 md:space-x-3">
                  <button className="p-2 text-slate-400 hover:text-blue-600 rounded-full hover:bg-slate-100 relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  </button>
                  <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
                  <div className="relative">
                    <button 
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center space-x-2 bg-slate-900 text-white pl-1 pr-2 md:pr-3 py-1 rounded-full border border-slate-800"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-[10px]">
                        {user?.name?.charAt(0)}
                      </div>
                      <span className="text-xs font-bold hidden md:inline">{user?.name}</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>
                    {showProfileMenu && (
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl py-2 border border-slate-100 ring-1 ring-black ring-opacity-5 z-50">
                        <div className="px-4 py-3 border-b border-slate-50">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account</p>
                          <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{user?.location.lga}, {user?.location.state}</p>
                        </div>
                        <button 
                          onClick={onLogout}
                          className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center font-bold"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button onClick={onHomeClick} className="text-sm font-bold text-blue-600 hover:text-blue-700 px-4 py-2">Sign In</button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar - FIXED VISIBILITY ON MOBILE */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center py-2 px-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <MobileNavItem active={currentView === 'submit'} onClick={() => onViewChange('submit')} icon={PlusCircle} label="Report" />
        <MobileNavItem active={currentView === 'dashboard'} onClick={() => onViewChange('dashboard')} icon={LayoutDashboard} label="Live" />
        <MobileNavItem active={currentView === 'nearby'} onClick={() => onViewChange('nearby')} icon={MapPin} label="Local" />
        <MobileNavItem active={currentView === 'my-reports'} onClick={() => onViewChange('my-reports')} icon={User} label="Profile" />
      </nav>
    </>
  );
};

const MobileNavItem = ({ active, onClick, icon: Icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center space-y-1 transition-all flex-1 py-1 rounded-xl ${active ? 'text-blue-600' : 'text-slate-400'}`}
  >
    <div className={`p-1.5 rounded-lg transition-all ${active ? 'bg-blue-50' : ''}`}>
      <Icon className={`w-6 h-6 ${active ? 'stroke-[2.5px]' : ''}`} />
    </div>
    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);

export default Header;
