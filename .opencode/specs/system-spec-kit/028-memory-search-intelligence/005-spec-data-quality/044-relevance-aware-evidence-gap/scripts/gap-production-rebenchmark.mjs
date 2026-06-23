#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────
// MODULE: Relevance-Aware Evidence-Gap PRODUCTION Re-Benchmark
// Usage:
//   node gap-production-rebenchmark.mjs
//
// Re-runs the 18 labeled queries through the PRODUCTION executePipeline with
// SPECKIT_RELEVANCE_AWARE_GAP forced on, and reads evidenceGapDetected straight from
// the pipeline result metadata (metadata.stage4.evidenceGapDetected). It never calls
// detectEvidenceGap directly with hand-picked scores.
//
// Why a sibling of gap-relevance-rebenchmark.mjs:
//   The sibling benchmark recomputes the NEW gap by calling detectEvidenceGap on a
//   hand-built resolveAbsoluteRelevance array. That recomputation masked a real
//   production bug. Production stage4 fed detectEvidenceGap the rrf effective-score
//   array (~0.03 magnitude), and the relevance-aware band keyed off that degenerate
//   signal, which sits below the band floor for every query, so the in-pipeline path
//   flagged a gap on everything. The sibling never saw the bug because it bypassed the
//   pipeline and fed the band the correct absolute-relevance array directly.
//
//   This benchmark exercises the exact production call chain instead. The fix threads
//   resolveCalibrationScore (the same absolute-relevance signal the verdict bands) into
//   detectEvidenceGap as relevanceScores. If the band still read the rrf magnitudes,
//   every query here would come back evidenceGapDetected=true, including strong aligned
//   ones. So a correct fix is observable as: aligned queries come back NOT a gap, a
//   genuine off-corpus gap comes back a gap, and the in-pipeline gap matches the
//   verdict's gap band.
//
// Faithfulness:
//   Each query runs once through executePipeline under the shipped default flags with
//   one toggle: SPECKIT_RELEVANCE_AWARE_GAP set on for the whole run. evidenceGapDetected
//   is read from metadata.stage4, the production Stage-4 binary with the relevance-aware
//   override active. The requestQuality verdict is the production assessRequestQuality
//   label under the shipped defaults, with the Stage-4 gap threaded in exactly as the
//   formatter does. No score is hand-fed to the detector.
//
// Safety:
//   The live database is never opened for writes. It is backed up read-only to a
//   temporary eval copy along with the active vector shard, and all searches run
//   against the copy. No reindex is triggered.
//
// It never changes a default and never decides whether the flag graduates. It only
// produces correct measurements and writes them to results/production-metrics.json.
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

// This harness lives outside the mcp_server node_modules tree, so anchor the native
// better-sqlite3 resolution at the server package rather than the script location.
const mcpRequire = createRequire(path.join(MCP_DIR, 'package.json'));
const Database = mcpRequire('better-sqlite3');

// A wide pipeline window so the Stage-4 final-limit cap never trims the result set,
// keeping the gap decision over the same full set the verdict reads.
const PIPELINE_LIMIT = 200;
// Top-K window reported per query for the operator. The gap decision is computed over
// the full result set inside the pipeline, not this window.
const TOP_K = 10;

// The same 18 labeled proxy queries the prior gap-threshold calibration benchmark used.
// No human ground truth, the labels are expectations.
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

// Backup the live database and its active vector shard to a temporary eval copy. All
// searches run against the copy so the live corpus is never mutated and the live daemon
// write lock is never contended.
async function prepareEvalDatabase(sourceDbPath) {
  const evalRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-gap-prod-eval-'));
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

function maxOf(values) {
  const finite = values.filter((v) => typeof v === 'number' && Number.isFinite(v));
  return finite.length === 0 ? null : finite.reduce((a, b) => Math.max(a, b), -Infinity);
}

// The gap signal of a verdict: the request-quality verdict fires a gap signal when the
// label is gap-or-weak. A good verdict is a not-gap signal.
function verdictIsGapSignal(verdict) {
  return verdict === 'gap' || verdict === 'weak';
}

// ── pipeline config ───────────────────────────────────────────────
// A faithful hybrid-search PipelineConfig carrying the pre-computed query embedding so
// the embedder runs once per query. minState empty and applyStateLimits false disable
// state filtering, and the wide limit prevents the Stage-4 final cap from trimming.
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

  // Point the runtime at the eval copy and keep the embedder load tiny. The active
  // embedder is a local provider, so embedding works standalone. The skip flag only
  // avoids a startup API-key probe that does not apply here. Leave every
  // results-affecting feature flag at its shipped default so the pipeline run and the
  // verdict reflect the production state, then force the relevance-aware gap flag ON for
  // the whole run so metadata.stage4.evidenceGapDetected is the relevance-aware binary.
  process.env.MEMORY_DB_PATH = evalDatabase.dbPath;
  process.env.SPECKIT_SKIP_API_VALIDATION = 'true';
  process.env.SPECKIT_RELEVANCE_AWARE_GAP = 'true';

  const [vectorIndex, hybridSearch, graphSearch, pipeline, scoreTypes, confidence, noiseFloor, flags] =
    await Promise.all([
      import(distUrl('lib/search/vector-index.js')),
      import(distUrl('lib/search/hybrid-search.js')),
      import(distUrl('lib/search/graph-search-fn.js')),
      import(distUrl('lib/search/pipeline/index.js')),
      import(distUrl('lib/search/pipeline/types.js')),
      import(distUrl('lib/search/confidence-scoring.js')),
      import(distUrl('lib/search/noise-floor.js')),
      import(distUrl('lib/search/search-flags.js')),
    ]);

  const LOW_THRESHOLD = confidence.LOW_THRESHOLD;
  const activeEmbedderName = evalDatabase.activeEmbedder.name;
  // The noise floor the in-pipeline relevance-aware path subtracts. The orchestrator
  // does not thread an embedder into Stage 4, so the path resolves the DEFAULT-embedder
  // floor. This benchmark's active embedder IS that default, so the resolved floor and
  // the in-pipeline floor are the same value, reported here for an auditable band read.
  const resolvedFloor = flags.isNoiseFloorSubtractionEnabled()
    ? noiseFloor.resolveNoiseFloor(undefined)
    : null;

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

    // Run the pipeline with the relevance-aware flag ON for the whole run, so the
    // gap below is the PRODUCTION Stage-4 binary with the override active, read straight
    // from the result metadata. No score is hand-fed to the detector.
    const result = await pipeline.executePipeline(buildPipelineConfig(q.text, embedding));
    const results = result.results;

    // PRODUCTION gap = the Stage-4 evidenceGapDetected the pipeline metadata reports with
    // SPECKIT_RELEVANCE_AWARE_GAP on. This is the single load-bearing measurement.
    const evidenceGapDetectedOn = result.metadata.stage4.evidenceGapDetected === true;

    // Absolute-relevance scores, reported only so the band read is auditable. The detector
    // bands resolveCalibrationScore inside the pipeline, the same absolute-relevance signal
    // the verdict bands. These are reported, NOT fed back into the detector.
    const relevanceScores = results.map((row) => scoreTypes.resolveAbsoluteRelevance(row));
    const detectorTopRelevance = maxOf(relevanceScores);
    const rank1Relevance = results.length > 0 ? scoreTypes.resolveAbsoluteRelevance(results[0]) : null;
    const floorValue = resolvedFloor ? resolvedFloor.floor : 0;
    const subtractedRelevance = detectorTopRelevance === null
      ? null
      : Math.max(0, detectorTopRelevance - floorValue);

    // requestQuality verdict under shipped defaults, with the production Stage-4 gap
    // threaded in exactly as the production formatter does.
    const confidences = confidence.computeResultConfidence(results);
    const verdict = confidence.assessRequestQuality(results, confidences, {
      query: q.text,
      evidenceGapDetected: evidenceGapDetectedOn,
      embedder: activeEmbedderName,
    }).requestQuality.label;

    const topK = results.slice(0, TOP_K).map((row, index) => ({
      rank: index,
      id: Number(row.id),
      relevance: fmt(scoreTypes.resolveAbsoluteRelevance(row), 8),
    }));

    perQuery.push({
      id: q.id,
      text: q.text,
      label: q.label,
      resultCount: results.length,
      rawTopRelevance: fmt(detectorTopRelevance, 8),
      rank1Relevance: fmt(rank1Relevance, 8),
      resolvedNoiseFloor: resolvedFloor ? fmt(resolvedFloor.floor, 8) : null,
      noiseFloorEmbedder: resolvedFloor ? resolvedFloor.embedder : null,
      subtractedRelevance: fmt(subtractedRelevance, 8),
      lowThreshold: LOW_THRESHOLD,
      verdict,
      verdictGapSignal: verdictIsGapSignal(verdict),
      evidenceGapDetectedOn,
      // The fix is correct when the in-pipeline gap matches the verdict's gap band.
      gapMatchesVerdict: evidenceGapDetectedOn === verdictIsGapSignal(verdict),
      topK,
    });
  }

  // ── Agreement, false-positive and detection metrics ──
  //
  // Agreement rule (reported verbatim in the output): a gap signal fires iff the
  // request-quality verdict is gap-or-weak. The production gap agrees with the verdict on
  // a query when evidenceGapDetectedOn equals verdictIsGapSignal(verdict).
  function agreementRate() {
    let agree = 0;
    for (const p of perQuery) {
      if (p.evidenceGapDetectedOn === p.verdictGapSignal) agree += 1;
    }
    return perQuery.length > 0 ? agree / perQuery.length : null;
  }

  const shouldGood = perQuery.filter((p) => p.label === 'should-good');
  const shouldGap = perQuery.filter((p) => p.label === 'should-gap');

  // should-good false positive = a should-good query wrongly flagged gap (a strong aligned
  // match the path over-capped). The pre-fix bug made every query a false positive here.
  function falsePositiveRate() {
    if (shouldGood.length === 0) return null;
    const fp = shouldGood.filter((p) => p.evidenceGapDetectedOn).length;
    return fp / shouldGood.length;
  }

  // should-gap detection rate = a should-gap query correctly flagged gap.
  function detectionRate() {
    if (shouldGap.length === 0) return null;
    const detected = shouldGap.filter((p) => p.evidenceGapDetectedOn).length;
    return detected / shouldGap.length;
  }

  const productionGapSummary = {
    agreementWithVerdict: fmt(agreementRate(), 4),
    shouldGoodFalsePositiveRate: fmt(falsePositiveRate(), 4),
    shouldGoodFalsePositives: shouldGood.filter((p) => p.evidenceGapDetectedOn).map((p) => p.id),
    shouldGapDetectionRate: fmt(detectionRate(), 4),
    shouldGapMissed: shouldGap.filter((p) => !p.evidenceGapDetectedOn).map((p) => p.id),
    gapMatchesVerdictRate: fmt(
      perQuery.length > 0 ? perQuery.filter((p) => p.gapMatchesVerdict).length / perQuery.length : null,
      4,
    ),
    gapDivergesFromVerdict: perQuery.filter((p) => !p.gapMatchesVerdict).map((p) => p.id),
  };

  const output = {
    generatedFrom: 'gap-production-rebenchmark.mjs',
    generatedAt: new Date().toISOString(),
    subject:
      'Relevance-aware evidence-gap path read from the PRODUCTION pipeline metadata ' +
      '(SPECKIT_RELEVANCE_AWARE_GAP on)',
    sourceDbPath: evalDatabase.sourceDbPath,
    evalDbPath: evalDatabase.dbPath,
    evalShardPath: evalDatabase.evalShardPath,
    activeEmbedder: evalDatabase.activeEmbedder,
    resolvedNoiseFloor: resolvedFloor ? { embedder: resolvedFloor.embedder, floor: fmt(resolvedFloor.floor, 8) } : null,
    lowThreshold: LOW_THRESHOLD,
    pipelineLimit: PIPELINE_LIMIT,
    topK: TOP_K,
    gapSource:
      'metadata.stage4.evidenceGapDetected from executePipeline with SPECKIT_RELEVANCE_AWARE_GAP on. ' +
      'The relevance-aware override bands resolveCalibrationScore inside the pipeline, not the rrf scores, ' +
      'and not a hand-fed array.',
    verdictSource:
      'assessRequestQuality over computeResultConfidence with the production Stage-4 gap threaded in, under shipped default flags.',
    agreementRule: 'gap signal fires iff verdict is gap-or-weak; the production gap agrees when evidenceGapDetectedOn === (verdict in {gap, weak}).',
    bugContext:
      'Pre-fix, production stage4 fed detectEvidenceGap the rrf effective-score array (~0.03), and the relevance-aware ' +
      'band keyed off it. Every score sat below LOW_THRESHOLD, so the override flagged a gap on every query, a banner on everything. ' +
      'The prior gap-relevance-rebenchmark.mjs masked this by recomputing the NEW gap on a correct hand-built absolute-relevance ' +
      'array, bypassing the pipeline. This benchmark reads the gap from the pipeline metadata, so a still-broken band would show ' +
      'evidenceGapDetectedOn=true on the strong aligned queries.',
    notes: [
      'rawTopRelevance = the absolute (cosine) top relevance, max over the result set, reported for audit only.',
      'rank1Relevance = the relevance of results[0].',
      'subtractedRelevance = max(0, rawTopRelevance - resolvedNoiseFloor); the band the in-pipeline override applies.',
      'evidenceGapDetectedOn = the production Stage-4 gap binary with the relevance-aware override active.',
      'gapMatchesVerdict = evidenceGapDetectedOn === (verdict in {gap, weak}); the fix-correctness check per query.',
    ],
    summary: {
      queryCount: perQuery.length,
      shouldGoodCount: shouldGood.length,
      shouldGapCount: shouldGap.length,
      productionGap: productionGapSummary,
    },
    perQuery,
  };

  fs.mkdirSync(RESULTS_DIR, { recursive: true });
  const outPath = path.join(RESULTS_DIR, 'production-metrics.json');
  fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`);

  // Best-effort cleanup of the temporary eval copy.
  try {
    fs.rmSync(evalDatabase.evalRoot, { recursive: true, force: true });
  } catch { /* best-effort */ }

  // Compact console summary for the operator: the per-query gap table, plus graph and
  // oauth called out as the two acceptance probes.
  const consoleSummary = {
    metricsPath: outPath,
    activeEmbedder: evalDatabase.activeEmbedder.name,
    resolvedNoiseFloor: output.resolvedNoiseFloor,
    lowThreshold: LOW_THRESHOLD,
    agreementRule: output.agreementRule,
    productionGap: output.summary.productionGap,
    perQuery: perQuery.map((p) => ({
      id: p.id,
      label: p.label,
      rawTopRelevance: p.rawTopRelevance,
      subtractedRelevance: p.subtractedRelevance,
      verdict: p.verdict,
      evidenceGapDetectedOn: p.evidenceGapDetectedOn,
      gapMatchesVerdict: p.gapMatchesVerdict,
    })),
  };
  process.stdout.write(`${JSON.stringify(consoleSummary, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
