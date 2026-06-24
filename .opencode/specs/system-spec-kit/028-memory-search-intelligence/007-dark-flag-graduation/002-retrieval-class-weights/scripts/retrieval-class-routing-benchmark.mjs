#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────
// MODULE: Retrieval-Class Routing Benchmark
// Usage:
//   node retrieval-class-routing-benchmark.mjs
//
// Measures SPECKIT_RETRIEVAL_CLASS_ROUTING on the production search path. The
// five-class query classifier runs always-on. This flag gates the per-class
// channel suppression: for a narrow single-hop find-one-item query it suppresses
// the graph and degree channels that tend to add noise there. The question is
// whether that suppression raises precision on single-hop queries without costing
// recall on multi-hop queries.
//
// Design:
//   A labeled set split into a single-hop find-one group, where one correct
//   packet is the answer, and a multi-hop group, where graph context matters.
//   Each query runs once through the production executePipeline with the flag OFF
//   and once with it ON, against a read-only backup of the live corpus.
//     single-hop : precision@1 = the rank-1 result sits in the labeled target
//                  spec folder. The flag should lift this by trimming graph and
//                  degree noise from the top of a find-one result.
//     multi-hop  : recall@K = the fraction of labeled relevant spec folders that
//                  appear in the top-K result set. The flag should not lower this
//                  because a multi-hop query is never classified single-hop, so
//                  the suppression short-circuit never fires for it.
//
// Channel proof:
//   The harness also reads the routeQuery channel set under each flag state per
//   query, so the result-level metric is grounded in the actual graph and degree
//   suppression rather than asserted.
//
// Default-off byte-identity:
//   With the flag OFF the routeQuery channel set and the executePipeline top-K
//   must equal the pre-flag baseline. The harness records, per query, whether the
//   OFF channel set and the OFF top-K equal the ON channel set and top-K, and the
//   suite reads the multi-hop rows where they must always be equal as the
//   byte-identity evidence on the production path.
//
// Safety:
//   The live database is never opened for writes. It is backed up read-only to a
//   temporary eval copy along with the active vector shard, and all searches run
//   against the copy. No reindex is triggered. The flag is toggled per call
//   through the environment and restored to OFF after each pair.
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
// set. The graph and degree contributions, when present, then survive into the
// returned set, so a suppressed channel is the only reason a row leaves the
// result between the OFF and ON states.
const PIPELINE_LIMIT = 200;
// Top-K windows the two metrics read. Precision keys off rank 1. Recall reads the
// labeled relevant folders present in the top-K result set.
const PRECISION_K = 1;
const RECALL_K = 10;

// ── Labeled set ───────────────────────────────────────────────────
//
// single-hop: a find-one-item query phrased so the five-class classifier reads it
// SingleHop. targetFolder is the one correct packet. precision@1 scores whether
// the rank-1 result lives in that folder. These are the queries the flag aims to
// improve by trimming graph and degree noise from the top of a find-one result.
//
// multi-hop: a why or how or trace or compare query the classifier reads MultiHop,
// where graph context matters. relevantFolders is the labeled relevant set.
// recall@K scores the fraction of relevant folders present in the top-K. These are
// the queries the flag must not regress, since a multi-hop query is never
// classified single-hop so the suppression short-circuit never fires for it.
//
// The labels are expectations grounded in the corpus titles and spec folders, not
// external ground truth. A folder match uses startsWith so a parent-folder label
// matches any doc under it.
const SINGLE_HOP_QUERIES = [
  {
    id: 'sh-evidence-gap-detector',
    text: 'find the evidence gap detector spec',
    targetFolders: [
      'system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/043-gap-threshold-calibration-benchmark',
      'system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/044-relevance-aware-evidence-gap',
    ],
  },
  {
    id: 'sh-retrieval-class-routing',
    text: 'find the retrieval class routing spec',
    targetFolders: ['system-spec-kit/028-memory-search-intelligence/001-speckit-memory/003-retrieval-class-routing'],
  },
  {
    id: 'sh-hybrid-search-bm25',
    text: 'open the hybrid search bm25 fusion spec',
    targetFolders: ['system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/009-hybrid-search-bm25-fusion'],
  },
  {
    id: 'sh-skill-advisor-daemon',
    text: 'find the skill advisor daemon spec',
    targetFolders: ['system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor'],
  },
  {
    id: 'sh-gap-threshold-calibration',
    text: 'locate the gap threshold calibration benchmark',
    targetFolders: ['system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/043-gap-threshold-calibration-benchmark'],
  },
  {
    id: 'sh-relevance-aware-gap',
    text: 'find the relevance aware evidence gap spec',
    targetFolders: ['system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/044-relevance-aware-evidence-gap'],
  },
  {
    id: 'sh-conflict-rerank-routing',
    text: 'show me the conflict rerank query routing spec',
    targetFolders: ['system-spec-kit/028-memory-search-intelligence/003-skill-advisor/005-conflict-rerank-query-routing'],
  },
  {
    id: 'sh-retrieval-class-tasks',
    text: 'where is the retrieval class routing tasks doc',
    targetFolders: ['system-spec-kit/028-memory-search-intelligence/001-speckit-memory/003-retrieval-class-routing'],
  },
  {
    id: 'sh-evidence-gap-checklist',
    text: 'get the evidence gap detector checklist',
    targetFolders: [
      'system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/043-gap-threshold-calibration-benchmark',
      'system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/044-relevance-aware-evidence-gap',
    ],
  },
  {
    id: 'sh-complexity-router-spec',
    text: 'which spec defines the complexity router',
    targetFolders: ['system-spec-kit/028-memory-search-intelligence/001-speckit-memory/003-retrieval-class-routing'],
  },
];

const MULTI_HOP_QUERIES = [
  {
    id: 'mh-gap-overcap-cause',
    text: 'why did the gap detector over-cap strong queries',
    relevantFolders: [
      'system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/043-gap-threshold-calibration-benchmark',
      'system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/044-relevance-aware-evidence-gap',
    ],
  },
  {
    id: 'mh-class-router-suppress',
    text: 'how does the retrieval class router suppress channels',
    relevantFolders: ['system-spec-kit/028-memory-search-intelligence/001-speckit-memory/003-retrieval-class-routing'],
  },
  {
    id: 'mh-router-hybrid-dependency',
    text: 'trace the dependency between query router and hybrid search',
    relevantFolders: [
      'system-spec-kit/028-memory-search-intelligence/001-speckit-memory/003-retrieval-class-routing',
      'system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/009-hybrid-search-bm25-fusion',
    ],
  },
  {
    id: 'mh-zscore-vs-relevance',
    text: 'compare the z-score and relevance-aware gap detectors',
    relevantFolders: [
      'system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/043-gap-threshold-calibration-benchmark',
      'system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/044-relevance-aware-evidence-gap',
    ],
  },
  {
    id: 'mh-degree-channel-impact',
    text: 'impact of the degree channel on single-hop precision',
    relevantFolders: ['system-spec-kit/028-memory-search-intelligence/001-speckit-memory/003-retrieval-class-routing'],
  },
  {
    id: 'mh-entity-density-graph',
    text: 'the relationship between entity density and graph preservation',
    relevantFolders: ['system-spec-kit/028-memory-search-intelligence/001-speckit-memory/003-retrieval-class-routing'],
  },
  {
    id: 'mh-complexity-skip-graph',
    text: 'why does the complexity router skip the graph channel',
    relevantFolders: ['system-spec-kit/028-memory-search-intelligence/001-speckit-memory/003-retrieval-class-routing'],
  },
  {
    id: 'mh-dark-flag-graduation',
    text: 'how do the dark flags get graduated to default on',
    relevantFolders: ['system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation'],
  },
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
  const evalRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-rcr-eval-'));
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

function fmt(value, digits = 4) {
  return typeof value === 'number' && Number.isFinite(value) ? Number(value.toFixed(digits)) : null;
}

function folderMatches(folder, targets) {
  if (typeof folder !== 'string') return false;
  return targets.some((target) => folder === target || folder.startsWith(`${target}/`));
}

// ── pipeline config ───────────────────────────────────────────────
// A faithful hybrid-search PipelineConfig carrying the pre-computed query
// embedding so the embedder runs once per query. minState empty and
// applyStateLimits false disable state filtering, and the wide limit prevents the
// Stage-4 final cap from trimming, so the graph and degree contributions, when
// present, survive into the returned set.
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
  // results-affecting feature flag at its shipped default so the pipeline run
  // reflects the production state, then toggle only the retrieval-class routing flag
  // per call below.
  process.env.MEMORY_DB_PATH = evalDatabase.dbPath;
  process.env.SPECKIT_SKIP_API_VALIDATION = 'true';
  process.env.SPECKIT_RETRIEVAL_CLASS_ROUTING = 'false';

  const [vectorIndex, hybridSearch, graphSearch, pipeline, router, retrievalClass] =
    await Promise.all([
      import(distUrl('lib/search/vector-index.js')),
      import(distUrl('lib/search/hybrid-search.js')),
      import(distUrl('lib/search/graph-search-fn.js')),
      import(distUrl('lib/search/pipeline/index.js')),
      import(distUrl('lib/search/query-router.js')),
      import(distUrl('lib/search/retrieval-class-classifier.js')),
    ]);

  const db = vectorIndex.initializeDb(evalDatabase.dbPath, { skipRestoreRecovery: true });
  vectorIndex.attachActiveVectorShardForActiveProfile(db);
  const graphSearchFn = graphSearch.createUnifiedGraphSearchFn(db);
  hybridSearch.init(db, vectorIndex.vectorSearch, graphSearchFn);

  // A read-only handle on the eval copy to resolve each result id to its spec
  // folder, the label axis both metrics score on.
  const lookupDb = new Database(evalDatabase.dbPath, { readonly: true, fileMustExist: true });
  const folderStmt = lookupDb.prepare('SELECT spec_folder, title FROM memory_index WHERE id = ?');
  function resolveFolder(id) {
    const row = folderStmt.get(id);
    return row ? { folder: row.spec_folder, title: row.title } : { folder: null, title: null };
  }

  function setFlag(on) {
    process.env.SPECKIT_RETRIEVAL_CLASS_ROUTING = on ? 'true' : 'false';
  }

  // routeQuery channel set under the active flag state. Reports the retrieval class
  // and whether graph or degree are present, the suppression the flag drives.
  function channelsFor(query, on) {
    setFlag(on);
    const route = router.routeQuery(query);
    setFlag(false);
    return {
      tier: route.tier,
      retrievalClass: route.retrievalClass,
      channels: route.channels,
      hasGraph: route.channels.includes('graph'),
      hasDegree: route.channels.includes('degree'),
    };
  }

  // One executePipeline run under the active flag state, returning the ordered
  // result ids and their spec folders for the top of the set.
  async function runPipeline(query, embedding, on) {
    setFlag(on);
    const result = await pipeline.executePipeline(buildPipelineConfig(query, embedding));
    setFlag(false);
    const ids = result.results.map((row) => Number(row.id));
    const folders = result.results.map((row) => resolveFolder(Number(row.id)).folder);
    return { ids, folders, resultCount: result.results.length };
  }

  // ── single-hop precision@1 ──────────────────────────────────────
  const singleHopRows = [];
  for (const q of SINGLE_HOP_QUERIES) {
    const embedding = await vectorIndex.generateQueryEmbedding(q.text);
    if (!embedding || embedding.length === 0) {
      throw new Error(`Embedding failed for query "${q.text}"; cannot run a faithful benchmark`);
    }

    const chOff = channelsFor(q.text, false);
    const chOn = channelsFor(q.text, true);
    const off = await runPipeline(q.text, embedding, false);
    const on = await runPipeline(q.text, embedding, true);

    const offTopFolder = off.folders[0] ?? null;
    const onTopFolder = on.folders[0] ?? null;
    const offCorrect = folderMatches(offTopFolder, q.targetFolders);
    const onCorrect = folderMatches(onTopFolder, q.targetFolders);

    const topKOff = off.ids.slice(0, RECALL_K);
    const topKOn = on.ids.slice(0, RECALL_K);

    singleHopRows.push({
      id: q.id,
      text: q.text,
      targetFolders: q.targetFolders,
      retrievalClass: chOff.retrievalClass,
      tier: chOff.tier,
      channelsOff: chOff.channels,
      channelsOn: chOn.channels,
      graphSuppressedByFlag: chOff.hasGraph && !chOn.hasGraph,
      degreeSuppressedByFlag: chOff.hasDegree && !chOn.hasDegree,
      rank1IdOff: off.ids[0] ?? null,
      rank1IdOn: on.ids[0] ?? null,
      rank1FolderOff: offTopFolder,
      rank1FolderOn: onTopFolder,
      precision1Off: offCorrect ? 1 : 0,
      precision1On: onCorrect ? 1 : 0,
      rank1Changed: (off.ids[0] ?? null) !== (on.ids[0] ?? null),
      topKChanged: JSON.stringify(topKOff) !== JSON.stringify(topKOn),
      resultCountOff: off.resultCount,
      resultCountOn: on.resultCount,
    });
  }

  // ── multi-hop recall@K ──────────────────────────────────────────
  const multiHopRows = [];
  for (const q of MULTI_HOP_QUERIES) {
    const embedding = await vectorIndex.generateQueryEmbedding(q.text);
    if (!embedding || embedding.length === 0) {
      throw new Error(`Embedding failed for query "${q.text}"; cannot run a faithful benchmark`);
    }

    const chOff = channelsFor(q.text, false);
    const chOn = channelsFor(q.text, true);
    const off = await runPipeline(q.text, embedding, false);
    const on = await runPipeline(q.text, embedding, true);

    function recallAtK(folders) {
      const window = folders.slice(0, RECALL_K);
      const hit = q.relevantFolders.filter((target) =>
        window.some((folder) => folderMatches(folder, [target]))).length;
      return q.relevantFolders.length > 0 ? hit / q.relevantFolders.length : null;
    }

    const topKOff = off.ids.slice(0, RECALL_K);
    const topKOn = on.ids.slice(0, RECALL_K);

    multiHopRows.push({
      id: q.id,
      text: q.text,
      relevantFolders: q.relevantFolders,
      retrievalClass: chOff.retrievalClass,
      tier: chOff.tier,
      channelsOff: chOff.channels,
      channelsOn: chOn.channels,
      channelsIdentical: JSON.stringify(chOff.channels) === JSON.stringify(chOn.channels),
      recallKOff: fmt(recallAtK(off.folders)),
      recallKOn: fmt(recallAtK(on.folders)),
      topKChanged: JSON.stringify(topKOff) !== JSON.stringify(topKOn),
      topKIdentical: JSON.stringify(topKOff) === JSON.stringify(topKOn),
      resultCountOff: off.resultCount,
      resultCountOn: on.resultCount,
    });
  }

  // ── aggregates ──────────────────────────────────────────────────
  function mean(values) {
    const finite = values.filter((v) => typeof v === 'number' && Number.isFinite(v));
    return finite.length === 0 ? null : finite.reduce((a, b) => a + b, 0) / finite.length;
  }

  const singleHopPrecisionOff = mean(singleHopRows.map((r) => r.precision1Off));
  const singleHopPrecisionOn = mean(singleHopRows.map((r) => r.precision1On));
  const multiHopRecallOff = mean(multiHopRows.map((r) => r.recallKOff));
  const multiHopRecallOn = mean(multiHopRows.map((r) => r.recallKOn));

  // Default-off byte-identity on the production path: every multi-hop row must keep
  // an identical channel set and an identical top-K between OFF and ON, since a
  // multi-hop query is never classified single-hop. A failure here means the flag
  // touched a query it must not.
  const multiHopAllChannelsIdentical = multiHopRows.every((r) => r.channelsIdentical);
  const multiHopAllTopKIdentical = multiHopRows.every((r) => r.topKIdentical);

  // The subset of single-hop queries where the flag actually suppressed a channel.
  // Outside this subset the OFF and ON results are equal, which is itself the
  // off-equals-baseline evidence on the single-hop side.
  const singleHopSuppressedIds = singleHopRows
    .filter((r) => r.graphSuppressedByFlag || r.degreeSuppressedByFlag)
    .map((r) => r.id);
  const singleHopRank1ChangedIds = singleHopRows.filter((r) => r.rank1Changed).map((r) => r.id);
  const singleHopTopKChangedIds = singleHopRows.filter((r) => r.topKChanged).map((r) => r.id);

  const output = {
    generatedFrom: 'retrieval-class-routing-benchmark.mjs',
    generatedAt: new Date().toISOString(),
    subject: 'Retrieval-class channel suppression (SPECKIT_RETRIEVAL_CLASS_ROUTING) OFF vs ON on the production path',
    sourceDbPath: evalDatabase.sourceDbPath,
    evalDbPath: evalDatabase.dbPath,
    evalShardPath: evalDatabase.evalShardPath,
    activeEmbedder: evalDatabase.activeEmbedder,
    pipelineLimit: PIPELINE_LIMIT,
    precisionK: PRECISION_K,
    recallK: RECALL_K,
    pathSource:
      'executePipeline under shipped default flags, with only SPECKIT_RETRIEVAL_CLASS_ROUTING toggled OFF then ON per query.',
    channelSource:
      'routeQuery channel set per query under each flag state, the production routing decision Stage 1 consumes.',
    precisionRule:
      'single-hop precision@1 = the rank-1 result spec folder is one of the labeled target folders (startsWith match).',
    recallRule:
      'multi-hop recall@K = the fraction of labeled relevant folders present in the top-K result set (startsWith match).',
    byteIdentityRule:
      'with the flag OFF the routing and the top-K equal the pre-flag baseline; multi-hop queries are never single-hop so their channel set and top-K must be identical OFF vs ON.',
    notes: [
      'The five-class classifier runs always-on. The flag gates only the SingleHop graph and degree suppression.',
      'A single-hop query that already routes without graph sees no flag effect; the effect is on single-hop queries where graph was otherwise preserved.',
      'A multi-hop query is classified MultiHop or Neutral, never SingleHop, so the suppression short-circuit never fires for it.',
    ],
    summary: {
      singleHopCount: singleHopRows.length,
      multiHopCount: multiHopRows.length,
      singleHopPrecision1Off: fmt(singleHopPrecisionOff),
      singleHopPrecision1On: fmt(singleHopPrecisionOn),
      singleHopPrecision1Delta: fmt(
        singleHopPrecisionOn !== null && singleHopPrecisionOff !== null
          ? singleHopPrecisionOn - singleHopPrecisionOff
          : null,
      ),
      multiHopRecallKOff: fmt(multiHopRecallOff),
      multiHopRecallKOn: fmt(multiHopRecallOn),
      multiHopRecallKDelta: fmt(
        multiHopRecallOn !== null && multiHopRecallOff !== null
          ? multiHopRecallOn - multiHopRecallOff
          : null,
      ),
      singleHopChannelSuppressedIds: singleHopSuppressedIds,
      singleHopRank1ChangedIds,
      singleHopTopKChangedIds,
      multiHopAllChannelsIdentical,
      multiHopAllTopKIdentical,
    },
    singleHop: singleHopRows,
    multiHop: multiHopRows,
  };

  fs.mkdirSync(RESULTS_DIR, { recursive: true });
  const outPath = path.join(RESULTS_DIR, 'metrics.json');
  fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`);

  lookupDb.close();

  // Best-effort cleanup of the temporary eval copy.
  try {
    fs.rmSync(evalDatabase.evalRoot, { recursive: true, force: true });
  } catch { /* best-effort */ }

  // Compact console summary for the operator.
  const consoleSummary = {
    metricsPath: outPath,
    activeEmbedder: evalDatabase.activeEmbedder.name,
    singleHop: {
      precision1Off: output.summary.singleHopPrecision1Off,
      precision1On: output.summary.singleHopPrecision1On,
      delta: output.summary.singleHopPrecision1Delta,
      channelSuppressedIds: singleHopSuppressedIds,
      rank1ChangedIds: singleHopRank1ChangedIds,
      topKChangedIds: singleHopTopKChangedIds,
    },
    multiHop: {
      recallKOff: output.summary.multiHopRecallKOff,
      recallKOn: output.summary.multiHopRecallKOn,
      delta: output.summary.multiHopRecallKDelta,
      allChannelsIdentical: multiHopAllChannelsIdentical,
      allTopKIdentical: multiHopAllTopKIdentical,
    },
  };
  process.stdout.write(`${JSON.stringify(consoleSummary, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
