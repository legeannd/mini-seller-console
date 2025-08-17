import { useCallback, useMemo } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import { apiService } from '@/services/api';
import type { Lead, LeadStatus } from '@/types';
import { toast } from 'sonner';

export function useLeadConversion(lead: Lead | null) {
  const { dispatch, state } = useAppContext();

  const hasOpportunity = useMemo(() => {
    if (!lead) return false;
    return state.opportunities.some(opp => opp.leadId === lead.id);
  }, [lead, state.opportunities]);

  const handleConvert = useCallback(async (amount?: number) => {
    if (!lead) return;

    try {
      const result = await apiService.convertLead(lead, amount);

      dispatch({
        type: 'LEAD_CONVERTED',
        payload: result,
      });

      toast.success(`Successfully converted ${lead.name} to an opportunity`);
    } catch (error) {
      console.error('Failed to convert lead:', error);
      const message = error instanceof Error ? error.message : 'Failed to convert lead';
      toast.error(message);
      throw error;
    }
  }, [lead, dispatch]);

  const handleStatusChange = useCallback(async (newStatus: LeadStatus) => {
    if (!lead) return;

    if (lead.status === 'Converted' && newStatus !== 'Converted') {
      toast.warning('Status Change Warning', {
        description: 'This lead was previously converted to an opportunity. Make sure you are doing the right status change.',
      });
    }

    try {
      dispatch({
        type: 'LEAD_UPDATED',
        payload: {
          ...lead,
          status: newStatus,
        },
      });

      toast.success('Lead status updated successfully!');
    } catch (error) {
      console.error('Failed to update lead status:', error);
      toast.error('Failed to update lead status. Please try again.');
    }
  }, [lead, dispatch]);

  return {
    hasOpportunity,
    handleConvert,
    handleStatusChange,
  };
}
