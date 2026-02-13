/**
 * Memory Worker HTTP Client
 * Communicates with the memory worker service
 * @module features/memory/client
 */

import type {
  Memory,
  MemoryInput,
  MemoryUpdate,
  MemoryType,
  SearchOptions,
  SearchResult,
  RawEvent,
  MemoryManager,
} from "./types.js";

/**
 * HTTP client for communicating with the memory worker service
 * Implements the MemoryManager interface
 */
export class MemoryClient implements MemoryManager {
  private baseUrl: string;
  private timeout: number;

  constructor(port: number = 37777, timeout: number = 30000) {
    this.baseUrl = `http://localhost:${port}`;
    this.timeout = timeout;
  }

  /**
   * Make an HTTP request with timeout
   */
  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("text/html")) {
          // Server returned HTML error page - worker not running or wrong endpoint
          throw new Error(`Memory worker not available (got HTML response on port ${this.baseUrl.split(":").pop()})`);
        }
        const error = await response.text();
        throw new Error(`HTTP ${response.status}: ${error.slice(0, 200)}`);
      }

      return (await response.json()) as T;
    } catch (err) {
      if (err instanceof TypeError && err.message.includes("fetch")) {
        // Connection refused or network error
        throw new Error(`Memory worker not running (connection failed to ${this.baseUrl})`);
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Check if the worker is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.request<{ status: string }>("GET", "/health");
      return response.status === "ok";
    } catch {
      return false;
    }
  }

  /**
   * Get worker status
   */
  async getStatus(): Promise<{
    status: string;
    version: string;
    initialized: boolean;
    storage: boolean;
    vectors: boolean;
  }> {
    return this.request("GET", "/health");
  }

  // ============================================================================
  // MemoryManager Interface Implementation
  // ============================================================================

  /**
   * Save a new memory
   */
  async save(input: MemoryInput): Promise<Memory> {
    return this.request<Memory>("POST", "/memories", input);
  }

  /**
   * Search memories
   */
  async search(options: SearchOptions): Promise<SearchResult[]> {
    const response = await this.request<{ results: SearchResult[] }>(
      "POST",
      "/search",
      options
    );
    return response.results;
  }

  /**
   * Get a memory by ID
   */
  async getById(id: number): Promise<Memory | null> {
    try {
      return await this.request<Memory>("GET", `/memories/${id}`);
    } catch {
      return null;
    }
  }

  /**
   * Get recent memories
   */
  async getRecent(limit: number, types?: MemoryType[]): Promise<Memory[]> {
    const params = new URLSearchParams({ limit: String(limit) });
    if (types?.length) {
      params.set("types", types.join(","));
    }

    const response = await this.request<{ memories: Memory[] }>(
      "GET",
      `/recent?${params.toString()}`
    );
    return response.memories;
  }

  /**
   * Update a memory
   */
  async update(id: number, updates: MemoryUpdate): Promise<Memory | null> {
    try {
      return await this.request<Memory>("PATCH", `/memories/${id}`, updates);
    } catch {
      return null;
    }
  }

  /**
   * Delete a memory
   */
  async delete(id: number): Promise<boolean> {
    try {
      await this.request<{ deleted: boolean }>("DELETE", `/memories/${id}`);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Distill a raw event into a memory (Phase 4)
   */
  async distill(event: RawEvent): Promise<Memory | null> {
    try {
      const response = await this.request<{ memory: Memory | null }>(
        "POST",
        "/distill",
        event
      );
      return response.memory;
    } catch {
      return null;
    }
  }

  // ============================================================================
  // Additional Operations
  // ============================================================================

  /**
   * Get storage statistics
   */
  async getStats(): Promise<{
    memories: number;
    vectors: number;
    vectorsAvailable: boolean;
  }> {
    return this.request("GET", "/stats");
  }

  /**
   * Request graceful shutdown
   */
  async shutdown(): Promise<void> {
    try {
      await this.request("POST", "/shutdown");
    } catch {
      // Ignore errors - server may shut down before responding
    }
  }
}
