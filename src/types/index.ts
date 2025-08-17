export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted';

export type LeadSource = 'Website' | 'Referral' | 'Cold Call' | 'Email Campaign' | 'Social Media' | 'Trade Show';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  source: LeadSource;
  score: number;
  status: LeadStatus;
  createdAt: string;
}

export interface Opportunity {
  id: string;
  leadId: string;
  name: string;
  company: string;
  amount?: number;
  createdAt: string;
}

export interface AppState {
  leads: Lead[];
  opportunities: Opportunity[];
  isLoading: boolean;
  searchQuery: string;
  statusFilter: LeadStatus | 'All';
  sortByScore: boolean;
  selectedLead: Lead | null;
  isDetailPanelOpen: boolean;
  error: string | null;
}

export type AppAction =
  | { type: 'LEADS_LOADED'; payload: Lead[] }
  | { type: 'LEADS_LOADING' }
  | { type: 'LEAD_UPDATED'; payload: Lead }
  | { type: 'LEAD_CONVERTED'; payload: { lead: Lead; opportunity: Opportunity } }
  | { type: 'SEARCH_CHANGED'; payload: string }
  | { type: 'FILTER_CHANGED'; payload: LeadStatus | 'All' }
  | { type: 'SORT_CHANGED'; payload: boolean }
  | { type: 'DETAIL_PANEL_OPENED'; payload: Lead }
  | { type: 'DETAIL_PANEL_CLOSED' }
  | { type: 'ERROR_SET'; payload: string }
  | { type: 'ERROR_CLEARED' };
