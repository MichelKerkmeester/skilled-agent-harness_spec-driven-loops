/**
 * Tests for Archive Manager
 */

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { mkdirSync, rmSync, existsSync, writeFileSync } from "fs";
import { join } from "path";
import { createArchiveManager } from "./manager.js";
import { extractLearnings } from "./learnings.js";
import type { MemoryManager, MemoryInput } from "../../core/types.js";

// Use a temp directory for tests
const TEST_DIR = "/tmp/goopspec-archive-test-" + Date.now();

describe("archive-manager", () => {
  beforeEach(() => {
    // Create fresh test directory
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true });
    }
    mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    // Cleanup
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true });
    }
  });

  describe("createArchiveManager", () => {
    it("should create an archive manager", () => {
      const manager = createArchiveManager(TEST_DIR);
      expect(manager).toBeTruthy();
      expect(typeof manager.archiveMilestone).toBe("function");
      expect(typeof manager.archiveQuickTask).toBe("function");
      expect(typeof manager.listArchived).toBe("function");
    });
  });

  describe("archiveQuickTask", () => {
    it("should archive a quick task with summary", async () => {
      const manager = createArchiveManager(TEST_DIR);
      const taskName = "test-task";
      const summary = "This is a test task summary";
      
      const taskPath = await manager.archiveQuickTask(taskName, summary);
      
      expect(existsSync(taskPath)).toBe(true);
      expect(taskPath).toContain("001-test-task");
      
      const summaryPath = join(taskPath, "SUMMARY.md");
      expect(existsSync(summaryPath)).toBe(true);
    });

    it("should increment task numbers", async () => {
      const manager = createArchiveManager(TEST_DIR);
      
      const task1 = await manager.archiveQuickTask("task-one", "Summary 1");
      const task2 = await manager.archiveQuickTask("task-two", "Summary 2");
      
      expect(task1).toContain("001-task-one");
      expect(task2).toContain("002-task-two");
    });
  });

  describe("archiveMilestone", () => {
    it("should archive a milestone with retrospective and learnings", async () => {
      const manager = createArchiveManager(TEST_DIR);
      
      // Create a mock milestone
      const milestonesDir = join(TEST_DIR, ".goopspec", "milestones");
      const milestoneDir = join(milestonesDir, "v1.0-test");
      mkdirSync(milestoneDir, { recursive: true });
      
      writeFileSync(join(milestoneDir, "SPEC.md"), "# Test Spec\n\nDecision: Use TypeScript");
      writeFileSync(join(milestoneDir, "CHRONICLE.md"), "## Wave 1\n\n- Task 1\n- Task 2");
      
      const retrospective = "# Retrospective\n\nPattern: TDD worked well\nGotcha: Type errors";
      
      const entry = await manager.archiveMilestone("v1.0-test", retrospective);
      
      expect(entry.id).toBe("v1.0-test");
      expect(existsSync(entry.retrospectivePath)).toBe(true);
      expect(existsSync(entry.learningsPath)).toBe(true);
    });

    it("should throw error if milestone not found", async () => {
      const manager = createArchiveManager(TEST_DIR);
      
      await expect(
        manager.archiveMilestone("nonexistent", "retrospective")
      ).rejects.toThrow("Milestone not found");
    });
  });

  describe("listArchived", () => {
    it("should return empty array when no archives exist", () => {
      const manager = createArchiveManager(TEST_DIR);
      const archived = manager.listArchived();
      
      expect(archived).toEqual([]);
    });

    it("should list archived milestones", async () => {
      const manager = createArchiveManager(TEST_DIR);
      
      // Create mock milestone
      const milestonesDir = join(TEST_DIR, ".goopspec", "milestones");
      const milestoneDir = join(milestonesDir, "v1.0-test");
      mkdirSync(milestoneDir, { recursive: true });
      
      writeFileSync(join(milestoneDir, "SPEC.md"), "# Test");
      writeFileSync(join(milestoneDir, "CHRONICLE.md"), "# Chronicle");
      
      await manager.archiveMilestone("v1.0-test", "# Retrospective");
      
      const archived = manager.listArchived();
      
      expect(archived.length).toBe(1);
      expect(archived[0].id).toBe("v1.0-test");
    });
  });

  describe("generateArchiveIndex", () => {
    it("should generate an index file", () => {
      const manager = createArchiveManager(TEST_DIR);
      const index = manager.generateArchiveIndex();
      
      expect(index).toContain("# Archive Index");
      expect(index).toContain("No archived milestones yet");
    });
  });

  describe("persistLearnings", () => {
    it("should return false when memory manager is not provided", async () => {
      const manager = createArchiveManager(TEST_DIR);
      
      // Create and archive a milestone
      const milestonesDir = join(TEST_DIR, ".goopspec", "milestones");
      const milestoneDir = join(milestonesDir, "v1.0-test");
      mkdirSync(milestoneDir, { recursive: true });
      
      writeFileSync(join(milestoneDir, "SPEC.md"), "# Test Spec");
      writeFileSync(join(milestoneDir, "CHRONICLE.md"), "# Chronicle");
      
      await manager.archiveMilestone("v1.0-test", "# Retrospective");
      
      const learnings = extractLearnings("", "", "");
      const result = await manager.persistLearnings("v1.0-test", learnings);
      
      expect(result).toBe(false);
    });

    it("should persist learnings to memory when memory manager is provided", async () => {
      const savedMemories: MemoryInput[] = [];
      
      // Mock memory manager
      const mockMemoryManager: MemoryManager = {
        save: async (input: MemoryInput) => {
          savedMemories.push(input);
          return {
            id: savedMemories.length,
            type: input.type,
            title: input.title,
            content: input.content,
            facts: input.facts || [],
            concepts: input.concepts || [],
            sourceFiles: input.sourceFiles || [],
            importance: input.importance || 0.5,
            visibility: input.visibility || "public",
            phase: input.phase,
            sessionId: input.sessionId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            accessedAt: Date.now(),
            accessCount: 0,
          };
        },
        search: async () => [],
        getById: async () => null,
        getRecent: async () => [],
        update: async () => null,
        delete: async () => false,
      };
      
      const manager = createArchiveManager(TEST_DIR, mockMemoryManager);
      
      // Create and archive a milestone
      const milestonesDir = join(TEST_DIR, ".goopspec", "milestones");
      const milestoneDir = join(milestonesDir, "v1.0-test");
      mkdirSync(milestoneDir, { recursive: true });
      
      writeFileSync(join(milestoneDir, "SPEC.md"), "# Test Spec\n\nDecision: Use TypeScript");
      writeFileSync(join(milestoneDir, "CHRONICLE.md"), "## Wave 1\n\n- Task 1");
      
      const retrospective = "# Retrospective\n\nPattern: TDD worked well\nGotcha: Type errors";
      await manager.archiveMilestone("v1.0-test", retrospective);
      
      const learnings = extractLearnings(
        "# Test Spec\n\nDecision: Use TypeScript",
        "## Wave 1\n\n- Task 1",
        retrospective
      );
      
      const result = await manager.persistLearnings("v1.0-test", learnings);
      
      expect(result).toBe(true);
      expect(savedMemories.length).toBeGreaterThan(0);
      
      // Check main learnings entry
      const mainEntry = savedMemories.find(m => m.title.includes("Milestone Complete"));
      expect(mainEntry).toBeTruthy();
      expect(mainEntry?.type).toBe("observation");
      expect(mainEntry?.importance).toBe(0.8);
      expect(mainEntry?.concepts).toContain("milestone");
      expect(mainEntry?.concepts).toContain("learnings");
    });

    it("should return false for non-existent milestone", async () => {
      const mockMemoryManager: MemoryManager = {
        save: async () => ({
          id: 1,
          type: "observation",
          title: "",
          content: "",
          facts: [],
          concepts: [],
          sourceFiles: [],
          importance: 0.5,
          visibility: "public",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          accessedAt: Date.now(),
          accessCount: 0,
        }),
        search: async () => [],
        getById: async () => null,
        getRecent: async () => [],
        update: async () => null,
        delete: async () => false,
      };
      
      const manager = createArchiveManager(TEST_DIR, mockMemoryManager);
      const learnings = extractLearnings("", "", "");
      
      const result = await manager.persistLearnings("nonexistent", learnings);
      
      expect(result).toBe(false);
    });
  });
});
