/**
 * Tests for Enforcement Validators
 * @module features/enforcement/validators.test
 */

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { mkdirSync, writeFileSync } from "fs";
import { validateWriteOperation, validatePhaseTransition } from "./validators.js";
import { getPhaseDir } from "./scaffolder.js";
import {
  createMockPluginContext,
  setupTestEnvironment,
  DEFAULT_TEST_STATE,
  type PluginContext,
} from "../../test-utils.js";

describe("validateWriteOperation", () => {
  it("returns warning when writing to src/ in plan phase", () => {
    const result = validateWriteOperation("plan", "src/features/example.ts");

    expect(result.valid).toBe(false);
    expect(result.warning).toContain("plan");
  });

  it("allows writing to .goopspec/ in any phase", () => {
    const result = validateWriteOperation("research", ".goopspec/SPEC.md");

    expect(result.valid).toBe(true);
  });
});

describe("validatePhaseTransition", () => {
  let ctx: PluginContext;
  let cleanup: () => void;

  beforeEach(() => {
    const env = setupTestEnvironment("validators-transition");
    cleanup = env.cleanup;
    ctx = createMockPluginContext({
      testDir: env.testDir,
      state: {
        workflow: {
          ...DEFAULT_TEST_STATE.workflow,
          currentPhase: "Phase Alpha",
        },
      },
    });
  });

  afterEach(() => cleanup());

  it("blocks transition to execute without SPEC.md", () => {
    const result = validatePhaseTransition(ctx, "specify", "execute");

    expect(result.allowed).toBe(false);
    expect(result.missing).toContain("SPEC.md");
  });

  it("allows transition to execute with SPEC.md", () => {
    const phaseDir = getPhaseDir(ctx, "Phase Alpha");
    mkdirSync(phaseDir, { recursive: true });
    writeFileSync(`${phaseDir}/SPEC.md`, "spec", "utf-8");

    const result = validatePhaseTransition(ctx, "specify", "execute");

    expect(result.allowed).toBe(true);
  });
});
