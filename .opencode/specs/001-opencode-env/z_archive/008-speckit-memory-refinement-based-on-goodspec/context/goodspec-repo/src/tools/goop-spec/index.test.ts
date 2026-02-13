/**
 * Tests for GoopSpec Spec Tool
 * @module tools/goop-spec/index.test
 */

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { mkdirSync, writeFileSync, rmSync } from "fs";
import { join } from "path";
import { createGoopSpecTool } from "./index.js";
import {
  createMockPluginContext,
  createMockToolContext,
} from "../../test-utils.js";
import type { PluginContext } from "../../core/types.js";

describe("createGoopSpecTool", () => {
  let ctx: PluginContext;
  let testDir: string;
  let goopspecDir: string;

  beforeEach(() => {
    testDir = `/tmp/goop-spec-test-${Date.now()}`;
    goopspecDir = join(testDir, ".goopspec");
    mkdirSync(goopspecDir, { recursive: true });
    mkdirSync(join(goopspecDir, "phases"), { recursive: true });

    ctx = createMockPluginContext({ testDir });
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  describe("tool creation", () => {
    it("creates a tool definition", () => {
      const tool = createGoopSpecTool(ctx);
      expect(tool).toBeDefined();
      expect(tool.description).toContain("SPEC.md");
      expect(tool.description).toContain("PLAN.md");
    });
  });

  describe("list action", () => {
    it("returns message when no phases exist", async () => {
      const tool = createGoopSpecTool(ctx);
      const toolCtx = createMockToolContext({ directory: testDir });
      
      const result = await tool.execute({ action: "list" }, toolCtx);
      expect(result).toContain("No phases found");
      expect(result).toContain("/goop-plan");
    });

    it("lists available phases with their files", async () => {
      // Create some phases
      const phase1Dir = join(goopspecDir, "phases", "phase-1");
      mkdirSync(phase1Dir, { recursive: true });
      writeFileSync(join(phase1Dir, "SPEC.md"), "# Spec");
      writeFileSync(join(phase1Dir, "PLAN.md"), "# Plan");

      const phase2Dir = join(goopspecDir, "phases", "phase-2");
      mkdirSync(phase2Dir, { recursive: true });
      writeFileSync(join(phase2Dir, "SPEC.md"), "# Spec only");

      const tool = createGoopSpecTool(ctx);
      const toolCtx = createMockToolContext({ directory: testDir });
      
      const result = await tool.execute({ action: "list" }, toolCtx);
      expect(result).toContain("phase-1");
      expect(result).toContain("phase-2");
      expect(result).toContain("SPEC");
      expect(result).toContain("PLAN");
    });

    it("handles empty phases directory", async () => {
      const tool = createGoopSpecTool(ctx);
      const toolCtx = createMockToolContext({ directory: testDir });
      
      const result = await tool.execute({ action: "list" }, toolCtx);
      expect(result).toContain("No phases found");
    });
  });

  describe("read action", () => {
    beforeEach(() => {
      // Create a test phase with files
      const phaseDir = join(goopspecDir, "phases", "test-phase");
      mkdirSync(phaseDir, { recursive: true });
      
      writeFileSync(join(phaseDir, "SPEC.md"), `---
phase: 1
title: Test Phase
status: active
---

# Test Phase Specification

## Requirements
- Req 1
- Req 2
`);

      writeFileSync(join(phaseDir, "PLAN.md"), `---
phase: 1
plan: 1.1
type: auto
---

# Test Phase Plan

## Wave 1

<task type="auto">
  <name>Task 1</name>
</task>
`);
    });

    it("requires phase parameter", async () => {
      const tool = createGoopSpecTool(ctx);
      const toolCtx = createMockToolContext({ directory: testDir });
      
      const result = await tool.execute({ action: "read" }, toolCtx);
      expect(result).toContain("Error");
      expect(result).toContain("phase");
      expect(result).toContain("required");
    });

    it("reads spec file", async () => {
      const tool = createGoopSpecTool(ctx);
      const toolCtx = createMockToolContext({ directory: testDir });
      
      const result = await tool.execute({ action: "read", phase: "test-phase", file: "spec" }, toolCtx);
      expect(result).toContain("SPEC.md");
      expect(result).toContain("Test Phase Specification");
      expect(result).toContain("Requirements");
    });

    it("reads plan file", async () => {
      const tool = createGoopSpecTool(ctx);
      const toolCtx = createMockToolContext({ directory: testDir });
      
      const result = await tool.execute({ action: "read", phase: "test-phase", file: "plan" }, toolCtx);
      expect(result).toContain("PLAN.md");
      expect(result).toContain("Test Phase Plan");
      expect(result).toContain("Wave 1");
    });

    it("reads both files by default", async () => {
      const tool = createGoopSpecTool(ctx);
      const toolCtx = createMockToolContext({ directory: testDir });
      
      const result = await tool.execute({ action: "read", phase: "test-phase" }, toolCtx);
      expect(result).toContain("SPEC.md");
      expect(result).toContain("PLAN.md");
    });

    it("handles non-existent phase", async () => {
      const tool = createGoopSpecTool(ctx);
      const toolCtx = createMockToolContext({ directory: testDir });
      
      const result = await tool.execute({ action: "read", phase: "non-existent" }, toolCtx);
      expect(result).toContain("not found");
      expect(result).toContain("list");
    });

    it("handles missing spec file", async () => {
      const phaseDir = join(goopspecDir, "phases", "plan-only");
      mkdirSync(phaseDir, { recursive: true });
      writeFileSync(join(phaseDir, "PLAN.md"), "# Plan");

      const tool = createGoopSpecTool(ctx);
      const toolCtx = createMockToolContext({ directory: testDir });
      
      const result = await tool.execute({ action: "read", phase: "plan-only", file: "spec" }, toolCtx);
      expect(result).toContain("SPEC.md not found");
    });

    it("handles missing plan file", async () => {
      const phaseDir = join(goopspecDir, "phases", "spec-only");
      mkdirSync(phaseDir, { recursive: true });
      writeFileSync(join(phaseDir, "SPEC.md"), "# Spec");

      const tool = createGoopSpecTool(ctx);
      const toolCtx = createMockToolContext({ directory: testDir });
      
      const result = await tool.execute({ action: "read", phase: "spec-only", file: "plan" }, toolCtx);
      expect(result).toContain("PLAN.md not found");
    });
  });

  describe("validate action", () => {
    it("requires phase parameter", async () => {
      const tool = createGoopSpecTool(ctx);
      const toolCtx = createMockToolContext({ directory: testDir });
      
      const result = await tool.execute({ action: "validate" }, toolCtx);
      expect(result).toContain("Error");
      expect(result).toContain("phase");
      expect(result).toContain("required");
    });

    it("validates complete phase files", async () => {
      const phaseDir = join(goopspecDir, "phases", "valid-phase");
      mkdirSync(phaseDir, { recursive: true });
      
      writeFileSync(join(phaseDir, "SPEC.md"), `---
phase: 1
title: Valid Phase
status: active
---
# Content`);

      writeFileSync(join(phaseDir, "PLAN.md"), `---
phase: 1
plan: 1.1
type: auto
---
# Content
<task type="auto">Task</task>`);

      const tool = createGoopSpecTool(ctx);
      const toolCtx = createMockToolContext({ directory: testDir });
      
      const result = await tool.execute({ action: "validate", phase: "valid-phase" }, toolCtx);
      expect(result).toContain("VALID");
      expect(result).toContain("No issues found");
    });

    it("reports missing frontmatter fields in SPEC", async () => {
      const phaseDir = join(goopspecDir, "phases", "incomplete-spec");
      mkdirSync(phaseDir, { recursive: true });
      
      writeFileSync(join(phaseDir, "SPEC.md"), `---
phase: 1
---
# No title or status`);

      writeFileSync(join(phaseDir, "PLAN.md"), `---
phase: 1
plan: 1.1
type: auto
---
<task>Task</task>`);

      const tool = createGoopSpecTool(ctx);
      const toolCtx = createMockToolContext({ directory: testDir });
      
      const result = await tool.execute({ action: "validate", phase: "incomplete-spec" }, toolCtx);
      expect(result).toContain("ISSUES FOUND");
      expect(result).toContain("title");
      expect(result).toContain("status");
    });

    it("reports missing frontmatter fields in PLAN", async () => {
      const phaseDir = join(goopspecDir, "phases", "incomplete-plan");
      mkdirSync(phaseDir, { recursive: true });
      
      writeFileSync(join(phaseDir, "SPEC.md"), `---
phase: 1
title: Test
status: active
---
# Spec`);

      writeFileSync(join(phaseDir, "PLAN.md"), `---
phase: 1
---
# No plan or type
<task>Task</task>`);

      const tool = createGoopSpecTool(ctx);
      const toolCtx = createMockToolContext({ directory: testDir });
      
      const result = await tool.execute({ action: "validate", phase: "incomplete-plan" }, toolCtx);
      expect(result).toContain("ISSUES FOUND");
      expect(result).toContain("plan");
      expect(result).toContain("type");
    });

    it("reports missing tasks in PLAN", async () => {
      const phaseDir = join(goopspecDir, "phases", "no-tasks");
      mkdirSync(phaseDir, { recursive: true });
      
      writeFileSync(join(phaseDir, "SPEC.md"), `---
phase: 1
title: Test
status: active
---
# Spec`);

      writeFileSync(join(phaseDir, "PLAN.md"), `---
phase: 1
plan: 1.1
type: auto
---
# Plan with no tasks`);

      const tool = createGoopSpecTool(ctx);
      const toolCtx = createMockToolContext({ directory: testDir });
      
      const result = await tool.execute({ action: "validate", phase: "no-tasks" }, toolCtx);
      expect(result).toContain("ISSUES FOUND");
      expect(result).toContain("No <task>");
    });

    it("reports missing files", async () => {
      const phaseDir = join(goopspecDir, "phases", "empty-phase");
      mkdirSync(phaseDir, { recursive: true });

      const tool = createGoopSpecTool(ctx);
      const toolCtx = createMockToolContext({ directory: testDir });
      
      const result = await tool.execute({ action: "validate", phase: "empty-phase" }, toolCtx);
      expect(result).toContain("ISSUES FOUND");
      expect(result).toContain("SPEC.md not found");
      expect(result).toContain("PLAN.md not found");
    });

    it("handles non-existent phase", async () => {
      const tool = createGoopSpecTool(ctx);
      const toolCtx = createMockToolContext({ directory: testDir });
      
      const result = await tool.execute({ action: "validate", phase: "non-existent" }, toolCtx);
      expect(result).toContain("not found");
    });
  });

  describe("security - path traversal prevention", () => {
    it("blocks path traversal with ..", async () => {
      const tool = createGoopSpecTool(ctx);
      const toolCtx = createMockToolContext({ directory: testDir });
      
      const result = await tool.execute({ action: "read", phase: "../../../etc" }, toolCtx);
      expect(result).toContain("Error");
      expect(result).toContain("path traversal");
    });

    it("blocks path traversal with /", async () => {
      const tool = createGoopSpecTool(ctx);
      const toolCtx = createMockToolContext({ directory: testDir });
      
      const result = await tool.execute({ action: "read", phase: "foo/bar" }, toolCtx);
      expect(result).toContain("Error");
      expect(result).toContain("path traversal");
    });

    it("blocks path traversal with backslash", async () => {
      const tool = createGoopSpecTool(ctx);
      const toolCtx = createMockToolContext({ directory: testDir });
      
      const result = await tool.execute({ action: "read", phase: "foo\\bar" }, toolCtx);
      expect(result).toContain("Error");
      expect(result).toContain("path traversal");
    });

    it("blocks special characters in phase name", async () => {
      const tool = createGoopSpecTool(ctx);
      const toolCtx = createMockToolContext({ directory: testDir });
      
      const result = await tool.execute({ action: "read", phase: "phase$name" }, toolCtx);
      expect(result).toContain("Error");
      expect(result.toLowerCase()).toContain("invalid");
    });

    it("allows valid phase names with hyphens and underscores", async () => {
      const phaseDir = join(goopspecDir, "phases", "valid-phase_name");
      mkdirSync(phaseDir, { recursive: true });
      writeFileSync(join(phaseDir, "SPEC.md"), "# Content");

      const tool = createGoopSpecTool(ctx);
      const toolCtx = createMockToolContext({ directory: testDir });
      
      const result = await tool.execute({ action: "read", phase: "valid-phase_name", file: "spec" }, toolCtx);
      expect(result).toContain("SPEC.md");
    });
  });

  describe("unknown action", () => {
    it("handles unknown action", async () => {
      const tool = createGoopSpecTool(ctx);
      const toolCtx = createMockToolContext({ directory: testDir });
      
      const result = await tool.execute({ action: "unknown" as any }, toolCtx);
      expect(result).toContain("Unknown action");
    });
  });
});
