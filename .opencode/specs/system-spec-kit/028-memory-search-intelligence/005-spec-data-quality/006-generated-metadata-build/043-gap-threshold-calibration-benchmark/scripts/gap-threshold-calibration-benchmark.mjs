#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────
// MODULE: Evidence-Gap Z-Score Threshold Calibration Benchmark
// Usage:
//   node gap-threshold-calibration-benchmark.mjs
//
// Measures whether the Stage-4 evidence-gap detector Z-score threshold
// (default 1.3) is well calibrated against the real memory corpus. The detector
// flags an evidence gap when the top score's Z-score over the result-set score
// distribution falls below the threshold. This benchmark captures the CONTINUOUS
// Z-score per query so the threshold can be swept post-hoc, then reports where a
// labeled query set lands relative to the 1.3 boundary.
//
// The benchmark never changes a default and never decides the verdict. It only
// produces correct measurements and writes them to metrics.json.
//
// Faithfulness:
//   Each query runs through the production executePipeline. The Stage-4 binary
//   evidenceGapDetected (the decision at 1.3) is read straight from the pipeline
//   metadata as ground truth. The continuous statistic is then recomputed by
//   calling the production detectEvidenceGap on the SAME resolveEffectiveScore
//   values Stage 4 fed it. The pipeline limit is set high enough that the Stage-4
//   final-limit cap never trims, and state filtering is disabled, so the returned
//   result set is byte-identical to the detector input set. A per-query assertion
//   confirms the recomputed gapDetected@1.3 equals the pipeline binary, which
//   proves the swept statistic is the exact one production computes.
//
//   Detector formula (evidence-gap-detector.ts lines 189 to 206):
//     mean   = avg(finiteScores)
//     stdDev = sqrt(avg((s - mean)^2))
//     zScore = stdDev === 0 ? 0 : (topScore - mean) / stdDev
//     gap    = stdDev === 0 ? topScore < MIN_ABSOLUTE_SCORE
//                           : zScore < Z_SCORE_THRESHOLD || topScore < MIN_ABSOLUTE_SCORE
//   Comparison direction is confirmed gap-when-below, so the sweep classifies a
//   query as gap when its zScore < T.
//
//   The requestQuality verdict is the production assessRequestQuality label,
//   computed from computeResultConfidence over the same results with the Stage-4
//   evidenceGapDetected threaded in, under the shipped default feature flags.
//
// Safety:
//   The live database is never opened for writes. It is backed up read-only to a
//   temporary eval copy along with the active vector shard, and all searches run
//   against the copy. No reindex is triggered.
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BENCH_ROOT = path.resolve(HERE, '..');
const RESULTS_DIR = path.join(BENCH_ROOT, 'results');
const REPO_ROOT = path.resolve(HERE, '..', '..', '..', '..', '..', '..', '..');
const MCP_DIR = path.join(REPO_ROOT, '.opencode', 'skills', 'system-spec-kit', 'mcp_server');
const DIST = path.join(MCP_DIR, 'dist');

// This harness lives outside the mcp_server node_modules tree, so anchor the
// native better-sqlite3 resolution at the server package rather than the script
// location. The dist modules resolve their own bare imports against the same
// tree once they are imported by file URL.
const mcpRequire = createRequire(path.join(MCP_DIR, 'package.json'));
const Database = mcpRequire('better-sqlite3');

// A wide pipeline window so the Stage-4 final-limit cap never trims the result
// set. With minState empty and applyStateLimits false the returned set then
// equals the exact score array Stage 4 fed detectEvidenceGap, which is what makes
// the recomputed continuous statistic faithful to the pipeline binary.
const PIPELINE_LIMIT = 200;
// Top-K window reported per query for the operator. The detector statistic is
// computed over the full result set, not this window.
const TOP_K = 10;

// Sweep bounds and step for the post-hoc threshold scan.
const SWEEP_MIN = 0.5;
const SWEEP_MAX = 3.0;
const SWEEP_STEP = 0.1;

// Labeled proxy query set. No human ground truth, the labels are expectations.
//   should-good : strong specific aligned matches, expected not-gap.
//   should-gap  : off-corpus known-absent, expected gap.
//   boundary    : one-word aligned queries, the question under test.
const LABELED_QUERIES = [
  { id: 'good-retrieval-class-routing', text: 'retrieval class routing', label: 'should-good' },
  { id: 'good-evidence-gap-detection', text: 'evidence gap detection', label: 'should-good' },
  { id: 'good-constitutional-memory', text: 'constitutional memory', label: 'should-good' },
  { id: 'good-skill-advisor-daemon', text: 'skill advisor daemon', label: 'should-good' },
  { id: 'good-spec-folder-validation', text: 'spec folder validation', label: 'should-good' },
  { id: 'good-memory-search-pipeline', text: 'memory search pipeline', label: 'should-good' },

  { id: 'gap-kubernetes', text: 'kubernetes', label: 'should-gap' },
  { id: 'gap-oauth', text: 'oauth', label: 'should-gap' },
  { id: 'gap-kafka', text: 'kafka', label: 'should-gap' },
  { id: 'gap-terraform', text: 'terraform', label: 'should-gap' },
  { id: 'gap-graphql', text: 'graphql', label: 'should-gap' },
  { id: 'gap-redis-cluster', text: 'redis cluster', label: 'should-gap' },

  { id: 'boundary-graph', text: 'graph', label: 'boundary' },
  { id: 'boundary-agent', text: 'agent', label: 'boundary' },
  { id: 'boundary-memory', text: 'memory', label: 'boundary' },
  { id: 'boundary-routing', text: 'routing', label: 'boundary' },
  { id: 'boundary-context', text: 'context', label: 'boundary' },
  { id: 'boundary-scores', text: 'scores', label: 'boundary' },
];

function distUrl(rel) {
  return pathToFileURL(path.join(DIST, rel)).href;
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
  const safeModel = model
    .replace(/[^a-zA-Z0-9-_.]/g, '_')
    .replace(/__+/g, '_')
    .toLowerCase();
  return `${provider}__${safeModel}__${dim}`;
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

// Backup the live database and its active vector shard to a temporary eval copy.
// All searches run against the copy so the live corpus is never mutated and the
// live daemon write lock is never contended.
async function prepareEvalDatabase(sourceDbPath) {
  const evalRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-gap-cal-eval-'));
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

  return {
    sourceDbPath,
    evalRoot,
    dbPath: evalDbPath,
    sourceShardPath,
    evalShardPath,
    activeEmbedder,
  };
}

// ── metric helpers ────────────────────────────────────────────────

function fmt(value, digits = 6) {
  return typeof value === 'number' && Number.isFinite(value) ? Number(value.toFixed(digits)) : null;
}

function median(values) {
  const finite = values.filter((v) => typeof v === 'number' && Number.isFinite(v)).slice().sort((a, b) => a - b);
  if (finite.length === 0) return null;
  const mid = Math.floor(finite.length / 2);
  return finite.length % 2 === 0 ? (finite[mid - 1] + finite[mid]) / 2 : finite[mid];
}

function minOf(values) {
  const finite = values.filter((v) => typeof v === 'number' && Number.isFinite(v));
  return finite.length === 0 ? null : finite.reduce((a, b) => Math.min(a, b), Infinity);
}

function maxOf(values) {
  const finite = values.filter((v) => typeof v === 'number' && Number.isFinite(v));
  return finite.length === 0 ? null : finite.reduce((a, b) => Math.max(a, b), -Infinity);
}

// Build the float sweep thresholds avoiding accumulated float drift by stepping
// over integer tenths and dividing once.
function buildSweepThresholds() {
  const out = [];
  const lo = Math.round(SWEEP_MIN * 10);
  const hi = Math.round(SWEEP_MAX * 10);
  const stepTenths = Math.round(SWEEP_STEP * 10);
  for (let t = lo; t <= hi; t += stepTenths) {
    out.push(t / 10);
  }
  return out;
}

// ── pipeline config ───────────────────────────────────────────────
// A faithful hybrid-search PipelineConfig carrying the pre-computed query
// embedding so the embedder runs once per query. minState empty and
// applyStateLimits false disable state filtering, and the wide limit prevents the
// Stage-4 final cap from trimming, so the returned set equals the detector input.
function buildPipelineConfig(query, embedding) {
  return {
    query,
    queryEmbedding: embedding,
    searchType: 'hybrid',
    limit: PIPELINE_LIMIT,
    includeArchived: false,
    includeConstitutional: true,
    includeContent: false,
    minState: '',
    applyStateLimits: false,
    useDecay: true,
    rerank: true,
    applyLengthPenalty: true,
    enableDedup: true,
    enableSessionBoost: false,
    enableCausalBoost: false,
    trackAccess: false,
    detectedIntent: null,
    intentConfidence: 0,
    intentWeights: null,
  };
}

async function main() {
  // Resolve the live database path from config rather than hardcoding it.
  const config = await import(distUrl('core/config.js'));
  const sourceDbPath = config.DATABASE_PATH;
  if (!sourceDbPath || !fs.existsSync(sourceDbPath)) {
    throw new Error(`Live database not found at config DATABASE_PATH: ${sourceDbPath}`);
  }

  const evalDatabase = await prepareEvalDatabase(sourceDbPath);

  // Point the runtime at the eval copy and keep the embedder load tiny. The
  // active embedder is a local provider, so embedding works standalone. The skip
  // flag only avoids a startup API-key probe that does not apply here.
  process.env.MEMORY_DB_PATH = evalDatabase.dbPath;
  process.env.SPECKIT_SKIP_API_VALIDATION = 'true';
  // Leave every results-affecting feature flag at its shipped default so the
  // measurement reflects the production calibration state, not an overridden one.

  const [vectorIndex, hybridSearch, graphSearch, pipeline, detector, scoreTypes, confidence] = await Promise.all([
    import(distUrl('lib/search/vector-index.js')),
    import(distUrl('lib/search/hybrid-search.js')),
    import(distUrl('lib/search/graph-search-fn.js')),
    import(distUrl('lib/search/pipeline/index.js')),
    import(distUrl('lib/search/evidence-gap-detector.js')),
    import(distUrl('lib/search/pipeline/types.js')),
    import(distUrl('lib/search/confidence-scoring.js')),
  ]);

  const Z_SCORE_THRESHOLD = detector.Z_SCORE_THRESHOLD;
  const MIN_ABSOLUTE_SCORE = detector.MIN_ABSOLUTE_SCORE;

  const db = vectorIndex.initializeDb(evalDatabase.dbPath, { skipRestoreRecovery: true });
  vectorIndex.attachActiveVectorShardForActiveProfile(db);
  const graphSearchFn = graphSearch.createUnifiedGraphSearchFn(db);
  hybridSearch.init(db, vectorIndex.vectorSearch, graphSearchFn);

  const perQuery = [];

  for (const q of LABELED_QUERIES) {
    const embedding = await vectorIndex.generateQueryEmbedding(q.text);
    if (!embedding || embedding.length === 0) {
      throw new Error(`Embedding failed for query "${q.text}"; cannot run a faithful benchmark`);
    }

    const result = await pipeline.executePipeline(buildPipelineConfig(q.text, embedding));
    const results = result.results;

    // Ground-truth binary at the shipped 1.3 threshold straight from the pipeline.
    const pipelineGapAt13 = result.metadata.stage4.evidenceGapDetected === true;

    // Recompute the continuous statistic on the exact scores Stage 4 used.
    const effectiveScores = results.map((row) => scoreTypes.resolveEffectiveScore(row));
    const trm = detector.detectEvidenceGap(effectiveScores);

    // Faithfulness gate: the recomputed gapDetected at 1.3 must equal the pipeline
    // binary. If it does not, the recomputed statistic is not the one production
    // used and the sweep would be measuring the wrong number.
    if (trm.gapDetected !== pipelineGapAt13) {
      throw new Error(
        `Faithfulness mismatch for "${q.text}": recomputed gapDetected=${trm.gapDetected} ` +
        `but pipeline metadata.stage4.evidenceGapDetected=${pipelineGapAt13}. ` +
        `resultCount=${results.length} zScore=${trm.zScore} topScore=${maxOf(effectiveScores)}`,
      );
    }

    // requestQuality verdict under shipped defaults. Thread the Stage-4 gap in
    // exactly as the production verdict path does.
    const confidences = confidence.computeResultConfidence(results);
    const verdictAssessment = confidence.assessRequestQuality(results, confidences, {
      query: q.text,
      evidenceGapDetected: pipelineGapAt13,
      embedder: evalDatabase.activeEmbedder.name,
    });
    const verdict = verdictAssessment.requestQuality.label;

    const topScore = maxOf(effectiveScores);
    const topK = results.slice(0, TOP_K).map((row, index) => ({
      rank: index,
      id: Number(row.id),
      score: fmt(scoreTypes.resolveEffectiveScore(row), 8),
    }));

    // stdDev === 0 means every score is identical and the detector defines the
    // Z-score as 0. The query is a degenerate sweep input, so flag it for the
    // reader rather than letting a meaningless 0 pollute the distribution stats.
    const degenerateStat = trm.stdDev === 0;

    // Mislabel detection for should-good: a strong specific aligned query is
    // expected to return a real top match. An empty set or a top score at or below
    // the absolute floor means the corpus does not actually carry the match, so the
    // label is wrong rather than the detector. Reported, never silently dropped.
    let mislabeled = null;
    if (q.label === 'should-good') {
      if (results.length === 0) {
        mislabeled = 'should-good query returned no results';
      } else if (topScore !== null && topScore < MIN_ABSOLUTE_SCORE) {
        mislabeled = `should-good top score ${fmt(topScore, 6)} is below MIN_ABSOLUTE_SCORE ${MIN_ABSOLUTE_SCORE}`;
      }
    }

    perQuery.push({
      id: q.id,
      text: q.text,
      label: q.label,
      resultCount: results.length,
      gapStatistic: fmt(trm.zScore, 6),
      gapStatisticMean: fmt(trm.mean, 8),
      gapStatisticStdDev: fmt(trm.stdDev, 8),
      degenerateStat,
      gapDetectedAt13: pipelineGapAt13,
      verdict,
      topScore: fmt(topScore, 8),
      topK,
      mislabeled,
    });
  }

  // ── 2. Behaviour at the current 1.3 threshold ─────────────────────
  const shouldGood = perQuery.filter((p) => p.label === 'should-good');
  const shouldGap = perQuery.filter((p) => p.label === 'should-gap');
  const boundary = perQuery.filter((p) => p.label === 'boundary');

  // should-good false positives are should-good queries wrongly flagged gap (the
  // detector over-capping a strong aligned match).
  const shouldGoodFalsePositives = shouldGood.filter((p) => p.gapDetectedAt13);
  const shouldGoodFalsePositiveRate = shouldGood.length > 0
    ? shouldGoodFalsePositives.length / shouldGood.length
    : null;

  // should-gap detection rate is should-gap queries correctly flagged gap.
  const shouldGapDetected = shouldGap.filter((p) => p.gapDetectedAt13);
  const shouldGapDetectionRate = shouldGap.length > 0
    ? shouldGapDetected.length / shouldGap.length
    : null;

  const boundaryClassification = boundary.map((p) => ({
    id: p.id,
    text: p.text,
    gapStatistic: p.gapStatistic,
    gapDetectedAt13: p.gapDetectedAt13,
    verdict: p.verdict,
    topScore: p.topScore,
  }));

  const atCurrentThreshold = {
    threshold: Z_SCORE_THRESHOLD,
    shouldGoodFalsePositiveRate: fmt(shouldGoodFalsePositiveRate, 4),
    shouldGoodFalsePositives: shouldGoodFalsePositives.map((p) => p.id),
    shouldGapDetectionRate: fmt(shouldGapDetectionRate, 4),
    shouldGapMissed: shouldGap.filter((p) => !p.gapDetectedAt13).map((p) => p.id),
    boundaryClassification,
  };

  // ── 3. Threshold sweep ────────────────────────────────────────────
  // Classification matches the detector direction: a query is gap when its
  // continuous Z-score is below the threshold. Degenerate stdDev===0 queries are
  // excluded from the sweep because their Z-score of 0 is not a real margin and
  // would sit below every threshold, distorting separation.
  const sweepable = perQuery.filter((p) => !p.degenerateStat);
  const sweepGood = sweepable.filter((p) => p.label === 'should-good');
  const sweepGap = sweepable.filter((p) => p.label === 'should-gap');

  const thresholds = buildSweepThresholds();
  const sweep = thresholds.map((t) => {
    // should-good correct = not flagged gap (statistic >= T).
    const goodCorrect = sweepGood.filter((p) => !(p.gapStatistic < t)).length;
    // should-gap correct = flagged gap (statistic < T).
    const gapCorrect = sweepGap.filter((p) => p.gapStatistic < t).length;
    const total = sweepGood.length + sweepGap.length;
    const separation = total > 0 ? (goodCorrect + gapCorrect) / total : null;

    // Boundary queries reported by where they land at this threshold.
    const boundaryGap = sweepable
      .filter((p) => p.label === 'boundary' && p.gapStatistic < t)
      .map((p) => p.id);

    return {
      threshold: fmt(t, 1),
      goodCorrect,
      goodTotal: sweepGood.length,
      gapCorrect,
      gapTotal: sweepGap.length,
      separation: fmt(separation, 4),
      boundaryFlaggedGap: boundaryGap,
    };
  });

  // Optimal T = the threshold with the highest separation. On ties prefer the
  // threshold closest to the shipped 1.3 so the recommendation is the smallest
  // defensible move, then the lower threshold (less over-capping) as a final
  // tiebreak.
  let optimal = null;
  for (const row of sweep) {
    if (row.separation === null) continue;
    if (
      optimal === null ||
      row.separation > optimal.separation ||
      (row.separation === optimal.separation &&
        Math.abs(row.threshold - Z_SCORE_THRESHOLD) < Math.abs(optimal.threshold - Z_SCORE_THRESHOLD)) ||
      (row.separation === optimal.separation &&
        Math.abs(row.threshold - Z_SCORE_THRESHOLD) === Math.abs(optimal.threshold - Z_SCORE_THRESHOLD) &&
        row.threshold < optimal.threshold)
    ) {
      optimal = row;
    }
  }

  const separationAt13Row = sweep.find((row) => row.threshold === Z_SCORE_THRESHOLD) ?? null;

  // Per-label gap-statistic distributions over the sweepable (non-degenerate) set.
  function distribution(rows) {
    const stats = rows.map((p) => p.gapStatistic);
    return {
      count: rows.length,
      min: fmt(minOf(stats), 6),
      median: fmt(median(stats), 6),
      max: fmt(maxOf(stats), 6),
    };
  }

  const distributions = {
    note: 'Computed over non-degenerate queries (stdDev > 0). Degenerate queries are listed separately.',
    'should-good': distribution(sweepGood),
    'should-gap': distribution(sweepGap),
    boundary: distribution(sweepable.filter((p) => p.label === 'boundary')),
    degenerateQueries: perQuery.filter((p) => p.degenerateStat).map((p) => p.id),
  };

  const mislabeledQueries = perQuery.filter((p) => p.mislabeled).map((p) => ({
    id: p.id,
    text: p.text,
    label: p.label,
    reason: p.mislabeled,
  }));

  const output = {
    generatedFrom: 'gap-threshold-calibration-benchmark.mjs',
    generatedAt: new Date().toISOString(),
    subject: 'Stage-4 evidence-gap detector Z-score threshold (Z_SCORE_THRESHOLD)',
    shippedThreshold: Z_SCORE_THRESHOLD,
    minAbsoluteScore: MIN_ABSOLUTE_SCORE,
    sourceDbPath: evalDatabase.sourceDbPath,
    evalDbPath: evalDatabase.dbPath,
    evalShardPath: evalDatabase.evalShardPath,
    activeEmbedder: evalDatabase.activeEmbedder,
    pipelineLimit: PIPELINE_LIMIT,
    topK: TOP_K,
    detectorDirection: 'gap when zScore < threshold (confirmed from evidence-gap-detector.ts line 206)',
    statisticSource:
      'detectEvidenceGap recomputed on resolveEffectiveScore over the full returned result set; ' +
      'recomputed gapDetected@1.3 asserted equal to pipeline metadata.stage4.evidenceGapDetected per query.',
    verdictSource:
      'assessRequestQuality over computeResultConfidence with Stage-4 evidenceGapDetected threaded in, under shipped default feature flags.',
    notes: [
      'gapStatistic = top-score Z-score over the result-set effective scores.',
      'gapDetectedAt13 = production Stage-4 binary at the shipped 1.3 threshold.',
      'sweep classifies gap when gapStatistic < threshold, matching the detector direction.',
      'degenerate queries (stdDev === 0) carry a meaningless Z=0 and are excluded from the sweep and distributions.',
      'separation = (should-good correctly not-gap + should-gap correctly gap) / total over non-degenerate queries.',
    ],
    summary: {
      queryCount: perQuery.length,
      mislabeledCount: mislabeledQueries.length,
      atCurrentThreshold,
      sweep: {
        thresholdRange: [fmt(SWEEP_MIN, 1), fmt(SWEEP_MAX, 1)],
        step: fmt(SWEEP_STEP, 1),
        optimalThreshold: optimal ? optimal.threshold : null,
        separationAtOptimal: optimal ? optimal.separation : null,
        separationAt13: separationAt13Row ? separationAt13Row.separation : null,
        distributions,
      },
    },
    mislabeledQueries,
    perQuery,
    sweepTable: sweep,
  };

  fs.mkdirSync(RESULTS_DIR, { recursive: true });
  const outPath = path.join(RESULTS_DIR, 'metrics.json');
  fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`);

  // Best-effort cleanup of the temporary eval copy.
  try {
    fs.rmSync(evalDatabase.evalRoot, { recursive: true, force: true });
  } catch { /* best-effort */ }

  // Compact console summary for the operator.
  const consoleSummary = {
    metricsPath: outPath,
    shippedThreshold: Z_SCORE_THRESHOLD,
    shouldGoodFalsePositiveRate: atCurrentThreshold.shouldGoodFalsePositiveRate,
    shouldGoodFalsePositives: atCurrentThreshold.shouldGoodFalsePositives,
    shouldGapDetectionRate: atCurrentThreshold.shouldGapDetectionRate,
    boundaryClassification: atCurrentThreshold.boundaryClassification.map((b) => ({
      text: b.text, gapStatistic: b.gapStatistic, gapDetectedAt13: b.gapDetectedAt13, verdict: b.verdict,
    })),
    optimalThreshold: optimal ? optimal.threshold : null,
    separationAtOptimal: optimal ? optimal.separation : null,
    separationAt13: separationAt13Row ? separationAt13Row.separation : null,
    distributions: {
      'should-good': distributions['should-good'],
      'should-gap': distributions['should-gap'],
      boundary: distributions.boundary,
    },
    mislabeledQueries,
  };
  process.stdout.write(`${JSON.stringify(consoleSummary, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
