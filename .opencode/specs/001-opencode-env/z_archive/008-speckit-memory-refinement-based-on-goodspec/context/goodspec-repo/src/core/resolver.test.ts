/**
 * Tests for resource resolver
 */

import { describe, it, expect, beforeAll } from "bun:test";
import { createResourceResolver } from "./resolver";
import { getPackageRoot } from "../shared/paths";

describe("resolver", () => {
  const projectDir = getPackageRoot();
  let resolver: ReturnType<typeof createResourceResolver>;

  beforeAll(() => {
    resolver = createResourceResolver(projectDir);
  });

  describe("resolve", () => {
    it("should resolve an existing agent", () => {
      const agent = resolver.resolve("agent", "goop-orchestrator");
      expect(agent).not.toBeNull();
      expect(agent?.name).toBe("goop-orchestrator");
      expect(agent?.type).toBe("agent");
      expect(agent?.frontmatter.description).toBeTruthy();
    });

    it("should resolve agent with or without .md extension", () => {
      const agent1 = resolver.resolve("agent", "goop-orchestrator");
      const agent2 = resolver.resolve("agent", "goop-orchestrator.md");
      expect(agent1).not.toBeNull();
      expect(agent2).not.toBeNull();
      expect(agent1?.path).toBe(agent2?.path);
    });

    it("should return null for non-existent agent", () => {
      const agent = resolver.resolve("agent", "non-existent-agent");
      expect(agent).toBeNull();
    });

    it("should resolve an existing command", () => {
      const command = resolver.resolve("command", "goop-plan");
      expect(command).not.toBeNull();
      expect(command?.type).toBe("command");
    });

    it("should resolve an existing skill", () => {
      const skill = resolver.resolve("skill", "goop-core/skill");
      expect(skill).not.toBeNull();
      expect(skill?.type).toBe("skill");
    });

    it("should resolve a reference", () => {
      const ref = resolver.resolve("reference", "deviation-rules");
      expect(ref).not.toBeNull();
      expect(ref?.type).toBe("reference");
    });

    it("should resolve a reference with prefix path", () => {
      const ref = resolver.resolve("reference", "references/deviation-rules.md");
      expect(ref).not.toBeNull();
      expect(ref?.type).toBe("reference");
    });

    it("should resolve a template with prefix path", () => {
      const template = resolver.resolve("template", "templates/spec.md");
      expect(template).not.toBeNull();
      expect(template?.type).toBe("template");
    });
  });

  describe("resolveAll", () => {
    it("should resolve all agents", () => {
      const agents = resolver.resolveAll("agent");
      expect(agents.length).toBeGreaterThan(0);
      
      // Check that expected agents exist
      const names = agents.map(a => a.name);
      expect(names).toContain("goop-orchestrator");
    });

    it("should resolve all commands", () => {
      const commands = resolver.resolveAll("command");
      expect(commands.length).toBeGreaterThan(0);
      
      const names = commands.map(c => c.name);
      expect(names).toContain("goop-plan");
    });

    it("should resolve all references", () => {
      const refs = resolver.resolveAll("reference");
      expect(refs.length).toBeGreaterThan(0);
      
      const names = refs.map(r => r.name);
      expect(names).toContain("deviation-rules");
    });
  });

  describe("getDirectory", () => {
    it("should return directory for agents", () => {
      const dir = resolver.getDirectory("agent");
      expect(dir).not.toBeNull();
      expect(dir).toContain("agents");
    });

    it("should return directory for commands", () => {
      const dir = resolver.getDirectory("command");
      expect(dir).not.toBeNull();
      expect(dir).toContain("commands");
    });
  });

  describe("resource content", () => {
    it("should include body content", () => {
      const agent = resolver.resolve("agent", "goop-orchestrator");
      expect(agent).not.toBeNull();
      expect(agent?.body).toBeTruthy();
      expect(agent?.body.length).toBeGreaterThan(0);
    });

    it("should parse frontmatter correctly", () => {
      const agent = resolver.resolve("agent", "goop-orchestrator");
      expect(agent).not.toBeNull();
      expect(agent?.frontmatter.name).toBe("goop-orchestrator");
      expect(agent?.frontmatter.model).toBeTruthy();
    });

    it("should include tools array in frontmatter", () => {
      const agent = resolver.resolve("agent", "goop-orchestrator");
      expect(agent).not.toBeNull();
      expect(Array.isArray(agent?.frontmatter.tools)).toBe(true);
    });
  });
});
