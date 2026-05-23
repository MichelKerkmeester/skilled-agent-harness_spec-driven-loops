// MODULE: Council Adjudicator Verdict Scoring
'use strict';

const DEFAULT_SATURATION_THRESHOLD = 0.2;
const DEFAULT_WEIGHTS = Object.freeze({
  option_changed: 0.35,
  confidence_delta: 0.20,
  risk_jaccard_delta: 0.20,
  axis_flip_rate: 0.15,
  blocking_delta: 0.10,
});

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeStringSet(values) {
  if (!Array.isArray(values)) return new Set();
  return new Set(values.map((value) => String(value).trim().toLowerCase()).filter(Boolean));
}

function jaccardDelta(previousValues, currentValues) {
  const previous = normalizeStringSet(previousValues);
  const current = normalizeStringSet(currentValues);
  const union = new Set([...previous, ...current]);
  if (union.size === 0) return 0;
  let intersection = 0;
  for (const value of previous) {
    if (current.has(value)) intersection += 1;
  }
  return 1 - (intersection / union.size);
}

function normalizeConfidence(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
  if (value > 1) return Math.max(0, Math.min(100, value)) / 100;
  return Math.max(0, Math.min(1, value));
}

function normalizeDecisionAxes(value) {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    Object.entries(value).map(([key, axisValue]) => [key, String(axisValue).trim().toLowerCase()]),
  );
}

function axisFlipRate(previousAxes, currentAxes) {
  const previous = normalizeDecisionAxes(previousAxes);
  const current = normalizeDecisionAxes(currentAxes);
  const keys = new Set([...Object.keys(previous), ...Object.keys(current)]);
  if (keys.size === 0) return 0;
  let changed = 0;
  for (const key of keys) {
    if ((previous[key] || '') !== (current[key] || '')) {
      changed += 1;
    }
  }
  return changed / keys.size;
}

function blockingDelta(previousBlockers, currentBlockers) {
  const previousCount = Array.isArray(previousBlockers) ? previousBlockers.length : 0;
  const currentCount = Array.isArray(currentBlockers) ? currentBlockers.length : 0;
  return Math.abs(previousCount - currentCount) / Math.max(1, previousCount, currentCount);
}

function normalizeVerdict(verdict, label) {
  if (!isRecord(verdict)) {
    throw new TypeError(`${label} verdict must be an object`);
  }
  return {
    recommended_option: typeof verdict.recommended_option === 'string' ? verdict.recommended_option : '',
    confidence: normalizeConfidence(verdict.confidence),
    blocking_disagreements: Array.isArray(verdict.blocking_disagreements) ? verdict.blocking_disagreements : [],
    material_risks: Array.isArray(verdict.material_risks) ? verdict.material_risks : [],
    decision_axes: normalizeDecisionAxes(verdict.decision_axes),
  };
}

function scoreVerdictDelta(previousVerdict, currentVerdict, options = {}) {
  const previous = normalizeVerdict(previousVerdict, 'previous');
  const current = normalizeVerdict(currentVerdict, 'current');
  const weights = { ...DEFAULT_WEIGHTS, ...(isRecord(options.weights) ? options.weights : {}) };
  const saturationThreshold = typeof options.saturationThreshold === 'number'
    ? options.saturationThreshold
    : DEFAULT_SATURATION_THRESHOLD;

  const components = {
    option_changed: previous.recommended_option === current.recommended_option ? 0 : 1,
    confidence_delta: Math.abs(previous.confidence - current.confidence),
    risk_jaccard_delta: jaccardDelta(previous.material_risks, current.material_risks),
    axis_flip_rate: axisFlipRate(previous.decision_axes, current.decision_axes),
    blocking_delta: blockingDelta(previous.blocking_disagreements, current.blocking_disagreements),
  };

  const verdictDelta = Object.entries(components).reduce((sum, [key, value]) => {
    const weight = typeof weights[key] === 'number' ? weights[key] : 0;
    return sum + (weight * value);
  }, 0);

  return {
    verdict_delta: Number(verdictDelta.toFixed(6)),
    stable: verdictDelta <= saturationThreshold,
    saturation_threshold: saturationThreshold,
    components,
    weights,
  };
}

function scoreVerdictProgression(verdicts, options = {}) {
  if (!Array.isArray(verdicts) || verdicts.length < 2) {
    return { deltas: [], consecutive_stable_rounds: 0, stable: false };
  }
  const deltas = [];
  let consecutiveStableRounds = 0;
  for (let index = 1; index < verdicts.length; index += 1) {
    const delta = scoreVerdictDelta(verdicts[index - 1], verdicts[index], options);
    deltas.push(delta);
    consecutiveStableRounds = delta.stable ? consecutiveStableRounds + 1 : 0;
  }
  return {
    deltas,
    consecutive_stable_rounds: consecutiveStableRounds,
    stable: consecutiveStableRounds >= 2,
  };
}

module.exports = {
  DEFAULT_SATURATION_THRESHOLD,
  DEFAULT_WEIGHTS,
  scoreVerdictDelta,
  scoreVerdictProgression,
};
