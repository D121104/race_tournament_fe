export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignUpRequest {
  fullName: string;
  username: string;
  password: string;
  dateOfBirth: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UserResponse {
  id: number;
  fullName: string;
  username: string;
  token: TokenResponse;
}

export interface AuthApiResponse<T> {
  code: number;
  message: string;
  result: T;
}
