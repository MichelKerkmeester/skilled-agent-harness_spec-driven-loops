// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Improvement Ledgers Projection Contract
// ───────────────────────────────────────────────────────────────────

import {
  AgentImprovementWireEventTypes,
} from '../agent-improvement-ledger-schema/index.js';
import {
  legacyProjectionDigest,
  serializeLegacyJsonl,
} from './legacy-projection-fold.js';
import { requireProjectableManifestEntry } from './legacy-projection-manifest.js';

import type {
  EventReadResult,
  JsonObject,
} from '../event-envelope/index.js';
import type {
  LegacyProjectionContract,
  LegacyProjectionJsonObject,
  LegacyProjectionSurfaceContract,
} from './legacy-projection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

// Negative-control hook for the projection surface's byte and consumer
// proofs: when false, the scored-candidate verdict rows are suppressed so
// the folded state file loses every accepted/rejected candidate the legacy
// reducer counts, and the reducer's totalRecords and accepted/rejected
// tallies drop. Left true in production; flipped to false only by the
// negative-control run to prove the test can go red.
const EMIT_SCORED_STATE_ROWS = true;

export interface DeepImprovementLedgersProjectionState extends LegacyProjectionJsonObject {
  readonly rows: readonly JsonObject[];
}

export interface CreateDeepImprovementLedgersProjectionContractOptions {
  readonly ledgerId?: string;
  readonly streamIds?: readonly string[];
  readonly baseSha?: string;
}

// Stems that carry a candidate's evaluated outcome and produce the
// scored-candidate, inconclusive, and infra-failure rows the improvement
// reducer's buildRegistry parses off the state log. The verified verdict
// (evaluation_verification_recorded) is the row buildRegistry credits as
// an accepted or rejected candidate via its type/recommendation branches;
// evaluation_failed becomes the infra_failure row its failure-mode counter
// reads; evaluation_inconclusive becomes a tie-scored prompt run.
const STATE_BEARING_STEMS = Object.freeze(new Set([
  'deep_improvement_common.evaluation_verification_recorded',
  'deep_improvement_common.evaluation_inconclusive',
  'deep_improvement_common.evaluation_failed',
]));

// Stems that carry run/candidate/promotion/canary-gate lifecycle and stop
// decisions and produce the audit rows the improvement reducer's
// buildJournalSummary reads off the journal. Each maps to the eventType
// vocabulary the journal's VALID_EVENT_TYPES closes over, with the
// session_ended rows carrying the stopReason/sessionOutcome the reducer
// surfaces and the legal_stop_evaluated/blocked_stop rows carrying the
// gate results the reducer's latestLegalStop/latestBlockedStop read.
const JOURNAL_BEARING_STEMS = Object.freeze(new Set([
  'deep_improvement_common.run_started',
  'deep_improvement_common.run_resumed',
  'deep_improvement_common.run_completed',
  'deep_improvement_common.run_aborted',
  'deep_improvement_common.candidate_generated',
  'deep_improvement_common.promotion_authorized',
  'deep_improvement_common.promotion_completed',
  'deep_improvement_common.promotion_denied',
  'deep_improvement_common.promotion_baseline_restored',
  'deep_improvement_common.canary_gate_passed',
  'deep_improvement_common.canary_gate_failed',
]));

// ───────────────────────────────────────────────────────────────────
// 2. STATE ROW BUILDER
// ───────────────────────────────────────────────────────────────────

// Maps each evaluation-outcome stem to the scored-candidate row vocabulary
// the improvement reducer's buildRegistry consumes: a type/recommendation
// pair its accepted/rejected/infra-failure branches filter on, plus the
// mode and profileId its lane-mix and profile bucketing read. The verified
// verdict is the load-bearing row — it is what the reducer counts as an
// accepted or rejected candidate — so it is the row the negative-control
// toggle suppresses to prove the fold can go red.
function buildStateRow(
  stem: string,
  scope: Record<string, unknown>,
  data: Record<string, unknown>,
  occurredAt: string,
): JsonObject | null {
  const mode = typeof scope.variant === 'string' ? scope.variant : 'agent-improvement';
  const profileId = typeof scope.candidateId === 'string' ? scope.candidateId : 'dynamic';

  if (stem === 'deep_improvement_common.evaluation_verification_recorded') {
    if (!EMIT_SCORED_STATE_ROWS) {
      return null;
    }
    const outcome = typeof data.verificationOutcome === 'string' ? data.verificationOutcome : '';
    // The reducer's accepted branch matches type 'accepted' or a
    // candidate-acceptable/candidate-better recommendation; its rejected
    // branch matches type 'rejected' or a candidate-worse/rejected
    // recommendation. A confirmed verdict is an accepted candidate; a
    // disputed one is rejected; an inconclusive verdict falls through to a
    // plain scored prompt run so the reducer still counts the evaluation.
    if (outcome === 'confirmed') {
      return Object.freeze({
        type: 'accepted',
        profileId,
        family: 'derived',
        mode,
        recommendation: 'candidate-better',
        timestamp: occurredAt,
      });
    }
    if (outcome === 'disputed') {
      return Object.freeze({
        type: 'rejected',
        profileId,
        family: 'derived',
        mode,
        recommendation: 'candidate-worse',
        timestamp: occurredAt,
      });
    }
    return Object.freeze({
      type: 'candidate_iteration',
      profileId,
      family: 'derived',
      mode,
      recommendation: 'tie',
      timestamp: occurredAt,
    });
  }

  if (stem === 'deep_improvement_common.evaluation_inconclusive') {
    if (!EMIT_SCORED_STATE_ROWS) {
      return null;
    }
    return Object.freeze({
      type: 'candidate_iteration',
      profileId,
      family: 'derived',
      mode,
      recommendation: 'tie',
      timestamp: occurredAt,
    });
  }

  // deep_improvement_common.evaluation_failed — the reducer's infra_failure
  // branch counts this row and pushes it onto the infraFailures log.
  return Object.freeze({
    type: 'infra_failure',
    profileId,
    family: 'derived',
    mode,
    reasonCode: typeof data.reasonCode === 'string' ? data.reasonCode : 'evaluation-failed',
    failureStage: typeof data.failureStage === 'string' ? data.failureStage : 'execution',
    timestamp: occurredAt,
  });
}

// ───────────────────────────────────────────────────────────────────
// 3. JOURNAL ROW BUILDER
// ───────────────────────────────────────────────────────────────────

// Maps each lifecycle/stop stem to the journal event vocabulary the
// improvement reducer's buildJournalSummary reads: an eventType from the
// journal's closed VALID_EVENT_TYPES set, a timestamp, and a details
// object carrying the stopReason/sessionOutcome (session_ended) or
// gateResults (legal_stop_evaluated) the reducer surfaces in its summary.
function buildJournalRow(
  stem: string,
  scope: Record<string, unknown>,
  data: Record<string, unknown>,
  occurredAt: string,
): JsonObject | null {
  if (stem === 'deep_improvement_common.run_started') {
    return Object.freeze({
      eventType: 'session_start',
      iteration: 0,
      timestamp: occurredAt,
      details: Object.freeze({}),
    });
  }

  if (stem === 'deep_improvement_common.run_resumed') {
    return Object.freeze({
      eventType: 'session_initialized',
      iteration: 0,
      timestamp: occurredAt,
      details: Object.freeze({}),
    });
  }

  if (stem === 'deep_improvement_common.run_completed') {
    return Object.freeze({
      eventType: 'session_ended',
      iteration: 0,
      timestamp: occurredAt,
      details: Object.freeze({
        stopReason: typeof data.stopReason === 'string' ? data.stopReason : 'converged',
        sessionOutcome: typeof data.sessionOutcome === 'string' ? data.sessionOutcome : 'keptBaseline',
      }),
    });
  }

  if (stem === 'deep_improvement_common.run_aborted') {
    return Object.freeze({
      eventType: 'session_ended',
      iteration: 0,
      timestamp: occurredAt,
      details: Object.freeze({
        stopReason: 'error',
        sessionOutcome: 'rolledBack',
      }),
    });
  }

  if (stem === 'deep_improvement_common.candidate_generated') {
    return Object.freeze({
      eventType: 'candidate_generated',
      candidateId: typeof scope.candidateId === 'string' ? scope.candidateId : '',
      timestamp: occurredAt,
      details: Object.freeze({}),
    });
  }

  if (stem === 'deep_improvement_common.promotion_authorized') {
    return Object.freeze({
      eventType: 'promotion_attempted',
      candidateId: typeof scope.candidateId === 'string' ? scope.candidateId : '',
      timestamp: occurredAt,
      details: Object.freeze({}),
    });
  }

  if (stem === 'deep_improvement_common.promotion_completed') {
    return Object.freeze({
      eventType: 'promotion_result',
      candidateId: typeof scope.candidateId === 'string' ? scope.candidateId : '',
      timestamp: occurredAt,
      details: Object.freeze({ result: 'promoted' }),
    });
  }

  if (stem === 'deep_improvement_common.promotion_denied') {
    return Object.freeze({
      eventType: 'promotion_result',
      candidateId: typeof scope.candidateId === 'string' ? scope.candidateId : '',
      timestamp: occurredAt,
      details: Object.freeze({ result: 'denied' }),
    });
  }

  if (stem === 'deep_improvement_common.promotion_baseline_restored') {
    return Object.freeze({
      eventType: 'rollback_result',
      candidateId: typeof scope.candidateId === 'string' ? scope.candidateId : '',
      timestamp: occurredAt,
      details: Object.freeze({}),
    });
  }

  if (stem === 'deep_improvement_common.canary_gate_passed') {
    return Object.freeze({
      eventType: 'legal_stop_evaluated',
      timestamp: occurredAt,
      details: Object.freeze({
        gateResults: Object.freeze({
          contractGate: 'pass',
          behaviorGate: 'pass',
          integrationGate: 'pass',
          evidenceGate: 'pass',
          improvementGate: 'pass',
        }),
      }),
    });
  }

  // deep_improvement_common.canary_gate_failed
  return Object.freeze({
    eventType: 'blocked_stop',
    timestamp: occurredAt,
    details: Object.freeze({
      failedGates: Array.isArray(data.failureClasses) ? data.failureClasses : ['canary'],
      reason: typeof data.reasonCode === 'string' ? data.reasonCode : 'canary-gate-failed',
    }),
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. STATE ARTIFACT FACTORY
// ───────────────────────────────────────────────────────────────────

function buildStateArtifact(
  foldId: string,
  serializerId: string,
  legacyWriter: string,
  readers: readonly string[],
  ledgerId: string,
  streamIds: readonly string[],
  baseSha: string,
  baseBytes: Uint8Array,
  acceptedEventVersions: Readonly<Record<string, readonly number[]>>,
): LegacyProjectionContract<DeepImprovementLedgersProjectionState> {
  return {
    artifactId: 'improvement-state',
    censusSurfaceId: 'improvement-ledgers',
    ledgerId,
    streamIds,
    relativePath: 'improvement/agent-improvement-state.jsonl',
    format: 'jsonl',
    refreshBoundary: 'event',
    foldId,
    reducerId: 'legacy-deep-improvement-state-reducer',
    projectionVersion: 'legacy-improvement-state@1',
    reducerVersion: 'deep-improvement-state-reducer@1',
    serializerId,
    legacyWriter,
    readers,
    base: {
      baseSha,
      baseDigest: legacyProjectionDigest(baseBytes),
      bytes: baseBytes,
      state: Object.freeze({ rows: Object.freeze([]) }),
      ledgerHead: Object.freeze({
        ledgerId,
        sequence: 0,
        recordHash: '0'.repeat(64),
      }),
    },
    acceptedEventVersions,
    reduce(
      state: Readonly<DeepImprovementLedgersProjectionState>,
      event: Readonly<EventReadResult>,
    ): DeepImprovementLedgersProjectionState {
      const envelope = event.effective.envelope;
      const payload = envelope.payload as Record<string, unknown> | undefined;
      if (!payload || typeof payload !== 'object') {
        return state;
      }
      const stem = typeof payload.stem === 'string' ? payload.stem : null;
      if (!stem || !STATE_BEARING_STEMS.has(stem)) {
        return state;
      }
      const scope = (payload.scope && typeof payload.scope === 'object')
        ? (payload.scope as Record<string, unknown>)
        : {};
      const data = (payload.data && typeof payload.data === 'object')
        ? (payload.data as Record<string, unknown>)
        : {};
      const row = buildStateRow(stem, scope, data, envelope.occurred_at);
      if (row === null) {
        return state;
      }
      return { rows: Object.freeze([...state.rows, Object.freeze(row)]) };
    },
    serialize(state: Readonly<DeepImprovementLedgersProjectionState>): Uint8Array {
      return serializeLegacyJsonl(state.rows);
    },
  };
}

// ───────────────────────────────────────────────────────────────────
// 5. JOURNAL ARTIFACT FACTORY
// ───────────────────────────────────────────────────────────────────

function buildJournalArtifact(
  foldId: string,
  serializerId: string,
  legacyWriter: string,
  readers: readonly string[],
  ledgerId: string,
  streamIds: readonly string[],
  baseSha: string,
  baseBytes: Uint8Array,
  acceptedEventVersions: Readonly<Record<string, readonly number[]>>,
): LegacyProjectionContract<DeepImprovementLedgersProjectionState> {
  return {
    artifactId: 'improvement-journal',
    censusSurfaceId: 'improvement-ledgers',
    ledgerId,
    streamIds,
    relativePath: 'improvement/improvement-journal.jsonl',
    format: 'jsonl',
    refreshBoundary: 'event',
    foldId,
    reducerId: 'legacy-deep-improvement-journal-reducer',
    projectionVersion: 'legacy-improvement-journal@1',
    reducerVersion: 'deep-improvement-journal-reducer@1',
    serializerId,
    legacyWriter,
    readers,
    base: {
      baseSha,
      baseDigest: legacyProjectionDigest(baseBytes),
      bytes: baseBytes,
      state: Object.freeze({ rows: Object.freeze([]) }),
      ledgerHead: Object.freeze({
        ledgerId,
        sequence: 0,
        recordHash: '0'.repeat(64),
      }),
    },
    acceptedEventVersions,
    reduce(
      state: Readonly<DeepImprovementLedgersProjectionState>,
      event: Readonly<EventReadResult>,
    ): DeepImprovementLedgersProjectionState {
      const envelope = event.effective.envelope;
      const payload = envelope.payload as Record<string, unknown> | undefined;
      if (!payload || typeof payload !== 'object') {
        return state;
      }
      const stem = typeof payload.stem === 'string' ? payload.stem : null;
      if (!stem || !JOURNAL_BEARING_STEMS.has(stem)) {
        return state;
      }
      const scope = (payload.scope && typeof payload.scope === 'object')
        ? (payload.scope as Record<string, unknown>)
        : {};
      const data = (payload.data && typeof payload.data === 'object')
        ? (payload.data as Record<string, unknown>)
        : {};
      const row = buildJournalRow(stem, scope, data, envelope.occurred_at);
      if (row === null) {
        return state;
      }
      return { rows: Object.freeze([...state.rows, Object.freeze(row)]) };
    },
    serialize(state: Readonly<DeepImprovementLedgersProjectionState>): Uint8Array {
      return serializeLegacyJsonl(state.rows);
    },
  };
}

// ───────────────────────────────────────────────────────────────────
// 6. SURFACE CONTRACT FACTORY
// ───────────────────────────────────────────────────────────────────

/** Build a projection surface that folds deep-improvement ledger events into the two fixed improvement ledgers the legacy reducer reads. */
export function createDeepImprovementLedgersProjectionContract(
  options?: CreateDeepImprovementLedgersProjectionContractOptions,
): LegacyProjectionSurfaceContract {
  const manifestEntry = requireProjectableManifestEntry('improvement-ledgers');
  const ledgerId = options?.ledgerId ?? 'deep-improvement-ledger';
  const streamIds = options?.streamIds ?? Object.freeze([ledgerId]);
  const baseSha = options?.baseSha ?? '0'.repeat(40);
  const baseBytes = serializeLegacyJsonl([]);

  const acceptedEventVersions: Record<string, readonly number[]> = {};
  for (const wireType of Object.values(AgentImprovementWireEventTypes)) {
    acceptedEventVersions[wireType] = Object.freeze([1]);
  }
  const frozenAccepted = Object.freeze(acceptedEventVersions);

  const foldId = manifestEntry.foldId ?? 'legacy-improvement-ledgers-fold@1';
  const serializerId = manifestEntry.serializerId ?? 'legacy-jsonl-row-v1';
  const legacyWriter = manifestEntry.legacyWriter;
  const readers = manifestEntry.readers;

  return {
    surfaceId: 'improvement-ledgers',
    ledgerId,
    buildArtifacts(_events: readonly EventReadResult[]): readonly LegacyProjectionContract<any>[] {
      // Static multi-file surface: two fixed artifacts with no per-iteration
      // fan-out. Each artifact's reduce remains the authority over which
      // events it absorbs, so the shared events stream is partitioned by
      // stem set rather than by iteration.
      return [
        buildStateArtifact(
          foldId, serializerId, legacyWriter, readers,
          ledgerId, streamIds, baseSha, baseBytes, frozenAccepted,
        ),
        buildJournalArtifact(
          foldId, serializerId, legacyWriter, readers,
          ledgerId, streamIds, baseSha, baseBytes, frozenAccepted,
        ),
      ];
    },
  };
}
