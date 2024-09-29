
class ApiService {
  baseUrl: string;
  authToken?: string | null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL!;
  }

  constructHeaders(parameters?: Record<string, string> | null): RequestInit {
    const headers = new Headers();
    if (this.authToken) {
      headers.append('Authorization', `Bearer ${this.authToken}`);
    }

    for (const key of Object.keys(parameters ?? {})) {
      headers.append(key, parameters![key]);
    }

    return {
      headers,
      credentials:
        process.env.NEXT_PUBLIC_APP_ENVIRONMENT === 'production'
          ? 'include'
          : 'same-origin',
    };
  }

  async handleResponse<T>(
    response: Response,
    endpoint: string
  ): Promise<{ ok: boolean; data?: T; error?: string }> {
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      data = { message: 'Invalid JSON response' };
    }

    if (!response.ok) {
      const errorData = data as { message?: string };

      console.log('API ERROR: ', errorData.message, response.status, endpoint);

      return {
        ok: false,
        error: errorData.message ?? 'Server did not respond',
      };
    }

    return {
      ok: true,
      data: data as T,
    };
  }

  async get<T>(
    endpoint: string,
    parameters?: Record<string, string> | null
  ): Promise<{ ok: boolean; data?: T; error?: string }> {
    const completeUrl = new URL(`${this.baseUrl}/${endpoint}`);
    if (parameters) {
      for (const key of Object.keys(parameters))
        completeUrl.searchParams.append(key, parameters[key]);
    }

    try {
      const response = await fetch(completeUrl.toString(), {
        ...this.constructHeaders(),
        method: 'GET',
      });
      return this.handleResponse<T>(response, endpoint);
    } catch (error: unknown) {
      console.log('API ERROR: ', error);
      return { ok: false, error: 'Fetch request failed' };
    }
  }

  async post<T>(
    endpoint: string,
    body: unknown,
    parameters?: Record<string, string> | null
  ): Promise<{ ok: boolean; data?: T; error?: string }> {
    const completeUrl = `${this.baseUrl}/${endpoint}`;

    try {
      const response = await fetch(completeUrl, {
        ...this.constructHeaders(),
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          ...this.constructHeaders(parameters).headers,
        },
      });
      return this.handleResponse<T>(response, endpoint);
    } catch (error: unknown) {
      console.log('API ERROR: ', error);
      return { ok: false, error: 'Fetch request failed' };
    }
  }

  async put<T>(
    endpoint: string,
    body: unknown,
    parameters?: Record<string, string> | null
  ): Promise<{ ok: boolean; data?: T; error?: string }> {
    const completeUrl = `${this.baseUrl}/${endpoint}`;

    try {
      const response = await fetch(completeUrl, {
        ...this.constructHeaders(),
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          ...this.constructHeaders(parameters).headers,
        },
      });
      return this.handleResponse<T>(response, endpoint);
    } catch (error: unknown) {
      console.log('API ERROR: ', error);
      return { ok: false, error: 'Fetch request failed' };
    }
  }

  async patch<T>(
    endpoint: string,
    body: unknown,
    parameters?: Record<string, string> | null
  ): Promise<{ ok: boolean; data?: T; error?: string }> {
    const completeUrl = `${this.baseUrl}/${endpoint}`;

    try {
      const response = await fetch(completeUrl, {
        ...this.constructHeaders(),
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          ...this.constructHeaders(parameters).headers,
        },
      });
      return this.handleResponse<T>(response, endpoint);
    } catch (error: unknown) {
      console.log('API ERROR: ', error);
      return { ok: false, error: 'Fetch request failed' };
    }
  }

  async delete<T>(
    endpoint: string,
    parameters?: Record<string, string> | null
  ): Promise<{ ok: boolean; data?: T; error?: string }> {
    const completeUrl = new URL(`${this.baseUrl}/${endpoint}`);
    if (parameters) {
      for (const key of Object.keys(parameters))
        completeUrl.searchParams.append(key, parameters[key]);
    }

    try {
      const response = await fetch(completeUrl.toString(), {
        ...this.constructHeaders(),
        method: 'DELETE',
      });
      return this.handleResponse<T>(response, endpoint);
    } catch (error: unknown) {
      console.log('API ERROR: ', error);
      return { ok: false, error: 'Fetch request failed' };
    }
  }
}

const apiService = new ApiService();
export default apiService;
