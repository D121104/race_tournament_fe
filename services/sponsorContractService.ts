import { api } from '@/lib/api';
import {
  SponsorContractResponse,
  CreateSponsorContractRequest,
} from '@/types/sponsor';

export const sponsorContractService = {
  async getAllContracts(): Promise<SponsorContractResponse[]> {
    return api.get<SponsorContractResponse[]>('/api/sponsor-contracts');
  },

  async createContract(data: CreateSponsorContractRequest): Promise<SponsorContractResponse> {
    return api.post<SponsorContractResponse>('/api/sponsor-contracts/create', data);
  },
};
