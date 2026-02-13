/**
 * Task mode detection logic
 * @module features/mode-detection/detector
 */

import type { TaskMode, WorkflowDepth } from "../../core/types.js";
import {
  ALL_SIGNALS,
  WORD_COUNT_THRESHOLDS,
} from "./heuristics.js";

export interface ModeDetectionResult {
  suggestedMode: TaskMode;
  confidence: number; // 0.0 - 1.0
  signals: string[]; // Why this mode was suggested
  alternatives: TaskMode[]; // Other reasonable modes
}

export interface DetectorOptions {
  defaultMode?: TaskMode;
  confidenceThreshold?: number; // Below this, consider ambiguous
  depthHint?: WorkflowDepth;
}

const DEFAULT_OPTIONS: Required<Pick<DetectorOptions, "defaultMode" | "confidenceThreshold">> = {
  defaultMode: "standard",
  confidenceThreshold: 0.6,
};

/**
 * Detect the most appropriate task mode for a user request
 * 
 * Algorithm:
 * 1. Apply word count heuristics
 * 2. Apply pattern heuristics from all signal groups
 * 3. Calculate weighted scores for each mode
 * 4. Find highest score as suggested mode
 * 5. Calculate confidence based on score margin
 * 6. Find alternatives within 0.2 of top score
 * 
 * @param userRequest - The user's task description
 * @param options - Detection options
 * @returns Detection result with suggested mode and confidence
 */
export function detectTaskMode(
  userRequest: string,
  options?: DetectorOptions
): ModeDetectionResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Normalize input
  const normalized = userRequest.toLowerCase().trim();
  if (!normalized) {
    return {
      suggestedMode: opts.defaultMode,
      confidence: 0,
      signals: [`Empty request; defaulted to ${opts.defaultMode}`],
      alternatives: [],
    };
  }
  const wordCount = normalized.split(/\s+/).length;
  
  // Initialize scores for each mode
  const scores: Record<TaskMode, number> = {
    quick: 0,
    standard: 0,
    comprehensive: 0,
    milestone: 0,
  };
  
  // Track which signals fired
  const firedSignals: string[] = [];

  // Apply depth hints (explicit or inferred)
  const depthHint = options?.depthHint ?? detectDepthHint(normalized);
  if (depthHint) {
    firedSignals.push(...applyDepthHint(depthHint, scores));
  }
  
  // Apply word count heuristics
  const wordCountSignals = applyWordCountHeuristics(wordCount, scores);
  firedSignals.push(...wordCountSignals);
  
  // Apply pattern heuristics
  const patternSignals = applyPatternHeuristics(normalized, scores);
  firedSignals.push(...patternSignals);
  
  // Find the mode with highest score
  const sortedModes = (Object.keys(scores) as TaskMode[]).sort(
    (a, b) => scores[b] - scores[a]
  );
  
  const topMode = sortedModes[0];
  const topScore = topMode ? scores[topMode] : 0;
  if (topScore === 0) {
    return {
      suggestedMode: opts.defaultMode,
      confidence: 0,
      signals: firedSignals.length > 0
        ? firedSignals
        : [`No strong signals; defaulted to ${opts.defaultMode}`],
      alternatives: [],
    };
  }

  const suggestedMode = topMode || opts.defaultMode;
  const secondScore = scores[sortedModes[1]] || 0;
  
  // Calculate confidence based on score margin
  // Higher margin = higher confidence
  const scoreMargin = topScore - secondScore;
  const confidence = calculateConfidence(topScore, scoreMargin);
  
  // Find alternatives (modes within 0.2 of top score)
  const alternatives = sortedModes
    .slice(1)
    .filter((mode) => topScore - scores[mode] <= 0.2);
  
  return {
    suggestedMode,
    confidence,
    signals: firedSignals,
    alternatives,
  };
}

/**
 * Determine if the user should be prompted to confirm or choose a mode
 * Returns true if confidence is low or alternatives are close
 */
export function shouldPromptForMode(result: ModeDetectionResult): boolean {
  // Low confidence - should ask
  if (result.confidence < 0.6) {
    return true;
  }
  
  // Multiple strong alternatives - should ask
  if (result.alternatives.length >= 2) {
    return true;
  }
  
  // High confidence with no close alternatives - don't ask
  return false;
}

// ============================================================================
// Internal Helper Functions
// ============================================================================

/**
 * Apply word count heuristics to scores
 * Returns descriptions of fired signals
 */
function applyWordCountHeuristics(
  wordCount: number,
  scores: Record<TaskMode, number>
): string[] {
  const signals: string[] = [];
  
  // Quick mode: short requests
  if (wordCount <= WORD_COUNT_THRESHOLDS.quick.max) {
    scores.quick += WORD_COUNT_THRESHOLDS.quick.weight;
    signals.push(`Short request (${wordCount} words) suggests quick fix`);
  }
  
  // Standard mode: medium requests
  if (
    wordCount >= WORD_COUNT_THRESHOLDS.standard.min &&
    wordCount <= WORD_COUNT_THRESHOLDS.standard.max
  ) {
    scores.standard += WORD_COUNT_THRESHOLDS.standard.weight;
    signals.push(`Medium length (${wordCount} words) suggests standard feature`);
  }
  
  // Comprehensive mode: long requests
  if (
    wordCount >= WORD_COUNT_THRESHOLDS.comprehensive.min &&
    wordCount <= WORD_COUNT_THRESHOLDS.comprehensive.max
  ) {
    scores.comprehensive += WORD_COUNT_THRESHOLDS.comprehensive.weight;
    signals.push(`Long request (${wordCount} words) suggests comprehensive work`);
  }
  
  // Milestone mode: very long requests
  if (wordCount >= WORD_COUNT_THRESHOLDS.milestone.min) {
    scores.milestone += WORD_COUNT_THRESHOLDS.milestone.weight;
    signals.push(`Very long request (${wordCount} words) suggests milestone project`);
  }
  
  return signals;
}

/**
 * Apply pattern heuristics to scores
 * Returns descriptions of fired signals
 */
function applyPatternHeuristics(
  normalized: string,
  scores: Record<TaskMode, number>
): string[] {
  const signals: string[] = [];
  
  for (const signal of ALL_SIGNALS) {
    if (matchesPattern(normalized, signal.pattern)) {
      scores[signal.mode] += signal.weight;
      signals.push(signal.description);
    }
  }
  
  return signals;
}

/**
 * Check if text matches a pattern (RegExp or string array)
 */
function matchesPattern(text: string, pattern: RegExp | string[]): boolean {
  if (pattern instanceof RegExp) {
    return pattern.test(text);
  }
  
  // String array - check if any string is in text
  return pattern.some((str) => text.includes(str.toLowerCase()));
}

/**
 * Calculate confidence score based on top score and margin
 * 
 * Confidence factors:
 * - Higher absolute score = higher confidence
 * - Larger margin from second place = higher confidence
 * - Normalize to 0.0 - 1.0 range
 */
function calculateConfidence(topScore: number, margin: number): number {
  // Base confidence from absolute score (max ~3.0 for strong signals)
  const scoreConfidence = Math.min(topScore / 3.0, 1.0);
  
  // Margin confidence (margin of 1.0+ is very confident)
  const marginConfidence = Math.min(margin / 1.0, 1.0);
  
  // Weighted average: 60% score, 40% margin
  const confidence = scoreConfidence * 0.6 + marginConfidence * 0.4;
  
  // Clamp to 0.0 - 1.0
  return Math.max(0.0, Math.min(1.0, confidence));
}

function detectDepthHint(input: string): WorkflowDepth | null {
  if (!input) {
    return null;
  }

  if (/\b(deep|in-depth|thorough|detailed|exhaustive|deep dive)\b/i.test(input)) {
    return "deep";
  }

  if (/\b(shallow|brief|lightweight|minimal|surface|quick)\b/i.test(input)) {
    return "shallow";
  }

  return null;
}

function applyDepthHint(
  depth: WorkflowDepth,
  scores: Record<TaskMode, number>
): string[] {
  switch (depth) {
    case "deep":
      scores.comprehensive += 1.0;
      return ["Depth hint suggests comprehensive work"];
    case "shallow":
      scores.quick += 1.0;
      return ["Depth hint suggests quick work"];
    case "standard":
      scores.standard += 0.4;
      return ["Depth hint suggests standard work"];
    default:
      return [];
  }
}
