/**
 * Tests for Auto-Progression Hook
 * @module hooks/auto-progression.test
 */

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import {
  createAutoProgressionHook,
  checkProgressionConditions,
} from "./auto-progression.js";
import {
  createMockPluginContext,
  setupTestEnvironment,
  type PluginContext,
} from "../test-utils.js";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

describe("auto-progression hooks", () => {
  let ctx: PluginContext;
  let cleanup: () => void;
  let testDir: string;

  beforeEach(() => {
    const env = setupTestEnvironment("auto-progression-test");
    cleanup = env.cleanup;
    testDir = env.testDir;
    ctx = createMockPluginContext({ testDir });
  });

  afterEach(() => cleanup());

  describe("checkProgressionConditions", () => {
    it("returns current state correctly", () => {
      const conditions = checkProgressionConditions(ctx);
      
      expect(conditions.currentPhase).toBe("idle");
      expect(conditions.specLocked).toBe(false);
      expect(conditions.wavesComplete).toBe(false);
      expect(conditions.acceptanceConfirmed).toBe(false);
    });

    it("detects when can progress to execute", () => {
      // Set up conditions for specify → execute
      ctx.stateManager.transitionPhase("plan", true);
      ctx.stateManager.transitionPhase("research", true);
      ctx.stateManager.transitionPhase("specify", true);
      ctx.stateManager.lockSpec();
      
      // Create BLUEPRINT.md
      const goopspecDir = join(testDir, ".goopspec");
      mkdirSync(goopspecDir, { recursive: true });
      writeFileSync(join(goopspecDir, "BLUEPRINT.md"), "# Blueprint");
      
      const conditions = checkProgressionConditions(ctx);
      
      expect(conditions.currentPhase).toBe("specify");
      expect(conditions.specLocked).toBe(true);
      expect(conditions.canProgressToExecute).toBe(true);
    });

    it("detects when can progress to accept", () => {
      // Set up conditions for execute → accept
      ctx.stateManager.transitionPhase("plan", true);
      ctx.stateManager.transitionPhase("execute", true);
      ctx.stateManager.updateWaveProgress(3, 3);
      
      const conditions = checkProgressionConditions(ctx);
      
      expect(conditions.currentPhase).toBe("execute");
      expect(conditions.wavesComplete).toBe(true);
      expect(conditions.canProgressToAccept).toBe(true);
    });

    it("detects when can progress to idle", () => {
      // Set up conditions for accept → idle
      ctx.stateManager.transitionPhase("plan", true);
      ctx.stateManager.transitionPhase("accept", true);
      ctx.stateManager.confirmAcceptance();
      
      const conditions = checkProgressionConditions(ctx);
      
      expect(conditions.currentPhase).toBe("accept");
      expect(conditions.acceptanceConfirmed).toBe(true);
      expect(conditions.canProgressToIdle).toBe(true);
    });
  });

  describe("createAutoProgressionHook", () => {
    it("creates tool.execute.after hook", () => {
      const hooks = createAutoProgressionHook(ctx);
      expect(hooks["tool.execute.after"]).toBeDefined();
      expect(typeof hooks["tool.execute.after"]).toBe("function");
    });
  });

  describe("auto-progression: specify → execute", () => {
    it("auto-progresses when spec locked and blueprint exists", async () => {
      // Set up conditions
      ctx.stateManager.transitionPhase("plan", true);
      ctx.stateManager.transitionPhase("research", true);
      ctx.stateManager.transitionPhase("specify", true);
      ctx.stateManager.lockSpec();
      
      // Create BLUEPRINT.md
      const goopspecDir = join(testDir, ".goopspec");
      mkdirSync(goopspecDir, { recursive: true });
      writeFileSync(join(goopspecDir, "BLUEPRINT.md"), "# Blueprint");
      
      const hooks = createAutoProgressionHook(ctx);
      const output = { title: "Test", output: "Original output", metadata: {} };
      
      await hooks["tool.execute.after"](
        { tool: "slashcommand", sessionID: "test", callID: "call" },
        output
      );
      
      // Should have progressed
      expect(ctx.stateManager.getState().workflow.phase).toBe("execute");
      expect(output.output).toContain("Auto-Progression");
      expect(output.output).toContain("specify → execute");
    });

    it("does not progress without locked spec", async () => {
      ctx.stateManager.transitionPhase("plan", true);
      ctx.stateManager.transitionPhase("research", true);
      ctx.stateManager.transitionPhase("specify", true);
      // NOT locking spec
      
      const hooks = createAutoProgressionHook(ctx);
      const output = { title: "Test", output: "Original", metadata: {} };
      
      await hooks["tool.execute.after"](
        { tool: "slashcommand", sessionID: "test", callID: "call" },
        output
      );
      
      expect(ctx.stateManager.getState().workflow.phase).toBe("specify");
    });
  });

  describe("auto-progression: execute → accept", () => {
    it("auto-progresses when all waves complete", async () => {
      ctx.stateManager.transitionPhase("plan", true);
      ctx.stateManager.transitionPhase("execute", true);
      ctx.stateManager.updateWaveProgress(3, 3);
      
      const hooks = createAutoProgressionHook(ctx);
      const output = { title: "Test", output: "Original", metadata: {} };
      
      await hooks["tool.execute.after"](
        { tool: "slashcommand", sessionID: "test", callID: "call" },
        output
      );
      
      expect(ctx.stateManager.getState().workflow.phase).toBe("accept");
      expect(output.output).toContain("Auto-Progression");
    });

    it("does not progress when waves incomplete", async () => {
      ctx.stateManager.transitionPhase("plan", true);
      ctx.stateManager.transitionPhase("execute", true);
      ctx.stateManager.updateWaveProgress(1, 3);
      
      const hooks = createAutoProgressionHook(ctx);
      const output = { title: "Test", output: "Original", metadata: {} };
      
      await hooks["tool.execute.after"](
        { tool: "slashcommand", sessionID: "test", callID: "call" },
        output
      );
      
      expect(ctx.stateManager.getState().workflow.phase).toBe("execute");
    });
  });

  describe("auto-progression: accept → idle", () => {
    it("auto-progresses when acceptance confirmed", async () => {
      ctx.stateManager.transitionPhase("plan", true);
      ctx.stateManager.transitionPhase("accept", true);
      ctx.stateManager.confirmAcceptance();
      
      const hooks = createAutoProgressionHook(ctx);
      const output = { title: "Test", output: "Original", metadata: {} };
      
      await hooks["tool.execute.after"](
        { tool: "slashcommand", sessionID: "test", callID: "call" },
        output
      );
      
      expect(ctx.stateManager.getState().workflow.phase).toBe("idle");
      expect(output.output).toContain("Workflow Complete");
    });

    it("resets workflow state after accept → idle", async () => {
      ctx.stateManager.transitionPhase("plan", true);
      ctx.stateManager.transitionPhase("accept", true);
      ctx.stateManager.confirmAcceptance();
      ctx.stateManager.lockSpec();
      ctx.stateManager.updateWaveProgress(3, 3);
      
      const hooks = createAutoProgressionHook(ctx);
      const output = { title: "Test", output: "Original", metadata: {} };
      
      await hooks["tool.execute.after"](
        { tool: "slashcommand", sessionID: "test", callID: "call" },
        output
      );
      
      const state = ctx.stateManager.getState();
      expect(state.workflow.phase).toBe("idle");
      expect(state.workflow.specLocked).toBe(false);
      expect(state.workflow.acceptanceConfirmed).toBe(false);
      expect(state.workflow.currentWave).toBe(0);
      expect(state.workflow.totalWaves).toBe(0);
    });
  });
});
