// Builds the step_graph_convergence append row from a captured convergence.cjs
// payload, exactly as the workflow's append_jsonl template shapes it.
const fs = require('fs');
const crypto = require('crypto');

const L = 'specs/system-skilled-doctor/007-overlay-framework-root-layout/review/lineages/deepseek-flash-max';
const payload = JSON.parse(fs.readFileSync('/tmp/convergence.json', 'utf8'));
const config = JSON.parse(fs.readFileSync(`${L}/deep-review-config.json`, 'utf8'));
const registry = JSON.parse(fs.readFileSync(`${L}/deep-review-findings-registry.json`, 'utf8'));

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const canonical = (value) => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
};

const data = payload.data || {};
const signals = data.signals || {};
const stop = payload.stop_decision || {};
const inputs = stop.inputs || {};
const review = inputs.review || {};
const graphSignalsJson = JSON.stringify(signals);
const decisionCode = payload.graph_decision === 'STOP_ALLOWED'
  ? 'converged'
  : payload.graph_decision === 'STOP_BLOCKED' ? 'blocked' : 'continue';

const threshold = Number(config.convergenceThreshold ?? 0.1);
const findingStabilityRatio = Number(signals.findingStability ?? 0);
const activeP0P1 = Number(review.activeP0 ?? 0) + Number(review.activeP1 ?? 0);

const rawSignals = {
  noveltyRatio: Number((inputs.ratios || []).slice(-1)[0] ?? 0),
  coverageRatio: Number(signals.dimensionCoverage ?? 0),
  findingStabilityRatio,
  evidenceDensityRatio: Math.min(1, Number(signals.evidenceDensity ?? 0)),
  hotspotSaturationRatio: Number(signals.hotspotSaturation ?? 0),
  observationDigest: sha256(graphSignalsJson),
};

const row = {
  stem: 'deep_review.graph_convergence_evaluated',
  scope: {
    runId: 'fanout-deepseek-flash-max-1795182837437-sws2tv',
    sessionId: 'fanout-deepseek-flash-max-1795182837437-sws2tv',
    generation: 1,
    iterationId: `iteration-${String(inputs.iterationCount).padStart(3, '0')}`,
  },
  data: {
    rawSignals,
    weightedSignals: rawSignals,
    dimensionCoverageDigest: sha256(canonical(registry.dimensionCoverage || {})),
    protocolCoverageDigest: sha256(canonical(signals.protocolCoverage || {})),
    findingStability: findingStabilityRatio >= threshold ? 'stable' : 'unstable',
    p0p1ResolutionState: activeP0P1 === 0 ? 'resolved' : 'blocked',
    evidenceDensity: Math.min(1, Number(signals.evidenceDensity ?? 0)),
    hotspotSaturation: Number(signals.hotspotSaturation ?? 0),
    decision: decisionCode,
    policyFingerprint: sha256(canonical({
      convergenceThreshold: config.convergenceThreshold,
      stopPolicy: config.stopPolicy,
      convergenceMode: config.convergenceMode,
    })),
    blockerIds: (stop.blockedBy || []).slice(),
    stopCandidate: payload.graph_decision === 'STOP_ALLOWED',
    graphDecision: decisionCode,
    graphDigest: sha256(graphSignalsJson),
    signals,
    blockers: (inputs.graphBlockers || []).slice(),
  },
  eventId: `graph-fanout-deepseek-flash-max-1795182837437-sws2tv-g1-i${inputs.iterationCount}`,
};

fs.writeFileSync('/tmp/graph-conv-event.json', JSON.stringify(row));
console.log(`graph convergence row: decision=${decisionCode} p0p1=${row.data.p0p1ResolutionState} stability=${row.data.findingStability} blockers=${row.data.blockerIds.length}`);
