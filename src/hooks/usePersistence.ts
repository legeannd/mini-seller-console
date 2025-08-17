import { useEffect } from 'react';
import { useAppContext } from './useAppContext';
import type { LeadStatus } from '@/types';

const UI_PREFERENCES_KEY = 'mini-seller-ui-preferences';
const OPPORTUNITIES_KEY = 'mini-seller-opportunities';

interface UIPreferences {
  searchQuery: string;
  statusFilter: LeadStatus | 'All';
  sortByScore: boolean;
}

export function usePersistence() {
  const { state } = useAppContext();

  useEffect(() => {
    const preferences: UIPreferences = {
      searchQuery: state.searchQuery,
      statusFilter: state.statusFilter,
      sortByScore: state.sortByScore,
    };

    try {
      localStorage.setItem(UI_PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save UI preferences:', error);
    }
  }, [state.searchQuery, state.statusFilter, state.sortByScore]);

  useEffect(() => {
    try {
      localStorage.setItem(OPPORTUNITIES_KEY, JSON.stringify(state.opportunities));
    } catch (error) {
      console.warn('Failed to save opportunities:', error);
    }
  }, [state.opportunities]);
}

