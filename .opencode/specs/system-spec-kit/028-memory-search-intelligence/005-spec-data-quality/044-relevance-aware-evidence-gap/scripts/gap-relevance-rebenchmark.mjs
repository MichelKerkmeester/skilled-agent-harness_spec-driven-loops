#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────
// MODULE: Relevance-Aware Evidence-Gap Re-Benchmark
// Usage:
//   node gap-relevance-rebenchmark.mjs
//
// Measures the relevance-aware evidence-gap path against the OLD Z-score path on
// the same 18 labeled queries the prior gap-threshold calibration benchmark used.
// That benchmark proved the Z-score check measures peakedness not relevance, and
// that no Z threshold separates strong tight clusters from flat off-corpus ones.
// This re-benchmark asks whether the relevance-aware path, which bands the
// noise-floor-subtracted absolute top relevance at the same LOW_THRESHOLD the
// request-quality verdict uses, agrees with that verdict better than the Z path.
//
// It never changes a default and never decides whether the flag graduates. It only
// produces correct measurements and writes them to results/metrics.json.
//
// Faithfulness:
//   Each query runs once through the production executePipeline under the shipped
//   default flags. The OLD gap decision is read straight from the pipeline
//   metadata (metadata.stage4.evidenceGapDetected), the production Z-score binary
//   at the shipped 1.3 threshold. The NEW gap decision is produced by calling the
//   production detectEvidenceGap with SPECKIT_RELEVANCE_AWARE_GAP on and the active
//   embedder threaded in, over the SAME absolute-relevance scores the
//   request-quality banding bands on (resolveAbsoluteRelevance), so the
//   relevance-aware band keys off the exact 0-1 cosine the verdict reads, not the
//   RRF magnitude. The verdict itself is the production assessRequestQuality label
//   under the shipped defaults, with the Stage-4 gap threaded in exactly as the
//   formatter does.
//
//   The detector takes topScore = max(scores). The benchmark reports both the
//   max-of-array relevance the detector actually banded and the rank-1
//   results[0] relevance the verdict banded, and flags any row where they diverge,
//   so the comparison is honest rather than assuming they always coincide.
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
// location. The dist modules resolve their own bare imports against the same tree
// once they are imported by file URL.
const mcpRequire = createRequire(path.join(MCP_DIR, 'package.json'));
const Database = mcpRequire('better-sqlite3');

// A wide pipeline window so the Stage-4 final-limit cap never trims the result
// set. With minState empty and applyStateLimits false the returned set then equals
// the exact score array Stage 4 fed detectEvidenceGap, which is what makes the OLD
// pipeline binary and the NEW recomputation comparable on the same rows.
const PIPELINE_LIMIT = 200;
// Top-K window reported per query for the operator. Both gap decisions are computed
// over the full result set, not this window.
const TOP_K = 10;

// The same 18 labeled proxy queries the prior gap-threshold calibration benchmark
// used. No human ground truth, the labels are expectations.
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
  const evalRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-gap-rel-eval-'));
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

// The gap signal of a verdict: the request-quality verdict fires a gap signal when
// the label is gap-or-weak. This is the exact agreement rule, reported in the
// metrics so the reader can audit it. A good verdict is a not-gap signal.
function verdictIsGapSignal(verdict) {
  return verdict === 'gap' || verdict === 'weak';
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

  // Point the runtime at the eval copy and keep the embedder load tiny. The active
  // embedder is a local provider, so embedding works standalone. The skip flag only
  // avoids a startup API-key probe that does not apply here. Leave every
  // results-affecting feature flag at its shipped default so the pipeline run and
  // the verdict reflect the production state, then toggle only the relevance-aware
  // gap flag per call below.
  process.env.MEMORY_DB_PATH = evalDatabase.dbPath;
  process.env.SPECKIT_SKIP_API_VALIDATION = 'true';
  process.env.SPECKIT_RELEVANCE_AWARE_GAP = 'false';

  const [vectorIndex, hybridSearch, graphSearch, pipeline, detector, scoreTypes, confidence, noiseFloor, flags] =
    await Promise.all([
      import(distUrl('lib/search/vector-index.js')),
      import(distUrl('lib/search/hybrid-search.js')),
      import(distUrl('lib/search/graph-search-fn.js')),
      import(distUrl('lib/search/pipeline/index.js')),
      import(distUrl('lib/search/evidence-gap-detector.js')),
      import(distUrl('lib/search/pipeline/types.js')),
      import(distUrl('lib/search/confidence-scoring.js')),
      import(distUrl('lib/search/noise-floor.js')),
      import(distUrl('lib/search/search-flags.js')),
    ]);

  const LOW_THRESHOLD = confidence.LOW_THRESHOLD;
  const activeEmbedderName = evalDatabase.activeEmbedder.name;
  // The noise floor the relevance-aware path will subtract, resolved exactly as the
  // detector resolves it. Null when the active embedder has no measured floor, which
  // is the fail-closed signal (the NEW path then falls back to the Z-score path).
  const resolvedFloor = flags.isNoiseFloorSubtractionEnabled()
    ? noiseFloor.resolveNoiseFloor(activeEmbedderName)
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

    // Run the pipeline under the shipped defaults with the relevance-aware flag OFF,
    // so metadata.stage4.evidenceGapDetected is the production OLD Z-score binary.
    process.env.SPECKIT_RELEVANCE_AWARE_GAP = 'false';
    const result = await pipeline.executePipeline(buildPipelineConfig(q.text, embedding));
    const results = result.results;

    // OLD gap = production Stage-4 Z-score binary at the shipped 1.3 threshold.
    const oldGap = result.metadata.stage4.evidenceGapDetected === true;

    // Absolute-relevance scores, the 0-1 cosine the request-quality banding bands
    // on. The relevance-aware gap path must key off this scale, not the RRF
    // effective-score magnitude the Z-score path uses, so the gap decision and the
    // verdict read the same number.
    const relevanceScores = results.map((row) => scoreTypes.resolveAbsoluteRelevance(row));
    const detectorTopRelevance = maxOf(relevanceScores);
    const rank1Relevance = results.length > 0 ? scoreTypes.resolveAbsoluteRelevance(results[0]) : null;

    // raw top score = the absolute relevance the relevance-aware path bands. floor
    // and subtracted relevance reported so the band read is auditable per query.
    const floorValue = resolvedFloor ? resolvedFloor.floor : 0;
    const subtractedRelevance = detectorTopRelevance === null
      ? null
      : Math.max(0, detectorTopRelevance - floorValue);

    // NEW gap = production detectEvidenceGap over the absolute-relevance scores with
    // the relevance-aware flag ON and the active embedder threaded in, so the
    // detector resolves the same per-embedder floor and bands at LOW_THRESHOLD.
    process.env.SPECKIT_RELEVANCE_AWARE_GAP = 'true';
    const newTrm = detector.detectEvidenceGap(relevanceScores, { embedder: activeEmbedderName });
    const newGap = newTrm.gapDetected;
    process.env.SPECKIT_RELEVANCE_AWARE_GAP = 'false';

    // requestQuality verdict under shipped defaults, with the Stage-4 OLD gap
    // threaded in exactly as the production formatter does.
    const confidences = confidence.computeResultConfidence(results);
    const verdict = confidence.assessRequestQuality(results, confidences, {
      query: q.text,
      evidenceGapDetected: oldGap,
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
      rawTopScore: fmt(detectorTopRelevance, 8),
      rank1Relevance: fmt(rank1Relevance, 8),
      // Honest disclosure: the detector bands max-of-array relevance, the verdict
      // bands rank-1 relevance. Equal in a relevance-sorted set, flagged when not.
      detectorTopDivergesFromRank1:
        detectorTopRelevance !== null && rank1Relevance !== null
          ? fmt(Math.abs(detectorTopRelevance - rank1Relevance), 8) > 0
          : null,
      resolvedNoiseFloor: resolvedFloor ? fmt(resolvedFloor.floor, 8) : null,
      noiseFloorEmbedder: resolvedFloor ? resolvedFloor.embedder : null,
      subtractedRelevance: fmt(subtractedRelevance, 8),
      lowThreshold: LOW_THRESHOLD,
      verdict,
      verdictGapSignal: verdictIsGapSignal(verdict),
      oldGap,
      newGap,
      topK,
    });
  }

  // ── Agreement, false-positive and detection metrics for OLD and NEW ──
  //
  // Agreement rule (reported verbatim in the output): a gap signal fires iff the
  // request-quality verdict is gap-or-weak. A path agrees with the verdict on a
  // query when its gapDetected equals verdictIsGapSignal(verdict).
  function agreementRate(gapKey) {
    let agree = 0;
    for (const p of perQuery) {
      if (p[gapKey] === p.verdictGapSignal) agree += 1;
    }
    return perQuery.length > 0 ? agree / perQuery.length : null;
  }

  const shouldGood = perQuery.filter((p) => p.label === 'should-good');
  const shouldGap = perQuery.filter((p) => p.label === 'should-gap');

  // should-good false positive = a should-good query wrongly flagged gap (a strong
  // aligned match the path over-capped).
  function falsePositiveRate(gapKey) {
    if (shouldGood.length === 0) return null;
    const fp = shouldGood.filter((p) => p[gapKey]).length;
    return fp / shouldGood.length;
  }

  // should-gap detection rate = a should-gap query correctly flagged gap.
  function detectionRate(gapKey) {
    if (shouldGap.length === 0) return null;
    const detected = shouldGap.filter((p) => p[gapKey]).length;
    return detected / shouldGap.length;
  }

  function pathSummary(gapKey) {
    return {
      agreementWithVerdict: fmt(agreementRate(gapKey), 4),
      shouldGoodFalsePositiveRate: fmt(falsePositiveRate(gapKey), 4),
      shouldGoodFalsePositives: shouldGood.filter((p) => p[gapKey]).map((p) => p.id),
      shouldGapDetectionRate: fmt(detectionRate(gapKey), 4),
      shouldGapMissed: shouldGap.filter((p) => !p[gapKey]).map((p) => p.id),
    };
  }

  const output = {
    generatedFrom: 'gap-relevance-rebenchmark.mjs',
    generatedAt: new Date().toISOString(),
    subject: 'Relevance-aware evidence-gap path (SPECKIT_RELEVANCE_AWARE_GAP) vs the OLD Z-score path',
    sourceDbPath: evalDatabase.sourceDbPath,
    evalDbPath: evalDatabase.dbPath,
    evalShardPath: evalDatabase.evalShardPath,
    activeEmbedder: evalDatabase.activeEmbedder,
    resolvedNoiseFloor: resolvedFloor ? { embedder: resolvedFloor.embedder, floor: fmt(resolvedFloor.floor, 8) } : null,
    lowThreshold: LOW_THRESHOLD,
    pipelineLimit: PIPELINE_LIMIT,
    topK: TOP_K,
    oldPathSource:
      'metadata.stage4.evidenceGapDetected, the production Z-score binary at the shipped 1.3 threshold, ' +
      'with SPECKIT_RELEVANCE_AWARE_GAP off.',
    newPathSource:
      'detectEvidenceGap over resolveAbsoluteRelevance scores with SPECKIT_RELEVANCE_AWARE_GAP on and the active ' +
      'embedder threaded in, banding noise-floor-subtracted relevance at LOW_THRESHOLD.',
    verdictSource:
      'assessRequestQuality over computeResultConfidence with the Stage-4 OLD gap threaded in, under shipped default flags.',
    agreementRule: 'gap signal fires iff verdict is gap-or-weak; a path agrees when gapDetected === (verdict in {gap, weak}).',
    notes: [
      'rawTopScore = the absolute (cosine) top relevance the relevance-aware path bands, max over the result set.',
      'rank1Relevance = the relevance of results[0], the value the request-quality verdict bands.',
      'detectorTopDivergesFromRank1 flags rows where max-of-array relevance is not the rank-1 relevance.',
      'subtractedRelevance = max(0, rawTopScore - resolvedNoiseFloor); newGap = subtractedRelevance < lowThreshold.',
      'oldGap = production Z-score binary; newGap = relevance-aware binary; both over the full result set.',
    ],
    summary: {
      queryCount: perQuery.length,
      shouldGoodCount: shouldGood.length,
      shouldGapCount: shouldGap.length,
      old: pathSummary('oldGap'),
      new: pathSummary('newGap'),
    },
    perQuery,
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
    activeEmbedder: evalDatabase.activeEmbedder.name,
    resolvedNoiseFloor: output.resolvedNoiseFloor,
    lowThreshold: LOW_THRESHOLD,
    agreementRule: output.agreementRule,
    old: output.summary.old,
    new: output.summary.new,
    perQuery: perQuery.map((p) => ({
      id: p.id,
      label: p.label,
      rawTopScore: p.rawTopScore,
      noiseFloor: p.resolvedNoiseFloor,
      subtractedRelevance: p.subtractedRelevance,
      verdict: p.verdict,
      oldGap: p.oldGap,
      newGap: p.newGap,
    })),
  };
  process.stdout.write(`${JSON.stringify(consoleSummary, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
