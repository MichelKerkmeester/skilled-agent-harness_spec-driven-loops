// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Projection Contract
// ───────────────────────────────────────────────────────────────────

import {
  DeepResearchWireEventTypes,
} from '../deep-research-ledger-schema/index.js';
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
} from './legacy-projection-types.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

export interface DeepResearchProjectionState extends JsonObject {
  readonly rows: readonly JsonObject[];
}

export interface CreateDeepResearchProjectionContractOptions {
  readonly ledgerId?: string;
  readonly streamIds?: readonly string[];
  readonly relativePath?: string;
  readonly baseSha?: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. FACTORY
// ───────────────────────────────────────────────────────────────────

/** Build a projection contract that folds deep-research ledger events into legacy state rows. */
export function createDeepResearchProjectionContract(
  options?: CreateDeepResearchProjectionContractOptions,
): LegacyProjectionContract<DeepResearchProjectionState> {
  const manifestEntry = requireProjectableManifestEntry('research-state');
  const ledgerId = options?.ledgerId ?? 'deep-research-ledger';
  const streamIds = options?.streamIds ?? Object.freeze([ledgerId]);
  const relativePath = options?.relativePath ?? 'research/deep-research-state.jsonl';
  const baseSha = options?.baseSha ?? '0'.repeat(40);
  const baseBytes = serializeLegacyJsonl([]);

  const acceptedEventVersions: Record<string, readonly number[]> = {};
  for (const wireType of Object.values(DeepResearchWireEventTypes)) {
    acceptedEventVersions[wireType] = Object.freeze([1]);
  }

  return {
    artifactId: 'research-state',
    censusSurfaceId: 'research-state',
    ledgerId,
    streamIds,
    relativePath,
    format: 'jsonl',
    refreshBoundary: 'event',
    foldId: manifestEntry.foldId ?? 'legacy-research-state-fold@1',
    reducerId: 'legacy-deep-research-state-reducer',
    projectionVersion: 'legacy-research-state@1',
    reducerVersion: 'deep-research-state-reducer@1',
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
      state: Readonly<DeepResearchProjectionState>,
      event: Readonly<EventReadResult>,
    ): DeepResearchProjectionState {
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

      if (stem === 'deep_research.run_initialized') {
        row = {
          type: 'config',
          topic: typeof scope.runId === 'string' ? scope.runId : 'deep-research',
          maxIterations: typeof data.maxIterations === 'number' ? data.maxIterations : 0,
          generation: typeof data.generation === 'number' ? data.generation : 1,
          timestamp: occurredAt,
        };
      } else if (stem === 'deep_research.run_resumed') {
        row = {
          type: 'event',
          event: 'resumed',
          sessionId: typeof scope.runId === 'string' ? scope.runId : '',
          parentSessionId: typeof data.sourceLineageId === 'string' ? data.sourceLineageId : '',
          generation: typeof data.generation === 'number' ? data.generation : 1,
          reason: typeof data.resumeReason === 'string' ? data.resumeReason : 'resumed',
          timestamp: occurredAt,
        };
      } else if (stem === 'deep_research.run_restarted') {
        row = {
          type: 'event',
          event: 'restarted',
          sessionId: typeof scope.runId === 'string' ? scope.runId : '',
          parentSessionId: typeof data.archivedLineageId === 'string' ? data.archivedLineageId : '',
          generation: typeof data.generation === 'number' ? data.generation : 1,
          reason: typeof data.restartReason === 'string' ? data.restartReason : 'restarted',
          timestamp: occurredAt,
        };
      } else if (stem === 'deep_research.question_registered') {
        row = {
          type: 'event',
          event: 'question_registered',
          questionId: typeof scope.questionId === 'string' ? scope.questionId : '',
          requiredSourceClasses: Array.isArray(data.requiredSourceClasses) ? data.requiredSourceClasses : [],
          timestamp: occurredAt,
        };
      } else if (stem === 'deep_research.iteration_started') {
        const iter = typeof scope.iteration === 'number' ? scope.iteration : 1;
        row = {
          type: 'iteration_start',
          iteration: iter,
          run: iter,
          focus: typeof data.focusRef === 'string' ? data.focusRef : '',
          timestamp: occurredAt,
        };
      } else if (stem === 'deep_research.iteration_completed') {
        const iter = typeof scope.iteration === 'number' ? scope.iteration : 1;
        row = {
          type: 'iteration',
          iteration: iter,
          run: iter,
          status: typeof data.status === 'string' ? data.status : 'complete',
          newInfoRatio: typeof data.rawNewInfoRatio === 'number' ? data.rawNewInfoRatio : 0,
          ruledOut: Array.isArray(data.ruledOutApproachRefs) ? data.ruledOutApproachRefs : [],
          timestamp: occurredAt,
        };
      } else if (stem === 'deep_research.convergence_blocked') {
        const iter = typeof scope.iteration === 'number' ? scope.iteration : 0;
        row = {
          type: 'event',
          event: 'blocked_stop',
          run: iter,
          iteration: iter,
          blockedBy: Array.isArray(data.blockerIds) ? data.blockerIds : [],
          stopReason: typeof data.incompleteReason === 'string' ? data.incompleteReason : 'blocked',
          recoveryStrategy: typeof data.recoveryReason === 'string' ? data.recoveryReason : '',
          timestamp: occurredAt,
        };
      } else if (stem === 'deep_research.convergence_evaluated') {
        const iter = typeof scope.iteration === 'number' ? scope.iteration : 0;
        row = {
          type: 'event',
          event: 'graph_convergence',
          run: iter,
          iteration: iter,
          decision: typeof data.decision === 'string' ? data.decision : 'continue',
          timestamp: occurredAt,
        };
      } else if (stem === 'deep_research.synthesis_started') {
        row = {
          type: 'event',
          event: 'synthesis_started',
          timestamp: occurredAt,
        };
      } else if (stem === 'deep_research.synthesis_committed') {
        row = {
          type: 'event',
          event: 'synthesis_complete',
          timestamp: occurredAt,
        };
      } else if (stem === 'deep_research.run_completed') {
        row = {
          type: 'event',
          event: 'run_completed',
          terminalStatus: typeof data.terminalStatus === 'string' ? data.terminalStatus : 'completed',
          timestamp: occurredAt,
        };
      } else if (stem) {
        row = {
          type: 'event',
          event: stem.replace(/^deep_research\./, ''),
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
    serialize(state: Readonly<DeepResearchProjectionState>): Uint8Array {
      return serializeLegacyJsonl(state.rows);
    },
  };
}
