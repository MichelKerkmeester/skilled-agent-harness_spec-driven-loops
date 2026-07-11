// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ reduce-state — dashboard and registry generator                          ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readUtf8(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function readOptionalUtf8(filePath) {
  try {
    return readUtf8(filePath);
  } catch (_error) {
    return null;
  }
}

function parseJson(content, fallback) {
  try {
    return JSON.parse(content);
  } catch (_error) {
    return fallback;
  }
}

function readOptionalJson(filePath) {
  const content = readOptionalUtf8(filePath);
  if (content === null) {
    return null;
  }
  return parseJson(content, null);
}

// Atomic text write: temp + fsync + rename, so a reader always sees either the
// previous complete file or the new one (a crash mid-write never leaves a
// half-written registry or dashboard). Mirrors the runtime writeStateAtomic
// contract for the markdown dashboard, which the JSON-only runtime helper cannot
// serialize.
function writeTextAtomic(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.tmp.${process.pid}.${crypto.randomBytes(6).toString('hex')}`;
  let fd;
  try {
    fs.writeFileSync(tempPath, content, 'utf8');
    fd = fs.openSync(tempPath, 'r');
    fs.fsyncSync(fd);
    fs.closeSync(fd);
    fd = undefined;
    fs.renameSync(tempPath, filePath);
    // Best-effort parent-directory fsync so the rename itself is durable after a
    // crash (mirrors the runtime writeStateAtomic; the inline fallback previously
    // synced only the file, not the directory entry).
    try {
      const dirFd = fs.openSync(path.dirname(filePath), 'r');
      try { fs.fsyncSync(dirFd); } finally { fs.closeSync(dirFd); }
    } catch { /* best-effort: some platforms disallow directory fsync */ }
  } catch (error) {
    if (typeof fd === 'number') { try { fs.closeSync(fd); } catch { /* already closed */ } }
    if (fs.existsSync(tempPath)) { fs.rmSync(tempPath, { force: true }); }
    throw error;
  }
}

function writeStateAtomicInline(filePath, data) {
  writeTextAtomic(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

// Truncate a corrupt JSONL tail in place: keep every complete valid line, drop
// trailing garbage from a crash mid-append. Contract-equivalent to the runtime
// repairJsonlTail, used as the fallback when the TS toolchain is unavailable.
function repairJsonlTailInline(filePath) {
  if (!fs.existsSync(filePath)) return { repaired: false, droppedBytes: 0 };
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.length === 0) return { repaired: false, droppedBytes: 0 };
  const originalBytes = Buffer.byteLength(content, 'utf8');
  let cursor = 0;
  let validEnd = 0;
  const newlineRe = /\r?\n/g;
  while (cursor < content.length) {
    newlineRe.lastIndex = cursor;
    const match = newlineRe.exec(content);
    if (!match) break;
    const lineEnd = match.index;
    const rawLine = content.slice(cursor, lineEnd);
    const nextCursor = lineEnd + match[0].length;
    if (rawLine.trim() !== '') {
      try { JSON.parse(rawLine); } catch { break; }
    }
    validEnd = nextCursor;
    cursor = nextCursor;
  }
  const trailing = content.slice(cursor);
  let keepBytes;
  if (trailing.trim() === '') {
    keepBytes = originalBytes;
  } else {
    try { JSON.parse(trailing); keepBytes = originalBytes; }
    catch { keepBytes = Buffer.byteLength(content.slice(0, validEnd), 'utf8'); }
  }
  const droppedBytes = originalBytes - keepBytes;
  if (droppedBytes <= 0) return { repaired: false, droppedBytes: 0 };
  fs.truncateSync(filePath, keepBytes);
  return { repaired: true, droppedBytes };
}

// Prefer the runtime/ state-safety helpers (single source of truth for
// the atomic-write + jsonl-repair contracts) loaded in-process via the tsx CJS
// register; fall back to the contract-equivalent inline implementations above so
// the reducer stays runnable when the TS toolchain is absent.
// Path depth from scripts/shared/ → three levels up reaches .opencode/skills/.
const TSX_CJS_REGISTER = path.join(__dirname, '..', '..', '..', '..', 'system-spec-kit', 'scripts', 'node_modules', 'tsx', 'dist', 'cjs', 'index.cjs');
const RUNTIME_DEEP_LOOP = path.join(__dirname, '..', '..', '..', 'runtime', 'lib', 'deep-loop');

let _stateSafety = null;
function loadStateSafety() {
  if (_stateSafety) return _stateSafety;
  try {
    require(TSX_CJS_REGISTER);
    const atomic = require(path.join(RUNTIME_DEEP_LOOP, 'atomic-state.ts'));
    const repair = require(path.join(RUNTIME_DEEP_LOOP, 'jsonl-repair.ts'));
    if (typeof atomic.writeStateAtomic === 'function' && typeof repair.repairJsonlTail === 'function') {
      _stateSafety = { writeStateAtomic: atomic.writeStateAtomic, repairJsonlTail: repair.repairJsonlTail, source: 'runtime' };
      return _stateSafety;
    }
  } catch { /* fall through to inline contract-equivalents */ }
  _stateSafety = { writeStateAtomic: writeStateAtomicInline, repairJsonlTail: repairJsonlTailInline, source: 'inline' };
  return _stateSafety;
}

// Parse JSONL content into an array of records. Corrupt lines are reported, not
// silently dropped, so a partial run surfaces rather than hides truncation.
function parseJsonlDetailed(content) {
  const records = [];
  const corruptionWarnings = [];
  let lineNumber = 0;
  for (const rawLine of String(content || '').split('\n')) {
    lineNumber += 1;
    const line = rawLine.trim();
    if (!line) continue;
    try {
      records.push(JSON.parse(line));
    } catch (error) {
      corruptionWarnings.push({
        line: lineNumber,
        // Never persist raw content — a malformed record may carry secrets. Report
        // length + a short content hash so corruption is diagnosable without leakage.
        length: line.length,
        sha256: crypto.createHash('sha256').update(line).digest('hex').slice(0, 12),
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return { records, corruptionWarnings };
}

function parseJsonl(content) {
  return parseJsonlDetailed(content).records;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function finiteNumberOrNull(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function sortObjectKeys(value) {
  return Object.fromEntries(
    Object.entries(value).sort((left, right) => left[0].localeCompare(right[0]))
  );
}

function findNestedState(value, expectedState, seen = new Set()) {
  if (!value || typeof value !== 'object') {
    return null;
  }

  if (seen.has(value)) {
    return null;
  }
  seen.add(value);

  if (isPlainObject(value) && value.state === expectedState) {
    return value;
  }

  const entries = Array.isArray(value) ? value : Object.values(value);
  for (const entry of entries) {
    const found = findNestedState(entry, expectedState, seen);
    if (found) {
      return found;
    }
  }

  return null;
}

function inferRun(record, statePayload, fallbackIndex) {
  const candidates = [
    statePayload?.run,
    statePayload?.iteration,
    statePayload?.runNumber,
    record?.run,
    record?.iteration,
    record?.runNumber,
    record?.label,
    fallbackIndex + 1,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'number' && Number.isFinite(candidate)) {
      return candidate;
    }
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate;
    }
  }

  return fallbackIndex + 1;
}

function extractInsufficientDataIteration(record, fallbackIndex) {
  const statePayload = findNestedState(record, 'insufficientData');
  if (
    !statePayload ||
    typeof statePayload.dataPoints !== 'number' ||
    typeof statePayload.minRequired !== 'number'
  ) {
    return null;
  }

  return {
    run: inferRun(record, statePayload, fallbackIndex),
    dataPoints: statePayload.dataPoints,
    minRequired: statePayload.minRequired,
  };
}

function extractInsufficientSampleIteration(record, fallbackIndex) {
  const statePayload = findNestedState(record, 'insufficientSample');
  if (
    !statePayload ||
    typeof statePayload.replayCount !== 'number' ||
    typeof statePayload.minRequired !== 'number'
  ) {
    return null;
  }

  return {
    run: inferRun(record, statePayload, fallbackIndex),
    replayCount: statePayload.replayCount,
    minRequired: statePayload.minRequired,
  };
}

function inferProfileId(record) {
  if (record.profileId) {
    return record.profileId;
  }
  return 'dynamic';
}

function inferFamily(record, profileId) {
  if (record.family) return record.family;
  return profileId;
}

function buildJournalSummary(filePath) {
  const content = readOptionalUtf8(filePath);
  if (content === null) {
    return null;
  }

  const events = parseJsonl(content).filter((event) => isPlainObject(event));
  const eventTypeCounts = {};
  let lastSessionStart = null;
  let lastSessionEnd = null;
  let stopReason = null;
  let sessionOutcome = null;
  let latestLegalStop = null;
  let latestBlockedStop = null;

  for (const event of events) {
    const eventType = typeof event.eventType === 'string' ? event.eventType : null;
    const timestamp = typeof event.timestamp === 'string' ? event.timestamp : null;
    const details = isPlainObject(event.details) ? event.details : {};

    if (eventType) {
      eventTypeCounts[eventType] = (eventTypeCounts[eventType] || 0) + 1;
    }

    if ((eventType === 'session_start' || eventType === 'session_initialized') && timestamp) {
      lastSessionStart = timestamp;
    }

    if ((eventType === 'session_end' || eventType === 'session_ended') && timestamp) {
      lastSessionEnd = timestamp;
      stopReason =
        typeof details.stopReason === 'string' && details.stopReason.trim()
          ? details.stopReason
          : stopReason;
      sessionOutcome =
        typeof details.sessionOutcome === 'string' && details.sessionOutcome.trim()
          ? details.sessionOutcome
          : sessionOutcome;
    }

    if (eventType === 'legal_stop_evaluated') {
      latestLegalStop = {
        timestamp,
        gateResults: isPlainObject(details.gateResults) ? details.gateResults : {},
      };
    }

    if (eventType === 'blocked_stop') {
      latestBlockedStop = {
        timestamp,
        failedGates: Array.isArray(details.failedGates) ? details.failedGates : [],
        reason: typeof details.reason === 'string' ? details.reason : null,
      };
    }
  }

  return {
    lastSessionStart,
    lastSessionEnd,
    totalEvents: events.length,
    eventTypeCounts: sortObjectKeys(eventTypeCounts),
    stopReason,
    sessionOutcome,
    latestLegalStop,
    latestBlockedStop,
  };
}

function normalizeLineageNode(node) {
  if (!isPlainObject(node)) {
    return null;
  }

  const id =
    typeof node.candidateId === 'string'
      ? node.candidateId
      : typeof node.id === 'string'
        ? node.id
        : null;
  if (!id) {
    return null;
  }

  const parentId =
    typeof node.parentCandidateId === 'string'
      ? node.parentCandidateId
      : typeof node.parentId === 'string'
        ? node.parentId
        : null;

  return {
    id,
    parentId,
    candidateId: id,
    parentCandidateId: parentId,
  };
}

function buildCandidateLineageSummary(filePath) {
  const data = readOptionalJson(filePath);
  if (!isPlainObject(data) || !Array.isArray(data.nodes)) {
    return null;
  }

  const nodes = data.nodes.map((node) => normalizeLineageNode(node)).filter(Boolean);
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const memo = new Map();

  function getDepth(nodeId, trail = new Set()) {
    if (!nodeById.has(nodeId)) {
      return 0;
    }
    if (memo.has(nodeId)) {
      return memo.get(nodeId);
    }
    if (trail.has(nodeId)) {
      return 0;
    }

    trail.add(nodeId);
    const node = nodeById.get(nodeId);
    const parentId = typeof node.parentId === 'string' ? node.parentId : null;
    const depth = parentId ? getDepth(parentId, trail) + 1 : 0;
    trail.delete(nodeId);
    memo.set(nodeId, depth);
    return depth;
  }

  let lineageDepth = 0;
  for (const node of nodes) {
    lineageDepth = Math.max(lineageDepth, getDepth(node.id));
  }

  return {
    lineageDepth,
    totalCandidates: nodes.length,
    currentLeaf: nodes.length > 0 ? nodes[nodes.length - 1].id : null,
  };
}

function buildMutationCoverageKey(entry) {
  if (!isPlainObject(entry)) {
    return null;
  }

  // Prefer signature when available for richer dedup
  if (typeof entry.signature === 'string' && entry.signature.trim()) {
    return entry.signature;
  }

  const dimension = typeof entry.dimension === 'string' ? entry.dimension : null;
  const mutationType = typeof entry.mutationType === 'string' ? entry.mutationType : null;
  if (!dimension || !mutationType) {
    return null;
  }

  return `${dimension}::${mutationType}`;
}

function collectMutationCoverageKeys(entries) {
  const keys = new Set();
  if (!Array.isArray(entries)) {
    return keys;
  }

  for (const entry of entries) {
    const key = buildMutationCoverageKey(entry);
    if (key) {
      keys.add(key);
    }
  }

  return keys;
}

function deriveMutationCoverageMetrics(data) {
  const triedKeys = collectMutationCoverageKeys(data.mutations);
  const exhaustedKeys = collectMutationCoverageKeys(data.exhausted);
  const trackedKeys = new Set([...triedKeys, ...exhaustedKeys]);

  if (trackedKeys.size === 0) {
    return {
      coverageRatio: null,
      uncoveredMutations: null,
    };
  }

  return {
    coverageRatio: exhaustedKeys.size / trackedKeys.size,
    uncoveredMutations: Math.max(trackedKeys.size - exhaustedKeys.size, 0),
  };
}

function buildMutationCoverageSummary(filePath) {
  const data = readOptionalJson(filePath);
  if (!isPlainObject(data)) {
    return null;
  }

  const metrics = isPlainObject(data.metrics) ? data.metrics : {};
  const derivedMetrics = deriveMutationCoverageMetrics(data);
  return {
    coverageRatio: isFiniteNumber(metrics.coverageRatio)
      ? metrics.coverageRatio
      : derivedMetrics.coverageRatio,
    uncoveredMutations: isFiniteNumber(metrics.uncoveredMutations)
      ? metrics.uncoveredMutations
      : derivedMetrics.uncoveredMutations,
  };
}

function deriveReplayCountFromDimensions(dimensions) {
  if (!isPlainObject(dimensions)) {
    return null;
  }

  const samples = Object.values(dimensions)
    .map((entry) => (isPlainObject(entry) && isFiniteNumber(entry.samples) ? entry.samples : null))
    .filter((value) => value !== null);

  if (samples.length === 0) {
    return null;
  }

  return Math.max(...samples);
}

function deriveStabilityCoefficientFromDimensions(dimensions) {
  if (!isPlainObject(dimensions)) {
    return null;
  }

  const coefficients = Object.values(dimensions)
    .map((entry) => (isPlainObject(entry) && isFiniteNumber(entry.coefficient) ? entry.coefficient : null))
    .filter((value) => value !== null);

  if (coefficients.length === 0) {
    return null;
  }

  return Math.min(...coefficients);
}

function collectSampleQualityMatches(value, seen = new Set(), matches = []) {
  if (!value || typeof value !== 'object') {
    return matches;
  }
  if (seen.has(value)) {
    return matches;
  }
  seen.add(value);

  if (Array.isArray(value)) {
    for (const entry of value) {
      collectSampleQualityMatches(entry, seen, matches);
    }
    return matches;
  }

  const replayCount = isFiniteNumber(value.replayCount)
    ? value.replayCount
    : deriveReplayCountFromDimensions(value.dimensions);
  const stabilityCoefficient = isFiniteNumber(value.stabilityCoefficient)
    ? value.stabilityCoefficient
    : deriveStabilityCoefficientFromDimensions(value.dimensions);
  const isInsufficientSample = value.state === 'insufficientSample' && replayCount !== null;

  if (isInsufficientSample || stabilityCoefficient !== null) {
    matches.push({
      replayCount: replayCount === null ? null : replayCount,
      stabilityCoefficient: stabilityCoefficient === null ? null : stabilityCoefficient,
    });
  }

  for (const entry of Object.values(value)) {
    collectSampleQualityMatches(entry, seen, matches);
  }

  return matches;
}

function summarizeSampleQuality(records, registry) {
  let latestSummary = null;

  for (const record of records) {
    const matches = collectSampleQualityMatches(record);
    if (matches.length > 0) {
      latestSummary = matches[matches.length - 1];
    }
  }

  return {
    replayCount: latestSummary?.replayCount ?? null,
    stabilityCoefficient: latestSummary?.stabilityCoefficient ?? null,
    insufficientSampleIterations: registry.insufficientSampleIterations.length,
    insufficientDataIterations: registry.insufficientDataIterations.length,
  };
}

function collectMirrorSyncStates(records) {
  return records
    .filter((record) => record.type === 'mirror_sync_state' || typeof record.mirror_sync_state === 'string')
    .map((record) => ({
      timestamp: record.timestamp || null,
      target: record.target || null,
      candidate: record.candidate || null,
      agentName: record.agentName || null,
      mirror_sync_state: record.mirror_sync_state || null,
      recoveryAction: record.recoveryAction || null,
      defaultRecovery: record.defaultRecovery || null,
      presentRuntimes: record.presentRuntimes || record.verification?.presentRuntimes || [],
      missingRuntimes: record.missingRuntimes || record.verification?.missingRuntimes || [],
      driftRuntimes: record.driftRuntimes || record.verification?.driftRuntimes || [],
    }));
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PROFILE BUCKET
// ─────────────────────────────────────────────────────────────────────────────

function createProfileBucket(profileId, family) {
  return {
    profileId,
    family,
    latestRecord: null,
    bestPromptRecord: null,
    bestBenchmarkRecord: null,
    acceptedCandidates: [],
    rejectedCandidates: [],
    benchmarkRuns: [],
    infraFailures: [],
    promptRecommendations: [],
    benchmarkRecommendations: [],
    benchmarkDeltaSummary: createBenchmarkDeltaSummary(),
    failureModes: {},
    metrics: {
      totalRecords: 0,
      promptRuns: 0,
      benchmarkRuns: 0,
      acceptedCount: 0,
      rejectedCount: 0,
      tieCount: 0,
      keepBaselineCount: 0,
      infraFailureCount: 0,
      benchmarkPassCount: 0,
      benchmarkFailCount: 0,
    },
    modes: {
      'agent-improvement': 0,
      'model-benchmark': 0,
    },
    dimensionScores: {
      structural: [],
      ruleCoherence: [],
      integration: [],
      outputQuality: [],
      systemFitness: [],
    },
    unscoredDimensions: {
      structural: 0,
      ruleCoherence: 0,
      integration: 0,
      outputQuality: 0,
      systemFitness: 0,
    },
    dimensionTrends: {},
  };
}

function incrementFailureModes(bucket, record) {
  for (const mode of record.failureModes || []) {
    bucket.failureModes[mode] = (bucket.failureModes[mode] || 0) + 1;
  }
}

function maybeSetBestPrompt(bucket, record) {
  if (record.type === 'benchmark_run') {
    return;
  }
  const candidateScore = Number(record.score ?? record.totals?.candidate ?? -Infinity);
  const currentScore = Number(bucket.bestPromptRecord?.score ?? bucket.bestPromptRecord?.totals?.candidate ?? -Infinity);
  if (candidateScore > currentScore) {
    bucket.bestPromptRecord = record;
  }
}

function maybeSetBestBenchmark(bucket, record) {
  if (record.type !== 'benchmark_run') {
    return;
  }
  const currentScore = Number(bucket.bestBenchmarkRecord?.aggregateScore ?? -Infinity);
  if (Number(record.aggregateScore ?? -Infinity) > currentScore) {
    bucket.bestBenchmarkRecord = record;
  }
}

function createBenchmarkDeltaSummary() {
  return {
    runsWithOutcomeDelta: 0,
    missingOutcomeDeltaRuns: 0,
    outcomeScoreDeltaSum: 0,
    latestOutcomeScoreDelta: null,
    bestOutcomeScoreDelta: null,
    helpedFixtures: 0,
    hurtFixtures: 0,
    unchangedFixtures: 0,
    missingBaselineFixtures: 0,
    totalFixtures: 0,
  };
}

function recordHasBenchmarkDeltaContract(record) {
  return Object.prototype.hasOwnProperty.call(record, 'outcomeScoreDelta')
    || Object.prototype.hasOwnProperty.call(record?.totals || {}, 'outcomeScoreDelta')
    || Array.isArray(record.fixtureDeltas);
}

function addFixtureDeltaCounts(summary, fixtureDeltas) {
  if (!Array.isArray(fixtureDeltas)) {
    return;
  }
  for (const entry of fixtureDeltas) {
    summary.totalFixtures += 1;
    const delta = finiteNumberOrNull(entry?.delta);
    if (delta === null) {
      summary.missingBaselineFixtures += 1;
    } else if (delta > 0) {
      summary.helpedFixtures += 1;
    } else if (delta < 0) {
      summary.hurtFixtures += 1;
    } else {
      summary.unchangedFixtures += 1;
    }
  }
}

function addBenchmarkDeltaRecord(summary, record) {
  const outcomeScoreDelta = finiteNumberOrNull(record.outcomeScoreDelta ?? record.totals?.outcomeScoreDelta);
  if (outcomeScoreDelta === null) {
    if (recordHasBenchmarkDeltaContract(record)) {
      summary.missingOutcomeDeltaRuns += 1;
    }
  } else {
    summary.runsWithOutcomeDelta += 1;
    summary.outcomeScoreDeltaSum += outcomeScoreDelta;
    summary.latestOutcomeScoreDelta = outcomeScoreDelta;
    summary.bestOutcomeScoreDelta = summary.bestOutcomeScoreDelta === null
      ? outcomeScoreDelta
      : Math.max(summary.bestOutcomeScoreDelta, outcomeScoreDelta);
  }

  addFixtureDeltaCounts(summary, record.fixtureDeltas);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. REGISTRY BUILDER
// ─────────────────────────────────────────────────────────────────────────────

function buildRegistry(records) {
  const profiles = {};
  const insufficientDataIterations = [];
  const insufficientSampleIterations = [];
  const globalModes = {
    'agent-improvement': 0,
    'model-benchmark': 0,
  };
  const benchmarkDeltaSummary = createBenchmarkDeltaSummary();
  const globalMetrics = {
    totalRecords: records.length,
    targetProfiles: 0,
    promptRuns: 0,
    benchmarkRuns: 0,
    acceptedCount: 0,
    rejectedCount: 0,
    tieCount: 0,
    keepBaselineCount: 0,
    infraFailureCount: 0,
    benchmarkPassCount: 0,
    benchmarkFailCount: 0,
  };

  for (const [index, record] of records.entries()) {
    const profileId = inferProfileId(record);
    const family = inferFamily(record, profileId);
    if (!profiles[profileId]) {
      profiles[profileId] = createProfileBucket(profileId, family);
    }

    const insufficientDataIteration = extractInsufficientDataIteration(record, index);
    if (insufficientDataIteration) {
      insufficientDataIterations.push(insufficientDataIteration);
    }

    const insufficientSampleIteration = extractInsufficientSampleIteration(record, index);
    if (insufficientSampleIteration) {
      insufficientSampleIterations.push(insufficientSampleIteration);
    }

    const bucket = profiles[profileId];
    bucket.latestRecord = record;
    bucket.metrics.totalRecords += 1;
    // A missing or unknown record.mode is deliberately attributed to
    // agent-improvement. Lane A is the legacy default
    // because pre-mode-switch records predate the model-benchmark lane and carry no
    // mode field; treating them as agent-improvement keeps historical ledgers stable.
    // Only the exact 'model-benchmark' string routes to Lane B; everything else,
    // including typos, falls through to the Lane A bucket by design.
    const mode = record.mode === 'model-benchmark' ? 'model-benchmark' : 'agent-improvement';
    bucket.modes[mode] += 1;
    globalModes[mode] += 1;
    incrementFailureModes(bucket, record);

    if (record.type === 'benchmark_run') {
      bucket.metrics.benchmarkRuns += 1;
      globalMetrics.benchmarkRuns += 1;
      bucket.benchmarkRuns.push(record);
      bucket.benchmarkRecommendations.push(record.recommendation || 'unknown');
      maybeSetBestBenchmark(bucket, record);
      addBenchmarkDeltaRecord(bucket.benchmarkDeltaSummary, record);
      addBenchmarkDeltaRecord(benchmarkDeltaSummary, record);
      if (record.recommendation === 'benchmark-pass') {
        bucket.metrics.benchmarkPassCount += 1;
        globalMetrics.benchmarkPassCount += 1;
      } else {
        bucket.metrics.benchmarkFailCount += 1;
        globalMetrics.benchmarkFailCount += 1;
      }
      continue;
    }

    if (record.type === 'infra_failure') {
      bucket.metrics.infraFailureCount += 1;
      globalMetrics.infraFailureCount += 1;
      bucket.infraFailures.push(record);
      continue;
    }

    bucket.metrics.promptRuns += 1;
    globalMetrics.promptRuns += 1;
    bucket.promptRecommendations.push(record.recommendation || 'unknown');
    maybeSetBestPrompt(bucket, record);

    const countedUnscored = new Set();
    if (record.dimensions) {
      for (const dim of record.dimensions) {
        const key = dim.name;
        if (bucket.dimensionScores[key]) {
          if (dim.score === null) {
            bucket.unscoredDimensions[key] += 1;
            countedUnscored.add(key);
          } else if (isFiniteNumber(dim.score)) {
            bucket.dimensionScores[key].push(dim.score);
          }
        }
      }
    }
    if (Array.isArray(record.unscoredDimensions)) {
      for (const key of record.unscoredDimensions) {
        if (Object.prototype.hasOwnProperty.call(bucket.unscoredDimensions, key) && !countedUnscored.has(key)) {
          bucket.unscoredDimensions[key] += 1;
        }
      }
    }

    if (record.type === 'accepted' || record.recommendation === 'candidate-acceptable' || record.recommendation === 'candidate-better') {
      bucket.metrics.acceptedCount += 1;
      globalMetrics.acceptedCount += 1;
      bucket.acceptedCandidates.push(record);
    } else if (record.type === 'rejected' || record.recommendation === 'candidate-worse' || record.recommendation === 'candidate-rejected' || record.recommendation === 'reject-candidate') {
      bucket.metrics.rejectedCount += 1;
      globalMetrics.rejectedCount += 1;
      bucket.rejectedCandidates.push(record);
    }

    if (record.recommendation === 'tie') {
      bucket.metrics.tieCount += 1;
      globalMetrics.tieCount += 1;
    } else if (record.recommendation === 'keep-baseline') {
      bucket.metrics.keepBaselineCount += 1;
      globalMetrics.keepBaselineCount += 1;
    }
  }

  globalMetrics.targetProfiles = Object.keys(profiles).length;

  const mirrorSyncHistory = collectMirrorSyncStates(records);

  return {
    globalMetrics,
    modes: globalModes,
    benchmarkDeltaSummary,
    insufficientDataIterations,
    insufficientSampleIterations,
    mirrorSync: {
      latest: mirrorSyncHistory.length > 0 ? mirrorSyncHistory[mirrorSyncHistory.length - 1] : null,
      history: mirrorSyncHistory,
    },
    profiles,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. STOP STATUS
// ─────────────────────────────────────────────────────────────────────────────

function countTrailingMatches(items, expected) {
  let count = 0;
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (items[index] !== expected) {
      break;
    }
    count += 1;
  }
  return count;
}

function detectDriftAmbiguity(mirrorDriftReport) {
  if (!mirrorDriftReport) {
    return false;
  }
  return /manual-review-required|: missing|Undisclosed surfaces:\s*[1-9]/i.test(mirrorDriftReport);
}

function evaluateStopStatus(registry, config, mirrorDriftReport) {
  const stopRules = config?.stopRules || {};
  const profileStates = {};
  let shouldStop = false;
  const reasons = [];

  for (const [profileId, bucket] of Object.entries(registry.profiles)) {
    const state = {
      shouldStop: false,
      reasons: [],
      counters: {
        trailingTies: countTrailingMatches(bucket.promptRecommendations, 'tie'),
        infraFailures: bucket.metrics.infraFailureCount,
        weakBenchmarkRuns: bucket.metrics.benchmarkFailCount,
      },
    };

    if (state.counters.trailingTies >= Number(stopRules.maxConsecutiveTies || Infinity)) {
      state.shouldStop = true;
      state.reasons.push(`trailing ties ${state.counters.trailingTies}/${stopRules.maxConsecutiveTies}`);
    }

    if (state.counters.infraFailures >= Number(stopRules.maxInfraFailuresPerProfile || Infinity)) {
      state.shouldStop = true;
      state.reasons.push(`infra failures ${state.counters.infraFailures}/${stopRules.maxInfraFailuresPerProfile}`);
    }

    if (state.counters.weakBenchmarkRuns >= Number(stopRules.maxWeakBenchmarkRunsPerProfile || Infinity)) {
      state.shouldStop = true;
      state.reasons.push(`weak benchmark runs ${state.counters.weakBenchmarkRuns}/${stopRules.maxWeakBenchmarkRunsPerProfile}`);
    }

    if (state.shouldStop) {
      shouldStop = true;
      reasons.push(`${profileId}: ${state.reasons.join(', ')}`);
    }

    profileStates[profileId] = state;
  }

  const driftAmbiguity = Boolean(stopRules.stopOnDriftAmbiguity) && detectDriftAmbiguity(mirrorDriftReport);
  if (driftAmbiguity) {
    shouldStop = true;
    reasons.push('mirror drift ambiguity detected');
  }

  const plateauWindow = Number(stopRules.plateauWindow || 3);

  if (stopRules.stopOnDimensionPlateau) {
    for (const [profileId, bucket] of Object.entries(registry.profiles)) {
      const dims = bucket.dimensionScores;
      const dimsWithEnoughData = Object.entries(dims).filter(([, scores]) => scores.length >= plateauWindow);
      if (dimsWithEnoughData.length > 0) {
        const plateauDims = dimsWithEnoughData.filter(([, scores]) => {
          const lastN = scores.slice(-plateauWindow);
          return lastN.every((s) => s === lastN[0]);
        });
        if (plateauDims.length === dimsWithEnoughData.length) {
          shouldStop = true;
          reasons.push(`${profileId}: all dimensions plateaued`);
          if (profileStates[profileId]) {
            profileStates[profileId].shouldStop = true;
            profileStates[profileId].reasons.push('all dimensions plateaued');
          }
        }
      }
    }
  }

  // Lane B benchmark aggregate plateau. The model-benchmark YAML promises a
  // stop on "benchmark scores plateau (3+ identical aggregate scores)", but the
  // dimension-plateau block above only inspects bucket.dimensionScores (Lane A). Lane B
  // aggregate scores live in bucket.benchmarkRuns and were never checked. This block
  // stops when the trailing plateauWindow benchmark aggregateScore values are identical.
  // Enabled by stopOnBenchmarkPlateau; falls back to stopOnDimensionPlateau so existing
  // configs that only set the Lane A flag still honor the documented Lane B promise.
  const stopOnBenchmarkPlateau = stopRules.stopOnBenchmarkPlateau !== undefined
    ? Boolean(stopRules.stopOnBenchmarkPlateau)
    : Boolean(stopRules.stopOnDimensionPlateau);
  if (stopOnBenchmarkPlateau) {
    for (const [profileId, bucket] of Object.entries(registry.profiles)) {
      const aggregateScores = (bucket.benchmarkRuns || [])
        .map((run) => Number(run.aggregateScore))
        .filter((value) => Number.isFinite(value));
      if (aggregateScores.length >= plateauWindow) {
        const lastN = aggregateScores.slice(-plateauWindow);
        if (lastN.every((value) => value === lastN[0])) {
          shouldStop = true;
          reasons.push(`${profileId}: benchmark aggregate plateaued at ${lastN[0]} over last ${plateauWindow} runs`);
          if (profileStates[profileId]) {
            profileStates[profileId].shouldStop = true;
            profileStates[profileId].reasons.push(`benchmark aggregate plateaued at ${lastN[0]}`);
          }
        }
      }
    }
  }

  return {
    shouldStop,
    reasons,
    driftAmbiguity,
    profileStates,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. DIMENSIONAL TRACKING
// ─────────────────────────────────────────────────────────────────────────────

function topFailureModes(failureModes) {
  return Object.entries(failureModes)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 5);
}

function computeDimensionTrend(scores) {
  if (scores.length < 2) {
    return '\u2192';
  }
  const latest = scores[scores.length - 1];
  const previous = scores[scores.length - 2];
  if (latest > previous) {
    return '\u2191';
  }
  if (latest < previous) {
    return '\u2193';
  }
  return '\u2192';
}

function formatDimensionName(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (ch) => ch.toUpperCase())
    .trim();
}

function formatLaneModeMix(modes) {
  const agentImprovement = Number(modes?.['agent-improvement'] || 0);
  const modelBenchmark = Number(modes?.['model-benchmark'] || 0);
  return `agent-improvement ${agentImprovement} / model-benchmark ${modelBenchmark}`;
}

function formatBenchmarkDeltaSummary(summary) {
  if (!summary) {
    return 'n/a';
  }
  const average = summary.runsWithOutcomeDelta > 0
    ? summary.outcomeScoreDeltaSum / summary.runsWithOutcomeDelta
    : null;
  return [
    `runsWithDelta ${summary.runsWithOutcomeDelta}`,
    `missingDelta ${summary.missingOutcomeDeltaRuns}`,
    `latest ${formatDashboardValue(summary.latestOutcomeScoreDelta)}`,
    `avg ${formatDashboardValue(average)}`,
    `helped ${summary.helpedFixtures}`,
    `hurt ${summary.hurtFixtures}`,
    `unchanged ${summary.unchangedFixtures}`,
    `missingBaseline ${summary.missingBaselineFixtures}`,
  ].join(' / ');
}

function formatDashboardValue(value) {
  if (value === null || value === undefined) {
    return 'n/a';
  }
  if (isFiniteNumber(value)) {
    return Number.isInteger(value) ? String(value) : String(Math.round(value * 10000) / 10000);
  }
  return String(value);
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. DASHBOARD RENDERER
// ─────────────────────────────────────────────────────────────────────────────

function renderDimensionalProgress(bucket) {
  const rows = [];
  const unscoredRows = [];
  for (const [key, scores] of Object.entries(bucket.dimensionScores)) {
    const unscoredCount = bucket.unscoredDimensions[key] || 0;
    if (unscoredCount > 0) {
      unscoredRows.push(`| ${formatDimensionName(key)} | unscored | ${unscoredCount} |`);
    }
    if (scores.length === 0) {
      continue;
    }
    const latest = scores[scores.length - 1];
    const best = Math.max(...scores);
    const trend = computeDimensionTrend(scores);
    bucket.dimensionTrends[key] = trend;
    rows.push(`| ${formatDimensionName(key)} | ${latest} | ${best} | ${trend} |`);
  }
  if (rows.length === 0) {
    return unscoredRows.length === 0
      ? ''
      : `### Unscored Dimensions

| Dimension | Status | Count |
| --- | --- | --- |
${unscoredRows.join('\n')}
`;
  }
  return `### Dimensional Progress

| Dimension | Latest | Best | Trend |
| --- | --- | --- | --- |
${rows.join('\n')}
${unscoredRows.length > 0 ? `
### Unscored Dimensions

| Dimension | Status | Count |
| --- | --- | --- |
${unscoredRows.join('\n')}
` : ''}
`;
}

function renderProfileSection(bucket) {
  const failures = topFailureModes(bucket.failureModes);
  const failureSummary =
    failures.length > 0
      ? failures.map(([mode, count]) => `- ${mode}: ${count}`).join('\n')
      : '- none';
  const latest = bucket.latestRecord;
  const bestPrompt = bucket.bestPromptRecord;
  const bestBenchmark = bucket.bestBenchmarkRecord;

  return `## ${bucket.profileId}

- Family: ${bucket.family}
- Prompt runs: ${bucket.metrics.promptRuns}
- Benchmark runs: ${bucket.metrics.benchmarkRuns}
- Accepted candidates: ${bucket.metrics.acceptedCount}
- Rejected candidates: ${bucket.metrics.rejectedCount}
- Benchmark passes: ${bucket.metrics.benchmarkPassCount}
- Benchmark fails: ${bucket.metrics.benchmarkFailCount}
- Infra failures: ${bucket.metrics.infraFailureCount}
- Best prompt score: ${bestPrompt ? Number(bestPrompt.score ?? bestPrompt.totals?.candidate ?? 0) : 'n/a'}
- Best benchmark score: ${bestBenchmark ? Number(bestBenchmark.aggregateScore ?? 0) : 'n/a'}
- Lane (mode) mix: ${formatLaneModeMix(bucket.modes)}
- Benchmark delta summary: ${formatBenchmarkDeltaSummary(bucket.benchmarkDeltaSummary)}
- Latest recommendation: ${latest?.recommendation || 'n/a'}

### Repeated Failure Modes

${failureSummary}

${renderDimensionalProgress(bucket)}`;
}

function renderSampleQualitySection(sampleQuality) {
  const hasInsufficientData =
    sampleQuality.insufficientSampleIterations > 0 ||
    sampleQuality.insufficientDataIterations > 0;
  const explanation = hasInsufficientData
    ? '\nSome iterations had insufficient data for trade-off / stability analysis. Review the specific iterations before trusting verdicts.\n'
    : '';

  return `## Sample Quality

| Field | Value |
| --- | --- |
| replayCount | ${formatDashboardValue(sampleQuality.replayCount)} |
| stabilityCoefficient | ${formatDashboardValue(sampleQuality.stabilityCoefficient)} |
| insufficientSampleIterations | ${sampleQuality.insufficientSampleIterations} |
| insufficientDataIterations | ${sampleQuality.insufficientDataIterations} |
${explanation}`;
}

function renderEventTypeCounts(eventTypeCounts) {
  const rows = Object.entries(eventTypeCounts || {});
  if (rows.length === 0) {
    return '- none';
  }
  return rows.map(([eventType, count]) => `- ${eventType}: ${count}`).join('\n');
}

function renderGateResults(gateResults) {
  const rows = Object.entries(gateResults || {});
  if (rows.length === 0) {
    return '- none';
  }
  return [
    '| Gate | Result |',
    '| --- | --- |',
    ...rows
      .sort((left, right) => left[0].localeCompare(right[0]))
      .map(([gateName, result]) => `| ${gateName} | ${formatDashboardValue(
        isPlainObject(result) ? JSON.stringify(result) : result
      )} |`),
  ].join('\n');
}

function renderJournalSummarySection(summary) {
  if (!summary) {
    return `## Journal Summary

- Not available.
`;
  }

  return `## Journal Summary

| Field | Value |
| --- | --- |
| Last session start | ${formatDashboardValue(summary.lastSessionStart)} |
| Last session end | ${formatDashboardValue(summary.lastSessionEnd)} |
| Total events | ${formatDashboardValue(summary.totalEvents)} |
| Stop reason | ${formatDashboardValue(summary.stopReason)} |
| Session outcome | ${formatDashboardValue(summary.sessionOutcome)} |
| Latest legal-stop evaluation | ${formatDashboardValue(summary.latestLegalStop?.timestamp)} |
| Latest blocked stop | ${formatDashboardValue(summary.latestBlockedStop?.timestamp)} |

### Event Types

${renderEventTypeCounts(summary.eventTypeCounts)}

${summary.latestLegalStop ? `### Latest legal-stop evaluation

- Gates: ${formatDashboardValue(Object.keys(summary.latestLegalStop.gateResults || {}).sort().join(', ') || 'none')}

${renderGateResults(summary.latestLegalStop.gateResults)}
` : ''}
${summary.latestBlockedStop ? `### Latest blocked stop

- Failed gates: ${formatDashboardValue(summary.latestBlockedStop.failedGates.join(', ') || 'none')}
- Reason: ${formatDashboardValue(summary.latestBlockedStop.reason)}
` : ''}
`;
}

function renderCandidateLineageSection(summary) {
  if (!summary) {
    return `## Candidate Lineage

- Not available.
`;
  }

  return `## Candidate Lineage

| Field | Value |
| --- | --- |
| Lineage depth | ${formatDashboardValue(summary.lineageDepth)} |
| Total candidates | ${formatDashboardValue(summary.totalCandidates)} |
| Current leaf | ${formatDashboardValue(summary.currentLeaf)} |
`;
}

function renderMutationCoverageSection(summary) {
  if (!summary) {
    return `## Mutation Coverage

- Not available.
`;
  }

  return `## Mutation Coverage

| Field | Value |
| --- | --- |
| Coverage ratio | ${formatDashboardValue(summary.coverageRatio)} |
| Uncovered mutations | ${formatDashboardValue(summary.uncoveredMutations)} |
`;
}

function renderMirrorSyncSection(summary) {
  const latest = summary?.latest;
  if (!latest) {
    return `## Mirror Sync Recovery

- Not available.
`;
  }

  return `## Mirror Sync Recovery

| Field | Value |
| --- | --- |
| Latest state | ${formatDashboardValue(latest.mirror_sync_state)} |
| Recovery action | ${formatDashboardValue(latest.recoveryAction)} |
| Default recovery | ${formatDashboardValue(latest.defaultRecovery)} |
| Present runtimes | ${formatDashboardValue((latest.presentRuntimes || []).join(', ') || 'none')} |
| Missing runtimes | ${formatDashboardValue((latest.missingRuntimes || []).join(', ') || 'none')} |
| Drift runtimes | ${formatDashboardValue((latest.driftRuntimes || []).join(', ') || 'none')} |
`;
}

function renderDashboard(registry, sampleQuality) {
  const sections = Object.values(registry.profiles)
    .sort((left, right) => left.profileId.localeCompare(right.profileId))
    .map((bucket) => renderProfileSection(bucket))
    .join('\n');

  let recommendation = 'Continue only when the next run has a clearer signal than the current best-known state.';
  if (registry.stopStatus?.shouldStop) {
    recommendation = `Stop automatically: ${registry.stopStatus.reasons.join('; ')}`;
  } else if (registry.globalMetrics.infraFailureCount > 0) {
    recommendation = 'Stabilize infrastructure before trusting further comparisons.';
  } else if (registry.globalMetrics.benchmarkFailCount > 0) {
    recommendation = 'Fix repeated benchmark failures before broadening scope or promoting any target.';
  }

  const replayConsumerSections = [
    renderJournalSummarySection(registry.journalSummary),
    renderCandidateLineageSection(registry.candidateLineage),
    renderMutationCoverageSection(registry.mutationCoverage),
    renderMirrorSyncSection(registry.mirrorSync),
  ].join('\n');

  return `# Agent Improvement Dashboard

## Global Summary

| Field | Value |
| --- | --- |
| Total records | ${registry.globalMetrics.totalRecords} |
| Target profiles | ${registry.globalMetrics.targetProfiles} |
| Prompt runs | ${registry.globalMetrics.promptRuns} |
| Benchmark runs | ${registry.globalMetrics.benchmarkRuns} |
| Accepted candidates | ${registry.globalMetrics.acceptedCount} |
| Rejected candidates | ${registry.globalMetrics.rejectedCount} |
| Ties | ${registry.globalMetrics.tieCount} |
| Keep-baseline results | ${registry.globalMetrics.keepBaselineCount} |
| Benchmark passes | ${registry.globalMetrics.benchmarkPassCount} |
| Benchmark fails | ${registry.globalMetrics.benchmarkFailCount} |
| Infra failures | ${registry.globalMetrics.infraFailureCount} |
| Lane (mode) mix | ${formatLaneModeMix(registry.modes)} |
| Benchmark delta summary | ${formatBenchmarkDeltaSummary(registry.benchmarkDeltaSummary)} |

${renderSampleQualitySection(sampleQuality)}

${replayConsumerSections}

## Guardrails

- All targets evaluated via dynamic mode; promotion requires explicit per-target approval
- Mirror sync stays downstream packaging and is not counted as benchmark truth

## Stop Status

- Should stop: ${registry.stopStatus?.shouldStop ? 'yes' : 'no'}
- Drift ambiguity: ${registry.stopStatus?.driftAmbiguity ? 'yes' : 'no'}
- Reasons: ${registry.stopStatus?.reasons?.length ? registry.stopStatus.reasons.join('; ') : 'none'}

${sections}

## Recommendation

${recommendation}
`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const runtimeRoot = process.argv[2];
  if (!runtimeRoot) {
    process.stderr.write('Usage: node reduce-state.cjs <improvement-runtime-root>\n');
    process.exit(2);
  }

  const stateLogPath = path.join(runtimeRoot, 'agent-improvement-state.jsonl');
  const registryPath = path.join(runtimeRoot, 'experiment-registry.json');
  const dashboardPath = path.join(runtimeRoot, 'agent-improvement-dashboard.md');
  const configPath = path.join(runtimeRoot, 'agent-improvement-config.json');
  const mirrorDriftReportPath = path.join(runtimeRoot, 'mirror-drift-report.md');
  const journalPath = path.join(runtimeRoot, 'improvement-journal.jsonl');
  const candidateLineagePath = path.join(runtimeRoot, 'candidate-lineage.json');
  const mutationCoveragePath = path.join(runtimeRoot, 'mutation-coverage.json');

  const stateSafety = loadStateSafety();
  // Recover a crash-corrupted JSONL tail before reading, so a half-written
  // final append from an interrupted run never aborts the reduce.
  const stateLogRepair = stateSafety.repairJsonlTail(stateLogPath);
  const stateLogContent = readUtf8(stateLogPath);
  const { records, corruptionWarnings } = parseJsonlDetailed(stateLogContent);

  const registry = buildRegistry(records);
  registry.journalSummary = buildJournalSummary(journalPath);
  registry.candidateLineage = buildCandidateLineageSummary(candidateLineagePath);
  registry.mutationCoverage = buildMutationCoverageSummary(mutationCoveragePath);
  const config = parseJson(readOptionalUtf8(configPath) || '{}', {});
  const mirrorDriftReport = readOptionalUtf8(mirrorDriftReportPath);
  registry.stopStatus = evaluateStopStatus(registry, config, mirrorDriftReport);
  registry.stateLogRepair = stateLogRepair;
  registry.corruptionWarnings = corruptionWarnings;
  const sampleQuality = summarizeSampleQuality(records, registry);
  const dashboard = renderDashboard(registry, sampleQuality);

  // Atomic writes: a crash mid-write leaves the prior complete file intact,
  // never a half-written registry or dashboard for a downstream reader.
  stateSafety.writeStateAtomic(registryPath, registry);
  writeTextAtomic(dashboardPath, dashboard.endsWith('\n') ? dashboard : `${dashboard}\n`);

  process.stdout.write(
    `${JSON.stringify(
      {
        registryPath,
        dashboardPath,
        totalRecords: registry.globalMetrics.totalRecords,
        corruptionCount: corruptionWarnings.length,
        stateLogRepaired: stateLogRepair.repaired,
        stateLogDroppedBytes: stateLogRepair.droppedBytes,
        stateSafety: stateSafety.source,
      },
      null,
      2,
    )}\n`,
  );
}

module.exports = {
  parseJsonl,
  parseJsonlDetailed,
  buildRegistry,
  renderDashboard,
  evaluateStopStatus,
  loadStateSafety,
  writeTextAtomic,
  writeStateAtomicInline,
  repairJsonlTailInline,
};

if (require.main === module) {
  main();
}
