/**
 * Tests for Document Scaffolder
 * @module features/enforcement/scaffolder.test
 */

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { scaffoldPhaseDocuments, checkPhaseDocuments, getPhaseDir } from "./scaffolder.js";
import { createMockPluginContext, setupTestEnvironment, type PluginContext } from "../../test-utils.js";

function writeTemplates(rootDir: string, templates: Record<string, string>): void {
  const templatesDir = join(rootDir, "templates");
  mkdirSync(templatesDir, { recursive: true });
  for (const [name, content] of Object.entries(templates)) {
    writeFileSync(join(templatesDir, name), content, "utf-8");
  }
}

describe("scaffoldPhaseDocuments", () => {
  let ctx: PluginContext;
  let cleanup: () => void;
  let testDir: string;

  beforeEach(() => {
    const env = setupTestEnvironment("scaffolder");
    cleanup = env.cleanup;
    testDir = env.testDir;
    ctx = createMockPluginContext({ testDir });
  });

  afterEach(() => cleanup());

  it("creates phase directory and required documents for plan phase", async () => {
    writeTemplates(testDir, {
      "spec.md": "# {{project_name}}\nPhase: {{phase_name}}\n",
      "chronicle.md": "# Chronicle {{project_name}}\nPhase: {{phase_name}}\n",
    });

    const result = await scaffoldPhaseDocuments(ctx, "Plan Phase", "plan");

    expect(result.success).toBe(true);
    expect(existsSync(result.phaseDir)).toBe(true);
    expect(result.documentsCreated).toEqual(["SPEC.md", "CHRONICLE.md"]);
    expect(result.documentsSkipped).toEqual([]);

    const specPath = join(result.phaseDir, "SPEC.md");
    const chroniclePath = join(result.phaseDir, "CHRONICLE.md");
    expect(existsSync(specPath)).toBe(true);
    expect(existsSync(chroniclePath)).toBe(true);
    expect(readFileSync(specPath, "utf-8")).toContain("test-project");
    expect(readFileSync(chroniclePath, "utf-8")).toContain("Plan Phase");
  });

  it("skips documents that already exist", async () => {
    writeTemplates(testDir, {
      "spec.md": "# {{project_name}}\n",
      "chronicle.md": "# Chronicle\n",
    });

    const phaseDir = getPhaseDir(ctx, "Plan");
    mkdirSync(phaseDir, { recursive: true });
    const specPath = join(phaseDir, "SPEC.md");
    const chroniclePath = join(phaseDir, "CHRONICLE.md");
    writeFileSync(specPath, "existing spec", "utf-8");
    writeFileSync(chroniclePath, "existing chronicle", "utf-8");

    const result = await scaffoldPhaseDocuments(ctx, "Plan", "plan");

    expect(result.documentsCreated).toEqual([]);
    expect(result.documentsSkipped).toEqual(["SPEC.md", "CHRONICLE.md"]);
    expect(readFileSync(specPath, "utf-8")).toBe("existing spec");
    expect(readFileSync(chroniclePath, "utf-8")).toBe("existing chronicle");
  });

  it("creates minimal documents when templates are missing", async () => {
    writeTemplates(testDir, {});

    const result = await scaffoldPhaseDocuments(ctx, "Plan", "plan");

    const specPath = join(result.phaseDir, "SPEC.md");
    const chroniclePath = join(result.phaseDir, "CHRONICLE.md");
    expect(existsSync(specPath)).toBe(true);
    expect(existsSync(chroniclePath)).toBe(true);
    expect(readFileSync(specPath, "utf-8")).toContain("GoopSpec v0.1.0");
    expect(readFileSync(chroniclePath, "utf-8")).toContain("GoopSpec v0.1.0");
  });
});

describe("checkPhaseDocuments", () => {
  let ctx: PluginContext;
  let cleanup: () => void;
  let testDir: string;

  beforeEach(() => {
    const env = setupTestEnvironment("scaffolder-check");
    cleanup = env.cleanup;
    testDir = env.testDir;
    ctx = createMockPluginContext({ testDir });
  });

  afterEach(() => cleanup());

  it("returns valid true when all required docs exist", () => {
    const phaseDir = getPhaseDir(ctx, "Plan Phase");
    mkdirSync(phaseDir, { recursive: true });
    writeFileSync(join(phaseDir, "SPEC.md"), "spec", "utf-8");
    writeFileSync(join(phaseDir, "CHRONICLE.md"), "chronicle", "utf-8");

    const result = checkPhaseDocuments(ctx, "Plan Phase", "plan");

    expect(result.valid).toBe(true);
    expect(result.missing).toEqual([]);
    expect(result.existing).toEqual(["SPEC.md", "CHRONICLE.md"]);
  });

  it("returns missing list when required docs are absent", () => {
    const result = checkPhaseDocuments(ctx, "Plan Phase", "plan");

    expect(result.valid).toBe(false);
    expect(result.missing).toEqual(["SPEC.md", "CHRONICLE.md"]);
    expect(result.existing).toEqual([]);
  });
});

describe("getPhaseDir", () => {
  it("returns correct path with sanitized phase name", () => {
    const env = setupTestEnvironment("scaffolder-path");
    const ctx = createMockPluginContext({ testDir: env.testDir });

    const phaseDir = getPhaseDir(ctx, "Plan Phase 1!");

    expect(phaseDir).toBe(join(env.testDir, ".goopspec", "phases", "plan-phase-1"));
    env.cleanup();
  });
});
