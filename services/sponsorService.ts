import { api } from '@/lib/api';
import {
  Sponsor,
  CreateSponsorRequest,
  UpdateSponsorRequest,
  SponsorContractResponse,
  CreateSponsorContractRequest,
  UpdateSponsorContractRequest,
  ContractRequirement,
  CreateContractRequirementRequest,
} from '@/types/sponsor';

export const sponsorService = {
  // --- Sponsor ---
  async getAllSponsors(): Promise<Sponsor[]> {
    return api.get<Sponsor[]>('/api/sponsors');
  },

  async getSponsorById(id: number): Promise<Sponsor> {
    return api.get<Sponsor>(`/api/sponsors/${id}`);
  },

  async createSponsor(data: CreateSponsorRequest): Promise<Sponsor> {
    return api.post<Sponsor>('/api/sponsors/create', data);
  },

  async updateSponsor(id: number, data: UpdateSponsorRequest): Promise<Sponsor> {
    return api.post<Sponsor>(`/api/sponsors/update/${id}`, data);
  },

  async deleteSponsor(id: number): Promise<void> {
    return api.delete<void>(`/api/sponsors/${id}`);
  },

  // --- Contract ---
  async getAllContracts(): Promise<SponsorContractResponse[]> {
    return api.get<SponsorContractResponse[]>('/api/sponsor-contracts');
  },

  async getContractsByTournament(tournamentId: number): Promise<SponsorContractResponse[]> {
    return api.get<SponsorContractResponse[]>(`/api/sponsor-contracts/tournament/${tournamentId}`);
  },

  async getContractById(id: number): Promise<SponsorContractResponse> {
    return api.get<SponsorContractResponse>(`/api/sponsor-contracts/${id}`);
  },

  async createContract(data: CreateSponsorContractRequest): Promise<SponsorContractResponse> {
    return api.post<SponsorContractResponse>('/api/sponsor-contracts/create', data);
  },

  async updateContract(id: number, data: UpdateSponsorContractRequest): Promise<SponsorContractResponse> {
    return api.post<SponsorContractResponse>(`/api/sponsor-contracts/update/${id}`, data);
  },

  async activateContract(id: number): Promise<SponsorContractResponse> {
    return api.post<SponsorContractResponse>(`/api/sponsor-contracts/${id}/activate`);
  },

  async cancelContract(id: number): Promise<SponsorContractResponse> {
    return api.post<SponsorContractResponse>(`/api/sponsor-contracts/${id}/cancel`);
  },

  async deleteContract(id: number): Promise<void> {
    return api.delete<void>(`/api/sponsor-contracts/${id}`);
  },

  // --- Contract Requirements ---
  async getAllRequirements(): Promise<ContractRequirement[]> {
    return api.get<ContractRequirement[]>('/api/contract-requirements');
  },

  async createRequirement(data: CreateContractRequirementRequest): Promise<ContractRequirement> {
    return api.post<ContractRequirement>('/api/contract-requirements/create', data);
  },

  async deleteRequirement(id: number): Promise<void> {
    return api.delete<void>(`/api/contract-requirements/${id}`);
  },
};
