/**
 * Tests for OpenCode Client Utilities
 * @module shared/opencode-client.test
 */

import { describe, it, expect, beforeEach, afterEach, mock } from "bun:test";
import type { PluginInput } from "@opencode-ai/plugin";
import {
  createAuthenticatedClient,
  injectPromptWithFallback,
  injectPromptViaTui,
  fetchAvailableAgents,
  showToast,
  safeApiCall,
  isApiError,
  type OpenCodeClient,
} from "./opencode-client.js";

// ============================================================================
// Mock Client Factory
// ============================================================================

function createMockClient(overrides: Partial<OpenCodeClient> = {}): OpenCodeClient {
  return {
    session: {
      prompt: mock(() => Promise.resolve({ data: {} })),
      todo: mock(() => Promise.resolve({ data: [] })),
    },
    tui: {
      showToast: mock(() => Promise.resolve({})),
      clearPrompt: mock(() => Promise.resolve({})),
      appendPrompt: mock(() => Promise.resolve({})),
      submitPrompt: mock(() => Promise.resolve({})),
    },
    app: {
      agents: mock(() => Promise.resolve({ data: [{ name: "general" }, { name: "explore" }] })),
    },
    ...overrides,
  };
}

function createMockPluginInput(client: OpenCodeClient = createMockClient()): PluginInput {
  return {
    client,
    project: { id: "test-project", name: "Test" },
    directory: "/tmp/test",
    worktree: "/tmp/test",
    serverUrl: new URL("http://localhost:3000"),
  } as unknown as PluginInput;
}

// ============================================================================
// createAuthenticatedClient Tests
// ============================================================================

describe("createAuthenticatedClient", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns input.client when no password is set", () => {
    delete process.env.OPENCODE_SERVER_PASSWORD;
    
    const mockClient = createMockClient();
    const input = createMockPluginInput(mockClient);
    
    const result = createAuthenticatedClient(input);
    
    expect(result).toBe(mockClient);
  });

  it("returns input.client when useAuth is false", () => {
    process.env.OPENCODE_SERVER_PASSWORD = "secret";
    
    const mockClient = createMockClient();
    const input = createMockPluginInput(mockClient);
    
    const result = createAuthenticatedClient(input, { useAuth: false });
    
    expect(result).toBe(mockClient);
  });

  it("creates authenticated client when password is set", () => {
    process.env.OPENCODE_SERVER_PASSWORD = "secret";
    process.env.OPENCODE_SERVER_USERNAME = "admin";
    
    const mockClient = createMockClient();
    const input = createMockPluginInput(mockClient);
    
    const result = createAuthenticatedClient(input);
    
    // Should return a different client (the SDK client)
    expect(result).not.toBe(mockClient);
  });

  it("uses default username 'opencode' when not specified", () => {
    process.env.OPENCODE_SERVER_PASSWORD = "secret";
    delete process.env.OPENCODE_SERVER_USERNAME;
    
    const mockClient = createMockClient();
    const input = createMockPluginInput(mockClient);
    
    // Should not throw
    const result = createAuthenticatedClient(input);
    expect(result).toBeDefined();
  });
});

// ============================================================================
// isApiError Tests
// ============================================================================

describe("isApiError", () => {
  it("returns true for error response object", () => {
    const errorResponse = { error: "Not found", response: { status: 404 } };
    expect(isApiError(errorResponse)).toBe(true);
  });

  it("returns false for successful response", () => {
    const successResponse = { data: [] };
    expect(isApiError(successResponse)).toBe(false);
  });

  it("returns false for null", () => {
    expect(isApiError(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isApiError(undefined)).toBe(false);
  });

  it("returns false for primitive values", () => {
    expect(isApiError("error")).toBe(false);
    expect(isApiError(123)).toBe(false);
  });
});

// ============================================================================
// safeApiCall Tests
// ============================================================================

describe("safeApiCall", () => {
  it("returns success with data on successful call", async () => {
    const result = await safeApiCall("test operation", async () => ({ value: 42 }));
    
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ value: 42 });
    expect(result.error).toBeUndefined();
  });

  it("returns failure with error message on exception", async () => {
    const result = await safeApiCall("failing operation", async () => {
      throw new Error("Something went wrong");
    });
    
    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
    expect(result.error).toBe("Something went wrong");
  });

  it("handles non-Error exceptions", async () => {
    const result = await safeApiCall("string error", async () => {
      throw "string error";
    });
    
    expect(result.success).toBe(false);
    expect(result.error).toBe("string error");
  });
});

// ============================================================================
// injectPromptViaTui Tests
// ============================================================================

describe("injectPromptViaTui", () => {
  it("calls TUI methods in correct order", async () => {
    const client = createMockClient();
    
    const result = await injectPromptViaTui(client, "test prompt", "/tmp/test");
    
    expect(result).toBe(true);
    expect(client.tui.clearPrompt).toHaveBeenCalled();
    expect(client.tui.appendPrompt).toHaveBeenCalledWith({
      query: { directory: "/tmp/test" },
      body: { text: "test prompt" },
    });
    expect(client.tui.submitPrompt).toHaveBeenCalledWith({
      query: { directory: "/tmp/test" },
    });
  });

  it("returns false on appendPrompt failure", async () => {
    const client = createMockClient({
      tui: {
        showToast: mock(() => Promise.resolve({})),
        clearPrompt: mock(() => Promise.resolve({})),
        appendPrompt: mock(() => Promise.reject(new Error("Append failed"))),
        submitPrompt: mock(() => Promise.resolve({})),
      },
    });
    
    const result = await injectPromptViaTui(client, "test", "/tmp/test");
    
    expect(result).toBe(false);
  });

  it("continues even if clearPrompt fails", async () => {
    const client = createMockClient({
      tui: {
        showToast: mock(() => Promise.resolve({})),
        clearPrompt: mock(() => Promise.reject(new Error("Clear failed"))),
        appendPrompt: mock(() => Promise.resolve({})),
        submitPrompt: mock(() => Promise.resolve({})),
      },
    });
    
    const result = await injectPromptViaTui(client, "test", "/tmp/test");
    
    expect(result).toBe(true);
    expect(client.tui.appendPrompt).toHaveBeenCalled();
  });
});

// ============================================================================
// injectPromptWithFallback Tests
// ============================================================================

describe("injectPromptWithFallback", () => {
  it("uses session.prompt when successful", async () => {
    const client = createMockClient();
    
    const result = await injectPromptWithFallback(
      client,
      "session-123",
      "test prompt",
      "/tmp/test"
    );
    
    expect(result.success).toBe(true);
    expect(result.method).toBe("session");
    expect(client.session.prompt).toHaveBeenCalledWith({
      path: { id: "session-123" },
      body: { parts: [{ type: "text", text: "test prompt" }] },
      query: { directory: "/tmp/test" },
    });
  });

  it("falls back to TUI when session.prompt throws", async () => {
    const client = createMockClient({
      session: {
        prompt: mock(() => Promise.reject(new Error("401 Unauthorized"))),
        todo: mock(() => Promise.resolve({ data: [] })),
      },
    });
    
    const result = await injectPromptWithFallback(
      client,
      "session-123",
      "test prompt",
      "/tmp/test"
    );
    
    expect(result.success).toBe(true);
    expect(result.method).toBe("tui");
    expect(client.tui.appendPrompt).toHaveBeenCalled();
  });

  it("falls back to TUI when session.prompt returns error response", async () => {
    const client = createMockClient({
      session: {
        prompt: mock(() => Promise.resolve({ error: "Unauthorized", response: { status: 401 } })),
        todo: mock(() => Promise.resolve({ data: [] })),
      },
    });
    
    const result = await injectPromptWithFallback(
      client,
      "session-123",
      "test prompt",
      "/tmp/test"
    );
    
    expect(result.success).toBe(true);
    expect(result.method).toBe("tui");
  });

  it("returns failure when both methods fail", async () => {
    const client = createMockClient({
      session: {
        prompt: mock(() => Promise.reject(new Error("Session failed"))),
        todo: mock(() => Promise.resolve({ data: [] })),
      },
      tui: {
        showToast: mock(() => Promise.resolve({})),
        clearPrompt: mock(() => Promise.resolve({})),
        appendPrompt: mock(() => Promise.reject(new Error("TUI failed"))),
        submitPrompt: mock(() => Promise.resolve({})),
      },
    });
    
    const result = await injectPromptWithFallback(
      client,
      "session-123",
      "test prompt",
      "/tmp/test"
    );
    
    expect(result.success).toBe(false);
    expect(result.method).toBe("none");
  });
});

// ============================================================================
// showToast Tests
// ============================================================================

describe("showToast", () => {
  it("calls tui.showToast with correct parameters", async () => {
    const client = createMockClient();
    
    const result = await showToast(client, "Title", "Message", "warning", 5000);
    
    expect(result).toBe(true);
    expect(client.tui.showToast).toHaveBeenCalledWith({
      body: {
        title: "Title",
        message: "Message",
        variant: "warning",
        duration: 5000,
      },
    });
  });

  it("uses default values for variant and duration", async () => {
    const client = createMockClient();
    
    await showToast(client, "Title", "Message");
    
    expect(client.tui.showToast).toHaveBeenCalledWith({
      body: {
        title: "Title",
        message: "Message",
        variant: "info",
        duration: 3000,
      },
    });
  });

  it("returns false on failure", async () => {
    const client = createMockClient({
      tui: {
        showToast: mock(() => Promise.reject(new Error("Toast failed"))),
        clearPrompt: mock(() => Promise.resolve({})),
        appendPrompt: mock(() => Promise.resolve({})),
        submitPrompt: mock(() => Promise.resolve({})),
      },
    });
    
    const result = await showToast(client, "Title", "Message");
    
    expect(result).toBe(false);
  });
});

// ============================================================================
// fetchAvailableAgents Tests
// ============================================================================

describe("fetchAvailableAgents", () => {
  it("returns agent names on success", async () => {
    const client = createMockClient();
    
    const result = await fetchAvailableAgents(client);
    
    expect(result).toEqual(["general", "explore"]);
  });

  it("returns empty array when app.agents is undefined", async () => {
    const client = createMockClient({ app: undefined });
    
    const result = await fetchAvailableAgents(client);
    
    expect(result).toEqual([]);
  });

  it("returns empty array on failure", async () => {
    const client = createMockClient({
      app: {
        agents: mock(() => Promise.reject(new Error("Failed to fetch"))),
      },
    });
    
    const result = await fetchAvailableAgents(client);
    
    expect(result).toEqual([]);
  });

  it("returns empty array when data is null", async () => {
    const client = createMockClient({
      app: {
        agents: mock(() => Promise.resolve({ data: null })),
      },
    });
    
    const result = await fetchAvailableAgents(client);
    
    expect(result).toEqual([]);
  });
});
