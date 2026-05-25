// ───────────────────────────────────────────────────────────────
// MODULE: Search Decision Envelope
// ───────────────────────────────────────────────────────────────
// Request-scoped telemetry contract for search/RAG decisions.
// Builders in this module are pure and must not alter ranking, routing, or
// refusal behavior.

import {
  buildTrustTree,
  type BuildTrustTreeInput,
  type TrustTree,
} from '../rag/trust-tree.js';
import type { QueryPlan } from '../query/query-plan.js';

export interface ShadowDeltaTelemetry {
  prompt?: string;
  recommendation?: string;
  liveScore: number;
  shadowScore: number;
  delta: number;
  dominantLane: string | null;
  timestamp: string;
}

export interface DegradedReadinessTelemetry {
  freshness?: string;
  action?: string;
  canonicalReadiness?: string;
  trustState?: string;
  reason?: string;
  blocked?: boolean;
  degraded?: boolean;
  graphAnswersOmitted?: boolean;
  requiredAction?: string;
  fallbackDecision?: Record<string, unknown>;
}

export interface SearchDecisionEnvelope {
  envelopeVersion: 1;
  requestId: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  queryPlan: QueryPlan;
  trustTree?: TrustTree;
  shadowDeltas?: ShadowDeltaTelemetry[];
  degradedReadiness?: DegradedReadinessTelemetry;
  pipelineTiming?: Record<string, number>;
  timestamp: string;
  latencyMs: number;
}

export interface BuildSearchDecisionEnvelopeInput {
  requestId: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  queryPlan: QueryPlan;
  trustTree?: TrustTree;
  trustTreeInput?: BuildTrustTreeInput;
  shadowDeltas?: readonly ShadowDeltaTelemetry[];
  degradedReadiness?: DegradedReadinessTelemetry;
  pipelineTiming?: Record<string, number>;
  timestamp?: string;
  latencyMs?: number;
}

function buildSearchDecisionEnvelope(input: BuildSearchDecisionEnvelopeInput): SearchDecisionEnvelope {
  const envelope: SearchDecisionEnvelope = {
    envelopeVersion: 1,
    requestId: input.requestId,
    ...(input.tenantId ? { tenantId: input.tenantId } : {}),
    ...(input.userId ? { userId: input.userId } : {}),
    ...(input.agentId ? { agentId: input.agentId } : {}),
    queryPlan: cloneJson(input.queryPlan),
    ...(input.pipelineTiming ? { pipelineTiming: cloneJson(input.pipelineTiming) } : {}),
    timestamp: input.timestamp ?? new Date().toISOString(),
    latencyMs: normalizeLatency(input.latencyMs),
  };

  const trustTree = input.trustTree ?? (input.trustTreeInput ? buildTrustTree(input.trustTreeInput) : undefined);
  return attachDegradedReadiness(
    attachShadowDeltas(
      attachTrustTree(envelope, trustTree),
      input.shadowDeltas,
    ),
    input.degradedReadiness,
  );
}

function attachTrustTree(envelope: SearchDecisionEnvelope, trustTree?: TrustTree): SearchDecisionEnvelope {
  if (!trustTree) return { ...envelope };
  return {
    ...envelope,
    trustTree: cloneJson(trustTree),
  };
}

function attachShadowDeltas(
  envelope: SearchDecisionEnvelope,
  shadowDeltas?: readonly ShadowDeltaTelemetry[],
): SearchDecisionEnvelope {
  if (!shadowDeltas || shadowDeltas.length === 0) return { ...envelope };
  return {
    ...envelope,
    shadowDeltas: shadowDeltas.map((delta) => cloneJson(delta)),
  };
}

function attachDegradedReadiness(
  envelope: SearchDecisionEnvelope,
  degradedReadiness?: DegradedReadinessTelemetry,
): SearchDecisionEnvelope {
  if (!degradedReadiness) return { ...envelope };
  return {
    ...envelope,
    degradedReadiness: cloneJson(degradedReadiness),
  };
}

function normalizeLatency(value: number | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.round(value)
    : 0;
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export {
  attachDegradedReadiness,
  attachShadowDeltas,
  attachTrustTree,
  buildSearchDecisionEnvelope,
};
