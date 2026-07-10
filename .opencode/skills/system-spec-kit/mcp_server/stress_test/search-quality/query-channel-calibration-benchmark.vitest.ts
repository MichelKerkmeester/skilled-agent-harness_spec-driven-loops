// ───────────────────────────────────────────────────────────────
// MODULE: Query Channel Calibration Benchmark
// ───────────────────────────────────────────────────────────────
// Exercises the complete hybrid search path against a deterministic indexed corpus.

import Database from 'better-sqlite3';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { getIndex, resetIndex } from '../../lib/search/bm25-index.js';
import {
  getGraphMetrics,
  hybridSearchEnhanced,
  init as initHybridSearch,
  resetGraphMetrics,
  routeQuery,
} from '../../lib/search/hybrid-search.js';
import {
  clearDegreeCacheForDb,
  createUnifiedGraphSearchFn,
} from '../../lib/search/graph-search-fn.js';

import type { GraphSearchFn } from '../../lib/search/search-types.js';

interface CorpusRow {
  readonly id: number;
  readonly title: string;
  readonly triggerPhrases: string;
  readonly specFolder: string;
  readonly filePath: string;
  readonly contentText: string;
  readonly documentType: string;
  readonly importanceWeight: number;
  readonly qualityScore: number;
  readonly embedding: Float32Array;
}

interface QueryLatency {
  readonly query: string;
  readonly kind: 'content-rich' | 'control';
  readonly iterations: number;
  readonly p50Ms: number;
  readonly p95Ms: number;
}

interface FlagMeasurement {
  readonly flagState: 'off' | 'on';
  readonly latencies: number[];
  readonly queryLatencies: QueryLatency[];
  graphInvocations: number;
  degreeInvocations: number;
  graphExecutorCalls: number;
}

interface BenchmarkReport {
  readonly corpus: {
    readonly memories: number;
    readonly embeddings: number;
    readonly dimensions: number;
    readonly ftsRows: number;
    readonly causalEdges: number;
  };
  readonly execution: {
    readonly warmupIterationsPerQueryAndState: number;
    readonly measuredIterationsPerQueryAndState: number;
    readonly contentRichQueries: number;
    readonly controls: number;
    readonly totalMeasuredCalls: number;
    readonly ordering: string;
  };
  readonly off: ReturnType<typeof summarizeFlagMeasurement>;
  readonly on: ReturnType<typeof summarizeFlagMeasurement>;
  readonly delta: {
    readonly p50Ms: number;
    readonly p95Ms: number;
    readonly p50Percent: number;
    readonly p95Percent: number;
    readonly graphInvocations: number;
    readonly degreeInvocations: number;
  };
  readonly queries: Array<{
    readonly query: string;
    readonly kind: 'content-rich' | 'control';
    readonly offP50Ms: number;
    readonly onP50Ms: number;
    readonly p50DeltaMs: number;
    readonly offP95Ms: number;
    readonly onP95Ms: number;
    readonly p95DeltaMs: number;
  }>;
}

const CALIBRATION_FLAG = 'SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION';
const CORPUS_SIZE = 360;
const EMBEDDING_DIMENSIONS = 16;
const WARMUP_ITERATIONS = 3;
const MEASURED_ITERATIONS = 20;
const RESULT_LIMIT = 20;

const CONTENT_RICH_QUERIES = [
  'auth router',
  'cache invalidation',
  'memory indexing',
  'causal graph',
  'session retrieval',
  'vector fallback',
  'query calibration',
  'ranking signals',
  'graph traversal',
  'search pipeline',
] as const;

const CONTROL_QUERIES = [
  'authentication',
  'cli-opencode',
  'explain authentication architecture across services',
  'compare cache invalidation retry behavior',
  'trace vector fallback through pipeline stages',
] as const;

const ALL_QUERIES = [
  ...CONTENT_RICH_QUERIES.map((query) => ({ query, kind: 'content-rich' as const })),
  ...CONTROL_QUERIES.map((query) => ({ query, kind: 'control' as const })),
] as const;

const ORIGINAL_ENV = new Map<string, string | undefined>();

let database: Database.Database;
let graphCallsByState: Record<'off' | 'on', number> = { off: 0, on: 0 };

function setStableEnvironment(): void {
  const environment = {
    ENABLE_BM25: 'true',
    SPECKIT_BM25_ENGINE: 'sqlite',
    SPECKIT_COMPLEXITY_ROUTER: 'true',
    SPECKIT_GRAPH_CHANNEL_PRESERVATION: 'true',
    SPECKIT_RETRIEVAL_CLASS_ROUTING: 'false',
    SPECKIT_DEGREE_BOOST: 'true',
    SPECKIT_MMR: 'true',
    SPECKIT_CONTEXT_HEADERS: 'false',
  } as const;

  for (const [key, value] of Object.entries(environment)) {
    ORIGINAL_ENV.set(key, process.env[key]);
    process.env[key] = value;
  }
  ORIGINAL_ENV.set(CALIBRATION_FLAG, process.env[CALIBRATION_FLAG]);
}

function restoreEnvironment(): void {
  for (const [key, value] of ORIGINAL_ENV) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  ORIGINAL_ENV.clear();
}

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

function normalizeEmbedding(values: Float32Array): Float32Array {
  let magnitudeSquared = 0;
  for (const value of values) magnitudeSquared += value * value;
  const magnitude = Math.sqrt(magnitudeSquared) || 1;
  return Float32Array.from(values, (value) => value / magnitude);
}

function tokenDimension(token: string): number {
  let hash = 2_166_136_261;
  for (let index = 0; index < token.length; index += 1) {
    hash ^= token.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }
  return (hash >>> 0) % EMBEDDING_DIMENSIONS;
}

function embedText(text: string, random?: () => number): Float32Array {
  const embedding = new Float32Array(EMBEDDING_DIMENSIONS);
  const tokens = text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  for (const token of tokens) {
    embedding[tokenDimension(token)] += 1;
  }
  if (random) {
    for (let index = 0; index < embedding.length; index += 1) {
      embedding[index] += (random() - 0.5) * 0.04;
    }
  }
  return normalizeEmbedding(embedding);
}

function createCorpus(): CorpusRow[] {
  const random = createSeededRandom(0x51a7c0de);
  const topics = [...CONTENT_RICH_QUERIES, ...CONTROL_QUERIES] as readonly string[];
  const documentTypes = ['spec', 'plan', 'tasks', 'decision_record', 'implementation_summary'];

  return Array.from({ length: CORPUS_SIZE }, (_, offset) => {
    const id = offset + 1;
    const topic = topics[offset % topics.length] ?? 'memory search';
    const topicTokens = topic.toLowerCase().match(/[a-z0-9]+/g) ?? [];
    const folderGroup = offset % 24;
    const title = `${topic} indexed memory ${id}`;
    const contentText = [
      topic,
      topic,
      'deterministic hybrid retrieval corpus with lexical semantic and graph evidence',
      `fixture group ${folderGroup} row ${id}`,
    ].join(' ');
    return {
      id,
      title,
      triggerPhrases: JSON.stringify([
        topic,
        `${topicTokens.slice(0, 2).join(' ')} evidence`,
      ]),
      specFolder: `specs/calibration/group-${folderGroup}`,
      filePath: `/benchmark/specs/calibration/group-${folderGroup}/document-${id}.md`,
      contentText,
      documentType: documentTypes[offset % documentTypes.length] ?? 'spec',
      importanceWeight: 0.5 + (offset % 10) * 0.04,
      qualityScore: 0.7 + (offset % 6) * 0.05,
      embedding: embedText(`${title} ${contentText}`, random),
    };
  });
}

function createRepresentativeIndex(rows: readonly CorpusRow[]): Database.Database {
  const indexDatabase = new Database(':memory:');
  indexDatabase.pragma('journal_mode = MEMORY');
  indexDatabase.pragma('synchronous = OFF');
  indexDatabase.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      title TEXT,
      trigger_phrases TEXT,
      spec_folder TEXT,
      file_path TEXT,
      content_text TEXT,
      document_type TEXT,
      importance_tier TEXT DEFAULT 'normal',
      importance_weight REAL DEFAULT 0.5,
      quality_score REAL DEFAULT 1.0,
      created_at TEXT DEFAULT '2026-01-01T00:00:00.000Z',
      updated_at TEXT DEFAULT '2026-01-01T00:00:00.000Z',
      deleted_at TEXT,
      expires_at TEXT
    );
    CREATE TABLE active_memory_projection (
      logical_key TEXT PRIMARY KEY,
      root_memory_id INTEGER,
      active_memory_id INTEGER UNIQUE,
      updated_at TEXT
    );
    CREATE TABLE vec_memories (
      rowid INTEGER PRIMARY KEY,
      embedding BLOB NOT NULL
    );
    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL,
      strength REAL NOT NULL,
      created_by TEXT NOT NULL
    );
    CREATE INDEX idx_causal_edges_source ON causal_edges(source_id);
    CREATE INDEX idx_causal_edges_target ON causal_edges(target_id);
    CREATE VIRTUAL TABLE memory_fts USING fts5(
      title,
      trigger_phrases,
      spec_folder,
      file_path,
      content_text,
      content='memory_index',
      content_rowid='id'
    );
  `);

  const insertMemory = indexDatabase.prepare(`
    INSERT INTO memory_index (
      id, title, trigger_phrases, spec_folder, file_path, content_text,
      document_type, importance_weight, quality_score
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertProjection = indexDatabase.prepare(`
    INSERT INTO active_memory_projection (
      logical_key, root_memory_id, active_memory_id, updated_at
    ) VALUES (?, ?, ?, '2026-01-01T00:00:00.000Z')
  `);
  const insertEmbedding = indexDatabase.prepare(
    'INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)',
  );
  const seedMemories = indexDatabase.transaction(() => {
    for (const row of rows) {
      insertMemory.run(
        row.id,
        row.title,
        row.triggerPhrases,
        row.specFolder,
        row.filePath,
        row.contentText,
        row.documentType,
        row.importanceWeight,
        row.qualityScore,
      );
      insertProjection.run(`memory-${row.id}`, row.id, row.id);
      insertEmbedding.run(
        row.id,
        Buffer.from(row.embedding.buffer, row.embedding.byteOffset, row.embedding.byteLength),
      );
    }
  });
  seedMemories.immediate();

  const insertEdge = indexDatabase.prepare(`
    INSERT INTO causal_edges (
      id, source_id, target_id, relation, strength, created_by
    ) VALUES (?, ?, ?, ?, ?, 'benchmark')
  `);
  const relations = ['supports', 'enabled', 'derived_from', 'caused'] as const;
  const seedEdges = indexDatabase.transaction(() => {
    let edgeId = 1;
    for (const row of rows) {
      const adjacentTarget = (row.id % rows.length) + 1;
      const skipTarget = ((row.id + 16) % rows.length) + 1;
      insertEdge.run(
        edgeId,
        String(row.id),
        String(adjacentTarget),
        relations[edgeId % relations.length],
        0.6 + (edgeId % 5) * 0.08,
      );
      edgeId += 1;
      insertEdge.run(
        edgeId,
        String(row.id),
        String(skipTarget),
        relations[edgeId % relations.length],
        0.6 + (edgeId % 5) * 0.08,
      );
      edgeId += 1;
    }
  });
  seedEdges.immediate();
  indexDatabase.exec("INSERT INTO memory_fts(memory_fts) VALUES('rebuild')");
  return indexDatabase;
}

function decodeEmbedding(buffer: Buffer): Float32Array {
  const bytes = Uint8Array.from(buffer);
  return new Float32Array(bytes.buffer);
}

function cosineSimilarity(left: Float32Array | number[], right: Float32Array): number {
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;
  for (let index = 0; index < right.length; index += 1) {
    const leftValue = left[index] ?? 0;
    const rightValue = right[index] ?? 0;
    dot += leftValue * rightValue;
    leftMagnitude += leftValue * leftValue;
    rightMagnitude += rightValue * rightValue;
  }
  const denominator = Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude);
  return denominator > 0 ? dot / denominator : 0;
}

function createSqliteVectorSearch(indexDatabase: Database.Database) {
  const statement = indexDatabase.prepare(`
    SELECT
      m.id,
      m.title,
      m.spec_folder,
      m.file_path,
      m.document_type,
      m.importance_tier,
      v.embedding
    FROM memory_index m
    JOIN vec_memories v ON v.rowid = m.id
    WHERE m.deleted_at IS NULL
  `);

  return (
    queryEmbedding: Float32Array | number[],
    options: Record<string, unknown>,
  ): Array<Record<string, unknown>> => {
    const limit = typeof options.limit === 'number' ? options.limit : RESULT_LIMIT;
    const minSimilarity = typeof options.minSimilarity === 'number' ? options.minSimilarity : 0;
    return (statement.all() as Array<{
      id: number;
      title: string;
      spec_folder: string;
      file_path: string;
      document_type: string;
      importance_tier: string;
      embedding: Buffer;
    }>)
      .map((row) => {
        const embedding = decodeEmbedding(row.embedding);
        return {
          ...row,
          embedding,
          similarity: cosineSimilarity(queryEmbedding, embedding) * 100,
        };
      })
      .filter((row) => row.similarity >= minSimilarity)
      .sort((left, right) => right.similarity - left.similarity)
      .slice(0, limit);
  };
}

function currentFlagState(): 'off' | 'on' {
  return process.env[CALIBRATION_FLAG] === 'true' ? 'on' : 'off';
}

function setFlagState(state: 'off' | 'on'): void {
  process.env[CALIBRATION_FLAG] = state === 'on' ? 'true' : 'false';
}

function createInstrumentedGraphSearch(graphSearch: GraphSearchFn): GraphSearchFn {
  return (query, options) => {
    graphCallsByState[currentFlagState()] += 1;
    return graphSearch(query, options);
  };
}

function percentile(values: readonly number[], fraction: number): number {
  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.max(0, Math.ceil(sorted.length * fraction) - 1);
  return sorted[index] ?? 0;
}

function round(value: number): number {
  return Number(value.toFixed(4));
}

function percentDelta(baseline: number, candidate: number): number {
  return baseline > 0 ? round(((candidate - baseline) / baseline) * 100) : 0;
}

function summarizeFlagMeasurement(measurement: FlagMeasurement) {
  return {
    p50Ms: round(percentile(measurement.latencies, 0.5)),
    p95Ms: round(percentile(measurement.latencies, 0.95)),
    graphInvocations: measurement.graphInvocations,
    degreeInvocations: measurement.degreeInvocations,
    graphExecutorCalls: measurement.graphExecutorCalls,
  };
}

function newFlagMeasurement(flagState: 'off' | 'on'): FlagMeasurement {
  return {
    flagState,
    latencies: [],
    queryLatencies: [],
    graphInvocations: 0,
    degreeInvocations: 0,
    graphExecutorCalls: 0,
  };
}

async function executeSearch(query: string): Promise<number> {
  const results = await hybridSearchEnhanced(query, embedText(query), {
    limit: RESULT_LIMIT,
    includeContent: false,
  });
  return results.length;
}

async function warmPipeline(): Promise<void> {
  clearDegreeCacheForDb(database);
  for (const { query } of ALL_QUERIES) {
    for (let iteration = 0; iteration < WARMUP_ITERATIONS; iteration += 1) {
      setFlagState(iteration % 2 === 0 ? 'off' : 'on');
      await executeSearch(query);
      setFlagState(iteration % 2 === 0 ? 'on' : 'off');
      await executeSearch(query);
    }
  }
  resetGraphMetrics();
  graphCallsByState = { off: 0, on: 0 };
}

async function measurePipeline(): Promise<Record<'off' | 'on', FlagMeasurement>> {
  const measurements = {
    off: newFlagMeasurement('off'),
    on: newFlagMeasurement('on'),
  };

  for (const { query, kind } of ALL_QUERIES) {
    const perQuery = { off: [] as number[], on: [] as number[] };
    for (let iteration = 0; iteration < MEASURED_ITERATIONS; iteration += 1) {
      const stateOrder: readonly ['off' | 'on', 'off' | 'on'] = iteration % 2 === 0
        ? ['off', 'on']
        : ['on', 'off'];
      for (const state of stateOrder) {
        setFlagState(state);
        const graphMetricsBefore = getGraphMetrics();
        const start = performance.now();
        const resultCount = await executeSearch(query);
        const elapsedMs = performance.now() - start;
        const graphMetricsAfter = getGraphMetrics();

        expect(resultCount, `${state} ${query}`).toBeGreaterThan(0);
        measurements[state].latencies.push(elapsedMs);
        perQuery[state].push(elapsedMs);
        measurements[state].graphInvocations +=
          graphMetricsAfter.totalQueries - graphMetricsBefore.totalQueries;
        measurements[state].degreeInvocations +=
          graphMetricsAfter.degreeQueries - graphMetricsBefore.degreeQueries;
      }
    }

    for (const state of ['off', 'on'] as const) {
      measurements[state].queryLatencies.push({
        query,
        kind,
        iterations: MEASURED_ITERATIONS,
        p50Ms: round(percentile(perQuery[state], 0.5)),
        p95Ms: round(percentile(perQuery[state], 0.95)),
      });
    }
  }

  measurements.off.graphExecutorCalls = graphCallsByState.off;
  measurements.on.graphExecutorCalls = graphCallsByState.on;
  return measurements;
}

function buildReport(
  measurements: Record<'off' | 'on', FlagMeasurement>,
): BenchmarkReport {
  const off = summarizeFlagMeasurement(measurements.off);
  const on = summarizeFlagMeasurement(measurements.on);
  const onByQuery = new Map(
    measurements.on.queryLatencies.map((latency) => [latency.query, latency]),
  );

  return {
    corpus: {
      memories: CORPUS_SIZE,
      embeddings: CORPUS_SIZE,
      dimensions: EMBEDDING_DIMENSIONS,
      ftsRows: CORPUS_SIZE,
      causalEdges: CORPUS_SIZE * 2,
    },
    execution: {
      warmupIterationsPerQueryAndState: WARMUP_ITERATIONS,
      measuredIterationsPerQueryAndState: MEASURED_ITERATIONS,
      contentRichQueries: CONTENT_RICH_QUERIES.length,
      controls: CONTROL_QUERIES.length,
      totalMeasuredCalls: ALL_QUERIES.length * MEASURED_ITERATIONS * 2,
      ordering: 'OFF/ON order alternates every iteration; warmups are excluded',
    },
    off,
    on,
    delta: {
      p50Ms: round(on.p50Ms - off.p50Ms),
      p95Ms: round(on.p95Ms - off.p95Ms),
      p50Percent: percentDelta(off.p50Ms, on.p50Ms),
      p95Percent: percentDelta(off.p95Ms, on.p95Ms),
      graphInvocations: on.graphInvocations - off.graphInvocations,
      degreeInvocations: on.degreeInvocations - off.degreeInvocations,
    },
    queries: measurements.off.queryLatencies.map((offLatency) => {
      const onLatency = onByQuery.get(offLatency.query);
      if (!onLatency) throw new Error(`Missing ON measurement for ${offLatency.query}`);
      return {
        query: offLatency.query,
        kind: offLatency.kind,
        offP50Ms: offLatency.p50Ms,
        onP50Ms: onLatency.p50Ms,
        p50DeltaMs: round(onLatency.p50Ms - offLatency.p50Ms),
        offP95Ms: offLatency.p95Ms,
        onP95Ms: onLatency.p95Ms,
        p95DeltaMs: round(onLatency.p95Ms - offLatency.p95Ms),
      };
    }),
  };
}

function readCorpusCounts(indexDatabase: Database.Database) {
  const scalar = (sql: string): number => {
    const row = indexDatabase.prepare(sql).get() as { count: number };
    return row.count;
  };
  return {
    memories: scalar('SELECT COUNT(*) AS count FROM memory_index'),
    embeddings: scalar('SELECT COUNT(*) AS count FROM vec_memories'),
    ftsRows: scalar('SELECT COUNT(*) AS count FROM memory_fts'),
    causalEdges: scalar('SELECT COUNT(*) AS count FROM causal_edges'),
  };
}

describe('query channel calibration production-path benchmark', () => {
  beforeAll(() => {
    setStableEnvironment();
    const corpus = createCorpus();
    database = createRepresentativeIndex(corpus);
    resetIndex();
    const graphSearch = createInstrumentedGraphSearch(
      createUnifiedGraphSearchFn(database),
    );
    initHybridSearch(database, createSqliteVectorSearch(database), graphSearch);
    const bm25Index = getIndex();
    for (const row of corpus) {
      bm25Index.addDocument(String(row.id), `${row.title} ${row.contentText}`);
    }
  });

  afterAll(() => {
    resetGraphMetrics();
    resetIndex();
    database.close();
    restoreEnvironment();
  });

  it('measures full-pipeline OFF versus ON latency and channel invocation shift', async () => {
    const corpusCounts = readCorpusCounts(database);
    expect(corpusCounts).toEqual({
      memories: CORPUS_SIZE,
      embeddings: CORPUS_SIZE,
      ftsRows: CORPUS_SIZE,
      causalEdges: CORPUS_SIZE * 2,
    });

    for (const query of CONTENT_RICH_QUERIES) {
      setFlagState('off');
      const offChannels = routeQuery(query).channels;
      setFlagState('on');
      const onChannels = routeQuery(query).channels;
      expect(offChannels, query).not.toContain('graph');
      expect(offChannels, query).not.toContain('degree');
      expect(onChannels, query).toContain('graph');
      expect(onChannels, query).toContain('degree');
    }

    for (const query of CONTROL_QUERIES) {
      setFlagState('off');
      const offChannels = routeQuery(query).channels;
      setFlagState('on');
      const onChannels = routeQuery(query).channels;
      expect(onChannels, query).toEqual(offChannels);
    }

    await warmPipeline();
    const measurements = await measurePipeline();
    const expectedInvocationShift = CONTENT_RICH_QUERIES.length * MEASURED_ITERATIONS;

    expect(measurements.off.latencies).toHaveLength(
      ALL_QUERIES.length * MEASURED_ITERATIONS,
    );
    expect(measurements.on.latencies).toHaveLength(
      ALL_QUERIES.length * MEASURED_ITERATIONS,
    );
    expect(
      measurements.on.graphInvocations - measurements.off.graphInvocations,
    ).toBe(expectedInvocationShift);
    expect(
      measurements.on.degreeInvocations - measurements.off.degreeInvocations,
    ).toBe(expectedInvocationShift);
    expect(measurements.off.graphExecutorCalls).toBe(measurements.off.graphInvocations);
    expect(measurements.on.graphExecutorCalls).toBe(measurements.on.graphInvocations);

    const report = buildReport(measurements);
    expect(report.off.p50Ms).toBeGreaterThan(0);
    expect(report.off.p95Ms).toBeGreaterThanOrEqual(report.off.p50Ms);
    expect(report.on.p50Ms).toBeGreaterThan(0);
    expect(report.on.p95Ms).toBeGreaterThanOrEqual(report.on.p50Ms);

    if (process.env.DEBUG_STRESS_TEST === 'true') {
      console.log(`QUERY_CHANNEL_CALIBRATION_BENCHMARK ${JSON.stringify(report)}`);
    }
  });
});
