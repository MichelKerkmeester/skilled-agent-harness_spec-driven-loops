/**
 * Unit Tests for GoopSpec ADL Tool
 * @module tools/goop-adl/index.test
 */

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { createGoopAdlTool } from "./index.js";
import {
  createMockPluginContext,
  createMockToolContext,
  setupTestEnvironment,
  type PluginContext,
} from "../../test-utils.js";

describe("goop_adl tool", () => {
  let ctx: PluginContext;
  let toolContext: ReturnType<typeof createMockToolContext>;
  let cleanup: () => void;

  beforeEach(() => {
    const env = setupTestEnvironment("goop-adl-test");
    cleanup = env.cleanup;
    ctx = createMockPluginContext({ testDir: env.testDir });
    toolContext = createMockToolContext({ directory: env.testDir });
  });

  afterEach(() => {
    cleanup();
  });

  describe("tool creation", () => {
    it("creates tool with correct description", () => {
      const tool = createGoopAdlTool(ctx);
      
      expect(tool.description).toContain("Automated Decision Log");
      expect(tool.description).toContain("read");
      expect(tool.description).toContain("append");
    });

    it("has required args", () => {
      const tool = createGoopAdlTool(ctx);
      
      expect(tool.args).toHaveProperty("action");
      expect(tool.args).toHaveProperty("type");
      expect(tool.args).toHaveProperty("description");
      expect(tool.args).toHaveProperty("entry_action");
      expect(tool.args).toHaveProperty("rule");
      expect(tool.args).toHaveProperty("files");
    });
  });

  describe("read action", () => {
    it("returns ADL content", async () => {
      const tool = createGoopAdlTool(ctx);
      const result = await tool.execute({ action: "read" }, toolContext);

      expect(result).toContain("# Automated Decision Log");
    });

    it("returns appended entries when reading", async () => {
      ctx.stateManager.appendADL({
        timestamp: new Date().toISOString(),
        type: "decision",
        description: "Test decision",
        action: "Made a test decision",
      });

      const tool = createGoopAdlTool(ctx);
      const result = await tool.execute({ action: "read" }, toolContext);

      expect(result).toContain("Test decision");
      expect(result).toContain("Made a test decision");
    });
  });

  describe("append action", () => {
    describe("decision type", () => {
      it("appends decision entry", async () => {
        const tool = createGoopAdlTool(ctx);
        const result = await tool.execute({
          action: "append",
          type: "decision",
          description: "Chose React over Vue",
          entry_action: "Using React for UI framework",
        }, toolContext);

        expect(result).toContain("ADL entry added");
        expect(result).toContain("DECISION");
        expect(result).toContain("Chose React over Vue");
      });

      it("persists decision to ADL", async () => {
        const tool = createGoopAdlTool(ctx);
        await tool.execute({
          action: "append",
          type: "decision",
          description: "Test decision",
          entry_action: "Action taken",
        }, toolContext);

        const adl = ctx.stateManager.getADL();
        expect(adl).toContain("Test decision");
        expect(adl).toContain("Action taken");
      });
    });

    describe("deviation type", () => {
      it("appends deviation entry", async () => {
        const tool = createGoopAdlTool(ctx);
        const result = await tool.execute({
          action: "append",
          type: "deviation",
          description: "Deviated from original plan",
          entry_action: "Added extra validation",
        }, toolContext);

        expect(result).toContain("DEVIATION");
      });

      it("includes rule number when provided", async () => {
        const tool = createGoopAdlTool(ctx);
        await tool.execute({
          action: "append",
          type: "deviation",
          description: "Applied Rule 2",
          entry_action: "Added missing error handling",
          rule: 2,
        }, toolContext);

        const adl = ctx.stateManager.getADL();
        expect(adl).toContain("Rule");
        expect(adl).toContain("2");
      });
    });

    describe("observation type", () => {
      it("appends observation entry", async () => {
        const tool = createGoopAdlTool(ctx);
        const result = await tool.execute({
          action: "append",
          type: "observation",
          description: "Noticed pattern in codebase",
          entry_action: "Documented for future reference",
        }, toolContext);

        expect(result).toContain("OBSERVATION");
      });
    });

    describe("with files", () => {
      it("includes files in entry", async () => {
        const tool = createGoopAdlTool(ctx);
        await tool.execute({
          action: "append",
          type: "decision",
          description: "Updated configuration",
          entry_action: "Modified config files",
          files: ["config/app.ts", "config/db.ts"],
        }, toolContext);

        const adl = ctx.stateManager.getADL();
        expect(adl).toContain("config/app.ts");
        expect(adl).toContain("config/db.ts");
      });

      it("handles empty files array", async () => {
        const tool = createGoopAdlTool(ctx);
        const result = await tool.execute({
          action: "append",
          type: "decision",
          description: "No files involved",
          entry_action: "Conceptual decision",
          files: [],
        }, toolContext);

        expect(result).toContain("ADL entry added");
      });
    });

    describe("validation", () => {
      it("requires type for append", async () => {
        const tool = createGoopAdlTool(ctx);
        const result = await tool.execute({
          action: "append",
          description: "Missing type",
          entry_action: "Some action",
        }, toolContext);

        expect(result).toContain("Error");
        expect(result).toContain("required");
      });

      it("requires description for append", async () => {
        const tool = createGoopAdlTool(ctx);
        const result = await tool.execute({
          action: "append",
          type: "decision",
          entry_action: "Some action",
        }, toolContext);

        expect(result).toContain("Error");
        expect(result).toContain("required");
      });

      it("requires entry_action for append", async () => {
        const tool = createGoopAdlTool(ctx);
        const result = await tool.execute({
          action: "append",
          type: "decision",
          description: "Some description",
        }, toolContext);

        expect(result).toContain("Error");
        expect(result).toContain("required");
      });

      it("requires all three fields for append", async () => {
        const tool = createGoopAdlTool(ctx);
        const result = await tool.execute({
          action: "append",
        }, toolContext);

        expect(result).toContain("Error");
        expect(result).toContain("type");
        expect(result).toContain("description");
        expect(result).toContain("entry_action");
      });
    });
  });

  describe("multiple entries", () => {
    it("accumulates multiple entries", async () => {
      const tool = createGoopAdlTool(ctx);

      await tool.execute({
        action: "append",
        type: "decision",
        description: "First decision",
        entry_action: "Action 1",
      }, toolContext);

      await tool.execute({
        action: "append",
        type: "observation",
        description: "Second observation",
        entry_action: "Action 2",
      }, toolContext);

      await tool.execute({
        action: "append",
        type: "deviation",
        description: "Third deviation",
        entry_action: "Action 3",
        rule: 3,
      }, toolContext);

      const adl = ctx.stateManager.getADL();
      
      expect(adl).toContain("First decision");
      expect(adl).toContain("Second observation");
      expect(adl).toContain("Third deviation");
    });
  });

  describe("timestamp", () => {
    it("includes timestamp in entry", async () => {
      const tool = createGoopAdlTool(ctx);
      await tool.execute({
        action: "append",
        type: "decision",
        description: "Timestamped entry",
        entry_action: "With timestamp",
      }, toolContext);

      const adl = ctx.stateManager.getADL();
      // Should contain ISO timestamp format
      expect(adl).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });
});
