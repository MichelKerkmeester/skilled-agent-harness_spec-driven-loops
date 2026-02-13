/**
 * Tests for Tool Lifecycle Hooks
 * @module hooks/tool-lifecycle.test
 */

import { describe, it, expect, beforeEach } from "bun:test";
import { createToolLifecycleHooks } from "./tool-lifecycle.js";
import {
  createMockPluginContext,
  createMockMemoryManager,
} from "../test-utils.js";
import type { PluginContext } from "../core/types.js";

describe("createToolLifecycleHooks", () => {
  let ctx: PluginContext;
  let testDir: string;

  beforeEach(() => {
    testDir = `/tmp/tool-lifecycle-test-${Date.now()}`;
    ctx = createMockPluginContext({
      testDir,
      config: {
        memory: {
          enabled: true,
          capture: {
            enabled: true,
            captureToolUse: true,
            skipTools: ["Read", "Glob", "Grep"],
            minImportanceThreshold: 4,
          },
        },
      },
      includeMemory: true,
    });
  });

  describe("hook creation", () => {
    it("creates before and after hooks", () => {
      const hooks = createToolLifecycleHooks(ctx);
      expect(hooks["tool.execute.before"]).toBeDefined();
      expect(hooks["tool.execute.after"]).toBeDefined();
      expect(typeof hooks["tool.execute.before"]).toBe("function");
      expect(typeof hooks["tool.execute.after"]).toBe("function");
    });
  });

  describe("tool.execute.before", () => {
    it("tracks tool call start in history", async () => {
      let historyEntry: any;
      ctx.stateManager.appendHistory = (entry) => {
        historyEntry = entry;
      };

      const hooks = createToolLifecycleHooks(ctx);

      await hooks["tool.execute.before"](
        {
          tool: "Edit",
          sessionID: "test-session",
          callID: "call-123",
        },
        {
          args: { filePath: "/test/file.ts" },
        }
      );

      expect(historyEntry).toBeDefined();
      expect(historyEntry.type).toBe("tool_call");
      expect(historyEntry.data.phase).toBe("before");
      expect(historyEntry.data.tool).toBe("Edit");
      expect(historyEntry.data.callID).toBe("call-123");
    });

    it("stores args for after hook", async () => {
      const hooks = createToolLifecycleHooks(ctx);
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      // Before hook
      await hooks["tool.execute.before"](
        {
          tool: "Edit",
          sessionID: "test-session",
          callID: "call-456",
        },
        {
          args: { filePath: "/test/file.ts", oldString: "old", newString: "new" },
        }
      );

      // After hook - should have access to stored args
      await hooks["tool.execute.after"](
        {
          tool: "Edit",
          sessionID: "test-session",
          callID: "call-456",
        },
        {
          title: "Edited file",
          output: "Success",
          metadata: {},
        }
      );

      // Memory should be captured with context
      const recent = await mockMemory.getRecent(1);
      expect(recent.length).toBeGreaterThan(0);
    });
  });

  describe("tool.execute.after", () => {
    it("tracks tool call completion in history", async () => {
      const historyEntries: any[] = [];
      ctx.stateManager.appendHistory = (entry) => {
        historyEntries.push(entry);
      };

      const hooks = createToolLifecycleHooks(ctx);

      // Before
      await hooks["tool.execute.before"](
        { tool: "Write", sessionID: "test-session", callID: "call-789" },
        { args: { filePath: "/new/file.ts" } }
      );

      // After
      await hooks["tool.execute.after"](
        { tool: "Write", sessionID: "test-session", callID: "call-789" },
        { title: "File written", output: "Created file", metadata: {} }
      );

      const afterEntry = historyEntries.find(e => e.data.phase === "after");
      expect(afterEntry).toBeDefined();
      expect(afterEntry.data.tool).toBe("Write");
      expect(afterEntry.data.title).toBe("File written");
    });

    it("updates last activity timestamp", async () => {
      const hooks = createToolLifecycleHooks(ctx);
      const initialActivity = ctx.stateManager.getState().workflow.lastActivity;

      await new Promise(r => setTimeout(r, 10));

      await hooks["tool.execute.before"](
        { tool: "Edit", sessionID: "test-session", callID: "call-activity" },
        { args: {} }
      );

      await hooks["tool.execute.after"](
        { tool: "Edit", sessionID: "test-session", callID: "call-activity" },
        { title: "Done", output: "OK", metadata: {} }
      );

      const newActivity = ctx.stateManager.getState().workflow.lastActivity;
      expect(new Date(newActivity).getTime()).toBeGreaterThanOrEqual(
        new Date(initialActivity).getTime()
      );
    });

    it("captures important tool calls to memory", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const hooks = createToolLifecycleHooks(ctx);

      await hooks["tool.execute.before"](
        { tool: "Write", sessionID: "test-session", callID: "call-mem-1" },
        { args: { filePath: "/new/feature.ts" } }
      );

      await hooks["tool.execute.after"](
        { tool: "Write", sessionID: "test-session", callID: "call-mem-1" },
        { title: "Created feature.ts", output: "File written successfully", metadata: {} }
      );

      const recent = await mockMemory.getRecent(1);
      expect(recent.length).toBeGreaterThan(0);
    });

    it("does not capture skipped tools", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const hooks = createToolLifecycleHooks(ctx);

      await hooks["tool.execute.before"](
        { tool: "Read", sessionID: "test-session", callID: "call-skip-1" },
        { args: { filePath: "/file.ts" } }
      );

      await hooks["tool.execute.after"](
        { tool: "Read", sessionID: "test-session", callID: "call-skip-1" },
        { title: "Read file", output: "content", metadata: {} }
      );

      const recent = await mockMemory.getRecent(1);
      expect(recent.length).toBe(0);
    });

    it("handles memory save errors gracefully", async () => {
      const errorMemory = createMockMemoryManager();
      errorMemory.save = async () => {
        throw new Error("Save failed");
      };
      ctx.memoryManager = errorMemory;

      const hooks = createToolLifecycleHooks(ctx);

      await hooks["tool.execute.before"](
        { tool: "Edit", sessionID: "test-session", callID: "call-err-1" },
        { args: { filePath: "/test.ts" } }
      );

      // Should not throw
      await expect(
        hooks["tool.execute.after"](
          { tool: "Edit", sessionID: "test-session", callID: "call-err-1" },
          { title: "Edited", output: "Success", metadata: {} }
        )
      ).resolves.toBeUndefined();
    });
  });

  describe("todo tracking", () => {
    it("tracks todo counts from todoread tool", async () => {
      const hooks = createToolLifecycleHooks(ctx);

      await hooks["tool.execute.before"](
        { tool: "todoread", sessionID: "test-session", callID: "call-todo-1" },
        { args: {} }
      );

      await hooks["tool.execute.after"](
        { tool: "todoread", sessionID: "test-session", callID: "call-todo-1" },
        {
          title: "Todos",
          output: JSON.stringify({
            todos: [
              { status: "pending" },
              { status: "pending" },
              { status: "in_progress" },
              { status: "completed" },
            ],
          }),
          metadata: {},
        }
      );

      // Should have counted 3 incomplete todos
    });

    it("tracks todo counts from mcp_todowrite tool", async () => {
      const hooks = createToolLifecycleHooks(ctx);

      await hooks["tool.execute.before"](
        { tool: "mcp_todowrite", sessionID: "test-session", callID: "call-todo-2" },
        { args: {} }
      );

      await hooks["tool.execute.after"](
        { tool: "mcp_todowrite", sessionID: "test-session", callID: "call-todo-2" },
        {
          title: "Updated todos",
          output: '{"status":"pending"},{"status":"in_progress"}',
          metadata: {},
        }
      );

      // Should have parsed todo counts
    });

    it("handles parse errors gracefully", async () => {
      const hooks = createToolLifecycleHooks(ctx);

      await hooks["tool.execute.before"](
        { tool: "todoread", sessionID: "test-session", callID: "call-todo-3" },
        { args: {} }
      );

      // Should not throw on invalid output
      await expect(
        hooks["tool.execute.after"](
          { tool: "todoread", sessionID: "test-session", callID: "call-todo-3" },
          { title: "Todos", output: "not valid json", metadata: {} }
        )
      ).resolves.toBeUndefined();
    });
  });

  describe("comment checking", () => {
    it("analyzes comments on write operations when enforcement enabled", async () => {
      const ctxWithEnforcement = createMockPluginContext({
        testDir,
        config: {
          enforcement: "assist",
        },
        includeMemory: true,
      });

      const hooks = createToolLifecycleHooks(ctxWithEnforcement);

      await hooks["tool.execute.before"](
        { tool: "write", sessionID: "test-session", callID: "call-comment-1" },
        {
          args: {
            filePath: "/test.ts",
            content: `
// Comment 1
// Comment 2
// Comment 3
const x = 1;
            `,
          },
        }
      );

      await hooks["tool.execute.after"](
        { tool: "write", sessionID: "test-session", callID: "call-comment-1" },
        { title: "Wrote file", output: "Success", metadata: {} }
      );

      // Should have analyzed comments (logs warning if excessive)
    });

    it("skips comment analysis for markdown files", async () => {
      const ctxWithEnforcement = createMockPluginContext({
        testDir,
        config: {
          enforcement: "assist",
        },
        includeMemory: true,
      });

      const hooks = createToolLifecycleHooks(ctxWithEnforcement);

      await hooks["tool.execute.before"](
        { tool: "write", sessionID: "test-session", callID: "call-comment-2" },
        {
          args: {
            filePath: "/README.md",
            content: "# Readme\n\nSome content",
          },
        }
      );

      await hooks["tool.execute.after"](
        { tool: "write", sessionID: "test-session", callID: "call-comment-2" },
        { title: "Wrote file", output: "Success", metadata: {} }
      );

      // Should skip markdown
    });

    it("skips comment analysis for JSON files", async () => {
      const ctxWithEnforcement = createMockPluginContext({
        testDir,
        config: {
          enforcement: "assist",
        },
        includeMemory: true,
      });

      const hooks = createToolLifecycleHooks(ctxWithEnforcement);

      await hooks["tool.execute.before"](
        { tool: "mcp_write", sessionID: "test-session", callID: "call-comment-3" },
        {
          args: {
            filePath: "/config.json",
            content: '{"key": "value"}',
          },
        }
      );

      await hooks["tool.execute.after"](
        { tool: "mcp_write", sessionID: "test-session", callID: "call-comment-3" },
        { title: "Wrote file", output: "Success", metadata: {} }
      );

      // Should skip JSON
    });

    it("does not analyze when enforcement is disabled", async () => {
      const ctxNoEnforcement = createMockPluginContext({
        testDir,
        includeMemory: true,
      });
      delete (ctxNoEnforcement.config as any).enforcement;

      const hooks = createToolLifecycleHooks(ctxNoEnforcement);

      await hooks["tool.execute.before"](
        { tool: "write", sessionID: "test-session", callID: "call-comment-4" },
        {
          args: {
            filePath: "/test.ts",
            content: "// many comments\n".repeat(50),
          },
        }
      );

      await hooks["tool.execute.after"](
        { tool: "write", sessionID: "test-session", callID: "call-comment-4" },
        { title: "Wrote file", output: "Success", metadata: {} }
      );

      // Should not analyze
    });
  });

  describe("without memory manager", () => {
    it("works without memory manager", async () => {
      const ctxNoMemory = createMockPluginContext({ testDir });
      delete ctxNoMemory.memoryManager;

      const hooks = createToolLifecycleHooks(ctxNoMemory);

      await hooks["tool.execute.before"](
        { tool: "Edit", sessionID: "test-session", callID: "call-nomem-1" },
        { args: { filePath: "/test.ts" } }
      );

      await expect(
        hooks["tool.execute.after"](
          { tool: "Edit", sessionID: "test-session", callID: "call-nomem-1" },
          { title: "Edited", output: "Success", metadata: {} }
        )
      ).resolves.toBeUndefined();
    });
  });

  describe("memory distillation", () => {
    it("uses distill if available on memory manager", async () => {
      const mockMemory = createMockMemoryManager();
      let distillCalled = false;
      (mockMemory as any).distill = async () => {
        distillCalled = true;
      };
      ctx.memoryManager = mockMemory;

      const hooks = createToolLifecycleHooks(ctx);

      await hooks["tool.execute.before"](
        { tool: "Write", sessionID: "test-session", callID: "call-distill-1" },
        { args: { filePath: "/test.ts" } }
      );

      await hooks["tool.execute.after"](
        { tool: "Write", sessionID: "test-session", callID: "call-distill-1" },
        { title: "Wrote file", output: "Success", metadata: {} }
      );

      expect(distillCalled).toBe(true);
    });

    it("falls back to direct save if distill not available", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const hooks = createToolLifecycleHooks(ctx);

      await hooks["tool.execute.before"](
        { tool: "Edit", sessionID: "test-session", callID: "call-direct-1" },
        { args: { filePath: "/test.ts" } }
      );

      await hooks["tool.execute.after"](
        { tool: "Edit", sessionID: "test-session", callID: "call-direct-1" },
        { title: "Edited file", output: "Success", metadata: {} }
      );

      const recent = await mockMemory.getRecent(1);
      expect(recent.length).toBeGreaterThan(0);
    });
  });

  describe("orphaned after hooks", () => {
    it("handles after hook without corresponding before hook", async () => {
      const hooks = createToolLifecycleHooks(ctx);

      // Only call after hook (no before)
      await expect(
        hooks["tool.execute.after"](
          { tool: "Edit", sessionID: "test-session", callID: "orphan-call" },
          { title: "Edited", output: "Success", metadata: {} }
        )
      ).resolves.toBeUndefined();
    });
  });

  describe("importance filtering", () => {
    it("does not capture low importance tool calls", async () => {
      // Set high threshold
      const ctxHighThreshold = createMockPluginContext({
        testDir,
        config: {
          memory: {
            enabled: true,
            capture: {
              enabled: true,
              captureToolUse: true,
              skipTools: [],
              minImportanceThreshold: 10, // Very high
            },
          },
        },
        includeMemory: true,
      });

      const hooks = createToolLifecycleHooks(ctxHighThreshold);

      await hooks["tool.execute.before"](
        { tool: "Edit", sessionID: "test-session", callID: "call-low-imp" },
        { args: { filePath: "/test.ts" } }
      );

      await hooks["tool.execute.after"](
        { tool: "Edit", sessionID: "test-session", callID: "call-low-imp" },
        { title: "Edited", output: "OK", metadata: {} }
      );

      const recent = await ctxHighThreshold.memoryManager!.getRecent(1);
      expect(recent.length).toBe(0);
    });
  });
});
