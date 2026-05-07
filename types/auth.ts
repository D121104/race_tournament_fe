export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  fullName?: string;
  dateOfBirth?: string;
}

export interface UserProfile {
  id: number;
  username: string;
  fullName?: string;
  dateOfBirth?: string;
  role?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: UserProfile;
}
