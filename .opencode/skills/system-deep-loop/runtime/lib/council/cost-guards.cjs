// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Council Cost Guards                                                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_COUNCIL_COST_GUARDS = Object.freeze({
  max_rounds_per_topic: 3,
  max_topics_per_session: 5,
  saturation_threshold: 0.2,
  seats_per_round: 3,
  max_concurrent_seats: 3,
  lag_ceiling: 5000,
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

function isNonNegativeFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate and merge user-provided cost guards with sensible defaults.
 *
 * Ensures max_rounds_per_topic, max_topics_per_session, and
 * seats_per_round are all positive integers, and saturation_threshold
 * is a number between 0 and 1, and lag_ceiling is a non-negative
 * millisecond threshold.
 *
 * @param {Object} [input={}] - Partial cost guards overrides.
 * @param {number} [input.max_rounds_per_topic=3] - Maximum deliberation
 *   rounds per topic.
 * @param {number} [input.max_topics_per_session=5] - Maximum topics per
 *   council session.
 * @param {number} [input.seats_per_round=3] - Number of AI seats per
 *   deliberation round.
 * @param {number} [input.saturation_threshold=0.2] - Verdict delta
 *   threshold for declaring saturation.
 * @param {number} [input.lag_ceiling=5000] - Oldest pending lineage lag
 *   threshold in milliseconds; 0 disables the tripwire.
 * @returns {Object} Fully populated cost guards record.
 * @throws {RangeError} If any guard value is outside its allowed range.
 */
function normalizeCostGuards(input = {}) {
  const guards = {
    ...DEFAULT_COUNCIL_COST_GUARDS,
    ...(input || {}),
  };
  for (const key of ['max_rounds_per_topic', 'max_topics_per_session', 'seats_per_round', 'max_concurrent_seats']) {
    if (!isPositiveInteger(guards[key])) {
      throw new RangeError(`${key} must be a positive integer`);
    }
  }
  if (typeof guards.saturation_threshold !== 'number' || guards.saturation_threshold < 0 || guards.saturation_threshold > 1) {
    throw new RangeError('saturation_threshold must be a number between 0 and 1');
  }
  if (!isNonNegativeFiniteNumber(guards.lag_ceiling)) {
    throw new RangeError('lag_ceiling must be a non-negative number');
  }
  return guards;
}

/**
 * Compute the theoretical upper bound for a council session from cost
 * guards.
 *
 * Derives max_rounds (topics × rounds-per-topic) and max_seat_outputs
 * (topics × rounds × seats) so callers can pre-validate budgets without
 * running the full session.
 *
 * @param {Object} [input={}] - Partial cost guards forwarded to
 *   normalizeCostGuards.
 * @returns {Object} Cost guards augmented with max_rounds and
 *   max_seat_outputs.
 * @throws {RangeError} If any guard value is invalid.
 */
function computeCouncilCostUpperBound(input = {}) {
  const guards = normalizeCostGuards(input);
  return {
    ...guards,
    max_rounds: guards.max_topics_per_session * guards.max_rounds_per_topic,
    max_seat_outputs: guards.max_topics_per_session * guards.max_rounds_per_topic * guards.seats_per_round,
  };
}

/**
 * Evaluate whether a council session should continue or stop based on
 * cost guard limits and stability signals.
 *
 * Checks topic count, round count, verdict delta against the saturation
 * threshold, and consecutive stable round count. Returns a
 * continue_allowed flag and a list of triggered stop reasons.
 *
 * @param {Object} [input={}] - Session progress snapshot.
 * @param {Object} [input.guards] - Cost guards overrides (or pass keys
 *   directly at the top level).
 * @param {number} [input.topicNumber] - Current topic index (1-based).
 * @param {number} [input.currentTopic] - Alias for topicNumber.
 * @param {number} [input.roundNumber] - Current round index (1-based).
 * @param {number} [input.currentRound] - Alias for roundNumber.
 * @param {number} [input.verdictDelta] - Latest pairwise verdict delta.
 * @param {number} [input.consecutiveStableRounds] - Count of consecutive
 *   stable rounds so far.
 * @returns {Object} Assessment with continue_allowed, stop_reasons
 *   (string array), and an upper_bound pre-computation.
 * @throws {RangeError} If guard values are invalid.
 */
function evaluateCouncilCostGuards(input = {}) {
  const guards = normalizeCostGuards(input.guards || input);
  const topicNumber = Number(input.topicNumber || input.currentTopic || 1);
  const roundNumber = Number(input.roundNumber || input.currentRound || 1);
  const verdictDelta = typeof input.verdictDelta === 'number' ? input.verdictDelta : null;
  const consecutiveStableRounds = Number(input.consecutiveStableRounds || 0);
  const reasons = [];

  if (topicNumber > guards.max_topics_per_session) {
    reasons.push('max_topics_per_session');
  }
  if (roundNumber >= guards.max_rounds_per_topic) {
    reasons.push('max_rounds_per_topic');
  }
  if (verdictDelta !== null && verdictDelta <= guards.saturation_threshold) {
    reasons.push('saturation_threshold');
  }
  if (consecutiveStableRounds >= 2) {
    reasons.push('two_consecutive_stable_rounds');
  }

  return {
    continue_allowed: reasons.length === 0,
    stop_reasons: reasons,
    upper_bound: computeCouncilCostUpperBound(guards),
  };
}

/**
 * Evaluate the oldest-pending lineage lag against the configured tripwire.
 *
 * This is intentionally separate from evaluateCouncilCostGuards so the
 * existing advisory return shape stays unchanged and fan-out callers can emit
 * a warning without converting the council guard tuple into a lifecycle hook.
 *
 * @param {Object} [input={}] - Lag snapshot and optional guard overrides.
 * @param {number} [input.oldestPendingLagMs] - Oldest pending age in ms.
 * @param {number} [input.lagMs] - Alias for oldestPendingLagMs.
 * @param {Object} [input.guards] - Cost guards overrides.
 * @returns {Object} Warning-tier tripwire assessment.
 * @throws {RangeError} If guard values are invalid.
 */
function evaluateLagCeilingTripwire(input = {}) {
  const guards = normalizeCostGuards(input.guards || input);
  const rawLag = input.oldestPendingLagMs ?? input.lagMs ?? 0;
  const oldestPendingLagMs = Number(rawLag);
  if (!Number.isFinite(oldestPendingLagMs) || oldestPendingLagMs < 0) {
    throw new RangeError('oldestPendingLagMs must be a non-negative number');
  }
  const exceeded = guards.lag_ceiling > 0 && oldestPendingLagMs >= guards.lag_ceiling;
  return {
    exceeded,
    severity: exceeded ? 'warning' : null,
    reason: exceeded ? 'lag_ceiling' : null,
    oldest_pending_lag_ms: oldestPendingLagMs,
    lag_ceiling_ms: guards.lag_ceiling,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  DEFAULT_COUNCIL_COST_GUARDS,
  computeCouncilCostUpperBound,
  evaluateCouncilCostGuards,
  evaluateLagCeilingTripwire,
  normalizeCostGuards,
};
