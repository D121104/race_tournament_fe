const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get auth token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const config: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData: any = {};
      try {
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          errorData = await response.json();
        } else {
          errorData = {
            message: response.statusText || `HTTP ${response.status}`,
            raw: await response.text().catch(() => '')
          };
        }
      } catch (parseError) {
        errorData = {
          message: response.statusText || `HTTP Error ${response.status}`
        };
      }

      throw new ApiError(
        response.status,
        errorData?.message || `HTTP Error ${response.status}`,
        errorData
      );
    }

    let data: ApiResponse<T>;
    try {
      data = await response.json();
    } catch (parseError) {
      throw new ApiError(500, 'Invalid JSON response from server', {
        error: parseError instanceof Error ? parseError.message : 'Parse error'
      });
    }

    // Validate response format
    if (!data || typeof data !== 'object') {
      throw new ApiError(
        500,
        'Invalid response format from server',
        data
      );
    }

    const isSuccess = data.code === 200 || data.code === 201 || data.code === 0;
    if (data.code && !isSuccess) {
      throw new ApiError(data.code, data.message || 'Server error', data);
    }

    if (!('result' in data)) {
      throw new ApiError(
        500,
        'Invalid response: missing result field',
        data
      );
    }

    return data.result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      0,
      error instanceof Error ? error.message : 'Network error occurred',
      error
    );
  }
}

export const api = {
  get: <T>(endpoint: string) => apiClient<T>(endpoint, { method: 'GET' }),

  post: <T>(endpoint: string, data?: any) =>
    apiClient<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: any) =>
    apiClient<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string) =>
    apiClient<T>(endpoint, { method: 'DELETE' }),
};
