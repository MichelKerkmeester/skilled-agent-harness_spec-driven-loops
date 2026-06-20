// ───────────────────────────────────────────────────────────────
// MODULE: True-Citation Emitter (Stage 1 of the outcome signal)
// ───────────────────────────────────────────────────────────────
// The existing result_cited signal is hollow: memory-search logs it for every
// shown result whenever includeContent=true, so cited == shown and the feedback
// corpus holds zero shown-but-unused negatives. Without negatives an outcome
// reranker has nothing to learn from — which is why the deleted rerankers had
// no real signal.
//
// This emitter recovers the missing discrimination from the only ground truth
// available after the fact: what the assistant actually wrote. After a search,
// the shown memory_ids that reappear in the assistant's later output were USED;
// the rest were shown-but-NOT-used. Mining that split per (query_id, memory_id)
// produces the real used/not-used pairs — and the not-used rows are the
// negative examples the corpus lacks.
//
// Stage 1 is the emitter ONLY. It writes to a separate shadow ledger and never
// touches ranking. The reranker that consumes this density is a future packet,
// deferred until the ledger has accumulated enough pairs to be worth training on.
//
// Feature flag: SPECKIT_TRUE_CITATION_EMITTER (opt-in, default OFF). When off,
// every entry point is an early-return no-op, so enabling/disabling the flag
// leaves all other behavior byte-identical.
import type Database from 'better-sqlite3';
import { isTrueCitationEmitterEnabled } from '../search/search-flags.js';
import { getFeedbackEvents } from './feedback-ledger.js';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

/**
 * The shown universe for one search: every memory_id surfaced under a query,
 * recorded at search time (the existing search_shown feedback rows are the
 * natural source). Reconstructing this set is what lets the emitter name the
 * NEGATIVES — a memory_id is only "not used" relative to the set it was shown in.
 */
export interface ShownSet {
  queryId: string;
  /** Memory IDs surfaced for this query, in the order shown. */
  shownMemoryIds: string[];
  /** When the search ran (Unix ms). References are only mined from later turns. */
  shownAt: number;
  sessionId?: string | null;
}

/** A single assistant turn's text, with the time it was emitted. */
export interface AssistantTurnText {
  text: string;
  timestamp: number;
}

/** One mined used/not-used pair for a (query_id, memory_id). */
export interface TrueCitationPair {
  queryId: string;
  memoryId: string;
  /** true = the assistant referenced this shown memory after the search. */
  used: boolean;
  sessionId: string | null;
  /** When the emit was computed (Unix ms). */
  timestamp: number;
}

/** Row shape stored in the true_citation_events shadow table. */
export interface TrueCitationRow {
  id: number;
  query_id: string;
  memory_id: string;
  used: 0 | 1;
  session_id: string | null;
  timestamp: number;
}

/** Outcome of an emit pass. */
export interface TrueCitationEmitResult {
  /** Pairs written (used + not-used combined). */
  emitted: number;
  /** How many of the emitted pairs were positives (referenced). */
  used: number;
  /** How many were negatives (shown but unreferenced) — the corpus's gap. */
  notUsed: number;
}

/* ───────────────────────────────────────────────────────────────
   2. FEATURE FLAG
──────────────────────────────────────────────────────────────── */

/** Re-exported so callers gate on a single import alongside the emit fns. */
export { isTrueCitationEmitterEnabled };

/* ───────────────────────────────────────────────────────────────
   3. SCHEMA — separate shadow ledger
──────────────────────────────────────────────────────────────── */

// A NEW table rather than a column on feedback_events: the existing ledger's
// result_cited rows are the hollow signal this work routes around, and mixing a
// trustworthy used/not-used pair into the same rows would re-import that
// ambiguity. The boolean `used` flag is the whole point — it carries the
// negative the old table cannot express.
const TRUE_CITATION_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS true_citation_events (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    query_id   TEXT NOT NULL,
    memory_id  TEXT NOT NULL,
    used       INTEGER NOT NULL CHECK(used IN (0, 1)),
    session_id TEXT,
    timestamp  INTEGER NOT NULL,
    UNIQUE(query_id, memory_id)
  )
`;

const TRUE_CITATION_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_true_citation_query   ON true_citation_events(query_id);
  CREATE INDEX IF NOT EXISTS idx_true_citation_memory  ON true_citation_events(memory_id);
  CREATE INDEX IF NOT EXISTS idx_true_citation_used    ON true_citation_events(used);
  CREATE INDEX IF NOT EXISTS idx_true_citation_session ON true_citation_events(session_id)
`;

/** This ledger is shadow-only and must never join the live ranking path. */
export const TRUE_CITATION_SHADOW_ONLY_TABLES = Object.freeze(['true_citation_events'] as const);

const initializedDbs = new WeakSet<object>();

/**
 * Ensure the true_citation_events table and indices exist. Idempotent.
 */
export function initTrueCitationLedger(db: Database.Database): void {
  if (initializedDbs.has(db)) return;
  db.exec(TRUE_CITATION_SCHEMA_SQL);
  db.exec(TRUE_CITATION_INDEX_SQL);
  initializedDbs.add(db);
}

/* ───────────────────────────────────────────────────────────────
   4. REFERENCE DETECTION (pure)
──────────────────────────────────────────────────────────────── */

// A memory_id is "referenced" when its token appears in the assistant's text as
// a standalone token, not as a substring of a longer run of word characters.
// Substring matching would let id "12" spuriously match "120" or "v1.2"; a
// word-boundary match keeps the negative set honest (a false positive would
// silently convert a real negative into a fake positive, poisoning the exact
// signal Stage 1 exists to produce).
function buildMemoryIdMatcher(memoryId: string): RegExp | null {
  const trimmed = memoryId.trim();
  if (!trimmed) return null;
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // (?<![\w-]) / (?![\w-]) treats hyphens as part of the id token too, so
  // "mem-1" is not matched inside "mem-12".
  return new RegExp(`(?<![\\w-])${escaped}(?![\\w-])`, 'u');
}

/**
 * Return the subset of shown memory_ids that the assistant actually referenced
 * in any of the supplied (post-search) turns.
 *
 * Pure and side-effect free so the used/not-used split can be unit-tested
 * without a database or a transcript file.
 */
export function detectReferencedMemoryIds(
  shownMemoryIds: string[],
  assistantTurns: AssistantTurnText[],
): Set<string> {
  const referenced = new Set<string>();
  if (shownMemoryIds.length === 0 || assistantTurns.length === 0) {
    return referenced;
  }

  const combinedText = assistantTurns.map((turn) => turn.text).join('\n');
  for (const memoryId of shownMemoryIds) {
    const matcher = buildMemoryIdMatcher(memoryId);
    if (matcher && matcher.test(combinedText)) {
      referenced.add(memoryId.trim());
    }
  }
  return referenced;
}

/* ───────────────────────────────────────────────────────────────
   5. PAIR MINING (pure)
──────────────────────────────────────────────────────────────── */

/**
 * Mine used/not-used pairs for one shown set against the assistant turns that
 * followed the search. Only turns emitted at or after `shownSet.shownAt` count
 * as references — a memory_id mentioned BEFORE its search was not a citation of
 * that search's result.
 *
 * Pure: returns the pairs, writes nothing. Every shown memory_id yields exactly
 * one pair, so the negatives (used=false) are emitted explicitly rather than
 * inferred from their absence.
 */
export function mineTrueCitationPairs(
  shownSet: ShownSet,
  assistantTurns: AssistantTurnText[],
  now: number = Date.now(),
): TrueCitationPair[] {
  const uniqueShown = [...new Set(shownSet.shownMemoryIds.map((id) => id.trim()).filter(Boolean))];
  if (uniqueShown.length === 0) {
    return [];
  }

  const postSearchTurns = assistantTurns.filter((turn) => turn.timestamp >= shownSet.shownAt);
  const referenced = detectReferencedMemoryIds(uniqueShown, postSearchTurns);

  return uniqueShown.map((memoryId) => ({
    queryId: shownSet.queryId,
    memoryId,
    used: referenced.has(memoryId),
    sessionId: shownSet.sessionId ?? null,
    timestamp: now,
  }));
}

/* ───────────────────────────────────────────────────────────────
   6. EMIT (DB write, flag-gated)
──────────────────────────────────────────────────────────────── */

/**
 * Compute and persist used/not-used pairs for every shown set against the
 * assistant turns mined from a transcript.
 *
 * No-op (returns zeros, touches nothing) when the flag is OFF, so toggling the
 * flag preserves byte-identity of all other behavior. Failures are swallowed
 * and reported as zeros — the shadow signal must never break a session-stop hook.
 *
 * INSERT OR IGNORE on the UNIQUE(query_id, memory_id) constraint makes re-runs
 * over an overlapping transcript window idempotent: the first emit for a pair
 * wins and later passes skip it, so replaying a partly-seen transcript cannot
 * double-count or flip an already-recorded pair.
 */
export function emitTrueCitations(
  db: Database.Database,
  shownSets: ShownSet[],
  assistantTurns: AssistantTurnText[],
  now: number = Date.now(),
): TrueCitationEmitResult {
  const empty: TrueCitationEmitResult = { emitted: 0, used: 0, notUsed: 0 };
  if (!isTrueCitationEmitterEnabled()) return empty;
  if (shownSets.length === 0) return empty;

  try {
    initTrueCitationLedger(db);

    const pairs: TrueCitationPair[] = [];
    for (const shownSet of shownSets) {
      pairs.push(...mineTrueCitationPairs(shownSet, assistantTurns, now));
    }
    if (pairs.length === 0) return empty;

    const insert = db.prepare(`
      INSERT OR IGNORE INTO true_citation_events (query_id, memory_id, used, session_id, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result: TrueCitationEmitResult = { emitted: 0, used: 0, notUsed: 0 };
    const writeAll = db.transaction((rows: TrueCitationPair[]) => {
      for (const pair of rows) {
        const outcome = insert.run(
          pair.queryId,
          pair.memoryId,
          pair.used ? 1 : 0,
          pair.sessionId,
          pair.timestamp,
        ) as { changes: number };
        if (outcome.changes > 0) {
          result.emitted += 1;
          if (pair.used) result.used += 1;
          else result.notUsed += 1;
        }
      }
    });
    writeAll(pairs);

    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[true-citation-emitter] emitTrueCitations error:', message);
    return empty;
  }
}

/* ───────────────────────────────────────────────────────────────
   7. SHOWN-SET RECONSTRUCTION (from the feedback ledger)
──────────────────────────────────────────────────────────────── */

/**
 * Rebuild the per-query shown universe from the existing search_shown feedback
 * rows. The hollow result_cited rows are deliberately ignored — only what was
 * SHOWN matters, because the used/not-used split is recomputed from the
 * transcript, not trusted from the old citation flag.
 *
 * Optionally scoped to a session (the session-stop hook only mines the session
 * it is closing) and to a time floor (so a re-run skips already-mined windows).
 */
export function reconstructShownSets(
  db: Database.Database,
  opts: { sessionId?: string; since?: number } = {},
): ShownSet[] {
  const rows = getFeedbackEvents(db, {
    type: 'search_shown',
    sessionId: opts.sessionId,
    since: opts.since,
  });

  // Group shown memory_ids by query_id, preserving first-seen order and the
  // earliest shown timestamp (the reference window opens when the search ran).
  const byQuery = new Map<string, ShownSet>();
  for (const row of rows) {
    const existing = byQuery.get(row.query_id);
    if (existing) {
      if (!existing.shownMemoryIds.includes(row.memory_id)) {
        existing.shownMemoryIds.push(row.memory_id);
      }
      if (row.timestamp < existing.shownAt) {
        existing.shownAt = row.timestamp;
      }
    } else {
      byQuery.set(row.query_id, {
        queryId: row.query_id,
        shownMemoryIds: [row.memory_id],
        shownAt: row.timestamp,
        sessionId: row.session_id,
      });
    }
  }

  return [...byQuery.values()];
}

/**
 * End-to-end Stage 1 emit for one session: reconstruct what was shown from the
 * feedback ledger, mine the supplied assistant turns for which shown memory_ids
 * were referenced, and persist the used/not-used pairs.
 *
 * The session-stop hook is the natural caller — it already parses the
 * transcript, so it hands the assistant turns in and lets this own the shown-set
 * reconstruction + emit. No-op when the flag is OFF.
 */
export function emitTrueCitationsForSession(
  db: Database.Database,
  assistantTurns: AssistantTurnText[],
  opts: { sessionId?: string; since?: number; now?: number } = {},
): TrueCitationEmitResult {
  const empty: TrueCitationEmitResult = { emitted: 0, used: 0, notUsed: 0 };
  if (!isTrueCitationEmitterEnabled()) return empty;

  try {
    const shownSets = reconstructShownSets(db, { sessionId: opts.sessionId, since: opts.since });
    return emitTrueCitations(db, shownSets, assistantTurns, opts.now ?? Date.now());
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[true-citation-emitter] emitTrueCitationsForSession error:', message);
    return empty;
  }
}

/* ───────────────────────────────────────────────────────────────
   8. READ HELPERS (diagnostics / future-stage consumption)
──────────────────────────────────────────────────────────────── */

export interface GetTrueCitationsOptions {
  queryId?: string;
  memoryId?: string;
  used?: boolean;
  sessionId?: string;
  limit?: number;
}

/**
 * Read mined pairs back out, newest first. Used by tests and any future
 * density-check before a reranker is considered.
 */
export function getTrueCitations(
  db: Database.Database,
  opts: GetTrueCitationsOptions = {},
): TrueCitationRow[] {
  try {
    initTrueCitationLedger(db);

    const conditions: string[] = [];
    const params: Array<string | number> = [];
    if (opts.queryId !== undefined) {
      conditions.push('query_id = ?');
      params.push(opts.queryId);
    }
    if (opts.memoryId !== undefined) {
      conditions.push('memory_id = ?');
      params.push(opts.memoryId);
    }
    if (opts.used !== undefined) {
      conditions.push('used = ?');
      params.push(opts.used ? 1 : 0);
    }
    if (opts.sessionId !== undefined) {
      conditions.push('session_id = ?');
      params.push(opts.sessionId);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limit = opts.limit ? `LIMIT ${Math.max(1, Math.floor(opts.limit))}` : '';
    const sql = `SELECT * FROM true_citation_events ${where} ORDER BY timestamp DESC, id DESC ${limit}`;
    return db.prepare(sql).all(...params) as TrueCitationRow[];
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[true-citation-emitter] getTrueCitations error:', message);
    return [];
  }
}

/** Count rows, optionally filtered by used/not-used. */
export function getTrueCitationCount(db: Database.Database, used?: boolean): number {
  try {
    initTrueCitationLedger(db);
    if (used !== undefined) {
      const row = db.prepare('SELECT COUNT(*) AS count FROM true_citation_events WHERE used = ?')
        .get(used ? 1 : 0) as { count: number };
      return row.count;
    }
    const row = db.prepare('SELECT COUNT(*) AS count FROM true_citation_events').get() as { count: number };
    return row.count;
  } catch {
    return 0;
  }
}

export { TRUE_CITATION_SCHEMA_SQL, TRUE_CITATION_INDEX_SQL };
