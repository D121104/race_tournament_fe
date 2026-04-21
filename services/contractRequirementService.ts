import { api } from '@/lib/api';
import {
  ContractRequirement,
  CreateContractRequirementRequest,
} from '@/types/sponsor';

export const contractRequirementService = {
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
