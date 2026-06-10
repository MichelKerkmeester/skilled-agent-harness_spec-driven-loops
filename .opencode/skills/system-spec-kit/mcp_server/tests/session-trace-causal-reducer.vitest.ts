import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Database from 'better-sqlite3';
import * as causalEdges from '../lib/storage/causal-edges';
import {
  initFeedbackLedger,
  logFeedbackEvent,
} from '../lib/feedback/feedback-ledger';
import type { FeedbackEvent } from '../lib/feedback/feedback-ledger';
import {
  SESSION_TRACE_CAUSAL_CREATED_BY,
  SESSION_TRACE_CAUSAL_EDGE_STRENGTH,
  runSessionTraceCausalReducer,
  runSessionTraceCausalShadowReplay,
  selectPriorSearchSources,
} from '../lib/feedback/session-trace-causal-reducer';

type SqliteDatabase = InstanceType<typeof Database>;

interface EdgeRow {
  id: number;
  source_id: string;
  target_id: string;
  relation: string;
  strength: number;
  evidence: string | null;
  created_by: string;
}

const BASE_TS = 1_700_000_000_000;

function createTestDb(): SqliteDatabase {
  const db = new Database(':memory:');
  initFeedbackLedger(db);
  db.exec(`
    CREATE TABLE IF NOT EXISTS causal_edges (
      id INTEGER PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL CHECK(relation IN (
        'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
      )),
      strength REAL DEFAULT 1.0 CHECK(strength >= 0.0 AND strength <= 1.0),
      evidence TEXT,
      extracted_at TEXT DEFAULT (datetime('now')),
      created_by TEXT DEFAULT 'manual',
      source_anchor TEXT,
      target_anchor TEXT,
      last_accessed TEXT,
      UNIQUE(source_id, target_id, relation)
    )
  `);
  db.exec(`
    CREATE TABLE IF NOT EXISTS weight_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      edge_id INTEGER NOT NULL REFERENCES causal_edges(id) ON DELETE CASCADE,
      old_strength REAL NOT NULL,
      new_strength REAL NOT NULL,
      changed_by TEXT DEFAULT 'manual',
      changed_at TEXT DEFAULT (datetime('now')),
      reason TEXT
    )
  `);
  db.exec(`
    CREATE TABLE IF NOT EXISTS memory_index (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spec_folder TEXT NOT NULL DEFAULT '',
      file_path TEXT NOT NULL DEFAULT '',
      title TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      importance_tier TEXT DEFAULT 'normal'
    )
  `);
  causalEdges.init(db);
  return db;
}

function makeEvent(overrides: Partial<FeedbackEvent> = {}): FeedbackEvent {
  return {
    type: 'search_shown',
    memoryId: 'source-A',
    queryId: 'query-A',
    confidence: 'weak',
    timestamp: BASE_TS,
    sessionId: 'session-A',
    ...overrides,
  };
}

function seedEvents(db: SqliteDatabase, events: FeedbackEvent[]): void {
  vi.stubEnv('SPECKIT_IMPLICIT_FEEDBACK_LOG', 'true');
  for (const event of events) {
    logFeedbackEvent(db, event);
  }
}

function getEdges(db: SqliteDatabase): EdgeRow[] {
  return db.prepare(`
    SELECT id, source_id, target_id, relation, strength, evidence, created_by
    FROM causal_edges
    ORDER BY source_id, target_id, relation
  `).all() as EdgeRow[];
}

function countEdges(db: SqliteDatabase): number {
  return (db.prepare('SELECT COUNT(*) AS count FROM causal_edges').get() as { count: number }).count;
}

describe('Session trace causal reducer', () => {
  let db: SqliteDatabase;

  beforeEach(() => {
    db = createTestDb();
    vi.stubEnv('SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE', 'true');
  });

  afterEach(() => {
    db.close();
    vi.unstubAllEnvs();
  });

  it('selects deterministic prior same-session sources with same-query preference and target exclusion', () => {
    seedEvents(db, [
      makeEvent({ memoryId: 'other-session', queryId: 'query-A', timestamp: BASE_TS + 1, sessionId: 'session-B' }),
      makeEvent({ memoryId: 'source-old-other-query', queryId: 'query-Z', timestamp: BASE_TS + 2 }),
      makeEvent({ memoryId: 'source-B', queryId: 'query-A', timestamp: BASE_TS + 3 }),
      makeEvent({ memoryId: 'target', queryId: 'query-A', timestamp: BASE_TS + 4 }),
      makeEvent({ memoryId: 'source-C', queryId: 'query-B', timestamp: BASE_TS + 5 }),
      makeEvent({ memoryId: 'source-D', queryId: 'query-A', timestamp: BASE_TS + 6 }),
      makeEvent({ memoryId: 'source-E', queryId: 'query-A', timestamp: BASE_TS + 7 }),
      makeEvent({ memoryId: 'source-F', queryId: 'query-A', timestamp: BASE_TS + 8 }),
      makeEvent({ memoryId: 'source-recent-other-query', queryId: 'query-Z', timestamp: BASE_TS + 9 }),
      makeEvent({ type: 'result_cited', memoryId: 'target', queryId: 'query-A', confidence: 'strong', timestamp: BASE_TS + 10 }),
    ]);

    const result = runSessionTraceCausalReducer(db, { runAt: BASE_TS + 20, windowMs: 100 });

    expect(result.candidates.map((candidate) => candidate.sourceId)).toEqual([
      'source-F',
      'source-E',
      'source-D',
      'source-B',
      'source-recent-other-query',
    ]);
    expect(result.candidates).toHaveLength(5);
    expect(result.candidates.every((candidate) => candidate.sessionId === 'session-A')).toBe(true);
    expect(result.candidates.every((candidate) => candidate.sourceId !== candidate.targetId)).toBe(true);
    expect(result.edgesInserted).toBe(5);
  });

  it('exports source selection as a pure deterministic helper', () => {
    const citation = { id: 9, type: 'result_cited', memory_id: 'T', query_id: 'q1', confidence: 'strong', timestamp: BASE_TS + 9, session_id: 's1' } as const;
    const prior = [
      { id: 1, type: 'search_shown', memory_id: 'A', query_id: 'q2', confidence: 'weak', timestamp: BASE_TS + 1, session_id: 's1' },
      { id: 2, type: 'search_shown', memory_id: 'B', query_id: 'q1', confidence: 'weak', timestamp: BASE_TS + 2, session_id: 's1' },
      { id: 3, type: 'search_shown', memory_id: 'B', query_id: 'q1', confidence: 'weak', timestamp: BASE_TS + 3, session_id: 's1' },
      { id: 4, type: 'search_shown', memory_id: 'T', query_id: 'q1', confidence: 'weak', timestamp: BASE_TS + 4, session_id: 's1' },
      { id: 5, type: 'search_shown', memory_id: 'C', query_id: 'q1', confidence: 'weak', timestamp: BASE_TS + 5, session_id: 's2' },
    ];

    const selected = selectPriorSearchSources(prior, citation, 5);

    expect(selected.map((event) => event.memory_id)).toEqual(['B', 'A']);
    expect(selected[0]?.id).toBe(3);
  });

  it('writes enabled auto-session edges with weak strength and session/query evidence', () => {
    seedEvents(db, [
      makeEvent({ memoryId: '1', queryId: 'q1', timestamp: BASE_TS + 1 }),
      makeEvent({ memoryId: '2', queryId: 'q1', timestamp: BASE_TS + 2 }),
      makeEvent({ memoryId: '3', queryId: 'q1', timestamp: BASE_TS + 3 }),
      makeEvent({ type: 'result_cited', memoryId: '9', queryId: 'q1', confidence: 'strong', timestamp: BASE_TS + 4 }),
    ]);

    const result = runSessionTraceCausalReducer(db, { runAt: BASE_TS + 10, windowMs: 100 });
    const edges = getEdges(db);

    expect(result.edgesInserted).toBe(3);
    expect(edges).toHaveLength(3);
    for (const edge of edges) {
      expect(edge.relation).toBe(causalEdges.RELATION_TYPES.ENABLED);
      expect(edge.strength).toBeCloseTo(SESSION_TRACE_CAUSAL_EDGE_STRENGTH);
      expect(edge.created_by).toBe(SESSION_TRACE_CAUSAL_CREATED_BY);
      expect(edge.evidence).toBe('session_trace session=session-A query=q1');
    }
  });

  it('is idempotent on rerun over the same session', () => {
    seedEvents(db, [
      makeEvent({ memoryId: '1', queryId: 'q1', timestamp: BASE_TS + 1 }),
      makeEvent({ memoryId: '2', queryId: 'q1', timestamp: BASE_TS + 2 }),
      makeEvent({ memoryId: '3', queryId: 'q1', timestamp: BASE_TS + 3 }),
      makeEvent({ type: 'result_cited', memoryId: '9', queryId: 'q1', confidence: 'strong', timestamp: BASE_TS + 4 }),
    ]);

    const first = runSessionTraceCausalReducer(db, { runAt: BASE_TS + 10, windowMs: 100 });
    const second = runSessionTraceCausalReducer(db, { runAt: BASE_TS + 10, windowMs: 100 });

    expect(first.edgesInserted).toBe(3);
    expect(second.edgesInserted).toBe(0);
    expect(second.skipped.filter((skip) => skip.reason === 'already_created')).toHaveLength(3);
    expect(countEdges(db)).toBe(3);
  });

  it('reuses insertEdge manual-edge protection instead of overwriting curated edges', () => {
    const manualId = causalEdges.insertEdge('1', '9', causalEdges.RELATION_TYPES.ENABLED, 0.9, 'curated', true, 'manual');
    expect(manualId).not.toBeNull();
    seedEvents(db, [
      makeEvent({ memoryId: '1', queryId: 'q1', timestamp: BASE_TS + 1 }),
      makeEvent({ type: 'result_cited', memoryId: '9', queryId: 'q1', confidence: 'strong', timestamp: BASE_TS + 2 }),
    ]);

    const result = runSessionTraceCausalReducer(db, { runAt: BASE_TS + 10, windowMs: 100 });
    const edge = getEdges(db)[0];

    expect(result.edgesInserted).toBe(0);
    expect(result.skipped.some((skip) => skip.reason === 'manual_protected')).toBe(true);
    expect(edge?.created_by).toBe('manual');
    expect(edge?.strength).toBe(0.9);
    expect(edge?.evidence).toBe('curated');
  });

  it('honors edge caps enforced by insertEdge', () => {
    for (let i = 0; i < causalEdges.MAX_EDGES_PER_NODE; i++) {
      causalEdges.insertEdge('hub', `existing-${i}`, causalEdges.RELATION_TYPES.SUPPORTS, 0.8, null, true, 'manual');
    }
    seedEvents(db, [
      makeEvent({ memoryId: 'hub', queryId: 'q1', timestamp: BASE_TS + 1 }),
      makeEvent({ type: 'result_cited', memoryId: 'target', queryId: 'q1', confidence: 'strong', timestamp: BASE_TS + 2 }),
    ]);

    const result = runSessionTraceCausalReducer(db, { runAt: BASE_TS + 10, windowMs: 100 });

    expect(result.edgesInserted).toBe(0);
    expect(result.skipped.some((skip) => skip.reason === 'insert_rejected')).toBe(true);
    expect(getEdges(db).some((edge) => edge.source_id === 'hub' && edge.target_id === 'target')).toBe(false);
  });

  it('creates zero edges and performs no schema initialization while flag is off', () => {
    const bareDb = new Database(':memory:');
    vi.stubEnv('SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE', 'false');

    const result = runSessionTraceCausalReducer(bareDb, { runAt: BASE_TS + 10, windowMs: 100 });
    const tables = bareDb.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as Array<{ name: string }>;

    expect(result.flagEnabled).toBe(false);
    expect(result.edgesInserted).toBe(0);
    expect(result.totalEventsProcessed).toBe(0);
    expect(tables).toEqual([]);
    bareDb.close();
  });

  it('skips citations with no prior shown source', () => {
    seedEvents(db, [
      makeEvent({ type: 'result_cited', memoryId: '9', queryId: 'q1', confidence: 'strong', timestamp: BASE_TS + 1 }),
    ]);

    const result = runSessionTraceCausalReducer(db, { runAt: BASE_TS + 10, windowMs: 100 });

    expect(result.edgesInserted).toBe(0);
    expect(result.skipped.some((skip) => skip.reason === 'no_prior_source')).toBe(true);
    expect(countEdges(db)).toBe(0);
  });

  it('skips candidate sources that equal the cited target', () => {
    seedEvents(db, [
      makeEvent({ memoryId: '9', queryId: 'q1', timestamp: BASE_TS + 1 }),
      makeEvent({ type: 'result_cited', memoryId: '9', queryId: 'q1', confidence: 'strong', timestamp: BASE_TS + 2 }),
    ]);

    const result = runSessionTraceCausalReducer(db, { runAt: BASE_TS + 10, windowMs: 100 });

    expect(result.edgesInserted).toBe(0);
    expect(result.skipped.some((skip) => skip.reason === 'self_candidate')).toBe(true);
    expect(countEdges(db)).toBe(0);
  });

  it('supports a shadow replay entrypoint without mutating edges', () => {
    seedEvents(db, [
      makeEvent({ memoryId: '1', queryId: 'q1', timestamp: BASE_TS + 1 }),
      makeEvent({ memoryId: '2', queryId: 'q1', timestamp: BASE_TS + 2 }),
      makeEvent({ memoryId: '3', queryId: 'q1', timestamp: BASE_TS + 3 }),
      makeEvent({ type: 'result_cited', memoryId: '9', queryId: 'q1', confidence: 'strong', timestamp: BASE_TS + 4 }),
    ]);

    const result = runSessionTraceCausalShadowReplay(db, { runAt: BASE_TS + 10, windowMs: 100 });

    expect(result.dryRun).toBe(true);
    expect(result.candidatesEvaluated).toBe(3);
    expect(result.edgesInserted).toBe(0);
    expect(result.skipped.filter((skip) => skip.reason === 'dry_run')).toHaveLength(3);
    expect(countEdges(db)).toBe(0);
  });
});
