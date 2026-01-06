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
  const isCitizen = user?.role === 'citizen';

  const NavItem = ({ view, icon: Icon, label }: { view: ViewMode, icon: any, label: string }) => (
    <button
      onClick={() => onViewChange(view)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all text-[11px] md:text-xs font-black uppercase tracking-widest ${
        currentView === view 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
          : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center gap-4">
            
            <button onClick={onHomeClick} className="flex items-center space-x-3 shrink-0 group">
              <div className="bg-blue-600 p-2 rounded-xl shadow-md group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="text-left hidden xs:block">
                <h1 className="text-lg font-black text-slate-900 tracking-tighter leading-none">CivicLink</h1>
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Nigeria Unified</span>
              </div>
            </button>

            <nav className="flex-1 hidden md:flex items-center justify-center space-x-1 bg-slate-50 p-1 rounded-2xl border border-slate-200 max-w-2xl mx-auto overflow-x-auto">
              {isCitizen && <NavItem view="submit" icon={PlusCircle} label="Report" />}
              <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
              <NavItem view="nearby" icon={MapPin} label="Region" />
              <NavItem view="my-reports" icon={User} label="Profile" />
            </nav>

            <div className="flex items-center space-x-2 shrink-0">
              {user ? (
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 rounded-full hover:bg-slate-50 relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center space-x-2 bg-slate-900 text-white pl-1 pr-2 py-1 rounded-full border border-slate-800"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-black text-[10px]">
                        {user?.name?.charAt(0)}
                      </div>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>
                    {showProfileMenu && (
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl py-2 border border-slate-100 ring-1 ring-black ring-opacity-5 z-[100]">
                        <div className="px-4 py-3 border-b border-slate-50">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Auth Profile</p>
                          <p className="text-sm font-black text-slate-900 truncate">{user?.name}</p>
                          <p className="text-[10px] text-blue-600 font-black uppercase">{user?.role === 'organization' ? 'Official' : 'Citizen'}</p>
                        </div>
                        <button 
                          onClick={onLogout}
                          className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center font-black"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button onClick={onHomeClick} className="text-sm font-black text-blue-600 hover:text-blue-700 px-4 py-2">Sign In</button>
              )}
            </div>
          </div>
        </div>
      </header>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center py-2 px-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {isCitizen && <MobileNavItem active={currentView === 'submit'} onClick={() => onViewChange('submit')} icon={PlusCircle} label="Report" />}
        <MobileNavItem active={currentView === 'dashboard'} onClick={() => onViewChange('dashboard')} icon={LayoutDashboard} label="Live" />
        <MobileNavItem active={currentView === 'nearby'} onClick={() => onViewChange('nearby')} icon={MapPin} label="Feed" />
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
    <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-blue-50' : ''}`}>
      <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5px]' : ''}`} />
    </div>
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default Header;