import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import crypto from 'node:crypto';

const iteration = Number(process.argv[2]);
const noveltyRatio = Number(process.argv[3]);
if (!Number.isInteger(iteration) || iteration < 1) throw new Error('iteration required');

const spec = 'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build';
const lineage = `${spec}/review/lineages/mention-14`;
const session = 'fanout-mention-14-1794868189353-tsxtos';
const sha = (value) => crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
const canon = (obj) => JSON.stringify(Object.keys(obj).sort().reduce((acc, key) => { acc[key] = obj[key]; return acc; }, {}));

const raw = execFileSync(process.execPath, [
  '.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs',
  '--spec-folder', spec,
  '--loop-type', 'review',
  '--session-id', session,
  '--convergence-mode', 'default',
  '--stop-decision',
  '--config-path', `${lineage}/deep-review-config.json`,
  '--state-log', `${lineage}/deep-review-state.jsonl`,
  '--registry-path', `${lineage}/deep-review-findings-registry.json`,
  '--iteration-count', String(iteration),
  '--security-sensitive-fix-scope', 'false',
  '--fix-replay-required-rows', '0',
  '--fix-replay-passing-rows', '0',
], { encoding: 'utf8' });
const parsed = JSON.parse(raw);
const registry = JSON.parse(fs.readFileSync(`${lineage}/deep-review-findings-registry.json`, 'utf8'));
const config = JSON.parse(fs.readFileSync(`${lineage}/deep-review-config.json`, 'utf8'));
const signals = parsed.graph_signals_json;
const graphDigest = sha(canon(signals));
const covered = Object.values(registry.dimensionCoverage).filter(Boolean).length;
const total = Object.keys(registry.dimensionCoverage).length;
const ratio = total ? covered / total : 0;
const cluster = {
  noveltyRatio,
  coverageRatio: ratio,
  findingStabilityRatio: typeof signals.findingStability === 'number' ? signals.findingStability : 0,
  evidenceDensityRatio: Math.min(typeof signals.evidenceDensity === 'number' ? signals.evidenceDensity : 0, 1),
  hotspotSaturationRatio: typeof signals.hotspotSaturation === 'number' ? Math.min(signals.hotspotSaturation, 1) : 0,
  observationDigest: graphDigest,
};
const decisionMap = { CONTINUE: 'continue', STOP: 'converged', BLOCKED: 'blocked', STUCK_RECOVERY: 'recover' };
const graphMap = { STOP_ALLOWED: 'converged', STOP_BLOCKED: 'blocked', CONTINUE: 'continue' };
const event = {
  stem: 'deep_review.graph_convergence_evaluated',
  scope: { runId: config.sessionId, sessionId: config.sessionId, generation: config.generation, iterationId: `iteration-${iteration}` },
  data: {
    rawSignals: cluster,
    weightedSignals: cluster,
    dimensionCoverageDigest: sha(canon(registry.dimensionCoverage)),
    protocolCoverageDigest: sha('{}'),
    findingStability: cluster.findingStabilityRatio >= config.convergenceThreshold ? 'stable' : 'unstable',
    p0p1ResolutionState: (registry.findingsBySeverity.P0 + registry.findingsBySeverity.P1) > 0 ? 'blocked' : 'resolved',
    evidenceDensity: cluster.evidenceDensityRatio,
    hotspotSaturation: cluster.hotspotSaturationRatio,
    decision: decisionMap[parsed.stop_decision.decision] || 'incomplete',
    policyFingerprint: sha(canon({ convergenceThreshold: config.convergenceThreshold, stopPolicy: config.stopPolicy, convergenceMode: config.antiConvergence.convergenceMode })),
    blockerIds: Array.isArray(parsed.stop_decision.blockedBy) ? parsed.stop_decision.blockedBy : [],
    stopCandidate: parsed.stop_decision.decision === 'STOP',
    graphDecision: graphMap[parsed.graph_decision] || 'continue',
    graphDigest,
    signals,
    blockers: parsed.graph_blockers_json || [],
  },
};
fs.writeFileSync(`${lineage}/iter-${String(iteration).padStart(3, '0')}.convergence-event.json`, JSON.stringify(event));
fs.writeFileSync(`${lineage}/iter-${String(iteration).padStart(3, '0')}.convergence.json`, JSON.stringify(parsed));
const stop = parsed.stop_decision;
console.log(JSON.stringify({
  iteration,
  decision: stop.decision,
  stopReason: stop.stopReason,
  reasonDetail: stop.reasonDetail,
  blockedBy: stop.blockedBy,
  weightedStopScore: stop.weightedStopScore,
  gates: Object.fromEntries(Object.entries(stop.gates || {}).map(([k, v]) => [k, v.pass])),
  graphDecision: parsed.graph_decision,
  counters: parsed.loop_counters_json,
}));
