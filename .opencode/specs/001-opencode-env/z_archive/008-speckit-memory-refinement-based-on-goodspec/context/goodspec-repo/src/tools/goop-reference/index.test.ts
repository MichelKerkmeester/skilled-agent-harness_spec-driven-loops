/**
 * Tests for goop_reference tool
 */

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { createGoopReferenceTool } from "./index.js";
import {
  createMockPluginContext,
  createMockToolContext,
  createMockResource,
  setupTestEnvironment,
} from "../../test-utils.js";
import type { PluginContext, ResolvedResource } from "../../core/types.js";

describe("goop_reference tool", () => {
  let ctx: PluginContext;
  let cleanup: () => void;
  let testDir: string;

  const testReference: ResolvedResource = createMockResource({
    name: "test-protocol",
    type: "reference",
    frontmatter: {
      name: "test-protocol",
      description: "A test protocol for unit testing",
      category: "testing",
    },
    body: `# Test Protocol

## Overview
This is a test protocol.

## Steps
1. Step one
2. Step two

## Verification
Check that it works.`,
  });

  const securityReference: ResolvedResource = createMockResource({
    name: "security-checklist",
    type: "reference",
    frontmatter: {
      name: "security-checklist",
      description: "Security verification checklist",
    },
    body: `# Security Checklist

## Authentication
- [ ] Passwords hashed
- [ ] Sessions secure

## Authorization
- [ ] Routes protected
- [ ] Data access controlled`,
  });

  const specTemplate: ResolvedResource = createMockResource({
    name: "spec",
    type: "template",
    frontmatter: {
      name: "spec",
      description: "SPEC.md template for requirements",
    },
    body: `# SPEC: [Feature Name]

## Must Haves
- [ ] Requirement 1
- [ ] Requirement 2

## Should Haves
- [ ] Nice to have 1

## Out of Scope
- Not doing X`,
  });

  beforeEach(() => {
    const env = setupTestEnvironment("goop-reference");
    cleanup = env.cleanup;
    testDir = env.testDir;
    
    ctx = createMockPluginContext({
      testDir,
      resources: [testReference, securityReference, specTemplate],
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe("list mode", () => {
    it("lists all references and templates when called with list: true", async () => {
      const tool = createGoopReferenceTool(ctx);
      const result = await tool.execute({ list: true }, createMockToolContext());
      
      expect(result).toContain("Available References");
      expect(result).toContain("test-protocol");
      expect(result).toContain("security-checklist");
      expect(result).toContain("Available Templates");
      expect(result).toContain("spec");
    });

    it("lists only references when type is 'reference'", async () => {
      const tool = createGoopReferenceTool(ctx);
      const result = await tool.execute({ list: true, type: "reference" }, createMockToolContext());
      
      expect(result).toContain("Available References");
      expect(result).toContain("test-protocol");
      expect(result).not.toContain("Available Templates");
    });

    it("lists only templates when type is 'template'", async () => {
      const tool = createGoopReferenceTool(ctx);
      const result = await tool.execute({ list: true, type: "template" }, createMockToolContext());
      
      expect(result).toContain("Available Templates");
      expect(result).toContain("spec");
      expect(result).not.toContain("Available References");
    });

    it("shows list when no arguments provided", async () => {
      const tool = createGoopReferenceTool(ctx);
      const result = await tool.execute({}, createMockToolContext());
      
      expect(result).toContain("Available");
    });

    it("shows descriptions in list", async () => {
      const tool = createGoopReferenceTool(ctx);
      const result = await tool.execute({ list: true }, createMockToolContext());
      
      expect(result).toContain("A test protocol");
      expect(result).toContain("SPEC.md template");
    });
  });

  describe("load specific resource", () => {
    it("loads a reference by name", async () => {
      const tool = createGoopReferenceTool(ctx);
      const result = await tool.execute({ name: "test-protocol" }, createMockToolContext());
      
      expect(result).toContain("Reference: test-protocol");
      expect(result).toContain("A test protocol");
      expect(result).toContain("Step one");
      expect(result).toContain("Step two");
    });

    it("loads a template by name", async () => {
      const tool = createGoopReferenceTool(ctx);
      const result = await tool.execute({ name: "spec" }, createMockToolContext());
      
      expect(result).toContain("Template: spec");
      expect(result).toContain("Must Haves");
      expect(result).toContain("Should Haves");
    });

    it("returns error for non-existent resource", async () => {
      const tool = createGoopReferenceTool(ctx);
      const result = await tool.execute({ name: "nonexistent" }, createMockToolContext());
      
      expect(result).toContain("not found");
      expect(result).toContain("Available references");
    });

    it("shows metadata when loading", async () => {
      const tool = createGoopReferenceTool(ctx);
      const result = await tool.execute({ name: "test-protocol" }, createMockToolContext());
      
      expect(result).toContain("**Description:**");
      expect(result).toContain("**Category:**");
      expect(result).toContain("testing");
    });
  });

  describe("section extraction", () => {
    it("extracts a specific section from a reference", async () => {
      const tool = createGoopReferenceTool(ctx);
      const result = await tool.execute(
        { name: "test-protocol", section: "Steps" },
        createMockToolContext()
      );
      
      expect(result).toContain("Steps");
      expect(result).toContain("Step one");
      expect(result).toContain("Step two");
    });

    it("extracts a section from a template", async () => {
      const tool = createGoopReferenceTool(ctx);
      const result = await tool.execute(
        { name: "spec", section: "Must Haves" },
        createMockToolContext()
      );
      
      expect(result).toContain("Must Haves");
      expect(result).toContain("Requirement 1");
    });

    it("returns error for non-existent section", async () => {
      const tool = createGoopReferenceTool(ctx);
      const result = await tool.execute(
        { name: "test-protocol", section: "NonExistent" },
        createMockToolContext()
      );
      
      expect(result).toContain("not found");
    });
  });

  describe("type filtering", () => {
    it("respects type filter when loading", async () => {
      const tool = createGoopReferenceTool(ctx);
      
      // Should find reference
      const refResult = await tool.execute(
        { name: "test-protocol", type: "reference" },
        createMockToolContext()
      );
      expect(refResult).toContain("Reference: test-protocol");
      
      // Should find template
      const tmplResult = await tool.execute(
        { name: "spec", type: "template" },
        createMockToolContext()
      );
      expect(tmplResult).toContain("Template: spec");
    });

    it("returns not found when type doesn't match", async () => {
      const tool = createGoopReferenceTool(ctx);
      
      // Reference with template type should not find
      const result = await tool.execute(
        { name: "test-protocol", type: "template" },
        createMockToolContext()
      );
      expect(result).toContain("not found");
    });
  });

  describe("empty state", () => {
    it("handles no resources gracefully", async () => {
      const emptyCtx = createMockPluginContext({
        testDir,
        resources: [],
      });
      
      const tool = createGoopReferenceTool(emptyCtx);
      const result = await tool.execute({ list: true }, createMockToolContext());
      
      expect(result).toContain("No references or templates found");
    });
  });
});
