import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import Database from 'better-sqlite3';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { __testables as rescueTestables } from '../lib/search/rerank/retrieval-rescue.js';
import { __testables as graphSignalTestables, applyGraphSignals, clearGraphSignalsCache, markGraphSignalsDirty } from '../lib/graph/graph-signals.js';
import { __testables as communityTestables, applyCommunityBoost } from '../lib/graph/community-detection.js';
import { __testables as intentTestables, classifyIntent } from '../lib/search/intent-classifier.js';
import { __testables as directiveTestables, enrichWithRetrievalDirectives } from '../lib/search/retrieval-directives.js';
import { __testables as vectorQueryTestables, keyword_search } from '../lib/search/vector-index-queries.js';
import { __testables as hybridTestables, hybridSearchEnhanced, init as initHybridSearch } from '../lib/search/hybrid-search.js';
import { __testables as memorySearchTestables } from '../handlers/memory-search.js';
import {
  buildPathExistenceCache,
  init as initIncrementalIndex,
  listStaleIndexedPaths,
  pathExistenceDiagnostics,
  resetPathExistenceDiagnostics,
} from '../lib/storage/incremental-index.js';
import { logRankDelta } from '../lib/feedback/shadow-scoring.js';

function createGraphDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      deleted_at TEXT,
      importance_tier TEXT DEFAULT 'normal'
    );
    CREATE TABLE causal_edges (
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT DEFAULT 'supports',
      strength REAL DEFAULT 1.0,
      created_by TEXT DEFAULT 'test'
    );
    CREATE TABLE degree_snapshots (
      memory_id INTEGER NOT NULL,
      degree_count INTEGER NOT NULL,
      snapshot_date TEXT NOT NULL
    );
    INSERT INTO memory_index (id) VALUES (1), (2), (3);
    INSERT INTO causal_edges (source_id, target_id) VALUES ('1', '2'), ('2', '3');
  `);
  return db;
}

function createSearchDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      title TEXT,
      trigger_phrases TEXT,
      spec_folder TEXT,
      file_path TEXT,
      content_text TEXT,
      document_type TEXT DEFAULT 'spec',
      importance_tier TEXT DEFAULT 'normal',
      importance_weight REAL DEFAULT 0.5,
      quality_score REAL DEFAULT 1.0,
      created_at TEXT DEFAULT '2026-01-01T00:00:00Z',
      updated_at TEXT,
      deleted_at TEXT,
      expires_at TEXT
    );
    CREATE TABLE active_memory_projection (active_memory_id INTEGER PRIMARY KEY);
    CREATE VIRTUAL TABLE memory_fts USING fts5(title, trigger_phrases, spec_folder, file_path, content_text, content='memory_index', content_rowid='id');
  `);

  const insert = db.prepare(`
    INSERT INTO memory_index (id, title, trigger_phrases, spec_folder, file_path, content_text, document_type, importance_weight, quality_score)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const rows = [
    [1, 'Alpha beta exact', JSON.stringify(['alpha beta']), 'specs/demo', 'specs/demo/spec.md', 'alpha beta phrase', 'spec', 0.9, 1.0],
    [2, 'Quoted phrase', JSON.stringify(['quoted phrase']), 'specs/demo', 'specs/demo/plan.md', 'quoted phrase with double quotes marker', 'plan', 0.8, 0.9],
    [3, 'Near operator text', JSON.stringify(['alpha NEAR beta']), 'specs/demo', 'specs/demo/tasks.md', 'alpha near beta operator literal', 'tasks', 0.7, 0.8],
    [4, 'Or operator text', JSON.stringify(['alpha OR beta']), 'specs/demo', 'specs/demo/checklist.md', 'alpha or beta operator literal', 'checklist', 0.6, 0.7],
    [5, 'Minus operator text', JSON.stringify(['-alpha']), 'specs/demo', 'specs/demo/impl.md', 'minus alpha operator literal', 'implementation_summary', 0.5, 0.6],
    [6, 'Unicode cafe', JSON.stringify(['unicode café']), 'specs/demo', 'specs/demo/research.md', 'unicode café marker', 'research', 0.4, 0.5],
  ];
  for (const row of rows) {
    insert.run(...row);
    db.prepare('INSERT INTO active_memory_projection (active_memory_id) VALUES (?)').run(row[0]);
  }
  db.exec(`INSERT INTO memory_fts(memory_fts) VALUES('rebuild')`);
  return db;
}

function orderedIds(rows: Array<{ id: number | string }>): Array<number | string> {
  return rows.map((row) => row.id);
}

afterEach(() => {
  clearGraphSignalsCache();
  graphSignalTestables.resetAdjacencyDiagnostics();
  communityTestables.resetCommunityLookupDiagnostics();
  directiveTestables.clearDirectiveContentCache();
  directiveTestables.resetDirectiveDiagnostics();
  intentTestables.resetEmbeddingDiagnostics();
  memorySearchTestables.resetResponseEnvelopeSerializationDiagnostics();
  resetPathExistenceDiagnostics();
  vi.restoreAllMocks();
});

describe('search hot path performance invariants', () => {
  it('hydrates rescue candidates with one IN query under the chunk limit', () => {
    const all = vi.fn((...ids: number[]) => ids.map((id) => ({
      id,
      title: `row ${id}`,
      deleted_at: null,
      importance_tier: 'normal',
      content_text: `content ${id}`,
    })));
    const prepare = vi.fn(() => ({ all }));
    const rows = Array.from({ length: 8 }, (_, index) => ({ id: index + 1, title: `candidate ${index + 1}` }));

    const hydrated = rescueTestables.hydrateCandidateRows({ prepare } as unknown as Database.Database, rows);

    expect(hydrated).toHaveLength(8);
    expect(prepare).toHaveBeenCalledTimes(1);
    expect(String(prepare.mock.calls[0]?.[0])).toContain('id IN');
    expect(all).toHaveBeenCalledTimes(1);
  });

  it('keeps FTS-routed backfill token-equivalent to LIKE or gates unsafe inputs to LIKE', () => {
    const db = createSearchDb();
    try {
      const cases = [
        { name: 'double-quotes', query: '"quoted phrase"', route: 'like' },
        { name: 'fts-near-operator', query: 'alpha NEAR beta', route: 'like' },
        { name: 'fts-or-operator', query: 'alpha OR beta', route: 'like' },
        { name: 'fts-unary-minus', query: '-alpha', route: 'like' },
        { name: 'unicode', query: 'unicode café', route: 'like' },
        { name: 'empty', query: '', route: 'none' },
        { name: 'safe-fts-route', query: 'alpha beta', route: 'fts' },
      ] as const;

      for (const testCase of cases) {
        expect(rescueTestables.resolveLexicalBackfillRoute(db, testCase.query), testCase.name).toBe(testCase.route);
        const routed = rescueTestables.fetchLexicalBackfillRows(db, testCase.query);
        const like = rescueTestables.fetchLikeLexicalBackfillRows(db, testCase.query);
        expect(orderedIds(routed), testCase.name).toEqual(orderedIds(like));
      }
    } finally {
      db.close();
    }
  });

  it('keeps the lexical backfill no-op behind the weak-result gate for adversarial query text', () => {
    const strongRows = Array.from({ length: 6 }, (_, index) => ({
      id: index + 1,
      title: 'quoted NEAR OR unicode café alpha beta',
      trigger_phrases: JSON.stringify(['quoted phrase', 'alpha beta', 'unicode café']),
      file_path: `specs/demo/${index}.md`,
      spec_folder: 'specs/demo',
      content: 'quoted phrase alpha beta unicode café',
    }));

    for (const query of ['"quoted phrase"', 'alpha NEAR beta', 'alpha OR beta', '-alpha', 'unicode café', '']) {
      expect(rescueTestables.shouldRunLexicalBackfill(query, strongRows)).toBe(false);
    }
  });

  it('preserves ordered result ids for pure rescue hydration changes', () => {
    const rows = Array.from({ length: 6 }, (_, index) => ({
      id: index + 1,
      title: `alpha beta candidate ${index + 1}`,
      trigger_phrases: JSON.stringify(['alpha beta']),
      file_path: `specs/demo/${index}.md`,
      spec_folder: 'specs/demo',
      document_type: index === 0 ? 'spec' : 'plan',
      content: 'alpha beta ranking parity fixture',
      content_text: 'alpha beta ranking parity fixture',
      score: 1 - index * 0.05,
      rrfScore: 1 - index * 0.05,
      intentAdjustedScore: 1 - index * 0.05,
    }));
    const prepare = vi.fn((sql: string) => {
      if (sql.includes('id IN')) {
        return { all: (...ids: number[]) => ids.map((id) => rows.find((row) => row.id === id)) };
      }
      return { all: () => [] };
    });

    const baseline = rescueTestables.mergeSiblingCandidates('alpha beta', rows, {});
    const hydrated = rescueTestables.mergeSiblingCandidates('alpha beta', rows, { db: { prepare } as unknown as Database.Database });

    expect(hydrated.map((row) => row.id)).toEqual(baseline.map((row) => row.id));
  });

  it('preserves ordered ids through the real fixed-query hybrid fusion pipeline', async () => {
    const db = createSearchDb();
    try {
      initHybridSearch(db, null, null);
      let enrichmentCalls = 0;
      hybridTestables.setEnrichFusedResultsObserver(() => {
        enrichmentCalls += 1;
      });
      const options = {
        limit: 5,
        useVector: false,
        useGraph: false,
        useBm25: false,
        useFts: true,
        useTrigger: true,
        forceAllChannels: true,
        evaluationMode: true,
      } as const;

      const results = await hybridSearchEnhanced('alpha beta', null, options);

      expect(enrichmentCalls).toBe(1);
      expect(orderedIds(results)).toEqual([1, 3, 4, 5]);
    } finally {
      hybridTestables.setEnrichFusedResultsObserver(null);
      db.close();
    }
  });

  it('caches graph adjacency by database identity and invalidates on graph writes', () => {
    const db = createGraphDb();
    try {
      graphSignalTestables.resetAdjacencyDiagnostics();
      applyGraphSignals([{ id: 1, score: 0.5 }, { id: 2, score: 0.5 }], db);
      expect(graphSignalTestables.adjacencyCache.size).toBe(1);
      expect(graphSignalTestables.adjacencyDiagnostics.builds).toBe(1);

      applyGraphSignals([{ id: 1, score: 0.5 }, { id: 2, score: 0.5 }], db);
      expect(graphSignalTestables.adjacencyCache.size).toBe(1);
      expect(graphSignalTestables.adjacencyDiagnostics.builds).toBe(1);

      markGraphSignalsDirty(db, [1, 2]);
      expect(graphSignalTestables.adjacencyCache.size).toBe(0);
      applyGraphSignals([{ id: 1, score: 0.5 }, { id: 2, score: 0.5 }], db);
      expect(graphSignalTestables.adjacencyDiagnostics.builds).toBe(2);

      const rebound = createGraphDb();
      try {
        applyGraphSignals([{ id: 1, score: 0.5 }, { id: 2, score: 0.5 }], rebound);
        expect(graphSignalTestables.adjacencyCache.size).toBe(2);
        expect(graphSignalTestables.adjacencyDiagnostics.builds).toBe(3);
      } finally {
        rebound.close();
      }
    } finally {
      db.close();
    }
  });

  it('loads community assignments once for a boost pass', () => {
    const db = new Database(':memory:');
    try {
      db.exec(`
        CREATE TABLE memory_index (
          id INTEGER PRIMARY KEY,
          deleted_at TEXT,
          importance_tier TEXT DEFAULT 'normal'
        );
        CREATE TABLE community_assignments (
          memory_id INTEGER NOT NULL,
          community_id INTEGER NOT NULL
        );
        INSERT INTO memory_index (id) VALUES (1), (2), (3), (4);
        INSERT INTO community_assignments (memory_id, community_id) VALUES (1, 7), (2, 7), (3, 7), (4, 8);
      `);
      const prepare = vi.fn((sql: string) => db.prepare(sql));
      communityTestables.resetCommunityLookupDiagnostics();
      const boosted = applyCommunityBoost([{ id: 1, score: 1 }, { id: 2, score: 0.9 }], { prepare } as unknown as Database.Database);

      expect(boosted.map((row) => row.id)).toEqual([1, 2, 3]);
      expect(boosted.find((row) => row.id === 3)?.score).toBe(0.3);
      expect(communityTestables.communityLookupDiagnostics.loads).toBe(1);
      expect(prepare.mock.calls.filter(([sql]) => String(sql).includes('FROM community_assignments'))).toHaveLength(1);
      expect(communityTestables.loadCommunityMemberLookup({ prepare } as unknown as Database.Database).get(1)).toEqual([2, 3]);
    } finally {
      db.close();
    }
  });

  it('embeds intent text once per classification request', () => {
    intentTestables.resetEmbeddingDiagnostics();
    const first = classifyIntent('fix the memory search ranking bug');
    const second = classifyIntent('fix the memory search ranking bug');

    expect(first.intent).toBe(second.intent);
    expect(intentTestables.embeddingDiagnostics.deterministicEmbeddingCalls).toBeLessThanOrEqual(1);
  });

  it('caches directive file content by mtime and refreshes after an mtime change', () => {
    const tmpDir = fs.mkdtempSync(path.join(process.cwd(), 'tmp-directive-cache-'));
      const filePath = path.join(tmpDir, 'rule.md');
      try {
        fs.writeFileSync(filePath, 'Always read files when editing code.');
        const result = { id: 1, specFolder: 'specs/demo', filePath, title: 'Read First', importanceTier: 'constitutional' };
        directiveTestables.resetDirectiveDiagnostics();

        const first = enrichWithRetrievalDirectives([result, result]);
        expect(directiveTestables.directiveContentCache.size).toBe(1);
        expect(directiveTestables.directiveDiagnostics.readFileSyncCalls).toBe(1);
        expect(first[0]?.retrieval_directive).toContain('editing code');

        fs.writeFileSync(filePath, 'Always verify files when finishing tests.');
        fs.utimesSync(filePath, new Date(), new Date(Date.now() + 2000));
        const second = enrichWithRetrievalDirectives([result]);
        expect(directiveTestables.directiveContentCache.size).toBe(2);
        expect(directiveTestables.directiveDiagnostics.readFileSyncCalls).toBe(2);
        expect(second[0]?.retrieval_directive).toContain('finishing tests');
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('applies handler emission envelope mutations by reference and serializes once', () => {
    memorySearchTestables.resetResponseEnvelopeSerializationDiagnostics();
    const response = {
      content: [{ type: 'text' as const, text: JSON.stringify({
        summary: 'Found 2 memories',
        data: { results: [{ id: 1 }, { id: 2 }] },
        hints: [],
        meta: { tool: 'memory_search', tokenCount: 0, cacheHit: false },
      }, null, 2) }],
    };

    const warned = memorySearchTestables.prependEvidenceGapWarningToResponse(
      response,
      'Coverage incomplete: supporting evidence is missing.',
    );
    expect(memorySearchTestables.getResponseEnvelopeSerializationDiagnostics().serializations).toBe(0);

    const parsed = memorySearchTestables.parseResponseEnvelope(warned);
    expect(parsed).not.toBeNull();
    const data = parsed?.envelope.data as Record<string, unknown>;
    data.progressiveDisclosure = { mode: 'compact' };
    parsed!.envelope.data = data;
    const mutated = memorySearchTestables.replaceResponseEnvelope(warned, parsed!.firstEntry, parsed!.envelope);
    const reparsed = memorySearchTestables.parseResponseEnvelope(mutated);
    (reparsed?.envelope.meta as Record<string, unknown>).dedupStats = { filteredCount: 1 };
    const finalized = memorySearchTestables.finalizeResponseEnvelope(
      memorySearchTestables.replaceResponseEnvelope(mutated, reparsed!.firstEntry, reparsed!.envelope),
    );
    const roundTrip = JSON.parse(finalized.content[0]?.text ?? '{}') as Record<string, unknown>;

    expect(memorySearchTestables.getResponseEnvelopeSerializationDiagnostics().serializations).toBe(1);
    expect(roundTrip.summary).toBe('Coverage incomplete: supporting evidence is missing.\n\nFound 2 memories');
    expect((roundTrip.data as Record<string, unknown>).results).toEqual([{ id: 1 }, { id: 2 }]);
    expect((roundTrip.data as Record<string, unknown>).progressiveDisclosure).toEqual({ mode: 'compact' });
    expect((roundTrip.meta as Record<string, unknown>).dedupStats).toEqual({ filteredCount: 1 });
  });

  it('pushes keyword fallback filtering and limit into SQL', () => {
    const all = vi.fn(() => []);
    const prepare = vi.fn(() => ({ all }));

    keyword_search('alpha OR beta', { limit: 5 }, { prepare } as unknown as Database.Database);

    const sql = String(prepare.mock.calls.find(([candidate]) => String(candidate).includes('LIKE ?'))?.[0]);
    expect(sql).toContain('LOWER');
    expect(sql).toContain('LIKE ?');
    expect(sql).toContain('LIMIT ?');
    expect(all.mock.calls.some((call) => call.at(-1) === 15)).toBe(true);
  });

  it('routes keyword fallback through FTS when safe and preserves LIKE top-K rows', () => {
    const db = createSearchDb();
    try {
      const likeCandidates = vectorQueryTestables.fetchKeywordLikeCandidates(['alpha', 'beta'], 15, null, false, db);
      const likeTopK = vectorQueryTestables.scoreKeywordRows(likeCandidates, ['alpha', 'beta'])
        .filter((row) => Number(row.keyword_score ?? 0) > 0)
        .sort((left, right) => Number(right.keyword_score ?? 0) - Number(left.keyword_score ?? 0))
        .slice(0, 5)
        .map((row) => row.id);

      const routedTopK = keyword_search('alpha beta', { limit: 5 }, db).map((row) => row.id);

      expect(vectorQueryTestables.canUseKeywordFtsRoute(['alpha', 'beta'])).toBe(true);
      expect(routedTopK).toEqual(likeTopK);
    } finally {
      db.close();
    }
  });

  it('batches stale-check path existence through directory reads instead of per-path stats', () => {
    const tmpDir = fs.mkdtempSync(path.join(process.cwd(), 'tmp-stale-batch-'));
    const existingPath = path.join(tmpDir, 'existing.md');
    fs.writeFileSync(existingPath, '# Existing');
    const db = new Database(':memory:');
    try {
      db.exec(`
        CREATE TABLE memory_index (
          id INTEGER PRIMARY KEY,
          file_path TEXT,
          canonical_file_path TEXT,
          file_mtime_ms REAL,
          content_hash TEXT,
          embedding_status TEXT
        );
      `);
      const insert = db.prepare('INSERT INTO memory_index (id, file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status) VALUES (?, ?, ?, ?, ?, ?)');
      insert.run(1, existingPath, existingPath, 0, null, 'success');
      for (let index = 2; index <= 25; index += 1) {
        const missingPath = path.join(tmpDir, `missing-${index}.md`);
        insert.run(index, missingPath, missingPath, 0, null, 'success');
      }
      initIncrementalIndex(db);
      resetPathExistenceDiagnostics();

      const stale = listStaleIndexedPaths([existingPath]);

      expect(stale).toHaveLength(24);
      expect(pathExistenceDiagnostics.statSyncCalls).toBe(0);
      expect(pathExistenceDiagnostics.readdirSyncCalls).toBeLessThanOrEqual(1);
      expect(buildPathExistenceCache([existingPath]).get(path.resolve(existingPath))).toBe(true);
    } finally {
      db.close();
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('reuses a hoisted provenance Set while preserving merged source order', () => {
    const scratch = new Set<string>();
    const first = hybridTestables.mergeProvenanceSources(scratch, ['fts'], 'bm25', 'keyword');
    const second = hybridTestables.mergeProvenanceSources(scratch, ['vector', 'keyword'], ['keyword', 'trigger']);

    expect(first).toEqual(['fts', 'bm25', 'keyword']);
    expect(second).toEqual(['vector', 'keyword', 'trigger']);
    expect(scratch).toBeInstanceOf(Set);
    expect(Array.from(scratch)).toEqual(second);
  });

  it('batches shadow rank delta inserts in one transaction', () => {
    const run = vi.fn();
    const prepare = vi.fn((sql: string) => {
      if (sql.includes('INSERT INTO shadow_scoring_log')) return { run };
      return { all: () => [], get: () => undefined };
    });
    const exec = vi.fn();
    const transaction = vi.fn((callback: (deltas: unknown[]) => void) => (deltas: unknown[]) => callback(deltas));
    const inserted = logRankDelta({ prepare, exec, transaction } as unknown as Database.Database, {
      queryId: 'q1',
      metrics: { ndcgDelta: 0, mrrDelta: 0, kendallTau: 1 },
      deltas: [
        { resultId: '1', liveRank: 1, shadowRank: 1, delta: 0, direction: 'unchanged' },
        { resultId: '2', liveRank: 2, shadowRank: 1, delta: 1, direction: 'improved' },
      ],
    }, 'cycle', 123);

    expect(inserted).toBe(2);
    expect(transaction).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledTimes(2);
  });
});
