/**
 * Tests for Memory Decision Tool
 * @module tools/memory-decision/index.test
 */

import { describe, it, expect, beforeEach } from "bun:test";
import { createMemoryDecisionTool } from "./index.js";
import {
  createMockPluginContext,
  createMockToolContext,
  createMockMemoryManager,
} from "../../test-utils.js";
import type { PluginContext } from "../../core/types.js";

describe("createMemoryDecisionTool", () => {
  let ctx: PluginContext;
  let testDir: string;

  beforeEach(() => {
    testDir = `/tmp/memory-decision-test-${Date.now()}`;
    ctx = createMockPluginContext({
      testDir,
      includeMemory: true,
    });
  });

  describe("tool creation", () => {
    it("creates a tool definition", () => {
      const tool = createMemoryDecisionTool(ctx);
      expect(tool).toBeDefined();
      expect(tool.description).toContain("decision");
      expect(tool.description).toContain("reasoning");
    });
  });

  describe("execute", () => {
    it("returns error when memory manager not initialized", async () => {
      const ctxNoMemory = createMockPluginContext({ testDir });
      delete ctxNoMemory.memoryManager;

      const tool = createMemoryDecisionTool(ctxNoMemory);
      const toolCtx = createMockToolContext({ sessionID: "test-session" });

      const result = await tool.execute({
        decision: "Use React",
        reasoning: "Better ecosystem",
      }, toolCtx);
      
      expect(result).toContain("Error");
      expect(result).toContain("not initialized");
    });

    it("records a basic decision", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const tool = createMemoryDecisionTool(ctx);
      const toolCtx = createMockToolContext({ sessionID: "test-session" });

      const result = await tool.execute({
        decision: "Use TypeScript for the project",
        reasoning: "Type safety helps catch bugs early",
      }, toolCtx);

      expect(result).toContain("Decision recorded!");
      expect(result).toContain("Use TypeScript");
      expect(result).toContain("ID:");

      const recent = await mockMemory.getRecent(1);
      expect(recent[0].type).toBe("decision");
      expect(recent[0].title).toBe("Use TypeScript for the project");
      expect(recent[0].content).toContain("## Decision");
      expect(recent[0].content).toContain("## Reasoning");
    });

    it("includes alternatives in content", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const tool = createMemoryDecisionTool(ctx);
      const toolCtx = createMockToolContext({ sessionID: "test-session" });

      const result = await tool.execute({
        decision: "Use PostgreSQL",
        reasoning: "ACID compliance and robust features",
        alternatives: ["MongoDB", "MySQL", "SQLite"],
      }, toolCtx);

      expect(result).toContain("Alternatives:");
      expect(result).toContain("3 considered");

      const recent = await mockMemory.getRecent(1);
      expect(recent[0].content).toContain("## Alternatives Considered");
      expect(recent[0].content).toContain("- MongoDB");
      expect(recent[0].content).toContain("- MySQL");
      expect(recent[0].content).toContain("- SQLite");
    });

    it("calculates importance based on high impact", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const tool = createMemoryDecisionTool(ctx);
      const toolCtx = createMockToolContext({ sessionID: "test-session" });

      const result = await tool.execute({
        decision: "Critical architecture decision",
        reasoning: "Affects entire system",
        impact: "high",
      }, toolCtx);

      expect(result).toContain("Impact:** high");
      expect(result).toContain("Importance:** 9/10");

      const recent = await mockMemory.getRecent(1);
      expect(recent[0].importance).toBe(9);
    });

    it("calculates importance based on medium impact", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const tool = createMemoryDecisionTool(ctx);
      const toolCtx = createMockToolContext({ sessionID: "test-session" });

      const result = await tool.execute({
        decision: "Medium importance decision",
        reasoning: "Affects some components",
        impact: "medium",
      }, toolCtx);

      expect(result).toContain("Importance:** 7/10");

      const recent = await mockMemory.getRecent(1);
      expect(recent[0].importance).toBe(7);
    });

    it("calculates importance based on low impact", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const tool = createMemoryDecisionTool(ctx);
      const toolCtx = createMockToolContext({ sessionID: "test-session" });

      const result = await tool.execute({
        decision: "Minor decision",
        reasoning: "Local change only",
        impact: "low",
      }, toolCtx);

      expect(result).toContain("Importance:** 5/10");

      const recent = await mockMemory.getRecent(1);
      expect(recent[0].importance).toBe(5);
    });

    it("defaults to low importance when impact not specified", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const tool = createMemoryDecisionTool(ctx);
      const toolCtx = createMockToolContext({ sessionID: "test-session" });

      const result = await tool.execute({
        decision: "Decision without impact",
        reasoning: "Some reason",
      }, toolCtx);

      // When impact is not specified, display shows "medium" but importance is 5
      // (the ternary falls through to the default case)
      expect(result).toContain("Impact:** medium");
      expect(result).toContain("Importance:** 5/10");

      const recent = await mockMemory.getRecent(1);
      expect(recent[0].importance).toBe(5);
    });

    it("includes concepts in saved memory", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const tool = createMemoryDecisionTool(ctx);
      const toolCtx = createMockToolContext({ sessionID: "test-session" });

      await tool.execute({
        decision: "Use microservices architecture",
        reasoning: "Scalability requirements",
        concepts: ["architecture", "microservices", "scalability"],
      }, toolCtx);

      const recent = await mockMemory.getRecent(1);
      expect(recent[0].concepts).toContain("architecture");
      expect(recent[0].concepts).toContain("microservices");
    });

    it("stores decision as fact", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const tool = createMemoryDecisionTool(ctx);
      const toolCtx = createMockToolContext({ sessionID: "test-session" });

      await tool.execute({
        decision: "The database schema will use UUID primary keys",
        reasoning: "Easier for distributed systems",
      }, toolCtx);

      const recent = await mockMemory.getRecent(1);
      expect(recent[0].facts).toContain("The database schema will use UUID primary keys");
    });

    it("truncates long decision titles", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const tool = createMemoryDecisionTool(ctx);
      const toolCtx = createMockToolContext({ sessionID: "test-session" });

      const longDecision = "a".repeat(200);
      await tool.execute({
        decision: longDecision,
        reasoning: "Some reason",
      }, toolCtx);

      const recent = await mockMemory.getRecent(1);
      expect(recent[0].title.length).toBe(100);
    });

    it("includes session ID", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const tool = createMemoryDecisionTool(ctx);
      const toolCtx = createMockToolContext({ sessionID: "decision-session" });

      await tool.execute({
        decision: "Test decision",
        reasoning: "Test reason",
      }, toolCtx);

      const recent = await mockMemory.getRecent(1);
      expect(recent[0].sessionId).toBe("decision-session");
    });

    it("handles save errors gracefully", async () => {
      const errorMemory = createMockMemoryManager();
      errorMemory.save = async () => {
        throw new Error("Save failed");
      };
      ctx.memoryManager = errorMemory;

      const tool = createMemoryDecisionTool(ctx);
      const toolCtx = createMockToolContext({ sessionID: "test-session" });

      const result = await tool.execute({
        decision: "Will fail",
        reasoning: "Error test",
      }, toolCtx);
      
      expect(result).toContain("Error recording decision");
      expect(result).toContain("Save failed");
    });

    it("handles empty alternatives array", async () => {
      const mockMemory = createMockMemoryManager();
      ctx.memoryManager = mockMemory;

      const tool = createMemoryDecisionTool(ctx);
      const toolCtx = createMockToolContext({ sessionID: "test-session" });

      const result = await tool.execute({
        decision: "Decision with empty alternatives",
        reasoning: "Some reason",
        alternatives: [],
      }, toolCtx);

      expect(result).not.toContain("Alternatives:");
    });
  });
});
