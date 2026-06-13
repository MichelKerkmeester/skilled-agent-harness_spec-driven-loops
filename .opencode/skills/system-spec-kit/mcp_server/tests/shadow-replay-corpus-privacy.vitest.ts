// ───────────────────────────────────────────────────────────────
// PRIVACY TESTS — Shadow Replay Corpus
// ───────────────────────────────────────────────────────────────
// Locks the corpus privacy invariant: raw query text and its fingerprint
// appear nowhere in the corpus; every synthetic string is byte-equal to a
// static seed phrase selected by closed class signals (reproducible ⇒ not
// smuggled); distinct raw queries in one class collapse to one synthetic
// query (a content channel would diverge); and the fail-closed guard rejects
// any mutation that introduces text outside the static vocabulary.
// Uses in-memory SQLite only — never touches real filesystem paths.

import { describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import {
  initConsumptionLog,
  logConsumptionEvent,
  computeQueryFingerprint,
} from '../lib/telemetry/consumption-logger.js';
import {
  assertCorpusPrivacy,
  buildSyntheticReplayCorpus,
  synthesizeClassQuery,
  type SyntheticReplayCorpus,
} from '../lib/feedback/shadow-replay-corpus.js';
import { INTENT_REPLAY_SEEDS } from '../lib/feedback/replay-seed-vocab.js';

const SENTINEL = 'SENSITIVE-bananaphone-7f3';
const LOOKBACK_MS = 30 * 864e5;

describe('Privacy: synthetic replay corpus stores no raw query text', () => {
  it('synthetic corpus never contains raw query text', () => {
    const db = new Database(':memory:');
    initConsumptionLog(db);

    // Two DIFFERENT raw queries, SAME (intent, result_count) class.
    logConsumptionEvent(db, { event_type: 'search', query: `${SENTINEL} fix the broken parser`, intent: 'fix_bug', result_count: 1 });
    logConsumptionEvent(db, { event_type: 'search', query: 'totally other words crash dump', intent: 'fix_bug', result_count: 2 });

    const corpus = buildSyntheticReplayCorpus(db, { now: Date.now(), lookbackMs: LOOKBACK_MS, maxClasses: 100 });
    const blob = JSON.stringify(corpus);

    // (a) no sentinel / raw token anywhere
    expect(blob).not.toContain(SENTINEL);
    expect(blob).not.toContain('bananaphone');
    expect(blob).not.toContain('broken parser');

    // (b) no stored fingerprint leaked into the corpus
    const fp = computeQueryFingerprint(`${SENTINEL} fix the broken parser`)!;
    expect(blob).not.toContain(fp);

    // (c) every synthetic query is a static seed phrase (reproducible from class signals)
    expect(corpus.classes.length).toBeGreaterThan(0);
    for (const c of corpus.classes) {
      expect(INTENT_REPLAY_SEEDS[c.intent]).toContain(c.syntheticQuery);
      // Synthesis is a pure function of class signals: identical inputs yield the identical static phrase.
      expect(synthesizeClassQuery(c.intent, c.resultCountClass, 5)).toBe(synthesizeClassQuery(c.intent, c.resultCountClass, 5));
    }

    // (d) class collapse: two different raw queries in the same class → one synthetic query
    const fixBugLow = corpus.classes.filter(c => c.intent === 'fix_bug' && c.resultCountClass === 'low');
    expect(fixBugLow).toHaveLength(1);
    expect(new Set(fixBugLow.map(c => c.syntheticQuery)).size).toBe(1);

    // (e) no forbidden field names
    expect(blob).not.toMatch(/"query_text"|"rawQuery"|"queryText"/);

    db.close();
  });

  it('privacy guard throws if a synthetic string is mutated to carry smuggled text', () => {
    const corpus = {
      classes: [{
        classKey: 'class:fix_bug:low',
        intent: 'fix_bug',
        resultCountClass: 'low',
        syntheticQuery: `${SENTINEL} leaked`,
        weight: 1,
      }],
      intentClasses: new Map(),
      corpusAbsent: false,
    } as unknown as SyntheticReplayCorpus;

    expect(() => assertCorpusPrivacy(corpus)).toThrow(/not a static seed phrase/);
  });

  it('privacy guard throws if a class key carries a 16-hex fingerprint', () => {
    const fp = computeQueryFingerprint('any raw user query')!;
    expect(fp).toMatch(/^[0-9a-f]{16}$/);

    const corpus = {
      classes: [{
        classKey: `class:fix_bug:${fp}`,
        intent: 'fix_bug',
        resultCountClass: 'low',
        syntheticQuery: INTENT_REPLAY_SEEDS.fix_bug[0],
        weight: 1,
      }],
      intentClasses: new Map(),
      corpusAbsent: false,
    } as unknown as SyntheticReplayCorpus;

    expect(() => assertCorpusPrivacy(corpus)).toThrow(/class key carries a fingerprint/);
  });

  it('privacy guard rejects any field beyond the closed class shape (e.g. a smuggled query_text)', () => {
    const corpus = {
      classes: [{
        classKey: 'class:fix_bug:low',
        intent: 'fix_bug',
        resultCountClass: 'low',
        syntheticQuery: INTENT_REPLAY_SEEDS.fix_bug[0],
        weight: 1,
        query_text: 'a raw user query that must never appear',
      }],
      intentClasses: new Map(),
      corpusAbsent: false,
    } as unknown as SyntheticReplayCorpus;
    expect(() => assertCorpusPrivacy(corpus)).toThrow(/forbidden raw-text field present/);
  });

  it('corpus is representative: one class per observed (intent,rc) bucket, weighted by frequency', () => {
    const db = new Database(':memory:');
    initConsumptionLog(db);

    // fix_bug:low ×2, fix_bug:mid ×1, understand:zero ×1 — distinct raw text each time.
    logConsumptionEvent(db, { event_type: 'search', query: 'one broken thing', intent: 'fix_bug', result_count: 1 });
    logConsumptionEvent(db, { event_type: 'search', query: 'another broken thing', intent: 'fix_bug', result_count: 2 });
    logConsumptionEvent(db, { event_type: 'search', query: 'mid-sized failure trace', intent: 'fix_bug', result_count: 6 });
    logConsumptionEvent(db, { event_type: 'search', query: 'explain the design please', intent: 'understand', result_count: 0 });

    const corpus = buildSyntheticReplayCorpus(db, { now: Date.now(), lookbackMs: LOOKBACK_MS, maxClasses: 100 });
    const byKey = new Map(corpus.classes.map(c => [c.classKey, c]));

    // One class per observed bucket — no per-raw-query rows.
    expect(byKey.get('class:fix_bug:low')?.weight).toBe(2);
    expect(byKey.get('class:fix_bug:mid')?.weight).toBe(1);
    expect(byKey.get('class:understand:zero')?.weight).toBe(1);

    // intentClasses maps classKey -> intent for the stratified holdout sampler.
    expect(corpus.intentClasses.get('class:fix_bug:low')).toBe('fix_bug');
    expect(corpus.intentClasses.get('class:understand:zero')).toBe('understand');

    // Every synthetic string is drawn verbatim from the static pool.
    for (const c of corpus.classes) {
      expect(INTENT_REPLAY_SEEDS[c.intent]).toContain(c.syntheticQuery);
    }

    db.close();
  });
});
