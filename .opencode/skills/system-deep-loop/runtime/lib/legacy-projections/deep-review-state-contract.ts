// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Review Projection Contract
// ───────────────────────────────────────────────────────────────────

import {
  DeepReviewWireEventTypes,
} from '../deep-review-ledger-schema/index.js';
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
} from './legacy-projection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

// Negative-control hook for the projection contract's byte and consumer
// proofs: when false, dimension-pass completion rows are suppressed so the
// folded JSONL loses every type:'iteration' row and the legacy reducer no
// longer reflects any iterations. Left true in production; flipped to false
// only by the negative-control run to prove the test can go red.
const EMIT_ITERATION_ROWS = true;

export interface DeepReviewProjectionState extends LegacyProjectionJsonObject {
  readonly rows: readonly JsonObject[];
}

export interface CreateDeepReviewStateProjectionContractOptions {
  readonly ledgerId?: string;
  readonly streamIds?: readonly string[];
  readonly relativePath?: string;
  readonly baseSha?: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. FACTORY
// ───────────────────────────────────────────────────────────────────

/** Build a projection contract that folds deep-review ledger events into legacy state rows. */
export function createDeepReviewStateProjectionContract(
  options?: CreateDeepReviewStateProjectionContractOptions,
): LegacyProjectionContract<DeepReviewProjectionState> {
  const manifestEntry = requireProjectableManifestEntry('review-state');
  const ledgerId = options?.ledgerId ?? 'deep-review-ledger';
  const streamIds = options?.streamIds ?? Object.freeze([ledgerId]);
  const relativePath = options?.relativePath ?? 'review/deep-review-state.jsonl';
  const baseSha = options?.baseSha ?? '0'.repeat(40);
  const baseBytes = serializeLegacyJsonl([]);

  const acceptedEventVersions: Record<string, readonly number[]> = {};
  for (const wireType of Object.values(DeepReviewWireEventTypes)) {
    acceptedEventVersions[wireType] = Object.freeze([1]);
  }

  return {
    artifactId: 'review-state',
    censusSurfaceId: 'review-state',
    ledgerId,
    streamIds,
    relativePath,
    format: 'jsonl',
    refreshBoundary: 'event',
    foldId: manifestEntry.foldId ?? 'legacy-review-state-fold@1',
    reducerId: 'legacy-deep-review-state-reducer',
    projectionVersion: 'legacy-review-state@1',
    reducerVersion: 'deep-review-state-reducer@1',
    serializerId: manifestEntry.serializerId ?? 'legacy-jsonl-row-v1',
    legacyWriter: manifestEntry.legacyWriter,
    readers: manifestEntry.readers,
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
    acceptedEventVersions: Object.freeze(acceptedEventVersions),
    reduce(
      state: Readonly<DeepReviewProjectionState>,
      event: Readonly<EventReadResult>,
    ): DeepReviewProjectionState {
      const envelope = event.effective.envelope;
      const payload = envelope.payload as Record<string, unknown> | undefined;
      const occurredAt = envelope.occurred_at;

      let row: JsonObject;

      if (!payload || typeof payload !== 'object') {
        row = {
          type: 'event',
          event: envelope.event_type,
          timestamp: occurredAt,
        };
        return { rows: Object.freeze([...state.rows, Object.freeze(row)]) };
      }

      const stem = typeof payload.stem === 'string' ? payload.stem : null;
      const scope = (payload.scope && typeof payload.scope === 'object')
        ? (payload.scope as Record<string, unknown>)
        : {};
      const data = (payload.data && typeof payload.data === 'object')
        ? (payload.data as Record<string, unknown>)
        : {};

      if (stem === 'deep_review.run_initialized') {
        row = {
          type: 'config',
          topic: typeof scope.runId === 'string' ? scope.runId : 'deep-review',
          maxIterations: typeof data.maxIterations === 'number' ? data.maxIterations : 0,
          generation: typeof scope.generation === 'number' ? scope.generation : 1,
          timestamp: occurredAt,
        };
      } else if (stem === 'deep_review.run_resumed') {
        row = {
          type: 'event',
          event: 'resumed',
          sessionId: typeof scope.runId === 'string' ? scope.runId : '',
          parentSessionId: typeof data.sourceSessionId === 'string' ? data.sourceSessionId : '',
          generation: typeof scope.generation === 'number' ? scope.generation : 1,
          reason: typeof data.resumeReason === 'string' ? data.resumeReason : 'resumed',
          timestamp: occurredAt,
        };
      } else if (stem === 'deep_review.run_restarted') {
        row = {
          type: 'event',
          event: 'restarted',
          sessionId: typeof scope.runId === 'string' ? scope.runId : '',
          parentSessionId: typeof data.archivedLineageId === 'string' ? data.archivedLineageId : '',
          generation: typeof scope.generation === 'number' ? scope.generation : 1,
          reason: typeof data.restartReason === 'string' ? data.restartReason : 'restarted',
          timestamp: occurredAt,
        };
      } else if (stem === 'deep_review.dimension_pass_completed') {
        if (!EMIT_ITERATION_ROWS) {
          return { rows: state.rows };
        }
        const iter = typeof data.passNumber === 'number' ? data.passNumber : 1;
        row = {
          type: 'iteration',
          iteration: iter,
          run: iter,
          status: typeof data.passStatus === 'string' ? data.passStatus : 'complete',
          focus: typeof data.nextFocusRef === 'string' ? data.nextFocusRef : '',
          newInfoRatio: 0,
          timestamp: occurredAt,
        };
      } else if (stem === 'deep_review.convergence_evaluated') {
        const iter = typeof scope.iterationId === 'string' ? scope.iterationId : '';
        row = {
          type: 'event',
          event: 'graph_convergence',
          iteration: iter,
          run: iter,
          decision: typeof data.decision === 'string' ? data.decision : 'continue',
          timestamp: occurredAt,
        };
      } else if (stem === 'deep_review.graph_convergence_evaluated') {
        const iter = typeof scope.iterationId === 'string' ? scope.iterationId : '';
        row = {
          type: 'event',
          event: 'graph_convergence',
          iteration: iter,
          run: iter,
          decision: typeof data.graphDecision === 'string' ? data.graphDecision
            : (typeof data.decision === 'string' ? data.decision : 'continue'),
          timestamp: occurredAt,
        };
      } else if (stem === 'deep_review.blocked_stop_recorded') {
        const iter = typeof scope.iterationId === 'string' ? scope.iterationId : '';
        row = {
          type: 'event',
          event: 'blocked_stop',
          iteration: iter,
          run: iter,
          blockedBy: Array.isArray(data.blockedGateIds) ? data.blockedGateIds : [],
          stopReason: typeof data.recoveryStrategy === 'string' ? data.recoveryStrategy : 'blocked',
          recoveryStrategy: typeof data.recoveryStrategy === 'string' ? data.recoveryStrategy : '',
          timestamp: occurredAt,
        };
      } else if (stem === 'deep_review.synthesis_started') {
        row = {
          type: 'event',
          event: 'synthesis_started',
          timestamp: occurredAt,
        };
      } else if (stem === 'deep_review.review_report_committed') {
        row = {
          type: 'event',
          event: 'synthesis_complete',
          timestamp: occurredAt,
        };
      } else if (stem === 'deep_review.run_completed') {
        row = {
          type: 'event',
          event: 'run_completed',
          terminalStatus: typeof data.terminalStatus === 'string' ? data.terminalStatus : 'completed',
          timestamp: occurredAt,
        };
      } else if (stem) {
        row = {
          type: 'event',
          event: stem.replace(/^deep_review\./, ''),
          stem,
          ...scope,
          ...data,
          timestamp: occurredAt,
        };
      } else if (typeof payload.type === 'string' || typeof payload.event === 'string') {
        row = {
          ...payload,
          timestamp: (payload.timestamp as string) || occurredAt,
        } as JsonObject;
      } else if (typeof payload.value === 'number' && typeof payload.label === 'string') {
        row = {
          type: 'iteration',
          run: payload.value,
          status: 'complete',
          focus: payload.label,
          findingsCount: 1,
          newInfoRatio: 1,
          timestamp: occurredAt,
        };
      } else {
        row = {
          type: 'event',
          event: envelope.event_type,
          payload: payload as JsonObject,
          timestamp: occurredAt,
        };
      }

      return {
        rows: Object.freeze([...state.rows, Object.freeze(row)]),
      };
    },
    serialize(state: Readonly<DeepReviewProjectionState>): Uint8Array {
      return serializeLegacyJsonl(state.rows);
    },
  };
}
