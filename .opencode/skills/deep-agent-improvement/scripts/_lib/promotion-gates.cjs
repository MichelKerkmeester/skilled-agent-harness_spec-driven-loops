// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Promotion Gate Constants                                                ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const WEIGHTED_SCORE_GATE = 70;

const PROMOTION_GATES = Object.freeze({
  structural: 80,
  ruleCoherence: 85,
  integration: 90,
  outputQuality: 75,
  systemFitness: 80,
});

const BENCHMARK_AGGREGATE_GATE = 85;

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

module.exports = {
  WEIGHTED_SCORE_GATE,
  PROMOTION_GATES,
  BENCHMARK_AGGREGATE_GATE,
  evaluatePromotionGates,
};
