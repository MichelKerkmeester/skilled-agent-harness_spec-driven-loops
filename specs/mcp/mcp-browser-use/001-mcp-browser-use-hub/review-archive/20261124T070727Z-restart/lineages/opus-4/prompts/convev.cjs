// Builds the graph_convergence_evaluated event (and optionally recovery_started) from a convergence.cjs output.
const fs = require('fs'); const crypto = require('crypto');
const [convPath, iter, outGraph, outRecovery, statePath, regPath, cfgPath, least] = process.argv.slice(2);
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const canon = (o) => JSON.stringify(o, Object.keys(o).sort());
const j = JSON.parse(fs.readFileSync(convPath, 'utf8'));
const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const sid = cfg.sessionId; const gen = cfg.generation;
const sig = typeof j.graph_signals_json === 'string' ? JSON.parse(j.graph_signals_json) : (j.graph_signals_json || {});
const sigStr = JSON.stringify(sig);
const gd = j.graph_decision || 'CONTINUE';
const code = { CONTINUE: 'continue', STOP_ALLOWED: 'converged', STOP_BLOCKED: 'blocked' }[gd] || 'continue';
const blockers = typeof j.graph_blockers_json === 'string' ? JSON.parse(j.graph_blockers_json) : (j.graph_blockers_json || []);
const ids = blockers.map((b) => b.type).filter(Boolean);
const r01 = (v) => Math.max(0, Math.min(1, Number(v) || 0));
const raw = { noveltyRatio: r01(sig.novelty != null ? sig.novelty : 1 - (sig.findingStability || 0)), coverageRatio: r01(sig.dimensionCoverage), findingStabilityRatio: r01(sig.findingStability), evidenceDensityRatio: r01(sig.evidenceDensity), hotspotSaturationRatio: r01(sig.hotspotSaturation), observationDigest: sha(sigStr) };
const p01 = (reg.findingsBySeverity || {}).P0 + (reg.findingsBySeverity || {}).P1;
const ev = { stem: 'deep_review.graph_convergence_evaluated', scope: { runId: sid, sessionId: sid, generation: gen, iterationId: 'iteration-' + iter },
  data: { rawSignals: raw, weightedSignals: raw, dimensionCoverageDigest: sha(canon(reg.dimensionCoverage || {})), protocolCoverageDigest: sha(JSON.stringify(sig.protocolCoverage || {})),
    findingStability: sig.findingStability == null ? 'unknown' : (sig.findingStability >= cfg.convergenceThreshold ? 'stable' : 'unstable'),
    p0p1ResolutionState: Number.isFinite(p01) ? (p01 === 0 ? 'resolved' : 'blocked') : 'unknown',
    evidenceDensity: Math.min(1, sig.evidenceDensity || 0), hotspotSaturation: sig.hotspotSaturation || 0, decision: code,
    policyFingerprint: sha(JSON.stringify({ convergenceThreshold: cfg.convergenceThreshold, stopPolicy: cfg.stopPolicy, convergenceMode: cfg.antiConvergence.convergenceMode })),
    blockerIds: code === 'blocked' && ids.length === 0 ? ['graph_blocker'] : ids, stopCandidate: gd === 'STOP_ALLOWED', graphDecision: code, graphDigest: sha(sigStr), signals: sig, blockers },
  eventId: 'graph-' + sid + '-g' + gen + '-i' + iter };
fs.writeFileSync(outGraph, JSON.stringify(ev) + '\n');
if (outRecovery && outRecovery !== '-') {
  const tail = sha(fs.readFileSync(statePath));
  const rv = { stem: 'deep_review.recovery_started', scope: { runId: sid, sessionId: sid, generation: gen, iterationId: 'iteration-' + iter, dimensionId: least },
    data: { normalizedStopReason: 'stuckRecovery', recoveryCause: 'repeated-no-progress', fromIterationId: 'iteration-' + iter, strategy: process.env.RSTRAT || 'traceability-protocol-replay', targetDimensionId: least, outcome: 'recovery-started', lineageRef: sid, priorTailDigest: tail, originatingPauseEventId: 'none' } };
  fs.writeFileSync(outRecovery, JSON.stringify(rv) + '\n');
}
console.log('decision', j.stop_decision && j.stop_decision.decision, 'graph', gd);
