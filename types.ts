export enum Urgency {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export type UserRole = 'citizen' | 'organization';

export interface UserProfile {
  id: string;
  name: string;
  organizationName?: string; // New field for Org name
  email: string;
  role: UserRole;
  location: {
    country: string;
    state: string; // Level 1 (City/State)
    lga: string;   // Level 2 (Town/District)
  };
}

export interface CivicReport {
  id: string;
  userId: string; // To identify who created it
  issue_type: string;
  description: string;
  original_text: string;
  original_language: string;
  location: string;
  lga?: string; // Maps to Town / District / LGA (Level 2)
  state?: string; // Maps to City / State / Region (Level 1)
  country?: string; 
  coordinates?: { lat: number; lng: number }; // For "Near Me" calculation
  region: string; // General display region
  urgency: Urgency;
  predicted_escalation: Urgency;
  
  // Dual Actions
  gov_action: string;      // Plan for the government
  citizen_action: string;  // Advice for the individual
  
  timestamp: number;
  status: 'New' | 'In Progress' | 'Resolved';
  source_type: 'text' | 'voice' | 'image' | 'mixed';
  upvotes: number; // For "I see this too" feature
}

export interface ReportStats {
  total: number;
  byCategory: { name: string; value: number }[];
  highUrgencyCount: number;
  byRegion: { name: string; value: number }[];
}

export interface AnalysisInput {
  text: string;
  image?: File | null;
  audio?: Blob | null;
  userLocation?: string; // Location provided by browser or user input
  userCoordinates?: { lat: number; lng: number };
}

export interface AnalysisResult extends Partial<CivicReport> {
  needs_clarification?: boolean;
  missing_info_question?: string;
}

export type ViewMode = 'submit' | 'nearby' | 'my-reports' | 'dashboard';