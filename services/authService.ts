import { LoginRequest, SignUpRequest, UserResponse, AuthApiResponse } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const authService = {
  async login(data: LoginRequest): Promise<UserResponse> {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/log-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json: AuthApiResponse<UserResponse> = await res.json();
    if (!res.ok || json.code !== 200) {
      throw new Error(json.message || 'Đăng nhập thất bại');
    }
    return json.result;
  },

  async signUp(data: SignUpRequest): Promise<UserResponse> {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json: AuthApiResponse<UserResponse> = await res.json();
    if (!res.ok || json.code !== 200) {
      throw new Error(json.message || 'Đăng ký thất bại');
    }
    return json.result;
  },

  // Token management
  saveAuth(user: UserResponse) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', user.token.accessToken);
      localStorage.setItem('refreshToken', user.token.refreshToken);
      localStorage.setItem('user', JSON.stringify({ id: user.id, fullName: user.fullName, username: user.username }));
    }
  },

  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  },

  getUser(): { id: number; fullName: string; username: string } | null {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },
};
