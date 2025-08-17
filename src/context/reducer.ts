import type { AppAction, AppState } from '@/types';

function loadPersistedOpportunities() {
  try {
    const saved = localStorage.getItem('mini-seller-opportunities');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Failed to load persisted opportunities:', error);
  }
  return [];
}

function loadPersistedUIFilters() {
  try {
    const saved = localStorage.getItem('mini-seller-ui-preferences');
    if (saved) {
      const preferences = JSON.parse(saved);
      return {
        searchQuery: preferences.searchQuery || '',
        statusFilter: preferences.statusFilter || 'All',
        sortByScore: preferences.sortByScore || false,
      };
    }
  } catch (error) {
    console.warn('Failed to load persisted UI filters:', error);
  }
  return {
    searchQuery: '',
    statusFilter: 'All' as const,
    sortByScore: false,
  };
}

export const initialState: AppState = {
  leads: [],
  opportunities: loadPersistedOpportunities(),
  isLoading: true,
  ...loadPersistedUIFilters(),
  selectedLead: null,
  isDetailPanelOpen: false,
  error: null,
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LEADS_LOADING':
      return { ...state, isLoading: true, error: null };

    case 'LEADS_LOADED': {
      const reconciledLeads = action.payload.map(lead => {
        const hasOpportunity = state.opportunities.some(opp => opp.leadId === lead.id);
        return hasOpportunity
          ? { ...lead, status: 'Converted' as const }
          : lead;
      });

      return {
        ...state,
        leads: reconciledLeads,
        isLoading: false,
        error: null
      };
    }

    case 'LEAD_UPDATED':
      return {
        ...state,
        leads: state.leads.map(lead =>
          lead.id === action.payload.id ? action.payload : lead
        ),
        selectedLead: state.selectedLead?.id === action.payload.id
          ? action.payload
          : state.selectedLead,
      };

    case 'LEAD_CONVERTED': {
      const { lead, opportunity } = action.payload;
      return {
        ...state,
        leads: state.leads.map(l => l.id === lead.id ? lead : l),
        opportunities: [...state.opportunities, opportunity],
        selectedLead: state.selectedLead?.id === lead.id ? lead : state.selectedLead,
      };
    }

    case 'SEARCH_CHANGED':
      return { ...state, searchQuery: action.payload };

    case 'FILTER_CHANGED':
      return { ...state, statusFilter: action.payload };

    case 'SORT_CHANGED':
      return { ...state, sortByScore: action.payload };

    case 'DETAIL_PANEL_OPENED':
      return {
        ...state,
        selectedLead: action.payload,
        isDetailPanelOpen: true
      };

    case 'DETAIL_PANEL_CLOSED':
      return {
        ...state,
        selectedLead: null,
        isDetailPanelOpen: false
      };

    case 'ERROR_SET':
      return { ...state, error: action.payload, isLoading: false };

    case 'ERROR_CLEARED':
      return { ...state, error: null };

    default:
      return state;
  }
}
