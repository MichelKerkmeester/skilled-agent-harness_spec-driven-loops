#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Runtime — Convergence Entrypoint                               ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Input:  CLI args (--spec-folder, --loop-type, --session-id, optional     ║
// ║         --iteration, --persist-snapshot).                                ║
// ║ Output: JSON to stdout.                                                  ║
// ║ Exit:   0=ok, 1=script error, 2=DB error, 3=input validation error.     ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const {
  acquireWriterLock,
  classifyExitCode,
  installSignalHandlers,
  maybeThrowTestFault,
  validateNamespaceValue,
} = require('./lib/cli-guards.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TSX_LOADER = require.resolve('tsx');
const DEFAULT_REPORTED_NOVELTY_THRESHOLD = 0.05;
const DEFAULT_GRAPH_NOVELTY_FLOOR = 0.05;

/**
 * Shared convergence profile schema:
 * - threshold: numeric boundary a metric is compared against before STOP can be allowed.
 * - weight: contribution a metric makes to a loop-local composite score; use 0 for pure guards.
 * - role: whether a metric is a weighted score input, a blocking guard, or both.
 * - direction: passing comparison for the metric (`gte`, `lte`, or `eq`).
 * - normalizer: named loop-local transform that converts raw observations into comparable metric values.
 *
 * The shared shape keeps metric contracts explicit while each loop preserves its
 * own semantics; convergence does not collapse into one universal formula.
 */
/**
 * @typedef {'weighted' | 'blocking_guard' | 'weighted_guard'} ConvergenceProfileRole
 * @typedef {'gte' | 'lte' | 'eq'} ConvergenceProfileDirection
 * @typedef {'identity' | 'clamp01' | 'inverseClamp01' | 'capRatio' | 'presence'} ConvergenceProfileNormalizer
 * @typedef {Object} ConvergenceProfileSchema
 * @property {'number'} threshold
 * @property {'number'} weight
 * @property {ReadonlyArray<ConvergenceProfileRole>} role
 * @property {ReadonlyArray<ConvergenceProfileDirection>} direction
 * @property {ReadonlyArray<ConvergenceProfileNormalizer>} normalizer
 */
/** @type {Readonly<ConvergenceProfileSchema>} */
const CONVERGENCE_PROFILE_SCHEMA = Object.freeze({
  threshold: 'number',
  weight: 'number',
  role: Object.freeze(['weighted', 'blocking_guard', 'weighted_guard']),
  direction: Object.freeze(['gte', 'lte', 'eq']),
  normalizer: Object.freeze(['identity', 'clamp01', 'inverseClamp01', 'capRatio', 'presence']),
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. TSX BOOTSTRAP
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module && process.env.DEEP_LOOP_TSX_LOADED !== '1') {
  const child = spawnSync(
    process.execPath,
    ['--import', TSX_LOADER, __filename, ...process.argv.slice(2)],
    {
      cwd: process.cwd(),
      env: { ...process.env, DEEP_LOOP_TSX_LOADED: '1' },
      input: process.stdin.isTTY ? undefined : fs.readFileSync(0),
      encoding: 'utf8',
    },
  );
  if (child.stdout) process.stdout.write(child.stdout);
  if (child.stderr) process.stderr.write(child.stderr);
  process.exit(child.status === null ? 1 : child.status);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv = process.argv.slice(2)) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      throw inputError(`Unexpected positional argument: ${token}`);
    }
    const key = token.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function inputError(message) {
  const err = new Error(message);
  err.code = 'INPUT_VALIDATION';
  return err;
}

function ensureString(args, key) {
  if (!args[key] || typeof args[key] !== 'string') {
    throw inputError(`${key} is required`);
  }
  return args[key];
}

function asBoolean(value) {
  return value === true || value === 'true' || value === '1';
}

function parseOptionalRatio(value, key) {
  if (value === undefined || value === null || value === true || value === '') return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
    throw inputError(`${key} must be a number between 0 and 1`);
  }
  return parsed;
}

function parseRatioWithDefault(value, key, fallback) {
  const parsed = parseOptionalRatio(value, key);
  return parsed === null ? fallback : parsed;
}

function jsonOut(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

function blockersCsv(blockers) {
  return blockers
    .filter((blocker) => blocker && blocker.severity === 'blocking')
    .map((blocker) => `${blocker.type}:${blocker.count}`)
    .join(',');
}

function computeCompositeScore(signals, loopType) {
  if (!signals || typeof signals !== 'object') return 0;
  const clamp = (value) => Math.max(0, Math.min(1, value));
  const safe = (value) => (typeof value === 'number' && Number.isFinite(value) ? value : 0);
  if (loopType === 'research') {
    const normalizedDiversity = Math.min(safe(signals.sourceDiversity) / 3.0, 1.0);
    const normalizedDepth = Math.min(safe(signals.evidenceDepth) / 5.0, 1.0);
    const invertedContradictions = 1.0 - clamp(safe(signals.contradictionDensity));
    const score =
      clamp(safe(signals.questionCoverage)) * 0.30 +
      clamp(safe(signals.claimVerificationRate)) * 0.25 +
      invertedContradictions * 0.15 +
      normalizedDiversity * 0.15 +
      normalizedDepth * 0.15;
    return Math.round(clamp(score) * 1000) / 1000;
  }
  if (loopType === 'context') {
    // REUSE catalog weighted highest (reuse-first principle); agreement second
    // (by-model confidence); then scope coverage, relevance gate, dependency map.
    const score =
      clamp(safe(signals.reuseCatalogCoverage)) * 0.30 +
      clamp(safe(signals.agreementRate)) * 0.25 +
      clamp(safe(signals.sliceCoverage)) * 0.20 +
      clamp(safe(signals.relevanceFloor)) * 0.15 +
      clamp(safe(signals.dependencyCompleteness)) * 0.10;
    return Math.round(clamp(score) * 1000) / 1000;
  }
  const score =
    clamp(safe(signals.dimensionCoverage)) * 0.25 +
    clamp(safe(signals.findingStability)) * 0.20 +
    clamp(safe(signals.p0ResolutionRate)) * 0.25 +
    clamp(safe(signals.evidenceDensity)) * 0.15 +
    clamp(safe(signals.hotspotSaturation)) * 0.15;
  return Math.round(clamp(score) * 1000) / 1000;
}

function parseMetadata(metadata) {
  return metadata && typeof metadata === 'object' ? metadata : {};
}

function buildReviewSignals(nodes, edges) {
  const dimensionIds = new Set(nodes.filter((node) => node.kind === 'DIMENSION').map((node) => node.id));
  const findingNodes = nodes.filter((node) => node.kind === 'FINDING');
  const fileNodes = nodes.filter((node) => node.kind === 'FILE');
  const coversEdges = edges.filter((edge) => edge.relation === 'COVERS');
  const contradictionEdges = edges.filter((edge) => edge.relation === 'CONTRADICTS');
  const evidenceEdges = edges.filter((edge) => edge.relation === 'EVIDENCE_FOR');
  const resolvesTargetIds = new Set(edges.filter((edge) => edge.relation === 'RESOLVES').map((edge) => edge.targetId));
  const coveredDimensionIds = new Set(
    coversEdges.map((edge) => edge.sourceId).filter((sourceId) => dimensionIds.has(sourceId)),
  );
  const contradictionNodeIds = new Set();
  for (const edge of contradictionEdges) {
    contradictionNodeIds.add(edge.sourceId);
    contradictionNodeIds.add(edge.targetId);
  }
  const p0Findings = findingNodes.filter((node) => parseMetadata(node.metadata).severity === 'P0');
  const hotspotFiles = fileNodes.filter((node) => {
    const hotspotScore = parseMetadata(node.metadata).hotspot_score;
    return typeof hotspotScore === 'number' && hotspotScore > 0;
  });
  let saturatedHotspots = 0;
  for (const file of hotspotFiles) {
    const coveringDimensions = new Set(
      coversEdges
        .filter((edge) => edge.targetId === file.id)
        .map((edge) => edge.sourceId)
        .filter((sourceId) => dimensionIds.has(sourceId)),
    );
    if (coveringDimensions.size >= 2) saturatedHotspots += 1;
  }
  return {
    dimensionCoverage: dimensionIds.size > 0 ? coveredDimensionIds.size / dimensionIds.size : 0,
    findingStability: findingNodes.length > 0
      ? findingNodes.filter((node) => !contradictionNodeIds.has(node.id)).length / findingNodes.length
      : 0,
    p0ResolutionRate: p0Findings.length > 0
      ? p0Findings.filter((node) => resolvesTargetIds.has(node.id)).length / p0Findings.length
      : 1,
    evidenceDensity: findingNodes.length > 0 ? evidenceEdges.length / findingNodes.length : 0,
    hotspotSaturation: hotspotFiles.length > 0 ? saturatedHotspots / hotspotFiles.length : 1,
  };
}

function evaluateResearch(signals, gaps, contradictions, unverified) {
  const thresholds = {
    questionCoverage: 0.7,
    claimVerificationRate: 0.6,
    contradictionDensity: 0.15,
    sourceDiversity: 1.5,
    evidenceDepth: 1.5,
  };
  const blockers = [];
  const trace = [
    { signal: 'questionCoverage', value: signals.questionCoverage, threshold: thresholds.questionCoverage, passed: signals.questionCoverage >= thresholds.questionCoverage, role: 'weighted' },
    { signal: 'claimVerificationRate', value: signals.claimVerificationRate, threshold: thresholds.claimVerificationRate, passed: signals.claimVerificationRate >= thresholds.claimVerificationRate, role: 'weighted' },
    { signal: 'contradictionDensity', value: signals.contradictionDensity, threshold: thresholds.contradictionDensity, passed: signals.contradictionDensity <= thresholds.contradictionDensity, role: 'weighted' },
    { signal: 'sourceDiversity', value: signals.sourceDiversity, threshold: thresholds.sourceDiversity, passed: signals.sourceDiversity >= thresholds.sourceDiversity, role: 'blocking_guard' },
    { signal: 'evidenceDepth', value: signals.evidenceDepth, threshold: thresholds.evidenceDepth, passed: signals.evidenceDepth >= thresholds.evidenceDepth, role: 'blocking_guard' },
  ];
  if (signals.sourceDiversity < thresholds.sourceDiversity) {
    blockers.push({ type: 'source_diversity_guard', description: `Source diversity (${signals.sourceDiversity.toFixed(2)}) is below the blocking threshold (${thresholds.sourceDiversity}). STOP is blocked until diverse sources cover key questions.`, count: 1, severity: 'blocking' });
  }
  if (signals.evidenceDepth < thresholds.evidenceDepth) {
    blockers.push({ type: 'evidence_depth_guard', description: `Evidence depth (${signals.evidenceDepth.toFixed(2)}) is below the blocking threshold (${thresholds.evidenceDepth}). STOP is blocked until question->finding->source chains are deeper.`, count: 1, severity: 'blocking' });
  }
  if (gaps.length > 0) {
    blockers.push({ type: 'uncovered_questions', description: `${gaps.length} question(s) have no coverage edges`, count: gaps.length, severity: signals.questionCoverage < thresholds.questionCoverage ? 'blocking' : 'warning' });
  }
  if (contradictions.length > 0 && signals.contradictionDensity > thresholds.contradictionDensity) {
    blockers.push({ type: 'high_contradiction_density', description: `${contradictions.length} contradiction(s) detected with density above threshold`, count: contradictions.length, severity: 'blocking' });
  }
  if (unverified.length > 0) {
    blockers.push({ type: 'unverified_claims', description: `${unverified.length} claim(s) remain unverified`, count: unverified.length, severity: signals.claimVerificationRate < thresholds.claimVerificationRate ? 'blocking' : 'warning' });
  }
  return { blockers, trace };
}

function evaluateReview(signals, gaps, contradictions) {
  const thresholds = {
    dimensionCoverage: 0.8,
    findingStability: 0.7,
    p0ResolutionRate: 0.9,
    evidenceDensity: 1.0,
    hotspotSaturation: 0.6,
  };
  const blockers = [];
  const trace = [
    { signal: 'dimensionCoverage', value: signals.dimensionCoverage, threshold: thresholds.dimensionCoverage, passed: signals.dimensionCoverage >= thresholds.dimensionCoverage, role: 'blocking_guard' },
    { signal: 'findingStability', value: signals.findingStability, threshold: thresholds.findingStability, passed: signals.findingStability >= thresholds.findingStability, role: 'weighted' },
    { signal: 'p0ResolutionRate', value: signals.p0ResolutionRate, threshold: thresholds.p0ResolutionRate, passed: signals.p0ResolutionRate >= thresholds.p0ResolutionRate, role: 'weighted' },
    { signal: 'evidenceDensity', value: signals.evidenceDensity, threshold: thresholds.evidenceDensity, passed: signals.evidenceDensity >= thresholds.evidenceDensity, role: 'weighted' },
    { signal: 'hotspotSaturation', value: signals.hotspotSaturation, threshold: thresholds.hotspotSaturation, passed: signals.hotspotSaturation >= thresholds.hotspotSaturation, role: 'weighted' },
  ];
  if (signals.p0ResolutionRate < thresholds.p0ResolutionRate) {
    blockers.push({ type: 'unresolved_p0_findings', description: `P0 resolution rate (${(signals.p0ResolutionRate * 100).toFixed(0)}%) is below threshold (${(thresholds.p0ResolutionRate * 100).toFixed(0)}%)`, count: 1, severity: 'blocking' });
  }
  if (signals.dimensionCoverage < thresholds.dimensionCoverage) {
    blockers.push({ type: 'uncovered_dimensions', description: `Dimension coverage (${(signals.dimensionCoverage * 100).toFixed(0)}%) is below threshold (${(thresholds.dimensionCoverage * 100).toFixed(0)}%). ${gaps.length} gap(s) found. STOP is blocked until all required dimensions have meaningful coverage.`, count: gaps.length, severity: 'blocking' });
  }
  if (contradictions.length > 0 && signals.findingStability < thresholds.findingStability) {
    blockers.push({ type: 'unstable_findings', description: `${contradictions.length} contradiction(s) are lowering finding stability below threshold`, count: contradictions.length, severity: 'blocking' });
  }
  return { blockers, trace };
}

function evaluateContext(signals, gaps, contradictions) {
  const thresholds = {
    sliceCoverage: 0.7,
    reuseCatalogCoverage: 0.6,
    agreementRate: 0.5,
    relevanceFloor: 0.5,
    dependencyCompleteness: 0.7,
  };
  const blockers = [];
  const trace = [
    { signal: 'sliceCoverage', value: signals.sliceCoverage, threshold: thresholds.sliceCoverage, passed: signals.sliceCoverage >= thresholds.sliceCoverage, role: 'blocking_guard' },
    { signal: 'reuseCatalogCoverage', value: signals.reuseCatalogCoverage, threshold: thresholds.reuseCatalogCoverage, passed: signals.reuseCatalogCoverage >= thresholds.reuseCatalogCoverage, role: 'weighted' },
    { signal: 'agreementRate', value: signals.agreementRate, threshold: thresholds.agreementRate, passed: signals.agreementRate >= thresholds.agreementRate, role: 'blocking_guard' },
    { signal: 'relevanceFloor', value: signals.relevanceFloor, threshold: thresholds.relevanceFloor, passed: signals.relevanceFloor >= thresholds.relevanceFloor, role: 'blocking_guard' },
    { signal: 'dependencyCompleteness', value: signals.dependencyCompleteness, threshold: thresholds.dependencyCompleteness, passed: signals.dependencyCompleteness >= thresholds.dependencyCompleteness, role: 'weighted' },
  ];
  if (signals.sliceCoverage < thresholds.sliceCoverage) {
    blockers.push({ type: 'uncovered_slices', description: `Slice coverage (${(signals.sliceCoverage * 100).toFixed(0)}%) is below threshold (${(thresholds.sliceCoverage * 100).toFixed(0)}%). ${gaps.length} gap(s) found. STOP is blocked until the in-scope surface is swept.`, count: gaps.length, severity: 'blocking' });
  }
  if (signals.relevanceFloor < thresholds.relevanceFloor) {
    blockers.push({ type: 'low_relevance_focus', description: `Relevance floor (${(signals.relevanceFloor * 100).toFixed(0)}%) is below threshold. The loop is collecting mostly low-relevance context; STOP is blocked until findings clear the relevance gate.`, count: 1, severity: 'blocking' });
  }
  if (signals.agreementRate < thresholds.agreementRate) {
    blockers.push({ type: 'low_cross_executor_agreement', description: `Cross-executor agreement (${(signals.agreementRate * 100).toFixed(0)}%) is below threshold. Findings are not yet confirmed by multiple model lenses; STOP is blocked.`, count: 1, severity: 'blocking' });
  }
  if (contradictions.length > 0) {
    blockers.push({ type: 'context_contradictions', description: `${contradictions.length} contradiction(s) detected across executors; reconcile before STOP.`, count: contradictions.length, severity: 'warning' });
  }
  return { blockers, trace };
}

function decisionReason(decision, blockingBlockers, trace) {
  if (decision === 'STOP_ALLOWED') return 'All convergence signals pass thresholds; STOP is allowed pending newInfoRatio agreement.';
  if (decision === 'STOP_BLOCKED') {
    return `STOP is blocked by ${blockingBlockers.length} blocker(s): ${blockingBlockers.map((blocker) => blocker.type).join(', ')}`;
  }
  return `Convergence signals not yet met: ${trace.filter((entry) => !entry.passed).map((entry) => entry.signal).join(', ')}. Continue iterating.`;
}

function buildNoveltyCorroboration(signalsLib, nodes, edges, snapshots, args) {
  const reportedNovelty = parseOptionalRatio(args.reportedNovelty, 'reportedNovelty');
  if (reportedNovelty === null) return null;

  const reportedThreshold = parseRatioWithDefault(
    args.reportedNoveltyThreshold,
    'reportedNoveltyThreshold',
    DEFAULT_REPORTED_NOVELTY_THRESHOLD,
  );
  const graphNoveltyFloor = parseRatioWithDefault(
    args.graphNoveltyFloor,
    'graphNoveltyFloor',
    DEFAULT_GRAPH_NOVELTY_FLOOR,
  );
  const graphNoveltyDelta = signalsLib.computeGraphNoveltyDelta(nodes, edges, snapshots);
  const effectiveNovelty = Math.max(reportedNovelty, graphNoveltyDelta);
  const shouldBlock = reportedNovelty < reportedThreshold && graphNoveltyDelta > graphNoveltyFloor;

  return {
    reportedNovelty,
    reportedThreshold,
    graphNoveltyFloor,
    graphNoveltyDelta,
    effectiveNovelty,
    shouldBlock,
    traceEntry: {
      signal: 'noveltyCorroboration',
      value: effectiveNovelty,
      threshold: graphNoveltyFloor,
      passed: !shouldBlock,
      role: 'blocking_guard',
    },
    blocker: {
      type: 'novelty_self_report_unverified',
      description: `Reported novelty (${reportedNovelty.toFixed(3)}) is below ${reportedThreshold.toFixed(3)} while graph novelty (${graphNoveltyDelta.toFixed(3)}) is above ${graphNoveltyFloor.toFixed(3)}. STOP is blocked until the self-report agrees with graph evidence.`,
      count: 1,
      severity: 'blocking',
      reportedNovelty,
      graphNoveltyDelta,
      effectiveNovelty,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();
  const specFolder = validateNamespaceValue(ensureString(args, 'specFolder'), 'specFolder', inputError);
  const loopType = ensureString(args, 'loopType');
  const sessionId = validateNamespaceValue(ensureString(args, 'sessionId'), 'sessionId', inputError);
  if (loopType !== 'research' && loopType !== 'review' && loopType !== 'council' && loopType !== 'context') {
    throw inputError('loopType must be "research", "review", "council", or "context"');
  }

  const ns = { specFolder, loopType, sessionId };
  let db = null;

  try {
    const isCouncil = loopType === 'council';
    db = isCouncil
      ? await import('../lib/council/council-graph-db.ts')
      : await import('../lib/coverage-graph/coverage-graph-db.ts');
    installSignalHandlers(() => db?.closeDb());
    maybeThrowTestFault();
    if (isCouncil) {
      if (asBoolean(args.persistSnapshot) && !args.roundId) {
        throw inputError('--round-id is required when --persist-snapshot is true for council convergence');
      }
      const councilConvergence = require('../lib/council/convergence.cjs');
      const data = await councilConvergence.evaluateCouncilConvergence(ns, {
        roundId: args.roundId,
        persistSnapshot: asBoolean(args.persistSnapshot),
      });
      jsonOut(councilConvergence.bridgePayload(data));
      return;
    }

    const signalsLib = await import('../lib/coverage-graph/coverage-graph-signals.ts');
    const queryLib = await import('../lib/coverage-graph/coverage-graph-query.ts');
    const nodes = db.getNodes(ns);
    const edges = db.getEdges(ns);
    const snapshots = db.getSnapshots(specFolder, loopType, sessionId);
    const stats = {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      nodesByKind: nodes.reduce((acc, node) => ({ ...acc, [node.kind]: (acc[node.kind] || 0) + 1 }), {}),
      edgesByRelation: edges.reduce((acc, edge) => ({ ...acc, [edge.relation]: (acc[edge.relation] || 0) + 1 }), {}),
      lastIteration: snapshots.length > 0 ? snapshots[snapshots.length - 1].iteration : null,
    };

    if (stats.totalNodes === 0) {
      const data = {
        decision: 'CONTINUE',
        reason: 'Graph is empty; insufficient data for convergence assessment',
        signals: null,
        blockers: [],
        trace: [],
        namespace: ns,
        scopeMode: 'session',
        nodeCount: 0,
        edgeCount: 0,
      };
      jsonOut({ status: 'ok', data, graph_decision: data.decision, graph_decision_json: JSON.stringify(data.decision), graph_signals_json: {}, graph_blockers_json: [], graph_blockers_csv: '', graph_stop_blocked: false, graph_trace_json: [], graph_convergence_score: 0 });
      return;
    }

    const signals = loopType === 'research'
      ? {
          questionCoverage: signalsLib.computeResearchQuestionCoverageFromData(nodes, edges),
          claimVerificationRate: signalsLib.computeResearchClaimVerificationRateFromData(nodes),
          contradictionDensity: signalsLib.computeResearchContradictionDensityFromData(edges),
          sourceDiversity: signalsLib.computeResearchSourceDiversityFromData(nodes, edges),
          evidenceDepth: signalsLib.computeResearchEvidenceDepthFromData(nodes, edges),
        }
      : loopType === 'context'
        ? signalsLib.computeContextSignalsFromData(nodes, edges)
        : buildReviewSignals(nodes, edges);
    const score = computeCompositeScore(signals, loopType);
    const noveltyCorroboration = loopType === 'research'
      ? buildNoveltyCorroboration(signalsLib, nodes, edges, snapshots, args)
      : null;
    const signalsWithScore = noveltyCorroboration
      ? {
          ...signals,
          score,
          graphNoveltyDelta: noveltyCorroboration.graphNoveltyDelta,
          reportedNovelty: noveltyCorroboration.reportedNovelty,
          effectiveNovelty: noveltyCorroboration.effectiveNovelty,
        }
      : { ...signals, score };
    const gaps = queryLib.findCoverageGaps(ns);
    const contradictions = queryLib.findContradictions(ns);
    const unverified = loopType === 'research' ? queryLib.findUnverifiedClaims(ns) : [];
    const evaluated = loopType === 'research'
      ? evaluateResearch(signals, gaps, contradictions, unverified)
      : loopType === 'context'
        ? evaluateContext(signals, gaps, contradictions)
        : evaluateReview(signals, gaps, contradictions);
    let blockers = evaluated.blockers;
    let trace = evaluated.trace;
    const initialBlockingBlockers = blockers.filter((blocker) => blocker.severity === 'blocking');
    let decision = initialBlockingBlockers.length > 0
      ? 'STOP_BLOCKED'
      : trace.every((entry) => entry.passed) ? 'STOP_ALLOWED' : 'CONTINUE';
    if (noveltyCorroboration) {
      trace = [...trace, {
        ...noveltyCorroboration.traceEntry,
        passed: decision !== 'STOP_ALLOWED' || !noveltyCorroboration.shouldBlock,
      }];
      if (decision === 'STOP_ALLOWED' && noveltyCorroboration.shouldBlock) {
        blockers = [...blockers, noveltyCorroboration.blocker];
        decision = 'STOP_BLOCKED';
      }
    }
    const blockingBlockers = blockers.filter((blocker) => blocker.severity === 'blocking');
    const momentum = snapshots.length < 2
      ? null
      : Object.fromEntries(Object.keys(snapshots[snapshots.length - 1].metrics || {}).flatMap((key) => {
          const latest = snapshots[snapshots.length - 1].metrics[key];
          const previous = snapshots[snapshots.length - 2].metrics[key];
          return typeof latest === 'number' && typeof previous === 'number' ? [[key, latest - previous]] : [];
        }));

    if (asBoolean(args.persistSnapshot) && args.iteration !== undefined) {
      // Snapshot writes share the deep-loop graph DB with upsert.cjs, so they
      // must take the same writer lock to avoid a concurrent-write race.
      const releaseWriterLock = acquireWriterLock(path.join(db.COVERAGE_GRAPH_DATABASE_DIR, '.deep-loop-graph-writer.lock'));
      try {
        db.createSnapshot({
          specFolder,
          loopType,
          sessionId,
          iteration: Number(args.iteration),
          metrics: { ...signalsWithScore, nodeCount: stats.totalNodes, edgeCount: stats.totalEdges },
          nodeCount: stats.totalNodes,
          edgeCount: stats.totalEdges,
        });
      } finally {
        releaseWriterLock();
      }
    }

    const data = {
      decision,
      reason: decisionReason(decision, blockingBlockers, trace),
      score,
      signals: signalsWithScore,
      blockers,
      trace,
      momentum,
      namespace: ns,
      scopeMode: 'session',
      notes: ['Convergence signals were computed from the session-scoped subgraph only.'],
      snapshotPersistence: asBoolean(args.persistSnapshot) ? 'persisted' : 'not_requested',
      nodeCount: stats.totalNodes,
      edgeCount: stats.totalEdges,
      lastIteration: stats.lastIteration,
    };
    jsonOut({
      status: 'ok',
      data,
      graph_decision: decision,
      graph_decision_json: JSON.stringify(decision),
      graph_signals_json: signalsWithScore,
      graph_blockers_json: blockers,
      graph_blockers_csv: blockersCsv(blockers),
      graph_stop_blocked: decision === 'STOP_BLOCKED',
      graph_trace_json: trace,
      graph_convergence_score: score,
    });
  } finally {
    db?.closeDb();
  }
}

module.exports = {
  CONVERGENCE_PROFILE_SCHEMA,
};

if (require.main === module) {
  main().catch((err) => {
    const code = classifyExitCode(err);
    jsonOut({ status: 'error', error: err instanceof Error ? err.message : String(err), code: err && err.code ? err.code : 'SCRIPT_ERROR' });
    if (code === 1) {
      process.stderr.write(JSON.stringify({ error: err instanceof Error ? err.message : String(err), stack: err && err.stack }) + '\n');
    }
    process.exit(code);
  });
}
