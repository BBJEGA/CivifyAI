
import React from 'react';
import { MapPin, ShieldAlert, Clock, CheckCircle2, ThumbsUp, ChevronRight, Briefcase, Settings2 } from 'lucide-react';
import { CivicReport, Urgency, UserProfile } from '../types';

interface ReportCardProps {
  report: CivicReport;
  user?: UserProfile | null;
  onUpdateStatus?: (reportId: string, status: CivicReport['status']) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, user, onUpdateStatus }) => {
  const urgencyStyles = {
    [Urgency.Low]: 'bg-slate-50 text-slate-600 border-slate-200',
    [Urgency.Medium]: 'bg-amber-50 text-amber-600 border-amber-200',
    [Urgency.High]: 'bg-red-50 text-red-600 border-red-200',
  };

  const statusColors = {
    'New': 'bg-blue-50 text-blue-600 border-blue-100',
    'In Progress': 'bg-amber-50 text-amber-600 border-amber-100',
    'Resolved': 'bg-emerald-50 text-emerald-600 border-emerald-100'
  };

  const isOfficial = user?.role === 'organization';

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all group">
      <div className="flex flex-col md:flex-row gap-6">
        
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${urgencyStyles[report.ai_metadata?.urgency || Urgency.Low]}`}>
              {report.ai_metadata?.urgency} PRIORITY
            </span>
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">
              {report.ai_metadata?.category}
            </span>
            <div className={`ml-auto flex items-center space-x-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${statusColors[report.status]}`}>
              {report.status === 'New' && <Clock className="w-3 h-3" />}
              {report.status === 'In Progress' && <Briefcase className="w-3 h-3" />}
              {report.status === 'Resolved' && <CheckCircle2 className="w-3 h-3" />}
              <span>{report.status}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
              {report.user_description}
            </h4>
            <div className="flex items-center text-sm text-slate-500 font-bold">
              <MapPin className="w-4 h-4 mr-2 text-blue-600" />
              <span>{report.location.address}</span>
            </div>
          </div>

          {isOfficial && onUpdateStatus && (
            <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <Settings2 className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Official Actions</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onUpdateStatus(report.id, 'In Progress')}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all border ${report.status === 'In Progress' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-600 border-slate-200 hover:border-amber-400'}`}
                >
                  Mark In Progress
                </button>
                <button 
                  onClick={() => onUpdateStatus(report.id, 'Resolved')}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all border ${report.status === 'Resolved' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400'}`}
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:block w-px bg-slate-100"></div>

        <div className="md:w-48 flex flex-row md:flex-col justify-between items-center md:items-end pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
          <div className="md:text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Community Support</p>
            <div className="flex items-center space-x-2 text-slate-900 font-black text-lg">
              <ThumbsUp className="w-5 h-5 text-blue-600" />
              <span>{report.upvotes} Citizens</span>
            </div>
          </div>
          
          <button className="flex items-center justify-center space-x-2 py-3 px-5 bg-slate-900 text-white rounded-2xl font-black transition-all text-xs hover:bg-blue-600 shadow-lg shadow-slate-900/10">
            <span>Case File</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReportCard;
