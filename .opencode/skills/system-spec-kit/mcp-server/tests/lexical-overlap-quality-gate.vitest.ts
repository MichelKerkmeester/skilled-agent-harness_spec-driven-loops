// TEST: Lexical Overlap Quality Gate

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import * as bm25Index from '../lib/search/bm25-index.js';
import * as hybridSearch from '../lib/search/hybrid-search.js';

type QueryClass =
  | 'single-token'
  | 'multi-token'
  | 'phrase'
  | 'stemming'
  | 'tokenization-edge'
  | 'rrf-stressing';

interface GoldenQuery {
  id: string;
  query: string;
  class: QueryClass;
  gate_group: string;
  expected_top_5: string[];
}

interface GoldenFixtureDocument {
  doc_id: string;
  title: string;
  content: string;
  triggers: string[];
  file_path: string;
  spec_folder: string;
}

interface GoldenFixture {
  queries: GoldenQuery[];
  fixtures: GoldenFixtureDocument[];
}

type EngineMode = 'JS_BM25_ONLY' | 'FTS5_ONLY' | 'BOTH';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturePath = join(__dirname, 'fixtures', 'golden-queries.json');
const fixture = JSON.parse(readFileSync(fixturePath, 'utf8')) as GoldenFixture;
const REQUIRED_GATE_GROUPS = new Set([
  'normal-prose',
  'synonym',
  'rrf-stressing',
  'title-trigger-file-path',
]);

const ORIGINAL_ENABLE_BM25 = process.env.ENABLE_BM25;
const ORIGINAL_BM25_ENGINE = process.env.SPECKIT_BM25_ENGINE;

let db: Database.Database;
let idToDocId: Map<number, string>;

function restoreEnv(): void {
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
}

function seedGoldenDatabase(): void {
  db = new Database(':memory:');
  idToDocId = new Map();

  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      doc_id TEXT NOT NULL,
      title TEXT,
      trigger_phrases TEXT,
      content_text TEXT,
      file_path TEXT,
      spec_folder TEXT,
      importance_tier TEXT DEFAULT NULL,
      is_archived INTEGER DEFAULT 0,
      deleted_at TEXT
    );

    CREATE VIRTUAL TABLE memory_fts USING fts5(
      title,
      trigger_phrases,
      content_text,
      file_path,
      content='memory_index',
      content_rowid='id'
    );
  `);

  const insertMemory = db.prepare(`
    INSERT INTO memory_index (
      id,
      doc_id,
      title,
      trigger_phrases,
      content_text,
      file_path,
      spec_folder,
      importance_tier,
      is_archived
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, 'normal', 0)
  `);

  const insertFts = db.prepare(`
    INSERT INTO memory_fts (rowid, title, trigger_phrases, content_text, file_path)
    VALUES (?, ?, ?, ?, ?)
  `);

  fixture.fixtures.forEach((doc, index) => {
    const rowId = index + 1;
    const triggers = JSON.stringify(doc.triggers);
    idToDocId.set(rowId, doc.doc_id);
    insertMemory.run(
      rowId,
      doc.doc_id,
      doc.title,
      triggers,
      doc.content,
      doc.file_path,
      doc.spec_folder,
    );
    insertFts.run(rowId, doc.title, triggers, doc.content, doc.file_path);
  });

  hybridSearch.init(db, null, null);
}

function warmLegacyBm25(): void {
  bm25Index.resetIndex();
  const bm25 = bm25Index.getIndex();
  fixture.fixtures.forEach((doc, index) => {
    bm25.addDocument(String(index + 1), bm25Index.buildBm25DocumentText({
      title: doc.title,
      content_text: doc.content,
      trigger_phrases: doc.triggers,
      file_path: doc.file_path,
    }));
  });
}

function docIdsFromResults(results: Array<{ id: number | string }>): string[] {
  return results
    .slice(0, 5)
    .map((result) => idToDocId.get(Number(result.id)) ?? String(result.id));
}

function topFiveFor(query: string, mode: EngineMode): string[] {
  process.env.ENABLE_BM25 = 'true';

  if (mode === 'JS_BM25_ONLY') {
    process.env.SPECKIT_BM25_ENGINE = 'legacy-inmemory';
    warmLegacyBm25();
    return docIdsFromResults(hybridSearch.bm25Search(query, { limit: 5 }));
  }

  if (mode === 'FTS5_ONLY') {
    process.env.SPECKIT_BM25_ENGINE = 'sqlite';
    bm25Index.resetIndex();
    return docIdsFromResults(hybridSearch.bm25Search(query, { limit: 5 }));
  }

  process.env.SPECKIT_BM25_ENGINE = 'legacy-inmemory';
  warmLegacyBm25();
  return docIdsFromResults(hybridSearch.combinedLexicalSearch(query, { limit: 5 }));
}

function overlapAt5(left: string[], right: string[]): number {
  const leftSet = new Set(left.slice(0, 5));
  const rightSet = new Set(right.slice(0, 5));
  let shared = 0;

  for (const id of leftSet) {
    if (rightSet.has(id)) {
      shared++;
    }
  }

  return shared / 5;
}

describe('lexical overlap quality gate', () => {
  beforeEach(() => {
    seedGoldenDatabase();
  });

  afterEach(() => {
    bm25Index.resetIndex();
    db.close();
    restoreEnv();
  });

  it('loads the 30-query fixture with required edge-case rows', () => {
    expect(fixture.queries).toHaveLength(30);
    expect(fixture.fixtures.length).toBeGreaterThanOrEqual(20);

    const searchableText = fixture.fixtures
      .map((doc) => `${doc.doc_id} ${doc.title} ${doc.content} ${doc.triggers.join(' ')} ${doc.file_path}`)
      .join('\n');

    for (const required of [
      'running',
      'runs',
      'ran',
      'tested',
      'tests',
      'boxes',
      'hybrid-search',
      'memory_index',
      'SPECKIT_BM25_ENGINE',
      'always-surface',
    ]) {
      expect(searchableText).toContain(required);
    }
  });

  for (const query of fixture.queries.filter((candidate) => REQUIRED_GATE_GROUPS.has(candidate.gate_group))) {
    it(`${query.id}: FTS5_ONLY overlaps BOTH at >= 0.8 for ${query.gate_group}`, () => {
      const ftsOnly = topFiveFor(query.query, 'FTS5_ONLY');
      const both = topFiveFor(query.query, 'BOTH');
      const overlap = overlapAt5(ftsOnly, both);

      if (query.expected_top_5.length > 0) {
        expect(both).toEqual(query.expected_top_5);
      }

      if (process.env.SPECKIT_GOLDEN_QUERY_SNAPSHOT === '1') {
        console.error(JSON.stringify({ id: query.id, query: query.query, both }));
      }

      expect(overlap, `${query.id} ${query.query}: FTS5_ONLY=${ftsOnly.join(',')} BOTH=${both.join(',')}`).toBeGreaterThanOrEqual(0.8);
    });
  }

  it('keeps stemmer and identifier classes observable without gating their overlap', () => {
    const allowedDivergence = fixture.queries.filter((query) =>
      query.class === 'stemming' || query.class === 'tokenization-edge'
    );
    expect(allowedDivergence.length).toBeGreaterThan(0);

    for (const query of allowedDivergence) {
      expect(topFiveFor(query.query, 'JS_BM25_ONLY')).toEqual(expect.any(Array));
      expect(topFiveFor(query.query, 'FTS5_ONLY')).toEqual(expect.any(Array));
    }
  });
});
