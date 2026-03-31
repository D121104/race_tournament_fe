export interface Race {
  id: number;
  seasonId: number;
  raceName: string;
  description?: string;
  location: string;
  date: string;
  length: number;
  numberOfLaps: number;
}

export interface RaceResponse {
  code: number;
  message: string;
  result: Race;
}

export interface RacesResponse {
  code: number;
  message: string;
  result: Race[];
}

export interface CreateRaceRequest {
  seasonId: number;
  raceName: string;
  description?: string;
  location: string;
  date: string;
  length: number;
  numberOfLaps: number;
}

export interface UpdateRaceRequest {
  seasonId: number;
  raceName: string;
  description?: string;
  location: string;
  date: string;
  length: number;
  numberOfLaps: number;
}
