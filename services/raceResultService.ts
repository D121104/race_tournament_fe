import { api } from '@/lib/api';
import {
  RaceResultResponse,
  UpdateRaceResultRequest,
  BatchUpdateRaceResultItem,
  RaceResult,
} from '@/types/raceResult';

export const raceResultService = {
  // GET /api/race-results/race/{raceId} - Lấy tất cả kết quả theo chặng đua
  async getResultsByRaceId(raceId: number): Promise<RaceResultResponse[]> {
    return api.get<RaceResultResponse[]>(`/api/race-results/race/${raceId}`);
  },

  // POST /api/race-results/update/{resultId} - Cập nhật 1 kết quả
  async updateResult(resultId: number, data: UpdateRaceResultRequest): Promise<RaceResult> {
    return api.post<RaceResult>(`/api/race-results/update/${resultId}`, data);
  },

  // POST /api/race-results/race/{raceId}/batch-update - Cập nhật hàng loạt kết quả
  async batchUpdateResults(raceId: number, items: BatchUpdateRaceResultItem[]): Promise<RaceResult[]> {
    return api.post<RaceResult[]>(`/api/race-results/race/${raceId}/batch-update`, items);
  },
};
