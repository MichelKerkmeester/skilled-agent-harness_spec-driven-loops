/**
 * Confidence Tracker Module
 *
 * Tracks validation feedback for memories and manages confidence scores.
 * Enables automatic promotion to constitutional tier for highly validated memories.
 *
 * Confidence Formula:
 * - Base confidence: 0.5
 * - Each positive validation: +0.1 (capped at 1.0)
 * - Each negative validation: -0.05 (minimum 0.0)
 *
 * Promotion Eligibility:
 * - confidence >= 0.9
 * - validation_count >= 5
 *
 * @module confidence-tracker
 * @version 1.0.0
 */

'use strict';

// ───────────────────────────────────────────────────────────────
// CONSTANTS
// ───────────────────────────────────────────────────────────────

const CONFIDENCE_BASE = 0.5;
const CONFIDENCE_POSITIVE_INCREMENT = 0.1;
const CONFIDENCE_NEGATIVE_DECREMENT = 0.05;
const CONFIDENCE_MAX = 1.0;
const CONFIDENCE_MIN = 0.0;

const PROMOTION_CONFIDENCE_THRESHOLD = 0.9;
const PROMOTION_VALIDATION_THRESHOLD = 5;

// ───────────────────────────────────────────────────────────────
// CORE FUNCTIONS
// ───────────────────────────────────────────────────────────────

/**
 * Record a validation event for a memory
 * Updates confidence score and validation count
 *
 * @param {Object} db - better-sqlite3 database instance
 * @param {number} memoryId - ID of the memory to validate
 * @param {boolean} wasUseful - Whether the memory was useful (true) or not (false)
 * @returns {Object} Updated confidence info { confidence, validationCount, promotionEligible }
 * @throws {Error} If memory not found
 */
function recordValidation(db, memoryId, wasUseful) {
  // Get current state
  const memory = db.prepare(`
    SELECT confidence, validation_count FROM memory_index WHERE id = ?
  `).get(memoryId);

  if (!memory) {
    throw new Error(`Memory not found: ${memoryId}`);
  }

  // Calculate new confidence
  let currentConfidence = memory.confidence ?? CONFIDENCE_BASE;
  let newConfidence;

  if (wasUseful) {
    // Positive validation: +0.1, capped at 1.0
    newConfidence = Math.min(currentConfidence + CONFIDENCE_POSITIVE_INCREMENT, CONFIDENCE_MAX);
  } else {
    // Negative validation: -0.05, minimum 0.0
    newConfidence = Math.max(currentConfidence - CONFIDENCE_NEGATIVE_DECREMENT, CONFIDENCE_MIN);
  }

  // Increment validation count
  const newValidationCount = (memory.validation_count ?? 0) + 1;

  // Update database
  db.prepare(`
    UPDATE memory_index
    SET confidence = ?, validation_count = ?, updated_at = ?
    WHERE id = ?
  `).run(newConfidence, newValidationCount, new Date().toISOString(), memoryId);

  // Check promotion eligibility
  const promotionEligible = checkPromotionEligible(db, memoryId);

  return {
    confidence: newConfidence,
    validationCount: newValidationCount,
    promotionEligible
  };
}

/**
 * Get current confidence score for a memory
 *
 * @param {Object} db - better-sqlite3 database instance
 * @param {number} memoryId - ID of the memory
 * @returns {number} Current confidence score (0.0 - 1.0)
 * @throws {Error} If memory not found
 */
function getConfidenceScore(db, memoryId) {
  const memory = db.prepare(`
    SELECT confidence FROM memory_index WHERE id = ?
  `).get(memoryId);

  if (!memory) {
    throw new Error(`Memory not found: ${memoryId}`);
  }

  return memory.confidence ?? CONFIDENCE_BASE;
}

/**
 * Check if a memory is eligible for promotion to constitutional tier
 *
 * @param {Object} db - better-sqlite3 database instance
 * @param {number} memoryId - ID of the memory
 * @returns {boolean} True if eligible for promotion
 */
function checkPromotionEligible(db, memoryId) {
  const memory = db.prepare(`
    SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
  `).get(memoryId);

  if (!memory) {
    return false;
  }

  // Already constitutional
  if (memory.importance_tier === 'constitutional') {
    return false;
  }

  const confidence = memory.confidence ?? CONFIDENCE_BASE;
  const validationCount = memory.validation_count ?? 0;

  return confidence >= PROMOTION_CONFIDENCE_THRESHOLD &&
         validationCount >= PROMOTION_VALIDATION_THRESHOLD;
}

/**
 * Promote a memory to constitutional tier
 *
 * @param {Object} db - better-sqlite3 database instance
 * @param {number} memoryId - ID of the memory to promote
 * @returns {boolean} True if promotion was successful
 * @throws {Error} If memory not found or not eligible
 */
function promoteToConstitutional(db, memoryId) {
  // Verify eligibility
  if (!checkPromotionEligible(db, memoryId)) {
    const memory = db.prepare(`
      SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
    `).get(memoryId);

    if (!memory) {
      throw new Error(`Memory not found: ${memoryId}`);
    }

    if (memory.importance_tier === 'constitutional') {
      return false; // Already constitutional
    }

    throw new Error(
      `Memory ${memoryId} not eligible for promotion. ` +
      `Requires confidence >= ${PROMOTION_CONFIDENCE_THRESHOLD} (current: ${memory.confidence ?? CONFIDENCE_BASE}) ` +
      `and validation_count >= ${PROMOTION_VALIDATION_THRESHOLD} (current: ${memory.validation_count ?? 0})`
    );
  }

  // Promote to constitutional tier (highest tier for validated memories)
  db.prepare(`
    UPDATE memory_index
    SET importance_tier = 'constitutional', updated_at = ?
    WHERE id = ?
  `).run(new Date().toISOString(), memoryId);

  console.warn(`[confidence-tracker] Memory ${memoryId} promoted to constitutional tier`);

  return true;
}

/**
 * Get full confidence info for a memory
 *
 * @param {Object} db - better-sqlite3 database instance
 * @param {number} memoryId - ID of the memory
 * @returns {Object} Full confidence info
 */
function getConfidenceInfo(db, memoryId) {
  const memory = db.prepare(`
    SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
  `).get(memoryId);

  if (!memory) {
    throw new Error(`Memory not found: ${memoryId}`);
  }

  const confidence = memory.confidence ?? CONFIDENCE_BASE;
  const validationCount = memory.validation_count ?? 0;

  return {
    memoryId,
    confidence,
    validationCount,
    importanceTier: memory.importance_tier,
    promotionEligible: checkPromotionEligible(db, memoryId),
    promotionProgress: {
      confidenceRequired: PROMOTION_CONFIDENCE_THRESHOLD,
      validationsRequired: PROMOTION_VALIDATION_THRESHOLD,
      confidenceMet: confidence >= PROMOTION_CONFIDENCE_THRESHOLD,
      validationsMet: validationCount >= PROMOTION_VALIDATION_THRESHOLD
    }
  };
}

// ───────────────────────────────────────────────────────────────
// MODULE EXPORTS
// ───────────────────────────────────────────────────────────────

module.exports = {
  // Core functions
  recordValidation,
  getConfidenceScore,
  checkPromotionEligible,
  promoteToConstitutional,
  getConfidenceInfo,

  // Constants (for testing/reference)
  CONFIDENCE_BASE,
  CONFIDENCE_POSITIVE_INCREMENT,
  CONFIDENCE_NEGATIVE_DECREMENT,
  CONFIDENCE_MAX,
  CONFIDENCE_MIN,
  PROMOTION_CONFIDENCE_THRESHOLD,
  PROMOTION_VALIDATION_THRESHOLD
};
