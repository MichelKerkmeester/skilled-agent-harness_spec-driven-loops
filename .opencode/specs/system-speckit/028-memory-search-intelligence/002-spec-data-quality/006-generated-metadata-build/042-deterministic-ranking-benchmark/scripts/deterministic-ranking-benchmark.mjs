#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────
// MODULE: Deterministic Ranking Flag Graduation Benchmark
// Usage:
//   node deterministic-ranking-benchmark.mjs [--runs N]
//
// Measures the graduation evidence for SPECKIT_DETERMINISTIC_RANKING. The flag
// removes the wall-clock recency inputs from ranking so a fixed query string is
// reproducible across evaluations. With the flag ON the vector lane drops the
// julianday('now') decay term and Stage-2 fusion zeroes the computeRecencyScore
// contribution. The decision the benchmark feeds hinges on two questions: is
// flag-ON ranking reproducible run to run, and how far does flag-ON ranking
// diverge from flag-OFF, which tells the reader how load-bearing recency is.
//
// The benchmark never flips a default and never decides graduation. It only
// produces correct reproducible measurements and writes them to metrics.json.
//
// Faithfulness:
//   The real production retrieval path is exercised through executePipeline so
//   BOTH the vector-decay effect (Stage 1 candidate generation) and the Stage-2
//   recency effect are measured. The flag reads process.env at call time, so a
//   per-call env toggle is the correct lever and embedding is unaffected. Each
//   query is embedded exactly once with the active production embedder and that
//   embedding is reused for every OFF and ON run.
//
// Safety:
//   The live database is never opened directly. It is backed up read-only to a
//   temporary eval copy along with the active vector shard, and all searches run
//   against the copy. No reindex is triggered.
// ───────────────────────────────────────────────────────────────

import crypto from 'node:crypto';
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

// Reuse the 12-query set from the vague-query model benchmark. The set spans
// corpus-aligned, generic, off-corpus and one max-vague query, which is the
// diversity the divergence measurement needs.
const QUERY_CONFIG = path.join(
  REPO_ROOT,
  '.opencode', 'specs', 'system-spec-kit', '028-memory-search-intelligence',
  '003-spec-data-quality', '029-vague-query-model-benchmark', 'scripts', 'benchmark-config.json',
);

const TOP_K = 10;

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  if (i === -1) return fallback;
  const v = process.argv[i + 1];
  return v && !v.startsWith('--') ? v : true;
}

const RUNS = Number.parseInt(arg('--runs', '3'), 10);

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
  const evalRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-det-rank-eval-'));
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

function orderedDigest(rankedIds) {
  return crypto.createHash('sha1').update(rankedIds.join(',')).digest('hex');
}

// Count of distinct ordered-id digests across a set of runs. 1 means every run
// produced the identical ordering, which is perfect reproducibility.
function distinctOrderings(runs) {
  const digests = new Set(runs.map((run) => orderedDigest(run.map((r) => r.id))));
  return digests.size;
}

function jaccard(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 1;
  let intersection = 0;
  for (const value of setA) {
    if (setB.has(value)) intersection += 1;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 1 : intersection / union;
}

// Kendall tau rank correlation over the ids present in both top-K lists. Tau
// counts concordant minus discordant pairs normalised by the pair count. Returns
// null when fewer than two shared ids exist, since a correlation needs at least
// one comparable pair.
function kendallTau(rankA, rankB) {
  const shared = [...rankA.keys()].filter((id) => rankB.has(id));
  const n = shared.length;
  if (n < 2) return null;
  let concordant = 0;
  let discordant = 0;
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const a = shared[i];
      const b = shared[j];
      const da = rankA.get(a) - rankA.get(b);
      const db = rankB.get(a) - rankB.get(b);
      const sign = Math.sign(da) * Math.sign(db);
      if (sign > 0) concordant += 1;
      else if (sign < 0) discordant += 1;
    }
  }
  const pairs = (n * (n - 1)) / 2;
  return pairs === 0 ? null : (concordant - discordant) / pairs;
}

function rankMap(run) {
  const map = new Map();
  run.forEach((row, index) => {
    map.set(row.id, index);
  });
  return map;
}

function scoreMap(run) {
  const map = new Map();
  for (const row of run) {
    map.set(row.id, row.score);
  }
  return map;
}

// Mean absolute composite-score difference over the ids present in both top-K
// lists. Returns null when no shared ids exist.
function meanScoreDelta(runA, runB) {
  const sa = scoreMap(runA);
  const sb = scoreMap(runB);
  const shared = [...sa.keys()].filter((id) => sb.has(id));
  if (shared.length === 0) return null;
  let total = 0;
  for (const id of shared) {
    total += Math.abs(sa.get(id) - sb.get(id));
  }
  return total / shared.length;
}

function fmt(value, digits = 6) {
  return typeof value === 'number' && Number.isFinite(value) ? Number(value.toFixed(digits)) : null;
}

function mean(values) {
  const finite = values.filter((v) => typeof v === 'number' && Number.isFinite(v));
  if (finite.length === 0) return null;
  return finite.reduce((sum, v) => sum + v, 0) / finite.length;
}

// ── pipeline config ───────────────────────────────────────────────
// A faithful hybrid-search PipelineConfig that carries the pre-computed query
// embedding so the embedder runs once per query rather than once per run. The
// flag does not change embedding, only ranking, so reusing the embedding keeps
// the OFF and ON runs comparing pure ranking effects. Caching is bypassed at the
// pipeline level here because executePipeline does not memoize across calls, and
// the deterministic-ranking env is the only thing that changes between OFF and ON.
function buildPipelineConfig(query, embedding) {
  return {
    query,
    queryEmbedding: embedding,
    searchType: 'hybrid',
    limit: TOP_K,
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

function topKFromResults(results) {
  return results.slice(0, TOP_K).map((row) => ({
    id: Number(row.id),
    score: typeof row.score === 'number' && Number.isFinite(row.score) ? row.score : 0,
  }));
}

async function main() {
  if (!Number.isInteger(RUNS) || RUNS < 2) {
    throw new Error(`--runs must be an integer >= 2 (got ${RUNS})`);
  }

  const queryConfig = JSON.parse(fs.readFileSync(QUERY_CONFIG, 'utf8'));
  const queries = queryConfig.queries;
  if (!Array.isArray(queries) || queries.length === 0) {
    throw new Error(`No queries loaded from ${QUERY_CONFIG}`);
  }

  // Resolve the live database path from config rather than hardcoding it.
  const config = await import(distUrl('core/config.js'));
  const sourceDbPath = config.DATABASE_PATH;
  if (!sourceDbPath || !fs.existsSync(sourceDbPath)) {
    throw new Error(`Live database not found at config DATABASE_PATH: ${sourceDbPath}`);
  }

  const evalDatabase = await prepareEvalDatabase(sourceDbPath);

  // Point the runtime at the eval copy and keep the embedder load tiny. The
  // active embedder is a local provider, so embedding works standalone; the skip
  // flag only avoids a startup API-key probe that does not apply here.
  process.env.MEMORY_DB_PATH = evalDatabase.dbPath;
  process.env.SPECKIT_SKIP_API_VALIDATION = 'true';
  // Start from a clean flag state so the first OFF run is a true control.
  delete process.env.SPECKIT_DETERMINISTIC_RANKING;

  const [vectorIndex, hybridSearch, graphSearch, pipeline] = await Promise.all([
    import(distUrl('lib/search/vector-index.js')),
    import(distUrl('lib/search/hybrid-search.js')),
    import(distUrl('lib/search/graph-search-fn.js')),
    import(distUrl('lib/search/pipeline/index.js')),
  ]);

  const db = vectorIndex.initializeDb(evalDatabase.dbPath, { skipRestoreRecovery: true });
  vectorIndex.attachActiveVectorShardForActiveProfile(db);
  const graphSearchFn = graphSearch.createUnifiedGraphSearchFn(db);
  hybridSearch.init(db, vectorIndex.vectorSearch, graphSearchFn);

  // Embed every query exactly once and reuse across all OFF and ON runs.
  const embeddings = new Map();
  for (const q of queries) {
    const emb = await vectorIndex.generateQueryEmbedding(q.text);
    if (!emb || emb.length === 0) {
      throw new Error(`Embedding failed for query "${q.text}"; cannot run a faithful benchmark`);
    }
    embeddings.set(q.id, emb);
  }

  async function runSearch(query, embedding, deterministic) {
    if (deterministic) process.env.SPECKIT_DETERMINISTIC_RANKING = 'true';
    else delete process.env.SPECKIT_DETERMINISTIC_RANKING;
    const result = await pipeline.executePipeline(buildPipelineConfig(query, embedding));
    return topKFromResults(result.results);
  }

  const perQuery = [];
  for (const q of queries) {
    const embedding = embeddings.get(q.id);

    const offRuns = [];
    const onRuns = [];
    // Interleave OFF and ON runs so neither variant gets a systematically warmer
    // or cooler clock window, keeping the OFF/ON comparison fair.
    for (let r = 0; r < RUNS; r += 1) {
      offRuns.push(await runSearch(q.text, embedding, false));
      onRuns.push(await runSearch(q.text, embedding, true));
    }

    const determinismOn = distinctOrderings(onRuns);
    const determinismOff = distinctOrderings(offRuns);

    // OFF vs ON divergence is measured on run 1 of each variant.
    const off1 = offRuns[0];
    const on1 = onRuns[0];
    const offIds = new Set(off1.map((row) => row.id));
    const onIds = new Set(on1.map((row) => row.id));
    const topKOverlap = jaccard(offIds, onIds);
    const tau = kendallTau(rankMap(off1), rankMap(on1));
    const scoreDelta = meanScoreDelta(off1, on1);

    perQuery.push({
      id: q.id,
      text: q.text,
      class: q.class ?? null,
      offTopIds: off1.map((row) => row.id),
      onTopIds: on1.map((row) => row.id),
      offTop: off1,
      onTop: on1,
      determinismOn,
      determinismOff,
      reproducibleOn: determinismOn === 1,
      topKOverlap: fmt(topKOverlap),
      kendallTau: fmt(tau),
      meanScoreDelta: fmt(scoreDelta, 8),
      materialDivergence: topKOverlap < 0.8,
      resultCountOff: off1.length,
      resultCountOn: on1.length,
    });
  }

  delete process.env.SPECKIT_DETERMINISTIC_RANKING;

  const summary = {
    queryCount: perQuery.length,
    runsPerCell: RUNS,
    topK: TOP_K,
    meanDeterminismOn: fmt(mean(perQuery.map((q) => q.determinismOn))),
    meanDeterminismOff: fmt(mean(perQuery.map((q) => q.determinismOff))),
    reproducibleOnCount: perQuery.filter((q) => q.reproducibleOn).length,
    meanTopKOverlap: fmt(mean(perQuery.map((q) => q.topKOverlap))),
    meanKendallTau: fmt(mean(perQuery.map((q) => q.kendallTau))),
    meanScoreDelta: fmt(mean(perQuery.map((q) => q.meanScoreDelta)), 8),
    materialDivergenceCount: perQuery.filter((q) => q.materialDivergence).length,
    materialDivergenceQueries: perQuery.filter((q) => q.materialDivergence).map((q) => q.id),
  };

  const output = {
    generatedFrom: 'deterministic-ranking-benchmark.mjs',
    generatedAt: new Date().toISOString(),
    flag: 'SPECKIT_DETERMINISTIC_RANKING',
    sourceDbPath: evalDatabase.sourceDbPath,
    evalDbPath: evalDatabase.dbPath,
    evalShardPath: evalDatabase.evalShardPath,
    activeEmbedder: evalDatabase.activeEmbedder,
    queryConfigSource: QUERY_CONFIG,
    pipelinePath: 'executePipeline (Stage 1 vector-decay + Stage 2 recency exercised)',
    notes: [
      'Flag-ON drops the julianday(now) vector decay term and zeroes the Stage-2 recency contribution.',
      'Each query embedded once, embedding reused across all OFF and ON runs.',
      'determinism = count of distinct ordered-id digests across runs (1 = perfectly reproducible).',
      'topK_overlap = Jaccard of top-10 id sets OFF vs ON (run 1 of each).',
      'kendall_tau = rank correlation on ids present in both top-10s (null when fewer than 2 shared).',
      'mean_score_delta = mean absolute composite-score difference on shared ids.',
    ],
    summary,
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
  process.stdout.write(`${JSON.stringify({ summary, metricsPath: outPath }, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
