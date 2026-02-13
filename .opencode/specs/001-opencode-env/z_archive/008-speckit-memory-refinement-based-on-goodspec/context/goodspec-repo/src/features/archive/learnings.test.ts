/**
 * Tests for Learnings Extraction
 */

import { describe, it, expect } from "bun:test";
import { extractLearnings, formatLearningsMarkdown } from "./learnings.js";

describe("learnings", () => {
  describe("extractLearnings", () => {
    it("should extract patterns from retrospective", () => {
      const spec = "";
      const chronicle = "";
      const retrospective = `
# Retrospective

Pattern: TDD approach worked well
Success: Atomic commits helped with debugging
      `;
      
      const learnings = extractLearnings(spec, chronicle, retrospective);
      
      expect(learnings.patterns.length).toBeGreaterThan(0);
      expect(learnings.patterns.some(p => p.includes("TDD"))).toBe(true);
    });

    it("should extract decisions from spec and retrospective", () => {
      const spec = "Decision: Use PostgreSQL for database";
      const chronicle = "";
      const retrospective = "Decision: Chose TypeScript over JavaScript";
      
      const learnings = extractLearnings(spec, chronicle, retrospective);
      
      expect(learnings.decisions.length).toBeGreaterThan(0);
      expect(learnings.decisions.some(d => d.includes("PostgreSQL"))).toBe(true);
    });

    it("should extract gotchas from retrospective", () => {
      const spec = "";
      const chronicle = "";
      const retrospective = `
Gotcha: Type errors in third-party library
Challenge: Authentication flow was complex
      `;
      
      const learnings = extractLearnings(spec, chronicle, retrospective);
      
      expect(learnings.gotchas.length).toBeGreaterThan(0);
      expect(learnings.gotchas.some(g => g.includes("Type errors"))).toBe(true);
    });

    it("should extract metrics from chronicle", () => {
      const spec = "";
      const chronicle = `
# Chronicle

Started: 2024-01-01

## Wave 1

- Task 1
- Task 2

## Wave 2

- Task 3

Completed: 2024-01-10
      `;
      const retrospective = "";
      
      const learnings = extractLearnings(spec, chronicle, retrospective);
      
      expect(learnings.metrics.taskCount).toBe(3);
      expect(learnings.metrics.waveCount).toBe(2);
      expect(learnings.metrics.durationDays).toBe(9);
    });

    it("should handle empty inputs gracefully", () => {
      const learnings = extractLearnings("", "", "");
      
      expect(learnings.patterns).toEqual(["No specific patterns documented"]);
      expect(learnings.decisions).toEqual(["No specific decisions documented"]);
      expect(learnings.gotchas).toEqual(["No specific gotchas documented"]);
      expect(learnings.metrics.taskCount).toBe(0);
      expect(learnings.metrics.waveCount).toBe(0);
      expect(learnings.metrics.durationDays).toBe(0);
    });
  });

  describe("formatLearningsMarkdown", () => {
    it("should format learnings as markdown", () => {
      const learnings = {
        patterns: ["TDD worked well", "Atomic commits helped"],
        decisions: ["Use PostgreSQL", "Choose TypeScript"],
        gotchas: ["Type errors", "Auth complexity"],
        metrics: {
          taskCount: 5,
          waveCount: 2,
          durationDays: 7,
        },
      };
      
      const markdown = formatLearningsMarkdown(learnings);
      
      expect(markdown).toContain("# Learnings");
      expect(markdown).toContain("## Metrics");
      expect(markdown).toContain("**Tasks Completed:** 5");
      expect(markdown).toContain("**Waves Executed:** 2");
      expect(markdown).toContain("**Duration:** 7 days");
      expect(markdown).toContain("## Patterns That Worked");
      expect(markdown).toContain("TDD worked well");
      expect(markdown).toContain("## Key Decisions");
      expect(markdown).toContain("Use PostgreSQL");
      expect(markdown).toContain("## Gotchas & Challenges");
      expect(markdown).toContain("Type errors");
    });
  });
});
