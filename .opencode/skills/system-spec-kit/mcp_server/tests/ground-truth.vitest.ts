import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import fs from 'fs';
import os from 'os';
import path from 'path';

import {
  GATES,
  generateGroundTruth,
  loadGroundTruth,
  validateGroundTruthDiversity,
} from '../lib/eval/ground-truth-generator';

import {
  GROUND_TRUTH_QUERIES,
  GROUND_TRUTH_RELEVANCES,
  QUERY_DISTRIBUTION,
  type ComplexityTier,
  type IntentType,
  type QueryCategory,
  type QuerySource,
} from '../lib/eval/ground-truth-data';

const VALID_INTENT_TYPES: IntentType[] = [
  'add_feature',
  'fix_bug',
  'refactor',
  'security_audit',
  'understand',
  'find_spec',
  'find_decision',
];

const VALID_COMPLEXITY_TIERS: ComplexityTier[] = ['simple', 'moderate', 'complex'];

const VALID_CATEGORIES: QueryCategory[] = [
  'factual',
  'temporal',
  'graph_relationship',
  'cross_document',
  'hard_negative',
  'anchor_based',
  'scope_filtered',
];

const VALID_SOURCES: QuerySource[] = ['manual', 'trigger_derived', 'pattern_derived', 'seed'];

const EVAL_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS eval_queries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query TEXT NOT NULL,
    intent TEXT,
    spec_folder TEXT,
    expected_memory_ids TEXT,
    difficulty TEXT DEFAULT 'medium',
    category TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS eval_ground_truth (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query_id INTEGER NOT NULL,
    memory_id INTEGER NOT NULL,
    relevance INTEGER NOT NULL DEFAULT 0,
    annotator TEXT DEFAULT 'auto',
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(query_id, memory_id)
  );
`;

let testDb: Database.Database;
let testDbPath: string;

beforeEach(() => {
  testDbPath = path.join(os.tmpdir(), `ground-truth-test-${Date.now()}-${process.pid}.db`);
  testDb = new Database(testDbPath);
  testDb.pragma('journal_mode = WAL');
  testDb.exec(EVAL_SCHEMA_SQL);
});

afterEach(() => {
  try { testDb?.close(); } catch { /* ignore */ }
  for (const suffix of ['', '-wal', '-shm']) {
    try { fs.rmSync(`${testDbPath}${suffix}`, { force: true }); } catch { /* ignore */ }
  }
});

describe('known-item ground truth dataset', () => {
  it('generates the JSON-backed dataset', () => {
    const dataset = generateGroundTruth();

    expect(dataset.queries).toBe(GROUND_TRUTH_QUERIES);
    expect(dataset.relevances).toBe(GROUND_TRUTH_RELEVANCES);
    expect(dataset.distribution.total).toBe(dataset.queries.length);
  });

  it('contains the requested live known-item benchmark size', () => {
    expect(GROUND_TRUTH_QUERIES.length).toBeGreaterThanOrEqual(GATES.MIN_TOTAL_QUERIES);
    expect(GROUND_TRUTH_QUERIES.length).toBe(60);
  });

  it('uses contiguous query IDs starting at 1', () => {
    const ids = GROUND_TRUTH_QUERIES.map(q => q.id).sort((a, b) => a - b);
    expect(ids[0]).toBe(1);
    expect(ids[ids.length - 1]).toBe(GROUND_TRUTH_QUERIES.length);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('uses unique non-empty query strings', () => {
    const normalized = GROUND_TRUTH_QUERIES.map(q => q.query.toLowerCase().trim());
    expect(new Set(normalized).size).toBe(GROUND_TRUTH_QUERIES.length);
    expect(normalized.every(q => q.length > 0)).toBe(true);
  });

  it('keeps query metadata in the supported enum sets', () => {
    for (const query of GROUND_TRUTH_QUERIES) {
      expect(VALID_INTENT_TYPES).toContain(query.intentType);
      expect(VALID_COMPLEXITY_TIERS).toContain(query.complexityTier);
      expect(VALID_CATEGORIES).toContain(query.category);
      expect(VALID_SOURCES).toContain(query.source);
      expect(query.expectedResultDescription.trim().length).toBeGreaterThan(0);
    }
  });

  it('covers all intent types and complexity tiers', () => {
    const intents = new Set(GROUND_TRUTH_QUERIES.map(q => q.intentType));
    const tiers = new Set(GROUND_TRUTH_QUERIES.map(q => q.complexityTier));

    for (const intent of VALID_INTENT_TYPES) {
      expect(intents.has(intent)).toBe(true);
    }
    for (const tier of VALID_COMPLEXITY_TIERS) {
      expect(tiers.has(tier)).toBe(true);
    }
  });

  it('has at least one relevance label and one exact target per query', () => {
    const labelsByQuery = new Map<number, number>();
    const exactLabelsByQuery = new Map<number, number>();

    for (const relevance of GROUND_TRUTH_RELEVANCES) {
      labelsByQuery.set(relevance.queryId, (labelsByQuery.get(relevance.queryId) ?? 0) + 1);
      if (relevance.relevance === 3) {
        exactLabelsByQuery.set(relevance.queryId, (exactLabelsByQuery.get(relevance.queryId) ?? 0) + 1);
      }
      expect(relevance.memoryId).toBeGreaterThan(0);
      expect([1, 2, 3]).toContain(relevance.relevance);
    }

    for (const query of GROUND_TRUTH_QUERIES) {
      expect(labelsByQuery.get(query.id) ?? 0).toBeGreaterThanOrEqual(1);
      expect(exactLabelsByQuery.get(query.id) ?? 0).toBeGreaterThanOrEqual(1);
    }
  });

  it('does not contain stale placeholder or chunk-style relevance IDs', () => {
    const queryIds = new Set(GROUND_TRUTH_QUERIES.map(q => q.id));
    for (const relevance of GROUND_TRUTH_RELEVANCES) {
      expect(queryIds.has(relevance.queryId)).toBe(true);
      expect(Number.isInteger(relevance.memoryId)).toBe(true);
      expect(relevance.memoryId).toBeGreaterThan(0);
    }
  });

  it('distribution summary matches actual counts', () => {
    const sourceTotal = Object.values(QUERY_DISTRIBUTION.bySource).reduce((sum, count) => sum + count, 0);
    const intentTotal = Object.values(QUERY_DISTRIBUTION.byIntentType).reduce((sum, count) => sum + count, 0);
    const tierTotal = Object.values(QUERY_DISTRIBUTION.byComplexityTier).reduce((sum, count) => sum + count, 0);
    const categoryTotal = Object.values(QUERY_DISTRIBUTION.byCategory).reduce((sum, count) => sum + count, 0);

    expect(QUERY_DISTRIBUTION.total).toBe(GROUND_TRUTH_QUERIES.length);
    expect(sourceTotal).toBe(QUERY_DISTRIBUTION.total);
    expect(intentTotal).toBe(QUERY_DISTRIBUTION.total);
    expect(tierTotal).toBe(QUERY_DISTRIBUTION.total);
    expect(categoryTotal).toBe(QUERY_DISTRIBUTION.total);
    expect(QUERY_DISTRIBUTION.manualQueryCount).toBe(0);
    expect(QUERY_DISTRIBUTION.hardNegativeCount).toBe(0);
  });
});

describe('known-item ground truth validation', () => {
  it('passes the known-item gates', () => {
    const report = validateGroundTruthDiversity();

    expect(report.passed).toBe(true);
    expect(report.totalQueries).toBe(GROUND_TRUTH_QUERIES.length);
    expect(report.summary).toContain('PASSED');
  });

  it('fails the total-count gate for an empty set', () => {
    const report = validateGroundTruthDiversity([], []);
    const totalGate = report.gates.find(g => g.dimension === 'Total queries');

    expect(report.passed).toBe(false);
    expect(totalGate?.passed).toBe(false);
    expect(totalGate?.actual).toBe(0);
  });

  it('fails label gates when relevances are missing', () => {
    const report = validateGroundTruthDiversity(GROUND_TRUTH_QUERIES, []);
    const labelGate = report.gates.find(g => g.dimension === 'Queries with relevance labels');
    const exactGate = report.gates.find(g => g.dimension === 'Queries with relevance=3 target');

    expect(report.passed).toBe(false);
    expect(labelGate?.passed).toBe(false);
    expect(exactGate?.passed).toBe(false);
  });
});

describe('loadGroundTruth()', () => {
  it('loads all queries and relevances into eval tables', () => {
    const inserted = loadGroundTruth(testDb);

    expect(inserted.queriesInserted).toBe(GROUND_TRUTH_QUERIES.length);
    expect(inserted.relevancesInserted).toBe(GROUND_TRUTH_RELEVANCES.length);

    const queryCount = testDb.prepare('SELECT COUNT(*) AS c FROM eval_queries').get() as { c: number };
    const relevanceCount = testDb.prepare('SELECT COUNT(*) AS c FROM eval_ground_truth').get() as { c: number };

    expect(queryCount.c).toBe(GROUND_TRUTH_QUERIES.length);
    expect(relevanceCount.c).toBe(GROUND_TRUTH_RELEVANCES.length);
  });

  it('is idempotent by default', () => {
    loadGroundTruth(testDb);
    const second = loadGroundTruth(testDb);

    expect(second.queriesInserted).toBe(0);
    expect(second.relevancesInserted).toBe(0);
  });

  it('replaces rows when requested', () => {
    loadGroundTruth(testDb);
    const second = loadGroundTruth(testDb, { replace: true });

    expect(second.queriesInserted).toBe(GROUND_TRUTH_QUERIES.length);
    expect(second.relevancesInserted).toBe(GROUND_TRUTH_RELEVANCES.length);
  });

  it('stores the caller-provided annotator label', () => {
    loadGroundTruth(testDb, { annotator: 'known-item-test' });
    const row = testDb
      .prepare('SELECT annotator FROM eval_ground_truth LIMIT 1')
      .get() as { annotator: string } | undefined;

    expect(row?.annotator).toBe('known-item-test');
  });
});
