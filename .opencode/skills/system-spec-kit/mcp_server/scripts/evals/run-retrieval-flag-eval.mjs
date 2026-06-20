#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import Database from 'better-sqlite3';

const SOURCE_DB_PATH = path.resolve(process.env.MEMORY_DB_PATH ?? 'database/context-index.sqlite');
const OUTPUT_PATH = path.resolve(process.env.SPECKIT_RETRIEVAL_EVAL_OUTPUT ?? '/tmp/speckit-retrieval-flag-eval.json');
const RECALL_K = Number.parseInt(process.env.SPECKIT_RETRIEVAL_EVAL_K ?? '20', 10);
// nDCG cutoff is intentionally tighter than RECALL_K: Recall@20 is order-insensitive
// within the top-20, so displacement and tie-break effects are invisible to it but
// visible to nDCG@10 (rank-discounted) and MRR (first-relevant rank). Those are the
// two metrics that make tie-breaker and class-conditional flags evaluable.
const NDCG_K = Number.parseInt(process.env.SPECKIT_RETRIEVAL_EVAL_NDCG_K ?? '10', 10);
// MRR reads the first relevant hit's rank across the full retrieved window, so it
// shares the recall cutoff rather than the tighter nDCG cutoff.
const MRR_K = RECALL_K;

// The class dimensions the eval splits on, and the full set of class values each
// dimension can take. The value lists mirror the IntentType / ComplexityTier /
// QueryCategory unions in lib/eval/ground-truth-data.ts; any class enumerated here
// but absent from the loaded golden set is reported as a coverage gap so the
// fixture-authoring follow-up can be scoped without guessing.
const CLASS_DIMENSIONS = Object.freeze({
  category: Object.freeze([
    'factual',
    'temporal',
    'graph_relationship',
    'cross_document',
    'hard_negative',
    'anchor_based',
    'scope_filtered',
  ]),
  complexityTier: Object.freeze(['simple', 'moderate', 'complex']),
  intentType: Object.freeze([
    'add_feature',
    'fix_bug',
    'refactor',
    'security_audit',
    'understand',
    'find_spec',
    'find_decision',
  ]),
});

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

// Mean recall + nDCG@10 + MRR over a query subset. The subset is whatever caller
// passes in `queries`: the full golden set for the overall mean, or one class slice
// for a grouped row. Queries with no ground truth are skipped (same contract the
// recall-only predecessor used), so `evaluatedQueries` is the per-metric denominator
// and is what the reconciliation check weights by.
function computeMeanMetrics(queries, relevancesByQuery, resultMap, metrics) {
  const recalls = [];
  const ndcgs = [];
  const mrrs = [];
  for (const query of queries) {
    const groundTruth = relevancesByQuery.get(query.id) ?? [];
    if (groundTruth.length === 0) continue;
    const results = resultMap.get(query.id) ?? [];
    recalls.push(metrics.computeRecall(results, groundTruth, RECALL_K));
    ndcgs.push(metrics.computeNDCG(results, groundTruth, NDCG_K));
    mrrs.push(metrics.computeMRR(results, groundTruth, MRR_K));
  }
  const mean = (values) => (values.length === 0
    ? 0
    : values.reduce((sum, value) => sum + value, 0) / values.length);
  return {
    recall: mean(recalls),
    ndcg: mean(ndcgs),
    mrr: mean(mrrs),
    evaluatedQueries: recalls.length,
  };
}

// Bucket the golden queries by each class dimension. Returns a Map keyed by
// dimension name → Map(classValue → query[]), preserving only the queries that are
// actually present so a slice with zero queries is simply absent from the output.
function groupQueriesByClass(queries) {
  const byDimension = new Map();
  for (const dimension of Object.keys(CLASS_DIMENSIONS)) {
    const byClass = new Map();
    for (const query of queries) {
      const value = query[dimension];
      if (value === undefined || value === null) continue;
      if (!byClass.has(value)) byClass.set(value, []);
      byClass.get(value).push(query);
    }
    byDimension.set(dimension, byClass);
  }
  return byDimension;
}

// Report which enumerated class values never appear in the loaded golden set. This
// is the scoping signal for the separate fixture-authoring task — it does NOT author
// fixtures, it only names the gaps.
function findMissingClasses(queries) {
  const missing = {};
  for (const [dimension, allValues] of Object.entries(CLASS_DIMENSIONS)) {
    const present = new Set(queries.map((query) => query[dimension]));
    const absent = allValues.filter((value) => !present.has(value));
    if (absent.length > 0) missing[dimension] = absent;
  }
  return missing;
}

// Non-lossy invariant: the per-class n-weighted average of Recall@20 must reconcile
// to the overall mean. Every query lands in exactly one class per dimension, so for
// any single dimension the weighted average of its slices equals the overall mean.
// A mismatch means a query was dropped, double-counted, or misbucketed — a defect in
// the grouping, not a tolerable rounding artifact. Tolerance covers float summation
// order only.
function reconcileWeightedRecall(overall, groupedByDimension, tolerance = 1e-9) {
  const checks = [];
  for (const [dimension, groups] of Object.entries(groupedByDimension)) {
    let weightedSum = 0;
    let totalN = 0;
    for (const group of groups) {
      weightedSum += group.recall * group.n;
      totalN += group.n;
    }
    const weightedMean = totalN === 0 ? 0 : weightedSum / totalN;
    const diff = Math.abs(weightedMean - overall.recall);
    checks.push({
      dimension,
      weightedMeanRecall: formatNumber(weightedMean),
      overallMeanRecall: formatNumber(overall.recall),
      groupedQueryCount: totalN,
      overallEvaluatedQueries: overall.evaluatedQueries,
      diff: formatNumber(diff),
      reconciled: diff <= tolerance && totalN === overall.evaluatedQueries,
    });
  }
  return checks;
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
  const classGroups = groupQueriesByClass(queries);
  const missingClasses = findMissingClasses(queries);
  const originalEnv = Object.fromEntries([...RUNTIME_FLAG_ENVS].map((name) => [name, process.env[name]]));
  const flagRows = [];

  // A grouped variant carries the overall mean plus, for each class dimension, a map
  // of class value → per-slice metrics. The off/on result maps are searched once per
  // variant and re-sliced per dimension, so grouping adds no extra retrieval cost.
  const evaluateVariant = (resultMap) => {
    const overall = computeMeanMetrics(queries, relevancesByQuery, resultMap, evalMetrics);
    const groups = {};
    for (const [dimension, byClass] of classGroups) {
      groups[dimension] = {};
      for (const [classValue, classQueries] of byClass) {
        groups[dimension][classValue] = computeMeanMetrics(
          classQueries,
          relevancesByQuery,
          resultMap,
          evalMetrics,
        );
      }
    }
    return { overall, groups };
  };

  for (const flag of FLAG_SPECS) {
    if (!flag.runSearch) {
      flagRows.push({
        flag: flag.label,
        env: flag.env,
        recallOff: null,
        recallOn: null,
        recallDelta: null,
        ndcgOff: null,
        ndcgOn: null,
        ndcgDelta: null,
        mrrOff: null,
        mrrOn: null,
        mrrDelta: null,
        byClass: null,
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
      return evaluateVariant(resultMap);
    };

    const off = await runVariant(false);
    const on = await runVariant(true);

    // Per-class rows pair each off slice with its on slice. A class present in only
    // one variant cannot happen here (the golden set is fixed across variants), but
    // we read membership from `off` defensively and fall back to a zeroed slice.
    const byClass = {};
    for (const dimension of Object.keys(CLASS_DIMENSIONS)) {
      const offDim = off.groups[dimension] ?? {};
      const onDim = on.groups[dimension] ?? {};
      const classValues = new Set([...Object.keys(offDim), ...Object.keys(onDim)]);
      const rows = {};
      for (const classValue of classValues) {
        const offSlice = offDim[classValue] ?? { recall: 0, ndcg: 0, mrr: 0, evaluatedQueries: 0 };
        const onSlice = onDim[classValue] ?? { recall: 0, ndcg: 0, mrr: 0, evaluatedQueries: 0 };
        rows[classValue] = {
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
      byClass[dimension] = rows;
    }

    // Non-lossy invariant: every query lands in exactly one class per dimension, so
    // the n-weighted average of each dimension's per-class Recall@20 must equal the
    // overall mean. Reconcile against the RAW per-slice recalls (off.groups), not the
    // formatNumber-rounded display values — weighting rounded slices would reintroduce
    // up to ~5e-7 of rounding error and spuriously trip a real partition.
    const reconciliationByDimension = Object.fromEntries(
      Object.entries(off.groups).map(([dimension, slices]) => [
        dimension,
        Object.values(slices).map((slice) => ({
          recall: slice.recall,
          n: slice.evaluatedQueries,
        })),
      ]),
    );
    const reconciliation = reconcileWeightedRecall(off.overall, reconciliationByDimension);
    const unreconciled = reconciliation.filter((check) => !check.reconciled);
    if (unreconciled.length > 0) {
      const detail = unreconciled
        .map((check) => `${check.dimension} (weighted=${check.weightedMeanRecall}, overall=${check.overallMeanRecall}, n=${check.groupedQueryCount}/${check.overallEvaluatedQueries})`)
        .join('; ');
      throw new Error(
        `Per-class recall reconciliation failed for flag ${flag.label}: ${detail}. `
        + 'The grouped slices do not partition the golden set; refusing to report lossy results.',
      );
    }

    flagRows.push({
      flag: flag.label,
      env: flag.env,
      recallOff: formatNumber(off.overall.recall),
      recallOn: formatNumber(on.overall.recall),
      recallDelta: formatNumber(on.overall.recall - off.overall.recall),
      ndcgOff: formatNumber(off.overall.ndcg),
      ndcgOn: formatNumber(on.overall.ndcg),
      ndcgDelta: formatNumber(on.overall.ndcg - off.overall.ndcg),
      mrrOff: formatNumber(off.overall.mrr),
      mrrOn: formatNumber(on.overall.mrr),
      mrrDelta: formatNumber(on.overall.mrr - off.overall.mrr),
      byClass,
      reconciliation,
      note: `${flag.note} Evaluated queries: off=${off.overall.evaluatedQueries}, on=${on.overall.evaluatedQueries}.`,
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
    ndcgK: NDCG_K,
    mrrK: MRR_K,
    alignment,
    queryCount: queries.length,
    relevanceCount: groundTruth.GROUND_TRUTH_RELEVANCES.length,
    // Per-dimension class membership of the loaded golden set, and which enumerated
    // classes never appear. The empty-or-absent entries in missingClasses scope the
    // separate fixture-authoring task (e.g. thematic/understand, graph_relationship,
    // cross_document) — this driver reports the gap, it does not author fixtures.
    classDistribution: Object.fromEntries(
      [...classGroups].map(([dimension, byClass]) => [
        dimension,
        Object.fromEntries([...byClass].map(([value, qs]) => [value, qs.length])),
      ]),
    ),
    missingClasses,
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
