/**
 * Tests for Chat Message Hook
 * @module hooks/chat-message.test
 */

import { describe, it, expect, beforeEach } from "bun:test";
import { createChatMessageHook } from "./chat-message.js";
import {
  createMockPluginContext,
  createMockMemoryManager,
} from "../test-utils.js";
import type { PluginContext } from "../core/types.js";

// Create mock types to avoid dependency on @opencode-ai/sdk types
function createMockMessage() {
  return { content: "test" } as any;
}

function createMockParts(texts: string[]) {
  return texts.map(text => ({ type: "text", text })) as any[];
}

function createMockOutput(texts: string[]) {
  return {
    message: createMockMessage(),
    parts: createMockParts(texts),
  };
}

describe("createChatMessageHook", () => {
  let ctx: PluginContext;
  let testDir: string;

  beforeEach(() => {
    testDir = `/tmp/chat-message-test-${Date.now()}`;
    ctx = createMockPluginContext({
      testDir,
      config: {
        memory: {
          enabled: true,
          capture: {
            enabled: true,
            captureMessages: true,
            minImportanceThreshold: 4,
          },
        },
      },
      includeMemory: true,
    });
  });

  describe("hook creation", () => {
    it("creates a function", () => {
      const hook = createChatMessageHook(ctx);
      expect(typeof hook).toBe("function");
    });

    it("uses default config when not provided", () => {
      const ctxNoConfig = createMockPluginContext({ testDir });
      const hook = createChatMessageHook(ctxNoConfig);
      expect(hook).toBeDefined();
    });
  });

  describe("session tracking", () => {
    it("updates last activity timestamp", async () => {
      const hook = createChatMessageHook(ctx);
      const initialActivity = ctx.stateManager.getState().workflow.lastActivity;

      // Wait a bit to ensure timestamp changes
      await new Promise(r => setTimeout(r, 10));

      const input = {
        sessionID: "test-session",
        agent: "test-agent",
        messageID: "msg-123",
      };

      const output = createMockOutput(["Hello world"]);

      await hook(input, output);

      const newActivity = ctx.stateManager.getState().workflow.lastActivity;
      expect(new Date(newActivity).getTime()).toBeGreaterThanOrEqual(
        new Date(initialActivity).getTime()
      );
    });

    it("appends to history", async () => {
      const hook = createChatMessageHook(ctx);
      
      // Track history appends
      let historyEntry: any;
      const originalAppend = ctx.stateManager.appendHistory;
      ctx.stateManager.appendHistory = (entry) => {
        historyEntry = entry;
        originalAppend.call(ctx.stateManager, entry);
      };

      const input = {
        sessionID: "test-session",
        agent: "test-agent",
        messageID: "msg-456",
      };

      const output = createMockOutput(["Test message"]);

      await hook(input, output);

      expect(historyEntry).toBeDefined();
      expect(historyEntry.type).toBe("tool_call");
      expect(historyEntry.sessionId).toBe("test-session");
      expect(historyEntry.data.type).toBe("chat_message");
      expect(historyEntry.data.agent).toBe("test-agent");
      expect(historyEntry.data.messageID).toBe("msg-456");
    });
  });

  describe("message capture", () => {
    it("captures significant messages when memory manager exists", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const hook = createChatMessageHook(ctx);

      const input = {
        sessionID: "test-session",
        agent: "test-agent",
        messageID: "msg-789",
      };

      const output = createMockOutput(["Can you implement a new feature for user authentication?"]);

      await hook(input, output);

      // Check if memory was saved
      const recent = await mockMemory.getRecent(1);
      expect(recent.length).toBeGreaterThan(0);
      expect(recent[0].type).toBe("user_prompt");
    });

    it("captures questions (messages with ?)", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const hook = createChatMessageHook(ctx);

      const input = { sessionID: "test-session" };
      const output = createMockOutput(["How does this work?"]);

      await hook(input, output);

      const recent = await mockMemory.getRecent(1);
      expect(recent.length).toBe(1);
      expect(recent[0].importance).toBe(6); // Questions get higher importance
    });

    it("captures commands (messages starting with /)", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const hook = createChatMessageHook(ctx);

      const input = { sessionID: "test-session" };
      const output = createMockOutput(["/goop-plan new feature"]);

      await hook(input, output);

      const recent = await mockMemory.getRecent(1);
      expect(recent.length).toBe(1);
    });

    it("captures long messages (> 100 chars)", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const hook = createChatMessageHook(ctx);

      const input = { sessionID: "test-session" };
      const longMessage = "a".repeat(150);
      const output = createMockOutput([longMessage]);

      await hook(input, output);

      const recent = await mockMemory.getRecent(1);
      expect(recent.length).toBe(1);
    });

    it("captures messages with requirement keywords", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const hook = createChatMessageHook(ctx);

      const keywords = ["must", "should", "need", "require", "want", "implement", "create", "build", "fix", "debug"];

      for (const keyword of keywords) {
        const input = { sessionID: `session-${keyword}` };
        const output = createMockOutput([`Please ${keyword} this`]);

        await hook(input, output);
      }

      const recent = await mockMemory.getRecent(20);
      expect(recent.length).toBeGreaterThan(0);
    });

    it("does not capture when capture is disabled", async () => {
      const ctxDisabled = createMockPluginContext({
        testDir,
        config: {
          memory: {
            enabled: true,
            capture: {
              enabled: true,
              captureMessages: false, // Disabled
            },
          },
        },
        includeMemory: true,
      });

      const hook = createChatMessageHook(ctxDisabled);

      const input = { sessionID: "test-session" };
      const output = createMockOutput(["Can you implement this feature?"]);

      await hook(input, output);

      const recent = await ctxDisabled.memoryManager!.getRecent(1);
      expect(recent.length).toBe(0);
    });

    it("does not capture empty messages", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const hook = createChatMessageHook(ctx);

      const input = { sessionID: "test-session" };
      const output = createMockOutput(["   "]); // Whitespace only

      await hook(input, output);

      const recent = await mockMemory.getRecent(1);
      expect(recent.length).toBe(0);
    });

    it("does not capture non-significant messages", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const hook = createChatMessageHook(ctx);

      const input = { sessionID: "test-session" };
      const output = createMockOutput(["ok"]); // Too short, no keywords

      await hook(input, output);

      const recent = await mockMemory.getRecent(1);
      expect(recent.length).toBe(0);
    });

    it("handles memory save errors gracefully", async () => {
      const errorMemory = createMockMemoryManager();
      errorMemory.save = async () => {
        throw new Error("Save failed");
      };
      ctx.memoryManager = errorMemory;

      const hook = createChatMessageHook(ctx);

      const input = { sessionID: "test-session" };
      const output = createMockOutput(["Can you implement this feature?"]);

      // Should not throw
      await expect(hook(input, output)).resolves.toBeUndefined();
    });

    it("includes current phase in saved memory", async () => {
      ctx.stateManager.updateWorkflow({ phase: "execute" });
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const hook = createChatMessageHook(ctx);

      const input = { sessionID: "test-session" };
      const output = createMockOutput(["Can you implement this?"]);

      await hook(input, output);

      const recent = await mockMemory.getRecent(1);
      expect(recent[0].phase).toBe("execute");
    });

    it("truncates long message titles", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const hook = createChatMessageHook(ctx);

      const input = { sessionID: "test-session" };
      const longMessage = "a".repeat(200);
      const output = createMockOutput([longMessage]);

      await hook(input, output);

      const recent = await mockMemory.getRecent(1);
      expect(recent[0].title.length).toBeLessThanOrEqual(83); // 80 + "..."
    });

    it("truncates long message content", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const hook = createChatMessageHook(ctx);

      const input = { sessionID: "test-session" };
      const longMessage = "a".repeat(3000);
      const output = createMockOutput([longMessage]);

      await hook(input, output);

      const recent = await mockMemory.getRecent(1);
      expect(recent[0].content.length).toBeLessThanOrEqual(2000);
    });
  });

  describe("extractTextFromParts", () => {
    it("extracts text from multiple text parts", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const hook = createChatMessageHook(ctx);

      const input = { sessionID: "test-session" };
      const output = createMockOutput([
        "First part. Can you implement",
        "this feature?",
      ]);

      await hook(input, output);

      const recent = await mockMemory.getRecent(1);
      expect(recent.length).toBe(1);
    });

    it("ignores non-text parts", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const hook = createChatMessageHook(ctx);

      const input = { sessionID: "test-session" };
      const output = {
        message: createMockMessage(),
        parts: [
          { type: "text", text: "Can you implement this?" },
          { type: "tool-invocation", toolInvocationId: "123", toolName: "test", state: "result", result: "ok" },
        ],
      } as any;

      await hook(input, output);

      const recent = await mockMemory.getRecent(1);
      expect(recent.length).toBe(1);
    });
  });

  describe("without memory manager", () => {
    it("works without memory manager", async () => {
      const ctxNoMemory = createMockPluginContext({ testDir });
      delete ctxNoMemory.memoryManager;

      const hook = createChatMessageHook(ctxNoMemory);

      const input = { sessionID: "test-session" };
      const output = createMockOutput(["Test message"]);

      // Should not throw
      await expect(hook(input, output)).resolves.toBeUndefined();
    });
  });
});
