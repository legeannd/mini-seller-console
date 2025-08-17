import { useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useAppContext } from "@/hooks/useAppContext";
import { useAsyncAction } from "@/hooks/useAsync";
import { usePersistence } from "@/hooks/usePersistence";
import { SearchAndFilters } from "@/components/SearchAndFilters";
import { LeadsList } from "@/components/LeadsList";
import { LeadDetail } from "@/components/LeadDetail";
import { OpportunitiesList } from "@/components/OpportunitiesList";
import { apiService } from "@/services/api";
import type { Lead, LeadStatus } from "@/types";

export function MainPage() {
  const { state, dispatch } = useAppContext();
  const { execute: executeSave } = useAsyncAction();

  const filteredLeads = useMemo(() => {
    let filtered = state.leads;

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(query) ||
          lead.company.toLowerCase().includes(query)
      );
    }

    if (state.statusFilter !== "All") {
      filtered = filtered.filter((lead) => lead.status === state.statusFilter);
    }

    if (state.sortByScore) {
      filtered = [...filtered].sort((a, b) => b.score - a.score);
    }

    return filtered;
  }, [state.leads, state.searchQuery, state.statusFilter, state.sortByScore]);

  const handleSearchChange = useCallback(
    (query: string) => {
      dispatch({ type: "SEARCH_CHANGED", payload: query });
    },
    [dispatch]
  );

  const handleStatusFilterChange = useCallback(
    (status: LeadStatus | "All") => {
      dispatch({ type: "FILTER_CHANGED", payload: status });
    },
    [dispatch]
  );

  const handleSortChange = useCallback(
    (sortByScore: boolean) => {
      dispatch({ type: "SORT_CHANGED", payload: sortByScore });
    },
    [dispatch]
  );

  const handleLeadClick = useCallback(
    (lead: Lead) => {
      dispatch({ type: "DETAIL_PANEL_OPENED", payload: lead });
    },
    [dispatch]
  );

  const handleDetailPanelClose = useCallback(() => {
    dispatch({ type: "DETAIL_PANEL_CLOSED" });
  }, [dispatch]);

  const handleLeadSave = useCallback(
    async (lead: Lead) => {
      const originalLead = state.selectedLead;

      await executeSave(async () => {
        try {
          dispatch({ type: "LEAD_UPDATED", payload: lead });

          const updatedLead = await apiService.updateLead(lead);
          dispatch({ type: "LEAD_UPDATED", payload: updatedLead });

          toast.success("Lead updated successfully");
        } catch (error) {
          if (originalLead) {
            dispatch({ type: "LEAD_UPDATED", payload: originalLead });
          }

          const message =
            error instanceof Error ? error.message : "Failed to save lead";
          toast.error(message);
          throw error;
        }
      });
    },
    [dispatch, state.selectedLead, executeSave]
  );

  usePersistence();

  useEffect(() => {
    const loadLeads = async () => {
      try {
        dispatch({ type: "LEADS_LOADING" });
        const leads = await apiService.fetchLeads();
        dispatch({ type: "LEADS_LOADED", payload: leads });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load leads";
        dispatch({ type: "ERROR_SET", payload: message });
        toast.error(message);
      }
    };

    loadLeads();
  }, [dispatch]);

  if (state.error && !state.leads.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Application
          </h1>
          <p className="text-gray-600 mb-4">{state.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Mini Seller Console
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your leads and convert them into opportunities
            </p>
          </header>

          <div className="space-y-8">
            <SearchAndFilters
              searchQuery={state.searchQuery}
              statusFilter={state.statusFilter}
              sortByScore={state.sortByScore}
              onSearchChange={handleSearchChange}
              onStatusFilterChange={handleStatusFilterChange}
              onSortChange={handleSortChange}
            />

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Leads ({filteredLeads.length})
              </h2>
              <LeadsList
                leads={filteredLeads}
                opportunities={state.opportunities}
                isLoading={state.isLoading}
                onLeadClick={handleLeadClick}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Opportunities ({state.opportunities.length})
              </h2>
              <OpportunitiesList opportunities={state.opportunities} />
            </section>
          </div>
        </div>
      </div>
      <LeadDetail
        lead={state.selectedLead}
        isOpen={state.isDetailPanelOpen}
        onClose={handleDetailPanelClose}
        onSave={handleLeadSave}
      />
    </>
  );
}
