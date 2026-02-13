/**
 * Tests for GoopSpec Orchestrator Agent
 */

import { describe, it, expect, beforeEach } from "bun:test";
import { createGoopSpecOrchestrator, getAgentNames, getSkillNames } from "./goopspec-orchestrator.js";
import type { ResourceResolver, ResolvedResource } from "../core/types.js";

// Mock resolver
function createMockResolver(agents: ResolvedResource[] = [], skills: ResolvedResource[] = []): ResourceResolver {
  return {
    resolve: () => null,
    resolveAll: (type) => {
      if (type === "agent") return agents;
      if (type === "skill") return skills;
      return [];
    },
    getDirectory: () => null,
  };
}

// Mock agent resource
function createMockAgent(name: string, description: string): ResolvedResource {
  return {
    name,
    path: `/mock/agents/${name}.md`,
    type: "agent",
    frontmatter: { name, description },
    body: "Mock agent body",
    content: `---\nname: ${name}\ndescription: ${description}\n---\nMock agent body`,
  };
}

// Mock skill resource
function createMockSkill(name: string, description: string): ResolvedResource {
  return {
    name,
    path: `/mock/skills/${name}/skill.md`,
    type: "skill",
    frontmatter: { name, description },
    body: "Mock skill body",
    content: `---\nname: ${name}\ndescription: ${description}\n---\nMock skill body`,
  };
}

describe("createGoopSpecOrchestrator", () => {
  it("creates orchestrator with default options", () => {
    const resolver = createMockResolver();
    const orchestrator = createGoopSpecOrchestrator({ resolver });

    expect(orchestrator.mode).toBe("primary");
    expect(orchestrator.model).toBe("anthropic/claude-opus-4-5");
    expect(orchestrator.thinking.type).toBe("enabled");
    expect(orchestrator.thinking.budgetTokens).toBe(32000);
    expect(orchestrator.color).toBe("#65f463");
  });

  it("uses custom model when provided", () => {
    const resolver = createMockResolver();
    const orchestrator = createGoopSpecOrchestrator({
      resolver,
      model: "anthropic/claude-sonnet-4-5",
    });

    expect(orchestrator.model).toBe("anthropic/claude-sonnet-4-5");
  });

  it("uses custom thinking budget when provided", () => {
    const resolver = createMockResolver();
    const orchestrator = createGoopSpecOrchestrator({
      resolver,
      thinkingBudget: 16000,
    });

    expect(orchestrator.thinking.budgetTokens).toBe(16000);
  });

  it("includes all required permissions", () => {
    const resolver = createMockResolver();
    const orchestrator = createGoopSpecOrchestrator({ resolver });

    expect(orchestrator.permission.goop_delegate).toBe("allow");
    expect(orchestrator.permission.goop_skill).toBe("allow");
    expect(orchestrator.permission.goop_status).toBe("allow");
    expect(orchestrator.permission.goop_adl).toBe("allow");
    expect(orchestrator.permission.goop_spec).toBe("allow");
    expect(orchestrator.permission.goop_checkpoint).toBe("allow");
    expect(orchestrator.permission.question).toBe("allow");
    expect(orchestrator.permission.todowrite).toBe("allow");
    expect(orchestrator.permission.todoread).toBe("allow");
  });

  it("generates prompt with all workflow phases", () => {
    const resolver = createMockResolver();
    const orchestrator = createGoopSpecOrchestrator({ resolver });

    expect(orchestrator.prompt).toContain("<Role>");
    expect(orchestrator.prompt).toContain("Phase 0: Intent Gate");
    expect(orchestrator.prompt).toContain("Phase 1: Discuss");
    expect(orchestrator.prompt).toContain("Phase 2: Plan");
    expect(orchestrator.prompt).toContain("Phase 3: Execute");
    expect(orchestrator.prompt).toContain("Phase 4: Audit");
    expect(orchestrator.prompt).toContain("Phase 5: Confirm");
  });

  it("includes delegation rules in prompt", () => {
    const resolver = createMockResolver();
    const orchestrator = createGoopSpecOrchestrator({ resolver });

    expect(orchestrator.prompt).toContain("<Delegation_Rules>");
    expect(orchestrator.prompt).toContain("task(");
  });

  it("includes constraints in prompt", () => {
    const resolver = createMockResolver();
    const orchestrator = createGoopSpecOrchestrator({ resolver });

    expect(orchestrator.prompt).toContain("<Constraints>");
    expect(orchestrator.prompt).toContain("Deviation Rules");
  });

  it("includes available agents in delegation section", () => {
    const agents = [
      createMockAgent("goop-planner", "Creates execution plans"),
      createMockAgent("goop-executor", "Implements tasks"),
    ];
    const resolver = createMockResolver(agents);
    const orchestrator = createGoopSpecOrchestrator({ resolver });

    expect(orchestrator.prompt).toContain("goop-planner");
    expect(orchestrator.prompt).toContain("goop-executor");
    expect(orchestrator.prompt).toContain("Creates execution plans");
  });

  it("includes available skills in prompt", () => {
    const skills = [
      createMockSkill("typescript", "TypeScript best practices"),
      createMockSkill("react", "React patterns"),
    ];
    const resolver = createMockResolver([], skills);
    const orchestrator = createGoopSpecOrchestrator({ resolver });

    expect(orchestrator.prompt).toContain("typescript");
    expect(orchestrator.prompt).toContain("react");
  });

  it("respects phaseGates setting in prompt", () => {
    const resolver = createMockResolver();
    
    const strictOrch = createGoopSpecOrchestrator({ 
      resolver, 
      phaseGates: "strict" 
    });
    expect(strictOrch.prompt).toContain("Strict Mode");

    const autoOrch = createGoopSpecOrchestrator({ 
      resolver, 
      phaseGates: "automatic" 
    });
    expect(autoOrch.prompt).toContain("Automatic Mode");
  });

  it("respects waveExecution setting in prompt", () => {
    const resolver = createMockResolver();
    
    const seqOrch = createGoopSpecOrchestrator({ 
      resolver, 
      waveExecution: "sequential" 
    });
    expect(seqOrch.prompt).toContain("Sequential Wave");

    const parOrch = createGoopSpecOrchestrator({ 
      resolver, 
      waveExecution: "parallel" 
    });
    expect(parOrch.prompt).toContain("Parallel");
  });
});

describe("getAgentNames", () => {
  it("extracts names from agent resources", () => {
    const agents = [
      createMockAgent("agent-1", "First agent"),
      createMockAgent("agent-2", "Second agent"),
    ];

    const names = getAgentNames(agents);
    expect(names).toEqual(["agent-1", "agent-2"]);
  });

  it("handles empty array", () => {
    const names = getAgentNames([]);
    expect(names).toEqual([]);
  });
});

describe("getSkillNames", () => {
  it("extracts names from skill resources", () => {
    const skills = [
      createMockSkill("skill-1", "First skill"),
      createMockSkill("skill-2", "Second skill"),
    ];

    const names = getSkillNames(skills);
    expect(names).toEqual(["skill-1", "skill-2"]);
  });

  it("handles empty array", () => {
    const names = getSkillNames([]);
    expect(names).toEqual([]);
  });
});
