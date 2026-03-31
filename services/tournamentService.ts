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

  // GET /api/tournaments/{tournamentId} - Lấy thông tin 1 giải đua
  async getTournamentById(id: number): Promise<Tournament> {
    return api.get<Tournament>(`/api/tournaments/${id}`);
  },

  // POST /api/tournaments/create-tournament - Tạo giải đua mới
  async createTournament(data: CreateTournamentRequest): Promise<Tournament> {
    return api.post<Tournament>('/api/tournaments/create-tournament', data);
  },

  // POST /api/tournaments/update-tournament/{tournamentId} - Cập nhật giải đua
  async updateTournament(id: number, data: UpdateTournamentRequest): Promise<Tournament> {
    return api.post<Tournament>(`/api/tournaments/update-tournament/${id}`, data);
  },

  // DELETE /api/tournaments/{tournamentId} - Xóa giải đua
  async deleteTournament(id: number): Promise<void> {
    return api.delete<void>(`/api/tournaments/${id}`);
  },
};
