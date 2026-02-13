/**
 * Unit Tests for GoopSpec Checkpoint Tool
 * @module tools/goop-checkpoint/index.test
 */

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { createGoopCheckpointTool } from "./index.js";
import {
  createMockPluginContext,
  createMockToolContext,
  setupTestEnvironment,
  type PluginContext,
} from "../../test-utils.js";

describe("goop_checkpoint tool", () => {
  let ctx: PluginContext;
  let toolContext: ReturnType<typeof createMockToolContext>;
  let cleanup: () => void;

  beforeEach(() => {
    const env = setupTestEnvironment("goop-checkpoint-test");
    cleanup = env.cleanup;
    ctx = createMockPluginContext({ testDir: env.testDir });
    toolContext = createMockToolContext({ directory: env.testDir });
  });

  afterEach(() => {
    cleanup();
  });

  describe("tool creation", () => {
    it("creates tool with correct description", () => {
      const tool = createGoopCheckpointTool(ctx);
      
      expect(tool.description).toContain("checkpoint");
      expect(tool.description.toLowerCase()).toContain("save");
      expect(tool.description.toLowerCase()).toContain("load");
    });

    it("has required args", () => {
      const tool = createGoopCheckpointTool(ctx);
      
      expect(tool.args).toHaveProperty("action");
      expect(tool.args).toHaveProperty("id");
      expect(tool.args).toHaveProperty("context");
    });
  });

  describe("save action", () => {
    it("saves checkpoint with id", async () => {
      const tool = createGoopCheckpointTool(ctx);
      const result = await tool.execute({
        action: "save",
        id: "my-checkpoint",
      }, toolContext);

      expect(result).toContain("Checkpoint saved");
      expect(result).toContain("my-checkpoint");
    });

    it("requires id for save", async () => {
      const tool = createGoopCheckpointTool(ctx);
      const result = await tool.execute({
        action: "save",
      }, toolContext);

      expect(result).toContain("Error");
      expect(result).toContain("id");
      expect(result).toContain("required");
    });

    it("saves checkpoint with context", async () => {
      const tool = createGoopCheckpointTool(ctx);
      await tool.execute({
        action: "save",
        id: "cp-with-context",
        context: { note: "Important note", step: 5 },
      }, toolContext);

      const checkpoint = ctx.stateManager.loadCheckpoint("cp-with-context");
      expect(checkpoint).not.toBeNull();
      expect(checkpoint?.context?.note).toBe("Important note");
      expect(checkpoint?.context?.step).toBe(5);
    });

    it("captures current state in checkpoint", async () => {
      // Set up some state
      ctx.stateManager.transitionPhase("plan");
      ctx.stateManager.setMode("comprehensive");

      const tool = createGoopCheckpointTool(ctx);
      await tool.execute({
        action: "save",
        id: "state-checkpoint",
      }, toolContext);

      const checkpoint = ctx.stateManager.loadCheckpoint("state-checkpoint");
      expect(checkpoint?.state.workflow.phase).toBe("plan");
      expect(checkpoint?.state.workflow.mode).toBe("comprehensive");
    });

    it("overwrites existing checkpoint with same id", async () => {
      const tool = createGoopCheckpointTool(ctx);

      await tool.execute({
        action: "save",
        id: "same-id",
        context: { version: 1 },
      }, toolContext);

      await tool.execute({
        action: "save",
        id: "same-id",
        context: { version: 2 },
      }, toolContext);

      const checkpoint = ctx.stateManager.loadCheckpoint("same-id");
      expect(checkpoint?.context?.version).toBe(2);
    });
  });

  describe("load action", () => {
    it("loads existing checkpoint", async () => {
      const tool = createGoopCheckpointTool(ctx);

      // Save a checkpoint first
      await tool.execute({
        action: "save",
        id: "load-test",
        context: { data: "test-data" },
      }, toolContext);

      // Load it
      const result = await tool.execute({
        action: "load",
        id: "load-test",
      }, toolContext);

      expect(result).toContain("# Checkpoint Loaded");
      expect(result).toContain("load-test");
    });

    it("requires id for load", async () => {
      const tool = createGoopCheckpointTool(ctx);
      const result = await tool.execute({
        action: "load",
      }, toolContext);

      expect(result).toContain("Error");
      expect(result).toContain("id");
      expect(result).toContain("required");
    });

    it("shows not found for missing checkpoint", async () => {
      const tool = createGoopCheckpointTool(ctx);
      const result = await tool.execute({
        action: "load",
        id: "nonexistent",
      }, toolContext);

      expect(result).toContain("not found");
      expect(result).toContain("nonexistent");
    });

    it("restores state from checkpoint", async () => {
      // Set initial state
      ctx.stateManager.transitionPhase("plan");
      ctx.stateManager.setMode("quick");

      const tool = createGoopCheckpointTool(ctx);
      
      // Save checkpoint
      await tool.execute({
        action: "save",
        id: "restore-test",
      }, toolContext);

      // Verify checkpoint was saved with correct state
      const checkpoint = ctx.stateManager.loadCheckpoint("restore-test");
      expect(checkpoint).not.toBeNull();
      expect(checkpoint?.state.workflow.phase).toBe("plan");
      expect(checkpoint?.state.workflow.mode).toBe("quick");
    });

    it("shows timestamp in loaded checkpoint", async () => {
      const tool = createGoopCheckpointTool(ctx);

      await tool.execute({
        action: "save",
        id: "timestamp-test",
      }, toolContext);

      const result = await tool.execute({
        action: "load",
        id: "timestamp-test",
      }, toolContext);

      expect(result).toContain("Saved at");
      expect(result).toMatch(/\d{4}-\d{2}-\d{2}/);
    });

    it("shows workflow stage in loaded checkpoint", async () => {
      ctx.stateManager.updateWorkflow({ phase: "execute" });
      
      const tool = createGoopCheckpointTool(ctx);

      await tool.execute({
        action: "save",
        id: "phase-test",
      }, toolContext);

      const result = await tool.execute({
        action: "load",
        id: "phase-test",
      }, toolContext);

      expect(result).toContain("Workflow Stage");
      expect(result).toContain("execute");
    });

    it("shows mode in loaded checkpoint", async () => {
      ctx.stateManager.setMode("milestone");
      
      const tool = createGoopCheckpointTool(ctx);

      await tool.execute({
        action: "save",
        id: "mode-test",
      }, toolContext);

      const result = await tool.execute({
        action: "load",
        id: "mode-test",
      }, toolContext);

      expect(result).toContain("Mode");
      expect(result).toContain("milestone");
    });

    it("shows context as JSON when present", async () => {
      const tool = createGoopCheckpointTool(ctx);

      await tool.execute({
        action: "save",
        id: "context-display-test",
        context: { key: "value", nested: { a: 1 } },
      }, toolContext);

      const result = await tool.execute({
        action: "load",
        id: "context-display-test",
      }, toolContext);

      expect(result).toContain("Context");
      expect(result).toContain("json");
      expect(result).toContain("key");
    });
  });

  describe("list action", () => {
    it("shows no checkpoints message when empty", async () => {
      const tool = createGoopCheckpointTool(ctx);
      const result = await tool.execute({
        action: "list",
      }, toolContext);

      expect(result).toContain("No checkpoints saved");
    });

    it("lists saved checkpoints", async () => {
      const tool = createGoopCheckpointTool(ctx);

      await tool.execute({
        action: "save",
        id: "checkpoint-a",
      }, toolContext);

      await tool.execute({
        action: "save",
        id: "checkpoint-b",
      }, toolContext);

      const result = await tool.execute({
        action: "list",
      }, toolContext);

      expect(result).toContain("# Saved Checkpoints");
      expect(result).toContain("checkpoint-a");
      expect(result).toContain("checkpoint-b");
    });

    it("lists checkpoints as bullet points", async () => {
      const tool = createGoopCheckpointTool(ctx);

      await tool.execute({ action: "save", id: "cp-1" }, toolContext);
      await tool.execute({ action: "save", id: "cp-2" }, toolContext);

      const result = await tool.execute({ action: "list" }, toolContext);

      expect(result).toContain("- cp-1");
      expect(result).toContain("- cp-2");
    });
  });

  describe("edge cases", () => {
    it("handles special characters in checkpoint id", async () => {
      const tool = createGoopCheckpointTool(ctx);
      const result = await tool.execute({
        action: "save",
        id: "my-checkpoint_v2.1-final",
      }, toolContext);

      expect(result).toContain("Checkpoint saved");
      expect(result).toContain("my-checkpoint_v2.1-final");
    });

    it("handles complex context objects", async () => {
      const tool = createGoopCheckpointTool(ctx);
      const complexContext = {
        nested: { deep: { value: "test" } },
        array: [1, 2, 3],
        boolean: true,
        number: 42.5,
        null: null,
      };

      await tool.execute({
        action: "save",
        id: "complex-context",
        context: complexContext,
      }, toolContext);

      const checkpoint = ctx.stateManager.loadCheckpoint("complex-context");
      expect(checkpoint?.context?.nested).toEqual({ deep: { value: "test" } });
      expect(checkpoint?.context?.array).toEqual([1, 2, 3]);
    });

    it("handles empty context object", async () => {
      const tool = createGoopCheckpointTool(ctx);
      await tool.execute({
        action: "save",
        id: "empty-context",
        context: {},
      }, toolContext);

      const checkpoint = ctx.stateManager.loadCheckpoint("empty-context");
      expect(checkpoint?.context).toEqual({});
    });
  });
});
