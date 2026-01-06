
export enum Urgency {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export type UserRole = 'citizen' | 'organization';

export interface UserProfile {
  uid: string;
  name: string;
  organizationName?: string;
  email: string;
  role: UserRole;
  location: {
    state: string;
    lga: string;
  };
}

export interface CivicReport {
  id: string;
  userId: string;
  user_description: string;
  ai_metadata: {
    category: string;
    urgency: Urgency;
    is_high_risk: boolean;
    safety_advice?: string;
    suggested_description: string;
  };
  original_input?: {
    text?: string;
    language?: string;
    audio_transcription?: string;
  };
  location: {
    address: string;
    lga: string;
    state: string;
    coordinates: { lat: number; lng: number };
  };
  media_urls?: string[];
  timestamp: number;
  status: 'New' | 'In Progress' | 'Resolved';
  upvotes: number;
  source_type: 'text' | 'voice' | 'image' | 'mixed';
}

export interface AnalysisInput {
  text?: string;
  image?: File | null;
  audio?: Blob | null;
  userLocation?: string;
  userCoordinates?: { lat: number; lng: number };
}

export interface AIAnalysisResponse {
  suggested_description: string;
  suggested_category: string;
  suggested_urgency: Urgency;
  is_high_risk: boolean;
  safety_advice?: string;
  detected_language: string;
  transcription?: string;
  detected_location?: {
    address?: string;
    lga?: string;
    state?: string;
  };
}

export type ViewMode = 'submit' | 'nearby' | 'my-reports' | 'dashboard';
