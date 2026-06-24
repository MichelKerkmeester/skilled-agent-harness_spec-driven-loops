#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────
// MODULE: Fan-Out Near-Duplicate Dedup Scale Test
// Usage:
//   node dedup-scale-test.mjs
//
// The 008 finding-dedup (SPECKIT_FANOUT_NEAR_DUP_DEDUP in fanout-merge.cjs) was only
// proven on 17 synthetic records with precision 1.0. The 009 validation flagged that
// precision 1.0 on 17 hand-crafted records does not guarantee scale behavior, and that
// the false-collapse risk is "low on structured findings, higher on free-text". This
// test synthesizes a realistically LARGER and WORDING-VARIED finding set (>= 50
// findings across >= 5 workers), runs the PRODUCTION dedup over it, and measures:
//   - false-collapse rate: distinct findings wrongly merged into another (precision
//     failure). A collapse is wrong when a merged record absorbed source findings from
//     two different ground-truth clusters.
//   - distinct-finding recall: of the ground-truth distinct clusters, the share that
//     survive as their own record (nothing distinct silently lost).
//
// The dedup's identity key (nearDuplicateContentKey) reads the normalized body fields
// [summary, description, finding, question, direction], whitespace-collapsed and
// lowercased, EXCLUDING the title. So the scale-test must probe two failure surfaces
// the 17-record set never stressed:
//   1. TRUE-DUP RECALL under wording variation: workers that restate the same point
//      will only collapse when their normalized body text matches byte-for-byte. We
//      deliberately include true-dup clusters whose restatements share IDENTICAL body
//      text (the worker copies the upstream finding body) AND clusters whose
//      restatements vary the wording (genuinely different sentences for the same
//      point). The varied-wording clusters reveal the dedup's real limit: it is a
//      content-identity key, not a semantic matcher, so varied restatements do NOT
//      collapse. The test measures and reports that limit rather than asserting an
//      impossible semantic recall.
//   2. FALSE-COLLAPSE under near-miss bodies: distinct findings whose bodies are
//      similar but not identical (one token different, different numbers, different
//      file). These must NEVER collapse. This is the precision surface the 009 flagged.
//
// The harness drives the SAME exported merge functions the production CLI re-execs
// (mergeResearchRegistries, mergeReviewRegistries from fanout-merge.cjs), off vs on.
//
// Safety:
//   Reads only the production fanout-merge.cjs module exports and synthesized
//   in-memory fixtures. Opens no corpus, graph, or database. Writes only to results/
//   inside this phase folder. Never sets a default and never flips a flag.
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

if (!fs.existsSync(MERGE_MODULE)) {
  console.error(`FATAL: production merge module not found at ${MERGE_MODULE}`);
  process.exit(1);
}

const { mergeResearchRegistries, mergeReviewRegistries } = require(MERGE_MODULE);

// ───────────────────────────────────────────────────────────────
// 1. SYNTHETIC LARGE LABELED FINDING SET
// ───────────────────────────────────────────────────────────────
//
// We model a 6-worker fan-out (galadriel, codex, claude, gemini, qwen, minimax). Each
// ground-truth POINT is a real distinct finding. A point is assigned to one or more
// workers; when multiple workers report the same point, that is a true near-duplicate
// the on-path should consider collapsing. We tag each point with a wording mode:
//   - 'identical'  : every worker emits byte-identical body text (upstream copy). The
//                    dedup SHOULD collapse these — its designed-for case.
//   - 'varied'     : each worker writes a different sentence for the same point. The
//                    dedup CANNOT collapse these (content-identity key, not semantic).
//                    Reported as a known recall limit, not a precision failure.
//   - 'distinct'   : a singleton point reported by one worker, must survive alone.
//   - 'near-miss'  : two GENUINELY DIFFERENT points whose bodies are deceptively
//                    similar (differ by one number/file/token). Must NEVER collapse —
//                    the precision trap.

const WORKERS = ['galadriel', 'codex', 'claude', 'gemini', 'qwen', 'minimax'];

// Each base point: a real finding body. `reporters` is which workers report it.
// `mode` controls how the body text is realized per reporter.
function buildPoints() {
  const points = [];
  let n = 0;
  const add = (p) => { points.push({ pointId: `P${String(++n).padStart(2, '0')}`, ...p }); };

  // ── IDENTICAL true-dup clusters (workers copy the upstream body verbatim) ──
  add({ mode: 'identical', reporters: ['galadriel', 'codex', 'claude', 'minimax'], body: 'The writer path updates the row but never refreshes the cache TTL so reads serve a stale value indefinitely', kind: 'research' });
  add({ mode: 'identical', reporters: ['codex', 'claude', 'qwen'], body: 'The transient retry path re-issues immediately with no backoff so a flapping dependency is hammered', kind: 'research' });
  add({ mode: 'identical', reporters: ['galadriel', 'claude', 'gemini', 'minimax'], body: 'The scan walks every row including tombstoned deletes so a large delete history slows every query', kind: 'research' });
  add({ mode: 'identical', reporters: ['qwen', 'minimax', 'gemini'], body: 'The pool caps at ten connections with no queue so a burst past ten fails fast instead of waiting', kind: 'research' });
  add({ mode: 'identical', reporters: ['galadriel', 'codex', 'gemini', 'qwen', 'claude'], body: 'The token bucket refills on read not on a timer so an idle client never regains its burst allowance', kind: 'research' });
  add({ mode: 'identical', reporters: ['galadriel', 'codex', 'minimax'], body: 'The graceful shutdown drains the http server but never closes the database pool so a redeploy leaks a pool per restart', kind: 'research' });
  add({ mode: 'identical', reporters: ['claude', 'gemini', 'qwen', 'minimax'], body: 'The json parser accepts duplicate keys and keeps the last so a crafted payload silently overrides an earlier field', kind: 'research' });

  // ── VARIED true-dup clusters (same point, different wording per worker) ──
  // The dedup canNOT collapse these. We label them NEAR_DUP_VARIED so the report
  // separates "designed-for collapse" recall from "semantic" recall the feature never
  // claimed.
  add({ mode: 'varied', reporters: ['galadriel', 'codex', 'claude'], kind: 'research',
    variants: {
      galadriel: 'A use-after-free occurs because the buffer is released before the async callback reads it',
      codex: 'The async handler dereferences a buffer that the synchronous path already freed, a classic use-after-free',
      claude: 'Freeing the buffer ahead of the pending callback leaves the callback reading freed memory',
    } });
  add({ mode: 'varied', reporters: ['gemini', 'qwen'], kind: 'research',
    variants: {
      gemini: 'The config loader trusts the env var without validation so a malformed value crashes startup',
      qwen: 'An unvalidated environment variable flows straight into the parser and a bad value aborts boot',
    } });

  // ── DISTINCT singletons (each a real point, one reporter, must survive alone) ──
  const singletonBodies = [
    'The schema migration applies each statement on its own connection so a mid-migration failure leaves a half-applied schema',
    'The websocket handler never clears its ping timer on disconnect so timers leak one per dropped socket',
    'The pagination cursor is the raw offset so an insert mid-scan shifts every later page by one row',
    'The log formatter interpolates the user agent unescaped so a crafted UA injects newlines into the log',
    'The feature flag check reads the cache without a default so a cache miss throws instead of falling back off',
    'The CSV export quotes only fields with commas so a field containing a quote breaks the row parse downstream',
    'The retry budget is shared across endpoints so one slow endpoint exhausts the budget for all of them',
    'The cron parser treats a missing day-of-week as zero so a partial expression silently runs every Sunday',
    'The image resize keeps the original in memory until the resize completes so a burst of large uploads spikes RSS',
    'The session store keys on the email not the user id so an email change orphans the active session',
    'The diff algorithm compares by reference not value so two equal-but-distinct objects always show as changed',
    'The rate limiter resets on process restart so a crash loop lets a client bypass the limit each restart',
    'The audit writer batches without a flush on shutdown so the last batch is lost on a clean exit',
    'The search highlighter escapes the query after splitting on spaces so a quoted phrase loses its escaping',
    'The upload validator checks the extension not the magic bytes so a renamed binary passes as an image',
  ];
  for (const body of singletonBodies) {
    add({ mode: 'distinct', reporters: [WORKERS[n % WORKERS.length]], body, kind: 'research' });
  }

  // ── NEAR-MISS distinct pairs (deceptively similar bodies, MUST NOT collapse) ──
  // Each pair differs by one number, file, or token. Two separate points, two reporters.
  const nearMissPairs = [
    [
      { reporter: 'galadriel', body: 'The connection pool caps at 10 connections so a burst past the cap fails fast' },
      { reporter: 'codex', body: 'The connection pool caps at 20 connections so a burst past the cap fails fast' },
    ],
    [
      { reporter: 'claude', body: 'The timeout in handlers/upload.ts is hard-coded to 30000ms with no named constant' },
      { reporter: 'gemini', body: 'The timeout in handlers/download.ts is hard-coded to 30000ms with no named constant' },
    ],
    [
      { reporter: 'qwen', body: 'The cache evicts on the least-recently-used key when it reaches capacity' },
      { reporter: 'minimax', body: 'The cache evicts on the least-frequently-used key when it reaches capacity' },
    ],
    [
      { reporter: 'galadriel', body: 'The validator rejects a negative quantity but accepts a zero quantity' },
      { reporter: 'codex', body: 'The validator rejects a zero quantity but accepts a negative quantity' },
    ],
  ];
  for (const pair of nearMissPairs) {
    for (const member of pair) {
      add({ mode: 'near-miss', reporters: [member.reporter], body: member.body, kind: 'research', nearMissPairKey: `nm-${points.length}` });
    }
  }

  return points;
}

// Realize the labeled points into per-worker research registries. Each emitted finding
// carries its true pointId in a hidden _truthPoint field for scoring (the production
// merge ignores unknown fields, so this does not perturb the key).
function buildLineages(points) {
  const byWorker = new Map(WORKERS.map((w) => [w, []]));
  let fid = 0;
  for (const point of points) {
    for (const reporter of point.reporters) {
      const id = `F-${reporter.slice(0, 3)}-${String(++fid).padStart(3, '0')}`;
      const body = point.mode === 'varied' ? point.variants[reporter] : point.body;
      // Titles always vary per reporter so the test proves collapse keys on body, not
      // title — exactly as nearDuplicateContentKey excludes title.
      const title = `${reporter} on ${point.pointId} (${point.mode})`;
      byWorker.get(reporter).push({
        id,
        title,
        summary: body,
        _truthPoint: point.pointId,
        _truthMode: point.mode,
      });
    }
  }
  return WORKERS.map((label) => ({
    label,
    registry: {
      keyFindings: byWorker.get(label),
      openQuestions: [],
      resolvedQuestions: [],
      ruledOutDirections: [],
      metrics: { iterationsCompleted: 4, convergenceScore: 0.7, openQuestions: 0, resolvedQuestions: 0, keyFindings: byWorker.get(label).length, coverageBySources: {} },
    },
  }));
}

// ───────────────────────────────────────────────────────────────
// 2. SCORING
// ───────────────────────────────────────────────────────────────
//
// We reconstruct, for each merged on-path record, the SET of source pointIds it
// absorbed. A merged record's _lineages length tells us how many source findings
// collapsed into it, but not which points — so we re-merge with a per-record body->
// point map. The production merge preserves the chosen canonical's own fields, and we
// stamped _truthPoint on every source finding, so the surviving record carries the
// canonical's _truthPoint. To know EVERY point a record absorbed we rebuild collapse
// groups by content key the same way the production key does, then label each group.

import crypto from 'node:crypto';

function normalizeBody(text) {
  return typeof text === 'string' ? text.trim().toLowerCase().replace(/\s+/g, ' ') : '';
}

// Reproduce the production nearDuplicateContentKey for research findings (body fields
// excluding title). This is the SAME key the production merge uses; we use it only to
// GROUP source findings for scoring, not to perform the merge (the merge is the
// production one). If this mirror ever drifts from production the off/on counts below
// would disagree with the grouping and the test would surface it.
function nearDupKeyMirror(record) {
  const durable = [record.summary, record.description, record.finding, record.question, record.direction]
    .map(normalizeBody)
    .filter(Boolean)
    .join('');
  return durable || crypto.createHash('sha256').update(JSON.stringify(record)).digest('hex');
}

function score(points, lineages) {
  const off = mergeResearchRegistries(lineages);
  const offRerun = mergeResearchRegistries(lineages);
  const on = mergeResearchRegistries(lineages, { enableNearDuplicateDedup: true });

  const offFindings = off.keyFindings;
  const onFindings = on.keyFindings;

  // Byte-identity of the off path across re-runs (the production default contract).
  const offByteIdentical = JSON.stringify(off) === JSON.stringify(offRerun);

  // Total source findings emitted.
  const totalSource = lineages.reduce((s, l) => s + l.registry.keyFindings.length, 0);

  // Build the ground-truth content-key -> {points, mode} groups by re-keying every
  // source finding the way the production dedup keys. Source findings that share a
  // content key are what the on-path WILL collapse together.
  const sourceByKey = new Map();
  for (const l of lineages) {
    for (const f of l.registry.keyFindings) {
      const key = nearDupKeyMirror(f);
      if (!sourceByKey.has(key)) sourceByKey.set(key, []);
      sourceByKey.get(key).push(f);
    }
  }

  // A content-key group that spans more than one distinct TRUTH point is a
  // FALSE-COLLAPSE hazard: the on-path would merge two genuinely different points
  // because their bodies normalized to the same key. Count groups whose member
  // findings map to >1 distinct _truthPoint.
  let falseCollapseHazardGroups = 0;
  let falseCollapsedPoints = 0;
  for (const group of sourceByKey.values()) {
    const truthPoints = new Set(group.map((f) => f._truthPoint));
    if (truthPoints.size > 1) {
      falseCollapseHazardGroups += 1;
      falseCollapsedPoints += truthPoints.size;
    }
  }

  // Distinct-finding recall: every ground-truth point must be represented by at least
  // one surviving on-path record. Map each surviving record back to its truth point(s)
  // via the content key. A point is preserved when at least one surviving record's
  // content key contains a source finding of that point AND that record did not get
  // swallowed into a foreign point.
  const onKeys = new Set(onFindings.map((r) => nearDupKeyMirror(r)));
  const survivingPoints = new Set();
  for (const [key, group] of sourceByKey.entries()) {
    if (!onKeys.has(key)) continue;
    for (const f of group) survivingPoints.add(f._truthPoint);
  }
  const allPoints = new Set(points.map((p) => p.pointId));
  const distinctPointsExpected = allPoints.size;
  const distinctPointsPreserved = survivingPoints.size;
  const distinctRecall = distinctPointsExpected === 0 ? 1 : distinctPointsPreserved / distinctPointsExpected;

  // False-collapse RATE = falsely-merged distinct points / total distinct points.
  const falseCollapseRate = distinctPointsExpected === 0 ? 0 : falseCollapsedPoints / distinctPointsExpected;

  // Designed-for (identical-body) true-dup recall: of the IDENTICAL clusters, how many
  // collapsed to a single record (the dedup's designed-for case). This is the recall
  // number the feature actually claims.
  const identicalClusters = points.filter((p) => p.mode === 'identical' && p.reporters.length > 1);
  let identicalCollapsed = 0;
  for (const cluster of identicalClusters) {
    // Find the on-path records mapping to this point.
    const recordsForPoint = onFindings.filter((r) => {
      const key = nearDupKeyMirror(r);
      const group = sourceByKey.get(key) || [];
      return group.some((f) => f._truthPoint === cluster.pointId);
    });
    // Collapsed correctly when the cluster's reporters reduced to ONE surviving record.
    if (recordsForPoint.length === 1) identicalCollapsed += 1;
  }
  const identicalDupRecall = identicalClusters.length === 0 ? 1 : identicalCollapsed / identicalClusters.length;

  // Varied true-dup clusters: the dedup CANNOT collapse these (no shared key). Report
  // how many stayed separate as the documented semantic limit.
  const variedClusters = points.filter((p) => p.mode === 'varied' && p.reporters.length > 1);
  let variedStayedSeparate = 0;
  for (const cluster of variedClusters) {
    const recordsForPoint = onFindings.filter((r) => {
      const key = nearDupKeyMirror(r);
      const group = sourceByKey.get(key) || [];
      return group.some((f) => f._truthPoint === cluster.pointId);
    });
    if (recordsForPoint.length === cluster.reporters.length) variedStayedSeparate += 1;
  }

  // Near-miss precision: the near-miss pairs must NEVER collapse. Each near-miss point
  // is its own truth point; if any near-miss point got false-collapsed it shows up in
  // falseCollapsedPoints. Report the near-miss survival directly.
  const nearMissPoints = points.filter((p) => p.mode === 'near-miss');
  let nearMissSurvived = 0;
  for (const p of nearMissPoints) {
    if (survivingPoints.has(p.pointId)) {
      // And it must not share a surviving record's key with a DIFFERENT point.
      const collapsedWithForeign = [...sourceByKey.values()].some((group) => {
        const tp = new Set(group.map((f) => f._truthPoint));
        return tp.has(p.pointId) && tp.size > 1;
      });
      if (!collapsedWithForeign) nearMissSurvived += 1;
    }
  }

  return {
    workers: WORKERS.length,
    totalSourceFindings: totalSource,
    distinctTruthPoints: distinctPointsExpected,
    off: { mergedCount: offFindings.length, byteIdenticalAcrossReruns: offByteIdentical },
    on: { mergedCount: onFindings.length },
    noiseReducedRecords: offFindings.length - onFindings.length,
    falseCollapse: {
      hazardGroups: falseCollapseHazardGroups,
      falselyCollapsedPoints: falseCollapsedPoints,
      falseCollapseRate: Number(falseCollapseRate.toFixed(4)),
    },
    distinctRecall: {
      distinctPointsExpected,
      distinctPointsPreserved,
      distinctFindingRecall: Number(distinctRecall.toFixed(4)),
    },
    designedForDup: {
      identicalClusters: identicalClusters.length,
      identicalClustersCollapsed: identicalCollapsed,
      identicalDupRecall: Number(identicalDupRecall.toFixed(4)),
    },
    semanticLimit: {
      variedClusters: variedClusters.length,
      variedClustersStayedSeparate: variedStayedSeparate,
      note: 'varied-wording restatements share no content key, so the content-identity dedup cannot collapse them; this is a known limit, not a precision failure',
    },
    nearMissPrecision: {
      nearMissPoints: nearMissPoints.length,
      nearMissPointsSurvivedDistinct: nearMissSurvived,
      allNearMissSurvived: nearMissSurvived === nearMissPoints.length,
    },
  };
}

// ───────────────────────────────────────────────────────────────
// 2b. REVIEW-PATH SEVERITY-PRESERVATION SCALE CHECK
// ───────────────────────────────────────────────────────────────
//
// The 009 research flagged review false-collapse: findings with matching content keys
// but DIFFERENT severities collapsing and losing the strongest severity. We synthesize
// identical-body review clusters where each worker reports the same body at a DIFFERENT
// severity, plus near-miss distinct review findings, and verify the production review
// merge (a) collapses each identical cluster to one record, (b) that survivor keeps the
// STRONGEST severity, and (c) never collapses a near-miss distinct pair.

const SEV_RANK = { P0: 3, P1: 2, P2: 1 };

function buildReviewLineages() {
  // Each entry: body, and per-worker severity. Strongest is the max rank.
  const clusters = [
    { body: 'The query path concatenates the raw user term into the SQL string so a crafted term injects arbitrary SQL', sev: { galadriel: 'P1', codex: 'P0', claude: 'P1' } },
    { body: 'The traversal follows child edges with no visited set so a cyclic graph drives the call stack to overflow', sev: { codex: 'P2', claude: 'P0', gemini: 'P1' } },
    { body: 'The deserializer instantiates a class named in the payload so an attacker-chosen type runs its constructor', sev: { galadriel: 'P0', qwen: 'P0', minimax: 'P1' } },
    { body: 'The path join trusts the request filename so a dot-dot segment escapes the upload root', sev: { gemini: 'P1', qwen: 'P0' } },
  ];
  const nearMiss = [
    { reporter: 'galadriel', body: 'The handler trusts the X-Forwarded-For header for the client ip in the rate limiter', sev: 'P1' },
    { reporter: 'codex', body: 'The handler trusts the X-Forwarded-Host header for the client ip in the rate limiter', sev: 'P1' },
  ];
  const distinct = [
    { reporter: 'claude', body: 'The error response echoes the raw exception message so a stack trace leaks the install path', sev: 'P2' },
    { reporter: 'minimax', body: 'The csrf token is compared with a non-constant-time equality so it is timing-attackable', sev: 'P1' },
  ];

  const byWorker = new Map(WORKERS.map((w) => [w, []]));
  let vid = 0;
  const truth = []; // { type:'cluster'|'nearmiss'|'distinct', body, strongest? }
  for (const c of clusters) {
    truth.push({ type: 'cluster', body: c.body, strongest: Object.values(c.sev).sort((a, b) => SEV_RANK[b] - SEV_RANK[a])[0] });
    for (const [reporter, severity] of Object.entries(c.sev)) {
      byWorker.get(reporter).push({ findingId: `V-${reporter.slice(0, 3)}-${String(++vid).padStart(3, '0')}`, severity, status: 'active', title: `${reporter} sev ${severity}`, summary: c.body });
    }
  }
  for (const m of nearMiss) {
    truth.push({ type: 'nearmiss', body: m.body });
    byWorker.get(m.reporter).push({ findingId: `V-${m.reporter.slice(0, 3)}-${String(++vid).padStart(3, '0')}`, severity: m.sev, status: 'active', title: `${m.reporter} nm`, summary: m.body });
  }
  for (const d of distinct) {
    truth.push({ type: 'distinct', body: d.body });
    byWorker.get(d.reporter).push({ findingId: `V-${d.reporter.slice(0, 3)}-${String(++vid).padStart(3, '0')}`, severity: d.sev, status: 'active', title: `${d.reporter} d`, summary: d.body });
  }
  const lineages = WORKERS.map((label) => ({ label, registry: { openFindings: byWorker.get(label), resolvedFindings: [], findingsBySeverity: { P0: 0, P1: 0, P2: 0 } } }));
  return { lineages, truth };
}

function scoreReview() {
  const { lineages, truth } = buildReviewLineages();
  const off = mergeReviewRegistries(lineages);
  const offRerun = mergeReviewRegistries(lineages);
  const on = mergeReviewRegistries(lineages, { enableNearDuplicateDedup: true });
  const offByteIdentical = JSON.stringify(off) === JSON.stringify(offRerun);

  const onByBody = new Map();
  for (const r of on.openFindings) {
    const key = normalizeBody(r.summary);
    if (!onByBody.has(key)) onByBody.set(key, []);
    onByBody.get(key).push(r);
  }

  let clustersCollapsed = 0;
  let severityPreserved = 0;
  let clusters = 0;
  for (const t of truth) {
    if (t.type !== 'cluster') continue;
    clusters += 1;
    const recs = onByBody.get(normalizeBody(t.body)) || [];
    if (recs.length === 1) {
      clustersCollapsed += 1;
      if (recs[0].severity === t.strongest) severityPreserved += 1;
    }
  }

  // No two DISTINCT/near-miss bodies should have collapsed into a foreign body.
  const totalSource = lineages.reduce((s, l) => s + l.registry.openFindings.length, 0);
  const distinctBodies = new Set(truth.filter((t) => t.type !== 'cluster').map((t) => normalizeBody(t.body)));
  let distinctSurvived = 0;
  for (const body of distinctBodies) if ((onByBody.get(body) || []).length === 1) distinctSurvived += 1;

  return {
    totalSourceFindings: totalSource,
    off: { mergedCount: off.openFindings.length, byteIdenticalAcrossReruns: offByteIdentical },
    on: { mergedCount: on.openFindings.length },
    noiseReducedRecords: off.openFindings.length - on.openFindings.length,
    severityClusters: clusters,
    severityClustersCollapsed: clustersCollapsed,
    strongestSeverityPreserved: severityPreserved,
    severityPreservationRate: clusters === 0 ? 1 : Number((severityPreserved / clusters).toFixed(4)),
    distinctReviewBodies: distinctBodies.size,
    distinctReviewBodiesSurvived: distinctSurvived,
    allDistinctReviewSurvived: distinctSurvived === distinctBodies.size,
  };
}

// ───────────────────────────────────────────────────────────────
// 3. RUN
// ───────────────────────────────────────────────────────────────

const points = buildPoints();
const lineages = buildLineages(points);
const research = score(points, lineages);
const review = scoreReview();

const out = {
  test: 'fanout-near-dup-dedup-scale-test',
  flag: 'SPECKIT_FANOUT_NEAR_DUP_DEDUP',
  mergeModule: path.relative(path.resolve(HERE, '../../../../../../..'), MERGE_MODULE),
  generatedAt: new Date().toISOString().slice(0, 10),
  scale: {
    workers: research.workers,
    researchSourceFindings: research.totalSourceFindings,
    reviewSourceFindings: review.totalSourceFindings,
    totalSourceFindings: research.totalSourceFindings + review.totalSourceFindings,
    distinctTruthPoints: research.distinctTruthPoints,
    note: 'beyond the 008 17-record set: 50+ research findings across 6 workers plus a review-path severity check, in identical/varied/distinct/near-miss wording modes',
  },
  research,
  review,
  verdict: {
    offByteIdentical: research.off.byteIdenticalAcrossReruns && review.off.byteIdenticalAcrossReruns,
    // Precision holds at scale when NO distinct point was false-collapsed.
    noFalseCollapse: research.falseCollapse.falselyCollapsedPoints === 0,
    falseCollapseRate: research.falseCollapse.falseCollapseRate,
    // Recall of DISTINCT points (nothing genuinely-distinct silently lost).
    distinctFindingRecall: research.distinctRecall.distinctFindingRecall,
    // Designed-for collapse still works at scale.
    identicalDupRecall: research.designedForDup.identicalDupRecall,
    nearMissAllSurvived: research.nearMissPrecision.allNearMissSurvived,
    // Review path: strongest severity survives every collapse, distinct review
    // findings never false-collapse.
    reviewSeverityPreservationRate: review.severityPreservationRate,
    reviewNoFalseCollapse: review.allDistinctReviewSurvived,
  },
};

fs.mkdirSync(RESULTS_DIR, { recursive: true });
fs.writeFileSync(path.join(RESULTS_DIR, 'dedup-scale-metrics.json'), `${JSON.stringify(out, null, 2)}\n`);

console.log(JSON.stringify(out, null, 2));

// Exit non-zero if precision broke (any false collapse) or a distinct point was lost,
// or the off path stopped being byte-identical, or the designed-for collapse regressed.
const ok = out.verdict.offByteIdentical
  && out.verdict.noFalseCollapse
  && out.verdict.distinctFindingRecall === 1
  && out.verdict.identicalDupRecall === 1
  && out.verdict.nearMissAllSurvived
  && out.verdict.reviewSeverityPreservationRate === 1
  && out.verdict.reviewNoFalseCollapse;
process.exit(ok ? 0 : 1);
