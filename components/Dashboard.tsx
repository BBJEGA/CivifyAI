
import React, { useState, useMemo } from 'react';
import { LayoutGrid, Map as MapIcon, Filter, TrendingUp, AlertCircle, Building, Search, Globe, MapPin } from 'lucide-react';
import { CivicReport, Urgency, UserProfile } from '../types';
import ReportCard from './ReportCard';

interface DashboardProps {
  reports: CivicReport[];
  user: UserProfile | null;
  onUpdateStatus: (id: string, status: CivicReport['status']) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ reports, user, onUpdateStatus }) => {
  const [view, setView] = useState<'list' | 'map'>('list');
  const [scope, setScope] = useState<'local' | 'global'>('local');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = useMemo(() => {
    const relevant = scope === 'local' ? reports.filter(r => r.location.state === user?.location.state) : reports;
    return {
      total: relevant.length,
      highRisk: relevant.filter(r => r.ai_metadata?.is_high_risk).length,
      resolved: relevant.filter(r => r.status === 'Resolved').length,
      activeLGAs: Array.from(new Set(relevant.map(r => r.location.lga))).length
    };
  }, [reports, scope, user]);

  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const matchesScope = scope === 'global' || r.location.state === user?.location.state;
      const matchesSearch = r.user_description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           r.location.lga.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           r.location.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesScope && matchesSearch;
    });
  }, [reports, scope, searchQuery, user]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-200 p-1 rounded-2xl">
            <button 
              onClick={() => setScope('local')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${scope === 'local' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <MapPin className="w-4 h-4" />
              <span>{user?.location.state} Only</span>
            </button>
            <button 
              onClick={() => setScope('global')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${scope === 'global' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Globe className="w-4 h-4" />
              <span>Global Nigeria</span>
            </button>
          </div>
          
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search issues, LGAs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-[10px] md:text-xs outline-none focus:ring-4 focus:ring-blue-100 font-bold shadow-sm"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-50 p-1 rounded-2xl border border-slate-200 w-fit self-end">
          <button 
            onClick={() => setView('list')}
            className={`p-2 rounded-xl transition-all ${view === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setView('map')}
            className={`p-2 rounded-xl transition-all ${view === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
          >
            <MapIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Active" value={stats.total} color="blue" icon={TrendingUp} />
        <StatCard title="Critical" value={stats.highRisk} color="red" icon={AlertCircle} />
        <StatCard title="Solved" value={stats.resolved} color="emerald" icon={Building} />
        <StatCard title="Areas" value={stats.activeLGAs} color="indigo" icon={Search} />
      </div>

      {view === 'list' ? (
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100 flex flex-col items-center">
               <Search className="w-12 h-12 text-slate-100 mb-4" />
               <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">No reports in {scope} view.</p>
            </div>
          ) : (
            filteredReports.map(report => (
              <ReportCard key={report.id} report={report} user={user} onUpdateStatus={onUpdateStatus} />
            ))
          )}
        </div>
      ) : (
        <div className="bg-slate-200 h-[400px] md:h-[500px] rounded-[2.5rem] relative overflow-hidden flex items-center justify-center border-4 border-white shadow-xl">
          <div className="absolute inset-0 bg-blue-50 opacity-40 flex items-center justify-center">
             <MapIcon className="w-32 h-32 text-blue-100" />
          </div>
          <div className="absolute top-6 left-6 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-white shadow-sm">
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
               {filteredReports.length} Regional Incidents
             </p>
          </div>
          {filteredReports.slice(0, 15).map((r, i) => (
            <div 
              key={r.id}
              className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 animate-bounce"
              style={{ left: `${20 + (i * 123) % 60}%`, top: `${30 + (i * 97) % 40}%` }}
            >
              <div className="relative group">
                <MapPin className={`w-8 h-8 ${r.ai_metadata?.is_high_risk ? 'text-red-600' : 'text-blue-600'}`} />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-slate-900 text-white p-2 rounded-lg text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {r.location.lga}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, color, icon: Icon }: any) => {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    indigo: 'bg-indigo-50 text-indigo-600'
  };
  return (
    <div className="bg-white p-4 md:p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-xl md:text-2xl font-black text-slate-900">{value}</p>
      </div>
      <div className={`p-2 md:p-2.5 rounded-xl ${colors[color]}`}>
        <Icon className="w-4 h-4 md:w-5 h-5" />
      </div>
    </div>
  );
};

export default Dashboard;
