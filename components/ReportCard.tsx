import React from 'react';
import { MapPin, Globe, Activity, ThumbsUp, CheckCircle2, Clock, AlertTriangle, ArrowRightCircle, Shield, Briefcase } from 'lucide-react';
import { CivicReport, Urgency, UserRole } from '../types';

interface ReportCardProps {
  report: CivicReport;
  isNearbyView?: boolean;
  isMyReportView?: boolean;
  distance?: number; // Distance in km
  onUpvote?: (id: string) => void;
  viewerRole?: UserRole; // To determine which action to show
  isDemoMode?: boolean; // New prop for demo mode
}

const ReportCard: React.FC<ReportCardProps> = ({ 
  report, 
  isNearbyView, 
  isMyReportView, 
  distance,
  onUpvote,
  viewerRole = 'citizen',
  isDemoMode
}) => {
  const urgencyColor = {
    [Urgency.Low]: 'bg-slate-100 text-slate-700 border-slate-200',
    [Urgency.Medium]: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    [Urgency.High]: 'bg-red-50 text-red-700 border-red-200',
  };

  const statusColor = {
    'New': 'text-blue-600 bg-blue-50 border-blue-100',
    'In Progress': 'text-purple-600 bg-purple-50 border-purple-100',
    'Resolved': 'text-emerald-600 bg-emerald-50 border-emerald-100'
  };

  // Logic to determine display actions
  const showGov = isDemoMode || viewerRole === 'organization';
  const showCitizen = isDemoMode || viewerRole === 'citizen';

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
        <div className="flex-1 space-y-3">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${urgencyColor[report.urgency]}`}>
              {report.urgency} Priority
            </span>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wide bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              {report.issue_type}
            </span>
            
            {/* Show Distance for Nearby View */}
            {isNearbyView && distance !== undefined && (
               <span className="flex items-center text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                 <MapPin className="w-3 h-3 mr-1" />
                 {distance < 1 ? `${(distance * 1000).toFixed(0)}m away` : `${distance.toFixed(1)}km away`}
               </span>
            )}
            
            <span className="text-xs text-slate-400 ml-auto">
              {new Date(report.timestamp).toLocaleDateString()}
            </span>
          </div>
          
          <h4 className="text-xl font-bold text-slate-900 leading-tight">{report.description}</h4>
          
          {/* Location & Details */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center text-sm text-slate-600 font-medium">
              <MapPin className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
              <span>
                {/* Display hierarchy generically */}
                {report.location} 
                <span className="text-slate-400 font-normal ml-1">
                   {report.lga ? `• ${report.lga}` : ''} {report.state ? `• ${report.state}` : ''} {report.country ? `• ${report.country}` : ''}
                </span>
              </span>
            </div>
            
            {report.original_language !== 'English' && (
              <div className="flex items-start text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 italic">
                <Globe className="w-4 h-4 mr-2 mt-0.5 text-slate-400 shrink-0" />
                <span>
                  Original ({report.original_language}): "{report.original_text}"
                </span>
              </div>
            )}
            
            {/* DYNAMIC ACTION DISPLAY */}
            <div className="space-y-2 mt-2">
              
              {showCitizen && (
                <div className="flex items-start p-3 rounded-lg border bg-orange-50 border-orange-100">
                  <Shield className="w-5 h-5 mr-3 mt-0.5 shrink-0 text-orange-600" />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wide block mb-0.5 text-orange-600">
                      Safety Advisory
                    </span>
                    <span className="text-base font-bold text-slate-800 leading-snug">
                      {report.citizen_action}
                    </span>
                  </div>
                </div>
              )}

              {showGov && (
                <div className="flex items-start p-3 rounded-lg border bg-indigo-50 border-indigo-100">
                  <Briefcase className="w-5 h-5 mr-3 mt-0.5 shrink-0 text-indigo-600" />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wide block mb-0.5 text-indigo-600">
                      Operational Directive
                    </span>
                    <span className="text-base font-bold text-slate-800 leading-snug">
                      {report.gov_action}
                    </span>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Right Side Actions/Status */}
        <div className="flex flex-col space-y-4 md:text-right shrink-0 min-w-[140px] border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4 mt-2 md:mt-0">
          
          {/* My Report Status View */}
          {isMyReportView && (
            <div className="flex flex-col items-end">
              <span className="text-xs uppercase text-slate-400 font-bold mb-1">Status</span>
              <div className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center ${statusColor[report.status]}`}>
                 {report.status === 'Resolved' && <CheckCircle2 className="w-3 h-3 mr-1.5" />}
                 {report.status === 'In Progress' && <Clock className="w-3 h-3 mr-1.5" />}
                 {report.status === 'New' && <AlertTriangle className="w-3 h-3 mr-1.5" />}
                 {report.status}
              </div>
            </div>
          )}

          {/* Nearby Report Action View */}
          {isNearbyView && onUpvote && (
            <button 
              onClick={() => onUpvote(report.id)}
              className="flex items-center justify-center space-x-2 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 px-4 py-2 rounded-lg transition-all font-bold text-sm group shadow-sm w-full"
            >
              <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Validate ({report.upvotes})</span>
            </button>
          )}

          {/* Default/Dashboard View Risk Assessment */}
          {!isNearbyView && (
             <div className="text-sm flex md:flex-col justify-between md:items-end">
                <span className="text-slate-400 text-xs uppercase font-medium">Escalation Risk</span>
                <span className={`font-bold ${report.predicted_escalation === 'High' ? 'text-red-600' : report.predicted_escalation === 'Medium' ? 'text-amber-600' : 'text-slate-700'}`}>
                  {report.predicted_escalation}
                </span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;