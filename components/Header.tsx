import React from 'react';
import { ShieldCheck, Activity, MapPin, User, LayoutDashboard, PlusCircle, LogOut, ChevronDown, PlayCircle } from 'lucide-react';
import { ViewMode, UserProfile } from '../types';

interface HeaderProps {
  onHomeClick: () => void;
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  user: UserProfile | null;
  onLogout: () => void;
  isDemoMode?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick, currentView, onViewChange, user, onLogout, isDemoMode }) => {
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  const NavItem = ({ view, icon: Icon, label }: { view: ViewMode, icon: any, label: string }) => (
    <button
      onClick={() => onViewChange(view)}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
        currentView === view 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
          
          {/* Logo Area */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <button 
              onClick={onHomeClick}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity text-left focus:outline-none"
              aria-label="Back to Home"
            >
              <div className="bg-blue-600 p-2 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">CivifyAI</h1>
                <p className="text-xs text-slate-400 font-medium">Global Citizen Response</p>
              </div>
            </button>
          </div>

          {/* DEMO MODE BADGE */}
          {isDemoMode && (
             <div className="bg-amber-500/10 border border-amber-500/50 rounded-full px-4 py-1 flex items-center space-x-2 animate-pulse">
                <PlayCircle className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wide">Demo Mode Active • No Save</span>
             </div>
          )}
          
          {/* Navigation Tabs - Conditioned on User Role */}
          {user && !isDemoMode && (
            <nav className="flex items-center space-x-1 md:space-x-2 bg-slate-800/50 p-1 rounded-xl overflow-x-auto max-w-full">
              
              {/* CITIZEN VIEWS */}
              {user.role === 'citizen' && (
                <>
                  <NavItem view="submit" icon={PlusCircle} label="New Report" />
                  <NavItem view="nearby" icon={MapPin} label="Near Me" />
                  <NavItem view="my-reports" icon={User} label="My Reports" />
                </>
              )}

              {/* ORGANIZATION VIEWS */}
              {user.role === 'organization' && (
                <>
                  <NavItem view="dashboard" icon={LayoutDashboard} label="Gov Dashboard" />
                </>
              )}

            </nav>
          )}

          {/* User Profile / Logout */}
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${user.role === 'organization' ? 'bg-purple-600' : 'bg-emerald-600'}`}>
                  {user.name.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-white leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide leading-none mt-1">{user.role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 text-slate-800 border border-slate-200 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-bold">{user.location.lga || 'Unknown Loc'}</p>
                    <p className="text-xs text-slate-500">{user.location.country}</p>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : isDemoMode ? (
            <button 
               onClick={onLogout}
               className="text-sm text-slate-400 hover:text-white flex items-center space-x-1"
            >
               <LogOut className="w-4 h-4" />
               <span>Exit Demo</span>
            </button>
          ) : (
            <div className="w-8 h-8"></div> // Spacer
          )}

        </div>
      </div>
    </header>
  );
};

export default Header;