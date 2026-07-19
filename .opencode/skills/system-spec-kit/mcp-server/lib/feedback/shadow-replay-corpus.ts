// ───────────────────────────────────────────────────────────────
// MODULE: Shadow Replay Corpus (privacy-preserving synthetic queries)
// ───────────────────────────────────────────────────────────────
// Builds representative query CLASSES from non-reversible telemetry signals.
// Raw query text is never an input and cannot be an output: synthetic strings
// are drawn verbatim from static intent seed vocabulary, selected by a closed
// (intent, result-count bucket, hash index) key. Reconstruction is impossible
// because user words are never read — the clean consumption_log stores only an
// intent enum, a coarse result-count, and a truncated one-way fingerprint that
// is counted but never decoded.

import type Database from 'better-sqlite3';
import { initConsumptionLog } from '../telemetry/consumption-logger.js';
import { INTENT_REPLAY_SEEDS, RESULT_COUNT_CLASSES, isKnownIntent } from './replay-seed-vocab.js';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

export type ResultCountClass = 'zero' | 'low' | 'mid' | 'high';

export interface SyntheticQueryClass {
  classKey: string;          // class:<intent>:<resultCountClass> — no hash, no text
  intent: string;            // closed vocab
  resultCountClass: ResultCountClass;
  syntheticQuery: string;    // verbatim static seed phrase
  weight: number;            // class frequency over lookback
}

export interface SyntheticReplayCorpus {
  classes: SyntheticQueryClass[];
  intentClasses: Map<string, string>;  // classKey -> intent, for stratified holdout
  corpusAbsent: boolean;                // true only when telemetry is empty
}

/* ───────────────────────────────────────────────────────────────
   2. CLASS SIGNAL BUCKETING
──────────────────────────────────────────────────────────────── */

function bucketResultCount(n: number): ResultCountClass {
  if (n <= 0) return 'zero';
  if (n <= 2) return 'low';
  if (n <= 9) return 'mid';
  return 'high';
}

/**
 * Pure: output depends only on a closed enum + coarse bucket + integer index.
 * The seed pool is a compiled constant, so the returned phrase can never be a
 * user-derived string.
 */
export function synthesizeClassQuery(
  intent: string, rcClass: ResultCountClass, hashBucket: number,
): string {
  const pool = INTENT_REPLAY_SEEDS[intent];           // static constant
  return pool[Math.abs(hashBucket) % pool.length];     // verbatim seed text
}

/* ───────────────────────────────────────────────────────────────
   3. CORPUS BUILDER
──────────────────────────────────────────────────────────────── */

export function buildSyntheticReplayCorpus(
  db: Database.Database,
  opts: { now: number; lookbackMs: number; maxClasses: number },
): SyntheticReplayCorpus {
  initConsumptionLog(db);
  const sinceIso = new Date(opts.now - opts.lookbackMs).toISOString();
  // Only non-reversible signals are selected. query_text is never referenced
  // (it does not exist); query_hash is counted for frequency/index, never decoded.
  const rows = db.prepare(`
    SELECT intent,
           COALESCE(result_count, 0) AS rc,
           COUNT(*) AS freq,
           SUM(instr('0123456789abcdef', substr(lower(query_hash), 1, 1)) - 1) AS hash_acc
    FROM consumption_log
    WHERE event_type = 'search' AND intent IS NOT NULL AND timestamp >= ?
    GROUP BY intent, (CASE WHEN COALESCE(result_count,0)<=0 THEN 0
                           WHEN result_count<=2 THEN 1
                           WHEN result_count<=9 THEN 2 ELSE 3 END)
    ORDER BY freq DESC
    LIMIT ?
  `).all(sinceIso, opts.maxClasses) as Array<{ intent: string; rc: number; freq: number; hash_acc: number }>;

  const classes: SyntheticQueryClass[] = [];
  const intentClasses = new Map<string, string>();
  for (const r of rows) {
    if (!isKnownIntent(r.intent)) continue;            // closed-vocab gate
    const rcClass = bucketResultCount(r.rc);
    const classKey = `class:${r.intent}:${rcClass}`;
    const syntheticQuery = synthesizeClassQuery(r.intent, rcClass, r.hash_acc ?? 0);
    classes.push({ classKey, intent: r.intent, resultCountClass: rcClass, syntheticQuery, weight: r.freq });
    intentClasses.set(classKey, r.intent);
  }
  const corpus: SyntheticReplayCorpus = { classes, intentClasses, corpusAbsent: classes.length === 0 };
  assertCorpusPrivacy(corpus);                          // fail-closed guard
  return corpus;
}

/* ───────────────────────────────────────────────────────────────
   4. PRIVACY GUARD (fail-closed)
──────────────────────────────────────────────────────────────── */

/** The complete, closed key shape of a SyntheticQueryClass. Any other key is a leak. */
const ALLOWED_CLASS_KEYS = new Set(['classKey', 'intent', 'resultCountClass', 'syntheticQuery', 'weight']);

/**
 * Fail-closed. Proves every synthetic string is reproducible from class signals
 * alone (therefore not smuggled text), and that no field carries a hash or raw
 * query content. Throws on the first violation rather than returning a flag, so
 * a privacy regression can never silently produce a corpus.
 */
export function assertCorpusPrivacy(corpus: SyntheticReplayCorpus): void {
  for (const c of corpus.classes) {
    if (!isKnownIntent(c.intent)) throw new Error('corpus privacy: intent outside closed vocab');
    if (!RESULT_COUNT_CLASSES.includes(c.resultCountClass)) throw new Error('corpus privacy: bucket outside closed set');
    const pool = INTENT_REPLAY_SEEDS[c.intent];
    if (!pool.includes(c.syntheticQuery)) throw new Error('corpus privacy: synthetic query not a static seed phrase');
    if (/[0-9a-f]{16}/i.test(c.classKey)) throw new Error('corpus privacy: class key carries a fingerprint');
    // The class key is purely a function of the already-validated closed-vocab signals,
    // so anything other than the canonical shape means smuggled text reached it.
    if (c.classKey !== `class:${c.intent}:${c.resultCountClass}`) throw new Error('corpus privacy: class key not in canonical class:<intent>:<bucket> form');
    // Own-key allowlist, fail-closed: any field beyond the closed class shape (a raw
    // query_text, queryText, rawQuery, or query_hash leak from a future regression) throws.
    for (const key of Object.keys(c as object)) {
      if (!ALLOWED_CLASS_KEYS.has(key)) throw new Error('corpus privacy: forbidden raw-text field present');
    }
  }
}
