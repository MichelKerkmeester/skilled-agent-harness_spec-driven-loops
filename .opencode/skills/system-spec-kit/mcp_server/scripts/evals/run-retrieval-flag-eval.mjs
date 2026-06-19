#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import Database from 'better-sqlite3';

const SOURCE_DB_PATH = path.resolve(process.env.MEMORY_DB_PATH ?? 'database/context-index.sqlite');
const OUTPUT_PATH = path.resolve(process.env.SPECKIT_RETRIEVAL_EVAL_OUTPUT ?? '/tmp/speckit-retrieval-flag-eval.json');
const RECALL_K = Number.parseInt(process.env.SPECKIT_RETRIEVAL_EVAL_K ?? '20', 10);

const FLAG_SPECS = [
  {
    label: 'bitemporal_recall',
    env: 'SPECKIT_BITEMPORAL_RECALL',
    currentDefault: 'off',
    runSearch: false,
    note: 'Not exercised by hybridSearchEnhanced; consumed by temporal edge recall paths outside this driver.',
  },
  {
    label: 'agentic_recall',
    env: 'SPECKIT_AGENTIC_RECALL',
    currentDefault: 'off',
    runSearch: false,
    note: 'Not exercised by hybridSearchEnhanced; gates memory_context agentic recall.',
  },
  {
    label: 'edge_presence_currentness',
    env: 'SPECKIT_EDGE_PRESENCE_CURRENTNESS',
    currentDefault: 'off',
    runSearch: false,
    note: 'Not exercised by hybridSearchEnhanced; gates temporal edge reconciliation.',
  },
  {
    label: 'summary_fusion_lane',
    env: 'SPECKIT_SUMMARY_FUSION_LANE',
    currentDefault: 'off',
    runSearch: true,
    note: 'Runtime-togglable summary/community lane in hybridSearchEnhanced.',
  },
  {
    label: 'cosine_topn_reorder',
    env: 'SPECKIT_COSINE_TOPN_REORDER',
    currentDefault: 'on',
    runSearch: false,
    note: 'Current default is ON; not measured as Recall@20 because the production code intentionally skips this post-budget reorder in evaluationMode, while normal mode token-budget truncates below K=20.',
  },
  {
    label: 'confidence_calibration',
    env: 'SPECKIT_CONFIDENCE_CALIBRATION',
    currentDefault: 'off',
    runSearch: false,
    note: 'Not a ranking flag in this path; also requires SPECKIT_CONFIDENCE_CALIBRATION_MODEL.',
  },
  {
    label: 'absolute_relevance_calibration',
    env: 'SPECKIT_ABSOLUTE_RELEVANCE_CALIBRATION',
    currentDefault: 'on',
    runSearch: false,
    note: 'Current default is ON; affects confidence/display calibration, not Recall@20 ordering.',
  },
  {
    label: 'cardinality_penalty',
    env: 'SPECKIT_CARDINALITY_PENALTY',
    currentDefault: 'off',
    runSearch: true,
    note: 'Runtime-togglable degree-channel damping.',
  },
  {
    label: 'world_summary_prelude',
    env: 'SPECKIT_WORLD_SUMMARY_PRELUDE',
    currentDefault: 'off',
    runSearch: false,
    note: 'Not exercised by hybridSearchEnhanced; consumed by memory_context response assembly.',
  },
  {
    label: 'derived_id_provenance',
    env: 'SPECKIT_DERIVED_ID_PROVENANCE',
    currentDefault: 'off',
    runSearch: false,
    note: 'Write-time/schema provenance flag; no Recall@20 ranking consumer in hybridSearchEnhanced.',
  },
  {
    label: 'retention_forgetting',
    env: 'SPECKIT_RETENTION_FORGETTING_V1',
    currentDefault: 'off',
    runSearch: false,
    note: 'Retention safety layer; not a query-time ranking consumer.',
  },
  {
    label: 'semantic_edge_layer',
    env: 'SPECKIT_SEMANTIC_EDGE_LAYER',
    currentDefault: 'off',
    runSearch: false,
    note: 'Semantic edge substrate flag; no live hybridSearchEnhanced consumer in this build.',
  },
  {
    label: 'edge_vector_index',
    env: 'SPECKIT_EDGE_VECTOR_INDEX',
    currentDefault: 'off',
    runSearch: false,
    note: 'Semantic edge side-channel flag; no live hybridSearchEnhanced consumer in this build.',
  },
  {
    label: 'edge_triplet_search',
    env: 'SPECKIT_EDGE_TRIPLET_SEARCH',
    currentDefault: 'off',
    runSearch: false,
    note: 'Semantic edge scoring primitive; no live hybridSearchEnhanced consumer in this build.',
  },
  {
    label: 'edge_semantic_dedup',
    env: 'SPECKIT_EDGE_SEMANTIC_DEDUP',
    currentDefault: 'off',
    runSearch: false,
    note: 'Semantic edge maintenance flag; not a query-time ranking consumer.',
  },
  {
    label: 'edge_semantic_invalidation',
    env: 'SPECKIT_EDGE_SEMANTIC_INVALIDATION',
    currentDefault: 'off',
    runSearch: false,
    note: 'Semantic edge maintenance flag; not a query-time ranking consumer.',
  },
  {
    label: 'procedural_outcome_emitter',
    env: 'SPECKIT_PROCEDURAL_OUTCOME_EMITTER',
    currentDefault: 'off',
    runSearch: false,
    note: 'Feedback emission path; not a query-time ranking consumer.',
  },
  {
    label: 'procedural_reliability_recall',
    env: 'SPECKIT_PROCEDURAL_RELIABILITY_RECALL',
    currentDefault: 'off',
    runSearch: false,
    note: 'No live hybridSearchEnhanced ranking consumer in this build.',
  },
  {
    label: 'sleeptime_consolidation',
    env: 'SPECKIT_SLEEPTIME_CONSOLIDATION',
    currentDefault: 'off',
    runSearch: false,
    note: 'Off-turn consolidation shadow flag; not a query-time ranking consumer.',
  },
  {
    label: 'sleeptime_live_write',
    env: 'SPECKIT_SLEEPTIME_LIVE_WRITE',
    currentDefault: 'off',
    runSearch: false,
    note: 'Off-turn live write flag; not a query-time ranking consumer.',
  },
];

const RUNTIME_FLAG_ENVS = new Set(FLAG_SPECS.map((flag) => flag.env));

// Channels whose lane runs unconditionally inside hybridSearchEnhanced and cannot
// be turned off through its public options. The trigger lane (exactTriggerSearch)
// matches the raw query against the stored trigger_phrases column and ignores the
// triggerPhrases option entirely, so an "ablated" trigger pass is byte-identical
// to baseline. Sweeping it only manufactures a zero-signal, identical-by-
// construction delta, so it is excluded from the channel ablation.
export const UNABLATABLE_CHANNELS = Object.freeze(['trigger']);

// Per-flag deltas must reflect the production default routing path. Letting
// routeQuery() pick the channel subset (instead of forcing every channel active)
// is what makes a degree- or summary-only flag measurable on a path that actually
// carries that lane the way production does. forceAllChannels is therefore NOT set
// here; per-query overrides (e.g. evaluationMode) are layered on last.
export function buildPerFlagSearchOptions(recallK, overrides = {}) {
  return {
    limit: recallK,
    useVector: true,
    useBm25: true,
    useFts: true,
    useGraph: true,
    includeContent: false,
    ...overrides,
  };
}

// The channel sweep is the opposite case: it needs every routable lane active as a
// common baseline so each single-channel removal isolates that lane's marginal
// contribution. forceAllChannels stays true here by design. No triggerPhrases lever
// is passed because it is a no-op against the trigger lane (see UNABLATABLE_CHANNELS).
export function buildChannelAblationOptions(channelFlags, recallK) {
  return {
    limit: recallK,
    useVector: channelFlags.useVector,
    useBm25: channelFlags.useBm25,
    useFts: channelFlags.useFts,
    useGraph: channelFlags.useGraph,
    forceAllChannels: true,
    evaluationMode: true,
    includeContent: false,
  };
}

// Drop lanes that cannot be genuinely disabled so the channel report never carries
// an identical-by-construction row.
export function selectAblationChannels(allChannels) {
  return allChannels.filter((channel) => !UNABLATABLE_CHANNELS.includes(channel));
}

function moduleUrl(relativePath) {
  return pathToFileURL(path.resolve(relativePath)).href;
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

async function prepareEvalDatabase(sourceDbPath) {
  const evalRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-retrieval-eval-'));
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

function computeMeanRecall(queries, relevancesByQuery, resultMap, computeRecall) {
  const recalls = [];
  for (const query of queries) {
    const groundTruth = relevancesByQuery.get(query.id) ?? [];
    if (groundTruth.length === 0) continue;
    recalls.push(computeRecall(resultMap.get(query.id) ?? [], groundTruth, RECALL_K));
  }
  return recalls.length === 0
    ? { recall: 0, evaluatedQueries: 0 }
    : {
      recall: recalls.reduce((sum, value) => sum + value, 0) / recalls.length,
      evaluatedQueries: recalls.length,
    };
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
    ablation,
    groundTruth,
    evalMetrics,
  ] = await Promise.all([
    import(moduleUrl('dist/lib/search/vector-index.js')),
    import(moduleUrl('dist/lib/search/hybrid-search.js')),
    import(moduleUrl('dist/lib/search/graph-search-fn.js')),
    import(moduleUrl('dist/lib/providers/embeddings.js')),
    import(moduleUrl('dist/lib/eval/ablation-framework.js')),
    import(moduleUrl('dist/lib/eval/ground-truth-data.js')),
    import(moduleUrl('dist/lib/eval/eval-metrics.js')),
  ]);

  const db = vectorIndex.initializeDb(evalDatabase.dbPath, { skipRestoreRecovery: true });
  const graphSearchFn = graphSearch.createUnifiedGraphSearchFn(db);
  hybridSearch.init(db, vectorIndex.vectorSearch, graphSearchFn);

  const alignment = ablation.assertGroundTruthAlignment(db, {
    dbPath: evalDatabase.dbPath,
    context: 'retrieval eval driver',
  });

  const embeddingCache = new Map();
  async function getEmbedding(query) {
    if (embeddingCache.has(query)) return embeddingCache.get(query);
    try {
      const embedding = await embeddings.generateQueryEmbedding(query);
      embeddingCache.set(query, embedding);
      return embedding;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[retrieval-eval] Query embedding failed, continuing without vector lane: ${message}`);
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

  const channelSearchFn = async (query, disabledChannels) => {
    const channelFlags = ablation.toHybridSearchFlags(disabledChannels);
    const embedding = await getEmbedding(query);
    const rows = await hybridSearch.hybridSearchEnhanced(
      query,
      embedding,
      buildChannelAblationOptions(channelFlags, RECALL_K),
    );
    return normalizeSearchResults(rows);
  };

  const channelReport = await ablation.runAblation(channelSearchFn, {
    channels: selectAblationChannels(ablation.ALL_CHANNELS),
    recallK: RECALL_K,
    alignmentDb: db,
    alignmentDbPath: evalDatabase.dbPath,
    alignmentContext: 'retrieval eval driver',
    includeDiagnosticSnapshots: true,
  });

  if (!channelReport) {
    throw new Error('Channel ablation did not produce a report.');
  }

  const queries = groundTruth.GROUND_TRUTH_QUERIES;
  const relevancesByQuery = groupGroundTruth(groundTruth.GROUND_TRUTH_RELEVANCES);
  const originalEnv = Object.fromEntries([...RUNTIME_FLAG_ENVS].map((name) => [name, process.env[name]]));
  const flagRows = [];

  for (const flag of FLAG_SPECS) {
    if (!flag.runSearch) {
      flagRows.push({
        flag: flag.label,
        env: flag.env,
        recallOff: null,
        recallOn: null,
        delta: null,
        note: `untestable: ${flag.note}`,
        currentDefault: flag.currentDefault,
      });
      continue;
    }

    const runVariant = async (enabled) => {
      restoreEnv(originalEnv);
      forceFlag(flag, enabled);
      graphSearch.clearDegreeCacheForDb(db);
      const resultMap = new Map();
      for (const query of queries) {
        resultMap.set(query.id, await search(query.query, { evaluationMode: true }));
      }
      return computeMeanRecall(queries, relevancesByQuery, resultMap, evalMetrics.computeRecall);
    };

    const off = await runVariant(false);
    const on = await runVariant(true);
    const delta = on.recall - off.recall;
    flagRows.push({
      flag: flag.label,
      env: flag.env,
      recallOff: formatNumber(off.recall),
      recallOn: formatNumber(on.recall),
      delta: formatNumber(delta),
      note: `${flag.note} Evaluated queries: off=${off.evaluatedQueries}, on=${on.evaluatedQueries}.`,
      currentDefault: flag.currentDefault,
    });
  }

  restoreEnv(originalEnv);

  const output = {
    generatedAt: new Date().toISOString(),
    sourceDbPath: SOURCE_DB_PATH,
    dbPath: evalDatabase.dbPath,
    sourceShardPath: evalDatabase.sourceShardPath,
    evalShardPath: evalDatabase.evalShardPath,
    recallK: RECALL_K,
    alignment,
    queryCount: queries.length,
    relevanceCount: groundTruth.GROUND_TRUTH_RELEVANCES.length,
    channelAblation: {
      baselineRecall: formatNumber(channelReport.overallBaselineRecall),
      evaluatedQueryCount: channelReport.evaluatedQueryCount ?? null,
      durationMs: channelReport.durationMs,
      results: channelReport.results.map((row) => ({
        channel: row.channel,
        baseline: formatNumber(row.baselineRecall20),
        ablated: formatNumber(row.ablatedRecall20),
        delta: formatNumber(row.delta),
        pValue: formatNumber(row.pValue),
        helped: row.queriesChannelHelped,
        hurt: row.queriesChannelHurt,
        unchanged: row.queriesUnchanged,
        queryCount: row.queryCount,
      })),
      failures: channelReport.channelFailures ?? [],
    },
    flags: flagRows,
  };

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);
  console.log(JSON.stringify(output, null, 2));
}

// Only run the benchmark when invoked as a CLI; importing the module (e.g. from a
// test that exercises the option builders) must not execute the full eval.
const invokedDirectly = Boolean(process.argv[1])
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.stack : String(error));
    process.exitCode = 1;
  });
}
