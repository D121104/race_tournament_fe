import { api } from '@/lib/api';
import {
  Season,
} from '@/types/season';

export const seasonService = {
  // GET /api/seasons/tournament/{tournamentId}/all - Lấy tất cả mùa giải của giải đua
  async getSeasonsByTournament(tournamentId: number): Promise<Season[]> {
    return api.get<Season[]>(`/api/seasons/tournament/${tournamentId}/all`);
  },

};
