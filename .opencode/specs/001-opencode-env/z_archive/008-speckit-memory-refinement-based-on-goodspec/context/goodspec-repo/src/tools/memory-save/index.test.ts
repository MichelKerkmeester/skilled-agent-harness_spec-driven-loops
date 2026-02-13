/**
 * Unit Tests for Memory Save Tool
 * @module tools/memory-save/index.test
 */

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { createMemorySaveTool } from "./index.js";
import {
  createMockPluginContext,
  createMockToolContext,
  setupTestEnvironment,
  type PluginContext,
} from "../../test-utils.js";

describe("memory_save tool", () => {
  let ctx: PluginContext;
  let toolContext: ReturnType<typeof createMockToolContext>;
  let cleanup: () => void;

  beforeEach(() => {
    const env = setupTestEnvironment("memory-save-test");
    cleanup = env.cleanup;
    ctx = createMockPluginContext({
      testDir: env.testDir,
      includeMemory: true,
    });
    toolContext = createMockToolContext({ directory: env.testDir });
  });

  afterEach(() => {
    cleanup();
  });

  describe("tool creation", () => {
    it("creates tool with correct description", () => {
      const tool = createMemorySaveTool(ctx);
      
      expect(tool.description).toContain("memory");
      expect(tool.description).toContain("persist");
    });

    it("has required args", () => {
      const tool = createMemorySaveTool(ctx);
      
      expect(tool.args).toHaveProperty("title");
      expect(tool.args).toHaveProperty("content");
      expect(tool.args).toHaveProperty("type");
      expect(tool.args).toHaveProperty("facts");
      expect(tool.args).toHaveProperty("concepts");
      expect(tool.args).toHaveProperty("sourceFiles");
      expect(tool.args).toHaveProperty("importance");
    });
  });

  describe("when memory system is not initialized", () => {
    it("returns error message", async () => {
      // Create context without memory manager
      ctx = createMockPluginContext({
        testDir: ctx.input.directory,
        includeMemory: false,
      });

      const tool = createMemorySaveTool(ctx);
      const result = await tool.execute({
        title: "Test",
        content: "Test content",
      }, toolContext);

      expect(result).toContain("Error");
      expect(result).toContain("Memory system is not initialized");
    });
  });

  describe("saving memories", () => {
    it("saves memory with title and content", async () => {
      const tool = createMemorySaveTool(ctx);
      const result = await tool.execute({
        title: "Test Memory",
        content: "This is the content of my memory.",
      }, toolContext);

      expect(result).toContain("Memory saved successfully");
      expect(result).toContain("Test Memory");
    });

    it("returns memory ID after save", async () => {
      const tool = createMemorySaveTool(ctx);
      const result = await tool.execute({
        title: "Test",
        content: "Content",
      }, toolContext);

      expect(result).toContain("**ID:**");
    });

    it("saves memory with default type observation", async () => {
      const tool = createMemorySaveTool(ctx);
      const result = await tool.execute({
        title: "Observation Test",
        content: "Observed something",
      }, toolContext);

      expect(result).toContain("**Type:** observation");
    });
  });

  describe("memory types", () => {
    it("saves decision type", async () => {
      const tool = createMemorySaveTool(ctx);
      const result = await tool.execute({
        title: "Decision",
        content: "Decided to use React",
        type: "decision",
      }, toolContext);

      expect(result).toContain("**Type:** decision");
    });

    it("saves note type", async () => {
      const tool = createMemorySaveTool(ctx);
      const result = await tool.execute({
        title: "Note",
        content: "Just a note",
        type: "note",
      }, toolContext);

      expect(result).toContain("**Type:** note");
    });

    it("saves todo type", async () => {
      const tool = createMemorySaveTool(ctx);
      const result = await tool.execute({
        title: "Todo",
        content: "Need to refactor this",
        type: "todo",
      }, toolContext);

      expect(result).toContain("**Type:** todo");
    });
  });

  describe("facts and concepts", () => {
    it("saves memory with facts", async () => {
      const tool = createMemorySaveTool(ctx);
      const result = await tool.execute({
        title: "Facts Memory",
        content: "Content",
        facts: ["Fact 1", "Fact 2", "Fact 3"],
      }, toolContext);

      expect(result).toContain("**Facts:** 3 recorded");
    });

    it("saves memory with concepts", async () => {
      const tool = createMemorySaveTool(ctx);
      const result = await tool.execute({
        title: "Concepts Memory",
        content: "Content",
        concepts: ["react", "typescript", "testing"],
      }, toolContext);

      expect(result).toContain("**Concepts:**");
      expect(result).toContain("react");
      expect(result).toContain("typescript");
    });

    it("saves memory with source files", async () => {
      const tool = createMemorySaveTool(ctx);
      const result = await tool.execute({
        title: "Files Memory",
        content: "Content",
        sourceFiles: ["src/index.ts", "src/utils.ts"],
      }, toolContext);

      expect(result).toContain("Memory saved");
    });
  });

  describe("importance handling", () => {
    it("uses default importance of 5", async () => {
      const tool = createMemorySaveTool(ctx);
      const result = await tool.execute({
        title: "Default Importance",
        content: "Content",
      }, toolContext);

      expect(result).toContain("**Importance:** 5/10");
    });

    it("accepts importance 1-10", async () => {
      const tool = createMemorySaveTool(ctx);
      const result = await tool.execute({
        title: "High Importance",
        content: "Content",
        importance: 9,
      }, toolContext);

      expect(result).toContain("**Importance:** 9/10");
    });

    it("normalizes importance values between 0-1 to 1-10 scale", async () => {
      const tool = createMemorySaveTool(ctx);
      const result = await tool.execute({
        title: "Normalized",
        content: "Content",
        importance: 0.8, // Should become 8
      }, toolContext);

      expect(result).toContain("**Importance:** 8/10");
    });

    it("rejects importance below 1", async () => {
      const tool = createMemorySaveTool(ctx);
      const result = await tool.execute({
        title: "Invalid",
        content: "Content",
        importance: 0,
      }, toolContext);

      expect(result).toContain("Error");
      expect(result).toContain("Importance must be between 1 and 10");
    });

    it("rejects importance above 10", async () => {
      const tool = createMemorySaveTool(ctx);
      const result = await tool.execute({
        title: "Invalid",
        content: "Content",
        importance: 15,
      }, toolContext);

      expect(result).toContain("Error");
      expect(result).toContain("Importance must be between 1 and 10");
    });
  });

  describe("title validation", () => {
    it("rejects title longer than 100 characters", async () => {
      const longTitle = "A".repeat(101);
      
      const tool = createMemorySaveTool(ctx);
      const result = await tool.execute({
        title: longTitle,
        content: "Content",
      }, toolContext);

      expect(result).toContain("Error");
      expect(result).toContain("100 characters or less");
    });

    it("accepts title exactly 100 characters", async () => {
      const exactTitle = "A".repeat(100);
      
      const tool = createMemorySaveTool(ctx);
      const result = await tool.execute({
        title: exactTitle,
        content: "Content",
      }, toolContext);

      expect(result).toContain("Memory saved");
    });
  });

  describe("error handling", () => {
    it("handles save errors gracefully", async () => {
      // Create a mock that will throw
      const badCtx = createMockPluginContext({
        testDir: ctx.input.directory,
        includeMemory: true,
      });
      
      // Override save to throw
      badCtx.memoryManager!.save = async () => {
        throw new Error("Database connection failed");
      };

      const tool = createMemorySaveTool(badCtx);
      const result = await tool.execute({
        title: "Test",
        content: "Content",
      }, toolContext);

      expect(result).toContain("Error saving memory");
      expect(result).toContain("Database connection failed");
    });
  });
});
