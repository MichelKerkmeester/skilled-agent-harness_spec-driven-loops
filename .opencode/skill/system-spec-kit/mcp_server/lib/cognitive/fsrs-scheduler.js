// ───────────────────────────────────────────────────────────────
// COGNITIVE: FSRS SCHEDULER
// ───────────────────────────────────────────────────────────────
'use strict';

/**
 * FSRS Scheduler Module
 * Free Spaced Repetition Scheduler algorithm for memory decay.
 * Based on FSRS v4 power-law formula (validated on 100M+ Anki users).
 */

/* ─────────────────────────────────────────────────────────────
   1. FSRS CONSTANTS
──────────────────────────────────────────────────────────────── */

// COGNITIVE-079: FSRS v4 algorithm constants from memory research
const FSRS_FACTOR = 19 / 81;  // ~0.235
const FSRS_DECAY = -0.5;

const DEFAULT_STABILITY = 1.0;   // 1 day until 90% retrievability
const DEFAULT_DIFFICULTY = 5.0;  // Medium difficulty (1-10 scale)
const TARGET_RETRIEVABILITY = 0.9;

// COGNITIVE-079: Stability multipliers (empirically derived from FSRS research)
const STABILITY_MULTIPLIERS = {
  again: 0.5,
  hard: 0.8,
  good: 1.5,
  easy: 2.0,
};

const DIFFICULTY_STEP = 0.5;

// Grade scale (1-4)
const GRADE_AGAIN = 1;
const GRADE_HARD = 2;
const GRADE_GOOD = 3;
const GRADE_EASY = 4;

/* ─────────────────────────────────────────────────────────────
   2. CORE FSRS FUNCTIONS
──────────────────────────────────────────────────────────────── */

/** Calculate retrievability using FSRS v4 power-law: R(t, S) = (1 + factor * t/S)^decay */
function calculate_retrievability(stability, elapsed_days) {
  if (typeof stability !== 'number' || stability <= 0 || !isFinite(stability)) {
    stability = DEFAULT_STABILITY;
  }
  if (typeof elapsed_days !== 'number' || elapsed_days < 0 || !isFinite(elapsed_days)) {
    elapsed_days = 0;
  }
  if (elapsed_days === 0) {
    return 1.0;
  }

  const retrievability = Math.pow(
    1 + FSRS_FACTOR * (elapsed_days / stability),
    FSRS_DECAY
  );

  return Math.max(0, Math.min(1, retrievability));
}

/** Update stability after review based on grade and current state */
function update_stability(current_stability, difficulty, retrievability, grade) {
  if (typeof current_stability !== 'number' || current_stability <= 0 || !isFinite(current_stability)) {
    current_stability = DEFAULT_STABILITY;
  }
  if (typeof difficulty !== 'number' || difficulty < 1 || difficulty > 10 || !isFinite(difficulty)) {
    difficulty = DEFAULT_DIFFICULTY;
  }
  if (typeof retrievability !== 'number' || retrievability < 0 || retrievability > 1 || !isFinite(retrievability)) {
    retrievability = 0.5;
  }
  if (typeof grade !== 'number' || grade < GRADE_AGAIN || grade > GRADE_EASY || !Number.isInteger(grade)) {
    grade = GRADE_GOOD;
  }

  let multiplier;
  switch (grade) {
    case GRADE_AGAIN:
      multiplier = STABILITY_MULTIPLIERS.again;
      break;
    case GRADE_HARD:
      multiplier = STABILITY_MULTIPLIERS.hard;
      break;
    case GRADE_GOOD:
      multiplier = STABILITY_MULTIPLIERS.good;
      break;
    case GRADE_EASY:
      multiplier = STABILITY_MULTIPLIERS.easy;
      break;
    default:
      multiplier = STABILITY_MULTIPLIERS.good;
  }

  // COGNITIVE-079: Difficulty factor - harder items grow slower
  const difficulty_factor = 1.3 - (difficulty / 10) * 0.5;

  // COGNITIVE-079: Desirable difficulty - low R = greater boost on success
  let retrievability_factor;
  if (grade >= GRADE_GOOD) {
    retrievability_factor = 1 + (1 - retrievability) * 0.5;
  } else {
    retrievability_factor = 0.8 + retrievability * 0.2;
  }

  let new_stability = current_stability * multiplier * difficulty_factor * retrievability_factor;

  // Clamp to [0.1, 365] days
  new_stability = Math.max(0.1, new_stability);
  new_stability = Math.min(365, new_stability);

  return new_stability;
}

/** Calculate optimal interval until next review based on target retrievability */
function calculate_optimal_interval(stability, target_retrievability) {
  if (typeof stability !== 'number' || stability <= 0 || !isFinite(stability)) {
    stability = DEFAULT_STABILITY;
  }
  if (typeof target_retrievability !== 'number' ||
      target_retrievability <= 0 ||
      target_retrievability >= 1 ||
      !isFinite(target_retrievability)) {
    target_retrievability = TARGET_RETRIEVABILITY;
  }

  // COGNITIVE-079: Solve for t from R = (1 + factor * t/S)^decay
  const exponent = 1 / FSRS_DECAY;
  const inner = Math.pow(target_retrievability, exponent) - 1;
  const interval = stability * (inner / FSRS_FACTOR);

  return Math.max(0.1, Math.min(365, interval));
}

/** Update difficulty based on review grade */
function update_difficulty(current_difficulty, grade) {
  if (typeof current_difficulty !== 'number' ||
      current_difficulty < 1 ||
      current_difficulty > 10 ||
      !isFinite(current_difficulty)) {
    current_difficulty = DEFAULT_DIFFICULTY;
  }
  if (typeof grade !== 'number' || grade < GRADE_AGAIN || grade > GRADE_EASY || !Number.isInteger(grade)) {
    grade = GRADE_GOOD;
  }

  let adjustment;
  switch (grade) {
    case GRADE_AGAIN:
      adjustment = 2 * DIFFICULTY_STEP;
      break;
    case GRADE_HARD:
      adjustment = 1 * DIFFICULTY_STEP;
      break;
    case GRADE_GOOD:
      adjustment = 0;
      break;
    case GRADE_EASY:
      adjustment = -1 * DIFFICULTY_STEP;
      break;
    default:
      adjustment = 0;
  }

  let new_difficulty = current_difficulty + adjustment;
  new_difficulty = Math.max(1, Math.min(10, new_difficulty));

  return new_difficulty;
}

/* ─────────────────────────────────────────────────────────────
   3. HELPER FUNCTIONS
──────────────────────────────────────────────────────────────── */

/** Calculate days elapsed since a given date */
function calculate_elapsed_days(last_review_date) {
  if (!last_review_date) {
    return 0;
  }

  let last_review;
  if (last_review_date instanceof Date) {
    last_review = last_review_date;
  } else if (typeof last_review_date === 'string') {
    last_review = new Date(last_review_date);
  } else {
    return 0;
  }

  if (isNaN(last_review.getTime())) {
    return 0;
  }

  const now = new Date();
  const elapsed_ms = now.getTime() - last_review.getTime();
  const elapsed_days = elapsed_ms / (1000 * 60 * 60 * 24);

  return Math.max(0, elapsed_days);
}

/** Get next review date based on optimal interval */
function get_next_review_date(stability, target_retrievability) {
  const interval = calculate_optimal_interval(stability, target_retrievability);
  const next_review = new Date();
  next_review.setTime(next_review.getTime() + interval * 24 * 60 * 60 * 1000);
  return next_review;
}

/** Create initial FSRS parameters for a new memory */
function create_initial_params(options = {}) {
  return {
    stability: options.stability || DEFAULT_STABILITY,
    difficulty: options.difficulty || DEFAULT_DIFFICULTY,
    last_review: new Date().toISOString(),
    review_count: 0,
    retrievability: 1.0,
  };
}

/* ─────────────────────────────────────────────────────────────
   4. MODULE EXPORTS
──────────────────────────────────────────────────────────────── */

const FSRS_CONSTANTS = {
  FSRS_FACTOR,
  FSRS_DECAY,
  DEFAULT_STABILITY,
  DEFAULT_DIFFICULTY,
  TARGET_RETRIEVABILITY,
  STABILITY_MULTIPLIERS,
  DIFFICULTY_STEP,
  GRADE_AGAIN,
  GRADE_HARD,
  GRADE_GOOD,
  GRADE_EASY,
};

module.exports = {
  calculate_retrievability,
  update_stability,
  calculate_optimal_interval,
  update_difficulty,
  calculate_elapsed_days,
  get_next_review_date,
  create_initial_params,
  FSRS_CONSTANTS,
  FSRS_FACTOR,
  FSRS_DECAY,
  DEFAULT_STABILITY,
  DEFAULT_DIFFICULTY,
  TARGET_RETRIEVABILITY,
  STABILITY_MULTIPLIERS,
  DIFFICULTY_STEP,
  GRADE_AGAIN,
  GRADE_HARD,
  GRADE_GOOD,
  GRADE_EASY,
};
