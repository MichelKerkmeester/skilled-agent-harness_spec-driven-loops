/**
 * Tests for task routing
 * @module features/routing/router.test
 */

import { describe, it, expect } from "bun:test";
import { routeTask, getAgentForCategory, getCategoryForAgent, listCategories } from "./router.js";

describe("routeTask", () => {
  describe("code category routing", () => {
    it("routes implementation tasks to goop-executor", () => {
      const result = routeTask("Implement user authentication feature");
      expect(result.category).toBe("code");
      expect(result.agent).toBe("goop-executor");
      expect(result.confidence).toBeGreaterThan(0);
    });

    it("routes build tasks to goop-executor", () => {
      const result = routeTask("Build a new API endpoint for user profiles");
      expect(result.category).toBe("code");
      expect(result.agent).toBe("goop-executor");
    });

    it("routes component implementation to goop-executor", () => {
      const result = routeTask("Implement a new component for the dashboard");
      expect(result.category).toBe("code");
      expect(result.agent).toBe("goop-executor");
    });

    it("tracks matched keywords", () => {
      const result = routeTask("Implement and build the feature");
      expect(result.matchedKeywords).toContain("implement");
      expect(result.matchedKeywords).toContain("build");
    });
  });

  describe("plan category routing", () => {
    it("routes planning tasks to goop-planner", () => {
      const result = routeTask("Plan the architecture for the new module");
      expect(result.category).toBe("plan");
      expect(result.agent).toBe("goop-planner");
    });

    it("routes architecture tasks to goop-planner", () => {
      const result = routeTask("Architect the database schema");
      expect(result.category).toBe("plan");
      expect(result.agent).toBe("goop-planner");
    });

    it("routes blueprint tasks to goop-planner", () => {
      const result = routeTask("Create a blueprint for the API design");
      expect(result.category).toBe("plan");
      expect(result.agent).toBe("goop-planner");
    });
  });

  describe("research category routing", () => {
    it("routes research tasks to goop-researcher", () => {
      const result = routeTask("Research the best approach for caching");
      expect(result.category).toBe("research");
      expect(result.agent).toBe("goop-researcher");
    });

    it("routes investigation tasks to goop-researcher", () => {
      const result = routeTask("Investigate different authentication strategies");
      expect(result.category).toBe("research");
      expect(result.agent).toBe("goop-researcher");
    });

    it("routes comparison tasks to goop-researcher", () => {
      const result = routeTask("Compare React and Vue for this project");
      expect(result.category).toBe("research");
      expect(result.agent).toBe("goop-researcher");
    });
  });

  describe("explore category routing", () => {
    it("routes find tasks to goop-explorer", () => {
      const result = routeTask("Find all authentication-related files");
      expect(result.category).toBe("explore");
      expect(result.agent).toBe("goop-explorer");
    });

    it("routes locate tasks to goop-explorer", () => {
      const result = routeTask("Locate the user model definition");
      expect(result.category).toBe("explore");
      expect(result.agent).toBe("goop-explorer");
    });

    it("routes pattern search tasks to goop-explorer", () => {
      const result = routeTask("Search codebase for pattern usage");
      expect(result.category).toBe("explore");
      expect(result.agent).toBe("goop-explorer");
    });
  });

  describe("search category routing", () => {
    it("routes documentation tasks to goop-librarian", () => {
      const result = routeTask("Look up documentation for React hooks");
      expect(result.category).toBe("search");
      expect(result.agent).toBe("goop-librarian");
    });

    it("routes API docs tasks to goop-librarian", () => {
      const result = routeTask("Find API docs for the library");
      expect(result.category).toBe("search");
      expect(result.agent).toBe("goop-librarian");
    });

    it("routes reference tasks to goop-librarian", () => {
      const result = routeTask("Get reference for TypeScript generics");
      expect(result.category).toBe("search");
      expect(result.agent).toBe("goop-librarian");
    });
  });

  describe("verify category routing", () => {
    it("routes verification tasks to goop-verifier", () => {
      const result = routeTask("Verify the implementation meets the spec");
      expect(result.category).toBe("verify");
      expect(result.agent).toBe("goop-verifier");
    });

    it("routes audit tasks to goop-verifier", () => {
      const result = routeTask("Audit the code for compliance");
      expect(result.category).toBe("verify");
      expect(result.agent).toBe("goop-verifier");
    });

    it("routes validation tasks to goop-verifier", () => {
      const result = routeTask("Validate the API responses");
      expect(result.category).toBe("verify");
      expect(result.agent).toBe("goop-verifier");
    });
  });

  describe("debug category routing", () => {
    it("routes debug tasks to goop-debugger", () => {
      const result = routeTask("Debug the login authentication issue");
      expect(result.category).toBe("debug");
      expect(result.agent).toBe("goop-debugger");
    });

    it("routes bug fix tasks to goop-debugger", () => {
      const result = routeTask("Fix bug in the payment processing");
      expect(result.category).toBe("debug");
      expect(result.agent).toBe("goop-debugger");
    });

    it("routes troubleshooting tasks to goop-debugger", () => {
      const result = routeTask("Troubleshoot the database connection error");
      expect(result.category).toBe("debug");
      expect(result.agent).toBe("goop-debugger");
    });

    it("routes root cause analysis to goop-debugger", () => {
      const result = routeTask("Find the root cause of the memory leak");
      expect(result.category).toBe("debug");
      expect(result.agent).toBe("goop-debugger");
    });
  });

  describe("visual category routing", () => {
    it("routes UI tasks to goop-designer", () => {
      const result = routeTask("Design the UI for the dashboard");
      expect(result.category).toBe("visual");
      expect(result.agent).toBe("goop-designer");
    });

    it("routes UX tasks to goop-designer", () => {
      const result = routeTask("Improve the UX of the checkout flow");
      expect(result.category).toBe("visual");
      expect(result.agent).toBe("goop-designer");
    });

    it("routes layout tasks to goop-designer", () => {
      const result = routeTask("Create a layout for the landing page");
      expect(result.category).toBe("visual");
      expect(result.agent).toBe("goop-designer");
    });
  });

  describe("test category routing", () => {
    it("routes test writing to goop-tester", () => {
      const result = routeTask("Write tests for the authentication module");
      expect(result.category).toBe("test");
      expect(result.agent).toBe("goop-tester");
    });

    it("routes coverage tasks to goop-tester", () => {
      const result = routeTask("Improve test coverage for the API");
      expect(result.category).toBe("test");
      expect(result.agent).toBe("goop-tester");
    });

    it("routes e2e tasks to goop-tester", () => {
      const result = routeTask("Create e2e tests for the user flow");
      expect(result.category).toBe("test");
      expect(result.agent).toBe("goop-tester");
    });
  });

  describe("docs category routing", () => {
    it("routes documentation writing to goop-writer", () => {
      const result = routeTask("Document the API endpoints");
      expect(result.category).toBe("docs");
      expect(result.agent).toBe("goop-writer");
    });

    it("routes README tasks to goop-writer", () => {
      const result = routeTask("Update the readme with installation instructions");
      expect(result.category).toBe("docs");
      expect(result.agent).toBe("goop-writer");
    });

    it("routes guide writing to goop-writer", () => {
      const result = routeTask("Write a guide for contributing to the project");
      expect(result.category).toBe("docs");
      expect(result.agent).toBe("goop-writer");
    });
  });

  describe("memory category routing", () => {
    it("routes remember tasks to memory-distiller", () => {
      const result = routeTask("Remember this architectural decision");
      expect(result.category).toBe("memory");
      expect(result.agent).toBe("memory-distiller");
    });

    it("routes recall tasks to memory-distiller", () => {
      const result = routeTask("Recall the previous discussion about caching");
      expect(result.category).toBe("memory");
      expect(result.agent).toBe("memory-distiller");
    });

    it("routes distill tasks to memory-distiller", () => {
      const result = routeTask("Distill the key points from the meeting");
      expect(result.category).toBe("memory");
      expect(result.agent).toBe("memory-distiller");
    });
  });

  describe("default fallback routing", () => {
    it("routes ambiguous tasks to general category", () => {
      const result = routeTask("Do something with the system");
      expect(result.category).toBe("general");
      expect(result.agent).toBe("goop-executor");
    });

    it("routes tasks with no keyword matches to default", () => {
      const result = routeTask("Handle this request");
      expect(result.category).toBe("general");
      expect(result.agent).toBe("goop-executor");
    });

    it("respects custom default category", () => {
      const result = routeTask("Do something", { defaultCategory: "plan" });
      expect(result.category).toBe("plan");
      expect(result.agent).toBe("goop-planner");
    });
  });

  describe("confidence calculation", () => {
    it("has higher confidence with more keyword matches", () => {
      const result1 = routeTask("Implement");
      const result2 = routeTask("Implement and build and create");
      expect(result2.confidence).toBeGreaterThan(result1.confidence);
    });

    it("has low confidence for ambiguous tasks", () => {
      const result = routeTask("Update the system");
      expect(result.confidence).toBeLessThan(0.5);
    });

    it("respects custom confidence threshold", () => {
      const result = routeTask("Maybe implement", { confidenceThreshold: 0.8 });
      // Should fall back to default if confidence is below threshold
      expect(result).toBeDefined();
    });
  });

  describe("case insensitivity", () => {
    it("matches keywords regardless of case", () => {
      const result1 = routeTask("IMPLEMENT the feature");
      const result2 = routeTask("implement the feature");
      expect(result1.category).toBe(result2.category);
    });
  });
});

describe("getAgentForCategory", () => {
  it("returns correct agent for code category", () => {
    expect(getAgentForCategory("code")).toBe("goop-executor");
  });

  it("returns correct agent for plan category", () => {
    expect(getAgentForCategory("plan")).toBe("goop-planner");
  });

  it("returns correct agent for debug category", () => {
    expect(getAgentForCategory("debug")).toBe("goop-debugger");
  });

  it("returns correct agent for memory category", () => {
    expect(getAgentForCategory("memory")).toBe("memory-distiller");
  });
});

describe("getCategoryForAgent", () => {
  it("returns correct category for goop-executor", () => {
    expect(getCategoryForAgent("goop-executor")).toBe("code");
  });

  it("returns correct category for goop-planner", () => {
    expect(getCategoryForAgent("goop-planner")).toBe("plan");
  });

  it("returns correct category for goop-debugger", () => {
    expect(getCategoryForAgent("goop-debugger")).toBe("debug");
  });

  it("returns correct category for memory-distiller", () => {
    expect(getCategoryForAgent("memory-distiller")).toBe("memory");
  });

  it("returns null for unknown agent", () => {
    expect(getCategoryForAgent("unknown-agent")).toBe(null);
  });
});

describe("listCategories", () => {
  it("returns all categories with their agents", () => {
    const categories = listCategories();
    expect(categories.length).toBeGreaterThan(0);
    expect(categories[0]).toHaveProperty("category");
    expect(categories[0]).toHaveProperty("agent");
    expect(categories[0]).toHaveProperty("keywords");
  });

  it("includes all expected categories", () => {
    const categories = listCategories();
    const categoryNames = categories.map(c => c.category);
    expect(categoryNames).toContain("code");
    expect(categoryNames).toContain("plan");
    expect(categoryNames).toContain("research");
    expect(categoryNames).toContain("debug");
    expect(categoryNames).toContain("test");
    expect(categoryNames).toContain("docs");
  });

  it("includes keywords for each category", () => {
    const categories = listCategories();
    for (const category of categories) {
      expect(Array.isArray(category.keywords)).toBe(true);
    }
  });
});
