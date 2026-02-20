// ---------------------------------------------------------------
// MODULE: Fsrs Scheduler — CANONICAL FSRS CONSTANTS & ALGORITHM
// Free Spaced Repetition Scheduler v4 algorithm implementation
//
// T301: TWO-DOMAIN DECAY MODEL (Single Source of Truth)
// ─────────────────────────────────────────────────────
// Long-term memory (this file):
//   FSRS v4 power-law: R(t) = (1 + FSRS_FACTOR * t/S)^FSRS_DECAY
//   Timescale: days/weeks. Constants: FSRS_FACTOR=19/81, FSRS_DECAY=-0.5
//   All long-term decay consumers MUST import constants from this file.
//
// Working memory (working-memory.ts — separate system, intentionally decoupled):
//   Linear multiplicative: score * 0.95 per tick
//   Timescale: minutes. Operates on session-scoped attention scores only.
//
// DECAY STRATEGY (ADR-004): This is the CANONICAL long-term decay
// algorithm. All temporal decay for persistent memories should route
// through calculateRetrievability(). Formula: R(t) = (1 + 19/81 * t/S)^(-0.5)
// where t = elapsed days, S = stability (grows with successful reviews).
//
// Consumers: attention-decay.ts (facade), composite-scoring.ts (temporal
// factor), tier-classifier.ts (state classification),
// vector-index-impl.js (SQL search ranking).
// ---------------------------------------------------------------

/* -------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

/** FSRS v4 algorithm constants */
const FSRS_FACTOR = 19 / 81;
const FSRS_DECAY = -0.5;

// T301: Derived constant for half-life ↔ stability conversion.
// From R(h) = 0.5: S = (FSRS_FACTOR / 3) * h = (19/243) * h
const FSRS_HALF_LIFE_FACTOR = FSRS_FACTOR / 3; // 19/243 ≈ 0.07819

/** Grade constants for review scoring */
const GRADE_AGAIN = 1;
const GRADE_HARD = 2;
const GRADE_GOOD = 3;
const GRADE_EASY = 4;

/** Default initial parameters */
const DEFAULT_INITIAL_STABILITY = 1.0;
const DEFAULT_INITIAL_DIFFICULTY = 5.0;

/** Difficulty bounds */
const MIN_DIFFICULTY = 1.0;
const MAX_DIFFICULTY = 10.0;

/** Stability bounds */
const MIN_STABILITY = 0.1;

/* -------------------------------------------------------------
   2. INTERFACES
----------------------------------------------------------------*/

interface FsrsParams {
  stability: number;
  difficulty: number;
  lastReview: string | null;
  reviewCount: number;
}

interface ReviewResult {
  stability: number;
  difficulty: number;
  lastReview: string;
  reviewCount: number;
  nextReviewDate: string;
  retrievability: number;
}

/* -------------------------------------------------------------
   3. CORE FUNCTIONS
----------------------------------------------------------------*/

/**
 * Calculate retrievability (probability of recall) using FSRS v4 formula.
 * R(t) = (1 + FACTOR * t / S)^DECAY
 */
function calculateRetrievability(stability: number, elapsedDays: number): number {
  if (stability <= 0 || elapsedDays < 0) {
    return 0;
  }

  const retrievability = Math.pow(
    1 + FSRS_FACTOR * (elapsedDays / stability),
    FSRS_DECAY
  );

  return Math.max(0, Math.min(1, retrievability));
}

/**
 * Update stability based on review grade.
 * Uses simplified FSRS v4 update rules.
 */
function updateStability(
  currentStability: number,
  difficulty: number,
  grade: number,
  retrievability: number
): number {
  if (grade === GRADE_AGAIN) {
    // Lapse: stability decreases significantly
    return Math.max(MIN_STABILITY, currentStability * 0.2);
  }

  // Success: stability increases based on grade and difficulty
  const difficultyFactor = 1 + (11 - difficulty) * 0.1;
  const gradeFactor = grade === GRADE_EASY ? 1.3 : grade === GRADE_GOOD ? 1.0 : 0.8;
  const retrievabilityBonus = 1 + (1 - retrievability) * 0.5;

  const newStability = currentStability * difficultyFactor * gradeFactor * retrievabilityBonus;

  return Math.max(MIN_STABILITY, newStability);
}

/**
 * Calculate optimal review interval from stability.
 * The interval where retrievability = 0.9 (desired retention).
 */
function calculateOptimalInterval(stability: number, desiredRetention: number = 0.9): number {
  if (stability <= 0 || desiredRetention <= 0 || desiredRetention >= 1) {
    return 1;
  }

  const interval = (stability / FSRS_FACTOR) * (Math.pow(desiredRetention, 1 / FSRS_DECAY) - 1);

  return Math.max(1, Math.round(interval));
}

/**
 * Update difficulty based on review grade.
 */
function updateDifficulty(currentDifficulty: number, grade: number): number {
  let newDifficulty: number;

  if (grade === GRADE_AGAIN) {
    newDifficulty = currentDifficulty + 1.0;
  } else if (grade === GRADE_HARD) {
    newDifficulty = currentDifficulty + 0.5;
  } else if (grade === GRADE_GOOD) {
    newDifficulty = currentDifficulty;
  } else {
    // EASY
    newDifficulty = currentDifficulty - 0.5;
  }

  return Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, newDifficulty));
}

/**
 * Calculate elapsed days since last review.
 */
function calculateElapsedDays(lastReview: string | null): number {
  if (!lastReview) {
    return 0;
  }

  const lastDate = new Date(lastReview);
  const now = new Date();
  const diffMs = now.getTime() - lastDate.getTime();

  return Math.max(0, diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Get next review date based on stability and desired retention.
 */
function getNextReviewDate(stability: number, desiredRetention: number = 0.9): string {
  const intervalDays = calculateOptimalInterval(stability, desiredRetention);
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);

  return nextDate.toISOString();
}

/**
 * Create initial FSRS parameters for a new memory.
 */
function createInitialParams(): FsrsParams {
  return {
    stability: DEFAULT_INITIAL_STABILITY,
    difficulty: DEFAULT_INITIAL_DIFFICULTY,
    lastReview: null,
    reviewCount: 0,
  };
}

/**
 * Process a review and return updated parameters.
 */
function processReview(params: FsrsParams, grade: number): ReviewResult {
  const elapsedDays = calculateElapsedDays(params.lastReview);
  const retrievability = calculateRetrievability(params.stability, elapsedDays);

  const newStability = updateStability(params.stability, params.difficulty, grade, retrievability);
  const newDifficulty = updateDifficulty(params.difficulty, grade);
  const now = new Date().toISOString();
  const nextReviewDate = getNextReviewDate(newStability);

  return {
    stability: newStability,
    difficulty: newDifficulty,
    lastReview: now,
    reviewCount: params.reviewCount + 1,
    nextReviewDate,
    retrievability,
  };
}

/* -------------------------------------------------------------
   4. EXPORTS
----------------------------------------------------------------*/

/** Bundled constants object for test/external consumption */
const FSRS_CONSTANTS = {
  FSRS_FACTOR,
  FSRS_DECAY,
  FSRS_HALF_LIFE_FACTOR, // T301: derived constant (19/243)
  GRADE_AGAIN,
  GRADE_HARD,
  GRADE_GOOD,
  GRADE_EASY,
  DEFAULT_STABILITY: DEFAULT_INITIAL_STABILITY,
  DEFAULT_DIFFICULTY: DEFAULT_INITIAL_DIFFICULTY,
  MIN_DIFFICULTY,
  MAX_DIFFICULTY,
  MIN_STABILITY,
} as const;

/**
 * C138: Tier-based decay multipliers for long-term memory stability.
 * Each tier modifies how quickly memories decay relative to the base FSRS schedule.
 * constitutional = slowest decay (most persistent), scratch = fastest decay (ephemeral).
 */
const TIER_MULTIPLIER: Readonly<Record<string, number>> = {
  constitutional: 0.1,
  critical: 0.3,
  important: 0.5,
  normal: 1.0,
  temporary: 2.0,
  scratch: 3.0,
} as const;

export {
  // Constants
  FSRS_FACTOR,
  FSRS_DECAY,
  FSRS_HALF_LIFE_FACTOR, // T301: derived constant for half-life ↔ stability
  GRADE_AGAIN,
  GRADE_HARD,
  GRADE_GOOD,
  GRADE_EASY,
  DEFAULT_INITIAL_STABILITY,
  DEFAULT_INITIAL_DIFFICULTY,
  MIN_DIFFICULTY,
  MAX_DIFFICULTY,
  MIN_STABILITY,
  FSRS_CONSTANTS,
  TIER_MULTIPLIER,

  // Core functions
  calculateRetrievability,
  updateStability,
  calculateOptimalInterval,
  updateDifficulty,
  calculateElapsedDays,
  getNextReviewDate,
  createInitialParams,
  processReview,
};

export type {
  FsrsParams,
  ReviewResult,
};
