/**
 * Hooks Tests
 * Tests all GoopSpec hooks
 * 
 * @module hooks/hooks.test
 */

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { mkdirSync, rmSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import type { PluginContext, GoopSpecConfig } from "../core/types.js";
import { createResourceResolver } from "../core/resolver.js";
import { createStateManager } from "../features/state-manager/manager.js";
import { createHooks } from "./index.js";
import { createChatMessageHook } from "./chat-message.js";
import { createToolLifecycleHooks } from "./tool-lifecycle.js";
import { createEventHandler } from "./event-handler.js";

// Test constants
const TEST_DIR = join(tmpdir(), `goopspec-hooks-test-${Date.now()}`);
const GOOPSPEC_DIR = join(TEST_DIR, ".goopspec");

// Default config for tests
const defaultConfig: GoopSpecConfig = {
  enforcement: "assist",
  constitution: true,
  adlEnabled: true,
  defaultModel: "anthropic/claude-sonnet-4-5",
};

/**
 * Create test fixture directories
 */
function setupTestFixtures() {
  mkdirSync(TEST_DIR, { recursive: true });
  mkdirSync(GOOPSPEC_DIR, { recursive: true });
}

/**
 * Create a plugin context for testing
 */
function createTestContext(): PluginContext {
  return {
    input: {
      client: {},
      project: { name: "test-project" },
      directory: TEST_DIR,
      worktree: TEST_DIR,
      serverUrl: new URL("http://localhost:3000"),
    },
    config: defaultConfig,
    resolver: createResourceResolver(TEST_DIR),
    stateManager: createStateManager(TEST_DIR, "test-project"),
  };
}

describe("Hooks", () => {
  beforeEach(() => {
    setupTestFixtures();
  });

  afterEach(() => {
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  describe("createHooks", () => {
    it("creates all expected hooks", () => {
      const ctx = createTestContext();
      const hooks = createHooks(ctx);

      expect(hooks.event).toBeDefined();
      expect(hooks["chat.message"]).toBeDefined();
      expect(hooks["tool.execute.before"]).toBeDefined();
      expect(hooks["tool.execute.after"]).toBeDefined();
    });

    it("all hooks are functions", () => {
      const ctx = createTestContext();
      const hooks = createHooks(ctx);

      expect(typeof hooks.event).toBe("function");
      expect(typeof hooks["chat.message"]).toBe("function");
      expect(typeof hooks["tool.execute.before"]).toBe("function");
      expect(typeof hooks["tool.execute.after"]).toBe("function");
    });
  });

  describe("chat.message hook", () => {
    it("updates last activity timestamp", async () => {
      const ctx = createTestContext();
      const hook = createChatMessageHook(ctx);

      const initialState = ctx.stateManager.getState();
      const initialActivity = initialState.workflow.lastActivity;

      // Wait a bit to ensure timestamp differs
      await new Promise((resolve) => setTimeout(resolve, 10));

      await hook(
        {
          sessionID: "test-session",
          agent: "test-agent",
          messageID: "msg-123",
        },
        {
          message: { role: "user" } as any,
          parts: [],
        }
      );

      const newState = ctx.stateManager.getState();
      expect(new Date(newState.workflow.lastActivity).getTime()).toBeGreaterThanOrEqual(
        new Date(initialActivity).getTime()
      );
    });

    it("tracks message in history", async () => {
      const ctx = createTestContext();
      const hook = createChatMessageHook(ctx);

      await hook(
        {
          sessionID: "test-session-456",
          agent: "test-agent",
          messageID: "msg-789",
        },
        {
          message: { role: "user" } as any,
          parts: [],
        }
      );

      // Check history file exists
      const historyDir = join(GOOPSPEC_DIR, "history");
      const dateStr = new Date().toISOString().split("T")[0];
      const historyPath = join(historyDir, `${dateStr}.json`);

      expect(existsSync(historyPath)).toBe(true);

      const history = JSON.parse(readFileSync(historyPath, "utf-8"));
      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBeGreaterThan(0);
      
      const lastEntry = history[history.length - 1];
      expect(lastEntry.data.sessionID || lastEntry.sessionId).toContain("test-session");
    });
  });

  describe("tool lifecycle hooks", () => {
    it("tracks tool.execute.before", async () => {
      const ctx = createTestContext();
      const hooks = createToolLifecycleHooks(ctx);

      await hooks["tool.execute.before"](
        {
          tool: "test_tool",
          sessionID: "session-abc",
          callID: "call-123",
        },
        {
          args: { param: "value" },
        }
      );

      // Check history
      const historyDir = join(GOOPSPEC_DIR, "history");
      const dateStr = new Date().toISOString().split("T")[0];
      const historyPath = join(historyDir, `${dateStr}.json`);

      const history = JSON.parse(readFileSync(historyPath, "utf-8"));
      const beforeEntry = history.find(
        (e: any) => e.data.phase === "before" && e.data.tool === "test_tool"
      );

      expect(beforeEntry).toBeDefined();
      expect(beforeEntry.data.callID).toBe("call-123");
    });

    it("tracks tool.execute.after", async () => {
      const ctx = createTestContext();
      const hooks = createToolLifecycleHooks(ctx);

      await hooks["tool.execute.after"](
        {
          tool: "test_tool",
          sessionID: "session-abc",
          callID: "call-456",
        },
        {
          title: "Test Tool",
          output: "Tool output",
          metadata: { success: true },
        }
      );

      // Check history
      const historyDir = join(GOOPSPEC_DIR, "history");
      const dateStr = new Date().toISOString().split("T")[0];
      const historyPath = join(historyDir, `${dateStr}.json`);

      const history = JSON.parse(readFileSync(historyPath, "utf-8"));
      const afterEntry = history.find(
        (e: any) => e.data.phase === "after" && e.data.tool === "test_tool"
      );

      expect(afterEntry).toBeDefined();
      expect(afterEntry.data.callID).toBe("call-456");
      expect(afterEntry.data.title).toBe("Test Tool");
    });

    it("updates last activity after tool execution", async () => {
      const ctx = createTestContext();
      const hooks = createToolLifecycleHooks(ctx);

      const initialState = ctx.stateManager.getState();
      const initialActivity = initialState.workflow.lastActivity;

      await new Promise((resolve) => setTimeout(resolve, 10));

      await hooks["tool.execute.after"](
        {
          tool: "test_tool",
          sessionID: "session-xyz",
          callID: "call-789",
        },
        {
          title: "Test",
          output: "Output",
          metadata: {},
        }
      );

      const newState = ctx.stateManager.getState();
      expect(new Date(newState.workflow.lastActivity).getTime()).toBeGreaterThanOrEqual(
        new Date(initialActivity).getTime()
      );
    });
  });

  describe("event handler", () => {
    it("handles session.created event", async () => {
      const ctx = createTestContext();
      const handler = createEventHandler(ctx);

      await handler({
        event: {
          type: "session.created",
          properties: { sessionID: "new-session-123" },
        } as any,
      });

      // Check history
      const historyDir = join(GOOPSPEC_DIR, "history");
      const dateStr = new Date().toISOString().split("T")[0];
      const historyPath = join(historyDir, `${dateStr}.json`);

      const history = JSON.parse(readFileSync(historyPath, "utf-8"));
      const sessionEntry = history.find(
        (e: any) => e.data.event === "session.created"
      );

      expect(sessionEntry).toBeDefined();
    });

    it("handles session.deleted event", async () => {
      const ctx = createTestContext();
      const handler = createEventHandler(ctx);

      await handler({
        event: {
          type: "session.deleted",
          properties: { sessionID: "deleted-session-456" },
        } as any,
      });

      // Check history
      const historyDir = join(GOOPSPEC_DIR, "history");
      const dateStr = new Date().toISOString().split("T")[0];
      const historyPath = join(historyDir, `${dateStr}.json`);

      const history = JSON.parse(readFileSync(historyPath, "utf-8"));
      const sessionEntry = history.find(
        (e: any) => e.data.event === "session.deleted"
      );

      expect(sessionEntry).toBeDefined();
    });

    it("handles unknown events gracefully", async () => {
      const ctx = createTestContext();
      const handler = createEventHandler(ctx);

      // Should not throw
      await handler({
        event: {
          type: "unknown.event",
          properties: {},
        } as any,
      });

      // Should not throw for null/undefined
      await handler({ event: null as any });
      await handler({ event: {} as any });
    });
  });
});
