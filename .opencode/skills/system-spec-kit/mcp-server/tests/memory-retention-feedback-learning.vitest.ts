// ───────────────────────────────────────────────────────────────────
// MODULE: Memory Retention Feedback Learning Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it, vi } from 'vitest';

import type { AggregatedSignal } from '../lib/feedback/batch-learning.js';
import { logFeedbackEvent } from '../lib/feedback/feedback-ledger.js';
import { runMemoryRetentionSweep } from '../lib/governance/memory-retention-sweep.js';
import { createMemoryIndexTestDatabase } from './fixtures/memory-index-db.js';

function isoOffset(ms: number): string {
  return new Date(Date.now() + ms).toISOString();
}

function insertMemory(
  db: ReturnType<typeof createMemoryIndexTestDatabase>,
  id: number,
  tier: string,
  deleteAfter = isoOffset(-3_600_000),
  isPinned = 0,
): void {
  db.prepare(`
    INSERT INTO memory_index (
      id, spec_folder, file_path, title, trigger_phrases, content_hash,
      content_text, embedding_status, created_at, updated_at,
      importance_tier, is_pinned, tenant_id, user_id, agent_id, session_id, delete_after
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'success', ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    'specs/test-retention-learning',
    `specs/test-retention-learning/${id}.md`,
    `memory ${id}`,
    JSON.stringify([`memory ${id}`]),
    `hash-${id}`,
    `memory ${id} content`,
    isoOffset(-10_000),
    isoOffset(-10_000),
    tier,
    isPinned,
    'tenant-a',
    'user-a',
    'agent-a',
    'session-a',
    deleteAfter,
  );
}

function signal(memoryId: number, overrides: Partial<AggregatedSignal> = {}): AggregatedSignal {
  return {
    memoryId: String(memoryId),
    sessionCount: 3,
    queryCount: 2,
    strongCount: 3,
    mediumCount: 0,
    weakCount: 0,
    firstSeen: 1_780_000_000_000,
    lastSeen: 1_780_000_000_000,
    weightedHitCount: 3,
    weightedScore: 3,
    computedBoost: 0.03,
    ...overrides,
  };
}

function memoryIds(db: ReturnType<typeof createMemoryIndexTestDatabase>): number[] {
  return (db.prepare('SELECT id FROM memory_index ORDER BY id').all() as Array<{ id: number }>)
    .map((row) => row.id);
}

function auditRows(db: ReturnType<typeof createMemoryIndexTestDatabase>): Array<{
  decision: string;
  memory_id: number;
  reason: string;
  metadata: string;
}> {
  return db.prepare(`
    SELECT decision, memory_id, reason, metadata
    FROM governance_audit
    WHERE action = 'feedback_retention_learning'
    ORDER BY memory_id
  `).all() as Array<{ decision: string; memory_id: number; reason: string; metadata: string }>;
}

function deleteAfterById(db: ReturnType<typeof createMemoryIndexTestDatabase>): Record<number, string | null> {
  const rows = db.prepare('SELECT id, delete_after FROM memory_index ORDER BY id').all() as Array<{
    id: number;
    delete_after: string | null;
  }>;
  return Object.fromEntries(rows.map((row) => [row.id, row.delete_after]));
}

describe('memory retention sweep feedback learning', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('leaves the disabled-flag sweep result and mutations on the existing path', () => {
    // Retention forgetting is now default-ON, so the existing-path assertion
    // must pin the flag OFF explicitly to exercise the unchanged sweep.
    vi.stubEnv('SPECKIT_RETENTION_FORGETTING', 'false');
    vi.stubEnv('SPECKIT_FEEDBACK_RETENTION_MODE', 'active');
    const db = createMemoryIndexTestDatabase({ includeContentColumns: true, includeRetentionColumns: true });
    insertMemory(db, 1, 'normal');
    insertMemory(db, 2, 'constitutional');

    const result = runMemoryRetentionSweep(db, {
      feedbackRetention: { shadowEvaluationPassed: true, signals: [signal(1)] },
    });

    expect(result).toMatchObject({
      swept: 1,
      deletedIds: [1],
      protectedIds: [2],
      protectedCount: 1,
    });
    expect(Object.prototype.hasOwnProperty.call(result, 'feedbackRetention')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(result, 'extendedIds')).toBe(false);
    expect(memoryIds(db)).toEqual([2]);
    expect(auditRows(db)).toEqual([]);
  });

  it('dry-run computes feedback decisions with no row or audit mutation', () => {
    vi.stubEnv('SPECKIT_FEEDBACK_RETENTION_LEARNING', 'true');
    const db = createMemoryIndexTestDatabase({ includeContentColumns: true, includeRetentionColumns: true });
    insertMemory(db, 1, 'important');
    insertMemory(db, 2, 'constitutional');
    const beforeRows = memoryIds(db);
    const beforeDeleteAfter = deleteAfterById(db);
    const beforeAuditCount = (db.prepare('SELECT COUNT(*) AS count FROM governance_audit').get() as { count: number }).count;

    const result = runMemoryRetentionSweep(db, {
      dryRun: true,
      feedbackRetention: { signals: [signal(1)] },
    });

    expect(result.feedbackRetention?.decisions.map((decision) => decision.decision)).toEqual(['extend', 'protect']);
    expect(memoryIds(db)).toEqual(beforeRows);
    expect(deleteAfterById(db)).toEqual(beforeDeleteAfter);
    expect((db.prepare('SELECT COUNT(*) AS count FROM governance_audit').get() as { count: number }).count)
      .toBe(beforeAuditCount);
  });

  it('shadow mode writes extend, protect, and delete audits without retention mutation', () => {
    vi.stubEnv('SPECKIT_FEEDBACK_RETENTION_LEARNING', 'true');
    vi.stubEnv('SPECKIT_FEEDBACK_RETENTION_MODE', 'shadow');
    vi.stubEnv('SPECKIT_IMPLICIT_FEEDBACK_LOG', 'true');
    const db = createMemoryIndexTestDatabase({ includeContentColumns: true, includeRetentionColumns: true });
    insertMemory(db, 1, 'important');
    insertMemory(db, 2, 'constitutional');
    insertMemory(db, 3, 'normal');
    const beforeDeleteAfter = deleteAfterById(db);
    const runAt = 1_780_000_000_000;
    for (let index = 0; index < 3; index += 1) {
      logFeedbackEvent(db, {
        type: 'result_cited',
        memoryId: '1',
        queryId: `query-${index}`,
        confidence: 'strong',
        timestamp: runAt - index,
        sessionId: `session-${index}`,
      });
    }

    const result = runMemoryRetentionSweep(db, { feedbackRetention: { runAt } });

    expect(result.swept).toBe(0);
    expect(memoryIds(db)).toEqual([1, 2, 3]);
    expect(deleteAfterById(db)).toEqual(beforeDeleteAfter);
    expect(auditRows(db).map((row) => row.decision)).toEqual(['extend', 'protect', 'delete']);
    expect(auditRows(db).every((row) => JSON.parse(row.metadata).applied === false)).toBe(true);
  });

  it('blocks active mode without the shadow-evaluation gate', () => {
    vi.stubEnv('SPECKIT_FEEDBACK_RETENTION_LEARNING', 'true');
    vi.stubEnv('SPECKIT_FEEDBACK_RETENTION_MODE', 'active');
    const db = createMemoryIndexTestDatabase({ includeContentColumns: true, includeRetentionColumns: true });
    insertMemory(db, 1, 'important');
    const beforeDeleteAfter = deleteAfterById(db);

    const result = runMemoryRetentionSweep(db, {
      feedbackRetention: { signals: [signal(1)], shadowEvaluationPassed: false },
    });

    expect(result.swept).toBe(0);
    expect(result.feedbackRetention?.activeBlocked).toBe(true);
    expect(memoryIds(db)).toEqual([1]);
    expect(deleteAfterById(db)).toEqual(beforeDeleteAfter);
    expect(JSON.parse(auditRows(db)[0].metadata)).toMatchObject({
      mode: 'active',
      applied: false,
      activeGatePassed: false,
    });
  });

  it('active mode applies extend, protect, and delete only with flag and gate', () => {
    vi.stubEnv('SPECKIT_FEEDBACK_RETENTION_LEARNING', 'true');
    vi.stubEnv('SPECKIT_FEEDBACK_RETENTION_MODE', 'active');
    const db = createMemoryIndexTestDatabase({ includeContentColumns: true, includeRetentionColumns: true });
    insertMemory(db, 1, 'important');
    insertMemory(db, 2, 'constitutional');
    insertMemory(db, 3, 'normal');

    const result = runMemoryRetentionSweep(db, {
      feedbackRetention: {
        signals: [signal(1)],
        shadowEvaluationPassed: true,
        runAt: 1_780_000_000_000,
        extendDays: 7,
      },
    });

    expect(result.swept).toBe(1);
    expect(result.deletedIds).toEqual([3]);
    expect(result.extendedIds).toEqual([1]);
    expect(result.protectedIds).toEqual([2]);
    expect(result.feedbackRetention).toMatchObject({
      mode: 'active',
      activeGatePassed: true,
      activeBlocked: false,
      auditCount: 3,
      extendedIds: [1],
      protectedIds: [2],
      deletedIds: [3],
    });
    expect(memoryIds(db)).toEqual([1, 2]);
    expect(deleteAfterById(db)).toMatchObject({
      1: '2026-06-04T20:26:40.000Z',
      2: null,
    });
    expect(auditRows(db).map((row) => row.decision)).toEqual(['extend', 'protect', 'delete']);
    expect(auditRows(db).every((row) => JSON.parse(row.metadata).applied === true)).toBe(true);
  });

  it('does not apply a stale spare-only delete when a concurrent writer raises importance in-flight', () => {
    vi.stubEnv('SPECKIT_FEEDBACK_RETENTION_LEARNING', 'true');
    vi.stubEnv('SPECKIT_FEEDBACK_RETENTION_MODE', 'active');
    vi.stubEnv('SPECKIT_RETENTION_FORGETTING', 'true');
    const db = createMemoryIndexTestDatabase({ includeContentColumns: true, includeRetentionColumns: true });
    // importance_weight defaults to 0.5 (below the 0.85 spare floor), so the
    // pre-transaction decision is a spare-only delete.
    insertMemory(db, 1, 'normal');

    // Simulate a concurrent writer that raises importance above the spare floor
    // AFTER candidate selection but BEFORE the in-transaction re-read. The hook
    // fires once, exactly when getCurrentExpiredRow re-reads the row by id, using
    // the original prepare to bypass this proxy.
    const originalPrepare = db.prepare.bind(db);
    let raisedInFlight = false;
    // @ts-expect-error — test-only proxy over the better-sqlite3 prepare().
    db.prepare = (sql: string) => {
      if (!raisedInFlight && /FROM memory_index\s+WHERE id = \?/i.test(sql)) {
        raisedInFlight = true;
        originalPrepare('UPDATE memory_index SET importance_weight = 0.95 WHERE id = ?').run(1);
      }
      return originalPrepare(sql);
    };

    const result = runMemoryRetentionSweep(db, {
      feedbackRetention: {
        signals: [],
        shadowEvaluationPassed: true,
        runAt: 1_780_000_000_000,
      },
    });

    expect(raisedInFlight).toBe(true);
    // Before the fix the stale delete decision deletes the row; the in-tx spare
    // re-validation now protects it.
    expect(result.swept).toBe(0);
    expect(result.deletedIds).toEqual([]);
    expect(result.protectedIds).toEqual([1]);
    expect(memoryIds(db)).toEqual([1]);
    expect(deleteAfterById(db)[1]).toBeNull();

    const audits = auditRows(db);
    expect(audits.map((row) => ({ decision: row.decision, reason: row.reason }))).toEqual([
      { decision: 'protect', reason: 'importance_axis_spared' },
    ]);
    expect(JSON.parse(audits[0].metadata).applied).toBe(true);
  });
});
