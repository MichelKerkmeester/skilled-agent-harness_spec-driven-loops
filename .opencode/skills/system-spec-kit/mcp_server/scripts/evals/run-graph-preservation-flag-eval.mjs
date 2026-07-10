#!/usr/bin/env node
//
// Per-flag before/after benchmark for the two graph-preservation flags
// (SPECKIT_RETRIEVAL_CLASS_ROUTING, SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION),
// scored against the scoped graph-preservation-ground-truth.json fixture and
// sliced by content_rich_short / single_hop / control.
//
// A sibling of run-retrieval-flag-eval.mjs, not a fork of it: it imports and
// reuses that driver's backup/restore, search-option, and scoring machinery
// rather than duplicating it. It does not touch run-retrieval-flag-eval.mjs's
// own FLAG_SPECS or CLASS_DIMENSIONS, which are shaped around a different
// query-classification scheme than this packet's three slices.
//
// The reindex step here is a quiescence-verified clone-first preflight
// (source DB confirmed to have no pending/failed embeddings and no active
// scan/embedder job before it is copied) rather than a full causal_edges
// regeneration: no shipped tool performs that regeneration today, so
// requiring it would make this driver permanently unrunnable.

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import Database from 'better-sqlite3';

import {
  prepareEvalDatabase,
  computeMeanMetrics,
  groupGroundTruth,
  normalizeSearchResults,
  buildPerFlagSearchOptions,
} from './run-retrieval-flag-eval.mjs';

const SOURCE_DB_PATH = path.resolve(process.env.MEMORY_DB_PATH ?? 'database/context-index.sqlite');
const OUTPUT_PATH = path.resolve(
  process.env.SPECKIT_GRAPH_PRESERVATION_EVAL_OUTPUT ?? '/tmp/speckit-graph-preservation-flag-eval.json',
);
const RECALL_K = Number.parseInt(process.env.SPECKIT_RETRIEVAL_EVAL_K ?? '20', 10);
const NDCG_K = Number.parseInt(process.env.SPECKIT_RETRIEVAL_EVAL_NDCG_K ?? '10', 10);
const MRR_K = RECALL_K;

// No fixed noise-band convention exists in this repo yet to inherit --
// a sibling flag-graduation benchmark's own open questions leave the width
// unresolved ("whether the noise band is set per metric or shared across all
// flags"), so each benchmark resolves it independently. 0.02 (2 percentage
// points absolute) is this driver's resolution: small enough to catch a real
// scoped-blast-radius violation, large enough to tolerate the float noise a
// <150-query fixture produces.
const CONTROL_SLICE_NOISE_BAND = 0.02;

const FLAG_SPECS = [
  {
    label: 'retrieval_class_routing',
    env: 'SPECKIT_RETRIEVAL_CLASS_ROUTING',
    currentDefault: 'off',
  },
  {
    label: 'content_rich_short_query_graph_preservation',
    env: 'SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION',
    currentDefault: 'off',
  },
];

const RUNTIME_FLAG_ENVS = new Set(FLAG_SPECS.map((flag) => flag.env));

function moduleUrl(relativePath) {
  return pathToFileURL(path.resolve(relativePath)).href;
}

function formatNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? Number(value.toFixed(6)) : null;
}

function restoreEnv(snapshot) {
  for (const name of RUNTIME_FLAG_ENVS) {
    if (snapshot[name] === undefined) {
      delete process.env[name];
    } else {
      process.env[name] = snapshot[name];
    }
  }
}

function forceFlag(flag, enabled) {
  process.env[flag.env] = enabled ? 'true' : 'false';
}

// Mirrors handlers/memory-crud-health.ts's own scan/embedder-job/pending-vector
// checks, read directly off the DB rather than importing the handler (which
// pulls in the full MCP response-envelope stack this standalone script does
// not need). Kept in sync manually; both are small, stable, DB-only reads.
const INDEX_SCAN_COOLDOWN_MS = 30_000;
const INDEX_SCAN_LEASE_EXPIRY_MS = INDEX_SCAN_COOLDOWN_MS * 2;

function hasActiveScanJob(db, now) {
  try {
    const row = db.prepare('SELECT value FROM config WHERE key = ?').get('scan_started_at');
    const parsed = row?.value ? Number.parseInt(row.value, 10) : 0;
    const scanStartedAt = Number.isFinite(parsed) ? parsed : 0;
    return scanStartedAt > 0 && now - scanStartedAt < INDEX_SCAN_LEASE_EXPIRY_MS;
  } catch {
    return false;
  }
}

function hasActiveEmbedderJob(db) {
  try {
    const table = db.prepare(`
      SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'embedder_jobs' LIMIT 1
    `).get();
    if (!table) return false;
    const row = db.prepare(`
      SELECT COUNT(*) AS count FROM embedder_jobs WHERE status IN ('queued', 'running')
    `).get();
    return (row?.count ?? 0) > 0;
  } catch {
    return false;
  }
}

function readEmbeddingCounts(db) {
  const stats = db.prepare(`
    SELECT
      SUM(CASE WHEN embedding_status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN embedding_status = 'retry' THEN 1 ELSE 0 END) as retry,
      SUM(CASE WHEN embedding_status = 'failed' THEN 1 ELSE 0 END) as failed
    FROM memory_index
  `).get();
  return {
    pending: stats?.pending ?? 0,
    retry: stats?.retry ?? 0,
    failed: stats?.failed ?? 0,
  };
}

/**
 * Pre-flight: refuse to benchmark against a source database that is
 * mid-scan, mid-embed, or carrying unresolved embedding failures. Runs against
 * the SOURCE db path directly (a fresh read-only connection, never the
 * auto-resolved shared/paths.ts DB_PATH), before any copy is made.
 */
function assertSourceQuiescent(sourceDbPath) {
  const db = new Database(sourceDbPath, { readonly: true, fileMustExist: true });
  try {
    const now = Date.now();
    const embeddingCounts = readEmbeddingCounts(db);
    const activeScanJob = hasActiveScanJob(db, now);
    const activeEmbedderJob = hasActiveEmbedderJob(db);

    const blockers = [];
    if (embeddingCounts.pending > 0) blockers.push(`${embeddingCounts.pending} pending embedding(s)`);
    if (embeddingCounts.retry > 0) blockers.push(`${embeddingCounts.retry} retry-queued embedding(s)`);
    if (embeddingCounts.failed > 0) blockers.push(`${embeddingCounts.failed} failed embedding(s)`);
    if (activeScanJob) blockers.push('an active index scan job');
    if (activeEmbedderJob) blockers.push('an active embedder job');

    return {
      quiescent: blockers.length === 0,
      blockers,
      embeddingCounts,
      activeScanJob,
      activeEmbedderJob,
      checkedAt: new Date(now).toISOString(),
    };
  } finally {
    db.close();
  }
}

/**
 * Fail-closed guard: confirms a resolved path actually lives under the
 * eval temp root before this driver treats it as a safe-to-mutate snapshot.
 * Exists because shared/paths.ts's workspace-boundary validator silently
 * redirects an out-of-workspace-root database dir back to the canonical
 * checkout (a real, observed warning during this benchmark's own
 * feasibility investigation) -- this assertion is what turns that class of
 * bug into a loud failure instead of a silent mutation of the live database.
 */
function assertWithinEvalRoot(label, candidatePath, evalRoot) {
  const relative = path.relative(evalRoot, candidatePath);
  const withinRoot = relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
  if (!withinRoot) {
    throw new Error(
      `Refusing to proceed: ${label} (${candidatePath}) does not resolve under the eval temp root `
      + `(${evalRoot}). This guards against shared/paths.ts's workspace-boundary fallback silently `
      + 'redirecting a write at the canonical checkout instead of the isolated snapshot.',
    );
  }
}

function groupBySlice(queries) {
  const bySlice = new Map([
    ['content_rich_short', []],
    ['single_hop', []],
    ['control', []],
  ]);
  for (const query of queries) {
    if (!bySlice.has(query.slice)) bySlice.set(query.slice, []);
    bySlice.get(query.slice).push(query);
  }
  return bySlice;
}

async function main() {
  if (!Number.isInteger(RECALL_K) || RECALL_K <= 0) {
    throw new Error(`Invalid Recall@K: ${RECALL_K}`);
  }

  const preflight = assertSourceQuiescent(SOURCE_DB_PATH);
  if (!preflight.quiescent) {
    throw new Error(
      'Source database is not quiescent; refusing to benchmark against a non-representative '
      + `snapshot: ${preflight.blockers.join(', ')}. Wait for embeddings/scan to finish and re-run.`,
    );
  }

  const evalDatabase = await prepareEvalDatabase(SOURCE_DB_PATH);
  assertWithinEvalRoot('eval database path', evalDatabase.dbPath, evalDatabase.evalRoot);
  assertWithinEvalRoot('eval vector shard path', evalDatabase.evalShardPath, evalDatabase.evalRoot);

  process.env.MEMORY_DB_PATH = evalDatabase.dbPath;

  const [vectorIndex, hybridSearch, graphSearch, embeddings, groundTruth, evalMetrics] = await Promise.all([
    import(moduleUrl('dist/lib/search/vector-index.js')),
    import(moduleUrl('dist/lib/search/hybrid-search.js')),
    import(moduleUrl('dist/lib/search/graph-search-fn.js')),
    import(moduleUrl('dist/lib/providers/embeddings.js')),
    import(moduleUrl('dist/lib/eval/graph-preservation-ground-truth-data.js')),
    import(moduleUrl('dist/lib/eval/eval-metrics.js')),
  ]);

  const db = vectorIndex.initializeDb(evalDatabase.dbPath, { skipRestoreRecovery: true });
  const activeDbPath = typeof vectorIndex.getDbPath === 'function' ? vectorIndex.getDbPath() : evalDatabase.dbPath;
  if (activeDbPath) {
    assertWithinEvalRoot('active vector-index db path', path.resolve(activeDbPath), evalDatabase.evalRoot);
  }

  const graphSearchFn = graphSearch.createUnifiedGraphSearchFn(db);
  hybridSearch.init(db, vectorIndex.vectorSearch, graphSearchFn);

  const queries = groundTruth.GRAPH_PRESERVATION_QUERIES;
  if (queries.length < 50) {
    throw new Error(
      `Fixture has ${queries.length} quer(ies); at least 50 are required. `
      + 'Author more queries in lib/eval/data/graph-preservation-ground-truth.json before running the benchmark.',
    );
  }

  const { resolved, unresolved } = groundTruth.resolveGraphPreservationRelevanceIds(
    db,
    groundTruth.GRAPH_PRESERVATION_RELEVANCES,
  );
  if (unresolved.length > 0) {
    const detail = unresolved
      .slice(0, 10)
      .map((row) => `query ${row.queryId} -> ${row.anchorFilePath}`)
      .join('; ');
    throw new Error(
      `${unresolved.length} relevance row(s) could not resolve their anchor file path against the `
      + `eval snapshot (showing up to 10): ${detail}. Refusing to score against an incomplete mapping.`,
    );
  }

  const relevancesByQuery = groupGroundTruth(resolved);
  const sliceGroups = groupBySlice(queries);

  const embeddingCache = new Map();
  async function getEmbedding(query) {
    if (embeddingCache.has(query)) return embeddingCache.get(query);
    try {
      const embedding = await embeddings.generateQueryEmbedding(query);
      embeddingCache.set(query, embedding);
      return embedding;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[graph-preservation-eval] Query embedding failed, continuing without vector lane: ${message}`);
      embeddingCache.set(query, null);
      return null;
    }
  }

  async function search(query, options = {}) {
    const embedding = await getEmbedding(query);
    const rows = await hybridSearch.hybridSearchEnhanced(
      query,
      embedding,
      buildPerFlagSearchOptions(RECALL_K, options),
    );
    return normalizeSearchResults(rows);
  }

  const originalEnv = Object.fromEntries([...RUNTIME_FLAG_ENVS].map((name) => [name, process.env[name]]));

  const evaluateVariant = (resultMap) => {
    const overall = computeMeanMetrics(queries, relevancesByQuery, resultMap, evalMetrics);
    const bySlice = {};
    for (const [slice, sliceQueries] of sliceGroups) {
      bySlice[slice] = computeMeanMetrics(sliceQueries, relevancesByQuery, resultMap, evalMetrics);
    }
    return { overall, bySlice };
  };

  const flagRows = [];
  for (const flag of FLAG_SPECS) {
    const runVariant = async (enabled) => {
      restoreEnv(originalEnv);
      forceFlag(flag, enabled);
      graphSearch.clearDegreeCacheForDb(db);
      const resultMap = new Map();
      for (const query of queries) {
        resultMap.set(query.id, await search(query.query, { evaluationMode: true }));
      }
      return evaluateVariant(resultMap);
    };

    const off = await runVariant(false);
    const on = await runVariant(true);

    const bySlice = {};
    for (const slice of sliceGroups.keys()) {
      const offSlice = off.bySlice[slice] ?? { recall: 0, ndcg: 0, mrr: 0, evaluatedQueries: 0 };
      const onSlice = on.bySlice[slice] ?? { recall: 0, ndcg: 0, mrr: 0, evaluatedQueries: 0 };
      bySlice[slice] = {
        recallOff: formatNumber(offSlice.recall),
        recallOn: formatNumber(onSlice.recall),
        recallDelta: formatNumber(onSlice.recall - offSlice.recall),
        ndcgOff: formatNumber(offSlice.ndcg),
        ndcgOn: formatNumber(onSlice.ndcg),
        ndcgDelta: formatNumber(onSlice.ndcg - offSlice.ndcg),
        mrrOff: formatNumber(offSlice.mrr),
        mrrOn: formatNumber(onSlice.mrr),
        mrrDelta: formatNumber(onSlice.mrr - offSlice.mrr),
        n: offSlice.evaluatedQueries,
      };
    }

    // Confirms each flag's blast radius stays scoped: the control slice
    // (queries that trip neither activation predicate) must stay inside the
    // noise band, since it should see no material effect from either flag.
    const controlDelta = bySlice.control ?? null;
    const controlNeutral = controlDelta === null
      ? null
      : Math.abs(controlDelta.recallDelta ?? 0) <= CONTROL_SLICE_NOISE_BAND
        && Math.abs(controlDelta.ndcgDelta ?? 0) <= CONTROL_SLICE_NOISE_BAND
        && Math.abs(controlDelta.mrrDelta ?? 0) <= CONTROL_SLICE_NOISE_BAND;

    flagRows.push({
      flag: flag.label,
      env: flag.env,
      currentDefault: flag.currentDefault,
      recallOff: formatNumber(off.overall.recall),
      recallOn: formatNumber(on.overall.recall),
      recallDelta: formatNumber(on.overall.recall - off.overall.recall),
      ndcgOff: formatNumber(off.overall.ndcg),
      ndcgOn: formatNumber(on.overall.ndcg),
      ndcgDelta: formatNumber(on.overall.ndcg - off.overall.ndcg),
      mrrOff: formatNumber(off.overall.mrr),
      mrrOn: formatNumber(on.overall.mrr),
      mrrDelta: formatNumber(on.overall.mrr - off.overall.mrr),
      bySlice,
      controlSliceNeutral: controlNeutral,
      controlSliceNoiseBand: CONTROL_SLICE_NOISE_BAND,
      evaluatedQueries: { off: off.overall.evaluatedQueries, on: on.overall.evaluatedQueries },
    });
  }

  restoreEnv(originalEnv);

  const output = {
    generatedAt: new Date().toISOString(),
    sourceDbPath: SOURCE_DB_PATH,
    dbPath: evalDatabase.dbPath,
    sourceShardPath: evalDatabase.sourceShardPath,
    evalShardPath: evalDatabase.evalShardPath,
    preflight,
    recallK: RECALL_K,
    ndcgK: NDCG_K,
    mrrK: MRR_K,
    queryCount: queries.length,
    relevanceCount: resolved.length,
    sliceDistribution: Object.fromEntries(
      [...sliceGroups].map(([slice, sliceQueries]) => [slice, sliceQueries.length]),
    ),
    flags: flagRows,
  };

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);
  console.log(JSON.stringify(output, null, 2));
}

const invokedDirectly = Boolean(process.argv[1])
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.stack : String(error));
    process.exitCode = 1;
  });
}

export {
  assertSourceQuiescent,
  assertWithinEvalRoot,
  groupBySlice,
  CONTROL_SLICE_NOISE_BAND,
  FLAG_SPECS,
};
