import { afterEach, describe, expect, it, vi } from 'vitest';

import { aggregateEvents } from '../lib/feedback/batch-learning.js';
import type { AggregatedSignal } from '../lib/feedback/batch-learning.js';
import { initFeedbackLedger, logFeedbackEvent } from '../lib/feedback/feedback-ledger.js';
import type { FeedbackEvent } from '../lib/feedback/feedback-ledger.js';
import { runSessionTraceCausalReducer } from '../lib/feedback/session-trace-causal-reducer.js';
import { runMemoryRetentionSweep } from '../lib/governance/memory-retention-sweep.js';
import * as causalEdges from '../lib/storage/causal-edges.js';
import { createMemoryIndexTestDatabase } from './fixtures/memory-index-db.js';

type IntegrationDb = ReturnType<typeof createMemoryIndexTestDatabase>;

const BASE_TS = 1_780_000_000_000;
const EXPIRED_AT = '2025-01-01T00:00:00.000Z';

function createIntegrationDb(): IntegrationDb {
  const db = createMemoryIndexTestDatabase({ includeContentColumns: true, includeRetentionColumns: true });
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
    );

    CREATE TABLE IF NOT EXISTS weight_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      edge_id INTEGER NOT NULL REFERENCES causal_edges(id) ON DELETE CASCADE,
      old_strength REAL NOT NULL,
      new_strength REAL NOT NULL,
      changed_by TEXT DEFAULT 'manual',
      changed_at TEXT DEFAULT (datetime('now')),
      reason TEXT
    );
  `);
  causalEdges.init(db);
  return db;
}

function insertMemory(db: IntegrationDb, id: number, tier: string): void {
  db.prepare(`
    INSERT INTO memory_index (
      id, spec_folder, file_path, title, trigger_phrases, content_hash,
      content_text, embedding_status, created_at, updated_at,
      importance_tier, is_pinned, tenant_id, user_id, agent_id, session_id, delete_after
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'success', ?, ?, ?, 0, ?, ?, ?, ?, ?)
  `).run(
    id,
    'specs/feedback-reducers-integration',
    `specs/feedback-reducers-integration/${id}.md`,
    `memory ${id}`,
    JSON.stringify([`memory ${id}`]),
    `hash-${id}`,
    `memory ${id} content`,
    '2026-01-01T00:00:00.000Z',
    '2026-01-01T00:00:00.000Z',
    tier,
    'tenant-a',
    'user-a',
    'agent-a',
    'session-a',
    EXPIRED_AT,
  );
}

function makeEvent(overrides: Partial<FeedbackEvent> = {}): FeedbackEvent {
  return {
    type: 'result_cited',
    memoryId: '1',
    queryId: 'query-a',
    confidence: 'strong',
    timestamp: BASE_TS,
    sessionId: 'session-a',
    ...overrides,
  };
}

function seedEvents(db: IntegrationDb): void {
  const previous = process.env.SPECKIT_IMPLICIT_FEEDBACK_LOG;
  process.env.SPECKIT_IMPLICIT_FEEDBACK_LOG = 'true';
  const events: FeedbackEvent[] = [
    makeEvent({ type: 'search_shown', memoryId: '2', queryId: 'query-a', confidence: 'weak', timestamp: BASE_TS + 1, sessionId: 'session-a' }),
    makeEvent({ memoryId: '1', queryId: 'query-a', timestamp: BASE_TS + 2, sessionId: 'session-a' }),
    makeEvent({ memoryId: '1', queryId: 'query-b', timestamp: BASE_TS + 3, sessionId: 'session-b' }),
    makeEvent({ memoryId: '1', queryId: 'query-c', timestamp: BASE_TS + 4, sessionId: 'session-c' }),
  ];
  for (const event of events) {
    logFeedbackEvent(db, event);
  }
  if (previous === undefined) {
    delete process.env.SPECKIT_IMPLICIT_FEEDBACK_LOG;
  } else {
    process.env.SPECKIT_IMPLICIT_FEEDBACK_LOG = previous;
  }
}

function seededIntegrationDb(): IntegrationDb {
  const db = createIntegrationDb();
  insertMemory(db, 1, 'important');
  insertMemory(db, 2, 'normal');
  seedEvents(db);
  return db;
}

function memorySnapshot(db: IntegrationDb): Array<{ id: number; delete_after: string | null }> {
  return db.prepare('SELECT id, delete_after FROM memory_index ORDER BY id').all() as Array<{
    id: number;
    delete_after: string | null;
  }>;
}

function edgeCount(db: IntegrationDb): number {
  const table = db.prepare("SELECT 1 AS present FROM sqlite_master WHERE type = 'table' AND name = 'causal_edges'").get() as { present?: number } | undefined;
  if (table?.present !== 1) return 0;
  return (db.prepare('SELECT COUNT(*) AS count FROM causal_edges').get() as { count: number }).count;
}

function feedbackAuditRows(db: IntegrationDb): Array<{ decision: string; memory_id: number; metadata: string }> {
  return db.prepare(`
    SELECT decision, memory_id, metadata
    FROM governance_audit
    WHERE action = 'feedback_retention_learning'
    ORDER BY memory_id
  `).all() as Array<{ decision: string; memory_id: number; metadata: string }>;
}

function signalFor(signals: AggregatedSignal[], memoryId: string): AggregatedSignal {
  const signal = signals.find((entry) => entry.memoryId === memoryId);
  expect(signal).toBeDefined();
  return signal!;
}

function stableSweepResult(value: ReturnType<typeof runMemoryRetentionSweep>): Omit<ReturnType<typeof runMemoryRetentionSweep>, 'durationMs'> {
  const { durationMs: _durationMs, ...stable } = value;
  return stable;
}

describe('feedback reducer integration', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('keeps all reducer flags unset at safe defaults while aggregation remains read-only', () => {
    const db = seededIntegrationDb();
    const comparisonDb = seededIntegrationDb();

    expect(process.env.SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE).toBeUndefined();
    expect(process.env.SPECKIT_FEEDBACK_RETENTION_LEARNING).toBeUndefined();
    expect(process.env.SPECKIT_FEEDBACK_RETENTION_MODE).toBeUndefined();

    const signals = aggregateEvents(db, BASE_TS, BASE_TS + 10);
    const signal = signalFor(signals, '1');
    const batchRows = (db.prepare('SELECT COUNT(*) AS count FROM batch_learning_log').get() as { count: number }).count;

    expect(signal).toMatchObject({
      weightedHitCount: 3,
      queryCount: 3,
      firstSeen: BASE_TS + 2,
      lastSeen: BASE_TS + 4,
    });
    expect(batchRows).toBe(0);

    const causal = runSessionTraceCausalReducer(db, { runAt: BASE_TS + 10, windowMs: 100 });
    expect(causal).toMatchObject({ flagEnabled: false, edgesInserted: 0 });
    expect(edgeCount(db)).toBe(0);

    const beforeRows = memorySnapshot(db);
    const baselineSweep = runMemoryRetentionSweep(db, { dryRun: true });
    const gatedSweep = runMemoryRetentionSweep(comparisonDb, {
      dryRun: true,
      feedbackRetention: { signals, shadowEvaluationPassed: true, runAt: BASE_TS + 10 },
    });

    expect(stableSweepResult(gatedSweep)).toEqual(stableSweepResult(baselineSweep));
    expect(Object.prototype.hasOwnProperty.call(gatedSweep, 'feedbackRetention')).toBe(false);
    expect(memorySnapshot(db)).toEqual(beforeRows);
    expect(feedbackAuditRows(db)).toEqual([]);
  });

  it('enables causal inference without activating retention learning', () => {
    vi.stubEnv('SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE', 'true');
    const db = seededIntegrationDb();
    const beforeRows = memorySnapshot(db);
    const signals = aggregateEvents(db, BASE_TS, BASE_TS + 10);

    const causal = runSessionTraceCausalReducer(db, { runAt: BASE_TS + 10, windowMs: 100 });
    const sweep = runMemoryRetentionSweep(db, {
      dryRun: true,
      feedbackRetention: { signals, shadowEvaluationPassed: true, runAt: BASE_TS + 10 },
    });

    expect(causal).toMatchObject({ flagEnabled: true, edgesInserted: 1 });
    expect(edgeCount(db)).toBe(1);
    expect(Object.prototype.hasOwnProperty.call(sweep, 'feedbackRetention')).toBe(false);
    expect(memorySnapshot(db)).toEqual(beforeRows);
    expect(feedbackAuditRows(db)).toEqual([]);
  });

  it('enables retention shadow learning without activating causal inference', () => {
    vi.stubEnv('SPECKIT_FEEDBACK_RETENTION_LEARNING', 'true');
    vi.stubEnv('SPECKIT_FEEDBACK_RETENTION_MODE', 'shadow');
    const db = seededIntegrationDb();
    const beforeRows = memorySnapshot(db);
    const signals = aggregateEvents(db, BASE_TS, BASE_TS + 10);

    const causal = runSessionTraceCausalReducer(db, { runAt: BASE_TS + 10, windowMs: 100 });
    const sweep = runMemoryRetentionSweep(db, {
      feedbackRetention: { signals, runAt: BASE_TS + 10, extendDays: 7 },
    });
    const audits = feedbackAuditRows(db);

    expect(causal).toMatchObject({ flagEnabled: false, edgesInserted: 0 });
    expect(edgeCount(db)).toBe(0);
    expect(sweep).toMatchObject({ swept: 0, deletedIds: [], protectedIds: [] });
    expect(sweep.feedbackRetention).toMatchObject({
      mode: 'shadow',
      activeGatePassed: false,
      activeBlocked: false,
      auditCount: 2,
      extendedIds: [],
      deletedIds: [],
    });
    expect(memorySnapshot(db)).toEqual(beforeRows);
    expect(audits.map((row) => row.decision)).toEqual(['extend', 'delete']);
    expect(audits.every((row) => JSON.parse(row.metadata).applied === false)).toBe(true);
  });

  it('blocks requested active retention learning without shadow evaluation evidence', () => {
    vi.stubEnv('SPECKIT_FEEDBACK_RETENTION_LEARNING', 'true');
    vi.stubEnv('SPECKIT_FEEDBACK_RETENTION_MODE', 'active');
    const db = seededIntegrationDb();
    const beforeRows = memorySnapshot(db);
    const signals = aggregateEvents(db, BASE_TS, BASE_TS + 10);

    const sweep = runMemoryRetentionSweep(db, {
      feedbackRetention: { signals, shadowEvaluationPassed: false, runAt: BASE_TS + 10 },
    });
    const audits = feedbackAuditRows(db);

    expect(sweep).toMatchObject({ swept: 0, deletedIds: [], protectedIds: [] });
    expect(sweep.feedbackRetention).toMatchObject({
      mode: 'active',
      activeGatePassed: false,
      activeBlocked: true,
      auditCount: 2,
      extendedIds: [],
      deletedIds: [],
    });
    expect(memorySnapshot(db)).toEqual(beforeRows);
    expect(audits).toHaveLength(2);
    expect(audits.every((row) => {
      const metadata = JSON.parse(row.metadata) as { mode: string; applied: boolean; activeGatePassed: boolean };
      return metadata.mode === 'active' && metadata.applied === false && metadata.activeGatePassed === false;
    })).toBe(true);
  });
});
