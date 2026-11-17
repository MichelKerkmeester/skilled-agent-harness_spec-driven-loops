#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const n = process.argv[2];
if (!n) throw new Error('usage: emit-convergence.cjs <iteration>');
const base = 'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-14';
const convergenceOut = JSON.parse(fs.readFileSync(path.join(base, `iter-${n}.convergence.json`), 'utf8'));
const convergence = convergenceOut.data ?? convergenceOut;
const record = JSON.parse(fs.readFileSync(path.join(base, `iter-${n}.record.json`), 'utf8'));
const config = JSON.parse(fs.readFileSync(path.join(base, 'deep-review-config.json'), 'utf8'));
const registry = JSON.parse(fs.readFileSync(path.join(base, 'deep-review-findings-registry.json'), 'utf8'));

const sha = (value) => crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
const graphSignals = convergenceOut.graph_signals_json || convergence.signals || {};
const stopDecision = convergenceOut.stop_decision || convergence.stop_decision || {};
const graphDecision = convergenceOut.graph_decision || convergence.graph_decision || 'CONTINUE';
const graphBlockers = Array.isArray(convergenceOut.graph_blockers_json) ? convergenceOut.graph_blockers_json : [];
const graphDecisionCode = graphDecision === 'STOP_ALLOWED' ? 'converged' : (graphDecision === 'STOP_BLOCKED' ? 'blocked' : 'continue');
const stability = Number(graphSignals.findingStability ?? 0) >= Number(config.convergenceThreshold) ? 'stable' : 'unstable';
const activeP0 = registry.findingsBySeverity?.P0 ?? 0;
const activeP1 = registry.findingsBySeverity?.P1 ?? 0;
const blockerIds = graphBlockers.map((b) => b.type || b.blocker || 'graph_blocker');
const policyFingerprint = sha({
  convergenceThreshold: config.convergenceThreshold,
  stopPolicy: config.stopPolicy,
  convergenceMode: config.antiConvergence?.convergenceMode ?? 'default',
});
const rawSignals = {
  noveltyRatio: record.newFindingsRatio,
  coverageRatio: graphSignals.dimensionCoverage ?? 0,
  findingStabilityRatio: graphSignals.findingStability ?? 0,
  evidenceDensityRatio: graphSignals.evidenceDensity ?? 0,
  hotspotSaturationRatio: graphSignals.hotspotSaturation ?? 0,
  observationDigest: sha(graphSignals),
};

const event = {
  stem: 'deep_review.graph_convergence_evaluated',
  scope: { runId: record.sessionId, sessionId: record.sessionId, generation: record.generation, iterationId: `iteration-${n}` },
  data: {
    rawSignals,
    weightedSignals: rawSignals,
    dimensionCoverageDigest: sha(registry.dimensionCoverage || {}),
    protocolCoverageDigest: sha({}),
    findingStability: stability,
    p0p1ResolutionState: activeP0 + activeP1 === 0 ? 'resolved' : 'blocked',
    evidenceDensity: Math.min(1, Number(graphSignals.evidenceDensity ?? 0)),
    hotspotSaturation: Number(graphSignals.hotspotSaturation ?? 0),
    decision: graphDecisionCode,
    policyFingerprint,
    blockerIds: blockerIds.length ? blockerIds : (graphDecision === 'STOP_BLOCKED' ? ['graph_blocker'] : []),
    stopCandidate: graphDecision === 'STOP_ALLOWED',
    graphDecision: graphDecisionCode,
    graphDigest: sha(graphSignals),
    signals: stopDecision,
    blockers: graphBlockers,
  },
  eventId: `graph-${record.sessionId}-g${record.generation}-i${n}`,
};
fs.writeFileSync(path.join(base, `iter-${n}.convergence-event.json`), JSON.stringify(event) + '\n');
console.log(JSON.stringify({ decision: stopDecision.decision, stopReason: stopDecision.stopReason, blockedBy: stopDecision.blockedBy, graphDecision }));
