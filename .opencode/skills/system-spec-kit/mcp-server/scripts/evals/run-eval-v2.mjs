#!/usr/bin/env node

// ── eval-v2: the TRACK B measurability gate ─────────────────────────────────
//
// The known-item Recall@20 driver (run-retrieval-flag-eval.mjs) saturates: every
// query has a single target that almost always lands somewhere in a 20-wide
// window, so a genuine recall win and pure noise read the same. That saturation
// is what hid the deleted features' true behavior — an eval that cannot move
// cannot tell you a feature helped. eval-v2 closes that blind spot two ways:
//
//   1. completeRecall@K at TIGHT cutoffs (3/5/8) over MULTI-TARGET gold sets.
//      A query that must surface a whole sibling/cause/chain set high up has
//      something to be incomplete about; the saturated single-target set does not.
//
//   2. DUAL-MODE reporting. Each query is retrieved twice on the SAME copy DB:
//        - eval path:  evaluationMode + forceAllChannels — every lane forced on,
//          no token-budget truncation. This is the lens the saturated eval used.
//        - prod path:  the production default route — routeQuery() picks the
//          channel subset and token-budget truncation is active (the exact
//          option shape run-context-recall-eval.mjs documents).
//      The eval-vs-prod delta is reported as a first-class FIDELITY metric: a
//      large positive delta means the eval lens flatters the production path,
//      i.e. a win the eval "sees" that production never delivers. That gap is
//      precisely the saturation that let deleted features look fine.
//
// The DB is opened read-only via a tempdir backup; this driver never mutates the
// live DB. It follows the same copy-first discipline as the sibling drivers.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import Database from 'better-sqlite3';

const SOURCE_DB_PATH = path.resolve(process.env.MEMORY_DB_PATH ?? 'database/context-index.sqlite');
const OUTPUT_PATH = path.resolve(
  process.env.SPECKIT_EVAL_V2_OUTPUT ?? '/tmp/speckit-eval-v2.json',
);

// Tight completeRecall cutoffs. Deliberately well below the known-item K=20: a
// gain that only survives a tight window is the gain saturation hides.
const COMPLETE_RECALL_KS = parseKList(process.env.SPECKIT_EVAL_V2_KS ?? '3,5,8');
// Retrieval window. Wide enough that the prod path is truncation-limited (not
// window-limited) and the eval path can carry a full multi-target gold set.
const SEARCH_LIMIT = Number.parseInt(process.env.SPECKIT_EVAL_V2_LIMIT ?? '20', 10);

// The multi-target measurability classes this gate exists for. A class enumerated
// here but absent from the loaded golden set is reported as a coverage gap rather
// than silently producing an empty row.
const MEASURABILITY_CLASSES = Object.freeze([
  'thematic_multi_target',
  'causal_chain',
  'hard_negative',
]);

function parseKList(raw) {
  return raw
    .split(',')
    .map((token) => Number.parseInt(token.trim(), 10))
    .filter((value) => Number.isInteger(value) && value > 0);
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
  const evalRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-eval-v2-'));
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
  return { evalRoot, dbPath: evalDbPath, sourceShardPath, evalShardPath, activeEmbedder };
}

function moduleUrl(relativePath) {
  return pathToFileURL(path.resolve(relativePath)).href;
}

function formatNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? Number(value.toFixed(6)) : null;
}

function normalizeSearchResults(rows) {
  return rows
    .map((row, index) => ({
      memoryId: Number(row.parentMemoryId ?? row.parent_id ?? row.parentId ?? row.id),
      score: typeof row.score === 'number' && Number.isFinite(row.score) ? row.score : 0,
      rank: index + 1,
    }))
    .filter((row) => Number.isInteger(row.memoryId));
}

// The two retrieval lenses, built once and reused per query. Both run on the SAME
// copy DB; the only difference is the option shape, which is the whole point of
// the fidelity delta.
//
//   eval lens  — forceAllChannels + evaluationMode: every lane on, no token-budget
//                truncation. The flattering lens the saturated eval used.
//   prod lens  — production default route: forceAllChannels OFF (routeQuery picks
//                the channel subset) and truncation active because evaluationMode
//                is not set. The path users actually get.
function buildSearchLenses(hybridSearch, embeddings) {
  const embeddingCache = new Map();
  async function getEmbedding(query) {
    if (embeddingCache.has(query)) return embeddingCache.get(query);
    try {
      const embedding = await embeddings.generateQueryEmbedding(query);
      embeddingCache.set(query, embedding);
      return embedding;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[eval-v2] Query embedding failed, continuing without vector lane: ${message}`);
      embeddingCache.set(query, null);
      return null;
    }
  }

  async function evalLens(query) {
    const embedding = await getEmbedding(query);
    const rows = await hybridSearch.hybridSearchEnhanced(query, embedding, {
      limit: SEARCH_LIMIT,
      useVector: true,
      useBm25: true,
      useFts: true,
      useGraph: true,
      includeContent: false,
      forceAllChannels: true,
      evaluationMode: true,
    });
    return normalizeSearchResults(rows);
  }

  async function prodLens(query) {
    const embedding = await getEmbedding(query);
    const rows = await hybridSearch.hybridSearchEnhanced(query, embedding, {
      limit: SEARCH_LIMIT,
      useVector: true,
      useBm25: true,
      useFts: true,
      useGraph: true,
      includeContent: false,
      // forceAllChannels + evaluationMode intentionally omitted: this is the
      // production default route with token-budget truncation active.
    });
    return normalizeSearchResults(rows);
  }

  return { evalLens, prodLens };
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

// Mean completeRecall@K profile over a query subset, computed with the shared pure
// metric. Queries with no ground truth are skipped, so evaluatedQueries is the
// per-class denominator.
function meanCompleteRecallProfile(queries, relevancesByQuery, resultMap, metrics, ks) {
  const sums = Object.fromEntries(ks.map((k) => [k, 0]));
  let evaluated = 0;
  for (const query of queries) {
    const groundTruth = relevancesByQuery.get(query.id) ?? [];
    if (groundTruth.length === 0) continue;
    const results = resultMap.get(query.id) ?? [];
    const profile = metrics.computeCompleteRecallProfile(results, groundTruth, ks);
    for (const k of ks) sums[k] += profile[`completeRecallAt${k}`] ?? 0;
    evaluated += 1;
  }
  const mean = {};
  for (const k of ks) mean[`completeRecallAt${k}`] = evaluated === 0 ? 0 : sums[k] / evaluated;
  return { profile: mean, evaluatedQueries: evaluated };
}

function diffProfiles(evalProfile, prodProfile, ks) {
  const delta = {};
  for (const k of ks) {
    const key = `completeRecallAt${k}`;
    delta[key] = (evalProfile[key] ?? 0) - (prodProfile[key] ?? 0);
  }
  return delta;
}

function formatProfile(profile, ks) {
  const out = {};
  for (const k of ks) out[`completeRecallAt${k}`] = formatNumber(profile[`completeRecallAt${k}`] ?? 0);
  return out;
}

async function main() {
  if (COMPLETE_RECALL_KS.length === 0) {
    throw new Error('No valid completeRecall@K cutoffs configured.');
  }
  if (!Number.isInteger(SEARCH_LIMIT) || SEARCH_LIMIT <= 0) {
    throw new Error(`Invalid search limit: ${SEARCH_LIMIT}`);
  }

  const evalDatabase = await prepareEvalDatabase(SOURCE_DB_PATH);
  process.env.MEMORY_DB_PATH = evalDatabase.dbPath;
  process.env.SPECKIT_ABLATION = 'true';

  const [vectorIndex, hybridSearch, graphSearch, embeddings, groundTruth, evalMetrics] = await Promise.all([
    import(moduleUrl('dist/lib/search/vector-index.js')),
    import(moduleUrl('dist/lib/search/hybrid-search.js')),
    import(moduleUrl('dist/lib/search/graph-search-fn.js')),
    import(moduleUrl('dist/lib/providers/embeddings.js')),
    import(moduleUrl('dist/lib/eval/ground-truth-data.js')),
    import(moduleUrl('dist/lib/eval/eval-metrics.js')),
  ]);

  const db = vectorIndex.initializeDb(evalDatabase.dbPath, { skipRestoreRecovery: true });
  const graphSearchFn = graphSearch.createUnifiedGraphSearchFn(db);
  hybridSearch.init(db, vectorIndex.vectorSearch, graphSearchFn);

  const allQueries = groundTruth.GROUND_TRUTH_QUERIES;
  const relevancesByQuery = groupGroundTruth(groundTruth.GROUND_TRUTH_RELEVANCES);

  // Only the multi-target measurability classes participate in this gate; the
  // saturated known-item classes stay on the K=20 driver.
  const measurabilityQueries = allQueries.filter((q) => MEASURABILITY_CLASSES.includes(q.category));
  const presentClasses = new Set(measurabilityQueries.map((q) => q.category));
  const missingClasses = MEASURABILITY_CLASSES.filter((cls) => !presentClasses.has(cls));

  const { evalLens, prodLens } = buildSearchLenses(hybridSearch, embeddings);

  // Retrieve every measurability query once per lens on the shared copy DB.
  const evalResults = new Map();
  const prodResults = new Map();
  for (const query of measurabilityQueries) {
    evalResults.set(query.id, await evalLens(query.query));
    prodResults.set(query.id, await prodLens(query.query));
  }

  const ks = COMPLETE_RECALL_KS;

  function evaluateLens(queries, resultMap) {
    return meanCompleteRecallProfile(queries, relevancesByQuery, resultMap, evalMetrics, ks);
  }

  // Overall (all measurability classes pooled) dual-mode rows.
  const overallEval = evaluateLens(measurabilityQueries, evalResults);
  const overallProd = evaluateLens(measurabilityQueries, prodResults);
  const overallFidelityDelta = diffProfiles(overallEval.profile, overallProd.profile, ks);

  // Per-class dual-mode rows.
  const byClass = {};
  for (const cls of MEASURABILITY_CLASSES) {
    const classQueries = measurabilityQueries.filter((q) => q.category === cls);
    if (classQueries.length === 0) {
      byClass[cls] = { queryCount: 0, note: 'class absent from golden set' };
      continue;
    }
    const lensEval = evaluateLens(classQueries, evalResults);
    const lensProd = evaluateLens(classQueries, prodResults);
    byClass[cls] = {
      queryCount: classQueries.length,
      evaluatedQueries: lensEval.evaluatedQueries,
      evalMode: formatProfile(lensEval.profile, ks),
      prodMode: formatProfile(lensProd.profile, ks),
      // First-class fidelity metric: how much the eval lens flatters production.
      evalVsProdDelta: formatProfile(diffProfiles(lensEval.profile, lensProd.profile, ks), ks),
    };
  }

  const output = {
    generatedAt: new Date().toISOString(),
    sourceDbPath: SOURCE_DB_PATH,
    dbPath: evalDatabase.dbPath,
    sourceShardPath: evalDatabase.sourceShardPath,
    evalShardPath: evalDatabase.evalShardPath,
    completeRecallKs: ks,
    searchLimit: SEARCH_LIMIT,
    measurabilityClasses: MEASURABILITY_CLASSES,
    missingClasses,
    queryCount: measurabilityQueries.length,
    classDistribution: Object.fromEntries(
      MEASURABILITY_CLASSES.map((cls) => [cls, measurabilityQueries.filter((q) => q.category === cls).length]),
    ),
    overall: {
      evaluatedQueries: overallEval.evaluatedQueries,
      evalMode: formatProfile(overallEval.profile, ks),
      prodMode: formatProfile(overallProd.profile, ks),
      evalVsProdDelta: formatProfile(overallFidelityDelta, ks),
    },
    byClass,
  };

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);
  console.log(JSON.stringify(output, null, 2));
}

// Only run the benchmark when invoked as a CLI; importing the module (e.g. from a
// test) must not execute the full eval.
const invokedDirectly = Boolean(process.argv[1])
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.stack : String(error));
    process.exitCode = 1;
  });
}

export { buildSearchLenses, meanCompleteRecallProfile, diffProfiles, MEASURABILITY_CLASSES, COMPLETE_RECALL_KS };
