// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ promotion-gates — promotion gate thresholds and gate evaluation         ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const WEIGHTED_SCORE_GATE = 70;

const PROMOTION_GATES = Object.freeze({
  structural: 80,
  ruleCoherence: 85,
  integration: 90,
  outputQuality: 75,
  systemFitness: 80,
});

const BENCHMARK_AGGREGATE_GATE = 85;

const MIRROR_SYNC_STATES = Object.freeze({
  allLanded: 'all_landed',
  verificationFailed: 'verification_failed',
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evaluate scored dimensions against the per-dimension promotion thresholds.
 *
 * @param {Array<Object>} dimensions - Dimensions with name and score fields.
 * @returns {Object} Result with passed flag, thresholds, per-name results, failed, unscored.
 */
function evaluatePromotionGates(dimensions) {
  const byName = new Map((dimensions || []).map((dimension) => [dimension.name, dimension]));
  const results = {};
  const failed = [];
  const unscored = [];

  for (const [name, minimumScore] of Object.entries(PROMOTION_GATES)) {
    const dimension = byName.get(name);
    const score = dimension ? dimension.score : null;
    const passed = typeof score === 'number' && Number.isFinite(score) && score >= minimumScore;
    results[name] = {
      score,
      minimumScore,
      passed,
    };
    if (score === null || score === undefined) {
      unscored.push(name);
    } else if (!passed) {
      failed.push(name);
    }
  }

  return {
    passed: failed.length === 0 && unscored.length === 0,
    thresholds: PROMOTION_GATES,
    results,
    failed,
    unscored,
  };
}

/**
 * Build the partial mirror-sync state label from the landed runtimes.
 *
 * @param {Array<string>} presentRuntimes - Runtimes whose mirrors landed.
 * @returns {string} A `partial:<runtimes>` label, or the verification-failed state.
 */
function buildPartialMirrorSyncState(presentRuntimes) {
  const landed = [...new Set(presentRuntimes || [])].sort();
  return landed.length > 0 ? `partial:${landed.join(',')}` : MIRROR_SYNC_STATES.verificationFailed;
}

/**
 * Evaluate the mirror-sync gate from a verifyMirrorSync result.
 *
 * @param {Object} syncResult - Result object from the mirror-sync verifier.
 * @returns {Object} Gate outcome with passed, mirror_sync_state, recoveryAction, result.
 */
function evaluateMirrorSyncGate(syncResult) {
  if (syncResult?.allInSync) {
    return {
      passed: true,
      mirror_sync_state: MIRROR_SYNC_STATES.allLanded,
      recoveryAction: null,
      result: syncResult,
    };
  }

  return {
    passed: false,
    mirror_sync_state: buildPartialMirrorSyncState(syncResult?.presentRuntimes || []),
    recoveryAction: 'rollback_partial_mirrors',
    result: syncResult || null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  WEIGHTED_SCORE_GATE,
  PROMOTION_GATES,
  BENCHMARK_AGGREGATE_GATE,
  MIRROR_SYNC_STATES,
  buildPartialMirrorSyncState,
  evaluateMirrorSyncGate,
  evaluatePromotionGates,
};
