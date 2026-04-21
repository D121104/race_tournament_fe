import { api } from '@/lib/api';
import {
  Sponsor,
  CreateSponsorRequest,
} from '@/types/sponsor';

export const sponsorService = {
  async getAllSponsors(): Promise<Sponsor[]> {
    return api.get<Sponsor[]>('/api/sponsors');
  },

  async createSponsor(data: CreateSponsorRequest): Promise<Sponsor> {
    return api.post<Sponsor>('/api/sponsors/create', data);
  },
};
