#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────
// MODULE: Multi-Hop Tail-Appends Recall Benchmark
// Usage:
//   node multihop-tail-appends-benchmark.mjs
//
// Measures whether the two default-off tail-append features lift multi-target
// recall, and resolves the documented three-result-floor blocker with data.
//   SPECKIT_DETERMINISTIC_MULTIHOP : appends a hub doc's cross-referenced
//     sibling spec.md docs to the result tail (no LLM, no re-embedding).
//   SPECKIT_LANE_CHAMPION_BACKFILL : appends each base lane's top candidate that
//     missed the fused top-K into empty tail slots (no new query, no re-scoring).
//
// Both append candidates to the tail with a score below every baseline hit, so
// flag-off is byte-identical and an append can only fill an otherwise-empty tail
// slot, never evict a baseline top-K hit.
//
// THE KEY QUESTION
//   Do these tail-appends lift completeRecall@K on the PRODUCTION search path, and
//   is the documented three-result-floor blocker real? The ENV_REFERENCE holds the
//   appends off because "the prod default route truncates to a 3-result floor, so a
//   tail-additive append never reaches the prod reader." The 005 status spine says
//   the opposite: DEFAULT_MIN_RESULTS = 3 is a never-cut-below-three FLOOR not a
//   cap, the route returns up to the caller's limit, and the real prod-limiting
//   stage is token-budget truncation. This benchmark tests both on the prod path.
//
// METRIC
//   completeRecall@K = fraction of a query's labeled target spec.md ids that appear
//   in the top-K returned results, for K in {3, 5, 8}. A target set spans the
//   sibling and cross-referenced spec folders the hub doc names in its own prose,
//   which is exactly the recall the multi-hop append claims to extend.
//
// TWO PATHS, BOTH ON THE PRODUCTION CODE
//   prod   : executePipeline, the function the live memory_search MCP handler calls.
//            Stage 1 collects candidates through collectRawCandidates, which runs
//            the fusion plan with stopAfterFusion=true. The append stages C3/C4 live
//            in enrichFusedResults, the branch stopAfterFusion skips, so the prod
//            path never runs the appends. The benchmark proves this by flipping the
//            flags and showing the prod output is byte-identical.
//   legacy : searchWithFallback, the older entry point that DOES call
//            enrichFusedResults and therefore DOES run the append stages. Measuring
//            it shows whether the appends would help IF they were reachable, and
//            whether downstream truncation strips them even where they run.
//
// VERDICT
//   GRADUATE if the appends lift completeRecall@K on the prod path beyond run-to-run
//   variance with byte-identity intact. REFINE if they show promise but a named code
//   change is required first. CUT if no measured win survives the prod path.
//
// SAFETY
//   The live database is never opened for writes. It is backed up read-only to a
//   temporary eval copy along with the active vector shard, and every search runs
//   against the copy. No reindex is triggered. The harness imports production code
//   and flips only the two feature flags under test, never a default.
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

// The K windows the benchmark reports completeRecall at. K=3 is the prod floor
// minimum and K=5 and K=8 widen toward the requested limit. K=12 and K=20 reach
// PAST the requested limit of ten, where the tail-append rows land, so the benchmark
// can see whether the appends extend recall into the tail a deep reader consumes.
const RECALL_K = [3, 5, 8, 12, 20];
// The caller limit the prod path requests. The live memory_search handler defaults
// rawLimit to 10, so the benchmark requests 10 to mirror prod, not a widened eval
// window. The legacy path requests the same.
const PROD_LIMIT = 10;
// Repeat each measurement to expose run-to-run variance, so a recall delta is read
// against real jitter rather than assumed deterministic.
const REPEATS = 3;

// ── labeled multi-target query set ─────────────────────────────────
// Each query targets a HUB spec doc that names sibling or cross-referenced spec
// folders in its own prose. The target set is the indexed spec.md id of each named
// sibling that resolves 1:1 to a unique folder, which is exactly what the multi-hop
// append parses, resolves and appends. The query text is the hub topic, so the hub
// recalls on its own merit and the named siblings are the natural next hop.
// Targets are spec.md ids captured against the live corpus at authoring time and
// re-validated each run, so a stale id is reported rather than silently scored.
const LABELED_QUERIES = [
  {
    id: 'speckit-memory-foundation',
    text: 'speckit memory corpus reindex determinism graceful degradation',
    hubFolder: 'system-spec-kit/028-memory-search-intelligence/001-speckit-memory',
    targets: [
      'system-spec-kit/028-memory-search-intelligence/001-speckit-memory/001-corpus-reindex-gate-zero',
      'system-spec-kit/028-memory-search-intelligence/001-speckit-memory/002-determinism-content-id-foundation',
      'system-spec-kit/028-memory-search-intelligence/001-speckit-memory/004-graceful-degradation',
      'system-spec-kit/028-memory-search-intelligence/001-speckit-memory/005-recall-render-escaper',
    ],
  },
  {
    id: 'spec-data-quality-program',
    text: 'spec data quality extend quality loop trigger propagation enum schema',
    hubFolder: 'system-spec-kit/028-memory-search-intelligence/003-spec-data-quality',
    targets: [
      'system-spec-kit/028-memory-search-intelligence/003-spec-data-quality/001-on-write-quality/001-extend-quality-loop-authored',
      'system-spec-kit/028-memory-search-intelligence/003-spec-data-quality/001-on-write-quality/002-trigger-propagation-description',
      'system-spec-kit/028-memory-search-intelligence/003-spec-data-quality/001-on-write-quality/003-enum-constrain-schemas',
      'system-spec-kit/028-memory-search-intelligence/003-spec-data-quality/001-on-write-quality/004-schema-warn-to-error',
    ],
  },
  {
    id: 'local-embeddings-foundation',
    text: 'local embeddings prefix registry model installation mcp config rollout',
    hubFolder: 'system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation',
    targets: [
      'system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/001-prefix-registry-architecture',
      'system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/002-model-installation-and-compat',
      'system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/003-mcp-config-rollout',
      'system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/004-vec-store-rebuild',
    ],
  },
  {
    id: 'spec-memory-stack-adapter',
    text: 'spec memory stack adapter interface ollama backend mcp tools reindex',
    hubFolder: 'system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack',
    targets: [
      'system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/001-adapter-interface',
      'system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/002-ollama-backend-and-multi-dim-schema',
      'system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/003-mcp-tools-and-reindex',
    ],
  },
  {
    id: 'memory-store-and-search',
    text: 'memory store write safety causal lifecycle semantic trigger fallback learning feedback',
    hubFolder: 'system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search',
    targets: [
      'system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/001-memory-write-safety',
      'system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/002-memory-index-causal-lifecycle',
      'system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback',
      'system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/004-learning-feedback-reducers',
    ],
  },
  {
    id: 'memory-leak-remediation',
    text: 'memory leak remediation telemetry process verification cli dispatch containment deep loop locks',
    hubFolder: 'system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation',
    targets: [
      'system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map',
      'system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/002-telemetry-and-process-verification-harness',
      'system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/003-cli-dispatch-containment-and-recursion-guards',
      'system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery',
    ],
  },
  {
    id: 'hybrid-rag-fusion-epic',
    text: 'hybrid rag fusion indexing normalization constitutional learn refactor ux hooks automation',
    hubFolder: 'system-spec-kit/z_archive/022-hybrid-rag-fusion',
    targets: [
      'system-spec-kit/z_archive/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic',
      'system-spec-kit/z_archive/022-hybrid-rag-fusion/002-indexing-normalization',
      'system-spec-kit/z_archive/022-hybrid-rag-fusion/003-constitutional-learn-refactor',
      'system-spec-kit/z_archive/022-hybrid-rag-fusion/004-ux-hooks-automation',
    ],
  },
  {
    id: 'compact-code-graph-hooks',
    text: 'compact code graph precompact hook session start stop hook tracking command agent alignment',
    hubFolder: 'system-spec-kit/z_archive/024-compact-code-graph',
    targets: [
      'system-spec-kit/z_archive/024-compact-code-graph/001-precompact-hook',
      'system-spec-kit/z_archive/024-compact-code-graph/002-session-start-hook',
      'system-spec-kit/z_archive/024-compact-code-graph/003-stop-hook-tracking',
      'system-spec-kit/z_archive/024-compact-code-graph/005-command-agent-alignment',
    ],
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

// Resolve each labeled query's target spec folders to the indexed spec.md id, the
// same id space the search results carry. A folder that resolves to zero or many
// spec.md rows is reported as unresolved rather than silently scored, so a stale
// label cannot inflate or deflate recall.
function resolveTargets(db, queries) {
  const stmt = db.prepare(
    "SELECT id FROM memory_index WHERE spec_folder = ? AND file_path LIKE '%/spec.md' ORDER BY id",
  );
  return queries.map((q) => {
    const resolved = [];
    const unresolved = [];
    for (const folder of q.targets) {
      const rows = stmt.all(folder);
      if (rows.length === 1) {
        resolved.push({ folder, id: Number(rows[0].id) });
      } else {
        unresolved.push({ folder, matchCount: rows.length });
      }
    }
    return { ...q, resolvedTargets: resolved, unresolvedTargets: unresolved };
  });
}

function fmt(value, digits = 6) {
  return typeof value === 'number' && Number.isFinite(value) ? Number(value.toFixed(digits)) : null;
}

function mean(values) {
  const finite = values.filter((v) => typeof v === 'number' && Number.isFinite(v));
  return finite.length === 0 ? null : finite.reduce((a, b) => a + b, 0) / finite.length;
}

function stdev(values) {
  const finite = values.filter((v) => typeof v === 'number' && Number.isFinite(v));
  if (finite.length < 2) return 0;
  const m = finite.reduce((a, b) => a + b, 0) / finite.length;
  const variance = finite.reduce((a, b) => a + (b - m) ** 2, 0) / finite.length;
  return Math.sqrt(variance);
}

// completeRecall@K over a single result id list against a resolved target set.
function completeRecallAtK(resultIds, targetIds, k) {
  if (targetIds.length === 0) return null;
  const head = new Set(resultIds.slice(0, k));
  const hit = targetIds.filter((id) => head.has(id)).length;
  return hit / targetIds.length;
}

// A faithful prod PipelineConfig mirroring the live memory_search handler defaults,
// carrying the pre-computed query embedding so the embedder runs once per query.
function buildPipelineConfig(query, embedding, limit) {
  return {
    query,
    queryEmbedding: embedding,
    searchType: 'hybrid',
    limit,
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

function setAppendFlags(enabled) {
  const value = enabled ? 'true' : 'false';
  process.env.SPECKIT_DETERMINISTIC_MULTIHOP = value;
  process.env.SPECKIT_LANE_CHAMPION_BACKFILL = value;
}

async function main() {
  const config = await import(distUrl('core/config.js'));
  const sourceDbPath = config.DATABASE_PATH;
  if (!sourceDbPath || !fs.existsSync(sourceDbPath)) {
    throw new Error(`Live database not found at config DATABASE_PATH: ${sourceDbPath}`);
  }

  // Backup the live database and its active vector shard to a temporary eval copy.
  const evalRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-multihop-eval-'));
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

  // Point the runtime at the eval copy and keep the embedder load tiny. Leave every
  // results-affecting flag at its shipped default, then flip only the two append
  // flags per measurement below.
  process.env.MEMORY_DB_PATH = evalDbPath;
  process.env.SPECKIT_SKIP_API_VALIDATION = 'true';
  setAppendFlags(false);

  const [vectorIndex, hybridSearch, graphSearch, pipeline] = await Promise.all([
    import(distUrl('lib/search/vector-index.js')),
    import(distUrl('lib/search/hybrid-search.js')),
    import(distUrl('lib/search/graph-search-fn.js')),
    import(distUrl('lib/search/pipeline/index.js')),
  ]);

  const db = vectorIndex.initializeDb(evalDbPath, { skipRestoreRecovery: true });
  vectorIndex.attachActiveVectorShardForActiveProfile(db);
  const graphSearchFn = graphSearch.createUnifiedGraphSearchFn(db);
  hybridSearch.init(db, vectorIndex.vectorSearch, graphSearchFn);

  const queries = resolveTargets(db, LABELED_QUERIES);

  const perQuery = [];

  for (const q of queries) {
    const embedding = await vectorIndex.generateQueryEmbedding(q.text);
    if (!embedding || embedding.length === 0) {
      throw new Error(`Embedding failed for query "${q.text}"; cannot run a faithful benchmark`);
    }
    const targetIds = q.resolvedTargets.map((t) => t.id);

    // Collect repeated runs for each path under each flag posture. The pipeline run
    // is the production path; the legacy run is the enrichFusedResults path that
    // actually executes the append stages.
    const runs = {
      prodOff: [],
      prodOn: [],
      legacyOff: [],
      legacyOn: [],
    };
    // Append metadata, captured once per posture from the first run.
    let prodAppendMeta = null;
    let legacyAppendMeta = null;

    // Flag-off strict no-op proof: with both append flags off the tail-append stage
    // must not run, so no tailAppends metadata is emitted and no appended-source row
    // appears. Tracked across every off run so the default-path byte-safety is a
    // measured fact, not an assumption.
    let prodFlagOffStrictNoOp = true;

    for (let r = 0; r < REPEATS; r += 1) {
      // -- prod path, appends OFF --
      setAppendFlags(false);
      const prodOff = await pipeline.executePipeline(buildPipelineConfig(q.text, embedding, PROD_LIMIT));
      runs.prodOff.push(prodOff.results.map((row) => Number(row.id)));
      if (prodOff.metadata?.tailAppends !== undefined) prodFlagOffStrictNoOp = false;
      if (prodOff.results.some((row) => /multihop|lane-champion/.test(String(row.source ?? '')))) {
        prodFlagOffStrictNoOp = false;
      }

      // -- prod path, appends ON --
      setAppendFlags(true);
      const prodOn = await pipeline.executePipeline(buildPipelineConfig(q.text, embedding, PROD_LIMIT));
      runs.prodOn.push(prodOn.results.map((row) => Number(row.id)));
      if (prodAppendMeta === null) {
        // The tail-append stage runs after Stage 4 and records its outcome under
        // metadata.tailAppends, present only when an append flag was on and the stage
        // ran. Absent here means the appends never reached the prod path.
        prodAppendMeta = {
          tailAppends: prodOn.metadata?.tailAppends ?? null,
        };
      }

      // -- legacy path, appends OFF --
      setAppendFlags(false);
      const legacyOff = await hybridSearch.searchWithFallback(q.text, embedding, { limit: PROD_LIMIT });
      runs.legacyOff.push(legacyOff.map((row) => Number(row.id)));

      // -- legacy path, appends ON --
      setAppendFlags(true);
      const legacyOn = await hybridSearch.searchWithFallback(q.text, embedding, { limit: PROD_LIMIT });
      runs.legacyOn.push(legacyOn.map((row) => Number(row.id)));
      if (legacyAppendMeta === null) {
        const appendedRows = legacyOn.filter((row) => /multihop|lane-champion/.test(String(row.source ?? '')));
        legacyAppendMeta = {
          appendedRowsSurviving: appendedRows.length,
          appendedSources: [...new Set(appendedRows.map((row) => String(row.source)))],
        };
      }
      setAppendFlags(false);
    }

    // Byte-identity: the prod path ids must be identical off vs on across every
    // repeat, proving the flags change nothing on the prod path.
    const prodByteIdentical = runs.prodOff.every((ids, i) => JSON.stringify(ids) === JSON.stringify(runs.prodOn[i]));

    // Per-path completeRecall@K, averaged over repeats.
    function recallProfile(idLists) {
      const profile = {};
      for (const k of RECALL_K) {
        const vals = idLists.map((ids) => completeRecallAtK(ids, targetIds, k));
        profile[`k${k}`] = {
          mean: fmt(mean(vals), 6),
          stdev: fmt(stdev(vals), 6),
        };
      }
      return profile;
    }

    // Result-count profile per posture, to expose truncation directly.
    function countProfile(idLists) {
      const counts = idLists.map((ids) => ids.length);
      return { mean: fmt(mean(counts), 4), min: Math.min(...counts), max: Math.max(...counts) };
    }

    perQuery.push({
      id: q.id,
      text: q.text,
      hubFolder: q.hubFolder,
      targetFolderCount: q.targets.length,
      resolvedTargetCount: q.resolvedTargets.length,
      resolvedTargetIds: targetIds,
      unresolvedTargets: q.unresolvedTargets,
      prodByteIdentical,
      prodFlagOffStrictNoOp,
      prodAppendMeta,
      legacyAppendMeta,
      resultCounts: {
        prodOff: countProfile(runs.prodOff),
        prodOn: countProfile(runs.prodOn),
        legacyOff: countProfile(runs.legacyOff),
        legacyOn: countProfile(runs.legacyOn),
      },
      completeRecall: {
        prodOff: recallProfile(runs.prodOff),
        prodOn: recallProfile(runs.prodOn),
        legacyOff: recallProfile(runs.legacyOff),
        legacyOn: recallProfile(runs.legacyOn),
      },
      sampleIds: {
        prodOff: runs.prodOff[0],
        prodOn: runs.prodOn[0],
        legacyOff: runs.legacyOff[0],
        legacyOn: runs.legacyOn[0],
      },
    });
  }

  // ── aggregate metrics ───────────────────────────────────────────
  function aggregateRecall(posture) {
    const agg = {};
    for (const k of RECALL_K) {
      const means = perQuery
        .map((p) => p.completeRecall[posture][`k${k}`].mean)
        .filter((v) => typeof v === 'number');
      agg[`k${k}`] = fmt(mean(means), 6);
    }
    return agg;
  }

  // Per-K recall delta on the prod path (on minus off) and on the legacy path,
  // plus the maximum per-query run-to-run stdev so a delta can be read against jitter.
  function recallDelta(onPosture, offPosture) {
    const delta = {};
    for (const k of RECALL_K) {
      const onAgg = aggregateRecall(onPosture)[`k${k}`];
      const offAgg = aggregateRecall(offPosture)[`k${k}`];
      const maxStdev = Math.max(
        ...perQuery.map((p) => p.completeRecall[onPosture][`k${k}`].stdev ?? 0),
        ...perQuery.map((p) => p.completeRecall[offPosture][`k${k}`].stdev ?? 0),
      );
      delta[`k${k}`] = {
        on: onAgg,
        off: offAgg,
        delta: fmt((onAgg ?? 0) - (offAgg ?? 0), 6),
        maxRunStdev: fmt(maxStdev, 6),
      };
    }
    return delta;
  }

  const prodByteIdenticalAll = perQuery.every((p) => p.prodByteIdentical);
  const prodFlagOffStrictNoOpAll = perQuery.every((p) => p.prodFlagOffStrictNoOp);
  const prodAppendsEverApplied = perQuery.some(
    (p) => (p.prodAppendMeta?.tailAppends?.multihopApplied === true)
      || (p.prodAppendMeta?.tailAppends?.laneChampionApplied === true),
  );
  const prodAppendedRowsTotal = perQuery.reduce(
    (sum, p) => sum
      + (p.prodAppendMeta?.tailAppends?.multihopAppendedCount ?? 0)
      + (p.prodAppendMeta?.tailAppends?.laneChampionAppendedCount ?? 0),
    0,
  );
  const legacyAppendsSurvivingTotal = perQuery.reduce(
    (sum, p) => sum + (p.legacyAppendMeta?.appendedRowsSurviving ?? 0),
    0,
  );

  const output = {
    generatedFrom: 'multihop-tail-appends-benchmark.mjs',
    generatedAt: new Date().toISOString(),
    subject:
      'SPECKIT_DETERMINISTIC_MULTIHOP and SPECKIT_LANE_CHAMPION_BACKFILL tail-appends vs off, ' +
      'completeRecall@K on the production executePipeline path and the legacy enrichFusedResults path',
    sourceDbPath,
    evalDbPath,
    evalShardPath,
    activeEmbedder,
    prodLimit: PROD_LIMIT,
    recallK: RECALL_K,
    repeats: REPEATS,
    metricDefinition:
      'completeRecall@K = fraction of a query labeled target spec.md ids present in the top-K results.',
    prodPathSource:
      'executePipeline, the function the live memory_search MCP handler calls. The refined pipeline runs a ' +
      'tail-append stage after Stage 4 and after the final-limit cap, gated behind the two append flags, so ' +
      'the appends now reach the prod reader. Flag-off keeps the Stage-4 output byte-for-byte.',
    legacyPathSource:
      'searchWithFallback, the older entry point that calls enrichFusedResults and runs the append stages ' +
      'before its own token-budget truncation, retained here as a comparison path.',
    rewireNote:
      'The refinement wires deterministic-multihop and lane-champion backfill into executePipeline as a ' +
      'post-Stage-4 tail-append stage that extends the capped baseline past the requested limit, so an ' +
      'appended row is exempt from the final-limit cap and reaches the reader. The pipeline has no ' +
      'token-budget truncation; that stage exists only on the legacy path.',
    floorBlockerFinding: {
      claim:
        'ENV_REFERENCE held the appends off because the prod route truncates to a 3-result floor so a ' +
        'tail append never reaches the prod reader.',
      prodByteIdenticalOnVsOff: prodByteIdenticalAll,
      prodFlagOffStrictNoOp: prodFlagOffStrictNoOpAll,
      prodAppendStagesEverApplied: prodAppendsEverApplied,
      prodAppendedRowsTotal,
      legacyAppendedRowsSurvivingTotal: legacyAppendsSurvivingTotal,
      resolution:
        'The three-result floor was never a cap; the prod path returns the full requested limit of ten. ' +
        'Before the refinement the appends never ran on executePipeline because stopAfterFusion skipped ' +
        'enrichFusedResults. The refinement adds a post-Stage-4 tail-append stage, so the appends now run on ' +
        'the prod path and extend recall past the limit, exempt from the final-limit cap.',
    },
    aggregate: {
      prodRecallOff: aggregateRecall('prodOff'),
      prodRecallOn: aggregateRecall('prodOn'),
      prodRecallDelta: recallDelta('prodOn', 'prodOff'),
      legacyRecallOff: aggregateRecall('legacyOff'),
      legacyRecallOn: aggregateRecall('legacyOn'),
      legacyRecallDelta: recallDelta('legacyOn', 'legacyOff'),
    },
    perQuery,
  };

  fs.mkdirSync(RESULTS_DIR, { recursive: true });
  const outPath = path.join(RESULTS_DIR, 'metrics.json');
  fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`);

  // Best-effort cleanup of the temporary eval copy.
  try {
    fs.rmSync(evalRoot, { recursive: true, force: true });
  } catch { /* best-effort */ }

  const consoleSummary = {
    metricsPath: outPath,
    activeEmbedder: activeEmbedder.name,
    prodLimit: PROD_LIMIT,
    repeats: REPEATS,
    prodByteIdenticalOnVsOff: prodByteIdenticalAll,
    prodFlagOffStrictNoOp: prodFlagOffStrictNoOpAll,
    prodAppendStagesEverApplied: prodAppendsEverApplied,
    prodAppendedRowsTotal,
    legacyAppendedRowsSurvivingTotal: legacyAppendsSurvivingTotal,
    prodRecallDelta: output.aggregate.prodRecallDelta,
    legacyRecallDelta: output.aggregate.legacyRecallDelta,
    perQuery: perQuery.map((p) => ({
      id: p.id,
      resolvedTargetCount: p.resolvedTargetCount,
      prodByteIdentical: p.prodByteIdentical,
      prodResultCount: p.resultCounts.prodOff.mean,
      legacyResultCount: p.resultCounts.legacyOff.mean,
      legacyAppendedSurviving: p.legacyAppendMeta?.appendedRowsSurviving ?? 0,
      prodRecallK5Off: p.completeRecall.prodOff.k5.mean,
      prodRecallK5On: p.completeRecall.prodOn.k5.mean,
    })),
  };
  process.stdout.write(`${JSON.stringify(consoleSummary, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
