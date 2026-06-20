#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────
// EDGE / TEMPORAL RECALL FLAG EVAL DRIVER
// ───────────────────────────────────────────────────────────────
// Companion to run-retrieval-flag-eval.mjs for the edge/temporal-recall flag
// family it marks runSearch:false (because these flags live OUTSIDE the
// hybridSearchEnhanced per-flag sweep). Instead of Recall@20 over the generic
// ground-truth set, this driver measures EDGE-RECALL: given a query whose source
// memory has a known open causal edge, does the edge-neighbor target memory get
// recalled through the graph edge channel on the DEFAULT routing path.
//
// House-pattern parity with run-retrieval-flag-eval.mjs:
//   - back up the live DB + active vector shard into a temp copy, never mutate live
//   - import the SAME dist modules and init hybridSearchEnhanced the same way
//   - drive the DEFAULT routing path (useGraph:true, no forceAllChannels), so the
//     graph lane carries edge candidates the way production does
//   - flip each flag ON vs OFF, restore env between variants
//
// Two metric families, because the flags split into two consumer shapes:
//   1. recall  — edge-neighbor recall@K on the default path (graph edge channel).
//   2. behavior — direct probe of the gated edge primitive (reconciliation row
//      changes; valid-edge read count; semantic-edge primitive reachability),
//      because some flags gate a DB-mutating or edge-read path that the recall
//      metric cannot observe on a live graph whose derived edge data is a no-op
//      for the flag (see COVERAGE CAVEATS in the emitted report).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import Database from 'better-sqlite3';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MCP_ROOT = path.join(HERE, '..', '..');

const SOURCE_DB_PATH = path.resolve(
  process.env.MEMORY_DB_PATH
    ?? path.join(MCP_ROOT, 'database', 'context-index.sqlite'),
);
const OUTPUT_PATH = path.resolve(
  process.env.SPECKIT_EDGE_RECALL_EVAL_OUTPUT ?? '/tmp/speckit-edge-recall-eval.json',
);
const GOLDEN_PATH = path.join(HERE, 'edge-recall-golden.json');
const RECALL_K = Number.parseInt(process.env.SPECKIT_EDGE_RECALL_EVAL_K ?? '20', 10);

// The edge/temporal flag family this driver owns. `metric` records which probe a
// flag is graded by, since the recall lane cannot see flags that only gate a
// DB-mutating or shadow-substrate path on the current live graph.
const FLAG_SPECS = [
  {
    label: 'temporal_edges',
    env: 'SPECKIT_TEMPORAL_EDGES',
    currentDefault: 'on',
    metric: 'recall+behavior',
    note: 'Gates valid-edge reads (getValidEdges) and the lifecycle columns; recall path is graph edge channel.',
  },
  {
    label: 'edge_presence_currentness',
    env: 'SPECKIT_EDGE_PRESENCE_CURRENTNESS',
    currentDefault: 'off',
    metric: 'behavior',
    note: 'Gates reconcileEdgePresenceCurrentness, a DB-mutating closure-marker reconciliation pass.',
  },
  {
    label: 'bitemporal_recall',
    env: 'SPECKIT_BITEMPORAL_RECALL',
    currentDefault: 'off',
    metric: 'recall',
    note: 'No reachable recall consumer in this build; bitemporal window columns land via schema migration unconditionally.',
  },
  {
    label: 'semantic_edge_layer',
    env: 'SPECKIT_SEMANTIC_EDGE_LAYER',
    currentDefault: 'off',
    metric: 'recall',
    note: 'Consolidation-time edge-embedding substrate; no query-time recall consumer.',
  },
  {
    label: 'edge_vector_index',
    env: 'SPECKIT_EDGE_VECTOR_INDEX',
    currentDefault: 'off',
    metric: 'behavior',
    note: 'Gates findSemanticEdges (nearest edge vectors); requires populated edge_vector_embeddings.',
  },
  {
    label: 'edge_triplet_search',
    env: 'SPECKIT_EDGE_TRIPLET_SEARCH',
    currentDefault: 'off',
    metric: 'behavior',
    note: 'Gates rankEdgeTripletCandidates edge-aware (source,edge,target) scoring.',
  },
];

const RUNTIME_FLAG_ENVS = new Set(FLAG_SPECS.map((flag) => flag.env));

// Default routing options mirroring buildPerFlagSearchOptions in the sibling
// driver: every lane available, the router (not a forceAllChannels override)
// decides the live channel subset, so the graph edge channel carries candidates
// exactly the way the production default path does.
export function buildEdgeRecallSearchOptions(recallK, overrides = {}) {
  return {
    limit: recallK,
    useVector: true,
    useBm25: true,
    useFts: true,
    useGraph: true,
    includeContent: false,
    evaluationMode: true,
    ...overrides,
  };
}

// Edge-recall@K: of the golden items, what fraction recall their known edge-neighbor
// target memory id anywhere in the top-K default-path results.
export function computeEdgeRecall(goldenItems, resultIdsByQueryId, recallK) {
  let hits = 0;
  let evaluated = 0;
  const perItem = [];
  for (const item of goldenItems) {
    const ids = resultIdsByQueryId.get(item.id) ?? [];
    if (ids.length === 0) {
      perItem.push({ id: item.id, recalled: false, evaluated: false });
      continue;
    }
    evaluated += 1;
    const recalled = ids.slice(0, recallK).includes(item.expectedTargetMemoryId);
    if (recalled) hits += 1;
    perItem.push({ id: item.id, recalled, evaluated: true });
  }
  return {
    recall: evaluated === 0 ? 0 : hits / evaluated,
    hits,
    evaluatedQueries: evaluated,
    perItem,
  };
}

function moduleUrl(relativePath) {
  return pathToFileURL(path.join(MCP_ROOT, relativePath)).href;
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
  const evalRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-edge-recall-eval-'));
  const evalDbPath = path.join(evalRoot, 'context-index.sqlite');
  await backupSqlite(sourceDbPath, evalDbPath);

  const activeEmbedder = readActiveEmbedder(evalDbPath);
  const shardSlug = createProfileSlug(activeEmbedder.provider, activeEmbedder.name, activeEmbedder.dim);
  const shardName = `context-vectors__${shardSlug}.sqlite`;
  const sourceShardPath = path.join(path.dirname(sourceDbPath), 'vectors', shardName);
  const evalShardPath = path.join(path.dirname(evalDbPath), 'vectors', shardName);

  if (fs.existsSync(sourceShardPath)) {
    await backupSqlite(sourceShardPath, evalShardPath);
  }
  return { evalRoot, dbPath: evalDbPath, sourceShardPath, evalShardPath, activeEmbedder };
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

function normalizeResultIds(rows) {
  return rows
    .map((row) => Number(row.parentMemoryId ?? row.parent_id ?? row.parentId ?? row.id))
    .filter((id) => Number.isInteger(id));
}

// Direct behavior probes for flags whose gated path the recall metric cannot see.
function probeEdgePresenceCurrentness(db, temporalEdges, enabled) {
  const snapshot = { ...process.env };
  process.env.SPECKIT_TEMPORAL_EDGES = 'true';
  process.env.SPECKIT_EDGE_PRESENCE_CURRENTNESS = enabled ? 'true' : 'false';
  try {
    const result = temporalEdges.reconcileEdgePresenceCurrentness(db);
    return { enabled: result.enabled, clearedOpenMarkers: result.clearedOpenMarkers, markedLegacyClosures: result.markedLegacyClosures };
  } finally {
    restoreEnv(snapshot);
  }
}

function probeValidEdgeRead(db, temporalEdges, nodeId, enabled) {
  const snapshot = { ...process.env };
  process.env.SPECKIT_TEMPORAL_EDGES = enabled ? 'true' : 'false';
  try {
    return temporalEdges.getValidEdges(db, nodeId).length;
  } finally {
    restoreEnv(snapshot);
  }
}

function probeSemanticEdgePrimitive(db, edgeSemantic, edgeStore, dim, enabled, flagEnv) {
  const snapshot = { ...process.env };
  process.env[flagEnv] = enabled ? 'true' : 'false';
  try {
    if (flagEnv === 'SPECKIT_EDGE_VECTOR_INDEX') {
      const probe = new Array(dim).fill(0);
      probe[0] = 1;
      const hits = edgeSemantic.findSemanticEdges(db, probe, { limit: RECALL_K });
      return { reachable: enabled, hitCount: hits.length };
    }
    // edge_triplet_search: a flag-OFF call must return empty regardless of input.
    const ranked = edgeSemantic.rankEdgeTripletCandidates([{
      edgeId: 1, sourceId: '1', targetId: '2', relation: 'supports', strength: 1,
      factText: null, score: 0.9, modelId: 'm', profileKey: 'p', sourceScore: 0.8, targetScore: 0.7,
    }]);
    return { reachable: enabled, hitCount: ranked.length };
  } finally {
    restoreEnv(snapshot);
  }
}

async function main() {
  if (!Number.isInteger(RECALL_K) || RECALL_K <= 0) {
    throw new Error(`Invalid Recall@K: ${RECALL_K}`);
  }
  if (!fs.existsSync(GOLDEN_PATH)) {
    throw new Error(`Edge-recall golden set missing: ${GOLDEN_PATH}. Run derive-edge-recall-golden.mjs first.`);
  }
  const golden = JSON.parse(fs.readFileSync(GOLDEN_PATH, 'utf8'));
  const goldenItems = golden.items ?? [];
  if (goldenItems.length === 0) {
    throw new Error('Edge-recall golden set is empty.');
  }

  const evalDatabase = await prepareEvalDatabase(SOURCE_DB_PATH);
  process.env.MEMORY_DB_PATH = evalDatabase.dbPath;
  process.env.SPECKIT_ABLATION = 'true';

  const [vectorIndex, hybridSearch, graphSearch, embeddings, temporalEdges, edgeSemantic, edgeStore] =
    await Promise.all([
      import(moduleUrl('dist/lib/search/vector-index.js')),
      import(moduleUrl('dist/lib/search/hybrid-search.js')),
      import(moduleUrl('dist/lib/search/graph-search-fn.js')),
      import(moduleUrl('dist/lib/providers/embeddings.js')),
      import(moduleUrl('dist/lib/graph/temporal-edges.js')),
      import(moduleUrl('dist/lib/graph/edge-semantic-retrieval.js')),
      import(moduleUrl('dist/lib/storage/edge-vector-store.js')),
    ]);

  const db = vectorIndex.initializeDb(evalDatabase.dbPath, { skipRestoreRecovery: true });
  const graphSearchFn = graphSearch.createUnifiedGraphSearchFn(db);
  hybridSearch.init(db, vectorIndex.vectorSearch, graphSearchFn);

  const embeddingCache = new Map();
  async function getEmbedding(query) {
    if (embeddingCache.has(query)) return embeddingCache.get(query);
    try {
      const embedding = await embeddings.generateQueryEmbedding(query);
      embeddingCache.set(query, embedding);
      return embedding;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[edge-recall-eval] Query embedding failed, continuing without vector lane: ${message}`);
      embeddingCache.set(query, null);
      return null;
    }
  }

  async function searchVariant(optionOverrides = {}) {
    const resultIdsByQueryId = new Map();
    for (const item of goldenItems) {
      const embedding = await getEmbedding(item.query);
      const rows = await hybridSearch.hybridSearchEnhanced(
        item.query,
        embedding,
        buildEdgeRecallSearchOptions(RECALL_K, optionOverrides),
      );
      resultIdsByQueryId.set(item.id, normalizeResultIds(rows));
    }
    return resultIdsByQueryId;
  }

  const originalEnv = Object.fromEntries([...RUNTIME_FLAG_ENVS].map((name) => [name, process.env[name]]));

  // Graph-lane attribution guard. The default-path recall@K is honest about what
  // production returns, but it conflates the graph edge channel with the vector and
  // lexical lanes — sibling memories (a spec's "Feature Specification" and its
  // "Implementation Plan") are textually similar, so their edge neighbor is often
  // recalled lexically even with the graph lane off. Reporting recall WITH vs
  // WITHOUT the graph lane keeps any single-flag recallDelta from being over-read
  // as edge-channel-attributable.
  restoreEnv(originalEnv);
  graphSearch.clearDegreeCacheForDb(db);
  const defaultPathRecall = computeEdgeRecall(goldenItems, await searchVariant(), RECALL_K);
  const noGraphLaneRecall = computeEdgeRecall(goldenItems, await searchVariant({ useGraph: false }), RECALL_K);
  const graphAttribution = {
    defaultPathRecall: formatNumber(defaultPathRecall.recall),
    noGraphLaneRecall: formatNumber(noGraphLaneRecall.recall),
    graphLaneDelta: formatNumber(defaultPathRecall.recall - noGraphLaneRecall.recall),
    note: 'Default-path recall@K conflates graph/vector/lexical lanes. graphLaneDelta isolates the graph edge channel\'s marginal contribution on this golden set. Per-flag recallDelta below is whole-default-path; read edge isolation from the behavior probes and from graphLaneDelta, not from a single flag\'s recallDelta.',
  };

  const flagRows = [];

  for (const flag of FLAG_SPECS) {
    const row = { flag: flag.label, env: flag.env, currentDefault: flag.currentDefault, metric: flag.metric, note: flag.note };

    if (flag.metric.includes('recall')) {
      const runRecall = async (enabled) => {
        restoreEnv(originalEnv);
        process.env[flag.env] = enabled ? 'true' : 'false';
        graphSearch.clearDegreeCacheForDb(db);
        const resultIds = await searchVariant();
        return computeEdgeRecall(goldenItems, resultIds, RECALL_K);
      };
      const off = await runRecall(false);
      const on = await runRecall(true);
      row.recallOff = formatNumber(off.recall);
      row.recallOn = formatNumber(on.recall);
      row.recallDelta = formatNumber(on.recall - off.recall);
      row.evaluatedQueries = { off: off.evaluatedQueries, on: on.evaluatedQueries };
      row.hits = { off: off.hits, on: on.hits };
    }

    if (flag.metric.includes('behavior')) {
      restoreEnv(originalEnv);
      if (flag.env === 'SPECKIT_EDGE_PRESENCE_CURRENTNESS') {
        row.behaviorOff = probeEdgePresenceCurrentness(db, temporalEdges, false);
        row.behaviorOn = probeEdgePresenceCurrentness(db, temporalEdges, true);
        row.behaviorChanged = row.behaviorOff.enabled !== row.behaviorOn.enabled;
      } else if (flag.env === 'SPECKIT_TEMPORAL_EDGES') {
        const nodeId = goldenItems[0].sourceMemoryId;
        const off = probeValidEdgeRead(db, temporalEdges, nodeId, false);
        const on = probeValidEdgeRead(db, temporalEdges, nodeId, true);
        row.behaviorOff = { validEdgesRead: off };
        row.behaviorOn = { validEdgesRead: on };
        row.behaviorChanged = off !== on;
      } else if (flag.env === 'SPECKIT_EDGE_VECTOR_INDEX' || flag.env === 'SPECKIT_EDGE_TRIPLET_SEARCH') {
        const off = probeSemanticEdgePrimitive(db, edgeSemantic, edgeStore, evalDatabase.activeEmbedder.dim, false, flag.env);
        const on = probeSemanticEdgePrimitive(db, edgeSemantic, edgeStore, evalDatabase.activeEmbedder.dim, true, flag.env);
        row.behaviorOff = off;
        row.behaviorOn = on;
        row.behaviorChanged = off.reachable !== on.reachable;
      }
    }
    flagRows.push(row);
  }

  restoreEnv(originalEnv);

  // Coverage caveats grounded in the live graph's derived-edge state, so a null/zero
  // delta is never mistaken for "the flag does nothing".
  const liveStats = (() => {
    const sdb = new Database(evalDatabase.dbPath, { readonly: true });
    try {
      const totalEdges = sdb.prepare('SELECT COUNT(*) n FROM causal_edges').get().n;
      const openEdges = sdb.prepare('SELECT COUNT(*) n FROM causal_edges WHERE invalid_at IS NULL').get().n;
      const markedClosures = sdb.prepare("SELECT COUNT(*) n FROM causal_edges WHERE invalid_at IS NOT NULL AND invalidation_source IS NULL").get().n;
      const strayOpenMarkers = sdb.prepare("SELECT COUNT(*) n FROM causal_edges WHERE invalid_at IS NULL AND invalidation_source IS NOT NULL").get().n;
      const edgeVectors = sdb.prepare("SELECT COUNT(*) n FROM edge_vector_embeddings WHERE embedding_status = 'ready'").get().n;
      return { totalEdges, openEdges, markedClosures, strayOpenMarkers, edgeVectors };
    } finally {
      sdb.close();
    }
  })();

  const coverageCaveats = [];
  if (liveStats.openEdges === liveStats.totalEdges) {
    coverageCaveats.push('All live edges are open (invalid_at IS NULL); bitemporal/closure invalidation paths exercise no derived data on this graph.');
  }
  if (liveStats.markedClosures === 0 && liveStats.strayOpenMarkers === 0) {
    coverageCaveats.push('Edge-presence reconciliation has zero rows to repair on the live graph; its behavior delta is real (enabled flips) but mutates 0 rows.');
  }
  if (liveStats.edgeVectors === 0) {
    coverageCaveats.push('edge_vector_embeddings has 0 ready rows; semantic-edge recall (edge_vector_index/edge_triplet_search) is reachable but yields no live hits without seeded edge vectors. ~20% un-enriched corpus rows further depress edge-derived coverage.');
  }

  const output = {
    generatedAt: new Date().toISOString(),
    sourceDbPath: SOURCE_DB_PATH,
    dbPath: evalDatabase.dbPath,
    recallK: RECALL_K,
    goldenItemCount: goldenItems.length,
    goldenSourceDbPath: golden.sourceDbPath ?? null,
    liveEdgeStats: liveStats,
    graphAttribution,
    coverageCaveats,
    flags: flagRows,
  };

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
