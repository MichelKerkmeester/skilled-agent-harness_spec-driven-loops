// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Council Graph Convergence                                                ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const path = require('node:path');

const { acquireWriterLock } = require('../../scripts/lib/cli-guards.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const THRESHOLDS = {
  agreementRatio: 0.67,
  dissentDensity: 0.25,
  evidenceDepth: 1.0,
  unresolvedCriticalDisagreements: 0,
  decisionConfidence: 0.65,
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

async function loadCouncilModules() {
  const db = await import('./council-graph-db.ts');
  const query = await import('./council-graph-query.ts');
  return { db, query };
}

function clamp(value) {
  return Math.max(0, Math.min(1, value));
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}

function blockersCsv(blockers) {
  return blockers
    .filter((blocker) => blocker && blocker.severity === 'blocking')
    .map((blocker) => `${blocker.type}:${blocker.count}`)
    .join(',');
}

function buildTrace(signals) {
  return [
    { signal: 'agreementRatio', value: signals.agreementRatio, threshold: THRESHOLDS.agreementRatio, passed: signals.agreementRatio >= THRESHOLDS.agreementRatio },
    { signal: 'dissentDensity', value: signals.dissentDensity, threshold: THRESHOLDS.dissentDensity, passed: signals.dissentDensity <= THRESHOLDS.dissentDensity },
    { signal: 'evidenceDepth', value: signals.evidenceDepth, threshold: THRESHOLDS.evidenceDepth, passed: signals.evidenceDepth >= THRESHOLDS.evidenceDepth },
    { signal: 'unresolvedCriticalDisagreements', value: signals.unresolvedCriticalDisagreements, threshold: THRESHOLDS.unresolvedCriticalDisagreements, passed: signals.unresolvedCriticalDisagreements === 0 },
    { signal: 'decisionConfidence', value: signals.decisionConfidence, threshold: THRESHOLDS.decisionConfidence, passed: signals.decisionConfidence >= THRESHOLDS.decisionConfidence },
  ];
}

function buildReason(decision, blockingCount, failedSignals) {
  if (decision === 'STOP_BLOCKED') return `${blockingCount} blocking council convergence issue(s) remain`;
  if (decision === 'STOP_ALLOWED') return 'Council graph signals meet convergence thresholds';
  return `Council graph has not converged; failing signals: ${failedSignals.join(', ') || 'none'}`;
}

function bridgePayload(data) {
  return {
    status: 'ok',
    data,
    graph_decision: data.decision,
    graph_decision_json: JSON.stringify(data.decision),
    graph_signals_json: data.signals ?? {},
    graph_blockers_json: data.blockers ?? [],
    graph_blockers_csv: blockersCsv(data.blockers ?? []),
    graph_stop_blocked: data.decision === 'STOP_BLOCKED',
    graph_trace_json: data.trace ?? [],
    graph_convergence_score: data.score ?? data.signals?.score ?? 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

async function computeCouncilSignals(ns) {
  const { db, query } = await loadCouncilModules();
  const councilNs = { specFolder: ns.specFolder, sessionId: ns.sessionId };
  const nodes = db.getNodes(councilNs);
  const edges = db.getEdges(councilNs);
  const decisions = nodes.filter((node) => node.kind === 'DECISION' || node.kind === 'RECOMMENDATION');
  const agreementEdges = edges.filter((edge) => edge.relation === 'AGREES_WITH').length;
  const dissentEdges = edges.filter((edge) => edge.relation === 'CONTRADICTS' || edge.relation === 'ESCALATES').length;
  const agreementDenominator = agreementEdges + dissentEdges;
  const agreementRatio = agreementDenominator === 0 ? 0 : agreementEdges / agreementDenominator;
  const dissentDensity = edges.length === 0 ? 0 : dissentEdges / edges.length;
  const evidenceEdges = edges.filter((edge) => edge.relation === 'EVIDENCE_FOR' || edge.relation === 'SUPPORTS').length;
  const evidenceDepth = decisions.length === 0 ? 0 : evidenceEdges / decisions.length;
  const blockerData = query.findConvergenceBlockers(councilNs);
  const decisionConfidence = decisions.length === 0
    ? 0
    : decisions.reduce((sum, node) => sum + query.confidence(node.metadata), 0) / decisions.length;

  const normalizedEvidenceDepth = Math.min(evidenceDepth / 2, 1);
  const score = round(
    clamp(agreementRatio) * 0.25
    + (1 - clamp(dissentDensity)) * 0.20
    + normalizedEvidenceDepth * 0.20
    + (blockerData.unresolvedCriticalDisagreements.length === 0 ? 1 : 0) * 0.20
    + clamp(decisionConfidence) * 0.15,
  );

  return {
    agreementRatio: round(agreementRatio),
    dissentDensity: round(dissentDensity),
    evidenceDepth: round(evidenceDepth),
    unresolvedCriticalDisagreements: blockerData.unresolvedCriticalDisagreements.length,
    decisionConfidence: round(decisionConfidence),
    score,
  };
}

async function buildBlockers(ns, signals) {
  const { query } = await loadCouncilModules();
  const councilNs = { specFolder: ns.specFolder, sessionId: ns.sessionId };
  const blockerData = query.findConvergenceBlockers(councilNs);
  const blockers = [];
  if (signals.unresolvedCriticalDisagreements > 0) {
    blockers.push({
      type: 'unresolved_critical_disagreements',
      severity: 'blocking',
      count: signals.unresolvedCriticalDisagreements,
      nodes: blockerData.unresolvedCriticalDisagreements,
    });
  }
  if (blockerData.unsupportedDecisions.length > 0) {
    blockers.push({
      type: 'unsupported_decisions',
      severity: 'warning',
      count: blockerData.unsupportedDecisions.length,
      nodes: blockerData.unsupportedDecisions,
    });
  }
  if (blockerData.lowConfidenceDecisions.length > 0) {
    blockers.push({
      type: 'low_confidence_decisions',
      severity: 'warning',
      count: blockerData.lowConfidenceDecisions.length,
      nodes: blockerData.lowConfidenceDecisions,
    });
  }
  return blockers;
}

async function evaluateCouncilConvergence(ns, options = {}) {
  const { db } = await loadCouncilModules();
  const councilNs = { specFolder: ns.specFolder, sessionId: ns.sessionId };
  const stats = db.getStats(ns.specFolder, ns.sessionId);

  if (stats.totalNodes === 0) {
    return {
      decision: 'STOP_BLOCKED',
      reason: 'Council graph is empty; derived graph data is required before convergence can be assessed',
      signals: null,
      blockers: [{ type: 'empty_graph', severity: 'blocking', count: 1 }],
      trace: [],
      namespace: ns,
      scopeMode: 'session',
      readiness: 'empty',
      sourceOfTruth: 'derived_from_ai_council_artifacts',
      nodeCount: 0,
      edgeCount: 0,
      score: 0,
    };
  }

  const signals = await computeCouncilSignals(ns);
  const blockers = await buildBlockers(ns, signals);
  const trace = buildTrace(signals);
  const blocking = blockers.filter((blocker) => blocker.severity === 'blocking');
  const decision = blocking.length > 0
    ? 'STOP_BLOCKED'
    : trace.every((entry) => entry.passed) ? 'STOP_ALLOWED' : 'CONTINUE';
  const reason = buildReason(
    decision,
    blocking.length,
    trace.filter((entry) => !entry.passed).map((entry) => entry.signal),
  );

  if (options.persistSnapshot) {
    // Snapshot writes share the council graph DB with upsert.cjs, so they must
    // take the same writer lock to avoid a concurrent-write race.
    const releaseWriterLock = acquireWriterLock(path.join(db.COUNCIL_GRAPH_STORAGE_DIR, '.council-graph-writer.lock'));
    try {
      db.createSnapshot({
        specFolder: ns.specFolder,
        sessionId: ns.sessionId,
        roundId: options.roundId,
        metrics: { ...signals },
        nodeCount: stats.totalNodes,
        edgeCount: stats.totalEdges,
      });
    } finally {
      releaseWriterLock();
    }
  }

  return {
    decision,
    reason,
    score: signals.score,
    signals,
    blockers,
    trace,
    namespace: ns,
    scopeMode: 'session',
    readiness: 'ready',
    sourceOfTruth: 'derived_from_ai_council_artifacts',
    snapshotPersistence: options.persistSnapshot ? 'persisted' : 'not_requested',
    nodeCount: stats.totalNodes,
    edgeCount: stats.totalEdges,
    snapshotCount: stats.snapshotCount,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  THRESHOLDS,
  bridgePayload,
  computeCouncilSignals,
  evaluateCouncilConvergence,
};
