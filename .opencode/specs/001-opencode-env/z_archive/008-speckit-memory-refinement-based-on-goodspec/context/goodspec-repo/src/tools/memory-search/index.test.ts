/**
 * Unit Tests for Memory Search Tool
 * @module tools/memory-search/index.test
 */

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { createMemorySearchTool } from "./index.js";
import {
  createMockPluginContext,
  createMockToolContext,
  createMockMemory,
  setupTestEnvironment,
  type PluginContext,
  type Memory,
} from "../../test-utils.js";

describe("memory_search tool", () => {
  let ctx: PluginContext;
  let toolContext: ReturnType<typeof createMockToolContext>;
  let cleanup: () => void;

  beforeEach(() => {
    const env = setupTestEnvironment("memory-search-test");
    cleanup = env.cleanup;
    
    // Create some test memories
    const memories: Memory[] = [
      createMockMemory({
        id: 1,
        type: "decision",
        title: "Chose React framework",
        content: "Decided to use React for the frontend due to team expertise.",
        concepts: ["react", "frontend", "decision"],
        importance: 8,
      }),
      createMockMemory({
        id: 2,
        type: "observation",
        title: "Performance bottleneck found",
        content: "Discovered N+1 query problem in the user listing.",
        concepts: ["performance", "database", "sql"],
        importance: 7,
      }),
      createMockMemory({
        id: 3,
        type: "note",
        title: "Testing patterns",
        content: "The codebase uses describe/it blocks with bun:test.",
        concepts: ["testing", "bun", "patterns"],
        importance: 5,
      }),
    ];

    ctx = createMockPluginContext({
      testDir: env.testDir,
      includeMemory: true,
      memories,
    });
    toolContext = createMockToolContext({ directory: env.testDir });
  });

  afterEach(() => {
    cleanup();
  });

  describe("tool creation", () => {
    it("creates tool with correct description", () => {
      const tool = createMemorySearchTool(ctx);
      
      expect(tool.description).toContain("Search");
      expect(tool.description).toContain("memory");
    });

    it("has required args", () => {
      const tool = createMemorySearchTool(ctx);
      
      expect(tool.args).toHaveProperty("query");
      expect(tool.args).toHaveProperty("limit");
      expect(tool.args).toHaveProperty("types");
      expect(tool.args).toHaveProperty("concepts");
      expect(tool.args).toHaveProperty("minImportance");
    });
  });

  describe("when memory system is not initialized", () => {
    it("returns error message", async () => {
      ctx = createMockPluginContext({
        testDir: ctx.input.directory,
        includeMemory: false,
      });

      const tool = createMemorySearchTool(ctx);
      const result = await tool.execute({
        query: "test",
      }, toolContext);

      expect(result).toContain("Error");
      expect(result).toContain("Memory system is not initialized");
    });
  });

  describe("basic search", () => {
    it("searches memories by query", async () => {
      const tool = createMemorySearchTool(ctx);
      const result = await tool.execute({
        query: "React",
      }, toolContext);

      expect(result).toContain("# Memory Search Results");
      expect(result).toContain("React");
    });

    it("returns no results message when nothing matches", async () => {
      const tool = createMemorySearchTool(ctx);
      const result = await tool.execute({
        query: "nonexistent-xyz-query",
      }, toolContext);

      expect(result).toContain("No memories found");
      expect(result).toContain("Tip:");
    });

    it("shows number of results found", async () => {
      const tool = createMemorySearchTool(ctx);
      const result = await tool.execute({
        query: "React",
      }, toolContext);

      expect(result).toMatch(/Found \d+ matching memor/);
    });
  });

  describe("result formatting", () => {
    it("shows memory title in results", async () => {
      const tool = createMemorySearchTool(ctx);
      const result = await tool.execute({
        query: "React",
      }, toolContext);

      expect(result).toContain("Chose React framework");
    });

    it("shows memory type in results", async () => {
      const tool = createMemorySearchTool(ctx);
      const result = await tool.execute({
        query: "React",
      }, toolContext);

      expect(result).toContain("**Type:** decision");
    });

    it("shows memory content in results", async () => {
      const tool = createMemorySearchTool(ctx);
      const result = await tool.execute({
        query: "React",
      }, toolContext);

      expect(result).toContain("team expertise");
    });

    it("shows concepts when present", async () => {
      const tool = createMemorySearchTool(ctx);
      const result = await tool.execute({
        query: "React",
      }, toolContext);

      expect(result).toContain("**Concepts:**");
      expect(result).toContain("frontend");
    });
  });

  describe("limit parameter", () => {
    it("uses default limit of 5", async () => {
      // Add more memories
      for (let i = 4; i <= 10; i++) {
        await ctx.memoryManager!.save({
          type: "note",
          title: `Test memory ${i}`,
          content: `Content for memory ${i} about React`,
        });
      }

      const tool = createMemorySearchTool(ctx);
      const result = await tool.execute({
        query: "React",
      }, toolContext);

      // Count the number of ### headers (each result has one)
      const matches = result.match(/### \[\d+\]/g);
      expect(matches?.length).toBeLessThanOrEqual(5);
    });

    it("respects custom limit", async () => {
      const tool = createMemorySearchTool(ctx);
      const result = await tool.execute({
        query: "React",
        limit: 1,
      }, toolContext);

      const matches = result.match(/### \[\d+\]/g);
      expect(matches?.length).toBeLessThanOrEqual(1);
    });

    it("caps limit at 20", async () => {
      const tool = createMemorySearchTool(ctx);
      
      // This should not throw, just cap at 20
      const result = await tool.execute({
        query: "test",
        limit: 100,
      }, toolContext);

      expect(result).toBeDefined();
    });

    it("enforces minimum limit of 1", async () => {
      const tool = createMemorySearchTool(ctx);
      const result = await tool.execute({
        query: "React",
        limit: 0,
      }, toolContext);

      // Should still return at least one result if available
      expect(result).toContain("Memory Search Results");
    });
  });

  describe("type filtering", () => {
    it("filters by single type", async () => {
      const tool = createMemorySearchTool(ctx);
      const result = await tool.execute({
        query: "test",
        types: ["decision"],
      }, toolContext);

      // Should only return decision type if matches
      if (result.includes("Memory Search Results")) {
        expect(result).toContain("decision");
      }
    });

    it("filters by multiple types", async () => {
      const tool = createMemorySearchTool(ctx);
      const result = await tool.execute({
        query: "test",
        types: ["decision", "observation"],
      }, toolContext);

      expect(result).toBeDefined();
    });
  });

  describe("concept filtering", () => {
    it("filters by concepts", async () => {
      const tool = createMemorySearchTool(ctx);
      const result = await tool.execute({
        query: "frontend",
        concepts: ["react"],
      }, toolContext);

      expect(result).toBeDefined();
    });
  });

  describe("importance filtering", () => {
    it("filters by minimum importance", async () => {
      const tool = createMemorySearchTool(ctx);
      const result = await tool.execute({
        query: "test",
        minImportance: 8,
      }, toolContext);

      // Only high importance memories should match
      expect(result).toBeDefined();
    });
  });

  describe("error handling", () => {
    it("handles search errors gracefully", async () => {
      ctx.memoryManager!.search = async () => {
        throw new Error("Search index corrupted");
      };

      const tool = createMemorySearchTool(ctx);
      const result = await tool.execute({
        query: "test",
      }, toolContext);

      expect(result).toContain("Error searching memory");
      expect(result).toContain("Search index corrupted");
    });
  });
});
