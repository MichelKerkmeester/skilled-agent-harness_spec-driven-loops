// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Config-State Projection Contract
// ───────────────────────────────────────────────────────────────────

import {
  DeepAiCouncilWireEventTypes,
} from '../deep-ai-council-ledger-schema/index.js';
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
  LegacyProjectionSurfaceContract,
} from './legacy-projection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. PREMISE CHECK — config.json is operator input, not ledger-derived
// ───────────────────────────────────────────────────────────────────

// The council ledger's run_initialized stem carries only DIGESTS of the
// config (configDigest, strategyDigest, convergencePolicyDigest,
// testGatePolicyDigest) plus scalar bounds (maxRounds, minSeatCount,
// maxSeatCount, planningOnly). No stem carries the config CONTENT — the
// seats array, seats_per_round, executor block, or boundaries that
// ai-council-config.json holds. The config is operator input written by
// the council writer from an assets template, not folded from the ledger.
// The completion advisor reads it via readJsonIfExists, which returns
// null when the file is absent, and expectedSeatCount(null) returns null,
// skipping the seat-count advisory — so the consumer tolerates a missing
// config. Projecting a fabricated config would be dishonest; the surface
// therefore folds only the two ledger-derived .jsonl files and omits
// ai-council-config.json, recording the gap rather than inventing bytes.

// ───────────────────────────────────────────────────────────────────
// 2. TYPES
// ───────────────────────────────────────────────────────────────────

// Negative-control hook for the projection surface's byte and consumer
// proofs: when false, the council_complete row is suppressed from the
// state file so the completion advisor reports a missing council_complete
// event and the derivePayload graph loses its terminal SESSION closure.
// Left true in production; flipped to false only by the negative-control
// run to prove the test can go red.
const EMIT_COUNCIL_COMPLETE_ROW = true;

export interface CouncilStateProjectionState extends JsonObject {
  readonly rows: readonly JsonObject[];
}

export interface CouncilSessionStateProjectionState extends JsonObject {
  readonly rows: readonly JsonObject[];
}

export interface CreateDeepAiCouncilConfigStateProjectionContractOptions {
  readonly ledgerId?: string;
  readonly streamIds?: readonly string[];
  readonly baseSha?: string;
}

// ───────────────────────────────────────────────────────────────────
// 3. STEM PARTITIONING
// ───────────────────────────────────────────────────────────────────

// Stems that produce rows in ai-council-state.jsonl — the append-only
// event log the graph replay and completion advisor read. Every council
// lifecycle, deliberation, adjudication, artifact, and convergence stem
// maps to a row whose `event` vocabulary the consumers recognize; the
// graph replay derives ROUND/SEAT nodes from every row and extracts
// graph items from declared fields, while the advisor checks for
// council_complete and counts artifact_written/rollback/superseded.
const STATE_BEARING_STEMS = Object.freeze(new Set([
  'ai_council.round_started',
  'ai_council.seat_selected',
  'ai_council.seat_dispatched',
  'ai_council.proposal_observed',
  'ai_council.seat_returned',
  'ai_council.critique_round_started',
  'ai_council.critique_recorded',
  'ai_council.candidate_blinded',
  'ai_council.pairwise_judgment_recorded',
  'ai_council.bias_audit_recorded',
  'ai_council.adjudication_decision',
  'ai_council.stance_recorded',
  'ai_council.stance_flipped',
  'ai_council.deliberation_synthesized',
  'ai_council.convergence_evaluated',
  'ai_council.convergence_blocked',
  'ai_council.round_ended',
  'ai_council.artifact_committed',
  'ai_council.artifact_superseded',
  'ai_council.rollback_recorded',
  'ai_council.council_test_gate_evaluated',
  'ai_council.council_complete',
]));

// Stems that produce rows in session-state.jsonl — the session/topic/round
// lifecycle log the round-state reader parses. Only the run-level and
// round-level lifecycle stems feed this file; intermediate deliberation
// events belong to the state log, not the session log.
const SESSION_BEARING_STEMS = Object.freeze(new Set([
  'ai_council.run_initialized',
  'ai_council.run_resumed',
  'ai_council.run_restarted',
  'ai_council.round_started',
  'ai_council.seat_returned',
  'ai_council.round_ended',
  'ai_council.council_complete',
]));

// ───────────────────────────────────────────────────────────────────
// 4. STATE ROW BUILDER (ai-council-state.jsonl)
// ───────────────────────────────────────────────────────────────────

function roundNumberFrom(
  scope: Record<string, unknown>,
  data: Record<string, unknown>,
): number {
  if (typeof data.roundNumber === 'number' && data.roundNumber > 0) {
    return data.roundNumber;
  }
  if (typeof scope.roundId === 'string') {
    const match = scope.roundId.match(/round-(\d+)/);
    if (match) return Number(match[1]);
  }
  return 1;
}

function seatIdFrom(scope: Record<string, unknown>): string | null {
  return typeof scope.seatId === 'string' ? scope.seatId : null;
}

// Maps each council stem to the legacy event vocabulary the graph replay
// and completion advisor consume. The `event` field is the semantic
// discriminator both readers key on; `round` and `seat` drive node
// creation in the graph replay; `status` on seat_returned maps the
// ledger responseStatus to the ok/timeout/error vocabulary the state
// format defines; artifact/rollback/superseded stems carry the audit
// fields the advisor counts.
function buildStateRow(
  stem: string,
  scope: Record<string, unknown>,
  data: Record<string, unknown>,
  occurredAt: string,
): JsonObject | null {
  const round = roundNumberFrom(scope, data);
  const seatId = seatIdFrom(scope);

  if (stem === 'ai_council.round_started') {
    return Object.freeze({
      event: 'round_start',
      round,
      timestamp: occurredAt,
      seats: [],
    });
  }

  if (stem === 'ai_council.seat_selected') {
    return Object.freeze({
      event: 'seat_selected',
      round,
      seat: seatId ?? '',
      timestamp: occurredAt,
    });
  }

  if (stem === 'ai_council.seat_dispatched') {
    return Object.freeze({
      event: 'seat_dispatched',
      round,
      seat: seatId ?? '',
      timestamp: occurredAt,
    });
  }

  if (stem === 'ai_council.proposal_observed') {
    return Object.freeze({
      event: 'proposal_observed',
      round,
      seat: seatId ?? '',
      timestamp: occurredAt,
    });
  }

  if (stem === 'ai_council.seat_returned') {
    const responseStatus = typeof data.responseStatus === 'string'
      ? data.responseStatus : 'returned';
    // The state format defines ok/timeout/error; the ledger's
    // responseStatus uses returned/partial/failed/timeout. Map the
    // non-ok cases so the consumer's status field matches the legacy
    // vocabulary.
    const status = responseStatus === 'timeout' ? 'timeout'
      : responseStatus === 'failed' ? 'error'
      : 'ok';
    return Object.freeze({
      event: 'seat_returned',
      round,
      seat: seatId ?? '',
      timestamp: occurredAt,
      status,
    });
  }

  if (stem === 'ai_council.critique_round_started') {
    return Object.freeze({
      event: 'critique_round_started',
      round,
      seat: seatId ?? '',
      timestamp: occurredAt,
    });
  }

  if (stem === 'ai_council.critique_recorded') {
    return Object.freeze({
      event: 'critique_recorded',
      round,
      seat: seatId ?? '',
      timestamp: occurredAt,
    });
  }

  if (stem === 'ai_council.candidate_blinded') {
    return Object.freeze({
      event: 'candidate_blinded',
      round,
      timestamp: occurredAt,
    });
  }

  if (stem === 'ai_council.pairwise_judgment_recorded') {
    return Object.freeze({
      event: 'pairwise_judgment_recorded',
      round,
      timestamp: occurredAt,
    });
  }

  if (stem === 'ai_council.bias_audit_recorded') {
    return Object.freeze({
      event: 'bias_audit_recorded',
      round,
      timestamp: occurredAt,
    });
  }

  if (stem === 'ai_council.adjudication_decision') {
    return Object.freeze({
      event: 'adjudication_decision',
      round,
      timestamp: occurredAt,
    });
  }

  if (stem === 'ai_council.stance_recorded') {
    return Object.freeze({
      event: 'stance_recorded',
      round,
      seat: seatId ?? '',
      timestamp: occurredAt,
    });
  }

  if (stem === 'ai_council.stance_flipped') {
    return Object.freeze({
      event: 'stance_flipped',
      round,
      seat: seatId ?? '',
      timestamp: occurredAt,
    });
  }

  if (stem === 'ai_council.deliberation_synthesized') {
    return Object.freeze({
      event: 'deliberation_synthesized',
      round,
      timestamp: occurredAt,
    });
  }

  if (stem === 'ai_council.convergence_evaluated') {
    return Object.freeze({
      event: 'convergence_evaluated',
      round,
      timestamp: occurredAt,
    });
  }

  if (stem === 'ai_council.convergence_blocked') {
    return Object.freeze({
      event: 'convergence_blocked',
      round,
      timestamp: occurredAt,
    });
  }

  if (stem === 'ai_council.round_ended') {
    return Object.freeze({
      event: 'round_end',
      round,
      timestamp: occurredAt,
    });
  }

  if (stem === 'ai_council.artifact_committed') {
    const safeRelativePath = typeof data.safeRelativePath === 'string'
      ? data.safeRelativePath : '';
    const contentDigest = typeof data.contentDigest === 'string'
      ? data.contentDigest : '';
    return Object.freeze({
      event: 'artifact_written',
      path: safeRelativePath,
      bytes: 0,
      checksum: `sha256:${contentDigest}`,
      timestamp: occurredAt,
      seat_id: seatId,
      round_id: typeof scope.roundId === 'string' ? scope.roundId : `round-${String(round).padStart(3, '0')}`,
    });
  }

  if (stem === 'ai_council.artifact_superseded') {
    const safeRelativePath = typeof data.safeRelativePath === 'string'
      ? data.safeRelativePath : '';
    return Object.freeze({
      event: 'artifact_superseded',
      original_path: safeRelativePath,
      round_id: typeof scope.roundId === 'string' ? scope.roundId : `round-${String(round).padStart(3, '0')}`,
      rollback_event_id: '',
      superseded_by: 'rollback',
      timestamp: occurredAt,
    });
  }

  if (stem === 'ai_council.rollback_recorded') {
    const rollbackReason = typeof data.rollbackReason === 'string'
      ? data.rollbackReason : '';
    const supersededArtifactRefs = Array.isArray(data.supersededArtifactRefs)
      ? data.supersededArtifactRefs : [];
    return Object.freeze({
      event: 'rollback',
      round_id: typeof scope.roundId === 'string' ? scope.roundId : `round-${String(round).padStart(3, '0')}`,
      reason: rollbackReason,
      timestamp: occurredAt,
      supersedes: [...supersededArtifactRefs],
    });
  }

  if (stem === 'ai_council.council_test_gate_evaluated') {
    return Object.freeze({
      event: 'council_test_gate_evaluated',
      round,
      timestamp: occurredAt,
    });
  }

  if (stem === 'ai_council.council_complete') {
    if (!EMIT_COUNCIL_COMPLETE_ROW) {
      return null;
    }
    return Object.freeze({
      event: 'council_complete',
      timestamp: occurredAt,
    });
  }

  return null;
}

// ───────────────────────────────────────────────────────────────────
// 5. SESSION ROW BUILDER (session-state.jsonl)
// ───────────────────────────────────────────────────────────────────

// Maps run-level and round-level lifecycle stems to the session-state
// row vocabulary the round-state reader parses. Each row carries a
// type/event pair the reader can filter on, plus the session/round/seat
// identifiers a resume reader uses to reconstruct the session hierarchy.
function buildSessionRow(
  stem: string,
  scope: Record<string, unknown>,
  data: Record<string, unknown>,
  occurredAt: string,
): JsonObject | null {
  const round = roundNumberFrom(scope, data);
  const seatId = seatIdFrom(scope);
  const roundId = typeof scope.roundId === 'string'
    ? scope.roundId : `round-${String(round).padStart(3, '0')}`;
  const runId = typeof scope.runId === 'string' ? scope.runId : '';

  if (stem === 'ai_council.run_initialized') {
    return Object.freeze({
      type: 'session',
      event: 'session_start',
      session_id: runId,
      timestamp: occurredAt,
    });
  }

  if (stem === 'ai_council.run_resumed') {
    return Object.freeze({
      type: 'session',
      event: 'session_resumed',
      session_id: runId,
      timestamp: occurredAt,
    });
  }

  if (stem === 'ai_council.run_restarted') {
    return Object.freeze({
      type: 'session',
      event: 'session_restarted',
      session_id: runId,
      timestamp: occurredAt,
    });
  }

  if (stem === 'ai_council.round_started') {
    return Object.freeze({
      type: 'round',
      event: 'round_start',
      round_id: roundId,
      timestamp: occurredAt,
    });
  }

  if (stem === 'ai_council.seat_returned') {
    const responseStatus = typeof data.responseStatus === 'string'
      ? data.responseStatus : 'returned';
    const status = responseStatus === 'timeout' ? 'timeout'
      : responseStatus === 'failed' ? 'error'
      : 'ok';
    return Object.freeze({
      type: 'seat',
      event: 'seat_returned',
      seat_id: seatId ?? '',
      round_id: roundId,
      status,
      timestamp: occurredAt,
    });
  }

  if (stem === 'ai_council.round_ended') {
    return Object.freeze({
      type: 'round',
      event: 'round_end',
      round_id: roundId,
      timestamp: occurredAt,
    });
  }

  if (stem === 'ai_council.council_complete') {
    return Object.freeze({
      type: 'session',
      event: 'session_complete',
      timestamp: occurredAt,
    });
  }

  return null;
}

// ───────────────────────────────────────────────────────────────────
// 6. STATE ARTIFACT FACTORY
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
): LegacyProjectionContract<CouncilStateProjectionState> {
  return {
    artifactId: 'council-state',
    censusSurfaceId: 'council-config-state',
    ledgerId,
    streamIds,
    relativePath: 'ai-council/ai-council-state.jsonl',
    format: 'jsonl',
    refreshBoundary: 'event',
    foldId,
    reducerId: 'legacy-deep-ai-council-state-reducer',
    projectionVersion: 'legacy-council-state@1',
    reducerVersion: 'deep-ai-council-state-reducer@1',
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
      state: Readonly<CouncilStateProjectionState>,
      event: Readonly<EventReadResult>,
    ): CouncilStateProjectionState {
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
    serialize(state: Readonly<CouncilStateProjectionState>): Uint8Array {
      return serializeLegacyJsonl(state.rows);
    },
  };
}

// ───────────────────────────────────────────────────────────────────
// 7. SESSION ARTIFACT FACTORY
// ───────────────────────────────────────────────────────────────────

function buildSessionArtifact(
  foldId: string,
  serializerId: string,
  legacyWriter: string,
  readers: readonly string[],
  ledgerId: string,
  streamIds: readonly string[],
  baseSha: string,
  baseBytes: Uint8Array,
  acceptedEventVersions: Readonly<Record<string, readonly number[]>>,
): LegacyProjectionContract<CouncilSessionStateProjectionState> {
  return {
    artifactId: 'council-session-state',
    censusSurfaceId: 'council-config-state',
    ledgerId,
    streamIds,
    relativePath: 'ai-council/session-state.jsonl',
    format: 'jsonl',
    refreshBoundary: 'event',
    foldId,
    reducerId: 'legacy-deep-ai-council-session-reducer',
    projectionVersion: 'legacy-council-session@1',
    reducerVersion: 'deep-ai-council-session-reducer@1',
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
      state: Readonly<CouncilSessionStateProjectionState>,
      event: Readonly<EventReadResult>,
    ): CouncilSessionStateProjectionState {
      const envelope = event.effective.envelope;
      const payload = envelope.payload as Record<string, unknown> | undefined;
      if (!payload || typeof payload !== 'object') {
        return state;
      }
      const stem = typeof payload.stem === 'string' ? payload.stem : null;
      if (!stem || !SESSION_BEARING_STEMS.has(stem)) {
        return state;
      }
      const scope = (payload.scope && typeof payload.scope === 'object')
        ? (payload.scope as Record<string, unknown>)
        : {};
      const data = (payload.data && typeof payload.data === 'object')
        ? (payload.data as Record<string, unknown>)
        : {};
      const row = buildSessionRow(stem, scope, data, envelope.occurred_at);
      if (row === null) {
        return state;
      }
      return { rows: Object.freeze([...state.rows, Object.freeze(row)]) };
    },
    serialize(state: Readonly<CouncilSessionStateProjectionState>): Uint8Array {
      return serializeLegacyJsonl(state.rows);
    },
  };
}

// ───────────────────────────────────────────────────────────────────
// 8. SURFACE CONTRACT FACTORY
// ───────────────────────────────────────────────────────────────────

/** Build a projection surface that folds deep-ai-council ledger events into the two ledger-derived .jsonl files the council orchestrator reads. */
export function createDeepAiCouncilConfigStateProjectionContract(
  options?: CreateDeepAiCouncilConfigStateProjectionContractOptions,
): LegacyProjectionSurfaceContract {
  const manifestEntry = requireProjectableManifestEntry('council-config-state');
  const ledgerId = options?.ledgerId ?? 'deep-ai-council-ledger';
  const streamIds = options?.streamIds ?? Object.freeze([ledgerId]);
  const baseSha = options?.baseSha ?? '0'.repeat(40);
  const baseBytes = serializeLegacyJsonl([]);

  const acceptedEventVersions: Record<string, readonly number[]> = {};
  for (const wireType of Object.values(DeepAiCouncilWireEventTypes)) {
    acceptedEventVersions[wireType] = Object.freeze([1]);
  }
  const frozenAccepted = Object.freeze(acceptedEventVersions);

  const foldId = manifestEntry.foldId ?? 'legacy-council-config-state-fold@1';
  const serializerId = manifestEntry.serializerId ?? 'legacy-mixed-council-v1';
  const legacyWriter = manifestEntry.legacyWriter;
  const readers = manifestEntry.readers;

  return {
    surfaceId: 'council-config-state',
    ledgerId,
    buildArtifacts(_events: readonly EventReadResult[]): readonly LegacyProjectionContract<any>[] {
      // Static multi-file surface: two fixed .jsonl artifacts with no
      // per-iteration fan-out. The config.json artifact is intentionally
      // omitted — the ledger carries only digests of the config, not its
      // content, so projecting it would require fabricating operator
      // input. Each artifact's reduce remains the authority over which
      // events it absorbs, so the shared events stream is partitioned by
      // stem set rather than by iteration.
      return [
        buildStateArtifact(
          foldId, serializerId, legacyWriter, readers,
          ledgerId, streamIds, baseSha, baseBytes, frozenAccepted,
        ),
        buildSessionArtifact(
          foldId, serializerId, legacyWriter, readers,
          ledgerId, streamIds, baseSha, baseBytes, frozenAccepted,
        ),
      ];
    },
  };
}
