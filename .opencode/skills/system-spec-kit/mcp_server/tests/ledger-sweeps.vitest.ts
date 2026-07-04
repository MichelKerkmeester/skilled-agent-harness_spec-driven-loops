import { describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';

import { initFeedbackLedger, sweepFeedbackEvents } from '../lib/feedback/feedback-ledger.js';
import { initShadowScoringLog, EVALUATION_WINDOW_MS, sweepShadowScoringLog } from '../lib/feedback/shadow-scoring.js';
import { initBatchLearning, sweepBatchLearningLog } from '../lib/feedback/batch-learning.js';
import { sweepLearnedFeedbackAudit } from '../lib/search/learned-feedback.js';
import { sweepMemoryPromotionAudit } from '../lib/search/auto-promotion.js';
import { sweepMemoryConflicts } from '../lib/search/vector-index-schema.js';
import { ensureAdaptiveTables, sweepAdaptiveSignalEvents } from '../lib/cognitive/adaptive-ranking.js';

function count(db: Database.Database, table: string): number {
  return (db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get() as { count: number }).count;
}

describe('feedback and audit ledger sweeps', () => {
  it('defaults every ledger sweep to dry-run with matched counts', () => {
    const db = new Database(':memory:');
    const now = Date.parse('2026-01-10T00:00:00.000Z');
    const oldMs = now - 10_000;
    const freshMs = now - 100;
    const shadowNow = oldMs + EVALUATION_WINDOW_MS + 10_000;
    const shadowFreshMs = shadowNow - 100;
    const oldIso = new Date(oldMs).toISOString();
    const freshIso = new Date(freshMs).toISOString();

    initFeedbackLedger(db);
    db.prepare("INSERT INTO feedback_events (type, memory_id, query_id, confidence, timestamp, session_id) VALUES ('search_shown', '1', 'q', 'weak', ?, 's')").run(oldMs);
    db.prepare("INSERT INTO feedback_events (type, memory_id, query_id, confidence, timestamp, session_id) VALUES ('search_shown', '2', 'q', 'weak', ?, 's')").run(freshMs);

    initShadowScoringLog(db);
    db.prepare("INSERT INTO shadow_scoring_log (query_id, result_id, live_rank, shadow_rank, delta, direction, evaluated_at, cycle_id) VALUES ('q', '1', 1, 2, 1, 'degraded', ?, 'c-old')").run(oldMs);
    db.prepare("INSERT INTO shadow_scoring_log (query_id, result_id, live_rank, shadow_rank, delta, direction, evaluated_at, cycle_id) VALUES ('q', '2', 1, 1, 0, 'unchanged', ?, 'c-new')").run(shadowFreshMs);

    initBatchLearning(db);
    db.prepare('INSERT INTO batch_learning_log (memory_id, batch_run_at, session_count, weighted_score, computed_boost, shadow_rank_delta, promoted) VALUES (?, ?, 1, 0, 0, NULL, 1)').run('1', oldMs);
    db.prepare('INSERT INTO batch_learning_log (memory_id, batch_run_at, session_count, weighted_score, computed_boost, shadow_rank_delta, promoted) VALUES (?, ?, 1, 0, 0, NULL, 1)').run('2', freshMs);

    sweepLearnedFeedbackAudit(db);
    db.prepare("INSERT INTO learned_feedback_audit (memory_id, action, terms, source, timestamp, shadow_mode) VALUES (1, 'learned', '[\"a\"]', 'test', ?, 0)").run(oldMs);
    db.prepare("INSERT INTO learned_feedback_audit (memory_id, action, terms, source, timestamp, shadow_mode) VALUES (2, 'learned', '[\"b\"]', 'test', ?, 0)").run(freshMs);

    sweepMemoryPromotionAudit(db);
    db.prepare('INSERT INTO memory_promotion_audit (memory_id, previous_tier, new_tier, validation_count, promoted_at) VALUES (1, ?, ?, 5, ?)').run('normal', 'important', oldMs);
    db.prepare('INSERT INTO memory_promotion_audit (memory_id, previous_tier, new_tier, validation_count, promoted_at) VALUES (2, ?, ?, 5, ?)').run('normal', 'important', freshMs);

    db.exec('CREATE TABLE memory_index (id INTEGER PRIMARY KEY)');
    sweepMemoryConflicts(db);
    db.prepare("INSERT INTO memory_conflicts (timestamp, action, similarity, reason) VALUES (?, 'CREATE', 0, 'old')").run(oldIso);
    db.prepare("INSERT INTO memory_conflicts (timestamp, action, similarity, reason) VALUES (?, 'CREATE', 0, 'fresh')").run(freshIso);

    ensureAdaptiveTables(db);
    db.prepare("INSERT INTO adaptive_signal_events (memory_id, signal_type, signal_value, created_at) VALUES (1, 'access', 1, ?)").run(oldIso);
    db.prepare("INSERT INTO adaptive_signal_events (memory_id, signal_type, signal_value, created_at) VALUES (2, 'access', 1, ?)").run(freshIso);

    const options = { olderThanMs: 1_000, now };
    const shadowOptions = { olderThanMs: 1_000, now: shadowNow };

    expect(sweepFeedbackEvents(db, options)).toMatchObject({ table: 'feedback_events', dryRun: true, matched: 1, deleted: 0 });
    expect(sweepShadowScoringLog(db, shadowOptions)).toMatchObject({ table: 'shadow_scoring_log', dryRun: true, matched: 1, deleted: 0 });
    expect(sweepBatchLearningLog(db, options)).toMatchObject({ table: 'batch_learning_log', dryRun: true, matched: 1, deleted: 0 });
    expect(sweepLearnedFeedbackAudit(db, options)).toMatchObject({ table: 'learned_feedback_audit', dryRun: true, matched: 1, deleted: 0 });
    expect(sweepMemoryPromotionAudit(db, options)).toMatchObject({ table: 'memory_promotion_audit', dryRun: true, matched: 1, deleted: 0 });
    expect(sweepMemoryConflicts(db, options)).toMatchObject({ table: 'memory_conflicts', dryRun: true, matched: 1, deleted: 0 });
    expect(sweepAdaptiveSignalEvents(db, options)).toMatchObject({ table: 'adaptive_signal_events', dryRun: true, matched: 1, deleted: 0 });

    expect(count(db, 'feedback_events')).toBe(2);
    db.close();
  });

  it('does not remove shadow scoring rows during the active evaluation window', () => {
    const db = new Database(':memory:');
    const first = 10_000;
    initShadowScoringLog(db);
    db.prepare("INSERT INTO shadow_scoring_log (query_id, result_id, live_rank, shadow_rank, delta, direction, evaluated_at, cycle_id) VALUES ('q', '1', 1, 2, 1, 'degraded', ?, 'c')").run(first);

    const result = sweepShadowScoringLog(db, {
      olderThanMs: 1,
      now: first + EVALUATION_WINDOW_MS - 1,
      dryRun: false,
    });

    expect(result.matched).toBe(0);
    expect(result.deleted).toBe(0);
    expect(count(db, 'shadow_scoring_log')).toBe(1);
    db.close();
  });
});
