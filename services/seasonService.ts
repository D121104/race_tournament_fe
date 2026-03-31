import { api } from '@/lib/api';
import {
  Season,
  SeasonsResponse,
  SeasonResponse,
  CreateSeasonRequest,
  UpdateSeasonRequest,
} from '@/types/season';

export const seasonService = {
  // GET /api/seasons/tournament/{tournamentId}/all - Lấy tất cả mùa giải của giải đua (không phân trang)
  async getSeasonsByTournament(tournamentId: number): Promise<Season[]> {
    return api.get<Season[]>(`/api/seasons/tournament/${tournamentId}/all`);
  },

  // GET /api/seasons/{seasonId} - Lấy mùa giải theo ID
  async getSeasonById(id: number): Promise<Season> {
    return api.get<Season>(`/api/seasons/${id}`);
  },

  // POST /api/seasons/create-season - Tạo mùa giải
  async createSeason(data: CreateSeasonRequest): Promise<Season> {
    return api.post<Season>('/api/seasons/create-season', data);
  },

  // POST /api/seasons/update-season/{seasonId} - Cập nhật mùa giải
  async updateSeason(id: number, data: UpdateSeasonRequest): Promise<Season> {
    return api.post<Season>(`/api/seasons/update-season/${id}`, data);
  },

  // DELETE /api/seasons/{seasonId} - Xóa mùa giải
  async deleteSeason(id: number): Promise<void> {
    return api.delete<void>(`/api/seasons/${id}`);
  },
};
