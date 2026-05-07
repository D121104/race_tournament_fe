import { api } from "@/lib/api";
import { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth";

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> =>
    api.post<AuthResponse>("/api/auth/login", data),

  register: async (data: RegisterRequest): Promise<AuthResponse> =>
    api.post<AuthResponse>("/api/auth/register", data),
};
