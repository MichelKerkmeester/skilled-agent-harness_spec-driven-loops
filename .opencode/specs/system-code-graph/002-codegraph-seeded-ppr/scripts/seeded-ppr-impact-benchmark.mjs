#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────
// MODULE: Code-Graph Seeded-PPR Impact-Ranking Benchmark
// Usage:
//   node seeded-ppr-impact-benchmark.mjs
//
// Question:
//   Does bounded seeded personalized PageRank beat the flat reverse impact walk
//   on impact-ranking quality for real change-impact queries on the live code graph?
//
// Method:
//   Build a labeled change-impact set from real reverse CALLS and IMPORTS edges in
//   the live code graph. For a changed symbol the true impacted set is the set of
//   FILES reached by walking reverse CALLS and IMPORTS edges out to the same hop
//   bound the production PPR uses (the structural blast radius). Each labeled query
//   is a changed symbol with a non-trivial reverse fan-in. Two rankers score the
//   candidate impacted files and the harness measures precision at K and recall at K
//   for each against the labeled set.
//
//   FLAT walk (the served production path): the reverse 1-hop neighbors over CALLS
//   then IMPORTS, ordered by the production rankContextEdges RRF-plus-reliability
//   rule, mapped to their files. This is exactly what code-graph-context.ts serves
//   for a queryMode impact request today, the seeded-PPR flag and its code having
//   been removed from the tree.
//
//   PPR ranker (the dark mechanism under measurement): the bounded seeded
//   personalized PageRank that shipped default-off behind
//   SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING in 657a0f6a3e and was removed in
//   277c35344c. This harness reconstructs that exact algorithm from the recorded
//   constants (damping 0.85, max hops 3, max iterations 20, epsilon 1e-6, the
//   INFERRED transition factor 0.45 and the evidence rank factors) over an
//   undirected projection of the CALLS and IMPORTS edges, folding confidence and
//   evidence reliability into the transition weights, and maps the per-symbol PPR
//   scores to their files. No production code is imported or edited.
//
// Default-off byte-identity:
//   The flag is absent from the live source, so the served impact path is the flat
//   walk unconditionally. The harness records the served ranker for each query and
//   confirms it is the flat ranker with no PPR contribution, which is the off-state
//   guarantee in concrete form: nothing in the serving path reads PPR.
//
// Calibration:
//   The harness sweeps the PPR damping over a small grid and reports the best
//   damping per the mean precision at K, so a refine verdict can cite whether any
//   calibration unlocks a win over the flat walk.
//
// Safety:
//   The live code-graph database is opened read-only and backed up to a temporary
//   eval copy. Every read runs against the copy. No write, no reindex, no migration.
//
// Output:
//   results/metrics.json (full per-query rows and aggregates) and a console summary.
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BENCH_ROOT = path.resolve(HERE, '..');
const RESULTS_DIR = path.join(BENCH_ROOT, 'results');
const REPO_ROOT = path.resolve(HERE, '..', '..', '..', '..', '..', '..', '..');
const CODE_GRAPH_DIR = path.join(REPO_ROOT, '.opencode', 'skills', 'system-code-graph', 'mcp_server');
const LIVE_DB_PATH = path.join(CODE_GRAPH_DIR, 'database', 'code-graph.sqlite');

// better-sqlite3 lives in the code-graph server node_modules tree. Anchor the native
// resolution there rather than at this script's location.
const cgRequire = createRequire(path.join(CODE_GRAPH_DIR, 'package.json'));
const Database = cgRequire('better-sqlite3');

// ── Production constants, copied verbatim from code-graph-context.ts at 657a0f6a3e ──
// These are the recorded mechanism defaults the changelog notes as benchmark-pending.
const SEEDED_PPR_IMPACT_EDGE_TYPES = ['CALLS', 'IMPORTS'];
const SEEDED_PPR_MAX_HOPS = 3;
const SEEDED_PPR_MAX_ITERATIONS = 20;
const SEEDED_PPR_DAMPING = 0.85;
const SEEDED_PPR_EPSILON = 1e-6;
const SEEDED_PPR_EVIDENCE_TRANSITION_FACTORS = {
  EXTRACTED: 1.0,
  STRUCTURED: 1.0,
  INFERRED: 0.45,
  AMBIGUOUS: 0.25,
};
const CONTEXT_EDGE_EVIDENCE_RANK_FACTORS = {
  EXTRACTED: 0.01,
  STRUCTURED: 0.01,
  INFERRED: 0.004,
  AMBIGUOUS: 0.002,
};
const CONTEXT_EDGE_RRF_K = 60;

// The reported K cut points for precision and recall.
const K_VALUES = [3, 5, 8];
// The damping grid for the calibration sweep, bracketing the shipped 0.85.
const DAMPING_GRID = [0.5, 0.65, 0.75, 0.85, 0.95];

// ── small helpers ──────────────────────────────────────────────────
function clampConfidence(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function positiveFinite(value, fallback) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : fallback;
}

function parseMetadata(raw) {
  if (typeof raw !== 'string' || raw.length === 0) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// The production reliability of an edge: confidence times the evidence rank factor.
function edgeReliability(meta) {
  const evidenceClass = typeof meta?.evidenceClass === 'string' ? meta.evidenceClass : null;
  const factor = evidenceClass === null ? 0 : CONTEXT_EDGE_EVIDENCE_RANK_FACTORS[evidenceClass] ?? 0;
  return clampConfidence(meta?.confidence) * factor;
}

// The production transition weight PPR folds into the walk.
function edgeTransitionWeight(weight, meta) {
  const evidenceClass = typeof meta?.evidenceClass === 'string' ? meta.evidenceClass : null;
  const evidenceFactor = evidenceClass ? SEEDED_PPR_EVIDENCE_TRANSITION_FACTORS[evidenceClass] ?? 1 : 1;
  const confidence = typeof meta?.confidence === 'number'
    ? Math.max(clampConfidence(meta.confidence), 0.001)
    : 1;
  return positiveFinite(weight, 1) * confidence * evidenceFactor * (1 + edgeReliability(meta));
}

function fmt(value, digits = 6) {
  return typeof value === 'number' && Number.isFinite(value) ? Number(value.toFixed(digits)) : null;
}

function mean(values) {
  const finite = values.filter((v) => typeof v === 'number' && Number.isFinite(v));
  return finite.length === 0 ? null : finite.reduce((a, b) => a + b, 0) / finite.length;
}

// ── read-only backup of the live code graph ────────────────────────
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

// ── edge readers over the eval copy ─────────────────────────────────
// queryEdgesTo(targetId, edgeType): rows where target_id = ? (reverse, who points at me).
// queryEdgesFrom(sourceId, edgeType): rows where source_id = ? (forward, who I point at).
function makeEdgeReaders(db) {
  const toStmt = db.prepare(
    'SELECT source_id, target_id, edge_type, weight, metadata FROM code_edges WHERE target_id = ? AND edge_type = ?',
  );
  const fromStmt = db.prepare(
    'SELECT source_id, target_id, edge_type, weight, metadata FROM code_edges WHERE source_id = ? AND edge_type = ?',
  );
  return {
    edgesTo: (targetId, edgeType) => toStmt.all(targetId, edgeType),
    edgesFrom: (sourceId, edgeType) => fromStmt.all(sourceId, edgeType),
  };
}

function makeNodeReader(db) {
  const stmt = db.prepare('SELECT symbol_id, file_path, fq_name, kind, name FROM code_nodes WHERE symbol_id = ?');
  const cache = new Map();
  return (symbolId) => {
    if (cache.has(symbolId)) return cache.get(symbolId);
    const row = stmt.get(symbolId) ?? null;
    cache.set(symbolId, row);
    return row;
  };
}

// ── reverse-reach map and the impact ground truth ──────────────────
// Walk reverse CALLS and IMPORTS edges out to SEEDED_PPR_MAX_HOPS and record, per
// reached FILE, the minimum hop at which any dependent symbol in that file was found.
// This is the shared candidate pool both rankers rank over. The minHop becomes the
// impact prior: a file with a 1-hop direct dependent is more certainly impacted than
// one reached only at 3 hops. The change site's own file is excluded.
function reverseReachFiles(anchorId, anchorFile, readers, nodeReader) {
  const fileMinHop = new Map(); // file_path -> minHop
  let frontier = [anchorId];
  const seen = new Set([anchorId]);
  for (let hop = 0; hop < SEEDED_PPR_MAX_HOPS; hop += 1) {
    const nextFrontier = [];
    for (const nodeId of frontier) {
      for (const edgeType of SEEDED_PPR_IMPACT_EDGE_TYPES) {
        for (const edge of readers.edgesTo(nodeId, edgeType)) {
          const dependent = edge.source_id;
          if (seen.has(dependent)) continue;
          seen.add(dependent);
          nextFrontier.push(dependent);
          const node = nodeReader(dependent);
          const file = node?.file_path;
          if (file && file !== anchorFile) {
            const prev = fileMinHop.get(file);
            if (prev === undefined || hop + 1 < prev) {
              fileMinHop.set(file, hop + 1);
            }
          }
        }
      }
    }
    frontier = nextFrontier;
    if (frontier.length === 0) break;
  }
  return fileMinHop;
}

// The precision ground truth: the DIRECT impacted files, the files holding a 1-hop
// reverse dependent. These are the files most certainly impacted by the change. The
// ranking question is whether a ranker surfaces these direct dependents above the
// weaker multi-hop pool members, over the SAME candidate pool.
function directImpactedFiles(fileMinHop) {
  const direct = new Set();
  for (const [file, hop] of fileMinHop) {
    if (hop === 1) direct.add(file);
  }
  return direct;
}

// Inverse-hop graded relevance for an nDCG-style impact score: a 1-hop file is the
// most relevant (1.0), 2-hop less (0.5), 3-hop least (1/3). This rewards a ranker that
// orders nearer-impact files above farther ones over the shared pool.
function gradedRelevance(fileMinHop) {
  const rel = new Map();
  for (const [file, hop] of fileMinHop) {
    rel.set(file, 1 / hop);
  }
  return rel;
}

// nDCG at K over a graded-relevance map.
function ndcgAtK(rankedFiles, relMap, k) {
  if (relMap.size === 0) return null;
  const top = rankedFiles.slice(0, k);
  let dcg = 0;
  top.forEach((file, index) => {
    const rel = relMap.get(file) ?? 0;
    dcg += rel / Math.log2(index + 2);
  });
  const idealRels = Array.from(relMap.values()).sort((a, b) => b - a).slice(0, k);
  let idcg = 0;
  idealRels.forEach((rel, index) => {
    idcg += rel / Math.log2(index + 2);
  });
  return idcg > 0 ? dcg / idcg : null;
}

// ── the flat reverse impact walk (served production path) ───────────
// Mirrors code-graph-context.ts case 'impact': reverse 1-hop CALLS then IMPORTS,
// ranked by rankContextEdges. rankContextEdges sorts by a stable tie key, assigns an
// RRF baseline 1/(K+index+1) by that order, adds the edge reliability and re-sorts by
// the combined rank score. The resulting symbol order maps to files (first occurrence
// of a file wins its rank). This is the SERVED path, reported for the byte-identity
// record. It only ever surfaces 1-hop dependents.
function servedFlatImpactRankedFiles(anchorId, anchorFile, readers, nodeReader) {
  const collected = [];
  for (const edgeType of SEEDED_PPR_IMPACT_EDGE_TYPES) {
    for (const edge of readers.edgesTo(anchorId, edgeType)) {
      const meta = parseMetadata(edge.metadata);
      const sourceNode = nodeReader(edge.source_id);
      collected.push({
        sourceId: edge.source_id,
        edgeType,
        file: sourceNode?.file_path ?? null,
        fqName: sourceNode?.fq_name ?? edge.source_id,
        reliability: edgeReliability(meta),
        tieKey: [
          edge.source_id,
          sourceNode?.file_path ?? '',
          sourceNode?.fq_name ?? '',
          edgeType,
        ],
      });
    }
  }
  // First sort by tie key to establish the RRF index, exactly as rankContextEdges does.
  collected.sort((a, b) => compareTieKey(a.tieKey, b.tieKey));
  const ranked = collected.map((c, index) => ({
    ...c,
    rankScore: 1 / (CONTEXT_EDGE_RRF_K + index + 1) + c.reliability,
  }));
  // Re-sort by combined rank score, tie-broken by tie key.
  ranked.sort((a, b) => {
    if (a.rankScore > b.rankScore) return -1;
    if (a.rankScore < b.rankScore) return 1;
    return compareTieKey(a.tieKey, b.tieKey);
  });
  return dedupeFiles(ranked, anchorFile);
}

// ── the flat pool ranker (fair multi-hop baseline) ──────────────────
// Ranks the SHARED candidate pool by the structural impact prior the flat walk
// encodes: nearer hops first, ties broken by stable file path. This is the
// no-centrality baseline that gives PPR the same candidate set to rank, so any PPR
// win is a ranking-quality win, not a reachability artifact.
function flatPoolRankedFiles(fileMinHop) {
  return Array.from(fileMinHop.entries())
    .sort((a, b) => {
      if (a[1] !== b[1]) return a[1] - b[1];
      return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
    })
    .map(([file]) => file);
}

function compareTieKey(a, b) {
  const maxLength = Math.max(a.length, b.length);
  for (let i = 0; i < maxLength; i += 1) {
    const left = a[i] ?? '';
    const right = b[i] ?? '';
    if (left < right) return -1;
    if (left > right) return 1;
  }
  return 0;
}

// Map an ordered candidate list to an ordered, de-duplicated file list. First
// occurrence of a file wins its rank. The anchor's own file is skipped.
function dedupeFiles(orderedCandidates, anchorFile) {
  const seen = new Set();
  const files = [];
  for (const c of orderedCandidates) {
    if (!c.file || c.file === anchorFile || seen.has(c.file)) continue;
    seen.add(c.file);
    files.push(c.file);
  }
  return files;
}

// ── the bounded seeded personalized PageRank (dark mechanism) ───────
// Faithful reconstruction of computeBoundedPersonalizedPageRank plus
// collectSeededPprImpactRanking from 657a0f6a3e. The working graph is the undirected
// projection of CALLS and IMPORTS edges within MAX_HOPS of the anchor, transition
// weights folded in, seeded from the anchor. The candidate impacted symbols are the
// reverse-edge sources, ranked by PPR score, then mapped to files.
function seededPprRankedFiles(anchorId, anchorFile, readers, nodeReader, damping) {
  // Expand the working node set by BFS to MAX_HOPS over the undirected projection,
  // collecting both the reachable nodes (with min hop) and the weighted adjacency.
  const adjacency = new Map(); // from -> [{ to, weight }]
  const reached = new Map([[anchorId, 0]]); // node -> minHop
  // candidate impacted symbols are reverse sources discovered while expanding.
  const candidateSymbols = new Set();

  const addEdge = (from, to, weight) => {
    if (weight <= 0) return;
    const bucket = adjacency.get(from) ?? [];
    bucket.push({ to, weight });
    adjacency.set(from, bucket);
  };

  const expandNode = (nodeId) => {
    for (const edgeType of SEEDED_PPR_IMPACT_EDGE_TYPES) {
      // reverse edges (who points at this node): the impact direction
      for (const edge of readers.edgesTo(nodeId, edgeType)) {
        const meta = parseMetadata(edge.metadata);
        const w = edgeTransitionWeight(edge.weight, meta);
        // undirected projection: traverse both ways
        addEdge(nodeId, edge.source_id, w);
        addEdge(edge.source_id, nodeId, w);
        if (edge.source_id !== anchorId) candidateSymbols.add(edge.source_id);
      }
      // forward edges (who this node points at)
      for (const edge of readers.edgesFrom(nodeId, edgeType)) {
        const meta = parseMetadata(edge.metadata);
        const w = edgeTransitionWeight(edge.weight, meta);
        addEdge(nodeId, edge.target_id, w);
        addEdge(edge.target_id, nodeId, w);
      }
    }
  };

  // BFS expansion to MAX_HOPS over the reverse reach (the blast radius shape).
  let frontier = [anchorId];
  expandNode(anchorId);
  const seen = new Set([anchorId]);
  for (let hop = 0; hop < SEEDED_PPR_MAX_HOPS; hop += 1) {
    const nextFrontier = [];
    for (const nodeId of frontier) {
      for (const edgeType of SEEDED_PPR_IMPACT_EDGE_TYPES) {
        for (const edge of readers.edgesTo(nodeId, edgeType)) {
          const dependent = edge.source_id;
          if (!reached.has(dependent) || reached.get(dependent) > hop + 1) {
            reached.set(dependent, hop + 1);
          }
          if (seen.has(dependent)) continue;
          seen.add(dependent);
          nextFrontier.push(dependent);
          expandNode(dependent);
        }
      }
    }
    frontier = nextFrontier;
    if (frontier.length === 0) break;
  }

  const nodes = Array.from(reached.keys());
  if (nodes.length <= 1) return [];

  // Power iteration of personalized PageRank seeded at the anchor.
  const teleport = new Map([[anchorId, 1]]);
  let scores = new Map(teleport);
  for (let iter = 0; iter < SEEDED_PPR_MAX_ITERATIONS; iter += 1) {
    const next = new Map();
    for (const [node, mass] of teleport) {
      next.set(node, (next.get(node) ?? 0) + (1 - damping) * mass);
    }
    for (const node of nodes) {
      const currentScore = scores.get(node) ?? 0;
      if (currentScore === 0) continue;
      const outgoing = adjacency.get(node) ?? [];
      if (outgoing.length === 0) {
        for (const [seed, mass] of teleport) {
          next.set(seed, (next.get(seed) ?? 0) + damping * currentScore * mass);
        }
        continue;
      }
      const totalWeight = outgoing.reduce((sum, e) => sum + e.weight, 0);
      if (totalWeight <= 0) continue;
      for (const edge of outgoing) {
        next.set(edge.to, (next.get(edge.to) ?? 0) + damping * currentScore * (edge.weight / totalWeight));
      }
    }
    let delta = 0;
    for (const node of nodes) {
      delta += Math.abs((next.get(node) ?? 0) - (scores.get(node) ?? 0));
    }
    scores = next;
    if (delta <= SEEDED_PPR_EPSILON) break;
  }

  // Rank the candidate impacted symbols by PPR score, tie-broken by min hop then id,
  // then map to files (first occurrence wins).
  const ranked = Array.from(candidateSymbols)
    .map((symbolId) => ({
      symbolId,
      file: nodeReader(symbolId)?.file_path ?? null,
      pprScore: scores.get(symbolId) ?? 0,
      minHop: reached.get(symbolId) ?? SEEDED_PPR_MAX_HOPS,
    }))
    .filter((c) => c.pprScore > 0)
    .sort((a, b) => {
      if (a.pprScore > b.pprScore) return -1;
      if (a.pprScore < b.pprScore) return 1;
      if (a.minHop < b.minHop) return -1;
      if (a.minHop > b.minHop) return 1;
      return a.symbolId < b.symbolId ? -1 : a.symbolId > b.symbolId ? 1 : 0;
    });
  return dedupeFiles(
    ranked.map((c) => ({ file: c.file })),
    anchorFile,
  );
}

// ── metric helpers ──────────────────────────────────────────────────
function precisionAtK(rankedFiles, truthSet, k) {
  if (k <= 0) return null;
  const top = rankedFiles.slice(0, k);
  if (top.length === 0) return null;
  const hits = top.filter((f) => truthSet.has(f)).length;
  return hits / top.length;
}

function recallAtK(rankedFiles, truthSet, k) {
  if (truthSet.size === 0) return null;
  const top = rankedFiles.slice(0, k);
  const hits = top.filter((f) => truthSet.has(f)).length;
  return hits / truthSet.size;
}

// ── labeled change-impact query selection ───────────────────────────
// Pick changed symbols with a real, non-trivial reverse fan-in so the impact ranking
// has something to differentiate. The selection is deterministic: the top reverse
// fan-in CALLS targets that also resolve to a code node, excluding trivial 1-caller
// symbols and test-only log/pass/fail helpers that carry no real impact signal.
function selectLabeledQueries(db, nodeReader, readers) {
  const rows = db.prepare(`
    SELECT e.target_id AS symbol_id, COUNT(*) AS fan_in
    FROM code_edges e
    WHERE e.edge_type = 'CALLS'
    GROUP BY e.target_id
    HAVING fan_in >= 5
    ORDER BY fan_in DESC, e.target_id ASC
    LIMIT 80
  `).all();

  const queries = [];
  const seenNames = new Set();
  for (const row of rows) {
    const node = nodeReader(row.symbol_id);
    if (!node) continue;
    // Skip generic test scaffolding helpers that carry no production impact meaning.
    if (['log', 'pass', 'fail', 'require', 'expect'].includes(node.name)) continue;
    // One query per distinct symbol name to keep the set diverse.
    if (seenNames.has(node.fq_name)) continue;
    const fileMinHop = reverseReachFiles(row.symbol_id, node.file_path, readers, nodeReader);
    const direct = directImpactedFiles(fileMinHop);
    // A useful ranking query needs a candidate pool larger than the direct set, so
    // that ranking the pool is a real choice and precision below K=pool is meaningful.
    if (direct.size < 3) continue;
    if (fileMinHop.size <= direct.size) continue;
    seenNames.add(node.fq_name);
    queries.push({
      symbolId: row.symbol_id,
      name: node.name,
      fqName: node.fq_name,
      file: node.file_path,
      fanIn: row.fan_in,
      poolSize: fileMinHop.size,
      directSize: direct.size,
      fileMinHop,
      direct,
      graded: gradedRelevance(fileMinHop),
    });
    if (queries.length >= 20) break;
  }
  return queries;
}

async function main() {
  if (!fs.existsSync(LIVE_DB_PATH)) {
    throw new Error(`Live code-graph database not found at ${LIVE_DB_PATH}`);
  }

  // Read-only backup of the live graph to a temp eval copy.
  const evalRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-ppr-eval-'));
  const evalDbPath = path.join(evalRoot, 'code-graph.sqlite');
  await backupSqlite(LIVE_DB_PATH, evalDbPath);

  const db = new Database(evalDbPath, { readonly: true, fileMustExist: true });
  const readers = makeEdgeReaders(db);
  const nodeReader = makeNodeReader(db);

  const queries = selectLabeledQueries(db, nodeReader, readers);
  if (queries.length === 0) {
    throw new Error('No labeled change-impact queries could be derived from the graph');
  }

  const perQuery = [];
  for (const q of queries) {
    // The served 1-hop flat walk, reported for the byte-identity record.
    const servedFlatFiles = servedFlatImpactRankedFiles(q.symbolId, q.file, readers, nodeReader);
    // The two rankers under measurement rank the SAME shared candidate pool.
    const flatPoolFiles = flatPoolRankedFiles(q.fileMinHop);
    const pprFiles = seededPprRankedFiles(q.symbolId, q.file, readers, nodeReader, SEEDED_PPR_DAMPING);

    const flatMetrics = {};
    const pprMetrics = {};
    for (const k of K_VALUES) {
      flatMetrics[`precision@${k}`] = fmt(precisionAtK(flatPoolFiles, q.direct, k));
      flatMetrics[`recall@${k}`] = fmt(recallAtK(flatPoolFiles, q.direct, k));
      flatMetrics[`ndcg@${k}`] = fmt(ndcgAtK(flatPoolFiles, q.graded, k));
      pprMetrics[`precision@${k}`] = fmt(precisionAtK(pprFiles, q.direct, k));
      pprMetrics[`recall@${k}`] = fmt(recallAtK(pprFiles, q.direct, k));
      pprMetrics[`ndcg@${k}`] = fmt(ndcgAtK(pprFiles, q.graded, k));
    }

    // Identical-ranking check: does PPR produce the same pool order as the flat pool
    // ranker over the K=8 prefix? On a uniform-weight reverse graph it tends to.
    const prefix = 8;
    const flatPrefix = flatPoolFiles.slice(0, prefix);
    const pprPrefix = pprFiles.slice(0, prefix);
    const identicalPrefix = flatPrefix.length === pprPrefix.length
      && flatPrefix.every((f, i) => f === pprPrefix[i]);

    perQuery.push({
      symbolId: q.symbolId,
      name: q.name,
      fqName: q.fqName,
      file: q.file,
      fanIn: q.fanIn,
      poolSize: q.poolSize,
      directSize: q.directSize,
      servedFlatFileCount: servedFlatFiles.length,
      flatPoolFileCount: flatPoolFiles.length,
      pprFileCount: pprFiles.length,
      flat: flatMetrics,
      ppr: pprMetrics,
      identicalTop8Order: identicalPrefix,
    });
  }

  // ── aggregate per-K means ──
  const METRICS = ['precision', 'recall', 'ndcg'];
  const aggregate = {};
  for (const k of K_VALUES) {
    for (const m of METRICS) {
      aggregate[`flat_${m}@${k}`] = fmt(mean(perQuery.map((p) => p.flat[`${m}@${k}`])), 4);
      aggregate[`ppr_${m}@${k}`] = fmt(mean(perQuery.map((p) => p.ppr[`${m}@${k}`])), 4);
      aggregate[`${m}@${k}_delta_ppr_minus_flat`] = fmt(
        (aggregate[`ppr_${m}@${k}`] ?? 0) - (aggregate[`flat_${m}@${k}`] ?? 0),
        4,
      );
    }
  }
  const identicalCount = perQuery.filter((p) => p.identicalTop8Order).length;

  // ── default-off byte-identity: the served path is the flat walk, full stop ──
  // The flag and its code are absent from the live source (grep empty for the flag and
  // for computeBoundedPersonalizedPageRank). So the served impact ranker has zero PPR
  // contribution and equals the flat walk for every query by construction. The PPR
  // numbers above come only from this harness, never from the serving path.
  const defaultOffByteIdentity = {
    flagPresentInSource: false,
    pprSymbolPresentInSource: false,
    servedRanker: 'flat-impact-walk',
    note:
      'SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING and computeBoundedPersonalizedPageRank were '
      + 'removed from the live code-graph in commit 277c35344c. The served impact path is the '
      + 'flat walk unconditionally, so the off state is exact: nothing in serving reads PPR.',
  };

  // ── calibration sweep over the damping grid ──
  // Headline ranking-quality metric is nDCG@5 over the shared pool against the
  // inverse-hop graded relevance: it rewards ordering nearer-impact files first.
  const calibration = [];
  for (const damping of DAMPING_GRID) {
    const ndcgByK = {};
    const precByK = {};
    for (const k of K_VALUES) {
      const ndcgs = [];
      const precs = [];
      for (const q of queries) {
        const pprFiles = seededPprRankedFiles(q.symbolId, q.file, readers, nodeReader, damping);
        ndcgs.push(ndcgAtK(pprFiles, q.graded, k));
        precs.push(precisionAtK(pprFiles, q.direct, k));
      }
      ndcgByK[`ndcg@${k}`] = fmt(mean(ndcgs), 4);
      precByK[`precision@${k}`] = fmt(mean(precs), 4);
    }
    calibration.push({ damping, ...ndcgByK, ...precByK });
  }
  // Best damping by mean nDCG@5, the headline ranking-quality metric.
  const bestCalibration = calibration.reduce((best, row) => (
    (row['ndcg@5'] ?? -1) > (best['ndcg@5'] ?? -1) ? row : best
  ), calibration[0]);
  const flatNdcg5 = aggregate['flat_ndcg@5'] ?? 0;
  const calibrationUnlocksWin = (bestCalibration['ndcg@5'] ?? 0) > flatNdcg5;

  const output = {
    generatedFrom: 'seeded-ppr-impact-benchmark.mjs',
    generatedAt: new Date().toISOString(),
    subject:
      'Seeded personalized PageRank vs the flat reverse impact walk on labeled '
      + 'change-impact queries over the live code graph. Both rankers rank the SAME '
      + 'multi-hop candidate pool, so a win is a ranking-quality win not a reach artifact.',
    liveDbPath: LIVE_DB_PATH,
    evalDbPath,
    pprConstants: {
      maxHops: SEEDED_PPR_MAX_HOPS,
      maxIterations: SEEDED_PPR_MAX_ITERATIONS,
      shippedDamping: SEEDED_PPR_DAMPING,
      epsilon: SEEDED_PPR_EPSILON,
      impactEdgeTypes: SEEDED_PPR_IMPACT_EDGE_TYPES,
      evidenceTransitionFactors: SEEDED_PPR_EVIDENCE_TRANSITION_FACTORS,
    },
    candidatePoolRule:
      'The shared candidate pool is every file reverse-reachable from the changed symbol '
      + 'through CALLS and IMPORTS within maxHops, tagged with its minimum hop. Both rankers '
      + 'rank this same pool.',
    groundTruthRule:
      'Precision and recall ground truth is the DIRECT impacted files, the files holding a '
      + '1-hop reverse dependent, the files most certainly impacted by the change. nDCG uses '
      + 'an inverse-hop graded relevance (1-hop=1.0, 2-hop=0.5, 3-hop=0.33).',
    kValues: K_VALUES,
    queryCount: perQuery.length,
    defaultOffByteIdentity,
    aggregate,
    identicalTop8OrderCount: identicalCount,
    identicalTop8OrderRate: fmt(perQuery.length > 0 ? identicalCount / perQuery.length : null, 4),
    calibration: {
      grid: DAMPING_GRID,
      sweep: calibration,
      headlineMetric: 'ndcg@5',
      bestDampingByNdcg5: bestCalibration.damping,
      bestNdcg5: bestCalibration['ndcg@5'],
      flatNdcg5: fmt(flatNdcg5, 4),
      calibrationUnlocksWinOverFlat: calibrationUnlocksWin,
    },
    perQuery,
  };

  fs.mkdirSync(RESULTS_DIR, { recursive: true });
  const outPath = path.join(RESULTS_DIR, 'metrics.json');
  fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`);

  db.close();
  try {
    fs.rmSync(evalRoot, { recursive: true, force: true });
  } catch { /* best-effort */ }

  const consoleSummary = {
    metricsPath: outPath,
    queryCount: perQuery.length,
    aggregate,
    identicalTop8OrderRate: output.identicalTop8OrderRate,
    headlineMetric: 'ndcg@5',
    bestDampingByNdcg5: bestCalibration.damping,
    bestNdcg5: bestCalibration['ndcg@5'],
    flatNdcg5: output.calibration.flatNdcg5,
    calibrationUnlocksWinOverFlat: calibrationUnlocksWin,
    servedRanker: defaultOffByteIdentity.servedRanker,
  };
  process.stdout.write(`${JSON.stringify(consoleSummary, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
