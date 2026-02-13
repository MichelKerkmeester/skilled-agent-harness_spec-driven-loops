/**
 * Unit Tests for Agent Factory
 * @module agents/agent-factory.test
 */

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import {
  createAgentFromMarkdown,
  validateAgentResource,
  type AgentConfig,
} from "./agent-factory.js";
import {
  createMockResourceResolver,
  createMockResource,
  setupTestEnvironment,
  TEST_SKILL_RESOURCE,
  type ResolvedResource,
} from "../test-utils.js";

describe("agent-factory", () => {
  let cleanup: () => void;

  beforeEach(() => {
    const env = setupTestEnvironment("agent-factory-test");
    cleanup = env.cleanup;
  });

  afterEach(() => {
    cleanup();
  });

  describe("createAgentFromMarkdown", () => {
    describe("basic agent creation", () => {
      it("creates agent with name from frontmatter", () => {
        const resource = createMockResource({
          name: "my-agent",
          type: "agent",
          frontmatter: {
            name: "my-agent",
            description: "Test agent",
            mode: "subagent",
          },
          body: "You are my agent.",
        });

        const resolver = createMockResourceResolver([resource]);
        const config = createAgentFromMarkdown(resource, resolver);

        expect(config.description).toBe("Test agent");
      });

      it("creates agent with description from frontmatter", () => {
        const resource = createMockResource({
          name: "test-agent",
          type: "agent",
          frontmatter: {
            name: "test-agent",
            description: "A test agent for testing",
            mode: "subagent",
          },
          body: "Prompt",
        });

        const resolver = createMockResourceResolver();
        const config = createAgentFromMarkdown(resource, resolver);

        expect(config.description).toBe("A test agent for testing");
      });

      it("uses resource name when frontmatter name missing", () => {
        const resource = createMockResource({
          name: "fallback-agent",
          type: "agent",
          frontmatter: {
            description: "Test",
            mode: "subagent",
          },
          body: "Prompt",
        });

        const resolver = createMockResourceResolver();
        const config = createAgentFromMarkdown(resource, resolver);

        expect(config.description).toBe("Test");
      });

      it("uses default description when missing", () => {
        const resource = createMockResource({
          name: "unnamed-agent",
          type: "agent",
          frontmatter: {
            mode: "subagent",
          },
          body: "Prompt",
        });

        const resolver = createMockResourceResolver();
        const config = createAgentFromMarkdown(resource, resolver);

        expect(config.description).toContain("GoopSpec");
      });
    });

    describe("mode handling", () => {
      it("respects primary mode", () => {
        const resource = createMockResource({
          name: "primary-agent",
          type: "agent",
          frontmatter: {
            mode: "primary",
            description: "Primary",
          },
          body: "Prompt",
        });

        const resolver = createMockResourceResolver();
        const config = createAgentFromMarkdown(resource, resolver);

        expect(config.mode).toBe("primary");
      });

      it("respects subagent mode", () => {
        const resource = createMockResource({
          name: "sub-agent",
          type: "agent",
          frontmatter: {
            mode: "subagent",
            description: "Sub",
          },
          body: "Prompt",
        });

        const resolver = createMockResourceResolver();
        const config = createAgentFromMarkdown(resource, resolver);

        expect(config.mode).toBe("subagent");
      });

      it("respects all mode", () => {
        const resource = createMockResource({
          name: "all-agent",
          type: "agent",
          frontmatter: {
            mode: "all",
            description: "All",
          },
          body: "Prompt",
        });

        const resolver = createMockResourceResolver();
        const config = createAgentFromMarkdown(resource, resolver);

        expect(config.mode).toBe("all");
      });

      it("defaults to subagent mode", () => {
        const resource = createMockResource({
          name: "no-mode-agent",
          type: "agent",
          frontmatter: {
            description: "No mode",
          },
          body: "Prompt",
        });

        const resolver = createMockResourceResolver();
        const config = createAgentFromMarkdown(resource, resolver);

        expect(config.mode).toBe("subagent");
      });
    });

    describe("model configuration", () => {
      it("uses model from frontmatter", () => {
        const resource = createMockResource({
          name: "model-agent",
          type: "agent",
          frontmatter: {
            mode: "subagent",
            model: "anthropic/claude-opus-4-5",
            description: "Model test",
          },
          body: "Prompt",
        });

        const resolver = createMockResourceResolver();
        const config = createAgentFromMarkdown(resource, resolver);

        expect(config.model).toBe("anthropic/claude-opus-4-5");
      });

      it("leaves model undefined when not specified", () => {
        const resource = createMockResource({
          name: "no-model-agent",
          type: "agent",
          frontmatter: {
            mode: "subagent",
            description: "No model",
          },
          body: "Prompt",
        });

        const resolver = createMockResourceResolver();
        const config = createAgentFromMarkdown(resource, resolver);

        expect(config.model).toBeUndefined();
      });
    });

    describe("temperature configuration", () => {
      it("uses temperature from frontmatter", () => {
        const resource = createMockResource({
          name: "temp-agent",
          type: "agent",
          frontmatter: {
            mode: "subagent",
            temperature: 0.7,
            description: "Temp test",
          },
          body: "Prompt",
        });

        const resolver = createMockResourceResolver();
        const config = createAgentFromMarkdown(resource, resolver);

        expect(config.temperature).toBe(0.7);
      });
    });

    describe("tools and permissions", () => {
      it("creates permission map from tools list", () => {
        const resource = createMockResource({
          name: "tools-agent",
          type: "agent",
          frontmatter: {
            mode: "subagent",
            tools: ["read", "write", "glob"],
            description: "Tools test",
          },
          body: "Prompt",
        });

        const resolver = createMockResourceResolver();
        const config = createAgentFromMarkdown(resource, resolver);

        expect(config.permission).toBeDefined();
        expect(config.permission?.read).toBe("allow");
        expect(config.permission?.write).toBe("allow");
        expect(config.permission?.glob).toBe("allow");
      });

      it("handles empty tools list", () => {
        const resource = createMockResource({
          name: "no-tools-agent",
          type: "agent",
          frontmatter: {
            mode: "subagent",
            tools: [],
            description: "No tools",
          },
          body: "Prompt",
        });

        const resolver = createMockResourceResolver();
        const config = createAgentFromMarkdown(resource, resolver, {
          enableMemoryTools: false,
        });

        // Should have no permission entry
        expect(config.permission).toBeUndefined();
      });
    });

    describe("memory tools integration", () => {
      it("adds memory tools by default", () => {
        const resource = createMockResource({
          name: "memory-agent",
          type: "agent",
          frontmatter: {
            mode: "subagent",
            tools: ["read"],
            description: "Memory test",
          },
          body: "Prompt",
        });

        const resolver = createMockResourceResolver();
        const config = createAgentFromMarkdown(resource, resolver);

        expect(config.permission?.memory_save).toBe("allow");
        expect(config.permission?.memory_search).toBe("allow");
      });

      it("respects enableMemoryTools option", () => {
        const resource = createMockResource({
          name: "no-memory-agent",
          type: "agent",
          frontmatter: {
            mode: "subagent",
            tools: ["read"],
            description: "No memory",
          },
          body: "Prompt",
        });

        const resolver = createMockResourceResolver();
        const config = createAgentFromMarkdown(resource, resolver, {
          enableMemoryTools: false,
        });

        expect(config.permission?.memory_save).toBeUndefined();
      });

      it("does not duplicate memory tools", () => {
        const resource = createMockResource({
          name: "has-memory-agent",
          type: "agent",
          frontmatter: {
            mode: "subagent",
            tools: ["read", "memory_save", "memory_search"],
            description: "Has memory",
          },
          body: "Prompt",
        });

        const resolver = createMockResourceResolver();
        const config = createAgentFromMarkdown(resource, resolver);

        // Should still work, just not duplicate
        expect(config.permission?.memory_save).toBe("allow");
        expect(config.permission?.memory_search).toBe("allow");
      });

      it("adds memory instructions to prompt", () => {
        const resource = createMockResource({
          name: "memory-prompt-agent",
          type: "agent",
          frontmatter: {
            mode: "subagent",
            description: "Memory prompt",
          },
          body: "Base prompt",
        });

        const resolver = createMockResourceResolver();
        const config = createAgentFromMarkdown(resource, resolver);

        expect(config.prompt).toContain("Memory System");
        expect(config.prompt).toContain("memory_decision");
      });
    });

    describe("skills injection", () => {
      it("injects skill content into prompt", () => {
        const skill = createMockResource({
          name: "test-skill/skill",
          type: "skill",
          frontmatter: {
            name: "test-skill",
            description: "A test skill",
          },
          body: "This is the skill content.",
        });

        const agent = createMockResource({
          name: "skill-agent",
          type: "agent",
          frontmatter: {
            mode: "subagent",
            skills: ["test-skill"],
            description: "Skill test",
          },
          body: "Base prompt",
        });

        const resolver = createMockResourceResolver([skill, agent]);
        const config = createAgentFromMarkdown(agent, resolver, {
          enableMemoryTools: false,
        });

        expect(config.prompt).toContain("Loaded Skills");
        expect(config.prompt).toContain("test-skill");
        expect(config.prompt).toContain("This is the skill content");
      });

      it("handles missing skills gracefully", () => {
        const agent = createMockResource({
          name: "missing-skill-agent",
          type: "agent",
          frontmatter: {
            mode: "subagent",
            skills: ["nonexistent-skill"],
            description: "Missing skill",
          },
          body: "Base prompt",
        });

        const resolver = createMockResourceResolver();
        // Should not throw
        const config = createAgentFromMarkdown(agent, resolver, {
          enableMemoryTools: false,
        });

        expect(config.prompt).toContain("Loaded Skills");
      });
    });

    describe("references injection", () => {
      it("injects reference content into prompt", () => {
        const reference = createMockResource({
          name: "test-reference",
          type: "reference",
          frontmatter: {
            name: "test-reference",
            description: "A test reference",
          },
          body: "Reference document content.",
        });

        const agent = createMockResource({
          name: "ref-agent",
          type: "agent",
          frontmatter: {
            mode: "subagent",
            references: ["test-reference"],
            description: "Ref test",
          },
          body: "Base prompt",
        });

        const resolver = createMockResourceResolver([reference, agent]);
        const config = createAgentFromMarkdown(agent, resolver, {
          enableMemoryTools: false,
        });

        expect(config.prompt).toContain("Reference Documents");
        expect(config.prompt).toContain("Reference document content");
      });
    });

    describe("thinking budget", () => {
      it("sets thinking budget from frontmatter", () => {
        const resource = createMockResource({
          name: "thinking-agent",
          type: "agent",
          frontmatter: {
            mode: "subagent",
            thinking_budget: 32000,
            description: "Thinking test",
          },
          body: "Prompt",
        });

        const resolver = createMockResourceResolver();
        const config = createAgentFromMarkdown(resource, resolver);

        expect(config.thinking).toBeDefined();
        expect(config.thinking?.type).toBe("enabled");
        expect(config.thinking?.budgetTokens).toBe(32000);
      });

      it("leaves thinking undefined when not specified", () => {
        const resource = createMockResource({
          name: "no-thinking-agent",
          type: "agent",
          frontmatter: {
            mode: "subagent",
            description: "No thinking",
          },
          body: "Prompt",
        });

        const resolver = createMockResourceResolver();
        const config = createAgentFromMarkdown(resource, resolver);

        expect(config.thinking).toBeUndefined();
      });
    });

    describe("color configuration", () => {
      it("uses color from frontmatter", () => {
        const resource = createMockResource({
          name: "colored-agent",
          type: "agent",
          frontmatter: {
            mode: "subagent",
            color: "#ff0000",
            description: "Colored",
          },
          body: "Prompt",
        });

        const resolver = createMockResourceResolver();
        const config = createAgentFromMarkdown(resource, resolver);

        expect(config.color).toBe("#ff0000");
      });
    });
  });

  describe("validateAgentResource", () => {
    it("returns empty array for valid agent", () => {
      const resource = createMockResource({
        name: "valid-agent",
        type: "agent",
        frontmatter: {
          name: "valid-agent",
          description: "A valid agent",
          mode: "subagent",
        },
        body: "This is the prompt body.",
      });

      const issues = validateAgentResource(resource);
      expect(issues).toEqual([]);
    });

    it("reports missing description", () => {
      const resource = createMockResource({
        name: "no-desc-agent",
        type: "agent",
        frontmatter: {
          name: "no-desc-agent",
          mode: "subagent",
        },
        body: "Prompt",
      });

      const issues = validateAgentResource(resource);
      expect(issues).toContain("Missing 'description' field");
    });

    it("reports invalid mode", () => {
      const resource = createMockResource({
        name: "bad-mode-agent",
        type: "agent",
        frontmatter: {
          name: "bad-mode-agent",
          description: "Bad mode",
          mode: "invalid",
        },
        body: "Prompt",
      });

      const issues = validateAgentResource(resource);
      expect(issues.some(i => i.includes("mode"))).toBe(true);
    });

    it("reports empty body", () => {
      const resource = createMockResource({
        name: "empty-body-agent",
        type: "agent",
        frontmatter: {
          name: "empty-body-agent",
          description: "Empty body",
          mode: "subagent",
        },
        body: "",
      });

      const issues = validateAgentResource(resource);
      expect(issues.some(i => i.includes("Empty"))).toBe(true);
    });

    it("reports whitespace-only body", () => {
      const resource = createMockResource({
        name: "whitespace-agent",
        type: "agent",
        frontmatter: {
          name: "whitespace-agent",
          description: "Whitespace only",
          mode: "subagent",
        },
        body: "   \n\t  ",
      });

      const issues = validateAgentResource(resource);
      expect(issues.some(i => i.includes("Empty"))).toBe(true);
    });

    it("reports multiple issues", () => {
      const resource = createMockResource({
        name: "many-issues-agent",
        type: "agent",
        frontmatter: {
          mode: "invalid",
        },
        body: "",
      });

      const issues = validateAgentResource(resource);
      expect(issues.length).toBeGreaterThan(1);
    });
  });
});
