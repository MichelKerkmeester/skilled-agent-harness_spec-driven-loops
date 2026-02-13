/**
 * Tests for Phase Enforcement Context Builder
 * @module features/enforcement/phase-context.test
 */

import { describe, it, expect } from "bun:test";
import {
  buildPhaseEnforcement,
  buildStateContext,
  buildEnforcementContext,
  getPhaseEnforcement,
  isOperationAllowed,
} from "./phase-context.js";
import type { GoopState, WorkflowPhase } from "../../core/types.js";

// Helper to create a minimal state for testing
function createTestState(overrides: Partial<GoopState["workflow"]> = {}): GoopState {
  return {
    version: 1,
    project: {
      name: "test-project",
      initialized: new Date().toISOString(),
    },
    workflow: {
      currentPhase: null,
      phase: "idle" as WorkflowPhase,
      mode: "standard",
      depth: "standard",
      researchOptIn: false,
      specLocked: false,
      acceptanceConfirmed: false,
      currentWave: 0,
      totalWaves: 0,
      lastActivity: new Date().toISOString(),
      ...overrides,
    },
    execution: {
      activeCheckpointId: null,
      completedPhases: [],
      pendingTasks: [],
    },
  };
}

describe("buildPhaseEnforcement", () => {
  describe("plan phase", () => {
    it("returns MUST DO and MUST NOT DO lists", () => {
      const state = createTestState({ phase: "plan" });
      const result = buildPhaseEnforcement("plan", state);

      expect(result).toContain("PHASE ENFORCEMENT: PLAN");
      expect(result).toContain("MUST DO:");
      expect(result).toContain("MUST NOT DO:");
    });

    it("includes requirement to create SPEC.md", () => {
      const state = createTestState({ phase: "plan" });
      const result = buildPhaseEnforcement("plan", state);

      expect(result).toContain("Create SPEC.md");
    });

    it("prohibits writing implementation code", () => {
      const state = createTestState({ phase: "plan" });
      const result = buildPhaseEnforcement("plan", state);

      expect(result).toContain("Write ANY implementation code");
    });
  });

  describe("execute phase", () => {
    it("includes delegation reminder", () => {
      const state = createTestState({ phase: "execute" });
      const result = buildPhaseEnforcement("execute", state);

      expect(result).toContain("DELEGATION (CRITICAL)");
      expect(result).toContain("task({");
      expect(result).toContain("subagent_type:");
    });

    it("emphasizes using task tool not delegate tool", () => {
      const state = createTestState({ phase: "execute" });
      const result = buildPhaseEnforcement("execute", state);

      expect(result).toContain('Use "task" tool, NOT "delegate" tool');
    });

    it("requires delegation for code work", () => {
      const state = createTestState({ phase: "execute" });
      const result = buildPhaseEnforcement("execute", state);

      expect(result).toContain("DELEGATE all code work");
    });
  });

  describe("idle phase", () => {
    it("suggests using /goop-plan", () => {
      const state = createTestState({ phase: "idle" });
      const result = buildPhaseEnforcement("idle", state);

      expect(result).toContain("/goop-plan");
    });
  });
});

describe("buildStateContext", () => {
  it("includes current phase", () => {
    const state = createTestState({ phase: "plan" });
    const result = buildStateContext(state);

    expect(result).toContain("**Phase:** plan");
  });

  it("includes spec locked status", () => {
    const state = createTestState({ specLocked: true });
    const result = buildStateContext(state);

    expect(result).toContain("**Spec Locked:** Yes");
  });

  it("includes wave progress when waves exist", () => {
    const state = createTestState({ currentWave: 2, totalWaves: 5 });
    const result = buildStateContext(state);

    expect(result).toContain("**Wave Progress:** 2/5");
  });

  it("omits wave progress when no waves", () => {
    const state = createTestState({ currentWave: 0, totalWaves: 0 });
    const result = buildStateContext(state);

    expect(result).not.toContain("Wave Progress");
  });
});

describe("buildEnforcementContext", () => {
  it("combines state and phase enforcement", () => {
    const state = createTestState({ phase: "plan" });
    const result = buildEnforcementContext(state);

    expect(result).toContain("CURRENT STATE");
    expect(result).toContain("PHASE ENFORCEMENT");
  });
});

describe("getPhaseEnforcement", () => {
  it("returns enforcement rules for each phase", () => {
    const phases: WorkflowPhase[] = ["idle", "plan", "research", "specify", "execute", "accept"];

    for (const phase of phases) {
      const rules = getPhaseEnforcement(phase);
      expect(rules.phase).toBe(phase);
      expect(rules.mustDo.length).toBeGreaterThan(0);
      expect(rules.mustNotDo.length).toBeGreaterThan(0);
    }
  });

  it("execute phase has delegation reminder", () => {
    const rules = getPhaseEnforcement("execute");
    expect(rules.delegationReminder).toBeDefined();
    expect(rules.delegationReminder).toContain("task");
  });
});

describe("isOperationAllowed", () => {
  describe("write_code operation", () => {
    it("not allowed in plan phase", () => {
      const result = isOperationAllowed("plan", "write_code");
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("plan phase");
    });

    it("not allowed in research phase", () => {
      const result = isOperationAllowed("research", "write_code");
      expect(result.allowed).toBe(false);
    });

    it("not allowed in specify phase", () => {
      const result = isOperationAllowed("specify", "write_code");
      expect(result.allowed).toBe(false);
    });

    it("not allowed directly in execute phase (must delegate)", () => {
      const result = isOperationAllowed("execute", "write_code");
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("delegate");
    });

    it("allowed in accept phase (for fixes)", () => {
      const result = isOperationAllowed("accept", "write_code");
      expect(result.allowed).toBe(true);
    });
  });

  describe("delegate operation", () => {
    it("not allowed in idle phase", () => {
      const result = isOperationAllowed("idle", "delegate");
      expect(result.allowed).toBe(false);
    });

    it("not allowed in plan phase", () => {
      const result = isOperationAllowed("plan", "delegate");
      expect(result.allowed).toBe(false);
    });

    it("allowed in execute phase", () => {
      const result = isOperationAllowed("execute", "delegate");
      expect(result.allowed).toBe(true);
    });
  });

  describe("create_doc operation", () => {
    it("always allowed", () => {
      const phases: WorkflowPhase[] = ["idle", "plan", "research", "specify", "execute", "accept"];
      for (const phase of phases) {
        const result = isOperationAllowed(phase, "create_doc");
        expect(result.allowed).toBe(true);
      }
    });
  });
});
