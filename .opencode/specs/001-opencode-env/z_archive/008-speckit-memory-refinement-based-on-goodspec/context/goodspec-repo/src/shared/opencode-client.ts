/**
 * OpenCode Client Utilities
 * Centralized client creation and API helpers for reliable client usage
 * 
 * Key patterns:
 * - Session APIs may return 401 in certain hook contexts
 * - TUI endpoints remain accessible as fallback
 * - Disk fallback for todo reading when APIs fail
 * 
 * @module shared/opencode-client
 */

import type { PluginInput } from "@opencode-ai/plugin";
import { createOpencodeClient } from "@opencode-ai/sdk";
import { log, logError } from "./logger.js";

// ============================================================================
// Types
// ============================================================================

/**
 * Minimal OpenCode client interface covering common operations
 * This represents what we use from the SDK client
 */
export interface OpenCodeClient {
  session: {
    prompt(params: {
      path: { id: string };
      body: { parts: Array<{ type: string; text: string }> };
      query?: { directory?: string };
    }): Promise<unknown>;
    todo(params: {
      path: { id: string };
      query?: { directory?: string };
    }): Promise<unknown>;
  };
  tui: {
    showToast(params: {
      body: {
        title: string;
        message: string;
        variant: "info" | "warning" | "error" | "success";
        duration?: number;
      };
    }): Promise<unknown>;
    clearPrompt(params: { query?: { directory?: string } }): Promise<unknown>;
    appendPrompt(params: {
      query?: { directory?: string };
      body: { text: string };
    }): Promise<unknown>;
    submitPrompt(params: { query?: { directory?: string } }): Promise<unknown>;
  };
  app?: {
    agents(): Promise<{
      data?: Array<{ name: string; mode?: string; model?: { providerID: string; modelID: string } }>;
    }>;
  };
}

/**
 * Configuration for client creation
 */
export interface ClientConfig {
  /** Directory scope for API calls */
  directory?: string;
  /** Whether to create authenticated client when password is set */
  useAuth?: boolean;
}

/**
 * Result of a safe API call
 */
export interface SafeCallResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================================================
// Client Factory
// ============================================================================

/**
 * Create an OpenCode client, optionally with authentication.
 * 
 * When OPENCODE_SERVER_PASSWORD is set, the plugin's in-process fetch
 * still goes through basicAuth middleware, so we need to add the
 * Authorization header.
 * 
 * @param input - Plugin input containing client and server URL
 * @param config - Optional configuration
 * @returns OpenCode client instance
 */
export function createAuthenticatedClient(
  input: PluginInput,
  config: ClientConfig = {}
): OpenCodeClient {
  const { useAuth = true } = config;
  const password = process.env.OPENCODE_SERVER_PASSWORD;
  
  if (!password || !useAuth) {
    // No auth configured or not requested, use the default plugin client
    return input.client as OpenCodeClient;
  }
  
  const username = process.env.OPENCODE_SERVER_USERNAME ?? "opencode";
  const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
  
  log("[opencode-client] Creating authenticated client", { username, hasPassword: true });
  
  return createOpencodeClient({
    baseUrl: input.serverUrl.toString(),
    headers: {
      "Authorization": authHeader,
    },
  }) as OpenCodeClient;
}

/**
 * Get directory from plugin input for API calls
 */
export function getDirectory(input: PluginInput): string {
  return input.directory;
}

// ============================================================================
// Safe API Wrappers
// ============================================================================

/**
 * Execute an API call safely with error handling and logging
 * 
 * @param operation - Description of the operation for logging
 * @param fn - Async function to execute
 * @returns SafeCallResult with success status and data or error
 */
export async function safeApiCall<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<SafeCallResult<T>> {
  try {
    const data = await fn();
    log(`[opencode-client] ${operation} succeeded`);
    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logError(`[opencode-client] ${operation} failed`, error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Check if an API response indicates an error (openapi-fetch pattern)
 * openapi-fetch returns {error, request, response} on failure
 */
export function isApiError(response: unknown): response is { error: unknown; response?: { status?: number } } {
  if (!response || typeof response !== "object") return false;
  return "error" in response && (response as Record<string, unknown>).error !== undefined;
}

// ============================================================================
// TUI Fallback Helpers
// ============================================================================

/**
 * Inject a prompt using TUI endpoints as fallback.
 * This is useful when session.prompt() fails (e.g., 401 Unauthorized).
 * 
 * Order of operations:
 * 1. Clear any existing prompt text
 * 2. Append the new prompt text
 * 3. Submit the prompt
 * 
 * @param client - OpenCode client
 * @param prompt - Text to inject
 * @param directory - Directory scope
 * @returns Promise resolving to success status
 */
export async function injectPromptViaTui(
  client: OpenCodeClient,
  prompt: string,
  directory: string
): Promise<boolean> {
  try {
    // Clear existing prompt (ignore errors - might already be empty)
    await client.tui.clearPrompt({ query: { directory } }).catch(() => {});
    
    // Append the prompt text
    await client.tui.appendPrompt({
      query: { directory },
      body: { text: prompt },
    });
    
    // Submit the prompt
    await client.tui.submitPrompt({ query: { directory } });
    
    log("[opencode-client] TUI prompt injection successful");
    return true;
  } catch (error) {
    logError("[opencode-client] TUI prompt injection failed", error);
    return false;
  }
}

/**
 * Inject a prompt with fallback strategy.
 * Tries session.prompt first, falls back to TUI on failure.
 * 
 * @param client - OpenCode client
 * @param sessionId - Session ID for session.prompt
 * @param prompt - Text to inject
 * @param directory - Directory scope
 * @returns Promise resolving to success status and method used
 */
export async function injectPromptWithFallback(
  client: OpenCodeClient,
  sessionId: string,
  prompt: string,
  directory: string
): Promise<{ success: boolean; method: "session" | "tui" | "none" }> {
  // Try session.prompt first
  try {
    const response = await client.session.prompt({
      path: { id: sessionId },
      body: {
        parts: [{ type: "text", text: prompt }],
      },
      query: { directory },
    });
    
    // Check for API error response
    if (isApiError(response)) {
      log("[opencode-client] session.prompt returned error, trying TUI fallback", {
        status: response.response?.status,
      });
    } else {
      log("[opencode-client] session.prompt succeeded");
      return { success: true, method: "session" };
    }
  } catch (error) {
    log("[opencode-client] session.prompt threw, trying TUI fallback", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
  
  // Fallback to TUI
  const tuiSuccess = await injectPromptViaTui(client, prompt, directory);
  if (tuiSuccess) {
    return { success: true, method: "tui" };
  }
  
  logError("[opencode-client] Both session.prompt and TUI fallback failed", null);
  return { success: false, method: "none" };
}

/**
 * Show a toast notification
 * 
 * @param client - OpenCode client
 * @param title - Toast title
 * @param message - Toast message
 * @param variant - Toast variant (info, warning, error, success)
 * @param duration - Duration in milliseconds
 */
export async function showToast(
  client: OpenCodeClient,
  title: string,
  message: string,
  variant: "info" | "warning" | "error" | "success" = "info",
  duration = 3000
): Promise<boolean> {
  try {
    await client.tui.showToast({
      body: { title, message, variant, duration },
    });
    return true;
  } catch (error) {
    log("[opencode-client] Toast failed", { error: String(error) });
    return false;
  }
}

// ============================================================================
// Agent Fetching
// ============================================================================

/**
 * Fetch available agents from OpenCode
 * Returns empty array on failure (graceful degradation)
 * 
 * @param client - OpenCode client
 * @returns Array of agent names
 */
export async function fetchAvailableAgents(
  client: OpenCodeClient
): Promise<string[]> {
  try {
    const result = await client.app?.agents?.();
    const agents = result?.data?.map((agent) => agent.name) ?? [];
    log("[opencode-client] Fetched agents", { count: agents.length });
    return agents;
  } catch (error) {
    logError("[opencode-client] Failed to fetch agents", error);
    return [];
  }
}
