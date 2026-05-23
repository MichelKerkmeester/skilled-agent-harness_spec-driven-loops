// MODULE: Council Cost Guards
'use strict';

const DEFAULT_COUNCIL_COST_GUARDS = Object.freeze({
  max_rounds_per_topic: 3,
  max_topics_per_session: 5,
  saturation_threshold: 0.2,
  seats_per_round: 3,
});

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

function normalizeCostGuards(input = {}) {
  const guards = {
    ...DEFAULT_COUNCIL_COST_GUARDS,
    ...(input || {}),
  };
  for (const key of ['max_rounds_per_topic', 'max_topics_per_session', 'seats_per_round']) {
    if (!isPositiveInteger(guards[key])) {
      throw new RangeError(`${key} must be a positive integer`);
    }
  }
  if (typeof guards.saturation_threshold !== 'number' || guards.saturation_threshold < 0 || guards.saturation_threshold > 1) {
    throw new RangeError('saturation_threshold must be a number between 0 and 1');
  }
  return guards;
}

function computeCouncilCostUpperBound(input = {}) {
  const guards = normalizeCostGuards(input);
  return {
    ...guards,
    max_rounds: guards.max_topics_per_session * guards.max_rounds_per_topic,
    max_seat_outputs: guards.max_topics_per_session * guards.max_rounds_per_topic * guards.seats_per_round,
  };
}

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

module.exports = {
  DEFAULT_COUNCIL_COST_GUARDS,
  computeCouncilCostUpperBound,
  evaluateCouncilCostGuards,
  normalizeCostGuards,
};
