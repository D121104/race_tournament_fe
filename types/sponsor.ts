export interface Sponsor {
  id: number;
  sponsorName: string;
  industry?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface CreateSponsorRequest {
  sponsorName: string;
  industry?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export type SponsorContractStatus = 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

export interface ContractRequirement {
  id: number;
  requirementName: string;
  description?: string;
  category?: string;
}

export interface CreateContractRequirementRequest {
  requirementName: string;
  description?: string;
  category?: string;
}

export interface SponsorContractResponse {
  id: number;
  sponsorId: number;
  sponsorName: string;
  tournamentId: number;
  tournamentName: string;
  seasonId?: number;
  seasonName?: string;
  contractValue?: number;
  startDate?: string;
  endDate?: string;
  status: SponsorContractStatus;
  terms?: string;
  requirements: ContractRequirement[];
}

export interface CreateSponsorContractRequest {
  sponsorId: number;
  tournamentId: number;
  seasonId?: number;
  contractValue?: number;
  startDate?: string;
  endDate?: string;
  terms?: string;
  requirementIds?: number[];
  newRequirements?: {
    requirementName: string;
    description?: string;
    category?: string;
  }[];
}

