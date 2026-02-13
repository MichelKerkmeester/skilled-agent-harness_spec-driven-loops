/**
 * Tests for Workflow Memory Phase Hooks
 */

import { describe, it, expect, mock } from "bun:test";
import {
  createPhaseMemoryEntry,
  getPhaseSearchQuery,
  createPhaseMemoryHook,
  type PhaseMemoryConfig,
} from "./phase-hooks";
import type { WorkflowPhase, MemoryManager } from "../../core/types";

describe("workflow-memory/phase-hooks", () => {
  describe("createPhaseMemoryEntry", () => {
    it("should return null for idle phase", () => {
      const entry = createPhaseMemoryEntry("idle", "plan", {});
      expect(entry).toBeNull();
    });

    it("should create entry for plan phase", () => {
      const entry = createPhaseMemoryEntry("plan", "research", {
        projectName: "Test Project",
        intent: "Build a feature",
        requirements: "Must have X, Y, Z",
      });
      
      expect(entry).not.toBeNull();
      expect(entry?.type).toBe("note");
      expect(entry?.title).toContain("Test Project");
      expect(entry?.content).toContain("Build a feature");
      expect(entry?.concepts).toContain("planning");
    });

    it("should create entry for research phase", () => {
      const entry = createPhaseMemoryEntry("research", "specify", {
        topic: "Authentication",
        findings: "JWT is recommended",
        recommendations: "Use jose library",
        concepts: ["auth", "jwt"],
      });
      
      expect(entry).not.toBeNull();
      expect(entry?.type).toBe("observation");
      expect(entry?.title).toContain("Authentication");
      expect(entry?.content).toContain("JWT is recommended");
      expect(entry?.concepts).toContain("research");
      expect(entry?.concepts).toContain("auth");
    });

    it("should create entry for specify phase", () => {
      const entry = createPhaseMemoryEntry("specify", "execute", {
        specName: "User Auth",
        mustHaves: "Login, Logout",
        outOfScope: "Social login",
      });
      
      expect(entry).not.toBeNull();
      expect(entry?.type).toBe("decision");
      expect(entry?.title).toContain("User Auth");
      expect(entry?.content).toContain("Login, Logout");
      expect(entry?.concepts).toContain("specification");
    });

    it("should create entry for execute phase", () => {
      const entry = createPhaseMemoryEntry("execute", "execute", {
        wave: 2,
        totalWaves: 5,
        tasks: "Task 1, Task 2",
      });
      
      expect(entry).not.toBeNull();
      expect(entry?.type).toBe("note");
      expect(entry?.title).toContain("Wave 2");
      expect(entry?.content).toContain("2 of 5");
      expect(entry?.concepts).toContain("execution");
    });

    it("should create entry for accept phase", () => {
      const entry = createPhaseMemoryEntry("accept", "idle", {
        projectName: "Feature X",
        delivered: "All requirements met",
        learnings: "Use TypeScript for better DX",
      });
      
      expect(entry).not.toBeNull();
      expect(entry?.type).toBe("observation");
      expect(entry?.title).toContain("Feature X");
      expect(entry?.content).toContain("All requirements met");
      expect(entry?.concepts).toContain("completion");
    });

    it("should handle missing data gracefully", () => {
      const entry = createPhaseMemoryEntry("plan", "research", {});
      
      expect(entry).not.toBeNull();
      expect(entry?.content).toContain("Not specified");
    });
  });

  describe("getPhaseSearchQuery", () => {
    it("should generate query for plan phase", () => {
      const result = getPhaseSearchQuery("plan", "user authentication");
      
      expect(result.query).toContain("user authentication");
      expect(result.concepts).toContain("planning");
      expect(result.concepts).toContain("requirements");
    });

    it("should generate query for research phase", () => {
      const result = getPhaseSearchQuery("research", "database design");
      
      expect(result.query).toContain("database design");
      expect(result.concepts).toContain("research");
      expect(result.concepts).toContain("analysis");
    });

    it("should generate query for specify phase", () => {
      const result = getPhaseSearchQuery("specify", "API endpoints");
      
      expect(result.query).toContain("API endpoints");
      expect(result.concepts).toContain("specification");
    });

    it("should generate query for execute phase", () => {
      const result = getPhaseSearchQuery("execute", "payment processing");
      
      expect(result.query).toContain("payment processing");
      expect(result.concepts).toContain("implementation");
    });

    it("should generate query for accept phase", () => {
      const result = getPhaseSearchQuery("accept", "user dashboard");
      
      expect(result.query).toContain("user dashboard");
      expect(result.concepts).toContain("delivery");
    });

    it("should handle idle phase", () => {
      const result = getPhaseSearchQuery("idle", "general context");
      
      expect(result.query).toBe("general context");
      expect(result.concepts).toEqual([]);
    });
  });

  describe("createPhaseMemoryHook", () => {
    it("should create hook with default config", () => {
      const hook = createPhaseMemoryHook(undefined);
      
      expect(hook.onPhaseEnter).toBeDefined();
      expect(hook.onPhaseExit).toBeDefined();
    });

    it("should return empty array when memory disabled", async () => {
      const hook = createPhaseMemoryHook(undefined, { enabled: false });
      const results = await hook.onPhaseEnter("plan", "test");
      
      expect(results).toEqual([]);
    });

    it("should return empty array when no memory manager", async () => {
      const hook = createPhaseMemoryHook(undefined);
      const results = await hook.onPhaseEnter("plan", "test");
      
      expect(results).toEqual([]);
    });

    it("should search memory on phase enter", async () => {
      const mockMemoryManager: MemoryManager = {
        search: mock(async () => [
          {
            memory: {
              id: 1,
              type: "note",
              title: "Past work",
              content: "Previous implementation details",
              concepts: ["auth"],
              facts: [],
              importance: 0.7,
              createdAt: new Date().toISOString(),
            },
            score: 0.9,
          },
        ]),
        save: mock(async () => ({
          id: 1,
          type: "note",
          title: "Test",
          content: "Test",
          concepts: [],
          facts: [],
          importance: 0.5,
          createdAt: new Date().toISOString(),
        })),
        delete: mock(async () => true),
        getById: mock(async () => null),
        getRecent: mock(async () => []),
        update: mock(async () => null),
      };

      const hook = createPhaseMemoryHook(mockMemoryManager);
      const results = await hook.onPhaseEnter("plan", "authentication");
      
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toContain("Previous implementation");
      expect(mockMemoryManager.search).toHaveBeenCalled();
    });

    it("should handle search errors gracefully", async () => {
      const mockMemoryManager: MemoryManager = {
        search: mock(async () => {
          throw new Error("Search failed");
        }),
        save: mock(async () => 1),
        delete: mock(async () => true),
        getRecent: mock(async () => []),
        update: mock(async () => null),
        getById: mock(async () => null),
      };

      const hook = createPhaseMemoryHook(mockMemoryManager);
      const results = await hook.onPhaseEnter("plan", "test");
      
      expect(results).toEqual([]);
    });

    it("should not save when autoSave disabled", async () => {
      const mockMemoryManager: MemoryManager = {
        search: mock(async () => []),
        save: mock(async () => 1),
        delete: mock(async () => true),
        getRecent: mock(async () => []),
        update: mock(async () => null),
        getById: mock(async () => null),
      };

      const hook = createPhaseMemoryHook(mockMemoryManager, {
        autoSaveOnTransition: false,
      });
      
      await hook.onPhaseExit("plan", "research", {
        projectName: "Test",
        intent: "Build feature",
      });
      
      expect(mockMemoryManager.save).not.toHaveBeenCalled();
    });

    it("should save memory on phase exit", async () => {
      const mockMemoryManager: MemoryManager = {
        search: mock(async () => []),
        save: mock(async () => 1),
        delete: mock(async () => true),
        getRecent: mock(async () => []),
        update: mock(async () => null),
        getById: mock(async () => null),
      };

      const hook = createPhaseMemoryHook(mockMemoryManager);
      
      await hook.onPhaseExit("plan", "research", {
        projectName: "Test Project",
        intent: "Build auth",
        requirements: "JWT, OAuth",
      });
      
      expect(mockMemoryManager.save).toHaveBeenCalled();
    });

    it("should not save when no entry created", async () => {
      const mockMemoryManager: MemoryManager = {
        search: mock(async () => []),
        save: mock(async () => 1),
        delete: mock(async () => true),
        getRecent: mock(async () => []),
        update: mock(async () => null),
        getById: mock(async () => null),
      };

      const hook = createPhaseMemoryHook(mockMemoryManager);
      
      await hook.onPhaseExit("idle", "plan", {});
      
      expect(mockMemoryManager.save).not.toHaveBeenCalled();
    });

    it("should handle save errors gracefully", async () => {
      const mockMemoryManager: MemoryManager = {
        search: mock(async () => []),
        save: mock(async () => {
          throw new Error("Save failed");
        }),
        delete: mock(async () => true),
        getRecent: mock(async () => []),
        update: mock(async () => null),
        getById: mock(async () => null),
      };

      const hook = createPhaseMemoryHook(mockMemoryManager);
      
      // Should not throw
      await hook.onPhaseExit("plan", "research", {
        projectName: "Test",
        intent: "Build",
      });
      
      expect(mockMemoryManager.save).toHaveBeenCalled();
    });

    it("should respect custom importance levels", async () => {
      const mockMemoryManager: MemoryManager = {
        search: mock(async () => []),
        save: mock(async (entry) => {
          expect(entry.importance).toBe(0.95);
          return 1;
        }),
        delete: mock(async () => true),
        getRecent: mock(async () => []),
        update: mock(async () => null),
        getById: mock(async () => null),
      };

      const hook = createPhaseMemoryHook(mockMemoryManager, {
        importance: {
          plan: 0.95,
          research: 0.7,
          specify: 0.8,
          execute: 0.5,
          accept: 0.7,
        },
      });
      
      await hook.onPhaseExit("plan", "research", {
        projectName: "Test",
        intent: "Build",
      });
      
      expect(mockMemoryManager.save).toHaveBeenCalled();
    });
  });
});
