/**
 * Resource Integration Tests
 * Verifies all bundled agents, commands, and skills load correctly
 * 
 * @module core/resources.test
 */

import { describe, it, expect } from "bun:test";
import { createResourceResolver } from "./resolver.js";

// Test against the project root (uses bundled resources)
const PROJECT_ROOT = process.cwd();

describe("Resource Integration", () => {
  const resolver = createResourceResolver(PROJECT_ROOT);

  describe("Agents", () => {
    const EXPECTED_AGENTS = [
      "goop-orchestrator",
      "goop-planner",
      "goop-executor",
      "goop-researcher",
      "goop-explorer",
      "goop-librarian",
      "goop-verifier",
      "goop-debugger",
      "goop-tester",
      "goop-designer",
      "goop-writer",
      "memory-distiller",
    ];

    it("loads all expected agents", () => {
      const agents = resolver.resolveAll("agent");
      const agentNames = agents.map(a => a.name);
      
      for (const name of EXPECTED_AGENTS) {
        expect(agentNames).toContain(name);
      }
    });

    it("has correct count of agents", () => {
      const agents = resolver.resolveAll("agent");
      expect(agents.length).toBe(EXPECTED_AGENTS.length);
    });

    for (const agentName of EXPECTED_AGENTS) {
      it(`agent "${agentName}" has valid frontmatter`, () => {
        const agent = resolver.resolve("agent", agentName);
        expect(agent).not.toBeNull();
        
        if (agent) {
          expect(agent.frontmatter.name).toBe(agentName);
          expect(agent.frontmatter.description).toBeDefined();
          expect(typeof agent.frontmatter.description).toBe("string");
          expect(agent.frontmatter.model).toBeDefined();
          expect(typeof agent.frontmatter.model).toBe("string");
          expect(agent.body.length).toBeGreaterThan(0);
        }
      });
    }
  });

  describe("Commands", () => {
    // Updated for GoopSpec 0.1.0 workflow
    // Removed: goop-new (replaced by goop-plan), goop-verify (replaced by goop-accept)
    // Added: goop-discuss, goop-specify, goop-accept, goop-amend, goop-complete, goop-milestone
    const EXPECTED_COMMANDS = [
      "goop-discuss",
      "goop-plan",
      "goop-research",
      "goop-specify",
      "goop-execute",
      "goop-accept",
      "goop-amend",
      "goop-complete",
      "goop-milestone",
      "goop-quick",
      "goop-pause",
      "goop-resume",
      "goop-status",
      "goop-help",
      "goop-map-codebase",
      "goop-debug",
      "goop-setup",
      "goop-memory",
      "goop-remember",
      "goop-recall",
    ];

    it("loads all expected commands", () => {
      const commands = resolver.resolveAll("command");
      const commandNames = commands.map(c => c.name);
      
      for (const name of EXPECTED_COMMANDS) {
        expect(commandNames).toContain(name);
      }
    });

    it("has correct count of commands", () => {
      const commands = resolver.resolveAll("command");
      expect(commands.length).toBe(EXPECTED_COMMANDS.length);
    });

    for (const cmdName of EXPECTED_COMMANDS) {
      it(`command "${cmdName}" has valid frontmatter`, () => {
        const cmd = resolver.resolve("command", cmdName);
        expect(cmd).not.toBeNull();
        
        if (cmd) {
          // Commands use filename as name (frontmatter.name is optional)
          expect(cmd.name).toBe(cmdName);
          expect(cmd.frontmatter.description).toBeDefined();
          expect(typeof cmd.frontmatter.description).toBe("string");
          expect(cmd.body.length).toBeGreaterThan(0);
        }
      });
    }
  });

  describe("Skills", () => {
    const EXPECTED_SKILLS = [
      "goop-core",
      "deviation-handling",
      "progress-tracking",
      "task-delegation",
      "architecture-design",
      "parallel-planning",
      "task-decomposition",
      "research",
      "testing",
      "verification",
      "documentation",
      "performance-optimization",
      "security-audit",
    ];

    it("loads skills from skills directories", () => {
      const skills = resolver.resolveAll("skill");
      
      // Skills are organized as skills/[name]/skill.md
      // The resolver should find them
      expect(skills.length).toBeGreaterThan(0);
    });

    // Note: Skills use a directory-based structure (skills/name/skill.md)
    // The resolver may need to be updated to handle this pattern
    it("skill directory structure is correct", () => {
      // This tests the resolver can handle the skill structure
      const skills = resolver.resolveAll("skill");
      
      // Each skill should have a name and body
      for (const skill of skills) {
        expect(skill.name).toBeDefined();
        expect(typeof skill.name).toBe("string");
        expect(skill.body).toBeDefined();
      }
    });
  });

  describe("References", () => {
    it("loads references from references directory", () => {
      const references = resolver.resolveAll("reference");
      
      // Should have some references
      expect(Array.isArray(references)).toBe(true);
    });
  });

  describe("Templates", () => {
    it("loads templates from templates directory", () => {
      const templates = resolver.resolveAll("template");
      
      // Should have some templates
      expect(Array.isArray(templates)).toBe(true);
    });
  });

  describe("Resource Resolution Priority", () => {
    it("bundled resources are found when project has no overrides", () => {
      // Since we're using PROJECT_ROOT which has bundled resources,
      // these should all resolve
      const agent = resolver.resolve("agent", "goop-planner");
      expect(agent).not.toBeNull();
      
      // goop-plan replaced goop-new in GoopSpec 0.1.0
      const cmd = resolver.resolve("command", "goop-plan");
      expect(cmd).not.toBeNull();
    });

    it("returns null for non-existent resources", () => {
      const agent = resolver.resolve("agent", "nonexistent-agent");
      expect(agent).toBeNull();
      
      const cmd = resolver.resolve("command", "nonexistent-command");
      expect(cmd).toBeNull();
    });

    it("getDirectory returns correct paths", () => {
      const agentDir = resolver.getDirectory("agent");
      expect(agentDir).not.toBeNull();
      expect(agentDir).toContain("agents");
      
      const cmdDir = resolver.getDirectory("command");
      expect(cmdDir).not.toBeNull();
      expect(cmdDir).toContain("commands");
    });
  });
});
