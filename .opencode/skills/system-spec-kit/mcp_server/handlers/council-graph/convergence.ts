// ───────────────────────────────────────────────────────────────
// MODULE: Council Graph Convergence Handler
// ───────────────────────────────────────────────────────────────

import {
  createSnapshot,
  getEdges,
  getNodes,
  getStats,
  type CouncilNamespace,
} from '../../lib/council-graph/council-graph-db.js';
import { confidence, findConvergenceBlockers } from '../../lib/council-graph/council-graph-query.js';

export type CouncilConvergenceDecision = 'CONTINUE' | 'STOP_ALLOWED' | 'STOP_BLOCKED';

export interface CouncilSignals {
  agreementRatio: number;
  dissentDensity: number;
  evidenceDepth: number;
  unresolvedCriticalDisagreements: number;
  decisionConfidence: number;
  score: number;
}

export interface CouncilGraphConvergenceArgs {
  specFolder: string;
  sessionId: string;
  roundId?: string;
  persistSnapshot?: boolean;
}

interface CouncilTraceEntry {
  signal: string;
  value: number;
  threshold: number;
  passed: boolean;
}

const THRESHOLDS = {
  agreementRatio: 0.67,
  dissentDensity: 0.25,
  evidenceDepth: 1.0,
  unresolvedCriticalDisagreements: 0,
  decisionConfidence: 0.65,
};

export async function handleCouncilGraphConvergence(
  args: CouncilGraphConvergenceArgs,
): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    if (!args.specFolder || typeof args.specFolder !== 'string') {
      return errorResponse('specFolder is required');
    }
    if (!args.sessionId || typeof args.sessionId !== 'string') {
      return errorResponse('sessionId is required');
    }

    const ns: CouncilNamespace = { specFolder: args.specFolder, sessionId: args.sessionId };
    const stats = getStats(args.specFolder, args.sessionId);
    if (stats.totalNodes === 0) {
      return okResponse({
        decision: 'STOP_BLOCKED' as CouncilConvergenceDecision,
        reason: 'Council graph is empty; derived graph data is required before convergence can be assessed',
        signals: null,
        blockers: [{ type: 'empty_graph', severity: 'blocking', count: 1 }],
        trace: [],
        namespace: ns,
        readiness: 'empty',
        sourceOfTruth: 'derived_from_ai_council_artifacts',
      });
    }

    const signals = computeCouncilSignals(ns);
    const blockers = buildBlockers(ns, signals);
    const trace = buildTrace(signals);
    const blocking = blockers.filter((blocker) => blocker.severity === 'blocking');
    const decision: CouncilConvergenceDecision = blocking.length > 0
      ? 'STOP_BLOCKED'
      : trace.every((entry) => entry.passed)
        ? 'STOP_ALLOWED'
        : 'CONTINUE';
    const reason = buildReason(decision, blocking.length, trace.filter((entry) => !entry.passed).map((entry) => entry.signal));

    if (args.persistSnapshot) {
      createSnapshot({
        specFolder: args.specFolder,
        sessionId: args.sessionId,
        roundId: args.roundId,
        metrics: { ...signals },
        nodeCount: stats.totalNodes,
        edgeCount: stats.totalEdges,
      });
    }

    return okResponse({
      decision,
      reason,
      signals,
      blockers,
      trace,
      namespace: ns,
      readiness: 'ready',
      sourceOfTruth: 'derived_from_ai_council_artifacts',
      snapshotPersistence: args.persistSnapshot ? 'persisted' : 'not_requested',
      nodeCount: stats.totalNodes,
      edgeCount: stats.totalEdges,
    });
  } catch (err: unknown) {
    return errorResponse(`Council graph convergence failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export function computeCouncilSignals(ns: CouncilNamespace): CouncilSignals {
  const nodes = getNodes(ns);
  const edges = getEdges(ns);
  const decisions = nodes.filter((node) => node.kind === 'DECISION' || node.kind === 'RECOMMENDATION');
  const agreementEdges = edges.filter((edge) => edge.relation === 'AGREES_WITH').length;
  const dissentEdges = edges.filter((edge) => edge.relation === 'CONTRADICTS' || edge.relation === 'ESCALATES').length;
  const agreementDenominator = agreementEdges + dissentEdges;
  const agreementRatio = agreementDenominator === 0 ? 0 : agreementEdges / agreementDenominator;
  const dissentDensity = edges.length === 0 ? 0 : dissentEdges / edges.length;
  const evidenceEdges = edges.filter((edge) => edge.relation === 'EVIDENCE_FOR' || edge.relation === 'SUPPORTS').length;
  const evidenceDepth = decisions.length === 0 ? 0 : evidenceEdges / decisions.length;
  const blockerData = findConvergenceBlockers(ns);
  const decisionConfidence = decisions.length === 0
    ? 0
    : decisions.reduce((sum, node) => sum + confidence(node.metadata), 0) / decisions.length;

  const normalizedEvidenceDepth = Math.min(evidenceDepth / 2, 1);
  const score = round(
    clamp(agreementRatio) * 0.25 +
    (1 - clamp(dissentDensity)) * 0.20 +
    normalizedEvidenceDepth * 0.20 +
    (blockerData.unresolvedCriticalDisagreements.length === 0 ? 1 : 0) * 0.20 +
    clamp(decisionConfidence) * 0.15,
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

function buildBlockers(ns: CouncilNamespace, signals: CouncilSignals): Array<Record<string, unknown>> {
  const blockerData = findConvergenceBlockers(ns);
  const blockers: Array<Record<string, unknown>> = [];
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

function buildTrace(signals: CouncilSignals): CouncilTraceEntry[] {
  return [
    { signal: 'agreementRatio', value: signals.agreementRatio, threshold: THRESHOLDS.agreementRatio, passed: signals.agreementRatio >= THRESHOLDS.agreementRatio },
    { signal: 'dissentDensity', value: signals.dissentDensity, threshold: THRESHOLDS.dissentDensity, passed: signals.dissentDensity <= THRESHOLDS.dissentDensity },
    { signal: 'evidenceDepth', value: signals.evidenceDepth, threshold: THRESHOLDS.evidenceDepth, passed: signals.evidenceDepth >= THRESHOLDS.evidenceDepth },
    { signal: 'unresolvedCriticalDisagreements', value: signals.unresolvedCriticalDisagreements, threshold: THRESHOLDS.unresolvedCriticalDisagreements, passed: signals.unresolvedCriticalDisagreements === 0 },
    { signal: 'decisionConfidence', value: signals.decisionConfidence, threshold: THRESHOLDS.decisionConfidence, passed: signals.decisionConfidence >= THRESHOLDS.decisionConfidence },
  ];
}

function buildReason(decision: CouncilConvergenceDecision, blockingCount: number, failedSignals: string[]): string {
  if (decision === 'STOP_BLOCKED') return `${blockingCount} blocking council convergence issue(s) remain`;
  if (decision === 'STOP_ALLOWED') return 'Council graph signals meet convergence thresholds';
  return `Council graph has not converged; failing signals: ${failedSignals.join(', ') || 'none'}`;
}

function okResponse(data: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  return { content: [{ type: 'text', text: JSON.stringify({ status: 'ok', data }, null, 2) }] };
}

function errorResponse(error: string): { content: Array<{ type: string; text: string }> } {
  return { content: [{ type: 'text', text: JSON.stringify({ status: 'error', error }) }] };
}

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}
