import { api } from '@/lib/api';
import {
  Race,
  RacesResponse,
  RaceResponse,
  CreateRaceRequest,
  UpdateRaceRequest,
} from '@/types/race';

// Interface cho Page response từ Spring Boot
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const raceService = {
  // GET /api/races/ - Lấy TẤT CẢ chặng đua (có phân trang, trả về Page object)
  async getAllRaces(page: number = 0, size: number = 100): Promise<Race[]> {
    const response = await api.get<PageResponse<Race>>(`/api/races/?page=${page}&size=${size}`);
    return response.content; // Extract content từ Page object
  },

  // GET /api/races/seasons/{seasonId}/all - Lấy tất cả chặng đua theo mùa giải (không phân trang)
  async getRacesBySeason(seasonId: number): Promise<Race[]> {
    return api.get<Race[]>(`/api/races/seasons/${seasonId}/all`);
  },

  // GET /api/races/{raceId} - Lấy thông tin 1 chặng đua
  async getRaceById(id: number): Promise<Race> {
    return api.get<Race>(`/api/races/${id}`);
  },

  // POST /api/races/create-race - Tạo chặng đua mới
  async createRace(data: CreateRaceRequest): Promise<Race> {
    return api.post<Race>('/api/races/create-race', data);
  },

  // POST /api/races/update-race/{raceId} - Cập nhật chặng đua
  async updateRace(id: number, data: UpdateRaceRequest): Promise<Race> {
    return api.post<Race>(`/api/races/update-race/${id}`, data);
  },

  // DELETE /api/races/delete-race/{raceId} - Xóa chặng đua
  async deleteRace(id: number): Promise<void> {
    return api.delete<void>(`/api/races/delete-race/${id}`);
  },
};
