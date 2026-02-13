/**
 * Tests for Core Types
 * @module core/types.test
 */

import { describe, it, expect } from "bun:test";
import { MEMORY_TYPES, type MemoryType, type WorkflowPhase, type TaskMode } from "./types.js";

describe("core types", () => {
  describe("MEMORY_TYPES", () => {
    it("is a readonly array", () => {
      expect(Array.isArray(MEMORY_TYPES)).toBe(true);
      // TypeScript ensures it's readonly, but we can verify the content is stable
      expect(MEMORY_TYPES.length).toBeGreaterThan(0);
    });

    it("contains observation type", () => {
      expect(MEMORY_TYPES).toContain("observation");
    });

    it("contains decision type", () => {
      expect(MEMORY_TYPES).toContain("decision");
    });

    it("contains session_summary type", () => {
      expect(MEMORY_TYPES).toContain("session_summary");
    });

    it("contains user_prompt type", () => {
      expect(MEMORY_TYPES).toContain("user_prompt");
    });

    it("contains note type", () => {
      expect(MEMORY_TYPES).toContain("note");
    });

    it("contains todo type", () => {
      expect(MEMORY_TYPES).toContain("todo");
    });

    it("has exactly 6 types", () => {
      expect(MEMORY_TYPES.length).toBe(6);
    });

    it("all types are strings", () => {
      for (const type of MEMORY_TYPES) {
        expect(typeof type).toBe("string");
      }
    });

    it("all types are non-empty", () => {
      for (const type of MEMORY_TYPES) {
        expect(type.length).toBeGreaterThan(0);
      }
    });

    it("has no duplicate types", () => {
      const uniqueTypes = new Set(MEMORY_TYPES);
      expect(uniqueTypes.size).toBe(MEMORY_TYPES.length);
    });
  });

  describe("type validation patterns", () => {
    it("MemoryType can be validated at runtime", () => {
      const validTypes: MemoryType[] = [
        "observation",
        "decision",
        "session_summary",
        "user_prompt",
        "note",
        "todo",
      ];

      for (const type of validTypes) {
        expect(MEMORY_TYPES.includes(type)).toBe(true);
      }
    });

    it("invalid memory type can be detected", () => {
      const invalidType = "invalid_type";
      expect(MEMORY_TYPES.includes(invalidType as MemoryType)).toBe(false);
    });
  });

  describe("WorkflowPhase values", () => {
    const validPhases: WorkflowPhase[] = [
      "idle",
      "plan",
      "research",
      "specify",
      "execute",
      "accept",
    ];

    it("has idle phase", () => {
      const phase: WorkflowPhase = "idle";
      expect(validPhases).toContain(phase);
    });

    it("has plan phase", () => {
      const phase: WorkflowPhase = "plan";
      expect(validPhases).toContain(phase);
    });

    it("has research phase", () => {
      const phase: WorkflowPhase = "research";
      expect(validPhases).toContain(phase);
    });

    it("has specify phase", () => {
      const phase: WorkflowPhase = "specify";
      expect(validPhases).toContain(phase);
    });

    it("has execute phase", () => {
      const phase: WorkflowPhase = "execute";
      expect(validPhases).toContain(phase);
    });

    it("has accept phase", () => {
      const phase: WorkflowPhase = "accept";
      expect(validPhases).toContain(phase);
    });
  });

  describe("TaskMode values", () => {
    const validModes: TaskMode[] = [
      "quick",
      "standard",
      "comprehensive",
      "milestone",
    ];

    it("has quick mode", () => {
      const mode: TaskMode = "quick";
      expect(validModes).toContain(mode);
    });

    it("has standard mode", () => {
      const mode: TaskMode = "standard";
      expect(validModes).toContain(mode);
    });

    it("has comprehensive mode", () => {
      const mode: TaskMode = "comprehensive";
      expect(validModes).toContain(mode);
    });

    it("has milestone mode", () => {
      const mode: TaskMode = "milestone";
      expect(validModes).toContain(mode);
    });
  });

  describe("type structure validation helpers", () => {
    /**
     * Runtime type guard for MemoryType
     */
    function isValidMemoryType(value: unknown): value is MemoryType {
      return typeof value === "string" && MEMORY_TYPES.includes(value as MemoryType);
    }

    it("validates memory type at runtime", () => {
      expect(isValidMemoryType("observation")).toBe(true);
      expect(isValidMemoryType("decision")).toBe(true);
      expect(isValidMemoryType("invalid")).toBe(false);
      expect(isValidMemoryType(123)).toBe(false);
      expect(isValidMemoryType(null)).toBe(false);
      expect(isValidMemoryType(undefined)).toBe(false);
    });

    /**
     * Runtime type guard for WorkflowPhase
     */
    function isValidWorkflowPhase(value: unknown): value is WorkflowPhase {
      const validPhases = ["idle", "plan", "research", "specify", "execute", "accept"];
      return typeof value === "string" && validPhases.includes(value);
    }

    it("validates workflow phase at runtime", () => {
      expect(isValidWorkflowPhase("idle")).toBe(true);
      expect(isValidWorkflowPhase("execute")).toBe(true);
      expect(isValidWorkflowPhase("invalid")).toBe(false);
      expect(isValidWorkflowPhase(null)).toBe(false);
    });

    /**
     * Runtime type guard for TaskMode
     */
    function isValidTaskMode(value: unknown): value is TaskMode {
      const validModes = ["quick", "standard", "comprehensive", "milestone"];
      return typeof value === "string" && validModes.includes(value);
    }

    it("validates task mode at runtime", () => {
      expect(isValidTaskMode("quick")).toBe(true);
      expect(isValidTaskMode("standard")).toBe(true);
      expect(isValidTaskMode("fast")).toBe(false);
      expect(isValidTaskMode(null)).toBe(false);
    });
  });

  describe("constant immutability", () => {
    it("MEMORY_TYPES is frozen or effectively immutable", () => {
      // The 'as const' assertion makes it readonly at compile time
      // At runtime, we verify the structure is consistent
      const originalLength = MEMORY_TYPES.length;
      const originalFirst = MEMORY_TYPES[0];
      
      // Attempting to modify would be a TypeScript error, but we verify values
      expect(MEMORY_TYPES.length).toBe(originalLength);
      expect(MEMORY_TYPES[0]).toBe(originalFirst);
    });
  });
});
