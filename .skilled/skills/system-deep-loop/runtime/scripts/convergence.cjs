#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Convergence Entrypoint
// ───────────────────────────────────────────────────────────────────

// The stop decision is computed from loop state rather than from prose, so two
// runs over the same state stop at the same point. Its object owns nine fields
// in this order: decision, stopReason, reasonDetail, weightedStopScore, signals,
// gates, blockedBy, graphDecision and inputs. stopReason keeps the frozen
// eight-value set; the finer cause travels in reasonDetail as
// maxIterationsReached, consecutiveFailures, stuckThresholdReached,
// convergenceModeOff, stopPolicyMaxIterations, noStopCandidate,
// minIterationsNotReached, frontierOpen,
// qualityGuardFailed, all_questions_answered, all_dimensions_clean,
// composite_converged, graphStopBlocked, graph_convergence_continue,
// graphDecisionMissing, or the name of a failed gate.

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const {
  acquireWriterLock,
  assertKnownFlags,
  classifyExitCode,
  installSignalHandlers,
  maybeThrowTestFault,
  validateNamespaceValue,
} = require('./lib/cli-guards.cjs');

const {
  appendObservabilityEvent,
} = require('../lib/deep-loop/observability-events.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_REPORTED_NOVELTY_THRESHOLD = 0.05;
const DEFAULT_GRAPH_NOVELTY_FLOOR = 0.05;
const DEFAULT_MIN_OBSERVATIONS = 2;
const DEFAULT_SLIDING_WINDOW_SIZE = 5;
const MIN_OBSERVATIONS_FLOOR = 1;
const MIN_OBSERVATIONS_CEILING = 10;
// Repeated failures are an outage, not evidence, so the loop halts instead of voting.
const CONSECUTIVE_FAILURE_LIMIT = 3;
const OBSERVABILITY_EVENTS_FILENAME = 'observability-events.jsonl';
const VALID_CONVERGENCE_MODES = new Set(['default', 'off', 'sliding-window', 'divergent']);
// Every key this entrypoint reads from the parsed arguments. A flag missing
// here is treated as an unknown option, so this list is the accepted set.
const CONVERGENCE_FLAGS = [
  'configJson',
  'configPath',
  'convergenceMode',
  'convergence_mode',
  'depthMode',
  'depth_mode',
  'fixReplayPassingRows',
  'fixReplayRequiredRows',
  'graphNoveltyFloor',
  'improvementEffect',
  'improvementEffectTrace',
  'iteration',
  'iterationCount',
  'loopType',
  'minObservations',
  'min_observations',
  'minObservationsGuard',
  'observationThresholdGuard',
  'persistSnapshot',
  'readOnly',
  'registryPath',
  'reportedNovelty',
  'reportedNoveltyThreshold',
  'securitySensitiveFixScope',
  'sessionId',
  'slidingWindowSize',
  'sliding_window_size',
  'specFolder',
  'stateLog',
  'stopDecision',
  'traceImprovementEffect',
];

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
    // Resolved here, not at load, so a caller that only imports the helpers needs no tsx.
    ['--import', require.resolve('tsx'), __filename, ...process.argv.slice(2)],
    {
      cwd: process.cwd(),
      env: require('./runtime-bootstrap.cjs').tsxChildEnv({ DEEP_LOOP_TSX_LOADED: '1' }),
      // The child owns stdin. Reading it here blocks on a pipe that is never
      // closed and throws EAGAIN on a non-blocking one, before any argument is checked.
      stdio: ['inherit', 'pipe', 'pipe'],
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

function parseOptionalJsonObject(value, key) {
  if (value === undefined || value === null || value === true || value === '') return {};
  if (typeof value !== 'string') throw inputError(`${key} must be a JSON object`);
  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw inputError(`${key} must be valid JSON`);
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw inputError(`${key} must be a JSON object`);
  }
  return parsed;
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

function parseMinObservationsValue(value, key = 'minObservations') {
  if (value === undefined || value === null || value === true || value === '') return DEFAULT_MIN_OBSERVATIONS;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw inputError(`${key} must be a finite number`);
  }
  return Math.max(MIN_OBSERVATIONS_FLOOR, Math.min(MIN_OBSERVATIONS_CEILING, Math.trunc(parsed)));
}

function parseConvergenceModeValue(value, key = 'convergenceMode') {
  if (value === undefined || value === null || value === '') return 'default';
  if (typeof value !== 'string') {
    throw inputError(`${key} must be "default", "off", "sliding-window", or "divergent"`);
  }
  const mode = value.trim();
  if (!VALID_CONVERGENCE_MODES.has(mode)) {
    throw inputError(`${key} must be "default", "off", "sliding-window", or "divergent"`);
  }
  return mode;
}

function parseSlidingWindowSizeValue(value, key = 'slidingWindowSize') {
  if (value === undefined || value === null || value === '') return DEFAULT_SLIDING_WINDOW_SIZE;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw inputError(`${key} must be a positive integer`);
  }
  return parsed;
}

function configSection(config, key) {
  const section = config[key];
  return section && typeof section === 'object' && !Array.isArray(section) ? section : {};
}

function firstDefined(...values) {
  for (const value of values) {
    if (value !== undefined) return value;
  }
  return undefined;
}

function readConvergenceModeConfig(args) {
  const config = parseOptionalJsonObject(args.configJson, 'configJson');
  const antiConvergence = configSection(config, 'antiConvergence');
  const mode = parseConvergenceModeValue(firstDefined(
    args.convergenceMode,
    args.convergence_mode,
    config.convergenceMode,
    config.convergence_mode,
    antiConvergence.convergenceMode,
    antiConvergence.convergence_mode,
  ));

  if (mode !== 'sliding-window') {
    return { mode, slidingWindowSize: DEFAULT_SLIDING_WINDOW_SIZE };
  }

  return {
    mode,
    slidingWindowSize: parseSlidingWindowSizeValue(firstDefined(
      args.slidingWindowSize,
      args.sliding_window_size,
      config.slidingWindowSize,
      config.sliding_window_size,
      antiConvergence.slidingWindowSize,
      antiConvergence.sliding_window_size,
    )),
  };
}

function resolveMinObservationsInput(args) {
  if (args.minObservations !== undefined) return { value: args.minObservations, key: 'minObservations' };
  if (args.min_observations !== undefined) return { value: args.min_observations, key: 'min_observations' };

  const config = parseOptionalJsonObject(args.configJson, 'configJson');
  if (config.min_observations !== undefined) return { value: config.min_observations, key: 'min_observations' };
  if (config.minObservations !== undefined) return { value: config.minObservations, key: 'minObservations' };
  if (process.env.DEEP_LOOP_MIN_OBSERVATIONS !== undefined) {
    return { value: process.env.DEEP_LOOP_MIN_OBSERVATIONS, key: 'DEEP_LOOP_MIN_OBSERVATIONS' };
  }
  return null;
}

function readObservationThresholdConfig(args) {
  const input = resolveMinObservationsInput(args);
  const enabledByFlag =
    asBoolean(args.observationThresholdGuard) ||
    asBoolean(args.minObservationsGuard) ||
    asBoolean(process.env.DEEP_LOOP_MIN_OBSERVATIONS_GUARD);

  if (!input && !enabledByFlag) {
    return { enabled: false, minObservations: 1 };
  }

  return {
    enabled: true,
    minObservations: parseMinObservationsValue(input?.value, input?.key),
  };
}

function jsonOut(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

function observabilityPathForDb(dbModule) {
  const dbDir = dbModule?.COVERAGE_GRAPH_DATABASE_DIR;
  return typeof dbDir === 'string' && dbDir.trim() !== ''
    ? path.join(dbDir, OBSERVABILITY_EVENTS_FILENAME)
    : null;
}

function appendConvergenceObservabilityEvent(dbModule, payload, ns) {
  const eventPath = observabilityPathForDb(dbModule);
  if (!eventPath) return;
  try {
    appendObservabilityEvent(eventPath, payload, {
      producer: 'convergence',
      stream: 'graph-convergence',
      subject: ns,
      event: 'convergence_evaluated',
      status: payload.graph_decision ?? payload.status,
    });
  } catch {
    // Convergence stdout and snapshot persistence remain authoritative.
  }
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

function buildGraphNoveltyTelemetry(signalsLib, nodes, edges, snapshots, convergenceModeConfig) {
  if (convergenceModeConfig.mode !== 'sliding-window') return null;
  const fullHistoryNewInfoRatio = signalsLib.computeGraphNoveltyDelta(nodes, edges, snapshots);
  const windowedNewInfoRatio = signalsLib.computeWindowedGraphNoveltyDelta(
    nodes,
    edges,
    snapshots,
    convergenceModeConfig.slidingWindowSize,
  );
  return {
    convergenceMode: 'sliding-window',
    slidingWindowSize: convergenceModeConfig.slidingWindowSize,
    graphNoveltyDelta: windowedNewInfoRatio,
    fullHistoryNewInfoRatio,
    windowedNewInfoRatio,
  };
}

function buildNoveltyCorroboration(signalsLib, nodes, edges, snapshots, args, graphNoveltyTelemetry = null) {
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
  const graphNoveltyDelta = graphNoveltyTelemetry?.windowedNewInfoRatio
    ?? signalsLib.computeGraphNoveltyDelta(nodes, edges, snapshots);
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

function roundMetricDelta(value) {
  const rounded = Math.round(value * 1000) / 1000;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function snapshotScore(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return null;
  if (typeof snapshot.score === 'number' && Number.isFinite(snapshot.score)) return snapshot.score;
  const metrics = snapshot.metrics && typeof snapshot.metrics === 'object' ? snapshot.metrics : null;
  if (metrics && typeof metrics.score === 'number' && Number.isFinite(metrics.score)) return metrics.score;
  return null;
}

function computeScoreDelta(score, priorSnapshot) {
  const priorScore = snapshotScore(priorSnapshot);
  if (priorScore === null || !Number.isFinite(score)) return null;
  return roundMetricDelta(score - priorScore);
}

function shouldTraceImprovementEffect(args) {
  return asBoolean(args.improvementEffect) || asBoolean(args.improvementEffectTrace) || asBoolean(args.traceImprovementEffect);
}

function applyObservationThresholdGuard(decision, blockers, trace, observationThreshold) {
  if (!observationThreshold || decision !== 'STOP_ALLOWED') {
    return { decision, blockers, trace };
  }

  const leadingFinding = observationThreshold.leadingFinding;
  if (!leadingFinding) {
    return { decision, blockers, trace };
  }

  const traceEntry = {
    signal: 'minObservations',
    value: leadingFinding.observations,
    threshold: observationThreshold.minObservations,
    passed: !leadingFinding.subThreshold,
    role: 'blocking_guard',
  };
  if (!leadingFinding.subThreshold) {
    return { decision, blockers, trace: [...trace, traceEntry] };
  }

  return {
    decision: 'STOP_BLOCKED',
    blockers: [
      ...blockers,
      {
        type: 'min_observations_guard',
        description: `Leading finding "${leadingFinding.id}" has ${leadingFinding.observations} observation(s), below min_observations (${observationThreshold.minObservations}). STOP is blocked until the finding is confirmed again.`,
        count: leadingFinding.observations,
        severity: 'blocking',
        minObservations: observationThreshold.minObservations,
        leadingFinding,
      },
    ],
    trace: [...trace, traceEntry],
  };
}

// The novelty-corroboration trace entry's own `passed` field (built alongside
// its blocker in buildNoveltyCorroboration) already reflects whether the
// signal itself cleared the graph-novelty floor -- it must be carried through
// unchanged so the trace stays an honest per-signal record, independent of
// whatever else already pushed the overall decision to CONTINUE or
// STOP_BLOCKED. Only STOP_ALLOWED is escalated when the guard disagrees.
function applyNoveltyCorroborationGuard(decision, blockers, trace, noveltyCorroboration) {
  if (!noveltyCorroboration) {
    return { decision, blockers, trace };
  }
  const nextTrace = [...trace, noveltyCorroboration.traceEntry];
  if (decision === 'STOP_ALLOWED' && noveltyCorroboration.shouldBlock) {
    return {
      decision: 'STOP_BLOCKED',
      blockers: [...blockers, noveltyCorroboration.blocker],
      trace: nextTrace,
    };
  }
  return { decision, blockers, trace: nextTrace };
}

function buildImprovementEffect(snapshots, scoreDelta) {
  const historicalDeltas = [];
  for (let i = 1; i < snapshots.length; i += 1) {
    const previousScore = snapshotScore(snapshots[i - 1]);
    const latestScore = snapshotScore(snapshots[i]);
    if (previousScore !== null && latestScore !== null) {
      historicalDeltas.push(roundMetricDelta(latestScore - previousScore));
    }
  }
  const deltas = scoreDelta === null ? historicalDeltas : [...historicalDeltas, scoreDelta];
  if (deltas.length === 0) {
    return {
      latestDelta: scoreDelta,
      sampleCount: 0,
      helped: 0,
      hurt: 0,
      flat: 0,
      averageDelta: null,
      summary: 'no prior snapshot',
    };
  }

  const helped = deltas.filter((delta) => delta > 0).length;
  const hurt = deltas.filter((delta) => delta < 0).length;
  const flat = deltas.filter((delta) => delta === 0).length;
  const averageDelta = roundMetricDelta(deltas.reduce((sum, delta) => sum + delta, 0) / deltas.length);
  const avgDir = averageDelta > 0 ? '+' : '';
  return {
    latestDelta: scoreDelta,
    sampleCount: deltas.length,
    helped,
    hurt,
    flat,
    averageDelta,
    summary: `Avg delta: ${avgDir}${(averageDelta * 100).toFixed(1)}% (${helped} helped, ${hurt} hurt, ${flat} flat)`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4B. STOP DECISION
// ─────────────────────────────────────────────────────────────────────────────

function round6(value) {
  return Number(value.toFixed(6));
}

function median(values) {
  if (!Array.isArray(values) || values.length === 0) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function mean(values) {
  if (!Array.isArray(values) || values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

// Scale the median absolute deviation as if the ratios were normally
// distributed, so one high-novelty early iteration cannot widen the floor.
function noiseFloor(values) {
  if (!Array.isArray(values) || values.length === 0) return 0;
  const center = median(values);
  return median(values.map((value) => Math.abs(value - center))) * 1.4826;
}

function mapReviewThresholds(convergenceThreshold) {
  const threshold = typeof convergenceThreshold === 'number'
    && Number.isFinite(convergenceThreshold)
    && convergenceThreshold > 0
    ? convergenceThreshold
    : 0.1;
  return {
    convergenceThreshold: round6(threshold),
    rollingAverageCutoff: round6(0.8 * threshold),
    noProgressCutoff: round6(0.5 * threshold),
  };
}

function computeStopSignals(args = {}) {
  const options = args && typeof args === 'object' ? args : {};
  const { loopType, ratios, convergenceThreshold, coverage } = options;
  const values = Array.isArray(ratios) ? ratios : [];
  const facts = coverage && typeof coverage === 'object' ? coverage : {};
  const total = typeof facts.total === 'number' ? facts.total : 0;
  const latest = values.length > 0 ? values[values.length - 1] : null;
  const thresholds = loopType === 'review' ? mapReviewThresholds(convergenceThreshold) : null;
  const signals = {};

  if (thresholds) {
    const rollingAverage = mean(values.slice(-2));
    const covered = typeof facts.covered === 'number' ? facts.covered : 0;
    const dimensionCoverage = total > 0 ? covered / total : 0;
    signals.rollingAverage = {
      available: values.length >= 2,
      weight: 0.30,
      value: values.length >= 2 ? round6(rollingAverage) : null,
      stop: values.length >= 2 && rollingAverage <= thresholds.rollingAverageCutoff,
    };
    signals.madNoiseFloor = {
      available: values.length >= 3,
      weight: 0.25,
      value: values.length >= 3 ? round6(noiseFloor(values)) : null,
      stop: values.length >= 3 && latest <= noiseFloor(values),
    };
    signals.dimensionCoverage = {
      available: total > 0,
      weight: 0.45,
      value: total > 0 ? round6(dimensionCoverage) : null,
      stop: total > 0
        && dimensionCoverage >= 1
        && facts.traceabilityCovered === true
        && facts.coverageAge >= 1,
    };
  } else {
    const threshold = typeof convergenceThreshold === 'number'
      && Number.isFinite(convergenceThreshold)
      && convergenceThreshold > 0
      ? convergenceThreshold
      : 0.05;
    const rollingAverage = mean(values.slice(-3));
    const answered = typeof facts.answered === 'number' ? facts.answered : 0;
    const questionEntropy = total > 0 ? answered / total : 0;
    signals.rollingAverage = {
      available: values.length >= 3,
      weight: 0.30,
      value: values.length >= 3 ? round6(rollingAverage) : null,
      stop: values.length >= 3 && rollingAverage < threshold,
    };
    signals.madNoiseFloor = {
      available: values.length >= 4,
      weight: 0.35,
      value: values.length >= 4 ? round6(noiseFloor(values)) : null,
      stop: values.length >= 4 && latest <= noiseFloor(values),
    };
    signals.questionEntropy = {
      available: total > 0,
      weight: 0.35,
      value: total > 0 ? round6(questionEntropy) : null,
      stop: total > 0 && questionEntropy >= 0.85,
    };
  }

  // Unavailable signals leave the denominator, so the evidence that remains
  // carries the whole vote instead of being diluted by a missing signal.
  const availableSignals = Object.values(signals).filter((signal) => signal.available);
  const availableWeight = availableSignals.reduce((sum, signal) => sum + signal.weight, 0);
  const stopWeight = availableSignals
    .filter((signal) => signal.stop)
    .reduce((sum, signal) => sum + signal.weight, 0);
  const weightedStopScore = availableWeight > 0 ? round6(stopWeight / availableWeight) : 0;
  const stopCandidate = thresholds
    ? weightedStopScore >= 0.60
    : weightedStopScore > 0.60;

  return {
    signals,
    weightedStopScore,
    stopCandidate,
    noProgress: thresholds
      ? values.length > 0 && latest <= thresholds.noProgressCutoff
      : false,
  };
}

function guardOutcome(status, violations) {
  return { status, passed: status !== 'failed', violations };
}

// A leaf may label questions with their strategy id ("Q1: ...") while the
// strategy itself writes the bare text, so alignment compares the question
// body: trimmed, single-spaced, lowercased, with one leading id prefix gone.
function normalizeQuestionForAlignment(text) {
  return String(text ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/^q\d+\s*[:.)-]\s*/i, '')
    .trim();
}

function evaluateResearchQualityGuards(args = {}) {
  const options = args && typeof args === 'object' ? args : {};
  const { answeredQuestionSourceCounts, iterationRecords } = options;
  const sourceCounts = answeredQuestionSourceCounts
    && typeof answeredQuestionSourceCounts === 'object'
    && !Array.isArray(answeredQuestionSourceCounts)
    ? answeredQuestionSourceCounts
    : null;

  let sourceDiversity;
  if (sourceCounts === null) {
    sourceDiversity = guardOutcome('notEvaluated', []);
  } else {
    const violations = Object.keys(sourceCounts).filter((question) => {
      const count = sourceCounts[question];
      return typeof count !== 'number' || !Number.isFinite(count) || count < 2;
    });
    sourceDiversity = guardOutcome(violations.length > 0 ? 'failed' : 'passed', violations);
  }

  // Only a record that names both lists can prove alignment; a record with
  // one side missing is no evidence either way. Two rules keep the verdict
  // honest across a long run: only the newest such record is judged, because a
  // run recovers once a later iteration is back on focus and one off-focus
  // iteration must not hold it at CONTINUE forever; and the comparison ignores
  // a leading question-id prefix, so a leaf that writes "Q1: ..." ids still
  // matches the bare strategy text instead of failing on formatting alone.
  const records = Array.isArray(iterationRecords) ? iterationRecords : [];
  const alignedRecords = records.filter(
    (record) => record
      && Array.isArray(record.answeredQuestions)
      && Array.isArray(record.keyQuestions),
  );
  const latestAligned = alignedRecords[alignedRecords.length - 1];
  const focusViolations = [];
  if (latestAligned) {
    const keyQuestions = new Set(latestAligned.keyQuestions.map(normalizeQuestionForAlignment));
    for (const question of latestAligned.answeredQuestions) {
      if (!keyQuestions.has(normalizeQuestionForAlignment(question))) focusViolations.push(question);
    }
  }
  const focusAlignment = alignedRecords.length === 0
    ? guardOutcome('notEvaluated', [])
    : guardOutcome(focusViolations.length > 0 ? 'failed' : 'passed', focusViolations);
  const singleWeakSource = guardOutcome('notEvaluated', []);

  return {
    passed: sourceDiversity.passed && focusAlignment.passed && singleWeakSource.passed,
    guards: { sourceDiversity, focusAlignment, singleWeakSource },
  };
}

function evaluateReviewLegalStopGates(review, options = {}) {
  const settings = options && typeof options === 'object' ? options : {};
  const facts = review && typeof review === 'object' ? review : {};
  const missingDimensions = Array.isArray(facts.missingDimensions) ? facts.missingDimensions : [];
  const searchDebt = Array.isArray(facts.searchDebt) ? facts.searchDebt : [];
  const candidateCovered = Array.isArray(facts.candidateCovered) ? facts.candidateCovered : [];
  const requiredBugClasses = Array.isArray(facts.requiredBugClasses) ? facts.requiredBugClasses : [];
  const fallbackCovered = Array.isArray(facts.fallbackCoveredBugClasses)
    ? facts.fallbackCoveredBugClasses
    : [];
  const activeP0 = typeof facts.activeP0 === 'number' ? facts.activeP0 : 0;
  const activeP1 = typeof facts.activeP1 === 'number' ? facts.activeP1 : 0;
  const score = typeof settings.weightedStopScore === 'number'
    && Number.isFinite(settings.weightedStopScore)
    ? settings.weightedStopScore
    : 0;

  const gates = {
    convergenceGate: {
      pass: settings.hardStop === true || score >= 0.60,
      skipped: false,
      score,
      hardStop: settings.hardStop === true,
    },
    dimensionCoverageGate: {
      pass: missingDimensions.length === 0
        && facts.traceabilityCovered === true
        && facts.coverageAge >= 1,
      skipped: false,
      missing: missingDimensions,
    },
    p0ResolutionGate: {
      pass: activeP0 === 0,
      skipped: false,
      activeP0,
    },
    evidenceDensityGate: {
      pass: typeof facts.evidenceBackedP0P1 === 'number'
        && facts.evidenceBackedP0P1 >= activeP0 + activeP1,
      skipped: false,
    },
    hotspotSaturationGate: {
      pass: facts.hotspotSaturated === true,
      skipped: false,
    },
    claimAdjudicationGate: {
      pass: facts.lastClaimAdjudicationPassed !== false || activeP0 + activeP1 === 0,
      skipped: false,
    },
    fixCompletenessReplayGate: {
      pass: facts.securitySensitiveFixScope !== true
        || facts.fixReplayPassingRows >= facts.fixReplayRequiredRows,
      skipped: false,
    },
    candidateCoverageGate: { pass: true, skipped: true },
    graphlessFallbackGate: { pass: true, skipped: true },
  };

  if (facts.reviewDepthSchemaVersion === 2) {
    const applicability = facts.reviewDepthApplicability
      && typeof facts.reviewDepthApplicability === 'object'
      ? facts.reviewDepthApplicability
      : null;
    const trivialScope = applicability !== null
      && applicability.scopeClass === 'trivial'
      && applicability.enforcement === 'skip'
      && Array.isArray(applicability.evidenceRefs)
      && applicability.evidenceRefs.length > 0;
    const everyRequiredClassCovered = searchDebt.length === 0
      && requiredBugClasses.every((bugClass) => candidateCovered.includes(bugClass));
    gates.candidateCoverageGate = {
      pass: trivialScope || everyRequiredClassCovered,
      skipped: false,
    };

    // Only a recorded coverage mode can demand fallback evidence; an absent
    // mode leaves the gate unevaluated rather than failed.
    if (facts.graphCoverageMode === 'graphless_fallback') {
      gates.graphlessFallbackGate = {
        pass: requiredBugClasses.every((bugClass) => fallbackCovered.includes(bugClass)),
        skipped: false,
      };
    } else if (facts.graphCoverageMode != null && facts.graphCoverageMode !== 'graph') {
      gates.graphlessFallbackGate = { pass: false, skipped: false };
    }
  }

  const gateOrder = [
    'convergenceGate',
    'dimensionCoverageGate',
    'p0ResolutionGate',
    'evidenceDensityGate',
    'hotspotSaturationGate',
    'claimAdjudicationGate',
    'fixCompletenessReplayGate',
    'candidateCoverageGate',
    'graphlessFallbackGate',
  ];
  const failed = gateOrder.filter((name) => gates[name].pass !== true);
  return { passed: failed.length === 0, gates, failed };
}

function blockerName(blocker) {
  if (typeof blocker === 'string') return blocker;
  if (blocker && typeof blocker === 'object' && typeof blocker.type === 'string') {
    return blocker.type;
  }
  return 'graph_blocker';
}

function combineGraphDecision(candidate, graphDecision, graphBlockers) {
  const reasonDetail = candidate && typeof candidate.reasonDetail === 'string'
    ? candidate.reasonDetail
    : 'composite_converged';

  if (graphDecision === 'STOP_ALLOWED') {
    return { decision: 'STOP', stopReason: 'converged', reasonDetail, blockedBy: [] };
  }
  if (graphDecision === 'STOP_BLOCKED') {
    const blockers = Array.isArray(graphBlockers) ? graphBlockers.map(blockerName) : [];
    return {
      decision: 'BLOCKED',
      stopReason: 'blockedStop',
      reasonDetail: 'graphStopBlocked',
      blockedBy: blockers.length > 0 ? blockers : ['graph_blocker'],
    };
  }
  if (graphDecision === 'CONTINUE') {
    return {
      decision: 'CONTINUE',
      stopReason: null,
      reasonDetail: 'graph_convergence_continue',
      blockedBy: [],
    };
  }
  return {
    decision: 'CONTINUE',
    stopReason: null,
    reasonDetail: 'graphDecisionMissing',
    blockedBy: [],
  };
}

function buildStopDecision(input) {
  const source = input && typeof input === 'object' ? input : {};
  const loopType = source.loopType;
  const config = source.config && typeof source.config === 'object' ? source.config : {};
  const research = source.research && typeof source.research === 'object' ? source.research : {};
  const review = source.review && typeof source.review === 'object' ? source.review : {};
  const ratios = Array.isArray(source.ratios) ? source.ratios : [];
  const iterationCount = typeof source.iterationCount === 'number' ? source.iterationCount : 0;
  const stuckCount = typeof source.stuckCount === 'number' ? source.stuckCount : 0;
  const consecutiveFailureCount = typeof source.consecutiveFailureCount === 'number'
    ? source.consecutiveFailureCount
    : 0;
  const maxIterations = Number.isFinite(config.maxIterations) ? config.maxIterations : Infinity;
  const stuckThreshold = Number.isFinite(config.stuckThreshold) ? config.stuckThreshold : Infinity;
  const minIterations = Number.isFinite(config.minIterations) ? config.minIterations : 0;
  const missingDimensions = Array.isArray(review.missingDimensions) ? review.missingDimensions : [];
  const totalDimensions = typeof review.totalDimensions === 'number' ? review.totalDimensions : 0;
  const coverage = loopType === 'review'
    ? {
      covered: totalDimensions - missingDimensions.length,
      total: totalDimensions,
      traceabilityCovered: review.traceabilityCovered,
      coverageAge: review.coverageAge,
    }
    : {
      answered: typeof research.answeredCount === 'number' ? research.answeredCount : 0,
      total: typeof research.totalQuestions === 'number' ? research.totalQuestions : 0,
    };

  const signalResult = computeStopSignals({
    loopType,
    ratios,
    convergenceThreshold: config.convergenceThreshold,
    coverage,
  });

  const qualityGuards = loopType === 'research'
    ? evaluateResearchQualityGuards({
      answeredQuestionSourceCounts: research.answeredQuestionSourceCounts,
      iterationRecords: research.iterationRecords,
    })
    : null;
  const failedGuards = qualityGuards
    ? Object.keys(qualityGuards.guards).filter((name) => !qualityGuards.guards[name].passed)
    : [];

  const gatesAt = (hardStop) => {
    if (loopType === 'review') {
      const result = evaluateReviewLegalStopGates(review, {
        weightedStopScore: signalResult.weightedStopScore,
        hardStop,
      });
      return { gates: result.gates, failed: result.failed };
    }
    return { gates: { qualityGuards }, failed: failedGuards };
  };

  const emit = (decision, stopReason, reasonDetail, evaluated, blockedBy) => ({
    decision,
    stopReason,
    reasonDetail,
    weightedStopScore: signalResult.weightedStopScore,
    signals: signalResult.signals,
    gates: evaluated.gates,
    blockedBy,
    graphDecision: source.graphDecision ?? null,
    inputs: input,
  });

  const cleanReviewStop = loopType === 'review'
    && missingDimensions.length === 0
    && review.traceabilityCovered === true
    && review.activeP0 === 0
    && review.activeP1 === 0
    && review.coverageAge >= 1;

  // The cap is terminal and outranks every veto; failed guards or gates are
  // reported as evidence instead of changing the outcome.
  if (iterationCount >= maxIterations) {
    const capGates = gatesAt(true);
    return emit(
      'STOP',
      'maxIterationsReached',
      'maxIterationsReached',
      capGates,
      capGates.failed,
    );
  }

  if (consecutiveFailureCount >= CONSECUTIVE_FAILURE_LIMIT) {
    return emit('STOP', 'error', 'consecutiveFailures', gatesAt(false), []);
  }

  if (stuckCount >= stuckThreshold) {
    return emit('STUCK_RECOVERY', 'stuckRecovery', 'stuckThresholdReached', gatesAt(false), []);
  }

  if (config.convergenceMode === 'off') {
    return emit('CONTINUE', null, 'convergenceModeOff', gatesAt(false), []);
  }

  if (config.stopPolicy === 'max-iterations') {
    return emit('CONTINUE', null, 'stopPolicyMaxIterations', gatesAt(false), []);
  }

  let candidate = null;
  if (loopType === 'review') {
    if (cleanReviewStop) {
      candidate = { reasonDetail: 'all_dimensions_clean', hardStop: true };
    } else if (signalResult.stopCandidate) {
      candidate = { reasonDetail: 'composite_converged', hardStop: false };
    }
  } else if (coverage.total > 0 && coverage.answered >= coverage.total) {
    candidate = { reasonDetail: 'all_questions_answered', hardStop: false };
  } else if (signalResult.stopCandidate) {
    candidate = { reasonDetail: 'composite_converged', hardStop: false };
  }

  if (!candidate) {
    return emit('CONTINUE', null, 'noStopCandidate', gatesAt(false), []);
  }

  if (minIterations > 1 && iterationCount < minIterations) {
    return emit('CONTINUE', null, 'minIterationsNotReached', gatesAt(false), []);
  }

  // An expansive run that still holds open frontier nodes turns a stop
  // candidate into another iteration. It never creates a stop, and everything
  // above it (cap, failures, stuck recovery, off, max-iterations, the floor)
  // still wins. A review clean candidate is a hard stop, so keying the veto on
  // soft candidates alone would leave a review run no way to spend the
  // iteration its open nodes need.
  const depthFacts = loopType === 'review' ? review : research;
  const vetoable = loopType === 'review' || !candidate.hardStop;
  if (config.depthMode === 'expansive'
    && vetoable
    && Number.isFinite(depthFacts.frontierOpen)
    && depthFacts.frontierOpen > 0) {
    return emit('CONTINUE', null, 'frontierOpen', gatesAt(false), []);
  }

  const evaluated = gatesAt(candidate.hardStop);
  if (loopType === 'review' && evaluated.failed.length > 0) {
    return emit('BLOCKED', 'blockedStop', evaluated.failed[0], evaluated, evaluated.failed);
  }
  if (loopType !== 'review' && failedGuards.length > 0) {
    return emit('CONTINUE', null, 'qualityGuardFailed', evaluated, failedGuards);
  }

  const combined = combineGraphDecision(candidate, source.graphDecision, source.graphBlockers);
  return emit(
    combined.decision,
    combined.stopReason,
    combined.reasonDetail,
    evaluated,
    combined.blockedBy,
  );
}

// The stop decision reads loop state from files, so these helpers stay
// independent of the coverage graph and remain usable when the graph fails.
function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function finiteNumberOrNull(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function stopDecisionNumberFlag(value, key) {
  if (value === undefined || value === null || value === true || value === '') return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw inputError(`${key} must be a finite number`);
  return Math.trunc(parsed);
}

function readJsonObjectFile(filePath, key) {
  if (!fs.existsSync(filePath)) throw inputError(`${key} file does not exist: ${filePath}`);
  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch {
    throw inputError(`${key} file is not readable: ${filePath}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw inputError(`${key} file must be JSON: ${filePath}`);
  }
  if (!isPlainObject(parsed)) throw inputError(`${key} file must hold a JSON object: ${filePath}`);
  return parsed;
}

function readStateLogRows(filePath) {
  if (!fs.existsSync(filePath)) throw inputError(`stateLog file does not exist: ${filePath}`);
  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch {
    throw inputError(`stateLog file is not readable: ${filePath}`);
  }
  const rows = [];
  let lineCount = 0;
  for (const line of raw.split(/\r?\n/)) {
    if (line.trim() === '') continue;
    lineCount += 1;
    try {
      const parsed = JSON.parse(line);
      if (isPlainObject(parsed)) rows.push(parsed);
    } catch {
      // A torn line is not a record; the rows after it still carry loop state.
    }
  }
  if (lineCount > 0 && rows.length === 0) {
    throw inputError(`stateLog file must hold one JSON object per line: ${filePath}`);
  }
  return rows;
}

// The three stop-decision inputs are independent of the graph, so they are read
// and validated before any graph work: a malformed request must fail as an
// input error rather than as whatever the graph layer reports first.
function readStopDecisionFiles(args) {
  const configPath = ensureString(args, 'configPath');
  const stateLogPath = validateNamespaceValue(ensureString(args, 'stateLog'), 'stateLog', inputError);
  const registryPath = typeof args.registryPath === 'string' && args.registryPath !== ''
    ? args.registryPath
    : null;
  return {
    config: readJsonObjectFile(configPath, 'configPath'),
    stateLogRows: readStateLogRows(stateLogPath),
    // An absent registry is a loop with no recorded findings yet, not a broken
    // request; only a present-but-unreadable registry file is an error.
    registry: registryPath === null || !fs.existsSync(registryPath)
      ? {}
      : readJsonObjectFile(registryPath, 'registryPath'),
  };
}

function iterationRecordNumber(row) {
  const declared = finiteNumberOrNull(row.iteration);
  return declared !== null ? declared : finiteNumberOrNull(row.run);
}

function orderedIterationRecords(stateRows) {
  const byNumber = new Map();
  const unnumbered = [];
  for (const row of stateRows) {
    if (!isPlainObject(row) || row.type !== 'iteration') continue;
    const number = iterationRecordNumber(row);
    if (number === null) {
      unnumbered.push(row);
    } else {
      // A later row for the same iteration supersedes the earlier one.
      byNumber.set(number, row);
    }
  }
  const numbered = [...byNumber.entries()]
    .sort((left, right) => left[0] - right[0])
    .map(([, row]) => row);
  return [...numbered, ...unnumbered];
}

// The counters are rebuilt from the log on every pass, so a resumed run counts
// the same as a run that never paused.
function deriveLoopCounters(records, options) {
  const rows = Array.isArray(records) ? records : [];
  const settings = isPlainObject(options) ? options : {};
  const loopType = settings.loopType;
  const convergenceThreshold = finiteNumberOrNull(settings.convergenceThreshold);
  const researchThreshold = convergenceThreshold !== null && convergenceThreshold > 0
    ? convergenceThreshold
    : 0.05;
  const reviewThreshold = mapReviewThresholds(convergenceThreshold).noProgressCutoff;

  // A redispatched iteration supersedes its earlier rows, and the surviving row
  // counts at the position of the last row for that iteration.
  const lastIndexByNumber = new Map();
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    if (!isPlainObject(row) || row.type !== 'iteration') continue;
    const number = iterationRecordNumber(row);
    if (number !== null) lastIndexByNumber.set(number, index);
  }

  let stuckCount = 0;
  let consecutiveFailureCount = 0;
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    if (!isPlainObject(row)) continue;
    if ((row.type === 'event' && row.event === 'stuckRecovery')
      || row.stem === 'deep_review.recovery_started') {
      stuckCount = 0;
      continue;
    }
    if (row.type !== 'iteration') continue;
    const number = iterationRecordNumber(row);
    if (number !== null && lastIndexByNumber.get(number) !== index) continue;
    if (row.status === 'thought') continue;
    if (row.status === 'error' || row.status === 'timeout') {
      consecutiveFailureCount += 1;
      continue;
    }

    consecutiveFailureCount = 0;
    if (row.status === 'insight') {
      stuckCount = 0;
      continue;
    }
    const ratio = loopType === 'review'
      ? finiteNumberOrNull(row.newFindingsRatio)
      : finiteNumberOrNull(row.newInfoRatio);
    const low = loopType === 'review'
      ? ratio !== null && ratio <= reviewThreshold
      : ratio !== null && ratio < researchThreshold;
    stuckCount = low ? stuckCount + 1 : 0;
  }

  return { stuckCount, consecutiveFailureCount };
}

function stopDecisionConfig(config, loopType, args) {
  const antiConvergence = isPlainObject(config.antiConvergence) ? config.antiConvergence : {};
  const maxIterations = finiteNumberOrNull(config.maxIterations);
  const declaredMinIterations = finiteNumberOrNull(config.minIterations)
    ?? finiteNumberOrNull(antiConvergence.minIterations)
    ?? 0;
  const modeFlagGiven = args.convergenceMode !== undefined || args.convergence_mode !== undefined;
  const configMode = antiConvergence.convergenceMode;
  const depthModeValue = args.depthMode ?? args.depth_mode ?? antiConvergence.depthMode;
  return {
    maxIterations,
    // A floor above the cap could never be reached; cap it at the cap.
    minIterations: maxIterations === null
      ? declaredMinIterations
      : Math.min(declaredMinIterations, maxIterations),
    convergenceThreshold: finiteNumberOrNull(config.convergenceThreshold),
    stopPolicy: config.stopPolicy === 'max-iterations' ? 'max-iterations' : 'convergence',
    stuckThreshold: finiteNumberOrNull(config.stuckThreshold) ?? (loopType === 'review' ? 2 : 3),
    convergenceMode: modeFlagGiven
      ? readConvergenceModeConfig(args).mode
      : typeof configMode === 'string' && configMode !== '' ? configMode : 'default',
    // Only an expansive run carries the key, so a default run echoes the same
    // config bytes it did before the depth mode existed.
    ...(depthModeValue === 'expansive' ? { depthMode: 'expansive' } : {}),
  };
}

// Distinct SOURCE nodes behind the FINDING nodes that answer each question.
// The counts are null when the graph holds no answered QUESTION node, which
// keeps the source-diversity guard unevaluated instead of failed.
function answeredQuestionSourceCounts(nodes, edges) {
  const nodeList = Array.isArray(nodes) ? nodes : [];
  const edgeList = Array.isArray(edges) ? edges : [];
  const kindById = new Map(nodeList.map((node) => [node?.id, node?.kind]));
  const answeringQuestionIds = new Set(
    edgeList.filter((edge) => edge?.relation === 'ANSWERS').map((edge) => edge.targetId),
  );
  const questionIds = nodeList
    .filter((node) => node?.kind === 'QUESTION' && answeringQuestionIds.has(node.id))
    .map((node) => node.id)
    .sort();
  if (questionIds.length === 0) return null;

  const citedSourcesByFinding = new Map();
  for (const edge of edgeList) {
    if (edge?.relation !== 'CITES') continue;
    if (kindById.get(edge.sourceId) !== 'FINDING') continue;
    if (kindById.get(edge.targetId) !== 'SOURCE') continue;
    if (!citedSourcesByFinding.has(edge.sourceId)) {
      citedSourcesByFinding.set(edge.sourceId, new Set());
    }
    citedSourcesByFinding.get(edge.sourceId).add(edge.targetId);
  }

  const counts = {};
  for (const questionId of questionIds) {
    const sources = new Set();
    for (const edge of edgeList) {
      if (edge?.relation !== 'ANSWERS' || edge.targetId !== questionId) continue;
      if (kindById.get(edge.sourceId) !== 'FINDING') continue;
      for (const sourceId of citedSourcesByFinding.get(edge.sourceId) ?? []) sources.add(sourceId);
    }
    counts[questionId] = sources.size;
  }
  return counts;
}

function stopDecisionResearchFacts(registry, evidenceRecords, graph) {
  const metrics = isPlainObject(registry.metrics) ? registry.metrics : {};
  const resolvedQuestions = Array.isArray(registry.resolvedQuestions) ? registry.resolvedQuestions : [];
  const openQuestions = Array.isArray(registry.openQuestions) ? registry.openQuestions : [];
  const answeredCount = finiteNumberOrNull(metrics.resolvedQuestions) ?? resolvedQuestions.length;
  const openCount = finiteNumberOrNull(metrics.openQuestions) ?? openQuestions.length;
  return {
    answeredCount,
    totalQuestions: answeredCount + openCount,
    iterationRecords: evidenceRecords.map((record) => {
      const projected = {};
      if (Array.isArray(record.answeredQuestions)) projected.answeredQuestions = record.answeredQuestions;
      if (Array.isArray(record.keyQuestions)) projected.keyQuestions = record.keyQuestions;
      return projected;
    }),
    // A failed graph cannot prove which questions have sources; null keeps the
    // guard unevaluated instead of failing it on missing evidence.
    answeredQuestionSourceCounts: isPlainObject(graph) && graph.failed === true
      ? null
      : answeredQuestionSourceCounts(graph?.nodes, graph?.edges),
    ...(isPlainObject(registry.frontier) && Array.isArray(registry.frontier.nodes)
      ? { frontierOpen: registry.frontier.nodes.filter((node) => node?.status === 'open' || node?.status === 'active').length }
      : {}),
  };
}

function reviewCoverageAge(evidenceRecords, dimensions) {
  if (dimensions.length === 0) return 0;
  const covered = new Set();
  for (let index = 0; index < evidenceRecords.length; index += 1) {
    const record = evidenceRecords[index];
    if (Array.isArray(record.dimensions)) {
      for (const dimension of record.dimensions) covered.add(dimension);
    }
    if (dimensions.every((dimension) => covered.has(dimension))) {
      return evidenceRecords.length - 1 - index;
    }
  }
  return 0;
}

function reviewTraceabilityCovered(config, registry) {
  const traceability = isPlainObject(registry.traceability) ? registry.traceability : {};
  const summary = isPlainObject(traceability.summary) ? traceability.summary : null;
  const core = isPlainObject(config.crossReference) && Array.isArray(config.crossReference.core)
    ? config.crossReference.core
    : [];
  const settingsPassed = summary !== null ? summary.gatingFailures === 0 : core.length === 0;
  if (!settingsPassed) return false;

  const results = Array.isArray(traceability.results) ? traceability.results : [];
  const incompleteStatuses = new Set(['', 'pending', 'deferred', 'skipped']);
  return core.every((id) => results.some((entry) => {
    if (!isPlainObject(entry) || entry.protocolId !== id) return false;
    if (typeof entry.status !== 'string') return false;
    return !incompleteStatuses.has(entry.status.toLowerCase());
  }));
}

// The core protocols a stop still owes. A review that reaches its iteration cap
// before every veto has run closes over a partial verdict, so the ids are
// reported as a stop input and the last iteration can be steered to them.
function reviewUnfinishedCoreProtocols(config, registry) {
  const core = isPlainObject(config?.crossReference) && Array.isArray(config.crossReference.core)
    ? config.crossReference.core
    : [];
  if (core.length === 0) return [];

  const traceability = isPlainObject(registry?.traceability) ? registry.traceability : {};
  const results = Array.isArray(traceability.results) ? traceability.results : [];
  const latestStatusById = new Map();
  for (const entry of results) {
    if (!isPlainObject(entry) || typeof entry.protocolId !== 'string') continue;
    latestStatusById.set(
      entry.protocolId,
      typeof entry.status === 'string' ? entry.status.toLowerCase() : '',
    );
  }

  const unfinishedStatuses = new Set(['', 'pending', 'deferred', 'skipped', 'partial', 'blocked']);
  return core.filter((id) => unfinishedStatuses.has(latestStatusById.get(id) ?? ''));
}

function lastClaimAdjudicationPassed(stateRows) {
  let lastMatch = null;
  for (const row of stateRows) {
    if (isPlainObject(row) && row.type === 'event' && row.event === 'claim_adjudication') {
      lastMatch = row;
    }
  }
  return lastMatch !== null && typeof lastMatch.passed === 'boolean' ? lastMatch.passed : null;
}

function reviewFallbackCoveredBugClasses(iterationRecords) {
  const evidenceMethods = new Set([
    'direct_read',
    'exact_grep',
    'semantic_search',
    'producer_consumer_trace',
    'negative_test_inspection',
  ]);
  const covered = new Set();
  for (const record of iterationRecords) {
    if (!Array.isArray(record.searchLedger)) continue;
    for (const row of record.searchLedger) {
      if (!isPlainObject(row) || typeof row.bugClass !== 'string') continue;
      if (!Array.isArray(row.evidenceRefs) || row.evidenceRefs.length === 0) continue;
      const actions = Array.isArray(row.searchActions) ? row.searchActions : [];
      if (!actions.some((action) => isPlainObject(action) && evidenceMethods.has(action.method))) {
        continue;
      }
      covered.add(row.bugClass);
    }
  }
  return [...covered].sort();
}

function graphHotspotSaturation(graph) {
  if (!isPlainObject(graph) || graph.failed === true) return null;
  const trace = Array.isArray(graph.trace) ? graph.trace : [];
  const entry = trace.find(
    (candidate) => isPlainObject(candidate) && candidate.signal === 'hotspotSaturation',
  );
  return entry !== undefined && typeof entry.passed === 'boolean' ? entry.passed : null;
}

function stopDecisionReviewFacts(options = {}) {
  const {
    config,
    registry,
    evidenceRecords,
    iterationRecords,
    stateRows,
    args,
    graph,
  } = options;
  const coverage = isPlainObject(registry.dimensionCoverage) ? registry.dimensionCoverage : {};
  const dimensions = Array.isArray(config.reviewDimensions)
    ? config.reviewDimensions
    : Object.keys(coverage);
  const findingsBySeverity = isPlainObject(registry.findingsBySeverity)
    ? registry.findingsBySeverity
    : {};
  const openFindings = Array.isArray(registry.openFindings) ? registry.openFindings : [];
  const searchCoverage = isPlainObject(registry.searchCoverage) ? registry.searchCoverage : {};
  const candidateCoverage = isPlainObject(registry.candidateCoverage) ? registry.candidateCoverage : {};
  const lastIteration = iterationRecords.length > 0
    ? iterationRecords[iterationRecords.length - 1]
    : null;

  return {
    totalDimensions: dimensions.length,
    missingDimensions: dimensions.filter((dimension) => coverage[dimension] !== true),
    coverageAge: reviewCoverageAge(evidenceRecords, dimensions),
    traceabilityCovered: reviewTraceabilityCovered(config, registry),
    unfinishedCoreProtocols: reviewUnfinishedCoreProtocols(config, registry),
    activeP0: finiteNumberOrNull(findingsBySeverity.P0) ?? 0,
    activeP1: finiteNumberOrNull(findingsBySeverity.P1) ?? 0,
    evidenceBackedP0P1: openFindings.filter((finding) => (
      isPlainObject(finding)
      && (finding.severity === 'P0' || finding.severity === 'P1')
      && finding.file !== null
      && finding.file !== undefined
      && finding.line !== null
      && finding.line !== undefined
    )).length,
    hotspotSaturated: graphHotspotSaturation(graph),
    lastClaimAdjudicationPassed: lastClaimAdjudicationPassed(stateRows),
    securitySensitiveFixScope: asBoolean(args.securitySensitiveFixScope),
    fixReplayRequiredRows: stopDecisionNumberFlag(args.fixReplayRequiredRows, 'fixReplayRequiredRows') ?? 0,
    fixReplayPassingRows: stopDecisionNumberFlag(args.fixReplayPassingRows, 'fixReplayPassingRows') ?? 0,
    reviewDepthSchemaVersion: lastIteration !== null && Number.isFinite(lastIteration.reviewDepthSchemaVersion)
      ? lastIteration.reviewDepthSchemaVersion
      : null,
    reviewDepthApplicability: lastIteration !== null && isPlainObject(lastIteration.reviewDepthApplicability)
      ? lastIteration.reviewDepthApplicability
      : null,
    searchDebt: Array.isArray(registry.searchDebt) ? registry.searchDebt : [],
    candidateCovered: Array.isArray(candidateCoverage.covered) ? candidateCoverage.covered : [],
    requiredBugClasses: Array.isArray(searchCoverage.requiredBugClasses)
      ? searchCoverage.requiredBugClasses
      : [],
    graphCoverageMode: typeof searchCoverage.graphCoverageMode === 'string'
      ? searchCoverage.graphCoverageMode
      : null,
    fallbackCoveredBugClasses: reviewFallbackCoveredBugClasses(iterationRecords),
    ...(isPlainObject(registry.frontier) && Array.isArray(registry.frontier.nodes)
      ? { frontierOpen: registry.frontier.nodes.filter((node) => node?.status === 'open' || node?.status === 'active').length }
      : {}),
  };
}

function buildStopDecisionInput(args, loopType, files, graph) {
  const config = isPlainObject(files?.config) ? files.config : {};
  const registry = isPlainObject(files?.registry) ? files.registry : {};
  const stateRows = Array.isArray(files?.stateLogRows) ? files.stateLogRows : [];
  const iterationRecords = orderedIterationRecords(stateRows);
  const evidenceRecords = iterationRecords.filter(
    (record) => record.status !== 'thought' && record.status !== 'error' && record.status !== 'timeout',
  );
  const ratioKey = loopType === 'review' ? 'newFindingsRatio' : 'newInfoRatio';
  const ratios = evidenceRecords
    .map((record) => record[ratioKey])
    .filter((value) => typeof value === 'number' && Number.isFinite(value));
  const decisionConfig = stopDecisionConfig(config, loopType, args);
  const convergenceThreshold = decisionConfig.convergenceThreshold === null
    ? undefined
    : decisionConfig.convergenceThreshold;
  const counters = deriveLoopCounters(stateRows, { loopType, convergenceThreshold });

  return {
    loopType,
    iterationCount: stopDecisionNumberFlag(args.iterationCount, 'iterationCount')
      ?? iterationRecords.length,
    stuckCount: counters.stuckCount,
    consecutiveFailureCount: counters.consecutiveFailureCount,
    config: decisionConfig,
    ratios,
    research: loopType === 'research'
      ? stopDecisionResearchFacts(registry, evidenceRecords, graph)
      : null,
    review: loopType === 'review'
      ? stopDecisionReviewFacts({
        config,
        registry,
        evidenceRecords,
        iterationRecords,
        stateRows,
        args,
        graph,
      })
      : null,
    graphDecision: graph?.decision ?? null,
    graphBlockers: isPlainObject(graph) && Array.isArray(graph.blockers) ? graph.blockers : [],
  };
}

function buildStopDecisionGraphFailurePayload(error, args, loopType, files) {
  const input = buildStopDecisionInput(args, loopType, files, { failed: true });
  return {
    status: 'ok',
    data: null,
    graph_decision: null,
    graph_error: error instanceof Error ? error.message : String(error),
    stop_decision: buildStopDecision(input),
    loop_counters_json: {
      stuckCount: input.stuckCount,
      consecutiveFailureCount: input.consecutiveFailureCount,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();
  assertKnownFlags(args, CONVERGENCE_FLAGS, inputError);
  const specFolder = validateNamespaceValue(ensureString(args, 'specFolder'), 'specFolder', inputError);
  const loopType = ensureString(args, 'loopType');
  const sessionId = validateNamespaceValue(ensureString(args, 'sessionId'), 'sessionId', inputError);
  if (loopType !== 'research' && loopType !== 'review' && loopType !== 'context') {
    throw inputError('loopType must be "research", "review", or "context"');
  }
  const stopDecisionRequested = args.stopDecision === true;
  if (stopDecisionRequested && loopType !== 'research' && loopType !== 'review') {
    throw inputError('--stop-decision is supported only for "research" and "review" loop types');
  }
  // Read the state files before the graph is opened so a bad request exits as
  // an input error instead of depending on graph availability.
  const stopDecisionFiles = stopDecisionRequested ? readStopDecisionFiles(args) : null;

  const ns = { specFolder, loopType, sessionId };
  const readOnly = args.readOnly === true;
  let db = null;

  try {
    db = await import('../lib/coverage-graph/coverage-graph-db.ts');
    if (readOnly) db.openReadOnlyDb();
    installSignalHandlers(() => db?.closeDb());
    maybeThrowTestFault();

    const signalsLib = await import('../lib/coverage-graph/coverage-graph-signals.ts');
    const queryLib = await import('../lib/coverage-graph/coverage-graph-query.ts');
    const nodes = db.getNodes(ns);
    const edges = db.getEdges(ns);
    const snapshots = db.getSnapshots(specFolder, loopType, sessionId);
    const convergenceModeConfig = readConvergenceModeConfig(args);
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
        scoreDelta: null,
        scoreDeltaNote: 'no prior snapshot',
        signals: null,
        blockers: [],
        trace: [],
        namespace: ns,
        scopeMode: 'session',
        ...(readOnly ? { readOnly: true, databasePresent: db.isReadOnlyDbPresent() } : {}),
        nodeCount: 0,
        edgeCount: 0,
      };
      if (convergenceModeConfig.mode === 'divergent') data.convergenceMode = convergenceModeConfig.mode;
      const payload = { status: 'ok', data, graph_decision: data.decision, graph_decision_json: JSON.stringify(data.decision), graph_signals_json: {}, graph_blockers_json: [], graph_blockers_csv: '', graph_stop_blocked: false, graph_trace_json: [], graph_convergence_score: 0, graph_score_delta: null, graph_score_delta_json: 'null' };
      if (stopDecisionRequested) {
        const stopDecisionInput = buildStopDecisionInput(
          args,
          loopType,
          stopDecisionFiles,
          {
            decision: data.decision,
            blockers: [],
            nodes: [],
            edges: [],
            trace: [],
          },
        );
        payload.stop_decision = buildStopDecision(stopDecisionInput);
        payload.loop_counters_json = {
          stuckCount: stopDecisionInput.stuckCount,
          consecutiveFailureCount: stopDecisionInput.consecutiveFailureCount,
        };
      }
      if (!readOnly) appendConvergenceObservabilityEvent(db, payload, ns);
      jsonOut(payload);
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
    const priorSnapshot = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
    const scoreDelta = computeScoreDelta(score, priorSnapshot);
    const scoreDeltaNote = priorSnapshot === null
      ? 'no prior snapshot'
      : scoreDelta === null ? 'prior snapshot has no score' : 'prior snapshot compared';
    const improvementEffect = shouldTraceImprovementEffect(args) ? buildImprovementEffect(snapshots, scoreDelta) : null;
    const graphNoveltyTelemetry = loopType === 'research'
      ? buildGraphNoveltyTelemetry(signalsLib, nodes, edges, snapshots, convergenceModeConfig)
      : null;
    const noveltyCorroboration = loopType === 'research'
      ? buildNoveltyCorroboration(signalsLib, nodes, edges, snapshots, args, graphNoveltyTelemetry)
      : null;
    const observationThresholdConfig = readObservationThresholdConfig(args);
    const observationThreshold = observationThresholdConfig.enabled && loopType === 'research'
      ? signalsLib.computeFindingObservationSignalsFromData(nodes, edges, observationThresholdConfig.minObservations)
      : null;
    let baseSignalsWithScore = { ...signals, score };
    if (graphNoveltyTelemetry) {
      baseSignalsWithScore = { ...baseSignalsWithScore, ...graphNoveltyTelemetry };
    }
    if (noveltyCorroboration) {
      baseSignalsWithScore = {
        ...baseSignalsWithScore,
        graphNoveltyDelta: noveltyCorroboration.graphNoveltyDelta,
        reportedNovelty: noveltyCorroboration.reportedNovelty,
        effectiveNovelty: noveltyCorroboration.effectiveNovelty,
      };
    }
    const signalsWithScore = observationThreshold
      ? {
          ...baseSignalsWithScore,
          minObservations: observationThreshold.minObservations,
          observationThreshold,
        }
      : baseSignalsWithScore;
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
    const noveltyGuarded = applyNoveltyCorroborationGuard(decision, blockers, trace, noveltyCorroboration);
    decision = noveltyGuarded.decision;
    blockers = noveltyGuarded.blockers;
    trace = noveltyGuarded.trace;
    const observationGuarded = applyObservationThresholdGuard(decision, blockers, trace, observationThreshold);
    decision = observationGuarded.decision;
    blockers = observationGuarded.blockers;
    trace = observationGuarded.trace;
    const blockingBlockers = blockers.filter((blocker) => blocker.severity === 'blocking');
    const momentum = snapshots.length < 2
      ? null
      : Object.fromEntries(Object.keys(snapshots[snapshots.length - 1].metrics || {}).flatMap((key) => {
          const latest = snapshots[snapshots.length - 1].metrics[key];
          const previous = snapshots[snapshots.length - 2].metrics[key];
          return typeof latest === 'number' && typeof previous === 'number' ? [[key, latest - previous]] : [];
        }));

    const persistSnapshot = !readOnly && asBoolean(args.persistSnapshot);
    const snapshotPersisted = persistSnapshot && args.iteration !== undefined;
    if (snapshotPersisted) {
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
      scoreDelta,
      scoreDeltaNote,
      signals: signalsWithScore,
      blockers,
      trace,
      momentum,
      namespace: ns,
      scopeMode: 'session',
      ...(readOnly ? { readOnly: true, databasePresent: db.isReadOnlyDbPresent() } : {}),
      notes: ['Convergence signals were computed from the session-scoped subgraph only.'],
      snapshotPersistence: snapshotPersisted
        ? 'persisted'
        : persistSnapshot ? 'skipped_missing_iteration' : 'not_requested',
      nodeCount: stats.totalNodes,
      edgeCount: stats.totalEdges,
      lastIteration: stats.lastIteration,
    };
    if (convergenceModeConfig.mode === 'divergent') data.convergenceMode = convergenceModeConfig.mode;
    if (improvementEffect) data.improvementEffect = improvementEffect;
    if (observationThreshold) data.observationThreshold = observationThreshold;
    const payload = {
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
      graph_score_delta: scoreDelta,
      graph_score_delta_json: JSON.stringify(scoreDelta),
    };
    if (improvementEffect) payload.graph_improvement_effect_json = improvementEffect;
    if (observationThreshold) payload.graph_observation_threshold_json = observationThreshold;
    if (stopDecisionRequested) {
      const stopDecisionInput = buildStopDecisionInput(
        args,
        loopType,
        stopDecisionFiles,
        { decision, blockers, nodes, edges, trace },
      );
      payload.stop_decision = buildStopDecision(stopDecisionInput);
      payload.loop_counters_json = {
        stuckCount: stopDecisionInput.stuckCount,
        consecutiveFailureCount: stopDecisionInput.consecutiveFailureCount,
      };
    }
    if (!readOnly) appendConvergenceObservabilityEvent(db, payload, ns);
    jsonOut(payload);
  } catch (err) {
    // The stop decision is read from loop state files, so a graph that cannot
    // be opened or evaluated still leaves a usable decision; report the missing
    // graph decision instead of failing the request.
    if (!stopDecisionRequested || (err && err.code === 'INPUT_VALIDATION')) throw err;
    jsonOut(buildStopDecisionGraphFailurePayload(err, args, loopType, stopDecisionFiles));
  } finally {
    db?.closeDb();
  }
}

module.exports = {
  CONVERGENCE_PROFILE_SCHEMA,
  applyNoveltyCorroborationGuard,
  applyObservationThresholdGuard,
  buildImprovementEffect,
  buildStopDecision,
  buildStopDecisionInput,
  combineGraphDecision,
  computeScoreDelta,
  computeStopSignals,
  deriveLoopCounters,
  evaluateResearchQualityGuards,
  evaluateReviewLegalStopGates,
  mapReviewThresholds,
  parseConvergenceModeValue,
  parseMinObservationsValue,
  parseSlidingWindowSizeValue,
  readConvergenceModeConfig,
  readJsonObjectFile,
  readObservationThresholdConfig,
  readStateLogRows,
  reviewUnfinishedCoreProtocols,
  shouldTraceImprovementEffect,
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
