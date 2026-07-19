#!/usr/bin/env node

// ── false-confirm eval: the off-corpus regression guard ─────────────────────
//
// The 029 model benchmark caught /memory:search confidently citing an absent
// term: kubernetes scored "good" on a semantically unrelated doc. The verdict
// path bands on absolute cosine with no lexical-grounding signal, so a fluent
// but unrelated doc earns a high background cosine and a lone spurious hit sails
// through to good. The eval harness could not reproduce it because every
// existing hard-negative is an in-corpus decoy with a real relevance-3 target,
// so no sample tested the absent-term case.
//
// This driver scores the off_corpus query class through the same verdict path
// the production formatter uses (computeResultConfidence then
// assessRequestQuality), treats each off-corpus query as a hard-negative whose
// only correct verdict is non-citable, then reads the existing dormant
// falseGoodOnHardNegatives metric to report a false-confirm rate. The rate is
// embedder-scoped, so the active embedder name is recorded in the report.
//
// The gate enforces a zero-tolerance ceiling by default, graduated on a measured
// benchmark now that the lexical-grounding floor is default-on. With
// SPECKIT_FALSE_CONFIRM_MAX_RATE unset the driver bars any rate past 0.0, so an
// absent-term false confirm exits non-zero. An explicit bar overrides the ceiling,
// and a grandfather report mode records the rate and exits zero regardless, kept for
// a corpus that has not adopted the floor. This driver measures, it does not move the
// verdict.
//
// The DB is opened read-only via a tempdir backup, this driver never mutates the
// live DB. It follows the same copy-first discipline as the sibling drivers.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import Database from 'better-sqlite3';

const SOURCE_DB_PATH = path.resolve(process.env.MEMORY_DB_PATH ?? 'database/context-index.sqlite');
const OUTPUT_PATH = path.resolve(
  process.env.SPECKIT_FALSE_CONFIRM_OUTPUT ?? '/tmp/speckit-false-confirm-eval.json',
);

// The query class this driver scores. Every member names a technology
// structurally absent from the corpus and carries zero relevance rows.
export const OFF_CORPUS_CATEGORY = 'off_corpus';

// The env that enables the gate. Unset means report-only, default-off.
export const GATE_ENV = 'SPECKIT_FALSE_CONFIRM_MAX_RATE';

// The grandfather report mode env. When true the driver records the rate and
// exits zero even with the gate env set, so the existing corpus is grandfathered
// until the downstream verdict fix lands.
export const GRANDFATHER_ENV = 'SPECKIT_FALSE_CONFIRM_GRANDFATHER';

// The default bar the gate enforces when the env is unset. Zero tolerance: a corpus
// that never false-confirms an absent term is the target the lexical-grounding floor
// reaches, so an unset env now enforces this ceiling rather than disabling the gate.
export const DEFAULT_MAX_RATE = 0.0;

const SEARCH_LIMIT = Number.parseInt(process.env.SPECKIT_FALSE_CONFIRM_LIMIT ?? '20', 10);

// Parse an explicit gate bar from the env value. Unset or empty returns null, which
// the driver resolves to the default ceiling. A non-numeric or out-of-range value is
// rejected at parse so the gate is never silently disabled by a typo.
export function parseMaxRate(raw) {
  if (raw === undefined || raw === null || String(raw).trim() === '') {
    return null;
  }
  const value = Number(String(raw).trim());
  if (!Number.isFinite(value)) {
    throw new Error(`${GATE_ENV} must be a finite number in [0,1], received: ${String(raw)}`);
  }
  if (value < 0 || value > 1) {
    throw new Error(`${GATE_ENV} must be within [0,1], received: ${String(raw)}`);
  }
  return value;
}

// Resolve the bar the driver actually enforces. An explicit env value wins, an unset
// env resolves to the graduated zero-tolerance ceiling rather than disabling the gate.
export function resolveEffectiveMaxRate(raw) {
  const parsed = parseMaxRate(raw);
  return parsed === null ? DEFAULT_MAX_RATE : parsed;
}

// Parse the grandfather flag from env or argv.
export function parseGrandfather(env = process.env, argv = process.argv) {
  const fromEnv = String(env[GRANDFATHER_ENV] ?? '').trim().toLowerCase();
  if (fromEnv === 'true' || fromEnv === '1') return true;
  return Array.isArray(argv) && argv.includes('--grandfather');
}

// The false-confirm rate is the share of off-corpus hard-negatives that earned a
// good verdict. A class with no hard-negatives reports zero rather than dividing
// by zero.
export function computeFalseConfirmRate(metrics) {
  const total = metrics?.hardNegativeCount ?? 0;
  if (total <= 0) return 0;
  return (metrics?.falseGoodOnHardNegatives ?? 0) / total;
}

// Every off-corpus query is a hard-negative whose only correct verdict is
// non-citable, so it carries expectedCitable false and isHardNegative true. A
// good verdict on one of these is a false confirm.
export function buildConfusionSample(predictedLabel) {
  return {
    predicted: predictedLabel,
    expectedCitable: false,
    isHardNegative: true,
  };
}

// Decide the gate outcome. Grandfather mode and an unset bar both report without
// failing. With the bar set, a rate past it fails.
export function evaluateGate({ rate, maxRate, grandfather }) {
  if (grandfather) {
    return { enforced: false, pass: true, exitCode: 0, reason: 'grandfather report mode, rate recorded without enforcement' };
  }
  if (maxRate === null || maxRate === undefined) {
    return { enforced: false, pass: true, exitCode: 0, reason: `gate disabled, ${GATE_ENV} unset` };
  }
  if (rate > maxRate) {
    return { enforced: true, pass: false, exitCode: 1, reason: `false-confirm rate ${rate} exceeds bar ${maxRate}` };
  }
  return { enforced: true, pass: true, exitCode: 0, reason: `false-confirm rate ${rate} within bar ${maxRate}` };
}

// Surface the off-corpus class and assert structural absence at load. A query
// that has drifted into the corpus and gained a relevance row is flagged rather
// than silently scored as a valid in-corpus hard-negative.
export function resolveOffCorpusClass(queries, relevances) {
  const offCorpus = queries.filter((q) => q.category === OFF_CORPUS_CATEGORY);
  if (offCorpus.length === 0) {
    throw new Error(`No ${OFF_CORPUS_CATEGORY} queries found in the ground-truth source.`);
  }
  const offCorpusIds = new Set(offCorpus.map((q) => q.id));
  const drifted = relevances.filter((r) => offCorpusIds.has(r.queryId));
  if (drifted.length > 0) {
    const ids = [...new Set(drifted.map((r) => r.queryId))].join(', ');
    throw new Error(
      `${OFF_CORPUS_CATEGORY} queries must carry zero relevance rows, found rows for query ids: ${ids}`,
    );
  }
  return offCorpus;
}

function removeSqliteFileSet(filePath) {
  for (const suffix of ['', '-wal', '-shm']) {
    fs.rmSync(`${filePath}${suffix}`, { force: true });
  }
}

async function backupSqlite(sourcePath, targetPath) {
  removeSqliteFileSet(targetPath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true, mode: 0o700 });
  const source = new Database(sourcePath, { readonly: true, fileMustExist: true });
  try {
    source.pragma('busy_timeout = 10000');
    await source.backup(targetPath);
  } finally {
    source.close();
  }
}

function createProfileSlug(provider, model, dim) {
  const safeModel = model.replace(/[^a-zA-Z0-9-_.]/g, '_').replace(/__+/g, '_').toLowerCase();
  return `${provider}__${safeModel}__${dim}`;
}

function readActiveEmbedder(dbPath) {
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  try {
    const rows = db.prepare(`
      SELECT key, value FROM vec_metadata
      WHERE key IN ('active_embedder_name', 'active_embedder_dim', 'active_embedder_provider')
    `).all();
    const metadata = new Map(rows.map((row) => [row.key, row.value]));
    const name = metadata.get('active_embedder_name');
    const provider = metadata.get('active_embedder_provider');
    const dim = Number.parseInt(metadata.get('active_embedder_dim') ?? '', 10);
    if (!name || !provider || !Number.isInteger(dim) || dim <= 0) {
      throw new Error(`Could not read active embedder metadata from ${dbPath}`);
    }
    return { name, provider, dim };
  } finally {
    db.close();
  }
}

async function prepareEvalDatabase(sourceDbPath) {
  const evalRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-false-confirm-'));
  const evalDbPath = path.join(evalRoot, 'context-index.sqlite');
  await backupSqlite(sourceDbPath, evalDbPath);

  const activeEmbedder = readActiveEmbedder(evalDbPath);
  const shardSlug = createProfileSlug(activeEmbedder.provider, activeEmbedder.name, activeEmbedder.dim);
  const shardName = `context-vectors__${shardSlug}.sqlite`;
  const sourceShardPath = path.join(path.dirname(sourceDbPath), 'vectors', shardName);
  const evalShardPath = path.join(path.dirname(evalDbPath), 'vectors', shardName);
  if (!fs.existsSync(sourceShardPath)) {
    throw new Error(`Active vector shard not found: ${sourceShardPath}`);
  }
  await backupSqlite(sourceShardPath, evalShardPath);
  return { evalRoot, dbPath: evalDbPath, sourceShardPath, evalShardPath, activeEmbedder };
}

function moduleUrl(relativePath) {
  return pathToFileURL(path.resolve(relativePath)).href;
}

function formatNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? Number(value.toFixed(6)) : null;
}

function resolveMemoryId(row) {
  return Number(row.parentMemoryId ?? row.parent_id ?? row.parentId ?? row.id);
}

// Keep every row field so the verdict path sees the absolute-relevance signal
// (similarity/score) it bands on, then ensure id and score are present for the
// confidence computation. This mirrors the production wiring rather than the
// stripped shape the recall drivers use.
function toScoredRows(rows) {
  return rows
    .map((row, index) => {
      const memoryId = resolveMemoryId(row);
      if (!Number.isInteger(memoryId)) return null;
      return {
        ...row,
        id: memoryId,
        score: typeof row.score === 'number' && Number.isFinite(row.score) ? row.score : 0,
        rank: index + 1,
      };
    })
    .filter((row) => row !== null);
}

function lookupDocName(db, memoryId) {
  if (!Number.isInteger(memoryId)) return null;
  const row = db.prepare('SELECT id, title, file_path FROM memory_index WHERE id = ?').get(memoryId);
  if (!row) return null;
  return { memoryId: row.id, title: row.title ?? null, filePath: row.file_path ?? null };
}

async function main() {
  if (!Number.isInteger(SEARCH_LIMIT) || SEARCH_LIMIT <= 0) {
    throw new Error(`Invalid search limit: ${SEARCH_LIMIT}`);
  }

  const maxRate = resolveEffectiveMaxRate(process.env[GATE_ENV]);
  const grandfather = parseGrandfather();

  const evalDatabase = await prepareEvalDatabase(SOURCE_DB_PATH);
  process.env.MEMORY_DB_PATH = evalDatabase.dbPath;

  const [vectorIndex, hybridSearch, graphSearch, embeddings, groundTruth, confidenceScoring, evalMetrics] =
    await Promise.all([
      import(moduleUrl('dist/lib/search/vector-index.js')),
      import(moduleUrl('dist/lib/search/hybrid-search.js')),
      import(moduleUrl('dist/lib/search/graph-search-fn.js')),
      import(moduleUrl('dist/lib/providers/embeddings.js')),
      import(moduleUrl('dist/lib/eval/ground-truth-data.js')),
      import(moduleUrl('dist/lib/search/confidence-scoring.js')),
      import(moduleUrl('dist/lib/eval/eval-metrics.js')),
    ]);

  if (typeof confidenceScoring.assessRequestQuality !== 'function'
    || typeof confidenceScoring.computeResultConfidence !== 'function') {
    throw new Error('confidence-scoring is missing assessRequestQuality or computeResultConfidence, the verdict path contract changed.');
  }
  if (typeof evalMetrics.computeCitabilityConfusionMetrics !== 'function') {
    throw new Error('eval-metrics is missing computeCitabilityConfusionMetrics, the dormant metric was renamed or removed.');
  }

  const offCorpusQueries = resolveOffCorpusClass(
    groundTruth.GROUND_TRUTH_QUERIES,
    groundTruth.GROUND_TRUTH_RELEVANCES,
  );

  const db = vectorIndex.initializeDb(evalDatabase.dbPath, { skipRestoreRecovery: true });
  const graphSearchFn = graphSearch.createUnifiedGraphSearchFn(db);
  hybridSearch.init(db, vectorIndex.vectorSearch, graphSearchFn);

  const embeddingCache = new Map();
  async function getEmbedding(query) {
    if (embeddingCache.has(query)) return embeddingCache.get(query);
    try {
      const embedding = await embeddings.generateQueryEmbedding(query);
      embeddingCache.set(query, embedding);
      return embedding;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[false-confirm] Query embedding failed, continuing without vector lane: ${message}`);
      embeddingCache.set(query, null);
      return null;
    }
  }

  // The production default route, the path users actually get. No forceAllChannels
  // and no evaluationMode, so the verdict reproduces what /memory:search bands.
  async function prodSearch(query) {
    const embedding = await getEmbedding(query);
    return hybridSearch.hybridSearchEnhanced(query, embedding, {
      limit: SEARCH_LIMIT,
      useVector: true,
      useBm25: true,
      useFts: true,
      useGraph: true,
      includeContent: false,
    });
  }

  const perQuery = [];
  const samples = [];
  for (const query of offCorpusQueries) {
    const rawRows = await prodSearch(query.query);
    const scoredRows = toScoredRows(rawRows);
    const confidences = confidenceScoring.computeResultConfidence(scoredRows);
    const predicted = confidenceScoring.assessRequestQuality(scoredRows, confidences).requestQuality.label;
    const topHit = scoredRows.length > 0 ? lookupDocName(db, scoredRows[0].id) : null;

    samples.push(buildConfusionSample(predicted));
    perQuery.push({
      queryId: query.id,
      query: query.query,
      isAnchor: query.notes?.includes('PERMANENT ANCHOR') ?? false,
      predicted,
      falseConfirm: predicted === 'good',
      topHit: topHit
        ? { memoryId: topHit.memoryId, title: topHit.title, filePath: topHit.filePath }
        : null,
    });
  }

  const metrics = evalMetrics.computeCitabilityConfusionMetrics(samples);
  const rate = computeFalseConfirmRate(metrics);
  const gate = evaluateGate({ rate, maxRate, grandfather });

  const report = {
    generatedAt: new Date().toISOString(),
    sourceDbPath: SOURCE_DB_PATH,
    dbPath: evalDatabase.dbPath,
    embedder: evalDatabase.activeEmbedder,
    offCorpusCategory: OFF_CORPUS_CATEGORY,
    scoredTerms: offCorpusQueries.map((q) => q.query),
    searchLimit: SEARCH_LIMIT,
    falseConfirmRate: formatNumber(rate),
    hardNegativeCount: metrics.hardNegativeCount,
    falseGoodOnHardNegatives: metrics.falseGoodOnHardNegatives,
    gate: {
      env: GATE_ENV,
      maxRate,
      defaultMaxRate: DEFAULT_MAX_RATE,
      grandfather,
      enforced: gate.enforced,
      pass: gate.pass,
      reason: gate.reason,
    },
    perQuery,
  };

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));

  process.exitCode = gate.exitCode;
}

// Only run the benchmark when invoked as a CLI, importing the module (e.g. from a
// test) must not execute the full eval.
const invokedDirectly = Boolean(process.argv[1])
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.stack : String(error));
    process.exitCode = 1;
  });
}
