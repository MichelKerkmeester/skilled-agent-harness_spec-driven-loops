/**
 * Tests for Orchestrator Enforcement Hooks
 * @module hooks/orchestrator-enforcement.test
 */

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import {
  createOrchestratorEnforcementHooks,
  isOrchestrator,
  wouldBlockPath,
  hasPendingDelegation,
  clearPendingDelegation,
} from "./orchestrator-enforcement.js";
import {
  createMockPluginContext,
  setupTestEnvironment,
  type PluginContext,
} from "../test-utils.js";

describe("orchestrator-enforcement hooks", () => {
  let ctx: PluginContext;
  let cleanup: () => void;

  beforeEach(() => {
    const env = setupTestEnvironment("enforcement-test");
    cleanup = env.cleanup;
    ctx = createMockPluginContext({ testDir: env.testDir });
  });

  afterEach(() => cleanup());

  describe("isOrchestrator", () => {
    it("returns true for goopspec agent", () => {
      expect(isOrchestrator("goopspec")).toBe(true);
      expect(isOrchestrator("GOOPSPEC")).toBe(true);
    });

    it("returns true for orchestrator variants", () => {
      expect(isOrchestrator("goop-orchestrator")).toBe(true);
      expect(isOrchestrator("my-orchestrator")).toBe(true);
    });

    it("returns false for other agents", () => {
      expect(isOrchestrator("goop-executor")).toBe(false);
      expect(isOrchestrator("general")).toBe(false);
      expect(isOrchestrator(undefined)).toBe(false);
    });
  });

  describe("wouldBlockPath", () => {
    it("blocks TypeScript files in src/", () => {
      expect(wouldBlockPath("src/index.ts")).toBe(true);
      expect(wouldBlockPath("src/hooks/test.ts")).toBe(true);
      expect(wouldBlockPath("src/deep/nested/file.tsx")).toBe(true);
    });

    it("blocks JavaScript files in lib/", () => {
      expect(wouldBlockPath("lib/utils.js")).toBe(true);
      expect(wouldBlockPath("lib/helpers.mjs")).toBe(true);
    });

    it("allows markdown files everywhere", () => {
      expect(wouldBlockPath("src/README.md")).toBe(false);
      expect(wouldBlockPath("lib/CHANGELOG.md")).toBe(false);
    });

    it("allows .goopspec/ files", () => {
      expect(wouldBlockPath(".goopspec/SPEC.md")).toBe(false);
      expect(wouldBlockPath(".goopspec/config.json")).toBe(false);
    });

    it("allows files outside protected dirs", () => {
      expect(wouldBlockPath("scripts/build.ts")).toBe(false);
      expect(wouldBlockPath("test.ts")).toBe(false);
    });
  });

  describe("createOrchestratorEnforcementHooks", () => {
    it("creates permission.ask hook", () => {
      const hooks = createOrchestratorEnforcementHooks(ctx);
      expect(hooks["permission.ask"]).toBeDefined();
      expect(typeof hooks["permission.ask"]).toBe("function");
    });

    it("creates tool.execute.after hook", () => {
      const hooks = createOrchestratorEnforcementHooks(ctx);
      expect(hooks["tool.execute.after"]).toBeDefined();
      expect(typeof hooks["tool.execute.after"]).toBe("function");
    });
  });

  describe("permission.ask hook", () => {
    it("denies edit on code file for orchestrator", async () => {
      const hooks = createOrchestratorEnforcementHooks(ctx);
      const output = { status: "ask" as const };
      
      await hooks["permission.ask"](
        {
          tool: "edit",
          sessionID: "test-session",
          path: "src/index.ts",
          agent: "goopspec",
        },
        output
      );
      
      expect(output.status).toBe("deny");
    });

    it("allows edit on code file for non-orchestrator", async () => {
      const hooks = createOrchestratorEnforcementHooks(ctx);
      const output = { status: "ask" as const };
      
      await hooks["permission.ask"](
        {
          tool: "edit",
          sessionID: "test-session",
          path: "src/index.ts",
          agent: "goop-executor",
        },
        output
      );
      
      expect(output.status).toBe("ask");  // Unchanged
    });

    it("allows edit on markdown for orchestrator", async () => {
      const hooks = createOrchestratorEnforcementHooks(ctx);
      const output = { status: "ask" as const };
      
      await hooks["permission.ask"](
        {
          tool: "edit",
          sessionID: "test-session",
          path: ".goopspec/SPEC.md",
          agent: "goopspec",
        },
        output
      );
      
      expect(output.status).toBe("ask");  // Unchanged
    });

    it("logs to ADL when blocking", async () => {
      const hooks = createOrchestratorEnforcementHooks(ctx);
      const output = { status: "ask" as const };
      
      await hooks["permission.ask"](
        {
          tool: "write",
          sessionID: "test-session",
          path: "src/new-file.ts",
          agent: "goopspec",
        },
        output
      );
      
      const adl = ctx.stateManager.getADL();
      expect(adl).toContain("Orchestrator code modification blocked");
    });
  });

  describe("tool.execute.after hook (delegation enforcement)", () => {
    it("detects goop_delegate and injects task instruction", async () => {
      const hooks = createOrchestratorEnforcementHooks(ctx);
      const output = {
        title: "Delegation",
        output: `<goop_delegation>
{
  "action": "delegate_via_task",
  "agent": "goop-executor",
  "composedPrompt": "Test prompt for executor"
}
</goop_delegation>`,
        metadata: {},
      };
      
      await hooks["tool.execute.after"](
        { tool: "goop_delegate", sessionID: "test-session", callID: "call-1" },
        output
      );
      
      expect(output.output).toContain("ACTION REQUIRED");
      expect(output.output).toContain("goop-executor");
      expect(hasPendingDelegation("test-session")).toBe(true);
    });

    it("clears pending delegation when task is called", async () => {
      const hooks = createOrchestratorEnforcementHooks(ctx);
      
      // First set up a pending delegation
      const delegateOutput = {
        title: "Delegation",
        output: `<goop_delegation>{"action":"delegate_via_task","agent":"goop-executor"}</goop_delegation>`,
        metadata: {},
      };
      await hooks["tool.execute.after"](
        { tool: "goop_delegate", sessionID: "test-session", callID: "call-1" },
        delegateOutput
      );
      expect(hasPendingDelegation("test-session")).toBe(true);
      
      // Now call task
      const taskOutput = { title: "Task", output: "done", metadata: {} };
      await hooks["tool.execute.after"](
        { tool: "task", sessionID: "test-session", callID: "call-2" },
        taskOutput
      );
      
      expect(hasPendingDelegation("test-session")).toBe(false);
    });
  });

  describe("clearPendingDelegation", () => {
    it("clears pending delegation state", async () => {
      const hooks = createOrchestratorEnforcementHooks(ctx);
      
      // Set up pending delegation
      const output = {
        title: "Delegation",
        output: `<goop_delegation>{"action":"delegate_via_task","agent":"test"}</goop_delegation>`,
        metadata: {},
      };
      await hooks["tool.execute.after"](
        { tool: "goop_delegate", sessionID: "session-to-clear", callID: "call" },
        output
      );
      
      expect(hasPendingDelegation("session-to-clear")).toBe(true);
      
      clearPendingDelegation("session-to-clear");
      
      expect(hasPendingDelegation("session-to-clear")).toBe(false);
    });
  });
});
