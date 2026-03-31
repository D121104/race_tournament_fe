export interface Tournament {
  id: number;
  tournamentName: string;
  description?: string;
}

export interface TournamentResponse {
  code: number;
  message: string;
  result: Tournament;
}

export interface TournamentsResponse {
  code: number;
  message: string;
  result: Tournament[];
}

export interface CreateTournamentRequest {
  tournamentName: string;
  description?: string;
}

export interface UpdateTournamentRequest {
  tournamentName: string;
  description?: string;
}
