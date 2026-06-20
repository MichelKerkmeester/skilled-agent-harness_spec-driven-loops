import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Database from 'better-sqlite3';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { logFeedbackEvents, initFeedbackLedger } from '../lib/feedback/feedback-ledger.js';
import { parseAssistantTextTurns } from '../hooks/claude/claude-transcript.js';
import {
  detectReferencedMemoryIds,
  emitTrueCitations,
  emitTrueCitationsForSession,
  getTrueCitationCount,
  getTrueCitations,
  initTrueCitationLedger,
  mineTrueCitationPairs,
  reconstructShownSets,
  type AssistantTurnText,
  type ShownSet,
} from '../lib/feedback/true-citation-emitter.js';

function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  initFeedbackLedger(db);
  initTrueCitationLedger(db);
  return db;
}

describe('True-Citation Emitter (Stage 1)', () => {
  beforeEach(() => {
    vi.stubEnv('SPECKIT_TRUE_CITATION_EMITTER', 'true');
    vi.stubEnv('SPECKIT_IMPLICIT_FEEDBACK_LOG', 'true');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  /* ───────────── pure reference detection ───────────── */

  it('matches memory ids on word boundaries, not as substrings', () => {
    const turns: AssistantTurnText[] = [
      { text: 'I relied on memory 12 and mem-7 for the answer.', timestamp: 100 },
    ];
    // "1" must NOT match inside "12"; "mem-7" must NOT match inside a longer id.
    const referenced = detectReferencedMemoryIds(['1', '12', 'mem-7', 'mem-70'], turns);
    expect(referenced.has('12')).toBe(true);
    expect(referenced.has('mem-7')).toBe(true);
    expect(referenced.has('1')).toBe(false);
    expect(referenced.has('mem-70')).toBe(false);
  });

  /* ───────────── pure pair mining: real negatives ───────────── */

  it('emits one pair per shown id, splitting used vs shown-but-unused', () => {
    const shownSet: ShownSet = {
      queryId: 'q1',
      shownMemoryIds: ['101', '102', '103'],
      shownAt: 1000,
      sessionId: 'sess-1',
    };
    const turns: AssistantTurnText[] = [
      { text: 'The decision in memory 101 settles this.', timestamp: 1200 },
    ];

    const pairs = mineTrueCitationPairs(shownSet, turns, 5000);

    // Exactly one pair per shown id — negatives are explicit, not inferred.
    expect(pairs).toHaveLength(3);
    const used = pairs.filter((p) => p.used).map((p) => p.memoryId);
    const notUsed = pairs.filter((p) => !p.used).map((p) => p.memoryId);
    expect(used).toEqual(['101']);
    expect(notUsed.sort()).toEqual(['102', '103']);
  });

  it('does not count a memory mentioned BEFORE its search as a citation', () => {
    const shownSet: ShownSet = {
      queryId: 'q1',
      shownMemoryIds: ['201'],
      shownAt: 1000,
      sessionId: 'sess-1',
    };
    // The only mention happened before the search (timestamp 500 < shownAt 1000).
    const turns: AssistantTurnText[] = [
      { text: 'memory 201 came up earlier', timestamp: 500 },
    ];

    const pairs = mineTrueCitationPairs(shownSet, turns, 5000);
    expect(pairs).toHaveLength(1);
    expect(pairs[0].used).toBe(false);
  });

  /* ───────────── DB emit produces persisted negatives ───────────── */

  it('persists used AND not-used rows to the shadow ledger', () => {
    const db = createTestDb();
    const shownSets: ShownSet[] = [
      { queryId: 'q1', shownMemoryIds: ['101', '102'], shownAt: 1000, sessionId: 'sess-1' },
    ];
    const turns: AssistantTurnText[] = [
      { text: 'memory 101 was the relevant one', timestamp: 1500 },
    ];

    const result = emitTrueCitations(db, shownSets, turns, 9000);

    expect(result.emitted).toBe(2);
    expect(result.used).toBe(1);
    expect(result.notUsed).toBe(1);

    // The negative is actually queryable — this is the corpus gap Stage 1 fills.
    expect(getTrueCitationCount(db, true)).toBe(1);
    expect(getTrueCitationCount(db, false)).toBe(1);

    const negatives = getTrueCitations(db, { used: false });
    expect(negatives).toHaveLength(1);
    expect(negatives[0].memory_id).toBe('102');
    expect(negatives[0].used).toBe(0);
  });

  it('is idempotent across overlapping re-runs (INSERT OR IGNORE)', () => {
    const db = createTestDb();
    const shownSets: ShownSet[] = [
      { queryId: 'q1', shownMemoryIds: ['101', '102'], shownAt: 1000, sessionId: 'sess-1' },
    ];
    const turns: AssistantTurnText[] = [{ text: 'memory 101 helped', timestamp: 1500 }];

    const first = emitTrueCitations(db, shownSets, turns, 9000);
    expect(first.emitted).toBe(2);

    // A second pass over the same window must not double-count or flip rows.
    const second = emitTrueCitations(db, shownSets, turns, 9999);
    expect(second.emitted).toBe(0);
    expect(getTrueCitationCount(db)).toBe(2);
  });

  /* ───────────── flag-off no-op ───────────── */

  it('is a no-op when the flag is OFF', () => {
    vi.stubEnv('SPECKIT_TRUE_CITATION_EMITTER', 'false');
    const db = createTestDb();
    const shownSets: ShownSet[] = [
      { queryId: 'q1', shownMemoryIds: ['101', '102'], shownAt: 1000, sessionId: 'sess-1' },
    ];
    const turns: AssistantTurnText[] = [{ text: 'memory 101 helped', timestamp: 1500 }];

    const result = emitTrueCitations(db, shownSets, turns, 9000);
    expect(result).toEqual({ emitted: 0, used: 0, notUsed: 0 });
    expect(getTrueCitationCount(db)).toBe(0);
  });

  /* ───────────── shown-set reconstruction from the feedback ledger ───────────── */

  it('reconstructs shown sets from search_shown rows, ignoring result_cited', () => {
    const db = createTestDb();
    // search_shown is the shown universe; result_cited is the hollow signal we ignore.
    logFeedbackEvents(db, [
      { type: 'search_shown', memoryId: '101', queryId: 'q1', confidence: 'weak', timestamp: 1000, sessionId: 'sess-1' },
      { type: 'search_shown', memoryId: '102', queryId: 'q1', confidence: 'weak', timestamp: 1000, sessionId: 'sess-1' },
      { type: 'result_cited', memoryId: '101', queryId: 'q1', confidence: 'strong', timestamp: 1001, sessionId: 'sess-1' },
      { type: 'result_cited', memoryId: '102', queryId: 'q1', confidence: 'strong', timestamp: 1001, sessionId: 'sess-1' },
    ]);

    const shownSets = reconstructShownSets(db, { sessionId: 'sess-1' });
    expect(shownSets).toHaveLength(1);
    expect(shownSets[0].queryId).toBe('q1');
    expect(shownSets[0].shownMemoryIds.sort()).toEqual(['101', '102']);
    expect(shownSets[0].shownAt).toBe(1000);
  });

  /* ───────────── end-to-end from a sample transcript file ───────────── */

  it('mines used/not-used + negatives end-to-end from a sample transcript', async () => {
    const db = createTestDb();

    // Seed the shown universe exactly as a real search would have.
    logFeedbackEvents(db, [
      { type: 'search_shown', memoryId: '101', queryId: 'q1', confidence: 'weak', timestamp: 1000, sessionId: 'sess-1' },
      { type: 'search_shown', memoryId: '102', queryId: 'q1', confidence: 'weak', timestamp: 1000, sessionId: 'sess-1' },
      { type: 'search_shown', memoryId: '103', queryId: 'q1', confidence: 'weak', timestamp: 1000, sessionId: 'sess-1' },
    ]);

    // Write a sample transcript where the assistant references ONLY 101 and 103.
    const dir = mkdtempSync(join(tmpdir(), 'true-cite-'));
    const transcriptPath = join(dir, 'transcript.jsonl');
    const lines = [
      JSON.stringify({ message: { role: 'user', content: 'find the auth decision' } }),
      JSON.stringify({
        timestamp: '2026-06-20T00:00:02.000Z',
        message: {
          role: 'assistant',
          content: [
            { type: 'text', text: 'Based on memory 101 and memory 103, the auth path is settled.' },
          ],
        },
      }),
    ];

    try {
      writeFileSync(transcriptPath, lines.join('\n') + '\n', 'utf-8');

      const turns = await parseAssistantTextTurns(transcriptPath);
      expect(turns.length).toBeGreaterThan(0);
      expect(turns[0].text).toContain('memory 101');

      const result = emitTrueCitationsForSession(db, turns, {
        sessionId: 'sess-1',
        // Reference window opened at search time; assistant turn is later.
        now: 5000,
      });

      // 101 + 103 used; 102 shown-but-unused — a real negative.
      expect(result.emitted).toBe(3);
      expect(result.used).toBe(2);
      expect(result.notUsed).toBe(1);

      const negatives = getTrueCitations(db, { used: false });
      expect(negatives.map((r) => r.memory_id)).toEqual(['102']);

      const positives = getTrueCitations(db, { used: true }).map((r) => r.memory_id).sort();
      expect(positives).toEqual(['101', '103']);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
