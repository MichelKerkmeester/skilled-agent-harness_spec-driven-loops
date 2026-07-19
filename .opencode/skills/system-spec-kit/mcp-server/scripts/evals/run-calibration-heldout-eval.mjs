#!/usr/bin/env node

// Honest held-out calibration eval. The sibling run-calibration-eval.mjs fits the
// isotonic curve on the ON samples and then scores it on those SAME samples, so its
// post-calibration ECE collapses by construction — it measures memorization, not
// generalization. This driver answers the only question that justifies a default-ON
// flip: does the fitted curve lower ECE/Brier on data it never saw?
//
// Method: GROUPED k-fold cross-validation, grouped BY QUERY. Samples from one query
// share a search context (the same ranked rows, the same per-result margins), so a
// random sample-level split would leak that context across the fit/eval boundary and
// re-introduce the overfit it is meant to expose. Each query lands in exactly one
// fold; for every fold the model is fit on the other folds' samples and applied to
// the held-out fold, producing one out-of-fold (OOF) prediction per sample. Pooling
// all OOF predictions yields a single honest held-out ECE/Brier that covers every
// sample exactly once, compared against the uncalibrated baseline on that same pool.
//
// The DB is opened read-only via a tempdir backup; this driver never mutates the live
// store, following the same copy-first discipline as the mutating eval drivers.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import Database from 'better-sqlite3';

const SOURCE_DB_PATH = path.resolve(process.env.MEMORY_DB_PATH ?? 'database/context-index.sqlite');
const OUTPUT_PATH = path.resolve(process.env.SPECKIT_CALIBRATION_HELDOUT_OUTPUT ?? '/tmp/speckit-calibration-heldout-eval.json');
const RECALL_K = Number.parseInt(process.env.SPECKIT_CALIBRATION_EVAL_K ?? '20', 10);
const RELEVANCE_THRESHOLD = Number.parseInt(process.env.SPECKIT_CALIBRATION_RELEVANCE_THRESHOLD ?? '1', 10);
const FOLD_COUNT = Number.parseInt(process.env.SPECKIT_CALIBRATION_FOLDS ?? '5', 10);
// Material-improvement gate: held-out ECE must drop by at least this absolute amount
// AND every fold must improve, before the verdict reads flip-ready. Tunable so the
// orchestrator can tighten or loosen the bar without editing the driver.
const MIN_ECE_GAIN = Number.parseFloat(process.env.SPECKIT_CALIBRATION_MIN_ECE_GAIN ?? '0.02');
// Optional shippable-model output path. When set, a model fit on the FULL labeled set
// is written here (this is the artifact a default-ON flip would point the flag at).
const SHIP_MODEL_PATH = process.env.SPECKIT_CALIBRATION_SHIP_MODEL?.trim() || null;

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
  const evalRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-calibration-heldout-'));
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
  process.env[name] = enabled ? 'true' : 'false';
}

// Deterministic fold assignment: a query's id maps to a stable fold so reruns are
// reproducible. Mixing the id keeps neighbouring ids from clustering into one fold.
function foldForQuery(queryId, foldCount) {
  const mixed = Math.imul(queryId ^ 0x9e3779b9, 0x85ebca6b) >>> 0;
  return mixed % foldCount;
}

async function main() {
  if (!Number.isInteger(RECALL_K) || RECALL_K <= 0) {
    throw new Error(`Invalid Recall@K: ${RECALL_K}`);
  }
  if (!Number.isInteger(FOLD_COUNT) || FOLD_COUNT < 2) {
    throw new Error(`Invalid fold count (need >= 2): ${FOLD_COUNT}`);
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
      console.warn(`[calibration-heldout] query embedding failed, vector lane skipped: ${message}`);
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

  // Run search once per query; the rows are stable across calibration variants.
  const perQueryRows = new Map();
  for (const query of queries) {
    const relevances = relevanceByQuery.get(query.id);
    if (!relevances || relevances.size === 0) continue;
    const rows = await search(query.query);
    perQueryRows.set(query.id, rows);
  }

  // Build {queryId, rawValue, relevant} samples under absolute-relevance ON — the
  // live default and the prior the flag calibrates on top of. CONFIDENCE_CALIBRATION
  // stays OFF here so rawValue is the pre-calibration confidence the model maps from.
  setFlag(ABSOLUTE_FLAG, true);
  setFlag(CONFIDENCE_FLAG, false);
  delete process.env[CONFIDENCE_MODEL_ENV];

  const samplesByQuery = new Map();
  const allSamples = [];
  for (const [queryId, rows] of perQueryRows) {
    const relevances = relevanceByQuery.get(queryId);
    const confidences = confidenceScoring.computeResultConfidence(rows);
    const list = [];
    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];
      const memoryId = Number(row.parentMemoryId ?? row.parent_id ?? row.id);
      if (!Number.isInteger(memoryId)) continue;
      const grade = relevances.get(memoryId) ?? 0;
      const sample = {
        queryId,
        rawValue: confidences[i].confidence.value,
        relevant: grade >= RELEVANCE_THRESHOLD ? 1 : 0,
      };
      list.push(sample);
      allSamples.push(sample);
    }
    samplesByQuery.set(queryId, list);
  }

  // -- Grouped k-fold (group = query) --

  const queryIds = [...samplesByQuery.keys()];
  const foldOf = new Map(queryIds.map((qid) => [qid, foldForQuery(qid, FOLD_COUNT)]));

  // Out-of-fold calibrated predictions, one per sample, pooled into a single
  // held-out evaluation. baselineSamples is the matched uncalibrated pool.
  const oofCalibrated = [];
  const baselineSamples = [];
  const perFold = [];

  for (let fold = 0; fold < FOLD_COUNT; fold += 1) {
    const trainSamples = [];
    const testSamples = [];
    let trainQueries = 0;
    let testQueries = 0;
    for (const qid of queryIds) {
      const inTest = foldOf.get(qid) === fold;
      if (inTest) testQueries += 1; else trainQueries += 1;
      for (const s of samplesByQuery.get(qid)) {
        if (inTest) testSamples.push(s); else trainSamples.push(s);
      }
    }

    // A fold with no test samples (possible only with pathological grouping) is
    // skipped rather than fitting on the whole set and scoring it — that would
    // silently re-create the overfit this driver exists to avoid.
    if (testSamples.length === 0) {
      perFold.push({ fold, trainQueries, testQueries, testSamples: 0, skipped: true });
      continue;
    }

    const model = confidenceCalibration.fitCalibration(
      trainSamples.map((s) => ({ rawValue: s.rawValue, relevant: s.relevant })),
    );

    const calibratedTest = testSamples.map((s) => ({
      rawValue: confidenceCalibration.applyCalibration(model, s.rawValue),
      relevant: s.relevant,
    }));
    const baselineTest = testSamples.map((s) => ({ rawValue: s.rawValue, relevant: s.relevant }));

    for (const c of calibratedTest) oofCalibrated.push(c);
    for (const b of baselineTest) baselineSamples.push(b);

    const foldBaseline = evalMetrics.computeCalibrationMetrics(baselineTest);
    const foldCalibrated = evalMetrics.computeCalibrationMetrics(calibratedTest);
    perFold.push({
      fold,
      trainQueries,
      testQueries,
      trainSamples: trainSamples.length,
      testSamples: testSamples.length,
      testPositives: testSamples.filter((s) => s.relevant === 1).length,
      modelPoints: model.points.length,
      baseline: { ece: fmt(foldBaseline.ece), brier: fmt(foldBaseline.brier) },
      calibrated: { ece: fmt(foldCalibrated.ece), brier: fmt(foldCalibrated.brier) },
      eceGain: fmt(foldBaseline.ece - foldCalibrated.ece),
      brierGain: fmt(foldBaseline.brier - foldCalibrated.brier),
    });
  }

  // Pooled honest held-out metrics: every sample scored by a model that never saw
  // its query. The baseline pool is the identical set, uncalibrated.
  const heldoutBaseline = evalMetrics.computeCalibrationMetrics(baselineSamples);
  const heldoutCalibrated = evalMetrics.computeCalibrationMetrics(oofCalibrated);

  const evaluatedFolds = perFold.filter((f) => !f.skipped);
  const allFoldsImproved = evaluatedFolds.length > 0
    && evaluatedFolds.every((f) => typeof f.eceGain === 'number' && f.eceGain > 0);
  const pooledEceGain = heldoutBaseline.ece - heldoutCalibrated.ece;
  const materialGain = pooledEceGain >= MIN_ECE_GAIN;
  const flipReady = materialGain && allFoldsImproved;

  // Shippable model: fit on the FULL labeled set (no held-out withheld). This is the
  // artifact a default-ON flip would point SPECKIT_CONFIDENCE_CALIBRATION_MODEL at;
  // the held-out folds above are what license shipping it, not what produced it.
  const fullModel = confidenceCalibration.fitCalibration(
    allSamples.map((s) => ({ rawValue: s.rawValue, relevant: s.relevant })),
  );
  // Stamp the value-distribution provenance: every sample above was built with
  // ABSOLUTE_FLAG forced ON, so the fitted curve's input domain assumes
  // absolute-relevance calibration. The apply-time coupling guard reads this to
  // refuse the model when the live absolute-relevance state no longer matches.
  fullModel.fittedUnderAbsoluteRelevance = true;
  let shipModelWritten = null;
  if (SHIP_MODEL_PATH) {
    const absShip = path.resolve(SHIP_MODEL_PATH);
    fs.mkdirSync(path.dirname(absShip), { recursive: true });
    fs.writeFileSync(absShip, `${JSON.stringify(fullModel, null, 2)}\n`);
    shipModelWritten = absShip;
  }

  const positives = allSamples.filter((s) => s.relevant === 1).length;

  const output = {
    generatedAt: new Date().toISOString(),
    method: 'grouped-kfold-by-query',
    sourceDbPath: SOURCE_DB_PATH,
    dbPath: evalDatabase.dbPath,
    recallK: RECALL_K,
    relevanceThreshold: RELEVANCE_THRESHOLD,
    foldCount: FOLD_COUNT,
    minEceGain: MIN_ECE_GAIN,
    queryCount: perQueryRows.size,
    sampleCount: allSamples.length,
    positiveCount: positives,
    heldout: {
      flag: CONFIDENCE_FLAG,
      baseline: { ece: fmt(heldoutBaseline.ece), brier: fmt(heldoutBaseline.brier) },
      calibrated: { ece: fmt(heldoutCalibrated.ece), brier: fmt(heldoutCalibrated.brier) },
      delta: {
        ece: fmt(heldoutCalibrated.ece - heldoutBaseline.ece),
        brier: fmt(heldoutCalibrated.brier - heldoutBaseline.brier),
      },
      eceGain: fmt(pooledEceGain),
      pooledSampleCount: oofCalibrated.length,
    },
    perFold,
    stability: {
      allFoldsImproved,
      materialGain,
      minEceGainThreshold: MIN_ECE_GAIN,
    },
    shippableModel: {
      fittedFromFullSet: fullModel.fittedFrom,
      points: fullModel.points.length,
      writtenPath: shipModelWritten,
    },
    verdict: flipReady ? 'flip-ready' : 'keep-off',
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
