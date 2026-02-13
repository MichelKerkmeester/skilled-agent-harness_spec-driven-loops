/**
 * Tests for Memory Note Tool
 * @module tools/memory-note/index.test
 */

import { describe, it, expect, beforeEach } from "bun:test";
import { createMemoryNoteTool } from "./index.js";
import {
  createMockPluginContext,
  createMockToolContext,
  createMockMemoryManager,
} from "../../test-utils.js";
import type { PluginContext } from "../../core/types.js";

describe("createMemoryNoteTool", () => {
  let ctx: PluginContext;
  let testDir: string;

  beforeEach(() => {
    testDir = `/tmp/memory-note-test-${Date.now()}`;
    ctx = createMockPluginContext({
      testDir,
      includeMemory: true,
    });
  });

  describe("tool creation", () => {
    it("creates a tool definition", () => {
      const tool = createMemoryNoteTool(ctx);
      expect(tool).toBeDefined();
      expect(tool.description).toContain("note");
      expect(tool.description).toContain("Quick");
    });
  });

  describe("execute", () => {
    it("returns error when memory manager not initialized", async () => {
      const ctxNoMemory = createMockPluginContext({ testDir });
      delete ctxNoMemory.memoryManager;

      const tool = createMemoryNoteTool(ctxNoMemory);
      const toolCtx = createMockToolContext({ sessionID: "test-session" });

      const result = await tool.execute({ note: "Test note" }, toolCtx);
      expect(result).toContain("Error");
      expect(result).toContain("not initialized");
    });

    it("saves a simple note", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const tool = createMemoryNoteTool(ctx);
      const toolCtx = createMockToolContext({ sessionID: "test-session" });

      const result = await tool.execute({ note: "Remember to refactor the auth module" }, toolCtx);
      
      expect(result).toContain("Note saved");
      expect(result).toContain("ID:");
      expect(result).toContain("Remember to refactor");

      const recent = await mockMemory.getRecent(1);
      expect(recent.length).toBe(1);
      expect(recent[0].type).toBe("note");
      expect(recent[0].content).toBe("Remember to refactor the auth module");
    });

    it("uses first 100 chars as title", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const tool = createMemoryNoteTool(ctx);
      const toolCtx = createMockToolContext({ sessionID: "test-session" });

      const longNote = "a".repeat(150);
      const result = await tool.execute({ note: longNote }, toolCtx);
      
      expect(result).toContain("...");

      const recent = await mockMemory.getRecent(1);
      expect(recent[0].title.length).toBe(100);
      expect(recent[0].content.length).toBe(150);
    });

    it("stores with low importance by default", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const tool = createMemoryNoteTool(ctx);
      const toolCtx = createMockToolContext({ sessionID: "test-session" });

      await tool.execute({ note: "Quick note" }, toolCtx);

      const recent = await mockMemory.getRecent(1);
      expect(recent[0].importance).toBe(4);
    });

    it("saves with concepts/tags", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const tool = createMemoryNoteTool(ctx);
      const toolCtx = createMockToolContext({ sessionID: "test-session" });

      await tool.execute({ 
        note: "Performance optimization needed", 
        concepts: ["performance", "optimization", "todo"]
      }, toolCtx);

      const recent = await mockMemory.getRecent(1);
      expect(recent[0].concepts).toContain("performance");
      expect(recent[0].concepts).toContain("optimization");
      expect(recent[0].concepts).toContain("todo");
    });

    it("includes session ID", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const tool = createMemoryNoteTool(ctx);
      const toolCtx = createMockToolContext({ sessionID: "specific-session" });

      await tool.execute({ note: "Session specific note" }, toolCtx);

      const recent = await mockMemory.getRecent(1);
      expect(recent[0].sessionId).toBe("specific-session");
    });

    it("handles save errors gracefully", async () => {
      const errorMemory = createMockMemoryManager();
      errorMemory.save = async () => {
        throw new Error("Database connection failed");
      };
      ctx.memoryManager = errorMemory;

      const tool = createMemoryNoteTool(ctx);
      const toolCtx = createMockToolContext({ sessionID: "test-session" });

      const result = await tool.execute({ note: "Will fail" }, toolCtx);
      expect(result).toContain("Error saving note");
      expect(result).toContain("Database connection failed");
    });

    it("handles empty concepts array", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const tool = createMemoryNoteTool(ctx);
      const toolCtx = createMockToolContext({ sessionID: "test-session" });

      await tool.execute({ note: "Note without concepts", concepts: [] }, toolCtx);

      const recent = await mockMemory.getRecent(1);
      expect(recent[0].concepts).toEqual([]);
    });

    it("handles undefined concepts", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const tool = createMemoryNoteTool(ctx);
      const toolCtx = createMockToolContext({ sessionID: "test-session" });

      await tool.execute({ note: "Note with no concepts" }, toolCtx);

      const recent = await mockMemory.getRecent(1);
      expect(recent[0].concepts).toEqual([]);
    });

    it("does not add ellipsis for short notes", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const tool = createMemoryNoteTool(ctx);
      const toolCtx = createMockToolContext({ sessionID: "test-session" });

      const result = await tool.execute({ note: "Short note" }, toolCtx);
      expect(result).not.toContain("...");
    });
  });
});
