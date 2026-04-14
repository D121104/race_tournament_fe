import { api } from '@/lib/api';
import {
  Tournament,
  TournamentsResponse,
  TournamentResponse,
  CreateTournamentRequest,
  UpdateTournamentRequest,
} from '@/types/tournament';

export const tournamentService = {
  // GET /api/tournaments/all - Lấy tất cả giải đua (không phân trang)
  async getAllTournaments(): Promise<Tournament[]> {
    return api.get<Tournament[]>('/api/tournaments/all');
  },

};
