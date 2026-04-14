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


  // GET /api/races/seasons/{seasonId}/all - Lấy tất cả chặng đua theo mùa giải
  async getRacesBySeason(seasonId: number): Promise<Race[]> {
    return api.get<Race[]>(`/api/races/seasons/${seasonId}/all`);
  },

};
