'use strict';
// Run the review stop decision for one iteration and append the graph event.
// Usage: node stop-decision.cjs <iteration> <iterationsDone> [blockedByJson]
const fs = require('node:fs');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const dir = 'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/merged-12';
const abs = `${process.cwd()}/${dir}`;
const iteration = Number(process.argv[2]);
const iterationsDone = Number(process.argv[3] || iteration);
const sid = 'fanout-merged-12-1794856957949-n58dw7';
const sha = (value) => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');

const result = spawnSync(process.execPath, [
  '.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs',
  '--spec-folder', 'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build',
  '--loop-type', 'review',
  '--session-id', sid,
  '--convergence-mode', 'default',
  '--stop-decision',
  '--config-path', `${abs}/deep-review-config.json`,
  '--state-log', `${abs}/deep-review-state.jsonl`,
  '--registry-path', `${abs}/deep-review-findings-registry.json`,
  '--iteration-count', String(iterationsDone),
  '--security-sensitive-fix-scope', 'false',
  '--fix-replay-required-rows', '0',
  '--fix-replay-passing-rows', '0',
], { encoding: 'utf8' });
if (result.status !== 0) {
  process.stderr.write(result.stdout || '');
  process.stderr.write(result.stderr || '');
  process.exit(result.status ?? 1);
}
const out = JSON.parse(result.stdout);
const stop = out.stop_decision || {};
const graphSignals = out.graph_signals_json || {};
const blockers = out.graph_blockers_json || [];
const blockerIds = blockers.map((b) => b.type);
const registry = JSON.parse(fs.readFileSync(`${abs}/deep-review-findings-registry.json`, 'utf8'));
const activeP0 = Number(registry?.findingsBySeverity?.P0 || 0);
const activeP1 = Number(registry?.findingsBySeverity?.P1 || 0);
const rawSignals = {
  coverageRatio: Number(graphSignals.dimensionCoverage ?? 0),
  evidenceDensityRatio: Number(graphSignals.evidenceDensity ?? 0),
  findingStabilityRatio: Number(graphSignals.findingStability ?? 0),
  hotspotSaturationRatio: Number(graphSignals.hotspotSaturation ?? 0),
  noveltyRatio: Number(graphSignals.noveltyRatio ?? 1),
  observationDigest: sha(graphSignals),
};
const event = {
  stem: 'deep_review.graph_convergence_evaluated',
  scope: { runId: sid, sessionId: sid, generation: 1, iterationId: `iteration-${iteration}` },
  data: {
    rawSignals,
    weightedSignals: rawSignals,
    dimensionCoverageDigest: sha(registry.dimensionCoverage || {}),
    protocolCoverageDigest: sha({}),
    findingStability: Number(graphSignals.findingStability ?? 0) >= 0.7 ? 'stable' : 'unstable',
    p0p1ResolutionState: activeP0 > 0 ? 'blocked' : 'resolved',
    evidenceDensity: Number(graphSignals.evidenceDensity ?? 0),
    hotspotSaturation: Number(graphSignals.hotspotSaturation ?? 0),
    decision: stop.decision === 'STOP' ? 'converged' : (stop.decision === 'BLOCKED' ? 'blocked' : 'continue'),
    policyFingerprint: sha({ convergenceThreshold: 0.1, stopPolicy: 'convergence', convergenceMode: 'default' }),
    blockerIds: blockerIds.length ? blockerIds : (out.graph_decision === 'STOP_BLOCKED' ? ['graph_blocker'] : []),
    stopCandidate: Boolean(out.stop_candidate),
    graphDecision: out.graph_decision === 'STOP_ALLOWED' ? 'converged' : (out.graph_decision === 'STOP_BLOCKED' ? 'blocked' : 'continue'),
    graphDigest: sha(graphSignals),
    signals: { ...graphSignals, stopReason: stop.stopReason ?? null, blockedBy: stop.blockedBy ?? [] },
    blockers,
  },
};
const eventPath = `${dir}/.executor-state/graph-${String(iteration).padStart(3, '0')}.json`;
fs.writeFileSync(eventPath, JSON.stringify(event));
const appended = spawnSync(process.execPath, [
  '.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs',
  '--mode', 'review',
  '--run-directory', dir,
  '--event-json', eventPath,
], { encoding: 'utf8' });
process.stdout.write(`${JSON.stringify({
  decision: stop.decision,
  stopReason: stop.stopReason,
  reasonDetail: stop.reasonDetail,
  blockedBy: stop.blockedBy,
  graphDecision: out.graph_decision,
  appended: appended.status === 0,
  appendOut: appended.status === 0 ? 'ok' : (appended.stdout || appended.stderr || '').slice(0, 400),
})}\n`);
if (appended.status !== 0) process.exit(appended.status ?? 1);
