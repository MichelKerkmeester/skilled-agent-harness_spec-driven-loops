/**
 * Heuristic rules for task mode detection
 * @module features/mode-detection/heuristics
 */

import type { TaskMode } from "../../core/types.js";

export interface HeuristicSignal {
  pattern: RegExp | string[];
  mode: TaskMode;
  weight: number; // How strongly this suggests the mode (0.0 - 1.0)
  description: string;
}

// ============================================================================
// Quick Mode Signals
// ============================================================================

/**
 * Quick mode: Small, focused changes that can be done in minutes
 * - Single file edits
 * - Bug fixes
 * - Typos and formatting
 * - Small tweaks
 */
export const QUICK_SIGNALS: HeuristicSignal[] = [
  {
    pattern: /\b(fix|bug|quick|small|tweak|typo|hotfix)\b/i,
    mode: "quick",
    weight: 0.8,
    description: "Quick fix keywords",
  },
  {
    pattern: /\b(single file|one file|just|only)\b/i,
    mode: "quick",
    weight: 0.7,
    description: "Single file mention",
  },
  {
    pattern: /\b(rename|update|change|modify)\s+(a|the|this)\s+\w+/i,
    mode: "quick",
    weight: 0.6,
    description: "Simple modification",
  },
  {
    pattern: /\b(typo|spelling|formatting|indent|whitespace)\b/i,
    mode: "quick",
    weight: 0.9,
    description: "Trivial changes",
  },
];

// ============================================================================
// Standard Mode Signals
// ============================================================================

/**
 * Standard mode: Normal feature development
 * - New components
 * - API endpoints
 * - Pages and routes
 * - Typical features
 */
export const STANDARD_SIGNALS: HeuristicSignal[] = [
  {
    pattern: /\b(feature|add|implement|create|build|develop)\b/i,
    mode: "standard",
    weight: 0.6,
    description: "Feature keywords",
  },
  {
    pattern: /\b(component|endpoint|page|route|api|service|util)\b/i,
    mode: "standard",
    weight: 0.5,
    description: "Component keywords",
  },
  {
    pattern: /\b(new|another|additional)\s+(feature|component|page)\b/i,
    mode: "standard",
    weight: 0.7,
    description: "New feature indication",
  },
  {
    pattern: /\b(form|modal|button|card|list|table|chart)\b/i,
    mode: "standard",
    weight: 0.5,
    description: "UI component keywords",
  },
  {
    pattern: /\b(authentication|validation|error handling|logging)\b/i,
    mode: "standard",
    weight: 0.6,
    description: "Standard feature patterns",
  },
];

// ============================================================================
// Comprehensive Mode Signals
// ============================================================================

/**
 * Comprehensive mode: Large-scale changes affecting multiple areas
 * - System refactors
 * - Architecture changes
 * - Cross-cutting concerns
 * - Major redesigns
 */
export const COMPREHENSIVE_SIGNALS: HeuristicSignal[] = [
  {
    pattern: /\b(system|architecture|refactor|redesign|overhaul|rewrite)\b/i,
    mode: "comprehensive",
    weight: 0.7,
    description: "System-level keywords",
  },
  {
    pattern: /\b(across|multiple|all|entire|throughout|everywhere)\b/i,
    mode: "comprehensive",
    weight: 0.5,
    description: "Scope keywords",
  },
  {
    pattern: /\b(migrate|upgrade|modernize|restructure)\b/i,
    mode: "comprehensive",
    weight: 0.8,
    description: "Large-scale change keywords",
  },
  {
    pattern: /\b(codebase|project|application)\s+(wide|level)\b/i,
    mode: "comprehensive",
    weight: 0.9,
    description: "Project-wide scope",
  },
  {
    pattern: /\b(framework|library|dependency)\s+(change|switch|upgrade)\b/i,
    mode: "comprehensive",
    weight: 0.8,
    description: "Major dependency changes",
  },
];

// ============================================================================
// Milestone Mode Signals
// ============================================================================

/**
 * Milestone mode: Release-oriented work with multiple phases
 * - Version releases
 * - MVPs
 * - Major launches
 * - Multi-phase projects
 */
export const MILESTONE_SIGNALS: HeuristicSignal[] = [
  {
    pattern: /\b(v\d+|version|release|milestone|phase)\b/i,
    mode: "milestone",
    weight: 0.9,
    description: "Version keywords",
  },
  {
    pattern: /\b(mvp|beta|alpha|launch|ship|deploy)\b/i,
    mode: "milestone",
    weight: 1.0,
    description: "Release keywords",
  },
  {
    pattern: /\b(roadmap|plan|phases|stages|iterations)\b/i,
    mode: "milestone",
    weight: 0.7,
    description: "Multi-phase keywords",
  },
  {
    pattern: /\b(quarter|q\d|sprint|epic)\b/i,
    mode: "milestone",
    weight: 0.6,
    description: "Project management keywords",
  },
  {
    pattern: /\b(production|prod|go-live|rollout)\b/i,
    mode: "milestone",
    weight: 0.7,
    description: "Production deployment keywords",
  },
  {
    pattern: /\b(core features|multiple features|several features)\b/i,
    mode: "milestone",
    weight: 0.6,
    description: "Multiple feature indication",
  },
];

// ============================================================================
// All Signals Combined
// ============================================================================

export const ALL_SIGNALS: HeuristicSignal[] = [
  ...QUICK_SIGNALS,
  ...STANDARD_SIGNALS,
  ...COMPREHENSIVE_SIGNALS,
  ...MILESTONE_SIGNALS,
];

// ============================================================================
// Word Count Thresholds
// ============================================================================

/**
 * Word count heuristics for mode detection
 * Shorter requests tend to be quick fixes, longer ones comprehensive
 */
export const WORD_COUNT_THRESHOLDS = {
  quick: { max: 30, weight: 0.4 },
  standard: { min: 30, max: 100, weight: 0.3 },
  comprehensive: { min: 100, max: 300, weight: 0.5 },
  milestone: { min: 200, weight: 0.6 },
} as const;
