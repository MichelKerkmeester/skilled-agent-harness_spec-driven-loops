/**
 * Tests for Parallel Research Manager
 */

import { describe, it, expect } from "bun:test";
import {
  createResearchPlan,
  formatResearchPlan,
  updateTaskStatus,
  isResearchComplete,
  getResearchProgress,
  type ResearchPlan,
} from "./manager";

describe("parallel-research/manager", () => {
  describe("createResearchPlan", () => {
    it("should create a research plan with default agents", () => {
      const plan = createResearchPlan("authentication", ["JWT", "OAuth"]);
      
      expect(plan.topic).toBe("authentication");
      expect(plan.tasks.length).toBeGreaterThan(0);
      expect(plan.createdAt).toBeGreaterThan(0);
    });

    it("should create tasks for each agent", () => {
      const plan = createResearchPlan("database", ["PostgreSQL", "MongoDB"]);
      
      const agentNames = plan.tasks.map(t => t.agent);
      expect(agentNames).toContain("goop-researcher");
      expect(agentNames).toContain("goop-explorer");
      expect(agentNames).toContain("goop-librarian");
    });

    it("should set all tasks to pending initially", () => {
      const plan = createResearchPlan("testing", ["unit", "integration"]);
      
      for (const task of plan.tasks) {
        expect(task.status).toBe("pending");
        expect(task.startedAt).toBeUndefined();
        expect(task.completedAt).toBeUndefined();
      }
    });

    it("should respect maxParallel config", () => {
      const plan = createResearchPlan(
        "api-design",
        ["REST", "GraphQL"],
        { maxParallel: 2 }
      );
      
      expect(plan.tasks.length).toBeLessThanOrEqual(2);
    });

    it("should include requirements in prompts", () => {
      const requirements = ["security", "performance"];
      const plan = createResearchPlan("caching", requirements);
      
      const firstPrompt = plan.tasks[0].prompt;
      expect(firstPrompt).toContain("security");
      expect(firstPrompt).toContain("performance");
    });
  });

  describe("formatResearchPlan", () => {
    it("should format plan as markdown", () => {
      const plan = createResearchPlan("testing", ["unit"]);
      const formatted = formatResearchPlan(plan);
      
      expect(formatted).toContain("# Research Plan: testing");
      expect(formatted).toContain("**Created:**");
      expect(formatted).toContain("**Tasks:**");
    });

    it("should include task status icons", () => {
      const plan = createResearchPlan("api", ["REST"]);
      const formatted = formatResearchPlan(plan);
      
      expect(formatted).toContain("⏳"); // pending icon
    });

    it("should show timestamps when available", () => {
      let plan = createResearchPlan("db", ["SQL"]);
      plan = updateTaskStatus(plan, plan.tasks[0].id, "running");
      
      const formatted = formatResearchPlan(plan);
      expect(formatted).toContain("**Started:**");
    });
  });

  describe("updateTaskStatus", () => {
    it("should update task status", () => {
      let plan = createResearchPlan("auth", ["JWT"]);
      const taskId = plan.tasks[0].id;
      
      plan = updateTaskStatus(plan, taskId, "running");
      
      expect(plan.tasks[0].status).toBe("running");
    });

    it("should set startedAt when status becomes running", () => {
      let plan = createResearchPlan("cache", ["Redis"]);
      const taskId = plan.tasks[0].id;
      
      plan = updateTaskStatus(plan, taskId, "running");
      
      expect(plan.tasks[0].startedAt).toBeGreaterThan(0);
    });

    it("should set completedAt when status becomes completed", () => {
      let plan = createResearchPlan("queue", ["RabbitMQ"]);
      const taskId = plan.tasks[0].id;
      
      plan = updateTaskStatus(plan, taskId, "completed", "Research done");
      
      expect(plan.tasks[0].completedAt).toBeGreaterThan(0);
      expect(plan.tasks[0].result).toBe("Research done");
    });

    it("should set completedAt when status becomes failed", () => {
      let plan = createResearchPlan("search", ["Elasticsearch"]);
      const taskId = plan.tasks[0].id;
      
      plan = updateTaskStatus(plan, taskId, "failed");
      
      expect(plan.tasks[0].completedAt).toBeGreaterThan(0);
    });

    it("should not modify other tasks", () => {
      let plan = createResearchPlan("storage", ["S3", "GCS"]);
      const firstTaskId = plan.tasks[0].id;
      const secondTaskStatus = plan.tasks[1].status;
      
      plan = updateTaskStatus(plan, firstTaskId, "completed");
      
      expect(plan.tasks[1].status).toBe(secondTaskStatus);
    });
  });

  describe("isResearchComplete", () => {
    it("should return false when tasks are pending", () => {
      const plan = createResearchPlan("logging", ["Winston"]);
      expect(isResearchComplete(plan)).toBe(false);
    });

    it("should return false when tasks are running", () => {
      let plan = createResearchPlan("monitoring", ["Prometheus"]);
      plan = updateTaskStatus(plan, plan.tasks[0].id, "running");
      
      expect(isResearchComplete(plan)).toBe(false);
    });

    it("should return true when all tasks completed", () => {
      let plan = createResearchPlan("deployment", ["Docker"]);
      
      for (const task of plan.tasks) {
        plan = updateTaskStatus(plan, task.id, "completed");
      }
      
      expect(isResearchComplete(plan)).toBe(true);
    });

    it("should return true when all tasks completed or failed", () => {
      let plan = createResearchPlan("ci-cd", ["GitHub Actions"]);
      
      plan = updateTaskStatus(plan, plan.tasks[0].id, "completed");
      plan = updateTaskStatus(plan, plan.tasks[1].id, "failed");
      plan = updateTaskStatus(plan, plan.tasks[2].id, "completed");
      
      expect(isResearchComplete(plan)).toBe(true);
    });
  });

  describe("getResearchProgress", () => {
    it("should return correct counts for pending tasks", () => {
      const plan = createResearchPlan("security", ["HTTPS"]);
      const progress = getResearchProgress(plan);
      
      expect(progress.total).toBe(plan.tasks.length);
      expect(progress.pending).toBe(plan.tasks.length);
      expect(progress.running).toBe(0);
      expect(progress.completed).toBe(0);
      expect(progress.failed).toBe(0);
    });

    it("should track running tasks", () => {
      let plan = createResearchPlan("performance", ["caching"]);
      plan = updateTaskStatus(plan, plan.tasks[0].id, "running");
      
      const progress = getResearchProgress(plan);
      expect(progress.running).toBe(1);
      expect(progress.pending).toBe(plan.tasks.length - 1);
    });

    it("should track completed and failed tasks", () => {
      let plan = createResearchPlan("testing", ["Jest", "Vitest"]);
      
      plan = updateTaskStatus(plan, plan.tasks[0].id, "completed");
      plan = updateTaskStatus(plan, plan.tasks[1].id, "failed");
      
      const progress = getResearchProgress(plan);
      expect(progress.completed).toBe(1);
      expect(progress.failed).toBe(1);
      expect(progress.pending).toBe(plan.tasks.length - 2);
    });

    it("should maintain correct total count", () => {
      let plan = createResearchPlan("api", ["REST", "GraphQL"]);
      
      for (const task of plan.tasks) {
        plan = updateTaskStatus(plan, task.id, "completed");
      }
      
      const progress = getResearchProgress(plan);
      expect(progress.total).toBe(plan.tasks.length);
      expect(progress.completed).toBe(plan.tasks.length);
    });
  });

  describe("edge cases", () => {
    it("should handle empty requirements", () => {
      const plan = createResearchPlan("general", []);
      expect(plan.tasks.length).toBeGreaterThan(0);
    });

    it("should generate unique task IDs", () => {
      const plan = createResearchPlan("unique", ["test"]);
      const ids = plan.tasks.map(t => t.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should handle updating non-existent task gracefully", () => {
      let plan = createResearchPlan("test", ["item"]);
      const originalPlan = JSON.parse(JSON.stringify(plan));
      
      plan = updateTaskStatus(plan, "non-existent-id", "completed");
      
      // Plan should be unchanged
      expect(plan.tasks).toEqual(originalPlan.tasks);
    });
  });
});
