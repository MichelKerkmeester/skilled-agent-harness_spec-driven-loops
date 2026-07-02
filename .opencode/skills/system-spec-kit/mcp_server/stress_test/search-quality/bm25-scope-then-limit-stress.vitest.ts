// ───────────────────────────────────────────────────────────────
// MODULE: BM25 Scope-Then-Limit Stress Test
// ───────────────────────────────────────────────────────────────
// Exercises high-volume metadata filtering for in-memory BM25 without touching
// live memory shards. Expected runtime is well under one minute on a laptop.

import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import * as hybridSearch from '../../lib/search/hybrid-search.js';
import { getIndex, resetIndex } from '../../lib/search/bm25-index.js';

interface StressDoc {
  id: number;
  folder: string;
  tier: string | null;
  text: string;
}

interface InstrumentedDb {
  database: Database.Database;
  db: Database.Database;
  metadataBatchSizes: number[];
}

const ORIGINAL_ENABLE_BM25 = process.env.ENABLE_BM25;
const ORIGINAL_BM25_ENGINE = process.env.SPECKIT_BM25_ENGINE;
// The bm25 deprecated-tier exclusion is gated behind SPECKIT_INCLUDE_ARCHIVED_DEFAULT,
// which graduated to default-on (cold/deprecated rows are INCLUDED by default and
// rank low via FSRS). This suite asserts the hard-exclusion semantics, so it opts
// back into exclusion explicitly rather than relying on the default.
const ORIGINAL_INCLUDE_ARCHIVED = process.env.SPECKIT_INCLUDE_ARCHIVED_DEFAULT;

const TARGET_FOLDER = 'specs/search-target';
const NOISE_FOLDER = 'specs/search-noise';

const noVectorSearch = () => [];

function createInstrumentedMemoryDb(): InstrumentedDb {
  const database = new Database(':memory:');
  database.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT,
      importance_tier TEXT
    )
  `);

  const metadataBatchSizes: number[] = [];
  const db = {
    prepare(sql: string) {
      if (sql.includes('SELECT id, spec_folder, importance_tier FROM memory_index')) {
        metadataBatchSizes.push((sql.match(/\?/g) ?? []).length);
      }
      return database.prepare(sql);
    },
  } as unknown as Database.Database;

  return { database, db, metadataBatchSizes };
}

function insertMetadata(database: Database.Database, docs: StressDoc[]): void {
  const insert = database.prepare(`
    INSERT INTO memory_index (id, spec_folder, importance_tier)
    VALUES (?, ?, ?)
  `);
  const insertAll = database.transaction((rows: StressDoc[]) => {
    for (const row of rows) {
      insert.run(row.id, row.folder, row.tier);
    }
  });

  insertAll(docs);
}

function indexDocs(docs: StressDoc[]): void {
  const index = getIndex();
  for (const doc of docs) {
    index.addDocument(String(doc.id), doc.text);
  }
}

function makeText(queryTerm: string, repeatCount: number, id: number): string {
  return [
    `${queryTerm} `.repeat(repeatCount),
    'metadata filtered lexical retrieval stress document',
    'deterministic corpus row with enough words for indexing',
    `row${id}`,
  ].join(' ');
}

function isInScope(folder: string): boolean {
  return folder === TARGET_FOLDER || folder.startsWith(`${TARGET_FOLDER}/`);
}

function expectedScopedLiveIds(query: string, docs: StressDoc[], limit: number): string[] {
  const docsById = new Map(docs.map((doc) => [String(doc.id), doc]));
  return getIndex()
    .search(query, docs.length)
    .filter((result) => {
      const doc = docsById.get(result.id);
      return !!doc && isInScope(doc.folder) && doc.tier !== 'deprecated';
    })
    .slice(0, limit)
    .map((result) => result.id);
}

describe('BM25 scope-then-limit stress behavior', () => {
  beforeEach(() => {
    process.env.ENABLE_BM25 = 'true';
    process.env.SPECKIT_BM25_ENGINE = 'legacy-inmemory';
    process.env.SPECKIT_INCLUDE_ARCHIVED_DEFAULT = 'false';
    resetIndex();
  });

  afterEach(() => {
    resetIndex();
    if (ORIGINAL_ENABLE_BM25 === undefined) {
      delete process.env.ENABLE_BM25;
    } else {
      process.env.ENABLE_BM25 = ORIGINAL_ENABLE_BM25;
    }

    if (ORIGINAL_BM25_ENGINE === undefined) {
      delete process.env.SPECKIT_BM25_ENGINE;
    } else {
      process.env.SPECKIT_BM25_ENGINE = ORIGINAL_BM25_ENGINE;
    }

    if (ORIGINAL_INCLUDE_ARCHIVED === undefined) {
      delete process.env.SPECKIT_INCLUDE_ARCHIVED_DEFAULT;
    } else {
      process.env.SPECKIT_INCLUDE_ARCHIVED_DEFAULT = ORIGINAL_INCLUDE_ARCHIVED;
    }
  });

  it('resolves corpus-sized metadata candidates in bounded SQLite batches', () => {
    const metadata = createInstrumentedMemoryDb();
    try {
      const query = 'chunkbound';
      const docs: StressDoc[] = [];

      for (let offset = 0; offset < 1_200; offset += 1) {
        const id = offset + 1;
        docs.push({
          id,
          folder: offset % 5 === 0 ? `${TARGET_FOLDER}/child` : TARGET_FOLDER,
          tier: 'normal',
          text: makeText(query, 4 + (offset % 7), id),
        });
      }

      for (let offset = 0; offset < 1_050; offset += 1) {
        const id = 10_000 + offset;
        docs.push({
          id,
          folder: NOISE_FOLDER,
          tier: 'normal',
          text: makeText(query, 5 + (offset % 9), id),
        });
      }

      insertMetadata(metadata.database, docs);
      hybridSearch.init(metadata.db, noVectorSearch);
      indexDocs(docs);

      const results = hybridSearch.bm25Search(query, { limit: 1_200, specFolder: TARGET_FOLDER });

      expect(results).toHaveLength(1_200);
      expect(results.every((result) => isInScope(docs.find((doc) => doc.id === Number(result.id))?.folder ?? ''))).toBe(true);
      expect(metadata.metadataBatchSizes.length).toBeGreaterThan(1);
      const largestBatchSize = metadata.metadataBatchSizes.reduce(
        (maxSize, size) => Math.max(maxSize, size),
        0,
      );
      expect(largestBatchSize).toBeLessThanOrEqual(500);
    } finally {
      metadata.database.close();
    }
  });

  it('returns the top-ranked filtered rows when limit is much smaller than matching rows', () => {
    const metadata = createInstrumentedMemoryDb();
    try {
      const query = 'scopevolume';
      const docs: StressDoc[] = [];

      for (let offset = 0; offset < 900; offset += 1) {
        const id = 20_000 + offset;
        docs.push({
          id,
          folder: NOISE_FOLDER,
          tier: 'normal',
          text: makeText(query, 20 - (offset % 5), id),
        });
      }

      for (let offset = 0; offset < 700; offset += 1) {
        const id = 30_000 + offset;
        docs.push({
          id,
          folder: offset % 10 === 0 ? `${TARGET_FOLDER}/nested` : TARGET_FOLDER,
          tier: 'normal',
          text: makeText(query, 6 + (offset % 11), id),
        });
      }

      insertMetadata(metadata.database, docs);
      hybridSearch.init(metadata.db, noVectorSearch);
      indexDocs(docs);

      const limit = 25;
      const expectedIds = expectedScopedLiveIds(query, docs, limit);
      const results = hybridSearch.bm25Search(query, { limit, specFolder: TARGET_FOLDER });
      const resultIds = results.map((result) => String(result.id));

      expect(results).toHaveLength(limit);
      expect(resultIds).toEqual(expectedIds);
      expect(resultIds.every((id) => isInScope(docs.find((doc) => doc.id === Number(id))?.folder ?? ''))).toBe(true);
    } finally {
      metadata.database.close();
    }
  });

  it('excludes a large deprecated cohort without shrinking scoped live results below limit', () => {
    const metadata = createInstrumentedMemoryDb();
    try {
      const query = 'tierfilter';
      const docs: StressDoc[] = [];

      for (let offset = 0; offset < 1_100; offset += 1) {
        const id = 40_000 + offset;
        docs.push({
          id,
          folder: TARGET_FOLDER,
          tier: 'deprecated',
          text: makeText(query, 18 - (offset % 7), id),
        });
      }

      for (let offset = 0; offset < 140; offset += 1) {
        const id = 50_000 + offset;
        docs.push({
          id,
          folder: offset % 8 === 0 ? `${TARGET_FOLDER}/live` : TARGET_FOLDER,
          tier: offset % 3 === 0 ? 'important' : 'normal',
          text: makeText(query, 5 + (offset % 13), id),
        });
      }

      for (let offset = 0; offset < 350; offset += 1) {
        const id = 60_000 + offset;
        docs.push({
          id,
          folder: NOISE_FOLDER,
          tier: 'normal',
          text: makeText(query, 10 + (offset % 9), id),
        });
      }

      insertMetadata(metadata.database, docs);
      hybridSearch.init(metadata.db, noVectorSearch);
      indexDocs(docs);

      const limit = 75;
      const expectedIds = expectedScopedLiveIds(query, docs, limit);
      const results = hybridSearch.bm25Search(query, { limit, specFolder: TARGET_FOLDER });
      const docsById = new Map(docs.map((doc) => [String(doc.id), doc]));

      expect(results).toHaveLength(limit);
      expect(results.map((result) => String(result.id))).toEqual(expectedIds);
      expect(results.every((result) => docsById.get(String(result.id))?.tier !== 'deprecated')).toBe(true);
    } finally {
      metadata.database.close();
    }
  });
});
