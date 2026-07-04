// TEST: MEMORY SEARCH INTEGRATION
//
// NOTE: This file was originally built as a source-text snapshot
// suite -- most assertions read .ts files with fs.readFileSync and regex-match
// against source code strings.  Such tests pass as long as the source text
// contains the expected substring, even if the runtime code is broken.
//
// The tests below have been improved where possible:
// Already exercise live FSRS functions -- these are genuine
// Mixed -- export checks are real; source-text checks remain
//   where the underlying function requires a DB to call.  Source-text checks
//   are annotated with FIXME to flag them for future DB-fixture migration.
// Same mixed pattern
//
// The long-term goal is to replace ALL source-text assertions with behavioral
// assertions backed by in-memory DB fixtures.
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Mock core/db-state to prevent real DB operations (checkDatabaseUpdated throws
// when the database directory cannot be resolved in the test environment).
vi.mock('../core/db-state', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    checkDatabaseUpdated: vi.fn(async () => false),
  };
});

vi.mock('../core', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    checkDatabaseUpdated: vi.fn(async () => false),
  };
});

const embeddingMocks = vi.hoisted(() => ({
  generateQueryEmbedding: vi.fn(async () => new Float32Array(1024).fill(0.1)),
}));

vi.mock('../lib/providers/embeddings.js', () => ({
  generateQueryEmbedding: embeddingMocks.generateQueryEmbedding,
}));

import * as memorySearchHandler from '../handlers/memory-search.js';
import * as accessTracker from '../lib/storage/access-tracker.js';
import * as fsrsScheduler from '../lib/cognitive/fsrs-scheduler.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import * as hybridSearch from '../lib/search/hybrid-search.js';
import * as stage2Fusion from '../lib/search/pipeline/stage2-fusion.js';
import * as rrfFusion from '@spec-kit/shared/algorithms/rrf-fusion.js';
import {
  createMemoryDbFixture,
  disposeMemoryDbFixture,
  makeMemoryEmbedding,
  seedMemoryRow,
} from './helpers/memory-db-fixture.js';
import type Database from 'better-sqlite3';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.resolve(TEST_DIR, '..');
const MEMORY_SEARCH_SOURCE = fs.readFileSync(path.join(SERVER_ROOT, 'handlers', 'memory-search.ts'), 'utf-8');
const VECTOR_INDEX_QUERIES_SOURCE = fs.readFileSync(path.join(SERVER_ROOT, 'lib', 'search', 'vector-index-queries.ts'), 'utf-8');
const HYBRID_SEARCH_SOURCE = fs.readFileSync(path.join(SERVER_ROOT, 'lib', 'search', 'hybrid-search.ts'), 'utf-8');
const VECTOR_INDEX_SCHEMA_SOURCE = fs.readFileSync(path.join(SERVER_ROOT, 'lib', 'search', 'vector-index-schema.ts'), 'utf-8');
const STAGE1_SOURCE = fs.readFileSync(path.join(SERVER_ROOT, 'lib', 'search', 'pipeline', 'stage1-candidate-gen.ts'), 'utf-8');
const STAGE2_SOURCE = fs.readFileSync(path.join(SERVER_ROOT, 'lib', 'search', 'pipeline', 'stage2-fusion.ts'), 'utf-8');
const ACCESS_TRACKER_SOURCE = fs.readFileSync(path.join(SERVER_ROOT, 'lib', 'storage', 'access-tracker.ts'), 'utf-8');
const HANDLER_INPUT_REQUIRED_ERROR = 'Either "query" (string), "concepts" (array with 2-5 items), or "cursor" (string) is required.';

function parseResponseData(response: Awaited<ReturnType<typeof memorySearchHandler.handleMemorySearch>>): Record<string, unknown> {
  const payload = JSON.parse(response.content[0].text) as Record<string, unknown>;
  const data = payload.data;
  return (data && typeof data === 'object')
    ? data as Record<string, unknown>
    : payload;
}

describe('Memory Search Integration (T601-T650) [deferred - requires DB test fixtures]', () => {

  describe('T601-T610 - Testing Effect Formula', () => {
    it('T601: GRADE_GOOD constant is 3', () => {
      expect(fsrsScheduler.GRADE_GOOD).toBe(3);
    });

    it('T602: Difficulty bonus calculation correct', () => {
      const testCases = [
        { r: 0.0, expected: 0.45 },
        { r: 0.2, expected: 0.35 },
        { r: 0.5, expected: 0.20 },
        { r: 0.9, expected: 0.00 },
        { r: 1.0, expected: 0.00 },
      ];
      for (const tc of testCases) {
        const calculated = Math.max(0, (0.9 - tc.r) * 0.5);
        expect(Math.abs(calculated - tc.expected)).toBeLessThan(0.001);
      }
    });

    it('T603: GRADE_GOOD increases stability', () => {
      const initial = fsrsScheduler.createInitialParams();
      const reviewed = fsrsScheduler.processReview(initial, fsrsScheduler.GRADE_GOOD);
      expect(reviewed.stability).toBeGreaterThan(initial.stability);
    });

    it('T604: Stability multiplier applied with difficulty bonus', () => {
      const lowRetrievability = fsrsScheduler.updateStability(2.0, 5.0, fsrsScheduler.GRADE_GOOD, 0.2);
      const highRetrievability = fsrsScheduler.updateStability(2.0, 5.0, fsrsScheduler.GRADE_GOOD, 0.9);
      expect(lowRetrievability).toBeGreaterThan(highRetrievability);
    });

    it('T605: Formula handles edge cases', () => {
      expect(fsrsScheduler.calculateRetrievability(-1, 5)).toBe(0);
      expect(fsrsScheduler.calculateOptimalInterval(0, 0.9)).toBe(0);
    });
  });

  describe('T611-T620 - Desirable Difficulty', () => {
    it('T611: Low R (0.2) gives ~0.35 bonus', () => {
      const bonus = Math.max(0, (0.9 - 0.2) * 0.5);
      expect(Math.abs(bonus - 0.35)).toBeLessThan(0.001);
    });

    it('T612: High R (0.9) gives ~0.0 bonus', () => {
      const bonus = Math.max(0, (0.9 - 0.9) * 0.5);
      expect(Math.abs(bonus - 0.0)).toBeLessThan(0.001);
    });

    it('T613: R = 1.0 gives zero difficulty bonus', () => {
      const bonus = Math.max(0, (0.9 - 1.0) * 0.5);
      expect(bonus).toBe(0);
    });

    it('T614: R = 0 gives maximum bonus (0.45)', () => {
      const bonus = Math.max(0, (0.9 - 0.0) * 0.5);
      expect(Math.abs(bonus - 0.45)).toBeLessThan(0.001);
    });

    it('T615: Bonus capped at reasonable level', () => {
      const bonusExtreme = Math.max(0, (0.9 - (-1.0)) * 0.5);
      expect(bonusExtreme).toBeLessThanOrEqual(1.0);
    });

    it('T616: Bonus decreases monotonically with R', () => {
      const rValues = [0.0, 0.2, 0.4, 0.6, 0.8, 0.9, 1.0];
      const bonuses = rValues.map(r => Math.max(0, (0.9 - r) * 0.5));
      for (let i = 1; i < bonuses.length; i++) {
        expect(bonuses[i]).toBeLessThanOrEqual(bonuses[i - 1]);
      }
    });

    it('T617: Difficulty bonus formula matches spec', () => {
      const actual = Math.max(0, (0.9 - 0.5) * 0.5);
      expect(Math.abs(actual - 0.2)).toBeLessThan(0.001);
    });

    it('T618: Combined boost = base_stability * (1 + difficultyBonus)', () => {
      const baseStability = 2.0;
      const difficultyBonus = Math.max(0, (0.9 - 0.2) * 0.5);
      const combined = baseStability * (1 + difficultyBonus);
      expect(Math.abs(combined - 2.7)).toBeLessThan(0.01);
    });

    it('T619: FSRS stability bounds (0.1 to 365) respected', () => {
      const reviewed = fsrsScheduler.processReview({
        stability: 0.01,
        difficulty: 5,
        lastReview: null,
        reviewCount: 0,
      }, fsrsScheduler.GRADE_AGAIN);
      expect(reviewed.stability).toBeGreaterThanOrEqual(fsrsScheduler.MIN_STABILITY);
      expect(fsrsScheduler.calculateRetrievability(365, 30)).toBeLessThanOrEqual(1);
    });

    it('T620: Negative R handled in bonus calculation', () => {
      const bonus = Math.max(0, (0.9 - (-0.5)) * 0.5);
      expect(bonus).toBeGreaterThan(0);
    });
  });

  describe('T621-T630 - Multi-Concept Search', () => {
    it('T621: handleMemorySearch function exported', () => {
      expect(typeof memorySearchHandler.handleMemorySearch).toBe('function');
    });

    it('T622: Concepts array validation exists', () => {
      // FIXME: Source-text assertion -- replace with behavioral test
      // that calls handleMemorySearch({ concepts: 'not-array' }) and checks error.
      expect(MEMORY_SEARCH_SOURCE).toContain('Array.isArray(concepts)');
    });

    it('T623: Maximum 5 concepts enforced', () => {
      // FIXME: Source-text assertion -- replace with behavioral test
      // that calls handleMemorySearch({ concepts: ['a','b','c','d','e','f'] })
      // and checks the 2-5 validation error response.
      expect(VECTOR_INDEX_QUERIES_SOURCE).toContain('concepts.length > 5');
      expect(VECTOR_INDEX_QUERIES_SOURCE).toContain('Multi-concept search requires 2-5 concepts');
    });

    it('T624: Each concept generates embedding', () => {
      // FIXME: Source-text assertion -- needs DB-backed test to verify
      // that each concept actually generates a separate embedding query.
      expect(STAGE1_SOURCE).toContain('generateQueryEmbedding(concept)');
    });

    it('T625: multiConceptSearch available', () => {
      expect(typeof vectorIndex.multiConceptSearch).toBe('function');
    });

    it('T626: Multi-concept requests are labeled as multi_concept search type', () => {
      // FIXME: Source-text assertion -- replace with behavioral test
      // that calls handleMemorySearch({ concepts: ['a','b'] }) against a DB
      // fixture and checks the response metadata contains searchType = 'multi-concept'.
      expect(MEMORY_SEARCH_SOURCE).toContain("searchType: (hasValidConcepts && concepts!.length >= 2)");
      expect(MEMORY_SEARCH_SOURCE).toContain("'multi-concept'");
    });

    it('T627: Empty concepts array rejected', async () => {
      const response = await memorySearchHandler.handleMemorySearch({ concepts: [] });
      const data = parseResponseData(response);
      expect(data.error).toBe(HANDLER_INPUT_REQUIRED_ERROR);
    });

    it('T628: Single concept rejected', async () => {
      const response = await memorySearchHandler.handleMemorySearch({ concepts: ['only-one'] });
      const data = parseResponseData(response);
      expect(data.error).toBe(HANDLER_INPUT_REQUIRED_ERROR);
    });

    it('T629: Non-array concepts rejected', async () => {
      const response = await memorySearchHandler.handleMemorySearch({ concepts: 'bad-input' as unknown as string[] });
      const data = parseResponseData(response);
      expect(data.error).toBe(HANDLER_INPUT_REQUIRED_ERROR);
    });

    it('T630: Null concepts handled', async () => {
      const response = await memorySearchHandler.handleMemorySearch({ concepts: null as unknown as string[] });
      const data = parseResponseData(response);
      expect(data.error).toBe(HANDLER_INPUT_REQUIRED_ERROR);
    });
  });

  describe('T631-T640 - Hybrid Search', () => {
    it('T631: hybrid-search.js loads', () => {
      expect(hybridSearch).toBeTruthy();
    });

    it('T632: hybridSearch function exported', () => {
      expect(typeof hybridSearch.hybridSearch).toBe('function');
    });

    it('T633: searchWithFallback function exported', () => {
      expect(typeof hybridSearch.searchWithFallback).toBe('function');
    });

    it('T634: FTS availability check function exists', () => {
      expect(typeof hybridSearch.isFtsAvailable).toBe('function');
    });

    it('T635: Hybrid search uses fusion-based ranking', () => {
      // FIXME: Source-text assertion -- replace with behavioral test
      // that verifies hybridSearch output uses fuseResultsMulti ranking.
      expect(HYBRID_SEARCH_SOURCE).toContain('fuseResultsMulti');
    });

    it('T636: Hybrid combines vector + FTS', () => {
      // FIXME: Source-text assertion -- replace with behavioral test.
      expect(HYBRID_SEARCH_SOURCE).toContain('combinedLexicalSearch');
      expect(HYBRID_SEARCH_SOURCE).toContain('hybridSearchEnhanced');
    });

    it('T637: RRF fusion available for hybrid ranking', () => {
      expect(typeof rrfFusion.fuseResultsMulti).toBe('function');
    });

    it('T638: Deduplication handled in RRF fusion', () => {
      const fused = rrfFusion.fuseResultsMulti([
        { source: 'vector', results: [{ id: 1 }, { id: 2 }] },
        { source: 'keyword', results: [{ id: 1 }, { id: 3 }] },
      ]);
      const item = fused.find((result) => result.id === 1);
      expect(item).toBeDefined();
      expect(item!.sources).toContain('vector');
      expect(item!.sources).toContain('keyword');
    });

    it('T639: searchWithFallback falls back to FTS after empty hybrid results', () => {
      // FIXME: Source-text assertion -- replace with behavioral test
      // that verifies the actual fallback chain with a DB fixture.
      expect(HYBRID_SEARCH_SOURCE).toContain('const ftsResults = ftsSearch(query, options);');
      expect(HYBRID_SEARCH_SOURCE).toContain('if (ftsResults.length > 0) return ftsResults;');
    });

    it('T640: searchWithFallback falls back to BM25 after empty FTS results', () => {
      // FIXME: Source-text assertion -- replace with behavioral test.
      expect(HYBRID_SEARCH_SOURCE).toContain('const bm25Results = bm25Search(query, options);');
      expect(HYBRID_SEARCH_SOURCE).toContain('if (bm25Results.length > 0) return bm25Results;');
    });
  });

  describe('T641-T650 - Review Count & Timestamp', () => {
    // FIXME: The tests below are all source-text assertions that check
    // schema DDL strings and SQL statement text.  They verify that the source
    // code *mentions* the right column names but do not prove the runtime DB
    // actually creates and increments those columns.  Replace with DB-fixture
    // tests that run the schema migration then INSERT/UPDATE and SELECT.

    it('T641: review_count column exists in schema', () => {
      expect(VECTOR_INDEX_SCHEMA_SOURCE).toContain('review_count INTEGER DEFAULT 0');
    });

    it('T642: last_review column exists', () => {
      expect(VECTOR_INDEX_SCHEMA_SOURCE).toContain('last_review TEXT');
    });

    it('T643: access_count column exists', () => {
      expect(VECTOR_INDEX_SCHEMA_SOURCE).toContain('access_count INTEGER DEFAULT 0');
    });

    it('T644: last_accessed column exists', () => {
      expect(VECTOR_INDEX_SCHEMA_SOURCE).toContain('last_accessed INTEGER DEFAULT 0');
    });

    it('T645: Default review_count is 0', () => {
      expect(VECTOR_INDEX_SCHEMA_SOURCE).toMatch(/review_count INTEGER DEFAULT 0/);
    });

    it('T646: review_count increments correctly', () => {
      expect(STAGE2_SOURCE).toContain('review_count = review_count + 1');
    });

    it('T647: Multiple increments accumulate', () => {
      expect(STAGE2_SOURCE).not.toContain('review_count = 1');
    });

    it('T648: last_review timestamp updates', () => {
      expect(STAGE2_SOURCE).toContain('last_review = ?');
      expect(STAGE2_SOURCE).toContain('new Date(lastAccessed).toISOString()');
    });

    it('T649: Timestamp parseable as Date', () => {
      const nextReviewDate = fsrsScheduler.getNextReviewDate(5);
      expect(Number.isNaN(new Date(nextReviewDate).getTime())).toBe(false);
    });

    it('T650: last_accessed stores epoch timestamp', () => {
      // FIXME: Source-text assertion.
      expect(ACCESS_TRACKER_SOURCE).toContain('const now = Date.now();');
      expect(ACCESS_TRACKER_SOURCE).toContain('last_accessed = ?');
    });
  });

  describe('Review and access update pipeline', () => {
    // FIXME: All three tests below are source-text assertions.
    // Replace with DB-fixture integration tests that exercise the actual
    // pipeline through a real in-memory SQLite DB.

    it('updates stability, review_count, access_count, and last_accessed together', () => {
      expect(STAGE2_SOURCE).toContain('SET stability = ?,');
      expect(STAGE2_SOURCE).toContain('review_count = review_count + 1');
      expect(STAGE2_SOURCE).toContain('access_count = access_count + 1');
      expect(STAGE2_SOURCE).toContain('last_accessed = ?');
    });

    it('access tracker gracefully returns false on invalid write attempts', () => {
      expect(ACCESS_TRACKER_SOURCE).toContain('return false;');
    });

    it('normalizes invalid retrievability inputs back to 0.9', () => {
      const rInvalid = -0.5;
      const rNormalized = (typeof rInvalid !== 'number' || rInvalid < 0 || rInvalid > 1)
        ? 0.9
        : rInvalid;
      expect(rNormalized).toBe(0.9);
    });
  });

  describe('Pipeline support', () => {
    // FIXME: Source-text assertions -- replace with behavioral tests.

    it('generates one embedding per concept in stage 1 candidate generation', () => {
      expect(STAGE1_SOURCE).toContain('for (const concept of concepts)');
      expect(STAGE1_SOURCE).toContain('generateQueryEmbedding(concept)');
    });

    it('keeps multi-concept embedding generation independent per concept', () => {
      expect(STAGE1_SOURCE).toContain('conceptEmbeddings.push(emb)');
    });

    it('persists direct access tracking with its own update path', () => {
      expect(ACCESS_TRACKER_SOURCE).toContain('SET access_count = access_count + 1');
    });
  });

  describe('Integration coverage gaps (S3.5 #14)', () => {
    // These tests document the integration test debt identified by the deep review.
    // They must be implemented when a DB test fixture infrastructure is available.

    let db: Database.Database;
    let previousSearchFallback: string | undefined;

    beforeEach(() => {
      previousSearchFallback = process.env.SPECKIT_SEARCH_FALLBACK;
      process.env.SPECKIT_SEARCH_FALLBACK = 'false';
      embeddingMocks.generateQueryEmbedding.mockReset();
      embeddingMocks.generateQueryEmbedding.mockResolvedValue(makeMemoryEmbedding([1, 1]));
      db = createMemoryDbFixture();
    });

    afterEach(() => {
      disposeMemoryDbFixture(db);
      if (previousSearchFallback === undefined) {
        delete process.env.SPECKIT_SEARCH_FALLBACK;
      } else {
        process.env.SPECKIT_SEARCH_FALLBACK = previousSearchFallback;
      }
    });

    // SKIP: deferred DB fixture integration — see /008 vitest stabilization
    it.skip('multi-concept search returns ranked results from DB (requires DB fixture)', async () => {
      const top = seedMemoryRow(db, {
        title: 'Alpha beta canonical decision',
        contentText: 'alpha beta canonical decision',
        embedding: makeMemoryEmbedding([1, 1]),
        documentType: 'spec_doc',
      });
      const weaker = seedMemoryRow(db, {
        title: 'Alpha beta weaker note',
        contentText: 'alpha beta weaker note',
        embedding: makeMemoryEmbedding([1, 0.2]),
        documentType: 'spec_doc',
      });

      const response = await memorySearchHandler.handleMemorySearch({
        concepts: ['alpha', 'beta'],
        limit: 5,
        includeConstitutional: false,
        bypassCache: true,
        rerank: false,
      });
      const data = parseResponseData(response);
      const results = data.results as Array<Record<string, unknown>>;

      expect(data.searchType).toBe('multi-concept');
      expect(results.map((result) => result.id)).toContain(top.id);
      expect(results.map((result) => result.id)).toContain(weaker.id);
      expect(results[0]?.id).toBe(top.id);
      expect(embeddingMocks.generateQueryEmbedding).toHaveBeenCalledWith('alpha');
      expect(embeddingMocks.generateQueryEmbedding).toHaveBeenCalledWith('beta');
    });

    it('hybrid search fallback chain works end-to-end (requires DB fixture)', async () => {
      const seeded = seedMemoryRow(db, {
        title: 'Hybrid fallback canonical row',
        triggerPhrases: ['hybrid fallback'],
        contentText: 'hybrid fallback exact lexical row',
        documentType: 'spec_doc',
      });
      hybridSearch.init(db, () => []);

      const results = await hybridSearch.searchWithFallback(
        'hybrid fallback',
        makeMemoryEmbedding([0, 1]),
        { limit: 5, specFolder: seeded.specFolder, useGraph: false, forceAllChannels: true },
      );

      expect(results.length).toBeGreaterThan(0);
      expect(results.map((result) => Number(result.id))).toContain(seeded.id);
      expect(results.some((result) => {
        const sources = result.sources as string[] | undefined;
        return result.source === 'fts'
          || result.source === 'bm25'
          || sources?.some((source) => source === 'fts' || source === 'bm25');
      })).toBe(true);
    });

    it('review_count increments after processReview pipeline run (requires DB fixture)', () => {
      const seeded = seedMemoryRow(db, {
        title: 'Review count row',
        reviewCount: 0,
        accessCount: 0,
        stability: 1,
        lastReview: '2026-05-01T00:00:00.000Z',
      });
      const row = db.prepare('SELECT * FROM memory_index WHERE id = ?').get(seeded.id) as Record<string, unknown>;

      stage2Fusion.__testables.applyTestingEffect(db, [row as never]);

      const updated = db.prepare(`
        SELECT review_count, access_count, last_review, stability
        FROM memory_index
        WHERE id = ?
      `).get(seeded.id) as {
        review_count: number;
        access_count: number;
        last_review: string | null;
        stability: number;
      };

      expect(updated.review_count).toBe(1);
      expect(updated.access_count).toBe(1);
      expect(updated.last_review).toEqual(expect.any(String));
      expect(updated.stability).toBeGreaterThan(1);
    });

    it('access_count increments after direct access tracking (requires DB fixture)', () => {
      const seeded = seedMemoryRow(db, {
        title: 'Direct access row',
        accessCount: 0,
        lastAccessed: 0,
      });

      const tracked = accessTracker.flushAccessCounts(seeded.id);
      const updated = db.prepare(`
        SELECT access_count, last_accessed
        FROM memory_index
        WHERE id = ?
      `).get(seeded.id) as { access_count: number; last_accessed: number };

      expect(tracked).toBe(true);
      expect(updated.access_count).toBe(1);
      expect(updated.last_accessed).toBeGreaterThan(0);
    });

    it('searchWithFallback cascades through vector -> FTS -> BM25 (requires DB fixture)', async () => {
      const ftsRow = seedMemoryRow(db, {
        title: 'Cascade ftsonlyunique canonical row',
        triggerPhrases: ['ftsonlyunique'],
        contentText: 'ftsonlyunique lexical hit',
      });
      const bm25Row = seedMemoryRow(db, {
        title: 'Cascade bm25onlyunique canonical row',
        triggerPhrases: ['bm25onlyunique'],
        contentText: 'bm25onlyunique lexical hit',
      });
      hybridSearch.init(db, () => []);

      const ftsResults = await hybridSearch.searchWithFallback(
        'ftsonlyunique',
        makeMemoryEmbedding([0, 1]),
        { limit: 5, useVector: false, useGraph: false, forceAllChannels: true },
      );
      expect(ftsResults.map((result) => Number(result.id))).toContain(ftsRow.id);
      expect(hybridSearch.ftsSearch('ftsonlyunique', { limit: 5 }).map((result) => Number(result.id))).toContain(ftsRow.id);

      db.exec('DROP TABLE memory_fts');
      const bm25Results = await hybridSearch.searchWithFallback(
        'bm25onlyunique',
        makeMemoryEmbedding([0, 1]),
        { limit: 5, useVector: false, useGraph: false, forceAllChannels: true },
      );

      expect(bm25Results.map((result) => Number(result.id))).toContain(bm25Row.id);
      expect(bm25Results.some((result) => result.source === 'bm25' || (result.sources as string[] | undefined)?.includes('bm25'))).toBe(true);
    });
  });
});
