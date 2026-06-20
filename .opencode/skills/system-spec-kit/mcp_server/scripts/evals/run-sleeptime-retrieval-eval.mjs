#!/usr/bin/env node

// Sleep-time consolidation DOWNSTREAM retrieval eval (the A/B that makes the
// flag measurable).
//
// The existing run-sleeptime-eval.mjs measures only intrinsic dedup metrics on a
// synthetic transcript: it never mutates the index and never asks a retrieval
// consumer whether the consolidation helped or hurt. With the flag's shadow mode
// leaving the index byte-identical, flag-on and flag-off retrieve identical
// results — so the benefit is unmeasurable as built.
//
// This driver closes that gap. It MATERIALIZES the dedup as a real index mutation
// (deprecate-not-delete in memory_index + a physical vector-shard delete + VACUUM)
// and then A/B-QUERIES the result through the production retrieval consumer
// (hybridSearchEnhanced) over the curated ground truth. PRE = an untouched copy;
// POST = the same copy with the dedup drop-set deprecated and the shard rebuilt.
//
// Hard safety contract:
//   - The live database is NEVER opened for write. Every step runs on a /tmp copy
//     (PRE and POST each get their own copy + shard); the source is opened readonly
//     only for the backup snapshot.
//   - No curated ground-truth id may land in the drop-set. This is asserted before
//     any mutation and re-asserted on the realized set; a violation aborts.
//   - PRE must reproduce the standalone retrieval baseline (index-rebuild
//     faithfulness) before the PRE/POST delta is trusted.
//
// The drop-set selector reuses the consolidation cosine scan (memory_index JOIN
// vec_memories, pairwise cosine) at a high-precision >= 0.96 threshold so that only
// true near-duplicate rows are dropped. The lower-similarity row of each duplicate
// pair is deprecated; the representative survives.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import Database from 'better-sqlite3';

const SOURCE_DB_PATH = path.resolve(process.env.MEMORY_DB_PATH ?? 'database/context-index.sqlite');
const OUTPUT_PATH = path.resolve(
  process.env.SPECKIT_SLEEPTIME_RETRIEVAL_EVAL_OUTPUT ?? '/tmp/speckit-sleeptime-retrieval-eval.json',
);
const RECALL_K = Number.parseInt(process.env.SPECKIT_SLEEPTIME_RETRIEVAL_EVAL_K ?? '20', 10);
const NDCG_K = Number.parseInt(process.env.SPECKIT_SLEEPTIME_RETRIEVAL_EVAL_NDCG_K ?? '10', 10);

// Dedup cosine threshold. The consolidation candidate scan uses 0.85; the dispatch
// asks for a high-precision >= 0.96 so the drop-set is true near-duplicates only.
const DEDUP_COSINE_THRESHOLD = Number.parseFloat(
  process.env.SPECKIT_SLEEPTIME_DEDUP_COSINE ?? '0.96',
);
// Cap the O(n^2) candidate pool the same way the consolidation scan caps at 500,
// but tunable so a full-corpus dedup-rate run is possible on demand.
const SCAN_LIMIT = Number.parseInt(process.env.SPECKIT_SLEEPTIME_DEDUP_SCAN_LIMIT ?? '2000', 10);
// Walltime ceiling for the pairwise scan, mirroring the consolidation 5s deadline
// but generous enough for a larger pool in an offline eval.
const SCAN_DEADLINE_MS = Number.parseInt(process.env.SPECKIT_SLEEPTIME_DEDUP_DEADLINE_MS ?? '60000', 10);

// Faithfulness tolerance: PRE Recall@K may differ from the standalone baseline by
// at most this (rebuild noise / ordering ties). A larger gap means the rebuilt
// PRE index is not the same surface the baseline measured — abort.
const FAITHFULNESS_EPSILON = Number.parseFloat(
  process.env.SPECKIT_SLEEPTIME_FAITHFULNESS_EPSILON ?? '1e-9',
);
// Live-write gate tolerance: POST recall may not fall below PRE by more than this.
const RECALL_GATE_EPSILON = Number.parseFloat(
  process.env.SPECKIT_SLEEPTIME_RECALL_GATE_EPSILON ?? '0.005',
);

const CONSOLIDATION_FLAG = 'SPECKIT_SLEEPTIME_CONSOLIDATION';
const LIVE_WRITE_FLAG = 'SPECKIT_SLEEPTIME_LIVE_WRITE';

function moduleUrl(relativePath) {
  return pathToFileURL(path.resolve(relativePath)).href;
}

function removeSqliteFileSet(filePath) {
  for (const suffix of ['', '-wal', '-shm']) {
    fs.rmSync(`${filePath}${suffix}`, { force: true });
  }
}

// Copy a sqlite file to a scratch path. The source is opened readonly and only
// for the snapshot, so the live database is never opened for write.
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

function createProfileSlug(provider, model, dim, dtype = null) {
  const safeModel = model
    .replace(/[^a-zA-Z0-9-_.]/g, '_')
    .replace(/__+/g, '_')
    .toLowerCase();
  const safeDtype = dtype
    ? dtype.replace(/[^a-zA-Z0-9-_.]/g, '_').replace(/__+/g, '_').toLowerCase()
    : null;
  return safeDtype
    ? `${provider}__${safeModel}__${dim}__${safeDtype}`
    : `${provider}__${safeModel}__${dim}`;
}

function readActiveEmbedder(dbPath) {
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  try {
    const rows = db.prepare(`
      SELECT key, value
      FROM vec_metadata
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

// Build one isolated /tmp copy of the live DB + active vector shard. Returns the
// copy paths; the runtime opens the copy as a fresh single-writer, side-stepping
// the live daemon's writer lock.
async function prepareCopy(sourceDbPath, label) {
  const evalRoot = fs.mkdtempSync(path.join(os.tmpdir(), `speckit-sleeptime-retrieval-${label}-`));
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

  return { evalRoot, dbPath: evalDbPath, shardName, sourceShardPath, evalShardPath, activeEmbedder };
}

function formatNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? Number(value.toFixed(6)) : null;
}

function cosineSimilarity(a, b) {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom > 0 ? dot / denom : 0;
}

function decodeEmbedding(buffer) {
  return new Float32Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 4);
}

function fileBytes(filePath) {
  let total = 0;
  for (const suffix of ['', '-wal', '-shm']) {
    const candidate = `${filePath}${suffix}`;
    if (fs.existsSync(candidate)) total += fs.statSync(candidate).size;
  }
  return total;
}

// Row-level dedup selector. Reuses the consolidation cosine scan (memory_index
// JOIN vec_memories, pairwise cosine) at the high-precision >= 0.96 threshold and
// produces a concrete drop-set: the lower-id member of every near-duplicate pair,
// with each row dropped at most once and never the representative it folds into.
//
// `forbiddenIds` is the curated ground-truth set; selection NEVER admits one. The
// caller still re-asserts the realized set as a hard safety gate.
function selectDropSet(db, vecSource, { threshold, scanLimit, deadlineMs, forbiddenIds }) {
  const rows = db.prepare(`
    SELECT m.id AS id, v.embedding AS embedding
    FROM memory_index m
    JOIN ${vecSource} v ON v.rowid = m.id
    WHERE m.importance_tier != 'deprecated'
      AND m.parent_id IS NULL
      AND m.content_text IS NOT NULL
      AND length(m.content_text) > 50
    ORDER BY m.id ASC
    LIMIT ?
  `).all(scanLimit);

  const decoded = rows.map((row) => ({ id: Number(row.id), vec: decodeEmbedding(row.embedding) }));

  const dropSet = new Set();
  const pairs = [];
  const deadline = Date.now() + deadlineMs;
  let timedOut = false;
  let comparisons = 0;

  for (let i = 0; i < decoded.length; i++) {
    if (Date.now() > deadline) { timedOut = true; break; }
    const a = decoded[i];
    // Skip a row already chosen for dropping: it cannot be a representative.
    if (dropSet.has(a.id)) continue;
    for (let j = i + 1; j < decoded.length; j++) {
      if (Date.now() > deadline) { timedOut = true; break; }
      const b = decoded[j];
      if (dropSet.has(b.id)) continue;
      comparisons += 1;
      const similarity = cosineSimilarity(a.vec, b.vec);
      if (similarity >= threshold) {
        // a (lower id) is the representative; b folds out — UNLESS b is curated
        // ground truth, in which case neither is dropped (precision over recall:
        // we never sacrifice a measured row to win a dedup point).
        if (forbiddenIds.has(b.id) || forbiddenIds.has(a.id)) continue;
        dropSet.add(b.id);
        pairs.push({ keep: a.id, drop: b.id, similarity: Number(similarity.toFixed(6)) });
      }
    }
    if (timedOut) break;
  }

  return {
    dropSet,
    pairs,
    scannedRows: decoded.length,
    comparisons,
    timedOut,
  };
}

// Materialize the dedup as a real index mutation on a COPY: deprecate-not-delete
// in memory_index (excludes the row from every hybridSearchEnhanced lane at query
// time) AND physically delete the row from the attached vector shard, then VACUUM
// the shard so the byte-size delta is real. Returns realized counts.
function materializeDropSet(db, vecSource, shardPath, dropSet) {
  const ids = [...dropSet];
  if (ids.length === 0) {
    return { deprecatedRows: 0, vectorRowsDeleted: 0 };
  }

  const deprecate = db.prepare(`
    UPDATE memory_index
    SET importance_tier = 'deprecated',
        updated_at = datetime('now')
    WHERE id = ?
      AND importance_tier != 'deprecated'
  `);
  const deleteVector = db.prepare(`DELETE FROM ${vecSource} WHERE rowid = ?`);

  let deprecatedRows = 0;
  let vectorRowsDeleted = 0;
  const txn = db.transaction((memoryIds) => {
    for (const id of memoryIds) {
      deprecatedRows += deprecate.run(id).changes;
      vectorRowsDeleted += deleteVector.run(id).changes;
    }
  });
  txn(ids);

  // Rebuild the shard on disk so vector-shard bytes reflect the removed rows.
  // VACUUM the attached shard by name (the active schema alias resolves to it),
  // then TRUNCATE-checkpoint its WAL so the on-disk size is the settled file —
  // VACUUM stages its rewrite in the WAL, so measuring before the checkpoint
  // reports a transiently inflated (roughly doubled) size, not the real delta.
  const schema = vecSource.split('.')[0];
  db.exec(`VACUUM ${schema}`);
  checkpointShardWal(db, schema);

  return { deprecatedRows, vectorRowsDeleted };
}

// TRUNCATE-checkpoint an attached shard's WAL so a subsequent byte measurement
// reflects the settled file rather than in-flight WAL pages.
function checkpointShardWal(db, schema) {
  try {
    db.pragma(`${schema}.wal_checkpoint(TRUNCATE)`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[sleeptime-retrieval-eval] shard WAL checkpoint failed for ${schema}: ${message}`);
  }
}

function normalizeSearchResults(rows) {
  return rows.map((row, index) => ({
    memoryId: Number(row.parentMemoryId ?? row.parent_id ?? row.parentId ?? row.id),
    score: typeof row.score === 'number' && Number.isFinite(row.score) ? row.score : 0,
    rank: index + 1,
  })).filter((row) => Number.isInteger(row.memoryId));
}

function groupGroundTruth(relevances) {
  const byQuery = new Map();
  for (const row of relevances) {
    if (!byQuery.has(row.queryId)) byQuery.set(row.queryId, []);
    byQuery.get(row.queryId).push({
      queryId: row.queryId,
      memoryId: row.memoryId,
      relevance: row.relevance,
    });
  }
  return byQuery;
}

// Open a copy, wire hybridSearchEnhanced, and return a queryable surface plus the
// runtime handles needed for the drop-set scan/mutation.
async function openSurface(copy, runtime) {
  const { vectorIndex, hybridSearch, graphSearch, embeddings } = runtime;
  const db = vectorIndex.initializeDb(copy.dbPath, { skipRestoreRecovery: true });
  const graphSearchFn = graphSearch.createUnifiedGraphSearchFn(db);
  hybridSearch.init(db, vectorIndex.vectorSearch, graphSearchFn);

  const vecSource = vectorIndex.activeVectorSource('vec_memories');
  const attachedShardPath = db.prepare('PRAGMA database_list').all()
    .map((row) => row.file)
    .find((file) => file && file.includes(`${path.sep}vectors${path.sep}`)) ?? copy.evalShardPath;

  const embeddingCache = new Map();
  async function getEmbedding(query) {
    if (embeddingCache.has(query)) return embeddingCache.get(query);
    try {
      const embedding = await embeddings.generateQueryEmbedding(query);
      embeddingCache.set(query, embedding);
      return embedding;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[sleeptime-retrieval-eval] Query embedding failed, continuing without vector lane: ${message}`);
      embeddingCache.set(query, null);
      return null;
    }
  }

  async function search(query) {
    const embedding = await getEmbedding(query);
    const rows = await hybridSearch.hybridSearchEnhanced(query, embedding, {
      limit: RECALL_K,
      useVector: true,
      useBm25: true,
      useFts: true,
      useGraph: true,
      includeContent: false,
      evaluationMode: true,
    });
    return normalizeSearchResults(rows);
  }

  const schema = vecSource.split('.')[0];
  return { db, vecSource, schema, attachedShardPath, search, getEmbedding };
}

// Run the full ground-truth sweep against a surface and compute the metric bundle.
async function evaluateSurface(surface, queries, relevancesByQuery, evalMetrics, graphSearch) {
  graphSearch.clearDegreeCacheForDb(surface.db);
  const recalls = [];
  const precisions = [];
  const ndcgs = [];
  let evaluatedQueries = 0;

  for (const query of queries) {
    const groundTruth = relevancesByQuery.get(query.id) ?? [];
    if (groundTruth.length === 0) continue;
    const results = await surface.search(query.query);
    recalls.push(evalMetrics.computeRecall(results, groundTruth, RECALL_K));
    precisions.push(evalMetrics.computePrecision(results, groundTruth, RECALL_K));
    ndcgs.push(evalMetrics.computeNDCG(results, groundTruth, NDCG_K));
    evaluatedQueries += 1;
  }

  const mean = (xs) => (xs.length === 0 ? 0 : xs.reduce((s, v) => s + v, 0) / xs.length);
  return {
    recall: mean(recalls),
    precision: mean(precisions),
    ndcg: mean(ndcgs),
    evaluatedQueries,
  };
}

function countNonDeprecatedRows(db) {
  return db.prepare(`
    SELECT COUNT(*) AS c FROM memory_index
    WHERE importance_tier != 'deprecated' AND parent_id IS NULL
  `).get().c;
}

async function main() {
  if (!Number.isInteger(RECALL_K) || RECALL_K <= 0) {
    throw new Error(`Invalid Recall@K: ${RECALL_K}`);
  }
  if (!(DEDUP_COSINE_THRESHOLD > 0 && DEDUP_COSINE_THRESHOLD <= 1)) {
    throw new Error(`Invalid dedup cosine threshold: ${DEDUP_COSINE_THRESHOLD}`);
  }

  // Two isolated copies: PRE stays untouched; POST receives the materialized
  // drop-set. Both derive from the same source snapshot.
  const preCopy = await prepareCopy(SOURCE_DB_PATH, 'pre');
  const postCopy = await prepareCopy(SOURCE_DB_PATH, 'post');

  process.env.SPECKIT_ABLATION = 'true';

  const [
    vectorIndex,
    hybridSearch,
    graphSearch,
    embeddings,
    groundTruth,
    evalMetrics,
  ] = await Promise.all([
    import(moduleUrl('dist/lib/search/vector-index.js')),
    import(moduleUrl('dist/lib/search/hybrid-search.js')),
    import(moduleUrl('dist/lib/search/graph-search-fn.js')),
    import(moduleUrl('dist/lib/providers/embeddings.js')),
    import(moduleUrl('dist/lib/eval/ground-truth-data.js')),
    import(moduleUrl('dist/lib/eval/eval-metrics.js')),
  ]);
  const runtime = { vectorIndex, hybridSearch, graphSearch, embeddings };

  const queries = groundTruth.GROUND_TRUTH_QUERIES;
  const relevancesByQuery = groupGroundTruth(groundTruth.GROUND_TRUTH_RELEVANCES);
  const groundTruthIds = new Set(groundTruth.GROUND_TRUTH_RELEVANCES.map((r) => r.memoryId));

  // ── PRE surface: untouched copy ────────────────────────────────────────────
  process.env.MEMORY_DB_PATH = preCopy.dbPath;
  const preSurface = await openSurface(preCopy, runtime);
  const preRowCount = countNonDeprecatedRows(preSurface.db);
  // Measure PRE shard bytes on the SAME operation basis as POST: VACUUM (which
  // POST also runs after its delete) + TRUNCATE-checkpoint. Without matching the
  // VACUUM, the byte delta would conflate page-layout differences with the row
  // removal we actually want to isolate.
  preSurface.db.exec(`VACUUM ${preSurface.schema}`);
  checkpointShardWal(preSurface.db, preSurface.schema);
  const preShardBytes = fileBytes(preSurface.attachedShardPath);

  // Drop-set is selected on the PRE copy's index (the live corpus, pre-mutation).
  const selection = selectDropSet(preSurface.db, preSurface.vecSource, {
    threshold: DEDUP_COSINE_THRESHOLD,
    scanLimit: SCAN_LIMIT,
    deadlineMs: SCAN_DEADLINE_MS,
    forbiddenIds: groundTruthIds,
  });

  // Hard safety gate #1 (pre-mutation): NO ground-truth id may be in the drop-set.
  const groundTruthInDropSet = [...selection.dropSet].filter((id) => groundTruthIds.has(id));
  if (groundTruthInDropSet.length > 0) {
    throw new Error(
      `SAFETY GATE FAILED: drop-set contains ${groundTruthInDropSet.length} curated ground-truth id(s): `
      + `${groundTruthInDropSet.slice(0, 20).join(', ')}. Refusing to materialize.`,
    );
  }

  const preMetrics = await evaluateSurface(preSurface, queries, relevancesByQuery, evalMetrics, graphSearch);

  // ── Faithfulness: PRE must reproduce a standalone baseline ───────────────────
  // The standalone baseline is the same ground-truth sweep over a second untouched
  // copy with an independently-initialized runtime surface. If PRE (which carries
  // the drop-set scan + degree-cache clears) and this clean baseline diverge beyond
  // epsilon, the rebuilt PRE index is not the surface the baseline measured.
  process.env.MEMORY_DB_PATH = postCopy.dbPath;
  const baselineSurface = await openSurface(postCopy, runtime);
  const baselineMetrics = await evaluateSurface(baselineSurface, queries, relevancesByQuery, evalMetrics, graphSearch);
  const faithfulnessDelta = preMetrics.recall - baselineMetrics.recall;
  const faithful = Math.abs(faithfulnessDelta) <= FAITHFULNESS_EPSILON;
  if (!faithful) {
    throw new Error(
      `FAITHFULNESS GATE FAILED: PRE Recall@${RECALL_K}=${preMetrics.recall.toFixed(6)} does not reproduce `
      + `standalone baseline=${baselineMetrics.recall.toFixed(6)} (delta=${faithfulnessDelta.toFixed(9)}, `
      + `epsilon=${FAITHFULNESS_EPSILON}). The rebuilt index is not the baseline surface; delta is untrustworthy.`,
    );
  }

  // ── POST surface: same copy, drop-set materialized ──────────────────────────
  // Reuse the baseline copy as POST (it is the second untouched snapshot). Re-select
  // is unnecessary: we materialize the drop-set chosen on PRE, keyed by stable ids.
  const postSurface = baselineSurface;
  const materialized = materializeDropSet(
    postSurface.db,
    postSurface.vecSource,
    postSurface.attachedShardPath,
    selection.dropSet,
  );

  // Hard safety gate #2 (post-mutation): re-assert that the rows THIS RUN deprecated
  // are exactly the drop-set and that the drop-set is disjoint from ground truth.
  // (Some ground-truth rows are deprecated in the live corpus already; that is not
  // our mutation. We must scope the check to the ids we actually touched.)
  const deprecatedGroundTruth = [...selection.dropSet].filter((id) => groundTruthIds.has(id));
  if (deprecatedGroundTruth.length > 0) {
    throw new Error(
      `SAFETY GATE FAILED (post-mutation): ${deprecatedGroundTruth.length} curated ground-truth id(s) are in `
      + `the materialized drop-set: ${deprecatedGroundTruth.slice(0, 20).join(', ')}.`,
    );
  }

  const postRowCount = countNonDeprecatedRows(postSurface.db);
  const postShardBytes = fileBytes(postSurface.attachedShardPath);
  const postMetrics = await evaluateSurface(postSurface, queries, relevancesByQuery, evalMetrics, graphSearch);

  // ── Deltas + live-write gate ────────────────────────────────────────────────
  const recallDelta = postMetrics.recall - preMetrics.recall;
  const precisionDelta = postMetrics.precision - preMetrics.precision;
  const ndcgDelta = postMetrics.ndcg - preMetrics.ndcg;
  const rowCountDelta = postRowCount - preRowCount;
  const shardBytesDelta = postShardBytes - preShardBytes;

  const scannableRows = selection.scannedRows;
  const dedupRate = scannableRows > 0 ? selection.dropSet.size / scannableRows : 0;

  const gate = {
    recallHeld: recallDelta >= -RECALL_GATE_EPSILON,
    precisionNonNegative: precisionDelta >= 0,
    rowCountReduced: rowCountDelta < 0,
    zeroGroundTruthDropped: groundTruthInDropSet.length === 0 && deprecatedGroundTruth.length === 0,
  };
  const earnsLiveWrite = gate.recallHeld
    && gate.precisionNonNegative
    && gate.rowCountReduced
    && gate.zeroGroundTruthDropped;

  const output = {
    generatedAt: new Date().toISOString(),
    sourceDbPath: SOURCE_DB_PATH,
    flags: { consolidation: CONSOLIDATION_FLAG, liveWrite: `${LIVE_WRITE_FLAG} (this eval decides eligibility)` },
    recallK: RECALL_K,
    ndcgK: NDCG_K,
    dedupCosineThreshold: DEDUP_COSINE_THRESHOLD,
    queryCount: queries.length,
    relevanceCount: groundTruth.GROUND_TRUTH_RELEVANCES.length,
    dropSet: {
      size: selection.dropSet.size,
      scannedRows: selection.scannedRows,
      comparisons: selection.comparisons,
      timedOut: selection.timedOut,
      dedupRate: formatNumber(dedupRate),
      groundTruthIdsInDropSet: groundTruthInDropSet,
      samplePairs: selection.pairs.slice(0, 10),
    },
    materialized,
    faithfulness: {
      preRecall: formatNumber(preMetrics.recall),
      standaloneBaselineRecall: formatNumber(baselineMetrics.recall),
      delta: formatNumber(faithfulnessDelta),
      epsilon: FAITHFULNESS_EPSILON,
      reproduced: faithful,
    },
    pre: {
      recall: formatNumber(preMetrics.recall),
      precision: formatNumber(preMetrics.precision),
      ndcg: formatNumber(preMetrics.ndcg),
      rowCount: preRowCount,
      shardBytes: preShardBytes,
      evaluatedQueries: preMetrics.evaluatedQueries,
    },
    post: {
      recall: formatNumber(postMetrics.recall),
      precision: formatNumber(postMetrics.precision),
      ndcg: formatNumber(postMetrics.ndcg),
      rowCount: postRowCount,
      shardBytes: postShardBytes,
      evaluatedQueries: postMetrics.evaluatedQueries,
    },
    delta: {
      recall: formatNumber(recallDelta),
      precision: formatNumber(precisionDelta),
      ndcg: formatNumber(ndcgDelta),
      rowCount: rowCountDelta,
      shardBytes: shardBytesDelta,
    },
    gate: {
      ...gate,
      recallGateEpsilon: RECALL_GATE_EPSILON,
      earnsLiveWrite,
    },
    verdict: earnsLiveWrite ? 'SLEEPTIME_EARNS_LIVE_WRITE' : 'SLEEPTIME_STAYS_SHADOW',
  };

  // Close surfaces and remove all copies — the live DB was never opened for write.
  preSurface.db.close();
  postSurface.db.close();
  fs.rmSync(preCopy.evalRoot, { recursive: true, force: true });
  fs.rmSync(postCopy.evalRoot, { recursive: true, force: true });

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);
  console.log(JSON.stringify(output, null, 2));

  if (!earnsLiveWrite) {
    // A non-passing gate is a valid, informative outcome (stay shadow), not a
    // driver error. Exit non-zero only so CI can branch on eligibility.
    process.exitCode = 2;
  }
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
  selectDropSet,
  materializeDropSet,
  cosineSimilarity,
  DEDUP_COSINE_THRESHOLD,
};
