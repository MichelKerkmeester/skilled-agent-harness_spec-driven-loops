/**
 * Tests for task mode detection
 * @module features/mode-detection/detector.test
 */

import { describe, it, expect } from "bun:test";
import { detectTaskMode, shouldPromptForMode } from "./detector.js";

describe("detectTaskMode", () => {
  describe("quick mode detection", () => {
    it("detects quick fixes", () => {
      const result = detectTaskMode("Fix typo in README");
      expect(result.suggestedMode).toBe("quick");
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it("detects single file changes", () => {
      const result = detectTaskMode("Update single file with new import");
      expect(result.suggestedMode).toBe("quick");
    });

    it("detects bug fixes", () => {
      const result = detectTaskMode("Quick bug fix for login validation");
      expect(result.suggestedMode).toBe("quick");
    });
  });

  describe("standard mode detection", () => {
    it("detects feature additions", () => {
      const result = detectTaskMode("Add new user profile component with avatar and bio");
      expect(result.suggestedMode).toBe("standard");
    });

    it("detects API endpoint creation", () => {
      const result = detectTaskMode("Create API endpoint for user authentication");
      expect(result.suggestedMode).toBe("standard");
    });

    it("detects component implementation", () => {
      const result = detectTaskMode("Implement modal dialog component with form validation");
      expect(result.suggestedMode).toBe("standard");
    });
  });

  describe("comprehensive mode detection", () => {
    it("detects system refactors", () => {
      const result = detectTaskMode(
        "Refactor the entire authentication system to use JWT tokens across all endpoints and update the database schema"
      );
      expect(result.suggestedMode).toBe("comprehensive");
    });

    it("detects architecture changes", () => {
      const result = detectTaskMode(
        "Redesign the application architecture to support microservices and migrate all API routes"
      );
      expect(result.suggestedMode).toBe("comprehensive");
    });

    it("detects migration work", () => {
      const result = detectTaskMode(
        "Migrate the entire codebase from JavaScript to TypeScript with proper type definitions throughout"
      );
      expect(result.suggestedMode).toBe("comprehensive");
    });
  });

  describe("milestone mode detection", () => {
    it("detects version releases", () => {
      const result = detectTaskMode(
        "Plan and implement v2.0 release with new dashboard, API improvements, and user management system"
      );
      expect(result.suggestedMode).toBe("milestone");
    });

    it("detects MVP work", () => {
      const result = detectTaskMode(
        "Build MVP with core features: user authentication, profile management, and basic dashboard for beta launch"
      );
      expect(result.suggestedMode).toBe("milestone");
    });

    it("detects multi-phase projects", () => {
      const result = detectTaskMode(
        "Roadmap for Q1: Phase 1 - authentication, Phase 2 - user profiles, Phase 3 - admin dashboard"
      );
      expect(result.suggestedMode).toBe("milestone");
    });
  });

  describe("confidence calculation", () => {
    it("has high confidence for clear signals", () => {
      const result = detectTaskMode("Fix typo");
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it("has lower confidence for ambiguous requests", () => {
      const result = detectTaskMode("Update the system");
      expect(result.confidence).toBeLessThan(0.7);
    });
  });

  describe("default behavior", () => {
    it("defaults to standard on empty input", () => {
      const result = detectTaskMode("  ");
      expect(result.suggestedMode).toBe("standard");
      expect(result.confidence).toBe(0);
    });
  });

  describe("depth hints", () => {
    it("respects deep hints in the request", () => {
      const result = detectTaskMode("Do a deep dive on auth refactor");
      expect(result.suggestedMode).toBe("comprehensive");
    });
  });

  describe("alternatives detection", () => {
    it("suggests alternatives for ambiguous requests", () => {
      const result = detectTaskMode("Add feature");
      expect(result.alternatives.length).toBeGreaterThan(0);
    });

    it("has few alternatives for clear requests", () => {
      const result = detectTaskMode("Fix typo in README file");
      expect(result.alternatives.length).toBeLessThanOrEqual(1);
    });
  });
});

describe("shouldPromptForMode", () => {
  it("prompts when confidence is low", () => {
    const result = detectTaskMode("Update something");
    expect(shouldPromptForMode(result)).toBe(true);
  });

  it("does not prompt when confidence is high", () => {
    const result = detectTaskMode("Fix typo in README");
    expect(shouldPromptForMode(result)).toBe(false);
  });

  it("prompts when multiple alternatives exist", () => {
    const result = {
      suggestedMode: "standard" as const,
      confidence: 0.7,
      signals: [],
      alternatives: ["quick" as const, "comprehensive" as const],
    };
    expect(shouldPromptForMode(result)).toBe(true);
  });
});
