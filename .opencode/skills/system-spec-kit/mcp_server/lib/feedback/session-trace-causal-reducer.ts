// ───────────────────────────────────────────────────────────────
// MODULE: Session Trace Causal Reducer
// ───────────────────────────────────────────────────────────────
// Converts deferred feedback ledger traces into weak causal links.
// No live feedback logging path imports or invokes this module.

import type Database from 'better-sqlite3';
import {
  getFeedbackEvents,
  initFeedbackLedger,
} from './feedback-ledger.js';
import type { FeedbackEventRow } from './feedback-ledger.js';
import {
  init as initCausalEdges,
  insertEdge,
  RELATION_TYPES,
} from '../storage/causal-edges.js';
import type { RelationType } from '../storage/causal-edges.js';

const CREATED_BY = 'auto-session';
const EDGE_STRENGTH = 0.3;
const DEFAULT_MAX_SOURCES = 5;
const DEFAULT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

type SkipReason =
  | 'flag_off'
  | 'missing_session'
  | 'no_prior_source'
  | 'self_candidate'
  | 'already_created'
  | 'manual_protected'
  | 'insert_rejected'
  | 'dry_run';

interface SessionTraceCausalReducerOptions {
  runAt?: number;
  since?: number;
  until?: number;
  windowMs?: number;
  maxSourcesPerCitation?: number;
  dryRun?: boolean;
}

interface SessionTraceCandidate {
  sessionId: string;
  queryId: string;
  sourceId: string;
  targetId: string;
  citationEventId: number;
  sourceEventId: number;
}

interface SessionTraceSkip {
  reason: SkipReason;
  sessionId?: string | null;
  queryId?: string;
  sourceId?: string;
  targetId?: string;
}

interface SessionTraceCausalReducerResult {
  runAt: number;
  windowStart: number;
  windowEnd: number;
  flagEnabled: boolean;
  dryRun: boolean;
  totalEventsProcessed: number;
  citationsEvaluated: number;
  candidatesEvaluated: number;
  edgesInserted: number;
  skipped: SessionTraceSkip[];
  candidates: SessionTraceCandidate[];
}

interface ExistingEdgeRow {
  id: number;
  created_by: string | null;
}

function normalizeBooleanEnv(value: string | undefined): boolean {
  const normalized = value?.toLowerCase().trim();
  return normalized === 'true' || normalized === '1';
}

function isSessionTraceCausalInferenceEnabled(): boolean {
  return normalizeBooleanEnv(process.env.SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE);
}

// The session-trace reducer only ever emits the ENABLED relation. This is a
// compile-time constant from RELATION_TYPES, so there is no runtime validation
// to perform — exposing it directly avoids a tautological guard that reads like
// a gate but can never trip.
const SESSION_TRACE_RELATION: RelationType = RELATION_TYPES.ENABLED;

function sortFeedbackEvents(events: FeedbackEventRow[]): FeedbackEventRow[] {
  return [...events].sort((a, b) => {
    const sessionCompare = (a.session_id ?? '').localeCompare(b.session_id ?? '');
    if (sessionCompare !== 0) return sessionCompare;
    return (a.timestamp - b.timestamp) || (a.id - b.id);
  });
}

function selectPriorSearchSources(
  priorEvents: FeedbackEventRow[],
  citation: FeedbackEventRow,
  maxSources: number = DEFAULT_MAX_SOURCES,
): FeedbackEventRow[] {
  const deduped = new Map<string, FeedbackEventRow>();

  for (const event of priorEvents) {
    if (event.type !== 'search_shown') continue;
    if (event.session_id !== citation.session_id) continue;
    if (event.memory_id === citation.memory_id) continue;
    const existing = deduped.get(event.memory_id);
    const existingSameQuery = existing?.query_id === citation.query_id;
    const eventSameQuery = event.query_id === citation.query_id;
    if (
      !existing
      || (eventSameQuery && !existingSameQuery)
      || (eventSameQuery === existingSameQuery && (event.timestamp > existing.timestamp || (event.timestamp === existing.timestamp && event.id > existing.id)))
    ) {
      deduped.set(event.memory_id, event);
    }
  }

  return [...deduped.values()]
    .sort((a, b) => {
      const sameQueryA = a.query_id === citation.query_id ? 0 : 1;
      const sameQueryB = b.query_id === citation.query_id ? 0 : 1;
      return (sameQueryA - sameQueryB)
        || (b.timestamp - a.timestamp)
        || (a.id - b.id)
        || a.memory_id.localeCompare(b.memory_id);
    })
    .slice(0, Math.max(1, Math.floor(maxSources)));
}

function readExistingEdge(
  db: Database.Database,
  sourceId: string,
  targetId: string,
  relation: RelationType,
): ExistingEdgeRow | null {
  try {
    const row = db.prepare(`
      SELECT id, created_by
      FROM causal_edges
      WHERE source_id = ? AND target_id = ? AND relation = ?
        AND COALESCE(source_anchor, '') = ''
        AND COALESCE(target_anchor, '') = ''
      LIMIT 1
    `).get(sourceId, targetId, relation) as ExistingEdgeRow | undefined;
    return row ?? null;
  } catch {
    return null;
  }
}

function createNoopResult(
  runAt: number,
  windowStart: number,
  windowEnd: number,
  dryRun: boolean,
  reason: SkipReason,
): SessionTraceCausalReducerResult {
  return {
    runAt,
    windowStart,
    windowEnd,
    flagEnabled: false,
    dryRun,
    totalEventsProcessed: 0,
    citationsEvaluated: 0,
    candidatesEvaluated: 0,
    edgesInserted: 0,
    skipped: [{ reason }],
    candidates: [],
  };
}

function buildEvidence(candidate: SessionTraceCandidate): string {
  return `session_trace session=${candidate.sessionId} query=${candidate.queryId}`;
}

function runSessionTraceCausalReducer(
  db: Database.Database,
  opts: SessionTraceCausalReducerOptions = {},
): SessionTraceCausalReducerResult {
  const runAt = opts.runAt ?? Date.now();
  const windowEnd = opts.until ?? runAt;
  const windowStart = opts.since ?? (windowEnd - (opts.windowMs ?? DEFAULT_WINDOW_MS));
  const dryRun = opts.dryRun ?? false;

  if (!isSessionTraceCausalInferenceEnabled()) {
    return createNoopResult(runAt, windowStart, windowEnd, dryRun, 'flag_off');
  }

  const relation = SESSION_TRACE_RELATION;

  initFeedbackLedger(db);
  if (!dryRun) initCausalEdges(db);

  const events = sortFeedbackEvents(getFeedbackEvents(db, { since: windowStart, until: windowEnd }));
  const bySession = new Map<string, FeedbackEventRow[]>();
  const skipped: SessionTraceSkip[] = [];
  const candidates: SessionTraceCandidate[] = [];
  let citationsEvaluated = 0;
  let edgesInserted = 0;

  for (const event of events) {
    if (!event.session_id) {
      if (event.type === 'result_cited') {
        skipped.push({ reason: 'missing_session', sessionId: event.session_id, queryId: event.query_id, targetId: event.memory_id });
      }
      continue;
    }

    let priorEvents = bySession.get(event.session_id);
    if (!priorEvents) {
      priorEvents = [];
      bySession.set(event.session_id, priorEvents);
    }

    if (event.type === 'result_cited') {
      citationsEvaluated++;
      const sources = selectPriorSearchSources(priorEvents, event, opts.maxSourcesPerCitation ?? DEFAULT_MAX_SOURCES);
      if (sources.length === 0) {
        const hadSelfCandidate = priorEvents.some((prior) => prior.type === 'search_shown' && prior.memory_id === event.memory_id);
        skipped.push({
          reason: hadSelfCandidate ? 'self_candidate' : 'no_prior_source',
          sessionId: event.session_id,
          queryId: event.query_id,
          targetId: event.memory_id,
        });
      }

      for (const source of sources) {
        const candidate: SessionTraceCandidate = {
          sessionId: event.session_id,
          queryId: event.query_id,
          sourceId: source.memory_id,
          targetId: event.memory_id,
          citationEventId: event.id,
          sourceEventId: source.id,
        };
        candidates.push(candidate);

        const existing = readExistingEdge(db, candidate.sourceId, candidate.targetId, relation);
        if (existing?.created_by === CREATED_BY) {
          skipped.push({ reason: 'already_created', sessionId: candidate.sessionId, queryId: candidate.queryId, sourceId: candidate.sourceId, targetId: candidate.targetId });
          continue;
        }
        if (existing) {
          skipped.push({ reason: 'manual_protected', sessionId: candidate.sessionId, queryId: candidate.queryId, sourceId: candidate.sourceId, targetId: candidate.targetId });
          continue;
        }

        if (dryRun) {
          skipped.push({ reason: 'dry_run', sessionId: candidate.sessionId, queryId: candidate.queryId, sourceId: candidate.sourceId, targetId: candidate.targetId });
          continue;
        }

        const insertedId = insertEdge(
          candidate.sourceId,
          candidate.targetId,
          relation,
          EDGE_STRENGTH,
          buildEvidence(candidate),
          true,
          CREATED_BY,
        );

        if (insertedId !== null) {
          edgesInserted++;
        } else {
          skipped.push({
            reason: 'insert_rejected',
            sessionId: candidate.sessionId,
            queryId: candidate.queryId,
            sourceId: candidate.sourceId,
            targetId: candidate.targetId,
          });
        }
      }
    }

    priorEvents.push(event);
  }

  return {
    runAt,
    windowStart,
    windowEnd,
    flagEnabled: true,
    dryRun,
    totalEventsProcessed: events.length,
    citationsEvaluated,
    candidatesEvaluated: candidates.length,
    edgesInserted,
    skipped,
    candidates,
  };
}

function runSessionTraceCausalShadowReplay(
  db: Database.Database,
  opts: Omit<SessionTraceCausalReducerOptions, 'dryRun'> = {},
): SessionTraceCausalReducerResult {
  return runSessionTraceCausalReducer(db, { ...opts, dryRun: true });
}

export {
  CREATED_BY as SESSION_TRACE_CAUSAL_CREATED_BY,
  DEFAULT_MAX_SOURCES as SESSION_TRACE_CAUSAL_MAX_SOURCES,
  EDGE_STRENGTH as SESSION_TRACE_CAUSAL_EDGE_STRENGTH,
  isSessionTraceCausalInferenceEnabled,
  runSessionTraceCausalReducer,
  runSessionTraceCausalShadowReplay,
  selectPriorSearchSources,
};

export type {
  SessionTraceCausalReducerOptions,
  SessionTraceCausalReducerResult,
  SessionTraceCandidate,
  SessionTraceSkip,
};
