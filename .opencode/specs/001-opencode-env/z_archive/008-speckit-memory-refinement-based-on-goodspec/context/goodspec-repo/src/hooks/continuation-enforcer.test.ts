/**
 * Unit Tests for Continuation Enforcer Hook
 * 
 * Note: The continuation enforcer now uses the event-based pattern from oh-my-opencode,
 * which requires a PluginInput with client access. Full integration testing requires
 * mocking the OpenCode client APIs.
 * 
 * @module hooks/continuation-enforcer.test
 */

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import {
  createContinuationEnforcer,
  updateTodoCount,
  isContinuationActive,
  getPromptCount,
  resetContinuation,
} from "./continuation-enforcer.js";
import { createMockPluginContext, setupTestEnvironment } from "../test-utils.js";

describe("continuation-enforcer", () => {
  let cleanup: () => void;
  const sessionId = "test-session-123";

  beforeEach(() => {
    const env = setupTestEnvironment("continuation-test");
    cleanup = env.cleanup;
  });

  afterEach(() => {
    cleanup();
  });

  describe("legacy exports", () => {
    // These are legacy exports for backward compatibility
    // The actual enforcement now happens via event handlers
    
    it("updateTodoCount does not throw", () => {
      expect(() => updateTodoCount(sessionId, 5)).not.toThrow();
    });

    it("isContinuationActive returns false (legacy)", () => {
      expect(isContinuationActive(sessionId)).toBe(false);
    });

    it("getPromptCount returns 0 (legacy)", () => {
      expect(getPromptCount(sessionId)).toBe(0);
    });

    it("resetContinuation does not throw", () => {
      expect(() => resetContinuation(sessionId)).not.toThrow();
    });
  });

  describe("createContinuationEnforcer", () => {
    it("creates enforcer with handler function", () => {
      const ctx = createMockPluginContext();
      const mockInput = {
        client: {
          session: {
            todo: async () => ({ data: [] }),
            prompt: async () => ({}),
            messages: async () => ({ data: [] }),
          },
          tui: {
            showToast: async () => {},
          },
        },
        directory: "/test",
      } as never;
      
      const enforcer = createContinuationEnforcer(ctx, mockInput);
      
      expect(typeof enforcer.handler).toBe("function");
      expect(typeof enforcer.markRecovering).toBe("function");
      expect(typeof enforcer.markRecoveryComplete).toBe("function");
      expect(typeof enforcer.cancelAllCountdowns).toBe("function");
    });

    it("handler handles session.idle event", async () => {
      const ctx = createMockPluginContext();
      const mockInput = {
        client: {
          session: {
            todo: async () => ({ data: [] }), // No todos
            prompt: async () => ({}),
            messages: async () => ({ data: [] }),
          },
          tui: {
            showToast: async () => {},
          },
        },
        directory: "/test",
      } as never;
      
      const enforcer = createContinuationEnforcer(ctx, mockInput);
      
      // Should not throw
      await enforcer.handler({
        event: {
          type: "session.idle",
          properties: { sessionID: sessionId },
        },
      });
    });

    it("handler handles session.deleted event", async () => {
      const ctx = createMockPluginContext();
      const mockInput = {
        client: {
          session: {
            todo: async () => ({ data: [] }),
            prompt: async () => ({}),
            messages: async () => ({ data: [] }),
          },
          tui: {
            showToast: async () => {},
          },
        },
        directory: "/test",
      } as never;
      
      const enforcer = createContinuationEnforcer(ctx, mockInput);
      
      // Should not throw
      await enforcer.handler({
        event: {
          type: "session.deleted",
          properties: { info: { id: sessionId } },
        },
      });
    });

    it("markRecovering prevents continuation injection", async () => {
      const ctx = createMockPluginContext();
      let promptCalled = false;
      
      const mockInput = {
        client: {
          session: {
            todo: async () => ({ 
              data: [
                { id: "1", content: "Test", status: "pending", priority: "high" }
              ] 
            }),
            prompt: async () => {
              promptCalled = true;
              return {};
            },
            messages: async () => ({ data: [] }),
          },
          tui: {
            showToast: async () => {},
          },
        },
        directory: "/test",
      } as never;
      
      const enforcer = createContinuationEnforcer(ctx, mockInput, { countdownSeconds: 0 });
      
      // Mark as recovering
      enforcer.markRecovering(sessionId);
      
      // Trigger session.idle - should not inject because recovering
      await enforcer.handler({
        event: {
          type: "session.idle",
          properties: { sessionID: sessionId },
        },
      });
      
      // Give it a moment (countdown is 0 seconds)
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Prompt should not have been called because we're recovering
      expect(promptCalled).toBe(false);
    });
  });
});
