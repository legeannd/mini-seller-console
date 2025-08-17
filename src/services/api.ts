import type { Lead, Opportunity } from '../types';

const NETWORK_SAVE_DELAY = 500;
const FAILURE_RATE = 0.05;

class ApiService {
  async fetchLeads(): Promise<Lead[]> {
    try {
      const response = await fetch('/leads.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch leads: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      throw new Error(`Failed to load leads: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateLead(lead: Lead): Promise<Lead> {
    await new Promise(resolve => setTimeout(resolve, NETWORK_SAVE_DELAY));

    if (Math.random() < FAILURE_RATE) {
      throw new Error('Failed to save lead. Please try again.');
    }

    return lead;
  }

  async convertLead(lead: Lead, amount?: number): Promise<{ lead: Lead; opportunity: Opportunity }> {
    await new Promise(resolve => setTimeout(resolve, NETWORK_SAVE_DELAY));

    if (Math.random() < FAILURE_RATE) {
      throw new Error('Failed to convert lead. Please try again.');
    }

    const convertedLead: Lead = {
      ...lead,
      status: 'Converted',
    };

    const opportunity: Opportunity = {
      id: `opp-${lead.id}-${Date.now()}`,
      leadId: lead.id,
      name: lead.name,
      company: lead.company,
      amount,
      createdAt: new Date().toISOString(),
    };

    return { lead: convertedLead, opportunity };
  }
}

export const apiService = new ApiService();
