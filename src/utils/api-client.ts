import { APIRequestContext, APIResponse } from '@playwright/test';
import { AppConfig } from '@config/app.config';
import { Logger } from './logger';

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  data?: unknown;
}

/**
 * ApiClient
 * Reusable HTTP client wrapper around Playwright APIRequestContext.
 * Enables fast API-level data seeding, health checks, and assertions.
 */
export class ApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseURL: string = AppConfig.baseURL
  ) {}

  /**
   * Execute dynamic GET request
   */
  async get(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    const url = this.resolveURL(endpoint);
    Logger.step(`[API GET] ${url}`);
    const response = await this.request.get(url, {
      headers: options?.headers,
      params: options?.params,
    });
    return response;
  }

  /**
   * Execute dynamic POST request
   */
  async post(endpoint: string, data?: unknown, options?: RequestOptions): Promise<APIResponse> {
    const url = this.resolveURL(endpoint);
    Logger.step(`[API POST] ${url}`);
    const response = await this.request.post(url, {
      data: data ?? options?.data,
      headers: options?.headers,
      params: options?.params,
    });
    return response;
  }

  /**
   * Execute dynamic PUT request
   */
  async put(endpoint: string, data?: unknown, options?: RequestOptions): Promise<APIResponse> {
    const url = this.resolveURL(endpoint);
    Logger.step(`[API PUT] ${url}`);
    const response = await this.request.put(url, {
      data: data ?? options?.data,
      headers: options?.headers,
      params: options?.params,
    });
    return response;
  }

  /**
   * Execute dynamic DELETE request
   */
  async delete(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    const url = this.resolveURL(endpoint);
    Logger.step(`[API DELETE] ${url}`);
    const response = await this.request.delete(url, {
      headers: options?.headers,
      params: options?.params,
    });
    return response;
  }

  private resolveURL(endpoint: string): string {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    const cleanBase = this.baseURL.replace(/\/+$/, '');
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    return `${cleanBase}/${cleanEndpoint}`;
  }
}
