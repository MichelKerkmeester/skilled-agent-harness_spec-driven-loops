/**
 * Unit Tests for GoopSpec Skill Tool
 * @module tools/goop-skill/index.test
 */

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { createGoopSkillTool } from "./index.js";
import {
  createMockPluginContext,
  createMockToolContext,
  createMockResourceResolver,
  createMockResource,
  setupTestEnvironment,
  TEST_SKILL_RESOURCE,
  type PluginContext,
  type ResolvedResource,
} from "../../test-utils.js";

describe("goop_skill tool", () => {
  let ctx: PluginContext;
  let toolContext: ReturnType<typeof createMockToolContext>;
  let cleanup: () => void;

  beforeEach(() => {
    const env = setupTestEnvironment("goop-skill-test");
    cleanup = env.cleanup;
    ctx = createMockPluginContext({ testDir: env.testDir });
    toolContext = createMockToolContext({ directory: env.testDir });
  });

  afterEach(() => {
    cleanup();
  });

  describe("tool creation", () => {
    it("creates tool with correct description", () => {
      const tool = createGoopSkillTool(ctx);
      
      expect(tool.description).toContain("skill");
      expect(tool.description).toContain("knowledge");
    });

    it("has required args", () => {
      const tool = createGoopSkillTool(ctx);
      
      expect(tool.args).toHaveProperty("name");
      expect(tool.args).toHaveProperty("list");
    });
  });

  describe("list skills", () => {
    it("shows no skills available when empty", async () => {
      // Default mock resolver has no resources
      const tool = createGoopSkillTool(ctx);
      const result = await tool.execute({ list: true }, toolContext);

      expect(result).toContain("No skills available");
    });

    it("lists available skills", async () => {
      const skills: ResolvedResource[] = [
        createMockResource({
          name: "goop-core/skill",
          type: "skill",
          frontmatter: {
            name: "goop-core",
            description: "Core GoopSpec workflow",
            category: "workflow",
          },
          body: "# GoopSpec Core",
        }),
        createMockResource({
          name: "testing/skill",
          type: "skill",
          frontmatter: {
            name: "testing",
            description: "Testing best practices",
            category: "quality",
          },
          body: "# Testing",
        }),
      ];

      ctx = createMockPluginContext({
        testDir: ctx.input.directory,
        resources: skills,
      });

      const tool = createGoopSkillTool(ctx);
      const result = await tool.execute({ list: true }, toolContext);

      expect(result).toContain("# Available Skills");
      expect(result).toContain("goop-core");
      expect(result).toContain("testing");
    });

    it("shows skill descriptions in list", async () => {
      const skills: ResolvedResource[] = [
        createMockResource({
          name: "test-skill",
          type: "skill",
          frontmatter: {
            name: "test-skill",
            description: "A skill for testing purposes",
          },
          body: "Skill content",
        }),
      ];

      ctx = createMockPluginContext({
        testDir: ctx.input.directory,
        resources: skills,
      });

      const tool = createGoopSkillTool(ctx);
      const result = await tool.execute({ list: true }, toolContext);

      expect(result).toContain("A skill for testing purposes");
    });

    it("shows skill categories in list", async () => {
      const skills: ResolvedResource[] = [
        createMockResource({
          name: "categorized-skill",
          type: "skill",
          frontmatter: {
            name: "categorized-skill",
            description: "Has a category",
            category: "testing",
          },
          body: "Content",
        }),
      ];

      ctx = createMockPluginContext({
        testDir: ctx.input.directory,
        resources: skills,
      });

      const tool = createGoopSkillTool(ctx);
      const result = await tool.execute({ list: true }, toolContext);

      expect(result).toContain("(testing)");
    });

    it("lists skills when name is empty", async () => {
      const skills: ResolvedResource[] = [TEST_SKILL_RESOURCE];

      ctx = createMockPluginContext({
        testDir: ctx.input.directory,
        resources: skills,
      });

      const tool = createGoopSkillTool(ctx);
      const result = await tool.execute({ name: "" }, toolContext);

      expect(result).toContain("# Available Skills");
    });
  });

  describe("load specific skill", () => {
    it("loads skill by name", async () => {
      const skills: ResolvedResource[] = [
        createMockResource({
          name: "my-skill",
          type: "skill",
          frontmatter: {
            name: "my-skill",
            description: "My custom skill",
          },
          body: "# My Skill\n\nThis is the skill content.",
        }),
      ];

      ctx = createMockPluginContext({
        testDir: ctx.input.directory,
        resources: skills,
      });

      const tool = createGoopSkillTool(ctx);
      const result = await tool.execute({ name: "my-skill" }, toolContext);

      expect(result).toContain("# Skill: my-skill");
      expect(result).toContain("This is the skill content");
    });

    it("shows skill description when loaded", async () => {
      const skills: ResolvedResource[] = [
        createMockResource({
          name: "described-skill",
          type: "skill",
          frontmatter: {
            name: "described-skill",
            description: "Detailed description here",
          },
          body: "Content",
        }),
      ];

      ctx = createMockPluginContext({
        testDir: ctx.input.directory,
        resources: skills,
      });

      const tool = createGoopSkillTool(ctx);
      const result = await tool.execute({ name: "described-skill" }, toolContext);

      expect(result).toContain("**Description:**");
      expect(result).toContain("Detailed description here");
    });

    it("shows skill category when loaded", async () => {
      const skills: ResolvedResource[] = [
        createMockResource({
          name: "cat-skill",
          type: "skill",
          frontmatter: {
            name: "cat-skill",
            description: "Has category",
            category: "development",
          },
          body: "Content",
        }),
      ];

      ctx = createMockPluginContext({
        testDir: ctx.input.directory,
        resources: skills,
      });

      const tool = createGoopSkillTool(ctx);
      const result = await tool.execute({ name: "cat-skill" }, toolContext);

      expect(result).toContain("**Category:**");
      expect(result).toContain("development");
    });

    it("shows not found for missing skill", async () => {
      const tool = createGoopSkillTool(ctx);
      const result = await tool.execute({ name: "nonexistent" }, toolContext);

      expect(result).toContain("not found");
      expect(result).toContain("nonexistent");
    });

    it("shows available skills when skill not found", async () => {
      const skills: ResolvedResource[] = [
        createMockResource({
          name: "exists",
          type: "skill",
          frontmatter: { name: "exists", description: "Exists" },
          body: "Content",
        }),
      ];

      ctx = createMockPluginContext({
        testDir: ctx.input.directory,
        resources: skills,
      });

      const tool = createGoopSkillTool(ctx);
      const result = await tool.execute({ name: "missing" }, toolContext);

      expect(result).toContain("not found");
      expect(result).toContain("Available skills:");
      expect(result).toContain("exists");
    });
  });

  describe("skill content formatting", () => {
    it("includes separator before body", async () => {
      const skills: ResolvedResource[] = [
        createMockResource({
          name: "format-test",
          type: "skill",
          frontmatter: { name: "format-test", description: "Test" },
          body: "Body content here",
        }),
      ];

      ctx = createMockPluginContext({
        testDir: ctx.input.directory,
        resources: skills,
      });

      const tool = createGoopSkillTool(ctx);
      const result = await tool.execute({ name: "format-test" }, toolContext);

      expect(result).toContain("---");
      expect(result).toContain("Body content here");
    });

    it("preserves markdown formatting in body", async () => {
      const skills: ResolvedResource[] = [
        createMockResource({
          name: "markdown-skill",
          type: "skill",
          frontmatter: { name: "markdown-skill", description: "MD" },
          body: "# Heading\n\n- List item\n- Another item\n\n```js\ncode\n```",
        }),
      ];

      ctx = createMockPluginContext({
        testDir: ctx.input.directory,
        resources: skills,
      });

      const tool = createGoopSkillTool(ctx);
      const result = await tool.execute({ name: "markdown-skill" }, toolContext);

      expect(result).toContain("# Heading");
      expect(result).toContain("- List item");
      expect(result).toContain("```js");
    });
  });

  describe("skill name resolution", () => {
    it("resolves skill with direct name", async () => {
      const skills: ResolvedResource[] = [
        createMockResource({
          name: "direct-name",
          type: "skill",
          frontmatter: { name: "direct-name", description: "Direct" },
          body: "Direct skill",
        }),
      ];

      ctx = createMockPluginContext({
        testDir: ctx.input.directory,
        resources: skills,
      });

      const tool = createGoopSkillTool(ctx);
      const result = await tool.execute({ name: "direct-name" }, toolContext);

      expect(result).toContain("Direct skill");
    });

    it("resolves skill with /skill suffix", async () => {
      const skills: ResolvedResource[] = [
        createMockResource({
          name: "nested/skill",
          type: "skill",
          frontmatter: { name: "nested", description: "Nested" },
          body: "Nested skill content",
        }),
      ];

      ctx = createMockPluginContext({
        testDir: ctx.input.directory,
        resources: skills,
      });

      const tool = createGoopSkillTool(ctx);
      const result = await tool.execute({ name: "nested" }, toolContext);

      expect(result).toContain("Nested skill content");
    });
  });
});
