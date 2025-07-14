import * as dotenv from 'dotenv';
dotenv.config();

export abstract class BaseClient {
  protected readonly BASE_URL_V1 = 'https://api.gupy.io/api/v1';
  protected readonly BASE_URL_V2 = 'https://api.gupy.io/api/v2';
  protected readonly headers: Headers;

  constructor() {
    const token = process.env.GUPY_API_KEY;
    if (!token) throw new Error('Missing GUPY_API_KEY');

    this.headers = new Headers({
      Authorization: `Bearer ${token}`,
    });
  }

  protected async fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url, {
      method: 'GET',
      headers: this.headers,
    });

    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    return await res.json() as T;
  }
}
