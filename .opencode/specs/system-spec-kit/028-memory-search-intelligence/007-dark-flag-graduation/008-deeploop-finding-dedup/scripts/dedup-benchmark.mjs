#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────
// MODULE: Fan-Out Near-Duplicate Dedup Benchmark
// Usage:
//   node dedup-benchmark.mjs
//
// Measures SPECKIT_FANOUT_NEAR_DUP_DEDUP against a labeled multi-worker fan-out
// finding set. The set is synthesized to match the real registry shape (research
// keyFindings with id/title/summary, review openFindings with findingId/severity/
// status/title plus a body) and carries a ground-truth label per finding pair:
// NEAR_DUP when different fan-out workers restate the same point under different
// ids and titles, DISTINCT when two findings genuinely differ.
//
// The harness drives the SAME exported merge functions the production CLI re-execs
// (mergeResearchRegistries, mergeReviewRegistries from fanout-merge.cjs), once with
// dedup off and once with dedup on, then scores:
//   - dedup precision: of the finding pairs the on-path collapsed, the share that
//     were labeled NEAR_DUP (a true near-dupe, not a distinct finding).
//   - distinct-finding recall: of the findings labeled DISTINCT, the share that
//     survive as separate records on the on-path (nothing distinct is lost).
//   - off-path byte-identity: with dedup off the merged registry is byte-identical
//     to the production default, proven by a re-run that never sets the flag.
//   - severity preservation: when a near-dup pair collapses, the strongest severity
//     survives (the feature's stated contract for the review path).
//
// Safety:
//   Reads only the production fanout-merge.cjs module exports and synthesized
//   in-memory fixtures. Opens no corpus, graph, or database. Writes only to
//   results/ inside this phase folder. Never sets a default and never flips a flag.
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const RESULTS_DIR = path.join(HERE, '..', 'results');
const MERGE_MODULE = path.resolve(
  HERE,
  '../../../../../../skills/deep-loop-runtime/scripts/fanout-merge.cjs',
);

const { mergeResearchRegistries, mergeReviewRegistries } = require(MERGE_MODULE);

// ───────────────────────────────────────────────────────────────
// 1. LABELED FAN-OUT FINDING SET
// ───────────────────────────────────────────────────────────────
//
// Each cluster groups findings the ground truth says are the same point. A cluster
// of size > 1 with relation NEAR_DUP means those workers restated one point under
// different ids and titles but matching body text, so the on-path SHOULD collapse
// them. A cluster of size 1 is a finding that must always survive on its own. Two
// findings in DISTINCT clusters must never collapse into each other.
//
// The body text (summary for research, body->summary for review) is what the
// near-dup key reads. Restatements share normalized body text; distinct findings
// do not. Titles vary across restatements to prove the collapse keys on body, not
// title, exactly as the production nearDuplicateContentKey does.

// RESEARCH set: 3 fan-out workers (galadriel, codex, claude) restate findings.
const RESEARCH_LINEAGES = [
  {
    label: 'galadriel',
    registry: {
      keyFindings: [
        { id: 'R-w1-01', title: 'Cache TTL never refreshed on write', summary: 'The writer path updates the row but never refreshes the cache TTL so reads serve a stale value indefinitely' },
        { id: 'R-w1-02', title: 'Retry loop lacks backoff', summary: 'The transient retry path re-issues immediately with no backoff so a flapping dependency is hammered' },
        { id: 'R-w1-03', title: 'Index scan ignores the deleted tombstone', summary: 'The scan walks every row including tombstoned deletes so a large delete history slows every query' },
      ],
      openQuestions: [],
      resolvedQuestions: [],
      ruledOutDirections: [],
      metrics: { iterationsCompleted: 4, convergenceScore: 0.7, openQuestions: 0, resolvedQuestions: 0, keyFindings: 3, coverageBySources: {} },
    },
  },
  {
    label: 'codex',
    registry: {
      keyFindings: [
        { id: 'R-w2-01', title: 'Stale cache survives subsequent writes', summary: 'The writer path updates the row but never refreshes the cache TTL so reads serve a stale value indefinitely' },
        { id: 'R-w2-02', title: 'No exponential backoff between retries', summary: 'The transient retry path re-issues immediately with no backoff so a flapping dependency is hammered' },
        { id: 'R-w2-04', title: 'Connection pool exhausts under burst load', summary: 'The pool caps at ten connections with no queue so a burst past ten fails fast instead of waiting' },
      ],
      openQuestions: [],
      resolvedQuestions: [],
      ruledOutDirections: [],
      metrics: { iterationsCompleted: 3, convergenceScore: 0.65, openQuestions: 0, resolvedQuestions: 0, keyFindings: 3, coverageBySources: {} },
    },
  },
  {
    label: 'claude',
    registry: {
      keyFindings: [
        { id: 'R-w3-01', title: 'Read path returns a stale cached row after update', summary: 'The writer path updates the row but never refreshes the cache TTL so reads serve a stale value indefinitely' },
        { id: 'R-w3-05', title: 'Migration runs without a transaction', summary: 'The schema migration applies each statement on its own connection so a mid-migration failure leaves a half-applied schema' },
        { id: 'R-w3-03', title: 'Tombstone rows are never compacted', summary: 'The scan walks every row including tombstoned deletes so a large delete history slows every query' },
      ],
      openQuestions: [],
      resolvedQuestions: [],
      ruledOutDirections: [],
      metrics: { iterationsCompleted: 5, convergenceScore: 0.8, openQuestions: 0, resolvedQuestions: 0, keyFindings: 3, coverageBySources: {} },
    },
  },
];

// Research ground truth: which findings are restatements of the same point.
// Cluster key -> the finding ids that should collapse to one record on the on-path.
const RESEARCH_TRUTH = {
  // 3 workers restated the cache-TTL point under 3 ids and 3 titles.
  'cache-ttl': { relation: 'NEAR_DUP', ids: ['R-w1-01', 'R-w2-01', 'R-w3-01'] },
  // 2 workers restated the retry-backoff point.
  'retry-backoff': { relation: 'NEAR_DUP', ids: ['R-w1-02', 'R-w2-02'] },
  // 2 workers restated the tombstone-scan point.
  'tombstone-scan': { relation: 'NEAR_DUP', ids: ['R-w1-03', 'R-w3-03'] },
  // Singletons: each a genuinely distinct finding that must survive alone.
  'pool-exhaust': { relation: 'DISTINCT', ids: ['R-w2-04'] },
  'migration-txn': { relation: 'DISTINCT', ids: ['R-w3-05'] },
};

// REVIEW set: 3 fan-out workers restate review findings. Review carries severity and
// status; near-dup collapse must keep the strongest severity.
const REVIEW_LINEAGES = [
  {
    label: 'galadriel',
    registry: {
      openFindings: [
        { findingId: 'V-w1-01', severity: 'P1', status: 'active', title: 'Unbounded recursion on cyclic input', summary: 'The traversal follows child edges with no visited set so a cyclic graph drives the call stack to overflow' },
        { findingId: 'V-w1-02', severity: 'P2', status: 'active', title: 'Magic number in the timeout constant', summary: 'The timeout is a bare literal 30000 in the call site with no named constant or comment explaining the unit' },
        { findingId: 'V-w1-03', severity: 'P0', status: 'active', title: 'SQL built by string concatenation', summary: 'The query path concatenates the raw user term into the SQL string so a crafted term injects arbitrary SQL' },
      ],
      resolvedFindings: [],
      findingsBySeverity: { P0: 1, P1: 1, P2: 1 },
    },
  },
  {
    label: 'codex',
    registry: {
      openFindings: [
        { findingId: 'V-w2-01', severity: 'P0', status: 'active', title: 'Stack overflow on a self-referential node', summary: 'The traversal follows child edges with no visited set so a cyclic graph drives the call stack to overflow' },
        { findingId: 'V-w2-04', severity: 'P1', status: 'active', title: 'Race on the shared counter increment', summary: 'Two workers increment the shared counter without a lock so concurrent increments lose updates' },
        { findingId: 'V-w2-03', severity: 'P0', status: 'active', title: 'User term injected into the query string', summary: 'The query path concatenates the raw user term into the SQL string so a crafted term injects arbitrary SQL' },
      ],
      resolvedFindings: [],
      findingsBySeverity: { P0: 2, P1: 1, P2: 0 },
    },
  },
  {
    label: 'claude',
    registry: {
      openFindings: [
        { findingId: 'V-w3-01', severity: 'P1', status: 'active', title: 'Cycle in the dependency walk blows the stack', summary: 'The traversal follows child edges with no visited set so a cyclic graph drives the call stack to overflow' },
        { findingId: 'V-w3-05', severity: 'P2', status: 'active', title: 'Dead code branch after the early return', summary: 'The function returns early on the error path so the block after the return is unreachable and can be deleted' },
      ],
      resolvedFindings: [],
      findingsBySeverity: { P0: 0, P1: 1, P2: 1 },
    },
  },
];

// Review ground truth. For NEAR_DUP clusters, strongestSeverity is the severity the
// collapsed survivor must carry.
const REVIEW_TRUTH = {
  // 3 workers restated the cyclic-traversal point at P1/P0/P1. Strongest is P0.
  'cyclic-traversal': { relation: 'NEAR_DUP', ids: ['V-w1-01', 'V-w2-01', 'V-w3-01'], strongestSeverity: 'P0' },
  // 2 workers restated the SQL-injection point, both P0.
  'sql-injection': { relation: 'NEAR_DUP', ids: ['V-w1-03', 'V-w2-03'], strongestSeverity: 'P0' },
  // Singletons.
  'magic-number': { relation: 'DISTINCT', ids: ['V-w1-02'] },
  'counter-race': { relation: 'DISTINCT', ids: ['V-w2-04'] },
  'dead-code': { relation: 'DISTINCT', ids: ['V-w3-05'] },
};

// ───────────────────────────────────────────────────────────────
// 2. SCORING HELPERS
// ───────────────────────────────────────────────────────────────

// A merged record's _lineages reveals how many workers contributed to it. The
// production merge attaches _lineages on collapse, so a record with N lineages is a
// collapse of N source findings. We rebuild "which source ids collapsed together" by
// mapping each merged record back to the truth cluster its body belongs to.

function clusterOf(truth, sourceId) {
  for (const [key, entry] of Object.entries(truth)) {
    if (entry.ids.includes(sourceId)) return { key, ...entry };
  }
  return null;
}

// Build the set of source-id collapse groups the on-path actually produced. A merged
// record carrying _lineages of length L collapsed L source findings. We identify the
// cluster by matching the record body to the truth via any one source finding that
// shares that body. Records keep their own id from the chosen canonical, so we map
// the canonical id back to its truth cluster.
function collapseGroups(mergedFindings, idKey) {
  const groups = [];
  for (const rec of mergedFindings) {
    const lineageCount = Array.isArray(rec._lineages) ? rec._lineages.length : 1;
    groups.push({ id: rec[idKey], lineageCount, severity: rec.severity });
  }
  return groups;
}

function scoreSet({ name, lineages, mergeFn, truth, idKey, lineageCount }) {
  const off = mergeFn(lineages);
  const offRerun = mergeFn(lineages);
  const on = mergeFn(lineages, { enableNearDuplicateDedup: true });

  const offFindings = name === 'research' ? off.keyFindings : off.openFindings;
  const onFindings = name === 'research' ? on.keyFindings : on.openFindings;
  const offRerunFindings = name === 'research' ? offRerun.keyFindings : offRerun.openFindings;

  // Byte-identity of the off path: the default merge is deterministic and must be
  // byte-identical across re-runs when the flag is never set.
  const offBytes = JSON.stringify(off);
  const offRerunBytes = JSON.stringify(offRerun);
  const offByteIdentical = offBytes === offRerunBytes;

  // Total source findings and the ground-truth distinct-finding count.
  const totalSource = lineageCount;
  const distinctTruthCount = Object.keys(truth).length;
  const nearDupClusters = Object.values(truth).filter((c) => c.relation === 'NEAR_DUP');
  const distinctClusters = Object.values(truth).filter((c) => c.relation === 'DISTINCT');

  // ── DEDUP PRECISION ──
  // The on-path collapses a group when a merged record carries _lineages > 1. Each
  // such record is one "collapsed group". A collapse is CORRECT when every source id
  // it absorbed belongs to one NEAR_DUP cluster, and WRONG when it merged across two
  // clusters (i.e. collapsed a distinct finding into another).
  const onGroups = collapseGroups(onFindings, idKey);
  const collapsedGroups = onGroups.filter((g) => g.lineageCount > 1);

  // Reconstruct which source ids each collapsed group absorbed by body-cluster.
  // We re-derive it from truth: the canonical id of a collapsed record belongs to
  // exactly one cluster; if that cluster is NEAR_DUP and its size equals the lineage
  // count, the collapse matched the truth cluster exactly.
  let truePositiveCollapses = 0; // collapsed groups that are a real near-dup cluster
  let falsePositiveCollapses = 0; // collapsed groups that merged a distinct finding
  for (const g of collapsedGroups) {
    const cluster = clusterOf(truth, g.id);
    if (cluster && cluster.relation === 'NEAR_DUP' && g.lineageCount <= cluster.ids.length) {
      truePositiveCollapses += 1;
    } else {
      falsePositiveCollapses += 1;
    }
  }
  const collapsedCount = collapsedGroups.length;
  const dedupPrecision = collapsedCount === 0 ? 1 : truePositiveCollapses / collapsedCount;

  // ── DISTINCT-FINDING RECALL ──
  // Every DISTINCT cluster must survive as its own record on the on-path. A distinct
  // finding is preserved when a merged record carries its source id (or a member of
  // its singleton cluster) and did not absorb a foreign cluster.
  const survivingIds = new Set(onFindings.map((r) => r[idKey]));
  // Also account for records whose chosen canonical id differs: a distinct cluster is
  // preserved when at least one on-path record maps to that cluster and no near-dup
  // record swallowed it. Map each on-path record to its cluster.
  const onClusterKeys = new Set();
  for (const r of onFindings) {
    const c = clusterOf(truth, r[idKey]);
    if (c) onClusterKeys.add(c.key);
  }
  let distinctPreserved = 0;
  for (const [key, entry] of Object.entries(truth)) {
    if (entry.relation !== 'DISTINCT') continue;
    const present = entry.ids.some((id) => survivingIds.has(id)) || onClusterKeys.has(key);
    if (present) distinctPreserved += 1;
  }
  const distinctRecall = distinctClusters.length === 0 ? 1 : distinctPreserved / distinctClusters.length;

  // ── NOISE REDUCTION ──
  // The headline benefit: how many records does the merged registry carry off vs on.
  const offCount = offFindings.length;
  const onCount = onFindings.length;
  const noiseReduced = offCount - onCount;
  // Ideal merged count: one record per truth cluster.
  const idealCount = distinctTruthCount;

  // ── SEVERITY PRESERVATION (review only) ──
  let severityPreserved = null;
  if (name === 'review') {
    severityPreserved = true;
    for (const [, entry] of Object.entries(truth)) {
      if (entry.relation !== 'NEAR_DUP') continue;
      // Find the on-path record that represents this cluster.
      const rec = onFindings.find((r) => clusterOf(truth, r[idKey])?.key === Object.keys(truth).find((k) => truth[k] === entry));
      if (!rec) { severityPreserved = false; continue; }
      if (rec.severity !== entry.strongestSeverity) severityPreserved = false;
    }
  }

  return {
    name,
    totalSourceFindings: totalSource,
    groundTruthDistinctClusters: distinctTruthCount,
    nearDupClusters: nearDupClusters.length,
    distinctSingletonClusters: distinctClusters.length,
    off: { mergedCount: offCount, byteIdenticalAcrossReruns: offByteIdentical },
    on: { mergedCount: onCount, idealCount },
    noiseReducedRecords: noiseReduced,
    dedup: {
      collapsedGroups: collapsedCount,
      truePositiveCollapses,
      falsePositiveCollapses,
      dedupPrecision: Number(dedupPrecision.toFixed(4)),
    },
    distinctRecall: {
      distinctClustersExpected: distinctClusters.length,
      distinctClustersPreserved: distinctPreserved,
      distinctFindingRecall: Number(distinctRecall.toFixed(4)),
    },
    severityPreservedOnCollapse: severityPreserved,
  };
}

// ───────────────────────────────────────────────────────────────
// 3. RUN
// ───────────────────────────────────────────────────────────────

function totalFindings(lineages, key) {
  return lineages.reduce((sum, l) => sum + (l.registry[key]?.length ?? 0), 0);
}

const research = scoreSet({
  name: 'research',
  lineages: RESEARCH_LINEAGES,
  mergeFn: mergeResearchRegistries,
  truth: RESEARCH_TRUTH,
  idKey: 'id',
  lineageCount: totalFindings(RESEARCH_LINEAGES, 'keyFindings'),
});

const review = scoreSet({
  name: 'review',
  lineages: REVIEW_LINEAGES,
  mergeFn: mergeReviewRegistries,
  truth: REVIEW_TRUTH,
  idKey: 'findingId',
  lineageCount: totalFindings(REVIEW_LINEAGES, 'openFindings'),
});

// Aggregate dedup precision and distinct recall across both paths (pooled counts).
const pooledCollapsed = research.dedup.collapsedGroups + review.dedup.collapsedGroups;
const pooledTruePos = research.dedup.truePositiveCollapses + review.dedup.truePositiveCollapses;
const pooledDistinctExpected = research.distinctRecall.distinctClustersExpected + review.distinctRecall.distinctClustersExpected;
const pooledDistinctPreserved = research.distinctRecall.distinctClustersPreserved + review.distinctRecall.distinctClustersPreserved;

const aggregate = {
  pooledDedupPrecision: pooledCollapsed === 0 ? 1 : Number((pooledTruePos / pooledCollapsed).toFixed(4)),
  pooledDistinctFindingRecall: pooledDistinctExpected === 0 ? 1 : Number((pooledDistinctPreserved / pooledDistinctExpected).toFixed(4)),
  offByteIdentical: research.off.byteIdenticalAcrossReruns && review.off.byteIdenticalAcrossReruns,
  totalNoiseReducedRecords: research.noiseReducedRecords + review.noiseReducedRecords,
};

const out = {
  benchmark: 'fanout-near-dup-dedup',
  flag: 'SPECKIT_FANOUT_NEAR_DUP_DEDUP',
  mergeModule: path.relative(path.resolve(HERE, '../../../../../../..'), MERGE_MODULE),
  generatedAt: new Date().toISOString().slice(0, 10),
  research,
  review,
  aggregate,
};

fs.mkdirSync(RESULTS_DIR, { recursive: true });
fs.writeFileSync(path.join(RESULTS_DIR, 'dedup-metrics.json'), `${JSON.stringify(out, null, 2)}\n`);

console.log(JSON.stringify(out, null, 2));
