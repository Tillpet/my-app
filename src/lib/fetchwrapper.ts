import logger from './logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  status: number;
  message: string;
};

type Interceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>;

class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  private interceptors: Interceptor[] = [];

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  use(interceptor: Interceptor) {
    this.interceptors.push(interceptor);
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const base = this.baseURL.endsWith('/') ? this.baseURL : `${this.baseURL}/`;
    const url = new URL(endpoint.startsWith('/') ? endpoint.slice(1) : endpoint, base);

    const headers = new Headers({
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...(options.headers as Record<string, string>),
    });

    if (typeof window === 'undefined') {
      try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();
        if (cookieHeader) {
          headers.set('Cookie', cookieHeader);
        }
      } catch {
        // not in RSC context
      }
    }

    let body = options.body;
    if (body && typeof body !== 'string' && !(body instanceof FormData)) {
      body = JSON.stringify(body);
    }

    let config: RequestInit = { ...options, headers, body };

    for (const interceptor of this.interceptors) {
      config = await interceptor(config);
    }

    try {
      const response = await fetch(url.toString(), config);
      const status = response.status;
      const json = await response.json();

      if (!response.ok) {
        const message =
          json?.message || json?.error || `Request failed: ${response.status} ${response.statusText}`;

        logger.error({ err: { status, data: json } }, message);

        return { success: false, data: null, status, message };
      }

      return { success: true, data: json as T, status, message: 'OK' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';

      logger.error({ err }, message);

      return { success: false, data: null, status: 0, message };
    }
  }

  get<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  put<T>(endpoint: string, body?: unknown, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  patch<T>(endpoint: string, body?: unknown, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  delete<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient();
export { ApiClient };