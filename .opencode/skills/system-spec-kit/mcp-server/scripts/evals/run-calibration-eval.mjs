#!/usr/bin/env node

// Confidence-calibration eval: how well does the per-result confidence value
// approximate P(relevant)? Measured with Expected Calibration Error (ECE) and
// the Brier score against the retrieval golden set's binary relevance labels
// (graded relevance >= 1 → relevant).
//
// Two flags are exercised on the real search + confidence path:
//   - SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION: switches the confidence score
//     prior from the RRF fusion magnitude to absolute cosine relevance. OFF vs
//     ON is measured directly on live search rows.
//   - SPECKIT_CONFIDENCE_CALIBRATION (+ _MODEL): maps the confidence value
//     through a fitted isotonic curve. A model is fit on the flag's own raw
//     samples, written to a temp file, and the post-calibration ECE/Brier is
//     measured against the same labels.
//
// The DB is opened read-only via a tempdir backup; this driver never mutates,
// but it follows the same copy-first discipline as the mutating drivers.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import Database from 'better-sqlite3';

const SOURCE_DB_PATH = path.resolve(process.env.MEMORY_DB_PATH ?? 'database/context-index.sqlite');
const OUTPUT_PATH = path.resolve(process.env.SPECKIT_CALIBRATION_EVAL_OUTPUT ?? '/tmp/speckit-calibration-eval.json');
const RECALL_K = Number.parseInt(process.env.SPECKIT_CALIBRATION_EVAL_K ?? '20', 10);
const RELEVANCE_THRESHOLD = Number.parseInt(process.env.SPECKIT_CALIBRATION_RELEVANCE_THRESHOLD ?? '1', 10);

const ABSOLUTE_FLAG = 'SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION';
const CONFIDENCE_FLAG = 'SPECKIT_CONFIDENCE_CALIBRATION';
const CONFIDENCE_MODEL_ENV = 'SPECKIT_CONFIDENCE_CALIBRATION_MODEL';

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
  const evalRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-calibration-eval-'));
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
  return { evalRoot, dbPath: evalDbPath, sourceShardPath, evalShardPath };
}

function moduleUrl(relativePath) {
  return pathToFileURL(path.resolve(relativePath)).href;
}

function fmt(value) {
  return typeof value === 'number' && Number.isFinite(value) ? Number(value.toFixed(6)) : null;
}

function setFlag(name, enabled) {
  if (enabled) process.env[name] = 'true';
  else process.env[name] = 'false';
}

async function main() {
  if (!Number.isInteger(RECALL_K) || RECALL_K <= 0) {
    throw new Error(`Invalid Recall@K: ${RECALL_K}`);
  }

  const evalDatabase = await prepareEvalDatabase(SOURCE_DB_PATH);
  process.env.MEMORY_DB_PATH = evalDatabase.dbPath;
  process.env.SPECKIT_ABLATION = 'true';

  const [
    vectorIndex,
    hybridSearch,
    graphSearch,
    embeddings,
    groundTruth,
    confidenceScoring,
    confidenceCalibration,
    evalMetrics,
  ] = await Promise.all([
    import(moduleUrl('dist/lib/search/vector-index.js')),
    import(moduleUrl('dist/lib/search/hybrid-search.js')),
    import(moduleUrl('dist/lib/search/graph-search-fn.js')),
    import(moduleUrl('dist/lib/providers/embeddings.js')),
    import(moduleUrl('dist/lib/eval/ground-truth-data.js')),
    import(moduleUrl('dist/lib/search/confidence-scoring.js')),
    import(moduleUrl('dist/lib/search/confidence-calibration.js')),
    import(moduleUrl('dist/lib/eval/eval-metrics.js')),
  ]);

  const db = vectorIndex.initializeDb(evalDatabase.dbPath, { skipRestoreRecovery: true });
  const graphSearchFn = graphSearch.createUnifiedGraphSearchFn(db);
  hybridSearch.init(db, vectorIndex.vectorSearch, graphSearchFn);

  const queries = groundTruth.GROUND_TRUTH_QUERIES;
  const relevanceByQuery = new Map();
  for (const rel of groundTruth.GROUND_TRUTH_RELEVANCES) {
    if (!relevanceByQuery.has(rel.queryId)) relevanceByQuery.set(rel.queryId, new Map());
    relevanceByQuery.get(rel.queryId).set(rel.memoryId, rel.relevance);
  }

  const embeddingCache = new Map();
  async function getEmbedding(query) {
    if (embeddingCache.has(query)) return embeddingCache.get(query);
    try {
      const embedding = await embeddings.generateQueryEmbedding(query);
      embeddingCache.set(query, embedding);
      return embedding;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[calibration-eval] query embedding failed, vector lane skipped: ${message}`);
      embeddingCache.set(query, null);
      return null;
    }
  }

  async function search(query) {
    const embedding = await getEmbedding(query);
    return hybridSearch.hybridSearchEnhanced(query, embedding, {
      limit: RECALL_K,
      useVector: true,
      useBm25: true,
      useFts: true,
      useGraph: true,
      includeContent: false,
      evaluationMode: true,
    });
  }

  // Run search once per query, reused across both flag variants. Confidence is
  // recomputed per variant; the underlying rows (carrying real cosine) are stable.
  const perQueryRows = new Map();
  for (const query of queries) {
    const relevances = relevanceByQuery.get(query.id);
    if (!relevances || relevances.size === 0) continue;
    const rows = await search(query.query);
    perQueryRows.set(query.id, rows);
  }

  // Build {rawValue, relevant} calibration samples for a given absolute-relevance
  // flag state. A result counts as relevant when its graded label >= threshold.
  function buildSamples(absoluteFlagOn) {
    setFlag(ABSOLUTE_FLAG, absoluteFlagOn);
    setFlag(CONFIDENCE_FLAG, false);
    delete process.env[CONFIDENCE_MODEL_ENV];
    const samples = [];
    for (const [queryId, rows] of perQueryRows) {
      const relevances = relevanceByQuery.get(queryId);
      const confidences = confidenceScoring.computeResultConfidence(rows);
      for (let i = 0; i < rows.length; i += 1) {
        const row = rows[i];
        const memoryId = Number(row.parentMemoryId ?? row.parent_id ?? row.id);
        if (!Number.isInteger(memoryId)) continue;
        const grade = relevances.get(memoryId) ?? 0;
        samples.push({
          rawValue: confidences[i].confidence.value,
          relevant: grade >= RELEVANCE_THRESHOLD ? 1 : 0,
        });
      }
    }
    return samples;
  }

  const offSamples = buildSamples(false);
  const onSamples = buildSamples(true);

  const offMetrics = evalMetrics.computeCalibrationMetrics(offSamples);
  const onMetrics = evalMetrics.computeCalibrationMetrics(onSamples);

  // Confidence-calibration flag: fit an isotonic model on the ON samples (the
  // absolute-relevance path is the live default) and measure post-calibration
  // ECE/Brier. The fitted-and-applied curve is the lower bound the flag targets.
  const model = confidenceCalibration.fitCalibration(
    onSamples.map((s) => ({ rawValue: s.rawValue, relevant: s.relevant })),
  );
  const calibratedSamples = onSamples.map((s) => ({
    rawValue: confidenceCalibration.applyCalibration(model, s.rawValue),
    relevant: s.relevant,
  }));
  const calibratedMetrics = evalMetrics.computeCalibrationMetrics(calibratedSamples);

  const positives = onSamples.filter((s) => s.relevant === 1).length;

  const output = {
    generatedAt: new Date().toISOString(),
    sourceDbPath: SOURCE_DB_PATH,
    dbPath: evalDatabase.dbPath,
    recallK: RECALL_K,
    relevanceThreshold: RELEVANCE_THRESHOLD,
    queryCount: perQueryRows.size,
    sampleCount: onSamples.length,
    positiveCount: positives,
    absoluteRelevanceCalibration: {
      flag: ABSOLUTE_FLAG,
      off: { ece: fmt(offMetrics.ece), brier: fmt(offMetrics.brier), sampleCount: offMetrics.sampleCount },
      on: { ece: fmt(onMetrics.ece), brier: fmt(onMetrics.brier), sampleCount: onMetrics.sampleCount },
      delta: { ece: fmt(onMetrics.ece - offMetrics.ece), brier: fmt(onMetrics.brier - offMetrics.brier) },
    },
    confidenceCalibration: {
      flag: CONFIDENCE_FLAG,
      modelFittedFrom: model.fittedFrom,
      modelPoints: model.points.length,
      preCalibration: { ece: fmt(onMetrics.ece), brier: fmt(onMetrics.brier) },
      postCalibration: { ece: fmt(calibratedMetrics.ece), brier: fmt(calibratedMetrics.brier) },
      delta: {
        ece: fmt(calibratedMetrics.ece - onMetrics.ece),
        brier: fmt(calibratedMetrics.brier - onMetrics.brier),
      },
    },
  };

  delete process.env[ABSOLUTE_FLAG];
  delete process.env[CONFIDENCE_FLAG];
  delete process.env[CONFIDENCE_MODEL_ENV];

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
