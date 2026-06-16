// ───────────────────────────────────────────────────────────────
// TEST: PACKED IN-MEMORY BM25
// ───────────────────────────────────────────────────────────────
import { performance } from 'node:perf_hooks';
import Database from 'better-sqlite3';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  BM25Index,
  BM25_FIELD_WEIGHTS,
  buildBm25DocumentFields,
  shouldWarmInMemoryBm25,
  type BM25DocumentFields,
  type BM25SearchResult,
} from '../lib/search/bm25-index';
import { fts5Bm25Search, isFts5Available } from '../lib/search/sqlite-fts';
import { runBM25EngineComparison, type BM25SearchResult as BaselineResult } from '../lib/eval/bm25-baseline';
import {
  createPackedEvalDocuments,
  createPackedEvalQueries,
  iterateCorpusSizedDocuments,
  type BM25PackedFixtureDocument,
} from '../lib/eval/fixtures/bm25-packed-fixture';

const ORIGINAL_BM25_ENGINE = process.env.SPECKIT_BM25_ENGINE;
const ORIGINAL_ENABLE_BM25 = process.env.ENABLE_BM25;
const RSS_BUDGET_BYTES = 150 * 1024 * 1024;
const WARMUP_BUDGET_MS = 10_000;

function toFields(doc: BM25PackedFixtureDocument): BM25DocumentFields {
  return buildBm25DocumentFields({
    title: doc.title,
    content_text: doc.content_text,
    trigger_phrases: doc.trigger_phrases,
    file_path: doc.file_path,
  });
}

function addFixtureDocuments(index: BM25Index, docs: BM25PackedFixtureDocument[]): void {
  for (const doc of docs) {
    index.addDocumentFields(String(doc.id), toFields(doc));
  }
  index.finalizePackedPostings();
}

function toBaselineResults(results: BM25SearchResult[], source: string): BaselineResult[] {
  return results.map((result) => ({
    id: Number(result.id),
    score: result.score,
    source,
  }));
}

function createFtsDatabase(docs: BM25PackedFixtureDocument[]): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      title TEXT,
      content_text TEXT,
      trigger_phrases TEXT,
      file_path TEXT,
      importance_tier TEXT
    );
    CREATE VIRTUAL TABLE memory_fts USING fts5(
      title,
      trigger_phrases,
      file_path,
      content_text,
      content='memory_index',
      content_rowid='id'
    );
  `);

  const insertMemory = db.prepare(`
    INSERT INTO memory_index (id, title, content_text, trigger_phrases, file_path, importance_tier)
    VALUES (?, ?, ?, ?, ?, 'normal')
  `);
  const insertFts = db.prepare(`
    INSERT INTO memory_fts (rowid, title, trigger_phrases, file_path, content_text)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertAll = db.transaction(() => {
    for (const doc of docs) {
      const triggers = doc.trigger_phrases.join(' ');
      insertMemory.run(doc.id, doc.title, doc.content_text, triggers, doc.file_path);
      insertFts.run(doc.id, doc.title, triggers, doc.file_path, doc.content_text);
    }
  });
  insertAll();
  return db;
}

afterEach(() => {
  if (ORIGINAL_BM25_ENGINE === undefined) {
    delete process.env.SPECKIT_BM25_ENGINE;
  } else {
    process.env.SPECKIT_BM25_ENGINE = ORIGINAL_BM25_ENGINE;
  }

  if (ORIGINAL_ENABLE_BM25 === undefined) {
    delete process.env.ENABLE_BM25;
  } else {
    process.env.ENABLE_BM25 = ORIGINAL_ENABLE_BM25;
  }
  vi.restoreAllMocks();
});

describe('packed in-memory BM25 engine', () => {
  it('warms the corpus fixture within RSS and latency budgets', () => {
    process.env.SPECKIT_BM25_ENGINE = 'packed-inmemory';
    const index = new BM25Index(undefined, undefined, 'packed-inmemory');
    const beforeRss = process.memoryUsage().rss;
    let peakRss = beforeRss;
    const start = performance.now();

    // Sample RSS during warmup, not just after, so the gate measures the peak
    // committed-page high-water-mark (the budgeted metric) rather than a
    // post-finalize snapshot that a transient spike could slip under.
    let processed = 0;
    for (const doc of iterateCorpusSizedDocuments()) {
      index.addDocumentFields(String(doc.id), toFields(doc));
      if ((processed += 1) % 1024 === 0) {
        const rss = process.memoryUsage().rss;
        if (rss > peakRss) peakRss = rss;
      }
    }
    index.finalizePackedPostings();
    {
      const rss = process.memoryUsage().rss;
      if (rss > peakRss) peakRss = rss;
    }

    const warmupMs = performance.now() - start;
    const rssSpike = Math.max(0, peakRss - beforeRss);

    console.info(
      `[bm25-packed] corpus warmup rssSpike=${(rssSpike / (1024 * 1024)).toFixed(1)}MB ` +
      `(budget ${(RSS_BUDGET_BYTES / (1024 * 1024)).toFixed(0)}MB) warmup=${warmupMs.toFixed(0)}ms`
    );

    expect(index.getStats().documentCount).toBe(10_245);
    expect(index.getStats().termCount).toBeGreaterThan(100);
    expect(rssSpike).toBeLessThanOrEqual(RSS_BUDGET_BYTES);
    expect(warmupMs).toBeLessThanOrEqual(WARMUP_BUDGET_MS);
  });

  it('corpus fixture bodies index real BM25 tokens', () => {
    const [firstDoc] = Array.from(iterateCorpusSizedDocuments({ documentCount: 1, targetIndexedBytes: 8_192 }));
    const bodyOnly = new BM25Index(undefined, undefined, 'packed-inmemory');
    bodyOnly.addDocumentFields(String(firstDoc.id), { body: firstDoc.content_text });
    bodyOnly.finalizePackedPostings();

    expect(bodyOnly.getStats().documentCount).toBe(1);
    expect(bodyOnly.getStats().termCount).toBeGreaterThan(0);
  });

  it('finalizes the last warmup batch and frees mutable postings without changing ranking', async () => {
    vi.useFakeTimers();
    const docs: BM25PackedFixtureDocument[] = [];
    for (let i = 1; i <= 600; i += 1) {
      docs.push({
        id: i,
        title: `Warmup Doc ${i}`,
        content_text: `lattice kernel session guard topic${i % 13} payload${i % 7} authentication renewal`,
        trigger_phrases: [`warmup-${i % 5}`],
        file_path: `specs/warmup/${i}.md`,
      });
    }
    const db = createFtsDatabase(docs);

    try {
      const warmed = new BM25Index(undefined, undefined, 'packed-inmemory');
      const scheduled = warmed.rebuildFromDatabase(db);
      expect(scheduled).toBe(600);
      await vi.runAllTimersAsync();

      const internals = warmed as unknown as {
        packedMutablePostings: Map<string, unknown>;
        packedDirtyTerms: Set<string>;
      };
      expect(warmed.getStats().documentCount).toBe(600);
      expect(internals.packedDirtyTerms.size).toBe(0);
      expect(internals.packedMutablePostings.size).toBe(0);

      const direct = new BM25Index(undefined, undefined, 'packed-inmemory');
      addFixtureDocuments(direct, docs);

      for (const query of ['authentication guard', 'session renewal', 'topic5 payload3']) {
        const warmedResults = warmed.search(query, 10);
        const directResults = direct.search(query, 10);
        expect(warmedResults.length).toBeGreaterThan(0);
        expect(warmedResults.map((result) => result.id)).toEqual(directResults.map((result) => result.id));
        warmedResults.forEach((result, position) => {
          expect(result.score).toBeCloseTo(directResults[position].score, 10);
        });
      }

      // Lazy packing after an incremental sync must free the mutable copy too.
      warmed.syncChangedRows(db, [1]);
      expect(internals.packedMutablePostings.size).toBeGreaterThan(0);
      warmed.search('authentication guard', 10);
      expect(internals.packedMutablePostings.has('authentica')).toBe(false);
      expect(internals.packedMutablePostings.has('guard')).toBe(false);
    } finally {
      vi.useRealTimers();
      db.close();
    }
  });

  it('restores field weighting and keeps weights query-time tunable', () => {
    const docs = createPackedEvalDocuments();
    const packed = new BM25Index(undefined, undefined, 'packed-inmemory');
    const legacy = new BM25Index(undefined, undefined, 'legacy-inmemory');

    addFixtureDocuments(packed, docs);
    for (const doc of docs) {
      legacy.addDocument(String(doc.id), [doc.title, doc.content_text, doc.trigger_phrases.join(' '), doc.file_path].join(' '));
    }

    const legacyTop = legacy.search('auth guard', 1)[0]?.id;
    const packedTop = packed.search('auth guard', 1)[0]?.id;
    const flatPackedTop = packed.search('auth guard', 1, {
      fieldWeights: { title: 1, trigger_phrases: 1, content_generic: 1, body: 1 },
    })[0]?.id;

    expect(BM25_FIELD_WEIGHTS.title).toBeGreaterThan(BM25_FIELD_WEIGHTS.trigger_phrases);
    expect(BM25_FIELD_WEIGHTS.trigger_phrases).toBeGreaterThan(BM25_FIELD_WEIGHTS.content_generic);
    expect(BM25_FIELD_WEIGHTS.content_generic).toBeGreaterThan(BM25_FIELD_WEIGHTS.body);
    expect(legacyTop).not.toBe('101');
    expect(packedTop).toBe('101');
    expect(flatPackedTop).not.toBe('101');
  });

  it('keeps legacy, packed, and auto selection explicit and logged', () => {
    const selectionLogSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    process.env.ENABLE_BM25 = 'true';
    process.env.SPECKIT_BM25_ENGINE = 'legacy-inmemory';
    const legacy = new BM25Index();
    expect((legacy as unknown as { engine: string }).engine).toBe('legacy-inmemory');
    expect(shouldWarmInMemoryBm25(null)).toBe(true);

    process.env.SPECKIT_BM25_ENGINE = 'packed-inmemory';
    const packed = new BM25Index();
    expect((packed as unknown as { engine: string }).engine).toBe('packed-inmemory');
    expect(shouldWarmInMemoryBm25(null)).toBe(true);

    delete process.env.SPECKIT_BM25_ENGINE;
    const auto = new BM25Index();
    expect((auto as unknown as { engine: string }).engine).toBe('packed-inmemory');

    expect(selectionLogSpy.mock.calls.some((call) => String(call[0]).includes('legacy-inmemory'))).toBe(true);
    expect(selectionLogSpy.mock.calls.some((call) => String(call[0]).includes('packed-inmemory'))).toBe(true);
    expect(selectionLogSpy.mock.calls.some((call) => String(call[0]).includes('auto mode fallback'))).toBe(true);
  });

  it('passes packed-vs-legacy baseline comparison and matches FTS5 title intent', async () => {
    const docs = createPackedEvalDocuments();
    const queries = createPackedEvalQueries();
    const legacy = new BM25Index(undefined, undefined, 'legacy-inmemory');
    const packed = new BM25Index(undefined, undefined, 'packed-inmemory');
    const ftsDb = createFtsDatabase(docs);

    try {
      addFixtureDocuments(packed, docs);
      for (const doc of docs) {
        legacy.addDocument(String(doc.id), [doc.title, doc.content_text, doc.trigger_phrases.join(' '), doc.file_path].join(' '));
      }

      expect(isFts5Available(ftsDb)).toBe(true);
      const comparison = await runBM25EngineComparison({
        legacy: (query, limit) => toBaselineResults(legacy.search(query, limit), 'bm25'),
        packed: (query, limit) => toBaselineResults(packed.search(query, limit), 'bm25'),
        fts5: (query, limit) => fts5Bm25Search(ftsDb, query, { limit }).map((row) => ({
          id: Number(row.id),
          score: row.fts_score,
          source: 'fts',
        })),
      }, queries);

      expect(comparison.packedAtLeastLegacy).toBe(true);
      expect(comparison.titleSignalRestored).toBe(true);
      expect(comparison.packed.mrr5).toBeGreaterThanOrEqual(comparison.legacy.mrr5);
      expect(comparison.fts5?.hitRate1).toBe(1);
    } finally {
      ftsDb.close();
    }
  });
});

// The corpus fixture stays below every packed-array promotion threshold (doc ids
// <= ~10k, per-field tf single-digit, vocab ~15k), so the warmup tests never
// drive the Uint8->16->32 width promotion. These cases force each boundary and
// assert the widening copy is lossless — a silent truncation here would break
// the byte-identical ranking guarantee in a production-reachable regime
// (an index past 65,535 rows, or a token repeated >255 times in one document).
describe('packed BM25 width promotion', () => {
  const CHUNK = 128;
  const FIELD_WIDTH = 4;
  const BODY_OFFSET = 3;
  const MAX_NARROW = 0xffff; // PACKED_POSTING_MAX_NARROW_{DOC_ID,TERM_ID}

  interface PackedStoreInternals {
    docIdChunks: Array<Uint16Array | Uint32Array>;
    fieldTfChunks: Array<Uint8Array | Uint16Array | Uint32Array>;
    length: number;
    fieldTfWidth: 1 | 2 | 4;
    wideDocIds: boolean;
  }
  interface PackedInternals {
    packedPostings: Map<string, PackedStoreInternals>;
    packedDocuments: Map<string, { numericId: number; termIds: Uint16Array | Uint32Array }>;
  }
  const asInternals = (index: BM25Index): PackedInternals =>
    index as unknown as PackedInternals;
  const bodyTfAt = (store: PackedStoreInternals, entry: number): number =>
    store.fieldTfChunks[Math.floor(entry / CHUNK)][(entry % CHUNK) * FIELD_WIDTH + BODY_OFFSET];
  const docIdAt = (store: PackedStoreInternals, entry: number): number =>
    store.docIdChunks[Math.floor(entry / CHUNK)][entry % CHUNK];

  it('promotes field-tf width across documents and preserves earlier values through the widening copy', () => {
    const index = new BM25Index(undefined, undefined, 'packed-inmemory');
    // Narrow doc first, so the tf chunk is allocated at Uint8 and must be widened
    // twice (Uint8->Uint16 at tf 256, Uint16->Uint32 at tf 65536). A bug in the
    // widened.set(chunk) copy would corrupt the earlier docs' stored term freq.
    index.addDocumentFields('d-narrow', { body: 'alpha' });
    index.addDocumentFields('d-mid', { body: 'alpha '.repeat(300).trim() });
    index.addDocumentFields('d-wide', { body: 'alpha '.repeat(70000).trim() });
    index.finalizePackedPostings();

    const store = asInternals(index).packedPostings.get('alpha');
    expect(store).toBeDefined();
    expect(store!.length).toBe(3);
    expect(store!.fieldTfWidth).toBe(4); // promoted past both narrow widths

    // numericId == insertion order; finalized postings are docId-sorted -> 0,1,2.
    expect(bodyTfAt(store!, 0)).toBe(1);
    expect(bodyTfAt(store!, 1)).toBe(300); // 44 if truncated to Uint8
    expect(bodyTfAt(store!, 2)).toBe(70000); // 4464 if truncated to Uint16

    const ranked = index.search('alpha', 3).map((result) => result.id);
    expect(new Set(ranked)).toEqual(new Set(['d-narrow', 'd-mid', 'd-wide']));
    expect(ranked[0]).toBe('d-wide'); // highest tf scores highest
    expect(ranked[ranked.length - 1]).toBe('d-narrow'); // lowest tf scores lowest
  });

  it('promotes doc-id width past the 16-bit boundary and stores high ids without truncation', () => {
    const index = new BM25Index(undefined, undefined, 'packed-inmemory');
    const total = MAX_NARROW + 5; // numericIds 0..65539 cross 0xffff
    for (let i = 0; i < total; i += 1) {
      index.addDocumentFields(`d${i}`, { body: 'common' });
    }
    index.finalizePackedPostings();

    const store = asInternals(index).packedPostings.get('common');
    expect(store).toBeDefined();
    expect(store!.length).toBe(total);
    expect(store!.wideDocIds).toBe(true);
    // Entries are docId-sorted, so entry i holds numericId i. Ids past 65535 would
    // wrap (65536 -> 0, 65539 -> 3) if a docId chunk were left at Uint16.
    expect(docIdAt(store!, MAX_NARROW + 1)).toBe(MAX_NARROW + 1);
    expect(docIdAt(store!, total - 1)).toBe(total - 1);
  });

  it('promotes document term-id width past the 16-bit boundary', () => {
    const index = new BM25Index(undefined, undefined, 'packed-inmemory');
    const termCount = MAX_NARROW + 5; // > 0xffff distinct terms -> ids cross 16-bit
    const tokens: string[] = [];
    for (let i = 0; i < termCount; i += 1) tokens.push(`wterm${i}`);
    index.addDocumentFields('big', { body: tokens.join(' ') });
    index.finalizePackedPostings();

    const doc = asInternals(index).packedDocuments.get('big');
    expect(doc).toBeDefined();
    // A term id > 65535 forces the Uint32Array branch of createPackedDocumentTermIds.
    expect(doc!.termIds).toBeInstanceOf(Uint32Array);
    expect(doc!.termIds.length).toBeGreaterThan(MAX_NARROW);
  });
});

describe('packed BM25 numericId recycling', () => {
  interface FreeListInternals {
    packedDocIds: Array<string | undefined>;
    packedDocNumbersById: Map<string, number>;
  }
  const asFreeList = (index: BM25Index): FreeListInternals =>
    index as unknown as FreeListInternals;

  it('recycles freed numericId slots instead of growing packedDocIds under update churn', () => {
    const index = new BM25Index(undefined, undefined, 'packed-inmemory');
    index.addDocumentFields('a', { body: 'alpha one' });
    index.addDocumentFields('b', { body: 'beta two' });
    index.finalizePackedPostings();

    const internals = asFreeList(index);
    expect(internals.packedDocIds.length).toBe(2);

    // Churn: remove and re-add many times. Old behavior pushed a new slot every
    // re-add, growing packedDocIds without bound; the free-list keeps it pinned
    // to the live document count.
    for (let i = 0; i < 50; i += 1) {
      index.removeDocument('b');
      index.addDocumentFields('b', { body: `beta ${i}` });
    }
    index.finalizePackedPostings();

    expect(internals.packedDocIds.length).toBe(2);
    expect(internals.packedDocNumbersById.size).toBe(2);

    // Search still resolves both docs correctly after the churn.
    const results = index.search('alpha', 5);
    expect(results.some((r) => r.id === 'a')).toBe(true);
  });
});
