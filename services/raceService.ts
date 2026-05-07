import { api } from '@/lib/api';
import {
  Race,

} from '@/types/race';


export const raceService = {


  // GET /api/races/seasons/{seasonId}/all - Lấy tất cả chặng đua theo mùa giải
  async getRacesBySeason(seasonId: number): Promise<Race[]> {
    return api.get<Race[]>(`/api/races/seasons/${seasonId}/all`);
  },

};
