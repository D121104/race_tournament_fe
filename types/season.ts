export interface Season {
  id: number;
  tournamentId: number;
  seasonName: string;
  yearOfOrganization: number;
  description?: string;
}

export interface SeasonResponse {
  code: number;
  message: string;
  result: Season;
}

export interface SeasonsResponse {
  code: number;
  message: string;
  result: Season[];
}

export interface CreateSeasonRequest {
  tournamentId: number;
  seasonName: string;
  yearOfOrganization: number;
  description?: string;
}

export interface UpdateSeasonRequest {
  tournamentId: number;
  seasonName: string;
  yearOfOrganization: number;
  description?: string;
}
