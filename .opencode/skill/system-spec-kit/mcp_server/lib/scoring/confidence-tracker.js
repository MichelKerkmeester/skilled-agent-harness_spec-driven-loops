// ───────────────────────────────────────────────────────────────
// SCORING: CONFIDENCE TRACKER
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. CONSTANTS
──────────────────────────────────────────────────────────────── */

const CONFIDENCE_BASE = 0.5;
const CONFIDENCE_POSITIVE_INCREMENT = 0.1;
const CONFIDENCE_NEGATIVE_DECREMENT = 0.05;
const CONFIDENCE_MAX = 1.0;
const CONFIDENCE_MIN = 0.0;

const PROMOTION_CONFIDENCE_THRESHOLD = 0.9;
const PROMOTION_VALIDATION_THRESHOLD = 5;

/* ─────────────────────────────────────────────────────────────
   2. CORE FUNCTIONS
──────────────────────────────────────────────────────────────── */

/**
 * Record a validation event for a memory
 * Updates confidence score and validation count
 *
 * @param {Object} db - better-sqlite3 database instance
 * @param {number} memory_id - ID of the memory to validate
 * @param {boolean} was_useful - Whether the memory was useful (true) or not (false)
 * @returns {Object} Updated confidence info { confidence, validationCount, promotionEligible }
 * @throws {Error} If memory not found
 */
function record_validation(db, memory_id, was_useful) {
  // Wrap entire read-modify-write operation in transaction for atomicity
  // Prevents race conditions under concurrent access
  return db.transaction(() => {
    // Get current state
    const memory = db.prepare(`
      SELECT confidence, validation_count FROM memory_index WHERE id = ?
    `).get(memory_id);

    if (!memory) {
      throw new Error(`Memory not found: ${memory_id}`);
    }

    // Calculate new confidence
    let current_confidence = memory.confidence ?? CONFIDENCE_BASE;
    let new_confidence;

    if (was_useful) {
      // Positive validation: +0.1, capped at 1.0
      new_confidence = Math.min(current_confidence + CONFIDENCE_POSITIVE_INCREMENT, CONFIDENCE_MAX);
    } else {
      // Negative validation: -0.05, minimum 0.0
      new_confidence = Math.max(current_confidence - CONFIDENCE_NEGATIVE_DECREMENT, CONFIDENCE_MIN);
    }

    // Increment validation count
    const new_validation_count = (memory.validation_count ?? 0) + 1;

    // Update database
    db.prepare(`
      UPDATE memory_index
      SET confidence = ?, validation_count = ?, updated_at = ?
      WHERE id = ?
    `).run(new_confidence, new_validation_count, new Date().toISOString(), memory_id);

    // Check promotion eligibility and auto-promote if eligible
    const promotion_eligible = check_promotion_eligible(db, memory_id);
    let was_promoted = false;

    if (promotion_eligible) {
      was_promoted = promote_to_critical(db, memory_id);
    }

    return {
      confidence: new_confidence,
      validationCount: new_validation_count,
      promotionEligible: promotion_eligible,
      wasPromoted: was_promoted,
    };
  })();
}

/**
 * Get current confidence score for a memory
 *
 * @param {Object} db - better-sqlite3 database instance
 * @param {number} memory_id - ID of the memory
 * @returns {number} Current confidence score (0.0 - 1.0)
 * @throws {Error} If memory not found
 */
function get_confidence_score(db, memory_id) {
  const memory = db.prepare(`
    SELECT confidence FROM memory_index WHERE id = ?
  `).get(memory_id);

  if (!memory) {
    throw new Error(`Memory not found: ${memory_id}`);
  }

  return memory.confidence ?? CONFIDENCE_BASE;
}

/**
 * Check if a memory is eligible for promotion to critical tier
 *
 * @param {Object} db - better-sqlite3 database instance
 * @param {number} memory_id - ID of the memory
 * @returns {boolean} True if eligible for promotion
 */
function check_promotion_eligible(db, memory_id) {
  const memory = db.prepare(`
    SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
  `).get(memory_id);

  if (!memory) {
    return false;
  }

  // Already critical or constitutional (both are top tiers)
  if (memory.importance_tier === 'critical' || memory.importance_tier === 'constitutional') {
    return false;
  }

  const confidence = memory.confidence ?? CONFIDENCE_BASE;
  const validation_count = memory.validation_count ?? 0;

  return confidence >= PROMOTION_CONFIDENCE_THRESHOLD &&
         validation_count >= PROMOTION_VALIDATION_THRESHOLD;
}

/**
 * Promote a memory to critical tier
 *
 * @param {Object} db - better-sqlite3 database instance
 * @param {number} memory_id - ID of the memory to promote
 * @returns {boolean} True if promotion was successful
 * @throws {Error} If memory not found or not eligible
 */
function promote_to_critical(db, memory_id) {
  // Verify eligibility
  if (!check_promotion_eligible(db, memory_id)) {
    const memory = db.prepare(`
      SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
    `).get(memory_id);

    if (!memory) {
      throw new Error(`Memory not found: ${memory_id}`);
    }

    if (memory.importance_tier === 'critical' || memory.importance_tier === 'constitutional') {
      return false; // Already at top tier
    }

    throw new Error(
      `Memory ${memory_id} not eligible for promotion. ` +
      `Requires confidence >= ${PROMOTION_CONFIDENCE_THRESHOLD} (current: ${memory.confidence ?? CONFIDENCE_BASE}) ` +
      `and validation_count >= ${PROMOTION_VALIDATION_THRESHOLD} (current: ${memory.validation_count ?? 0})`
    );
  }

  // Promote to critical tier (highest tier for validated memories)
  db.prepare(`
    UPDATE memory_index
    SET importance_tier = 'critical', updated_at = ?
    WHERE id = ?
  `).run(new Date().toISOString(), memory_id);

  console.warn(`[confidence-tracker] Memory ${memory_id} promoted to critical tier`);

  return true;
}

/**
 * Get full confidence info for a memory
 *
 * @param {Object} db - better-sqlite3 database instance
 * @param {number} memory_id - ID of the memory
 * @returns {Object} Full confidence info
 */
function get_confidence_info(db, memory_id) {
  const memory = db.prepare(`
    SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
  `).get(memory_id);

  if (!memory) {
    throw new Error(`Memory not found: ${memory_id}`);
  }

  const confidence = memory.confidence ?? CONFIDENCE_BASE;
  const validation_count = memory.validation_count ?? 0;

  return {
    memoryId: memory_id,
    confidence,
    validationCount: validation_count,
    importanceTier: memory.importance_tier,
    promotionEligible: check_promotion_eligible(db, memory_id),
    promotionProgress: {
      confidenceRequired: PROMOTION_CONFIDENCE_THRESHOLD,
      validationsRequired: PROMOTION_VALIDATION_THRESHOLD,
      confidenceMet: confidence >= PROMOTION_CONFIDENCE_THRESHOLD,
      validationsMet: validation_count >= PROMOTION_VALIDATION_THRESHOLD,
    },
  };
}

/* ─────────────────────────────────────────────────────────────
   3. MODULE EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Core functions
  record_validation,
  get_confidence_score,
  check_promotion_eligible,
  promote_to_critical,
  get_confidence_info,

  // Constants (for testing/reference)
  CONFIDENCE_BASE,
  CONFIDENCE_POSITIVE_INCREMENT,
  CONFIDENCE_NEGATIVE_DECREMENT,
  CONFIDENCE_MAX,
  CONFIDENCE_MIN,
  PROMOTION_CONFIDENCE_THRESHOLD,
  PROMOTION_VALIDATION_THRESHOLD,
};
