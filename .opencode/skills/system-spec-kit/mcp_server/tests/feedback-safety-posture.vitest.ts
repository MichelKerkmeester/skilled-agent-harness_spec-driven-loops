import { afterEach, describe, expect, it, vi } from 'vitest';
import Database from 'better-sqlite3';

import {
  RESERVED_FEEDBACK_TYPE_ERROR_CODE,
  ReservedFeedbackTypeValidationError,
  validateToolArgs,
} from '../schemas/tool-input-schemas';
import {
  assertFeedbackLedgerShadowOnlyTables,
  getFeedbackEvents,
  initFeedbackLedger,
  logFeedbackEvent,
} from '../lib/feedback/feedback-ledger';
import type { FeedbackEvent } from '../lib/feedback/feedback-ledger';
import {
  assertFutureReducerDampingIsSymmetric,
  FUTURE_REDUCER_DAMPING_CONTRACT,
  initBatchLearning,
  isFutureFeedbackDemotionPermitted,
  runBatchLearning,
} from '../lib/feedback/batch-learning';
import {
  clearSession,
  logFollowOnToolUse,
  trackQueryAndDetect,
} from '../lib/feedback/query-flow-tracker';

const BASE_TS = 1_790_000_000_000;

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

function createMemoryDb(): Database.Database {
  const db = new Database(':memory:');
  initBatchLearning(db);
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      title TEXT,
      importance_weight REAL NOT NULL DEFAULT 0.5,
      importance_tier TEXT NOT NULL DEFAULT 'normal',
      state TEXT NOT NULL DEFAULT 'HOT',
      fsrs_stability REAL NOT NULL DEFAULT 1.0,
      fsrs_difficulty REAL NOT NULL DEFAULT 5.0,
      delete_after TEXT
    )
  `);
  db.prepare(`
    INSERT INTO memory_index (
      id, title, importance_weight, importance_tier, state,
      fsrs_stability, fsrs_difficulty, delete_after
    ) VALUES (1, 'protected memory', 0.95, 'constitutional', 'HOT', 3.0, 4.0, NULL)
  `).run();
  return db;
}

function snapshotMemory(db: Database.Database): Record<string, unknown> {
  return db.prepare(`
    SELECT importance_weight, importance_tier, state, fsrs_stability, fsrs_difficulty, delete_after
    FROM memory_index
    WHERE id = 1
  `).get() as Record<string, unknown>;
}

function seedFeedback(db: Database.Database): void {
  const previous = process.env.SPECKIT_IMPLICIT_FEEDBACK_LOG;
  process.env.SPECKIT_IMPLICIT_FEEDBACK_LOG = 'true';
  for (const sessionId of ['session-a', 'session-b', 'session-c']) {
    logFeedbackEvent(db, makeEvent({ sessionId, queryId: `query-${sessionId}` }));
  }
  if (previous === undefined) {
    delete process.env.SPECKIT_IMPLICIT_FEEDBACK_LOG;
  } else {
    process.env.SPECKIT_IMPLICIT_FEEDBACK_LOG = previous;
  }
}

describe('feedback safety posture', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    clearSession('session-a');
    clearSession('session-follow-on');
  });

  it('rejects caller-supplied reserved feedback event types at the schema boundary', () => {
    expect(() => validateToolArgs('memory_save', {
      filePath: '/tmp/example.md',
      feedbackEventType: 'result_cited',
    })).toThrow(ReservedFeedbackTypeValidationError);

    try {
      validateToolArgs('memory_save', {
        filePath: '/tmp/example.md',
        feedbackEventType: 'result_cited',
      });
      expect.unreachable('reserved feedback event type should be rejected');
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(ReservedFeedbackTypeValidationError);
      const typedError = error as ReservedFeedbackTypeValidationError;
      expect(typedError.code).toBe(RESERVED_FEEDBACK_TYPE_ERROR_CODE);
      expect(typedError.details.issueType).toBe('reserved_feedback_type');
      expect(typedError.details.reservedField).toBe('feedbackEventType');
    }
  });

  it('rejects caller-supplied reserved feedback artifact provenance at the schema boundary', () => {
    expect(() => validateToolArgs('memory_update', {
      id: 1,
      title: 'forged feedback update',
      source_kind: 'feedback',
    })).toThrow(ReservedFeedbackTypeValidationError);

    expect(() => validateToolArgs('memory_update', {
      id: 1,
      title: 'forged feedback artifact',
      artifactType: 'feedback_event',
    })).toThrow(ReservedFeedbackTypeValidationError);
  });

  it('keeps normal memory_save and memory_update validation unaffected', () => {
    expect(validateToolArgs('memory_save', {
      filePath: '/tmp/example.md',
      dryRun: true,
    })).toMatchObject({ filePath: '/tmp/example.md', dryRun: true });

    expect(validateToolArgs('memory_update', {
      id: 1,
      title: 'normal update',
      importanceTier: 'normal',
    })).toMatchObject({ id: 1, title: 'normal update', importanceTier: 'normal' });
  });

  it('keeps system-stamped feedback ledger writes outside public tool input validation', () => {
    const db = new Database(':memory:');
    initFeedbackLedger(db);
    const rowId = logFeedbackEvent(db, makeEvent({ type: 'follow_on_tool_use' }));
    expect(rowId).toBeGreaterThan(0);
  });

  it('emits follow-on tool-use feedback as a system-stamped event shape only', () => {
    vi.stubEnv('SPECKIT_IMPLICIT_FEEDBACK_LOG', 'true');
    const db = new Database(':memory:');
    initFeedbackLedger(db);

    trackQueryAndDetect(
      db,
      'session-follow-on',
      'memory hardening search',
      'query-follow-on',
      ['1', '2'],
    );
    logFollowOnToolUse(db, 'session-follow-on');

    const events = getFeedbackEvents(db);
    expect(events).toHaveLength(2);
    expect(events.map((event) => event.type)).toEqual(['follow_on_tool_use', 'follow_on_tool_use']);
    expect(events.every((event) => event.confidence === 'strong')).toBe(true);
    expect(events.every((event) => event.session_id === 'session-follow-on')).toBe(true);
  });

  it('records feedback and batch diagnostics without ranking, retention, or FSRS side effects', () => {
    vi.stubEnv('SPECKIT_BATCH_LEARNED_FEEDBACK', 'true');
    const db = createMemoryDb();
    const before = snapshotMemory(db);

    expect(assertFeedbackLedgerShadowOnlyTables()).toBe(true);
    seedFeedback(db);
    const result = runBatchLearning(db, { runAt: BASE_TS + 10, windowMs: 100, minSupport: 3 });
    const diagnosticRows = (db.prepare('SELECT COUNT(*) AS count FROM batch_learning_log').get() as { count: number }).count;

    expect(result.shadowApplied).toBe(1);
    expect(diagnosticRows).toBe(1);
    expect(snapshotMemory(db)).toEqual(before);
  });

  it('treats ledger append failure as non-fatal to the observed operation', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const failingDb = {
      exec: () => { throw new Error('simulated ledger write failure'); },
    } as unknown as Database.Database;

    const observedSearch = (): string[] => {
      const rowId = logFeedbackEvent(failingDb, makeEvent());
      expect(rowId).toBeNull();
      return ['search-result'];
    };

    expect(observedSearch()).toEqual(['search-result']);
    expect(warn).toHaveBeenCalledWith(
      '[feedback-ledger] logFeedbackEvent error:',
      'simulated ledger write failure',
    );
    warn.mockRestore();
  });

  it('pins the symmetric soft-damping invariant for future reducers', () => {
    expect(assertFutureReducerDampingIsSymmetric()).toBe(true);
    expect(FUTURE_REDUCER_DAMPING_CONTRACT.positiveSignalDamping)
      .toBe(FUTURE_REDUCER_DAMPING_CONTRACT.negativeSignalDamping);
    expect(() => assertFutureReducerDampingIsSymmetric({
      positiveSignalDamping: 0.10,
      negativeSignalDamping: 0.15,
    })).toThrow(/symmetric soft damping/);
  });

  it('keeps constitutional and protected memories immune from feedback-derived demotion contracts', () => {
    expect(isFutureFeedbackDemotionPermitted({ importanceTier: 'constitutional' })).toBe(false);
    expect(isFutureFeedbackDemotionPermitted({ importanceTier: 'critical' })).toBe(false);
    expect(isFutureFeedbackDemotionPermitted({ importanceTier: 'important' })).toBe(false);
    expect(isFutureFeedbackDemotionPermitted({ userConfirmed: true })).toBe(false);
    expect(isFutureFeedbackDemotionPermitted({ sparseDomain: true })).toBe(false);
    expect(isFutureFeedbackDemotionPermitted({ protectedMemory: true })).toBe(false);
    expect(isFutureFeedbackDemotionPermitted({ importanceTier: 'normal' })).toBe(true);
  });
});
