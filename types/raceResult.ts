export interface RaceResult {
  id: number;
  raceId: number;
  racerId: string;
  time: string;
  lapsCompleted: string;
  finalPosition: string;
  status: 'Finished' | 'DNF' | 'DSQ';
  points: number;
}

export interface RaceResultResponse {
  id: number;
  racer: Racer;
  time: string;
  lapsCompleted: string;
  finalPosition: string;
  status: 'Finished' | 'DNF' | 'DSQ';
  points: number;
}

export interface Racer {
  id: number;
  seasonId: number;
  racerName: string;
  gender: string;
  nationality: string;
}

export interface UpdateRaceResultRequest {
  time?: string;
  lapsCompleted?: string;
  finalPosition?: string;
  status?: 'Finished' | 'DNF' | 'DSQ';
  points?: number;
}

export interface BatchUpdateRaceResultItem {
  resultId: number;
  time?: string;
  lapsCompleted?: string;
  finalPosition?: string;
  status?: 'Finished' | 'DNF' | 'DSQ';
  points?: number;
}
