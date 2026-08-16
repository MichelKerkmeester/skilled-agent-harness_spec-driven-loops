#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Runtime — Fan-Out CLI Lineage Pool Runner                      ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Input:  CLI args (--spec-folder, --loop-type, --fanout-config-json,      ║
// ║         --base-artifact-dir).                                            ║
// ║ Output: JSON to stdout.                                                  ║
// ║ Exit:   0=all ok, 1=script error, 2=some failed, 3=all failed.          ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');
const { createHash } = require('node:crypto');

const {
  classifyExitCode,
  maybeThrowTestFault,
  validateNamespaceValue,
} = require('./lib/cli-guards.cjs');

const {
  runCappedPool,
  appendStatusLedger,
  markOrphanedLineages,
  readRetryCountsFromLedger,
  createWavePlannerInterface,
  writeOrchestrationSummary,
} = require('./fanout-pool.cjs');

const {
  runSalvageSweep,
  extractTextFromOpencodeJson,
} = require('./fanout-salvage.cjs');

const {
  appendObservabilityEvent,
} = require('../lib/deep-loop/observability-events.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. TSX BOOTSTRAP
// ─────────────────────────────────────────────────────────────────────────────

const TSX_LOADER = require.resolve('tsx');
const isTsxLoaded = process.env.DEEP_LOOP_TSX_LOADED === '1';

function runTsxBootstrap() {
  const child = spawn(
    process.execPath,
    ['--import', TSX_LOADER, __filename, ...process.argv.slice(2)],
    {
      cwd: process.cwd(),
      env: { ...process.env, DEEP_LOOP_TSX_LOADED: '1' },
      stdio: [process.stdin.isTTY ? 'ignore' : 'pipe', 'pipe', 'pipe'],
    },
  );

  if (!process.stdin.isTTY && child.stdin) {
    child.stdin.on('error', () => {});
    process.stdin.pipe(child.stdin);
  }

  child.stdout?.pipe(process.stdout);
  child.stderr?.pipe(process.stderr);

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => {
      child.kill(signal);
    });
  }

  child.on('close', (status, signal) => {
    if (status !== null) {
      process.exit(status);
    }
    process.exit(signal === 'SIGINT' ? 130 : signal === 'SIGTERM' ? 143 : 1);
  });
}

if (require.main === module && !isTsxLoaded) {
  runTsxBootstrap();
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
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

function parseOptionalNumber(args, key) {
  const raw = args[key];
  if (raw === undefined || raw === false || raw === null || raw === '') {
    return null;
  }
  if (raw === true || typeof raw !== 'string') {
    throw inputError(`${key} must be a number`);
  }
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) {
    throw inputError(`${key} must be a non-negative number`);
  }
  return value;
}

function readRawConfigNumber(rawConfig, names, fieldName) {
  if (!isRecord(rawConfig)) return null;
  for (const name of names) {
    if (!Object.prototype.hasOwnProperty.call(rawConfig, name)) continue;
    const raw = rawConfig[name];
    if (raw === undefined || raw === null || raw === '') return null;
    if (raw === true || raw === false) {
      throw inputError(`${fieldName} must be a non-negative number`);
    }
    const value = Number(raw);
    if (!Number.isFinite(value) || value < 0) {
      throw inputError(`${fieldName} must be a non-negative number`);
    }
    return Math.floor(value);
  }
  return null;
}

function readPositiveRawConfigNumber(rawConfig, names, fieldName, fallback) {
  const value = readRawConfigNumber(rawConfig, names, fieldName);
  if (value === null) return fallback;
  if (value <= 0) {
    throw inputError(`${fieldName} must be greater than 0`);
  }
  return value;
}

function rawConfigWithCliBudgetOverrides(rawConfig, args) {
  const merged = { ...(isRecord(rawConfig) ? rawConfig : {}) };
  const mappings = [
    ['stallWatchdogMs', 'stallWatchdogMs'],
    ['maxCostUnitsPerLineage', 'maxCostUnitsPerLineage'],
    ['maxAggregateCostUnits', 'maxAggregateCostUnits'],
    ['maxTokensPerLineage', 'maxTokensPerLineage'],
    ['maxTokenBudget', 'maxTokenBudget'],
    ['maxTokenBudgetPerLineage', 'maxTokenBudgetPerLineage'],
    ['costUnitsPerIteration', 'costUnitsPerIteration'],
    ['estimatedTokensPerIteration', 'estimatedTokensPerIteration'],
  ];
  for (const [targetKey, argKey] of mappings) {
    if (Object.prototype.hasOwnProperty.call(args, argKey)) {
      merged[targetKey] = args[argKey];
    }
  }
  return merged;
}

function normalizeStopPolicy(raw) {
  if (raw === undefined || raw === false || raw === null || raw === '') {
    return 'convergence';
  }
  if (raw === true || typeof raw !== 'string') {
    throw inputError('stopPolicy must be convergence or max-iterations');
  }
  if (raw !== 'convergence' && raw !== 'max-iterations') {
    throw inputError('stopPolicy must be convergence or max-iterations');
  }
  return raw;
}

function jsonOut(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

function signalExitCode(signal) {
  return signal === 'SIGINT' ? 130 : 143;
}

let fanoutSignalHandlersInstalled = false;

function installFanoutSignalHandlers(onStop) {
  if (fanoutSignalHandlersInstalled) return;
  fanoutSignalHandlersInstalled = true;

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => {
      try {
        onStop(signal);
      } finally {
        process.exit(signalExitCode(signal));
      }
    });
  }
}

function updateLineageSnapshot(snapshots, event) {
  if (!event || typeof event.label !== 'string') return;
  const existing = snapshots.get(event.label) || { label: event.label };

  if (event.event === 'started') {
    snapshots.set(event.label, { ...existing, status: 'running', started_at_iso: event.at });
    return;
  }
  if (event.event === 'completed') {
    snapshots.set(event.label, {
      ...existing,
      status: 'fulfilled',
      completed_at_iso: event.at,
      duration_ms: event.duration_ms,
    });
    return;
  }
  if (event.event === 'failed') {
    snapshots.set(event.label, {
      ...existing,
      status: event.terminal === false ? 'retrying' : 'rejected',
      completed_at_iso: event.at,
      duration_ms: event.duration_ms,
      error: event.error,
    });
    return;
  }
  if (event.event === 'retry_scheduled' || event.event === 'orphan_requeued') {
    snapshots.set(event.label, { ...existing, status: 'requeued', updated_at_iso: event.at });
    return;
  }
  if (event.event === 'progress') {
    snapshots.set(event.label, {
      ...existing,
      status: 'running',
      updated_at_iso: event.at,
      duration_ms: event.duration_ms,
    });
  }
}

function buildLineageSnapshots(lineages, snapshots) {
  return lineages.map((lineage) => snapshots.get(lineage.label) || { label: lineage.label, status: 'pending' });
}

function summarizeSnapshots(lineages, snapshots) {
  const results = buildLineageSnapshots(lineages, snapshots);
  const succeeded = results.filter((result) => result.status === 'fulfilled').length;
  const failed = results.filter((result) => result.status === 'rejected').length;
  return {
    results,
    summary: {
      total: lineages.length,
      succeeded,
      failed,
      all_failed: lineages.length > 0 && failed === lineages.length,
    },
  };
}

function observabilityPathForLedger(ledgerPath) {
  return path.join(path.dirname(ledgerPath), OBSERVABILITY_EVENTS_FILENAME);
}

function statusForLedgerEvent(entry) {
  if (entry && typeof entry.status === 'string' && entry.status.trim() !== '') {
    return entry.status;
  }
  if (!entry || typeof entry.event !== 'string') return 'unknown';
  if (entry.event === 'started' || entry.event === 'progress' || entry.event === 'resume_waiting') return 'running';
  if (entry.event === 'completed' || entry.event === 'resume_waiting_complete') return 'completed';
  if (entry.event === 'failed') return entry.terminal === false ? 'retrying' : 'failed';
  if (entry.event === 'stopped') return 'stopped';
  if (entry.event === 'retry_scheduled' || entry.event === 'orphan_requeued') return 'retrying';
  // Lag-ceiling signals from the pool: a stall warning while work remains pending, or a
  // forced abort of the stalled attempt. Map both to typed statuses instead of 'unknown'.
  if (entry.event === 'lag_ceiling_exceeded') return entry.action === 'abort' ? 'failed' : 'warning';
  if (entry.event === 'lag_ceiling_abort') return 'failed';
  if (entry.event === 'stall_detected') return 'warning';
  if (entry.event === 'budget_cap_exceeded') return 'failed';
  if (entry.event === 'aggregate_budget_cap_exceeded') return 'failed';
  return 'unknown';
}

function appendFanoutStatusLedger(ledgerPath, entry) {
  appendStatusLedger(ledgerPath, entry);
  try {
    appendObservabilityEvent(observabilityPathForLedger(ledgerPath), entry, {
      producer: 'fanout-run',
      stream: 'orchestration-status',
      subject: {
        run_id: entry.run_id ?? null,
        label: entry.label ?? null,
        loop_type: entry.loop_type ?? null,
        spec_folder: entry.spec_folder ?? null,
      },
      event: entry.event,
      status: statusForLedgerEvent(entry),
    });
  } catch {
    // Observability must not make the primary orchestration ledger fail.
  }
}

const FLAT_POOL_ASSIGNMENT_MODEL = 'flat_pool';
const WAVE_ASSIGNMENT_MODEL = 'wave';
const WAVE_ASSIGNMENT_MODEL_REJECTION = 'REJECTED: wave assignment_model requires conflict-safety substrate';
const WAVE_ASSIGNMENT_METADATA_REJECTION = 'REJECTED: wave assignment metadata requires conflict-safety substrate';
const STATE_LOG_BY_LOOP_TYPE = {
  research: 'deep-research-state.jsonl',
  review: 'deep-review-state.jsonl',
};
const ACTIVE_FANOUT_LOOP_TYPES = new Set(['research', 'review']);
const DEPRECATED_CONTEXT_FANOUT_MESSAGE = 'loopType must be "research" or "review"; context fan-out is deprecated. Use @context for one-shot retrieval, /deep:research or /deep:review bounded snapshots for iterative work, or /speckit:plan for implementation planning.';

function assertActiveFanoutLoopType(loopType) {
  if (!ACTIVE_FANOUT_LOOP_TYPES.has(loopType)) {
    throw inputError(DEPRECATED_CONTEXT_FANOUT_MESSAGE);
  }
}

function hasNonEmptyArrayField(value) {
  return Array.isArray(value) && value.length > 0;
}

function collectFlatPoolGuardRejections(fanoutConfig) {
  const rejections = [];
  if (fanoutConfig.assignment_model === WAVE_ASSIGNMENT_MODEL) {
    rejections.push({
      scope: 'fanout',
      label: null,
      field: 'assignment_model',
      message: WAVE_ASSIGNMENT_MODEL_REJECTION,
    });
  }

  for (const lineage of fanoutConfig.executors) {
    if (lineage.assignment_model === WAVE_ASSIGNMENT_MODEL) {
      rejections.push({
        scope: 'lineage',
        label: lineage.label,
        field: 'assignment_model',
        message: WAVE_ASSIGNMENT_MODEL_REJECTION,
      });
    }

    const reservedFields = [];
    if (hasNonEmptyArrayField(lineage.depends_on)) {
      reservedFields.push('depends_on');
    }
    if (hasNonEmptyArrayField(lineage.touches)) {
      reservedFields.push('touches');
    }
    if (reservedFields.length > 0) {
      rejections.push({
        scope: 'lineage',
        label: lineage.label,
        field: reservedFields.join(','),
        message: WAVE_ASSIGNMENT_METADATA_REJECTION,
      });
    }
  }

  return rejections;
}

/**
 * Force fan-out execution onto the existing flat pool while wave planning is gated.
 *
 * @param {Object} fanoutConfig - Parsed fan-out config.
 * @returns {{ config: Object, rejections: Array<Object> }} Guarded config and rejection records.
 */
function applyFlatPoolAssignmentGuard(fanoutConfig) {
  const rejections = collectFlatPoolGuardRejections(fanoutConfig);
  return {
    config: {
      ...fanoutConfig,
      assignment_model: FLAT_POOL_ASSIGNMENT_MODEL,
      executors: fanoutConfig.executors.map((lineage) => ({
        ...lineage,
        assignment_model: FLAT_POOL_ASSIGNMENT_MODEL,
      })),
    },
    rejections,
  };
}

function logFlatPoolGuardRejections({ rejections, ledgerPath, runId, loopType, specFolder }) {
  if (rejections.length === 0) {
    return;
  }
  const wavePlanner = createWavePlannerInterface();
  for (const rejection of rejections) {
    const labelSuffix = rejection.label ? ` lineage=${rejection.label}` : '';
    process.stderr.write(`[fanout-run] ${rejection.message}${labelSuffix}\n`);
    appendFanoutStatusLedger(ledgerPath, {
      event: 'assignment_model_rejected',
      severity: 'warning',
      at: new Date().toISOString(),
      run_id: runId,
      loop_type: loopType,
      spec_folder: specFolder,
      planner_status: wavePlanner.status,
      fallback_assignment_model: FLAT_POOL_ASSIGNMENT_MODEL,
      ...rejection,
    });
  }
}

// Per-kind first state-dir env var (used for lockfile isolation across same-kind replicas).
const SPECKIT_STATE_ENV_BY_KIND = {
  'cli-codex': 'SPECKIT_CODEX_STATE_DIR',
  'cli-claude-code': 'SPECKIT_CLAUDE_CODE_STATE_DIR',
  'cli-opencode': 'SPECKIT_OPENCODE_STATE_DIR',
  'cli-cursor': 'SPECKIT_CURSOR_STATE_DIR',
  'cli-devin': 'SPECKIT_DEVIN_STATE_DIR',
  'cli-pi': 'SPECKIT_PI_STATE_DIR',
};

const activeLineageProcesses = new Set();
const WAIT_CHECKPOINT_FILENAME = 'orchestration-wait-checkpoint.json';
const WAIT_CHECKPOINT_SCHEMA_VERSION = 1;
const WAIT_SLEEP_CHUNK_MS = 200;
const OBSERVABILITY_EVENTS_FILENAME = 'observability-events.jsonl';
const DEFAULT_POST_EXIT_GRACE_MS = 5 * 60 * 1000;

function stopActiveLineageProcesses(signal) {
  for (const child of activeLineageProcesses) {
    terminateLineageProcess(child, signal);
  }
}

function expandHomeDir(inputPath) {
  if (inputPath === '~') {
    return os.homedir();
  }
  if (typeof inputPath === 'string' && inputPath.startsWith('~/')) {
    return path.join(os.homedir(), inputPath.slice(2));
  }
  return inputPath;
}

function isPathInside(childPath, parentPath) {
  const relative = path.relative(parentPath, childPath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function physicalPathForValidation(targetPath) {
  try {
    return fs.realpathSync.native(targetPath);
  } catch {
    const parentPath = path.dirname(targetPath);
    try {
      return path.join(fs.realpathSync.native(parentPath), path.basename(targetPath));
    } catch {
      return targetPath;
    }
  }
}

function validateBaseArtifactDir(baseArtifactDir, specFolder, loopType) {
  if (baseArtifactDir.includes('\0')) {
    throw inputError('baseArtifactDir must not contain null bytes');
  }
  if (baseArtifactDir.split(/[\\/]+/).includes('..')) {
    throw inputError('baseArtifactDir must not contain ".." path segments');
  }
  const resolvedBase = physicalPathForValidation(path.resolve(process.cwd(), baseArtifactDir));
  const resolvedSpecFolder = physicalPathForValidation(path.resolve(process.cwd(), specFolder));
  const expectedRoot = path.join(resolvedSpecFolder, loopType);
  if (!isPathInside(resolvedBase, expectedRoot)) {
    throw inputError(`baseArtifactDir must resolve inside the spec folder's ${loopType} artifact tree`);
  }
  return baseArtifactDir;
}

function validateClaudeConfigDir(configDir) {
  if (typeof configDir !== 'string' || configDir.trim() === '') {
    throw inputError('configDir must be a non-empty string when set');
  }
  validateNamespaceValue(configDir, 'configDir', inputError);

  const expanded = expandHomeDir(configDir);
  const resolved = path.resolve(process.cwd(), expanded);
  const homeDir = path.resolve(os.homedir());
  const cwd = path.resolve(process.cwd());
  const homeRelative = path.relative(homeDir, resolved);
  const cwdRelative = path.relative(cwd, resolved);
  const homeTop = homeRelative.split(path.sep)[0] || '';
  const cwdTop = cwdRelative.split(path.sep)[0] || '';
  const allowedConfigRoot = (segment) => segment === '.claude' || segment.startsWith('.claude-');

  if (isPathInside(resolved, homeDir) && allowedConfigRoot(homeTop)) {
    return resolved;
  }
  if (isPathInside(resolved, cwd) && allowedConfigRoot(cwdTop)) {
    return resolved;
  }
  throw inputError('configDir must resolve under ~/.claude*, or a repo-local .claude* directory');
}

function terminateLineageProcess(child, signal) {
  if (!child || child.killed) return;
  if (process.platform !== 'win32' && child.pid) {
    try {
      process.kill(-child.pid, signal);
      return;
    } catch (error) {
      if (error && error.code !== 'ESRCH') {
        try {
          child.kill(signal);
        } catch {
          // The process may have already exited between the group and direct kill attempts.
        }
      }
      return;
    }
  }
  try {
    child.kill(signal);
  } catch {
    // The process may have already exited.
  }
}

function expectedLineageArtifactPaths(loopType, lineageDir) {
  assertActiveFanoutLoopType(loopType);
  if (loopType === 'review') return [path.join(lineageDir, 'review-report.md')];
  return [path.join(lineageDir, 'research.md')];
}

function requiredLineageStateLogPath(loopType, lineageDir) {
  const name = lineageStateLogName(loopType);
  if (!name) return null;
  return path.join(lineageDir, name);
}

function hasNonEmptyFile(filePath) {
  try {
    return fs.statSync(filePath).isFile() && fs.statSync(filePath).size > 0;
  } catch {
    return false;
  }
}

function countIterationFiles(lineageDir) {
  try {
    const iterDir = path.join(lineageDir, 'iterations');
    if (!fs.statSync(iterDir).isDirectory()) return 0;
    return fs.readdirSync(iterDir).filter((name) => /^iteration-\d+\.md$/.test(name)).length;
  } catch {
    return 0;
  }
}

function findMissingLineageArtifacts(loopType, lineageDir) {
  return expectedLineageArtifactPaths(loopType, lineageDir)
    .filter((artifactPath) => !hasNonEmptyFile(artifactPath));
}

function findMissingLineageStateLog(loopType, lineageDir) {
  const stateLogPath = requiredLineageStateLogPath(loopType, lineageDir);
  if (stateLogPath && !hasNonEmptyFile(stateLogPath)) {
    return stateLogPath;
  }
  return null;
}

function parseJsonlRecords(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '')
    .map((line) => JSON.parse(line));
}

function lineageStateLogName(loopType) {
  return STATE_LOG_BY_LOOP_TYPE[loopType] || null;
}

function readLineageStateRecords(loopType, lineageDir) {
  const stateLogName = lineageStateLogName(loopType);
  if (!stateLogName) {
    return { statePath: null, records: [], missing: true, parseError: null };
  }
  const statePath = path.join(lineageDir, stateLogName);
  if (!hasNonEmptyFile(statePath)) {
    return { statePath, records: [], missing: true, parseError: null };
  }
  try {
    return { statePath, records: parseJsonlRecords(statePath), missing: false, parseError: null };
  } catch (error) {
    return {
      statePath,
      records: [],
      missing: false,
      parseError: error instanceof Error ? error.message : String(error),
    };
  }
}

// A lineage's synthesis stopReason is written by its model and cannot be held to an exact
// spelling. The iteration-count check above already proves the lineage ran every iteration,
// so this only needs to confirm the reason belongs to the max-iterations family (e.g.
// "maxIterationsReached", "max-iterations (10/10)") and is not a genuinely different outcome
// such as convergence, a manual stop, or an error.
function isMaxIterationsStopReason(stopReason) {
  if (typeof stopReason !== 'string') return false;
  return stopReason.toLowerCase().replace(/[^a-z]/g, '').startsWith('maxiteration');
}

// A synthesis record under any of the names producers have actually written. The
// contract asks for `synthesis_complete`; the variants below were all observed in
// real runs, so matching only the contract name fails lineages that complied in
// substance. An explicit `synthesis_incomplete` is excluded — that one is a
// producer correctly reporting it did not finish.
const SYNTHESIS_EVENT_NAMES = new Set(['synthesis_complete', 'phase_synthesis_complete', 'synthesis']);

function findSynthesisRecord(records) {
  return [...records].reverse().find((record) => record
    && record.type === 'event'
    && typeof record.event === 'string'
    && SYNTHESIS_EVENT_NAMES.has(record.event));
}

/**
 * Decide completion from the artifacts a lineage left behind, for the case where
 * no synthesis event can be recognised.
 *
 * The report and the per-iteration files are produced by the work itself rather
 * than asserted about it, so they are the stronger evidence of the two. The
 * iteration count must still meet the cap: a lineage that stopped early is
 * genuinely a policy violation, not a naming mishap.
 *
 * @param {Object} params - Validation inputs.
 * @returns {{complete: boolean, reason: string}} Verdict and, when incomplete, why.
 */
function completionFromArtifacts({ lineageDir, lineage, records }) {
  if (!lineageDir) return { complete: false, reason: 'no lineage artifact directory to check' };
  const dir = lineageDir;

  const reportPath = path.join(dir, 'review-report.md');
  if (!fs.existsSync(reportPath)) return { complete: false, reason: 'no review-report.md on disk' };

  let iterationFiles = 0;
  try {
    iterationFiles = fs.readdirSync(path.join(dir, 'iterations'))
      .filter((name) => /^iteration-\d+\.md$/.test(name)).length;
  } catch { /* absent iterations dir leaves the count at zero */ }

  const observed = Math.max(iterationFiles, records.filter((r) => r && r.type === 'iteration').length);
  if (observed < lineage.iterations) {
    return { complete: false, reason: `only ${observed} of ${lineage.iterations} iterations on disk` };
  }
  return { complete: true, reason: '' };
}

function findMaxIterationsPolicyViolation({ loopType, stateRead, lineage, stopPolicy, lineageDir }) {
  if (loopType !== 'review' || stopPolicy !== 'max-iterations') return null;
  if (typeof lineage.iterations !== 'number' || lineage.iterations <= 0) {
    return 'stopPolicy=max-iterations requires a positive lineage iteration cap';
  }

  if (!stateRead || stateRead.missing) {
    return 'missing deep-review-state.jsonl for max-iterations stop-policy validation';
  }
  if (stateRead.parseError) {
    return `could not parse deep-review-state.jsonl: ${stateRead.parseError}`;
  }

  const records = stateRead.records;
  const iterationCount = records.filter((record) => record && record.type === 'iteration').length;
  const synthesis = findSynthesisRecord(records);
  if (!synthesis) {
    // The event is a self-report, and a producer that did the work can still name
    // it something the contract never listed — observed across runs of one model
    // on one prompt: `synthesis_complete`, then `phase_synthesis_complete`, then
    // `synthesis`. Discarding a finished review over the word it chose destroys
    // hours of real analysis to enforce a spelling. Fall back to what the lineage
    // actually left on disk, which is the evidence the event was only claiming.
    const evidence = completionFromArtifacts({ lineageDir, lineage, records });
    if (evidence.complete) return null;
    return `missing synthesis event and ${evidence.reason} for max-iterations stop-policy validation`;
  }

  const totalIterations = lineageDir
    ? countIterationFiles(lineageDir)
    : iterationCount;
  if (totalIterations !== lineage.iterations) {
    return `expected ${lineage.iterations} iterations, got ${totalIterations}`;
  }
  if (!isMaxIterationsStopReason(synthesis.stopReason)) {
    return `expected stopReason=maxIterationsReached, got ${synthesis.stopReason || 'unknown'}`;
  }
  return null;
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeStallWatchdogMs(rawConfig) {
  // Defaults ON (mirrors the fan-out lagCeilingMs default): without a watchdog a stalled
  // lineage hangs silently until the hours-scale timeout. Read through the raw alias set
  // because this knob is intentionally outside fanoutConfigSchema. Non-disableable while
  // running autonomously: an explicit 0 no longer opts out, it is rejected.
  const value = readRawConfigNumber(rawConfig, [
    'stallWatchdogMs',
    'stall_watchdog_ms',
    'stallWatchdogMillis',
    'stall_watchdog_millis',
  ], 'stallWatchdogMs');
  if (value === 0) {
    throw inputError('stallWatchdogMs must be greater than 0; stall detection cannot be disabled for autonomous fan-out runs');
  }
  return value ?? 300000;
}

const DEFAULT_MAX_COST_UNITS_PER_LINEAGE = 72;

function normalizeLineageBudgetGuards(rawConfig = {}) {
  return {
    max_cost_units_per_lineage: readRawConfigNumber(rawConfig, [
      'maxCostUnitsPerLineage',
      'max_cost_units_per_lineage',
      'maxLineageCostUnits',
      'max_lineage_cost_units',
      'maxTokensPerLineage',
      'max_tokens_per_lineage',
      'maxTokenBudget',
      'max_token_budget',
      'maxTokenBudgetPerLineage',
      'max_token_budget_per_lineage',
    ], 'maxCostUnitsPerLineage') ?? DEFAULT_MAX_COST_UNITS_PER_LINEAGE,
    cost_units_per_iteration: readPositiveRawConfigNumber(rawConfig, [
      'costUnitsPerIteration',
      'cost_units_per_iteration',
      'estimatedTokensPerIteration',
      'estimated_tokens_per_iteration',
    ], 'costUnitsPerIteration', 1),
  };
}

function computeLineageBudgetUpperBound(lineage, guardsInput = {}, maxRetries = 0) {
  const guards = normalizeLineageBudgetGuards(guardsInput);
  const rawIterations = Number(lineage && lineage.iterations);
  const iterations = Number.isFinite(rawIterations) && rawIterations > 0 ? Math.floor(rawIterations) : 12;
  const normalizedRetries = Number.isFinite(Number(maxRetries)) && Number(maxRetries) >= 0
    ? Math.floor(Number(maxRetries))
    : 0;
  const totalAttempts = normalizedRetries + 1;
  return {
    ...guards,
    iterations,
    total_attempts: totalAttempts,
    estimated_cost_units: iterations * guards.cost_units_per_iteration * totalAttempts,
  };
}

function evaluateLineageBudgetCap(input = {}) {
  const upperBound = computeLineageBudgetUpperBound(
    input.lineage || {},
    input.guards || input,
    input.maxRetries,
  );
  const exceeded = upperBound.max_cost_units_per_lineage > 0
    && upperBound.estimated_cost_units > upperBound.max_cost_units_per_lineage;
  return {
    continue_allowed: !exceeded,
    stop_reasons: exceeded ? ['max_cost_units_per_lineage'] : [],
    upper_bound: upperBound,
  };
}

// Aggregate budget across every expanded lineage in a run. This is a SEPARATE ceiling
// from DEFAULT_MAX_COST_UNITS_PER_LINEAGE above: the per-lineage cap bounds any single
// lineage, this bounds the whole fan-out submission, and both are enforced independently
// (a run may pass one and still fail the other).
const DEFAULT_MAX_AGGREGATE_COST_UNITS = 288;

function normalizeAggregateBudgetGuards(rawConfig = {}) {
  return {
    max_aggregate_cost_units: readRawConfigNumber(rawConfig, [
      'maxAggregateCostUnits',
      'max_aggregate_cost_units',
      'maxTotalCostUnits',
      'max_total_cost_units',
    ], 'maxAggregateCostUnits') ?? DEFAULT_MAX_AGGREGATE_COST_UNITS,
  };
}

function computeAggregateBudgetUpperBound(lineages, guardsInput = {}, maxRetries = 0) {
  const aggregateGuards = normalizeAggregateBudgetGuards(guardsInput);
  const lineageGuards = normalizeLineageBudgetGuards(guardsInput);
  const perLineage = (lineages || []).map((lineage) => {
    const upperBound = computeLineageBudgetUpperBound(lineage, lineageGuards, maxRetries);
    return { label: lineage && lineage.label, estimated_cost_units: upperBound.estimated_cost_units };
  });
  const estimatedCostUnits = perLineage.reduce((sum, entry) => sum + entry.estimated_cost_units, 0);
  return {
    max_aggregate_cost_units: aggregateGuards.max_aggregate_cost_units,
    estimated_cost_units: estimatedCostUnits,
    lineage_count: perLineage.length,
    per_lineage: perLineage,
  };
}

function evaluateAggregateBudgetCap(input = {}) {
  const upperBound = computeAggregateBudgetUpperBound(
    input.lineages || [],
    input.guards || input,
    input.maxRetries,
  );
  const exceeded = upperBound.max_aggregate_cost_units > 0
    && upperBound.estimated_cost_units > upperBound.max_aggregate_cost_units;
  return {
    continue_allowed: !exceeded,
    stop_reasons: exceeded ? ['max_aggregate_cost_units'] : [],
    upper_bound: upperBound,
  };
}

function buildTimestampAnomalyCounts(check) {
  return {
    anomalous: check.anomalous,
    untimestamped: check.untimestamped,
    unparseable: check.unparseable,
    total: check.total,
  };
}

function buildTimestampAnomalyPayload({ lineage, statePath, check }) {
  return {
    label: lineage.label,
    state_log: statePath,
    window: {
      start_at_iso: check.windowStart,
      end_at_iso: check.windowEnd,
      tolerance_ms: check.toleranceMs,
    },
    counts: buildTimestampAnomalyCounts(check),
    sample: check.sample,
  };
}

function collectTimestampAnomalies(results) {
  return results
    .filter((result) => result && result.status === 'fulfilled' && result.output && result.output.timestamp_anomaly)
    .map((result) => result.output.timestamp_anomaly);
}

function normalizeNonNegativeDelayMs(value) {
  if (value === undefined || value === null) return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.floor(n);
}

function normalizeWaitDurationMs(value) {
  return normalizeNonNegativeDelayMs(value) ?? 0;
}

function waitCheckpointPath(baseArtifactDir) {
  return path.join(baseArtifactDir, WAIT_CHECKPOINT_FILENAME);
}

function atomicWriteJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmpPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.renameSync(tmpPath, filePath);
}

function buildWaitCheckpoint({ waitMs, runId, loopType, specFolder, nowMs = Date.now() }) {
  const durationMs = normalizeWaitDurationMs(waitMs);
  const updatedAt = new Date(nowMs).toISOString();
  if (durationMs <= 0) {
    return {
      schemaVersion: WAIT_CHECKPOINT_SCHEMA_VERSION,
      status: 'idle',
      nextRunAt: null,
      remainingDelayMs: null,
      updatedAt,
      runId,
      loopType,
      specFolder,
    };
  }

  return {
    schemaVersion: WAIT_CHECKPOINT_SCHEMA_VERSION,
    status: 'waiting',
    nextRunAt: new Date(nowMs + durationMs).toISOString(),
    remainingDelayMs: durationMs,
    updatedAt,
    runId,
    loopType,
    specFolder,
  };
}

function normalizeWaitCheckpoint(raw, context) {
  if (!isRecord(raw)) {
    throw inputError('wait checkpoint must be a JSON object');
  }

  const nowMs = Number.isFinite(Number(context.nowMs)) ? Number(context.nowMs) : Date.now();
  const hasNextRunAt = Object.prototype.hasOwnProperty.call(raw, 'nextRunAt');
  const hasRemainingDelayMs = Object.prototype.hasOwnProperty.call(raw, 'remainingDelayMs');
  const nextRunAt = typeof raw.nextRunAt === 'string' && raw.nextRunAt.trim() !== ''
    ? raw.nextRunAt
    : null;
  const nextRunAtMs = nextRunAt === null ? NaN : Date.parse(nextRunAt);
  const waiting = Number.isFinite(nextRunAtMs) && nextRunAtMs > nowMs;
  const remainingDelayMs = waiting ? Math.max(0, Math.ceil(nextRunAtMs - nowMs)) : null;
  const base = {
    runId: typeof raw.runId === 'string' && raw.runId ? raw.runId : context.runId,
    loopType: typeof raw.loopType === 'string' && raw.loopType ? raw.loopType : context.loopType,
    specFolder: typeof raw.specFolder === 'string' && raw.specFolder ? raw.specFolder : context.specFolder,
  };

  const checkpoint = waiting
    ? {
        schemaVersion: WAIT_CHECKPOINT_SCHEMA_VERSION,
        status: 'waiting',
        nextRunAt,
        remainingDelayMs,
        updatedAt: new Date(nowMs).toISOString(),
        ...base,
      }
    : buildWaitCheckpoint({ waitMs: 0, nowMs, ...base });
  const staleWaitingFields = !waiting
    && (raw.nextRunAt !== null || raw.remainingDelayMs !== null || raw.status === 'waiting');
  const staleRemainingDelay = waiting && Number(raw.remainingDelayMs) !== remainingDelayMs;

  return {
    checkpoint,
    migrated: !hasNextRunAt || !hasRemainingDelayMs || staleWaitingFields || staleRemainingDelay,
  };
}

function readWaitCheckpoint(checkpointPath, context) {
  if (!fs.existsSync(checkpointPath)) {
    return { exists: false, checkpoint: null, migrated: false };
  }

  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(checkpointPath, 'utf8'));
  } catch (error) {
    throw inputError(
      `wait checkpoint is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const normalized = normalizeWaitCheckpoint(raw, context);
  if (normalized.migrated) {
    atomicWriteJson(checkpointPath, normalized.checkpoint);
  }
  return { exists: true, ...normalized };
}

function sleepWaitChunk(ms) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

async function waitUntilCheckpointExpires({ checkpointPath, checkpoint, context, sleep = sleepWaitChunk }) {
  const nextRunAtMs = Date.parse(checkpoint.nextRunAt);
  let remainingDelayMs = Math.max(0, Math.ceil(nextRunAtMs - Date.now()));

  while (remainingDelayMs > 0) {
    atomicWriteJson(checkpointPath, {
      ...checkpoint,
      remainingDelayMs,
      updatedAt: new Date().toISOString(),
    });
    await sleep(Math.min(remainingDelayMs, WAIT_SLEEP_CHUNK_MS));
    remainingDelayMs = Math.max(0, Math.ceil(nextRunAtMs - Date.now()));
  }

  atomicWriteJson(checkpointPath, buildWaitCheckpoint({ waitMs: 0, ...context }));
}

async function resumeWaitingCheckpoint({ checkpointPath, ledgerPath, runId, loopType, specFolder }) {
  const context = { runId, loopType, specFolder, nowMs: Date.now() };
  const loaded = readWaitCheckpoint(checkpointPath, context);
  if (!loaded.checkpoint || loaded.checkpoint.status !== 'waiting') {
    return { didWait: false, migrated: loaded.migrated };
  }

  appendFanoutStatusLedger(ledgerPath, {
    event: 'resume_waiting',
    at: new Date().toISOString(),
    run_id: runId,
    loop_type: loopType,
    spec_folder: specFolder,
    nextRunAt: loaded.checkpoint.nextRunAt,
    remainingDelayMs: loaded.checkpoint.remainingDelayMs,
  });

  await waitUntilCheckpointExpires({
    checkpointPath,
    checkpoint: loaded.checkpoint,
    context: { runId, loopType, specFolder },
  });

  appendFanoutStatusLedger(ledgerPath, {
    event: 'resume_waiting_complete',
    at: new Date().toISOString(),
    run_id: runId,
    loop_type: loopType,
    spec_folder: specFolder,
  });

  return { didWait: true, migrated: loaded.migrated };
}

async function persistPreDispatchWait({ checkpointPath, ledgerPath, runId, loopType, specFolder, waitMs }) {
  const durationMs = normalizeWaitDurationMs(waitMs);
  if (durationMs <= 0) {
    return { didWait: false };
  }

  const checkpoint = buildWaitCheckpoint({ waitMs: durationMs, runId, loopType, specFolder });
  atomicWriteJson(checkpointPath, checkpoint);
  appendFanoutStatusLedger(ledgerPath, {
    event: 'wait_checkpoint_persisted',
    at: checkpoint.updatedAt,
    run_id: runId,
    loop_type: loopType,
    spec_folder: specFolder,
    nextRunAt: checkpoint.nextRunAt,
    remainingDelayMs: checkpoint.remainingDelayMs,
  });

  await waitUntilCheckpointExpires({
    checkpointPath,
    checkpoint,
    context: { runId, loopType, specFolder },
  });

  appendFanoutStatusLedger(ledgerPath, {
    event: 'wait_checkpoint_cleared',
    at: new Date().toISOString(),
    run_id: runId,
    loop_type: loopType,
    spec_folder: specFolder,
  });

  return { didWait: true };
}

/**
 * Build the "run the full loop" prompt text for a CLI lineage subprocess.
 * The subprocess reads this, loads the skill, and runs the requested stop policy
 * with config.fanout_lineage_artifact_dir overriding step_resolve_artifact_root.
 */
function buildLoopPrompt(loopType, specFolder, lineageDir, sessionId, lineage, researchTopic, options = {}) {
  assertActiveFanoutLoopType(loopType);
  const skillFile =
    loopType === 'review'
      ? '.opencode/skills/system-deep-loop/deep-review/SKILL.md'
      : '.opencode/skills/system-deep-loop/deep-research/SKILL.md';
  const agentName = loopType === 'review' ? 'deep-review' : 'deep-research';
  const detachedIntro = lineage.kind === 'cli-opencode'
    ? [
        `This is an explicit parallel-detached OpenCode lineage, not a self-invocation of the parent session.`,
        `Use the separate lineage directory and session id below as the detached state boundary.`,
        ``,
      ]
    : lineage.kind === 'native'
      ? [
          `This is an explicit native fan-out adapter running through the command host's OpenCode CLI surface.`,
          `Use the separate lineage directory and session id below as the detached state boundary.`,
          ``,
        ]
      : [];
  const hasIterationCap = typeof lineage.iterations === 'number' && lineage.iterations > 0;
  const stopPolicy = options.stopPolicy || 'convergence';
  const stopClause = hasIterationCap && stopPolicy === 'max-iterations'
    ? 'until config.maxIterations is reached; treat convergence before that as telemetry only and broaden review angles instead of synthesizing early'
    : hasIterationCap
      ? 'to legal convergence OR config.maxIterations, whichever comes first'
      : 'to legal convergence';
  const params = [
    `  spec_folder: ${specFolder}`,
    `  config.fanout_lineage_artifact_dir: ${lineageDir}`,
    `  session_id: ${sessionId}`,
    `  executor: ${lineage.kind} model=${lineage.model || 'default'}`,
    `  loop_type: ${loopType}`,
    `  config.stopPolicy: ${stopPolicy}`,
  ];
  if (researchTopic) {
    // A research lineage's phase_init binds research_topic from this line. Without it a
    // fan-out research loop has no question to investigate and degrades to an empty topic.
    // Review loops scope by spec_folder and intentionally pass no topic.
    params.push(`  research_topic: ${researchTopic}`);
  }
  if (hasIterationCap) {
    params.push(`  config.maxIterations: ${lineage.iterations}`);
  }
  if (options.convergenceThreshold !== null && options.convergenceThreshold !== undefined) {
    params.push(`  config.convergenceThreshold: ${options.convergenceThreshold}`);
  }
  // Review lineages scope by spec_folder but the auto-workflow preflight
  // still requires the same review setup bindings the native command path pre-binds.
  // Without these, a detached CLI lineage can fail first-run initialization or infer a
  // different setup contract than native lineages.
  const setupBindings =
    loopType === 'review'
      ? [
          ``,
          `Review setup bindings (emit before any writes, same as native PRE-BOUND SETUP ANSWERS):`,
          `review_target: ${specFolder}`,
          `review_target_type: spec-folder`,
          `review_dimensions: all`,
          `spec_folder: ${specFolder}`,
          `execution_mode: AUTONOMOUS`,
          `lineage_mode: auto`,
          ``,
        ]
      : [];
  return [
    `You are orchestrating the ${agentName} workflow YAML as a detached fan-out lineage.`,
    ...detachedIntro,
    ``,
    `Read ${skillFile} and execute the ${loopType} loop with these parameters:`,
    ...params,
    ...setupBindings,
    `The step_resolve_artifact_root step will bind artifact_dir to ${lineageDir} via the`,
    `config.fanout_lineage_artifact_dir override — do NOT run the resolveArtifactRoot node`,
    `command; bind artifact_dir directly to the override value.`,
    ``,
    `Run phase_init, phase_main_loop (${stopClause}), and phase_synthesis.`,
    `Write EVERY file you create or modify inside ${lineageDir} and nowhere else — that directory is`,
    `your entire write surface. You may read anywhere, but do NOT modify, create, or delete any file`,
    `outside ${lineageDir}, and do NOT run any command that writes outside it: in particular do NOT`,
    `run generate-context.js, validate.sh (especially --recursive), or any git write/checkout/commit`,
    `command. Producing findings does not mean running the repo's tooling — a single out-of-scope`,
    `write fails this whole lineage.`,
    ``,
    `When complete, output a single line: FANOUT_LINEAGE_COMPLETE:${lineage.label}`,
  ].join('\n');
}

function buildNativeCommandInput(loopType, specFolder, lineageDir, lineage, options = {}) {
  assertActiveFanoutLoopType(loopType);
  const maxIterations = lineage.iterations || 12;
  const convergenceThreshold = options.convergenceThreshold ?? (loopType === 'research' ? 0.05 : 0.1);
  const stopPolicy = options.stopPolicy || 'convergence';
  const sessionId = options.sessionId || '';
  const args = [
    ':auto',
    JSON.stringify(specFolder),
    `--spec-folder=${specFolder}`,
    `--max-iterations=${maxIterations}`,
    `--convergence=${convergenceThreshold}`,
    `--stop-policy=${stopPolicy}`,
    `--fanout-lineage-artifact-dir=${lineageDir}`,
    '--lineage-mode=auto',
  ];
  if (loopType === 'research' && options.researchTopic) {
    args.push(`--research-topic=${JSON.stringify(options.researchTopic)}`);
  }

  return [
    args.join(' '),
    '',
    'PRE-BOUND SETUP ANSWERS:',
    `review_target: ${specFolder}`,
    'review_target_type: spec-folder',
    'review_dimensions: all',
    `spec_folder: ${specFolder}`,
    ...(sessionId ? [`session_id: ${sessionId}`] : []),
    'execution_mode: AUTONOMOUS',
    'lineage_mode: auto',
    `maxIterations: ${maxIterations}`,
    `convergenceThreshold: ${convergenceThreshold}`,
    `stop_policy: ${stopPolicy}`,
    `config.fanout_lineage_artifact_dir: ${lineageDir}`,
  ].join('\n');
}

// Full-lineage lifetime is non-disableable in autonomous mode: 4 hours is the hard
// ceiling and a positive override may only narrow it, never widen past it.
const LINEAGE_LIFETIME_HARD_MAX_HOURS = 4;

function assertLineageTimeoutHoursOverrideWithinCeiling(ceilingHoursOverride) {
  if (Number.isFinite(ceilingHoursOverride) && ceilingHoursOverride > LINEAGE_LIFETIME_HARD_MAX_HOURS) {
    throw inputError(
      `lineageTimeoutHours override (${ceilingHoursOverride}) exceeds the hard maximum of `
        + `${LINEAGE_LIFETIME_HARD_MAX_HOURS} hours`,
    );
  }
}

/**
 * Compute a generous timeout for a full lineage loop run.
 * A single iteration is timeoutSeconds; a full loop is up to iterations * timeoutSeconds.
 * We double it for safety and cap at 4 hours. A caller-provided ceiling override may only
 * narrow this hard ceiling, never widen it — full-lineage lifetime is non-disableable.
 */
function computeLineageTimeoutMs(lineage, ceilingHoursOverride) {
  assertLineageTimeoutHoursOverrideWithinCeiling(ceilingHoursOverride);
  const iters = lineage.iterations || 12;
  const perIterSecs = lineage.timeoutSeconds || 900;
  const ceilingMs = Number.isFinite(ceilingHoursOverride) && ceilingHoursOverride > 0
    ? ceilingHoursOverride * 60 * 60 * 1000
    : LINEAGE_LIFETIME_HARD_MAX_HOURS * 60 * 60 * 1000;
  return Math.min(iters * perIterSecs * 2 * 1000, ceilingMs);
}

function normalizeProgressHeartbeatMs(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.max(1, Math.floor(value * 1000));
}

function normalizePostExitGraceMs(rawConfig, progressHeartbeatMs = 0) {
  const explicit = readRawConfigNumber(rawConfig, [
    'postExitGraceMs',
    'post_exit_grace_ms',
    'postSubprocessExitGraceMs',
    'post_subprocess_exit_grace_ms',
    'orchestratorPostExitGraceMs',
    'orchestrator_post_exit_grace_ms',
  ], 'postExitGraceMs');
  if (explicit !== null) return explicit;

  const heartbeatDerived = Number.isFinite(progressHeartbeatMs) && progressHeartbeatMs > 0
    ? progressHeartbeatMs * 2
    : 0;
  return Math.max(DEFAULT_POST_EXIT_GRACE_MS, heartbeatDerived);
}

function slotDurationMsFromHrtime(hrStart) {
  const [seconds, nanoseconds] = process.hrtime(hrStart);
  return Math.max(0, (seconds * 1000) + (nanoseconds / 1e6));
}

function computeSkippedCount(slotDurationMs, intervalMs) {
  const elapsed = Number(slotDurationMs);
  const interval = Number(intervalMs);
  if (!Number.isFinite(elapsed) || !Number.isFinite(interval) || interval <= 0) {
    return 0;
  }
  return Math.max(0, Math.floor(elapsed / interval) - 1);
}

function buildSlotAccounting(hrStart, intervalMs) {
  const slotDurationMs = slotDurationMsFromHrtime(hrStart);
  return {
    slotDurationMs,
    skippedCount: computeSkippedCount(slotDurationMs, intervalMs),
  };
}

function decorateSlotAccountingEvent(event, accountingByLabel) {
  if (!event || typeof event.label !== 'string') return event;
  if (event.event !== 'completed' && event.event !== 'failed') return event;

  const accounting = accountingByLabel.get(event.label);
  if (!accounting) return event;
  return {
    ...event,
    skippedCount: accounting.skippedCount,
    slotDurationMs: accounting.slotDurationMs,
  };
}

function startLineageProgressHeartbeat({ cadenceMs, label, ledgerPath, getGauges, onProgress }) {
  if (!Number.isFinite(cadenceMs) || cadenceMs <= 0) {
    return () => {};
  }
  const startedAtMs = Date.now();
  const timer = setInterval(() => {
    appendFanoutStatusLedger(ledgerPath, {
      event: 'progress',
      label,
      at: new Date().toISOString(),
      duration_ms: Math.max(0, Date.now() - startedAtMs),
        gauges: getGauges(),
      });
      if (typeof onProgress === 'function') onProgress();
    }, cadenceMs);
  timer.unref?.();
  return () => clearInterval(timer);
}

function startLineageStallWatchdog({ thresholdMs, label, ledgerPath, getLastEventAtMs, getGauges }) {
  if (!Number.isFinite(thresholdMs) || thresholdMs <= 0) {
    return () => {};
  }

  let timer = null;
  let fired = false;
  const schedule = () => {
    if (fired) return;
    const quietMs = Math.max(0, Date.now() - getLastEventAtMs());
    const delayMs = Math.max(1, thresholdMs - quietMs);
    timer = setTimeout(() => {
      timer = null;
      const latestQuietMs = Math.max(0, Date.now() - getLastEventAtMs());
      if (latestQuietMs >= thresholdMs) {
        fired = true;
        appendFanoutStatusLedger(ledgerPath, {
          event: 'stall_detected',
          label,
          at: new Date().toISOString(),
          severity: 'warning',
          metric: 'time_since_last_lineage_event',
          stall_watchdog_ms: thresholdMs,
          quiet_ms: Math.floor(latestQuietMs),
          gauges: getGauges(),
        });
        return;
      }
      schedule();
    }, delayMs);
    timer.unref?.();
  };

  schedule();
  return () => {
    fired = true;
    if (timer) clearTimeout(timer);
  };
}

/**
 * Run a lineage subprocess without blocking the Node event loop.
 *
 * Resolves a spawnSync-shaped result ({ status, signal, stdout, error }) so the
 * pool's K-in-flight cap actually overlaps lineages. spawnSync blocked the single
 * thread until each child exited, serializing every lineage regardless of the
 * concurrency cap; an awaited async spawn yields to the loop so K run at once.
 *
 * On timeout the child is killed with SIGTERM and result.signal is set to
 * 'SIGTERM', preserving the timeout-as-failure signal the caller relies on.
 *
 * @param {string} command - Executable to run.
 * @param {string[]} cmdArgs - Arguments for the executable.
 * @param {Object} opts - { cwd, env, timeoutMs, maxBuffer, input? }.
 * @returns {Promise<{status:number|null, signal:string|null, stdout:string, error?:Error}>}
 */
function runLineageProcess(command, cmdArgs, opts) {
  const { cwd, env, timeoutMs, maxBuffer } = opts;
  const hasInput = typeof opts.input === 'string';

  return new Promise((resolvePromise) => {
    let child;
    try {
      child = spawn(command, cmdArgs, {
        cwd,
        env,
        stdio: [hasInput ? 'pipe' : 'ignore', 'pipe', 'pipe'],
        detached: process.platform !== 'win32',
      });
    } catch (error) {
      resolvePromise({ status: null, signal: null, stdout: '', error });
      return;
    }
    activeLineageProcesses.add(child);
    if (typeof opts.onSpawn === 'function') {
      opts.onSpawn({ pid: child.pid });
    }

    let stdout = '';
    let stdoutBytes = 0;
    let truncated = false;
    let timedOut = false;
    let settled = false;
    let spawnError;

    const timer = setTimeout(() => {
      timedOut = true;
      terminateLineageProcess(child, 'SIGTERM');
    }, timeoutMs);
    timer.unref?.();

    const abortHandler = () => {
      terminateLineageProcess(child, 'SIGTERM');
    };
    if (opts.abortSignal) {
      if (opts.abortSignal.aborted) {
        abortHandler();
      } else {
        opts.abortSignal.addEventListener('abort', abortHandler, { once: true });
      }
    }

    child.stdout?.setEncoding('utf8');
    child.stdout?.on('data', (chunk) => {
      if (typeof opts.onOutput === 'function') opts.onOutput();
      if (truncated) return;
      stdoutBytes += Buffer.byteLength(chunk, 'utf8');
      if (stdoutBytes > maxBuffer) {
        truncated = true;
        terminateLineageProcess(child, 'SIGTERM');
        return;
      }
      stdout += chunk;
    });
    // Drain stderr so the child never blocks on a full pipe; we do not capture it.
    child.stderr?.resume();

    child.on('error', (error) => {
      spawnError = error;
    });

    child.on('close', (code, signal) => {
      if (settled) return;
      settled = true;
      activeLineageProcesses.delete(child);
      clearTimeout(timer);
      opts.abortSignal?.removeEventListener?.('abort', abortHandler);
      const effectiveSignal = timedOut ? 'SIGTERM' : signal;
      if (typeof opts.onExit === 'function') {
        opts.onExit({ status: timedOut ? null : code, signal: effectiveSignal, pid: child.pid, exitedAtMs: Date.now() });
      }
      resolvePromise({
        status: timedOut ? null : code,
        signal: effectiveSignal,
        stdout,
        ...(spawnError ? { error: spawnError } : {}),
      });
    });

    if (hasInput) {
      child.stdin?.on('error', () => {});
      child.stdin?.end(opts.input);
    }
  });
}

function digestText(value) {
  return createHash('sha256').update(String(value)).digest('hex');
}

const executableIdentityCache = new Map();

function resolveExecutableVersion(command, options = {}) {
  if (typeof options.executableVersion === 'string' && options.executableVersion.trim()) {
    return options.executableVersion.trim();
  }
  const env = options.env || process.env;
  const pathEntries = String(env.PATH || '').split(path.delimiter).filter(Boolean);
  for (const entry of pathEntries) {
    const candidate = path.join(entry, command);
    try {
      const executablePath = fs.realpathSync(candidate);
      const stat = fs.statSync(executablePath);
      if (!stat.isFile()) continue;
      const cacheKey = `${executablePath}:${stat.size}:${stat.mtimeMs}`;
      const cached = executableIdentityCache.get(cacheKey);
      if (cached) return cached;
      const identity = `sha256:${createHash('sha256').update(fs.readFileSync(executablePath)).digest('hex')}`;
      executableIdentityCache.set(cacheKey, identity);
      return identity;
    } catch {}
  }
  return 'unknown';
}

function effectiveWebSearchPolicy(lineage) {
  return lineage.liveTools?.webSearch || 'inherit';
}

/**
 * Build the allowlisted fingerprint payload without raw prompts or environment maps.
 *
 * @param {Object} input - Resolved invocation fields.
 * @returns {Object} Canonical JSON-safe payload.
 */
function buildInvocationFingerprintPayload(input) {
  const promptDigest = digestText(input.prompt);
  const promptArgIndexes = new Set(input.promptArgIndexes || []);
  const argv = input.args.map((arg, index) => (
    promptArgIndexes.has(index) ? `<prompt:${promptDigest}>` : arg
  ));
  return {
    kind: input.kind,
    executable: input.command,
    executableVersion: input.executableVersion || 'unknown',
    model: input.model,
    effort: input.reasoningEffort,
    tier: input.serviceTier,
    sandboxPosture: {
      sandboxMode: input.resolvedSandbox,
      permissionMode: input.resolvedPermission,
    },
    webSearch: input.webSearch,
    argv,
    promptDigest,
  };
}

function finalizeLineageCommand(input) {
  // cli-opencode exposes no OS-level sandbox or permission-scoping flag: read-only and
  // workspace-write are indistinguishable at the command level (buildOpencodeLineageCommand
  // only branches on danger-full-access), so recording either as the effective sandbox mode
  // is a false guarantee. A caller that requested confinement must be told the request
  // cannot be honored rather than silently downgraded to unconfined writes with an advisory
  // label, so dispatch fails closed instead of proceeding.
  if (input.kind === 'cli-opencode' && input.resolvedSandbox && input.resolvedSandbox !== 'danger-full-access') {
    throw inputError(
      `cli-opencode cannot enforce sandbox mode '${input.resolvedSandbox}': the executor exposes `
        + 'no confinement flag for it; use \'danger-full-access\' or a dispatch kind that can enforce this sandbox mode',
    );
  }
  const effectiveConfig = {
    kind: input.kind,
    executable: input.command,
    executableVersion: input.executableVersion || 'unknown',
    model: input.model,
    reasoningEffort: input.reasoningEffort,
    serviceTier: input.serviceTier,
    sandboxMode: input.resolvedSandbox,
    permissionMode: input.resolvedPermission,
    webSearch: input.webSearch,
  };
  const fingerprintPayload = buildInvocationFingerprintPayload(input);
  const invocationFingerprint = `inv:${digestText(JSON.stringify(fingerprintPayload))}`;
  return {
    command: input.command,
    args: input.args,
    ...(Object.prototype.hasOwnProperty.call(input, 'input') ? { input: input.input } : {}),
    effectiveConfig,
    invocationFingerprint,
  };
}

function buildCodexLineageCommand(lineage, prompt, resolvedSandbox, resolvedPermission, options) {
  if (!isCodexBinaryAvailable(options.env || process.env)) {
    throw inputError('cli-codex executor unavailable: command -v codex failed');
  }
  const webSearch = effectiveWebSearchPolicy(lineage);
  const model = lineage.model || 'o4-mini';
  const reasoningEffort = lineage.reasoningEffort || 'medium';
  const args = [];
  if (webSearch === 'live') {
    args.push('--search');
  }
  args.push(
    'exec',
    '--model',
    model,
    '-c',
    `model_reasoning_effort=${reasoningEffort}`,
  );
  if (lineage.serviceTier) {
    args.push('-c', `service_tier=${lineage.serviceTier}`);
  }
  args.push('-c', 'approval_policy=never', '--sandbox', resolvedSandbox, '-');
  return finalizeLineageCommand({
    kind: lineage.kind,
    command: 'codex',
    args,
    input: prompt,
    prompt,
    promptArgIndexes: [],
    executableVersion: resolveExecutableVersion('codex', options),
    model,
    reasoningEffort,
    serviceTier: lineage.serviceTier || null,
    resolvedSandbox,
    resolvedPermission,
    webSearch,
  });
}

function buildClaudeLineageCommand(lineage, prompt, resolvedSandbox, resolvedPermission, options) {
  const model = lineage.model || 'claude-opus-4-8';
  const args = [
    '-p',
    prompt,
    '--model',
    model,
    '--permission-mode',
    resolvedPermission,
    '--output-format',
    'text',
  ];
  if (lineage.reasoningEffort) {
    args.push('--effort', lineage.reasoningEffort);
  }
  return finalizeLineageCommand({
    kind: lineage.kind,
    command: 'claude',
    args,
    input: undefined,
    prompt,
    promptArgIndexes: [1],
    executableVersion: resolveExecutableVersion('claude', options),
    model,
    reasoningEffort: lineage.reasoningEffort || null,
    serviceTier: null,
    resolvedSandbox,
    resolvedPermission,
    webSearch: effectiveWebSearchPolicy(lineage),
  });
}

function buildNativeLineageCommand(lineage, prompt, resolvedSandbox, resolvedPermission, options) {
  const args = [
    'run',
    '--format',
    'json',
    '--dir',
    process.cwd(),
    '--command',
    `deep/${options.loopType || 'review'}`,
  ];
  if (resolvedSandbox === 'danger-full-access' || resolvedSandbox === 'workspace-write') {
    args.splice(1, 0, '--dangerously-skip-permissions');
  }
  const commandInput = buildNativeCommandInput(
    options.loopType || 'review',
    options.specFolder || '',
    options.lineageDir || '',
    lineage,
    options,
  );
  args.push(commandInput);
  return finalizeLineageCommand({
    kind: lineage.kind,
    command: 'opencode',
    args,
    input: '',
    prompt: commandInput,
    promptArgIndexes: [args.length - 1],
    executableVersion: resolveExecutableVersion('opencode', options),
    model: null,
    reasoningEffort: null,
    serviceTier: null,
    resolvedSandbox,
    resolvedPermission,
    webSearch: effectiveWebSearchPolicy(lineage),
  });
}

function buildOpencodeLineageCommand(lineage, prompt, resolvedSandbox, resolvedPermission, options) {
  const model = lineage.model || 'anthropic/claude-opus-4-8';
  const args = [
    'run',
    '--model',
    model,
    '--format',
    'json',
    // The full runtime is required because the workflow writes isolated lineage state.
    '--dir',
    process.cwd(),
  ];
  const useDangerousBypass = resolvedSandbox === 'danger-full-access';
  if (useDangerousBypass) {
    args.push('--dangerously-skip-permissions');
    process.stderr.write(
      `FATAL WARN: lineage ${lineage.label || '(cli-opencode)'} runs with --dangerously-skip-permissions. `
        + `The lineageDir write boundary is prompt-only, not sandbox-enforced.\n`,
    );
  }
  if (lineage.reasoningEffort) {
    args.push('--variant', lineage.reasoningEffort);
  }
  args.push(prompt);
  return finalizeLineageCommand({
    kind: lineage.kind,
    command: 'opencode',
    args,
    input: '',
    prompt,
    promptArgIndexes: [args.length - 1],
    executableVersion: resolveExecutableVersion('opencode', options),
    model,
    reasoningEffort: lineage.reasoningEffort || null,
    serviceTier: null,
    resolvedSandbox,
    resolvedPermission,
    webSearch: effectiveWebSearchPolicy(lineage),
  });
}

// Mirrors CURSOR_SUPPORTED_MODELS in executor-config.ts. Duplicated as a plain
// JS literal (rather than dynamically imported) so buildCursorLineageCommand
// stays synchronous and directly unit-testable, matching this file's existing
// convention of hand-duplicating small per-kind cursor facts (see
// SPECKIT_STATE_ENV_BY_KIND above) instead of threading an async import
// through a sync call path.
// Sorted alphabetically, not grouped by family. Grok 4.6 joined alongside
// Grok 4.5 (2026-08-12) — both versions are live and dispatchable on Cursor.
// GPT-5.6 Luna Max (gpt-5.6-luna-max, gpt-5.6-luna-max-fast) joined 2026-08-14,
// list-verified via `cursor-agent --list-models` (not dispatch-tested).
// Gemini 3.7 Flash High (gemini-3.7-flash-high) joined 2026-08-15, the first
// Gemini id in the curated Cursor scope — list-verified and dispatch-tested.
const CURSOR_ALLOWED_MODELS = new Set([
  'composer-2.5',
  'composer-2.5-fast',
  'cursor-grok-4.5-high',
  'cursor-grok-4.5-high-fast',
  'cursor-grok-4.5-low',
  'cursor-grok-4.5-low-fast',
  'cursor-grok-4.5-medium',
  'cursor-grok-4.5-medium-fast',
  'cursor-grok-4.6-high',
  'cursor-grok-4.6-high-fast',
  'cursor-grok-4.6-low',
  'cursor-grok-4.6-low-fast',
  'cursor-grok-4.6-medium',
  'cursor-grok-4.6-medium-fast',
  'cursor-grok-4.6-xhigh',
  'cursor-grok-4.6-xhigh-fast',
  'gemini-3.7-flash-high',
  'glm-5.2-high',
  'glm-5.2-max',
  'gpt-5.6-luna-max',
  'gpt-5.6-luna-max-fast',
]);
const CURSOR_DEFAULT_MODEL = 'composer-2.5';

// Mirrors PI_SUPPORTED_MODELS in executor-config.ts. Pi is a provider
// pass-through with no house model, so this synchronous duplicate keeps
// command construction fail-closed without importing the TypeScript module.
const PI_ALLOWED_MODELS = new Set([
  'deepseek-v4-pro',
  'deepseek-v4-flash',
  'minimax-m3',
  'gpt-5.6-luna',
  'gpt-5.6-sol',
  'gpt-5.6-terra',
  'mimo-v2.5-pro',
  'mimo-v2.5-pro-ultraspeed',
  'qwen3.8-max',
]);
const PI_DEFAULT_MODEL = 'deepseek-v4-pro';

function buildCursorLineageCommand(lineage, prompt, resolvedSandbox, resolvedPermission, options) {
  if (!isCursorBinaryAvailable(options.env || process.env)) {
    throw inputError('cli-cursor executor unavailable: command -v cursor-agent failed');
  }
  const webSearch = effectiveWebSearchPolicy(lineage);
  const model = lineage.model || CURSOR_DEFAULT_MODEL;
  if (!CURSOR_ALLOWED_MODELS.has(model)) {
    throw inputError(
      `cli-cursor model '${model}' is not in the enforced allowlist: ${[...CURSOR_ALLOWED_MODELS].join(', ')}`,
    );
  }
  // Cursor has no --reasoning-effort flag and rejects the parameterized
  // model[effort=...] bracket outright ("Cannot use this model", live-verified
  // 2026-07-24 against cursor-agent 2026.07.23-e383d2b) — effort tiers are baked
  // into the model id itself (e.g. gpt-5.2-high), so reasoningEffort is never
  // forwarded here (also unsupported at the executor-config.ts flag-support
  // layer). The sandbox->flag mapping below is grounded in the installed
  // cursor-agent's live headless behavior and is kept independent of
  // resolveCursorApprovalMode() in executor-config.ts (matching how the
  // codex/opencode adapters above derive their own kind-specific flags from
  // resolvedSandbox rather than calling a shared resolver). In -p
  // (non-interactive) mode cursor-agent can use every tool (write + shell) and,
  // in an untrusted directory, refuses to run any tool unless a trust flag is
  // passed. read-only uses --mode plan (Cursor's read-only/planning mode: file
  // reads allowed, edits and shell writes blocked) plus --trust to clear that
  // gate — --sandbox enabled is NOT used for read-only because it confines
  // processes but still permits writes to the working directory, so it does not
  // make a leaf read-only. Both write modes use --force ("Run Everything"),
  // which auto-approves every tool so the leaf never stalls and already implies
  // trust: --auto-review ("Smart Auto") is deliberately avoided because it
  // prompts for tool calls it deems unsafe, and a non-interactive leaf has no
  // stdin to answer, so it could block until the lineage timeout. The two write
  // modes differ only by OS confinement: workspace-write adds --sandbox enabled
  // (writes confined to the working directory), danger-full-access uses
  // --sandbox disabled (unconfined).
  const args = ['-p', prompt, '--output-format', 'text', '--model', model];
  if (resolvedSandbox === 'danger-full-access') {
    args.push('--force', '--sandbox', 'disabled');
  } else if (resolvedSandbox === 'read-only') {
    // A read-only leaf additionally runs against a neutral empty workspace and
    // re-adds the working directory as a read root. --workspace controls where
    // cursor loads .cursor/ hooks and MCP config from, so an empty neutral
    // workspace loads no repo hooks/MCP (which could write or hang independent of
    // the read-only mode), while --add-dir preserves read access. The neutral
    // path is stable (not per-invocation) so the invocation fingerprint stays
    // deterministic, and read-only leaves never write to it, so it is safe to
    // share across concurrent leaves.
    const cursorEnv = (options && options.env) || process.env;
    const neutralWorkspace = cursorEnv.DEEP_LOOP_CURSOR_NEUTRAL_WORKSPACE
      || path.join(os.tmpdir(), 'deep-loop-cursor-neutral-workspace');
    fs.mkdirSync(neutralWorkspace, { recursive: true, mode: 0o700 });
    // Fail closed: the neutral path is predictable, so a stale process or another
    // local user could pre-create it as a symlink or plant a `.cursor/` config that
    // cursor would then load under --trust — defeating the isolation. Require a
    // real, current-user-owned directory with no `.cursor/` inside before using it.
    const neutralStat = fs.lstatSync(neutralWorkspace);
    const currentUid = typeof process.getuid === 'function' ? process.getuid() : null;
    if (
      neutralStat.isSymbolicLink()
      || !neutralStat.isDirectory()
      || (currentUid !== null && neutralStat.uid !== currentUid)
      || fs.existsSync(path.join(neutralWorkspace, '.cursor'))
    ) {
      throw inputError(`cli-cursor neutral workspace '${neutralWorkspace}' is not a safe owner-owned empty directory`);
    }
    const repoRoot = (options && options.cwd) || process.cwd();
    args.push('--mode', 'plan', '--trust', '--workspace', neutralWorkspace, '--add-dir', repoRoot);
  } else {
    args.push('--force', '--sandbox', 'enabled');
  }
  return finalizeLineageCommand({
    kind: lineage.kind,
    command: 'cursor-agent',
    args,
    input: undefined,
    prompt,
    promptArgIndexes: [1],
    executableVersion: resolveExecutableVersion('cursor-agent', options),
    model,
    reasoningEffort: null,
    serviceTier: null,
    resolvedSandbox,
    resolvedPermission,
    webSearch,
  });
}

// Must mirror DEVIN_SUPPORTED_MODELS in executor-config.ts; duplicated as plain JS
// literal for the same reason CURSOR_ALLOWED_MODELS is: buildDevinLineageCommand
// stays synchronous and directly unit-testable.
// Sorted alphabetically, not grouped by family. Grok 4.6 joined alongside
// Grok 4.5 (2026-08-12) — both versions are live and dispatchable on Devin.
// DeepSeek max tiers (deepseek-v4-flash-max, deepseek-v4-pro-max) and the first
// GPT-5.6 persona uids (gpt-5-6-luna-max, gpt-5-6-luna-max-priority; -priority
// is Devin's Fast variant) joined 2026-08-14, list-verified via `devin models
// list` (not dispatch-tested). Gemini 3.7 Flash High (gemini-3-7-flash-high)
// joined 2026-08-15, the first Gemini uid in the curated Devin scope —
// list-verified and dispatch-tested.
const DEVIN_ALLOWED_MODELS = new Set([
  'deepseek-v4',
  'deepseek-v4-flash-max',
  'deepseek-v4-pro',
  'deepseek-v4-pro-max',
  'gemini-3-7-flash-high',
  'glm-5-2',
  'glm-5-2-1m',
  'glm-5-2-max',
  'glm-5-2-max-1m',
  'glm-5-2-none',
  'glm-5-2-none-1m',
  'gpt-5-6-luna-max',
  'gpt-5-6-luna-max-priority',
  'grok-4-5-high',
  'grok-4-5-low',
  'grok-4-5-medium',
  'grok-4-6-high',
  'grok-4-6-low',
  'grok-4-6-medium',
  'grok-4-6-xhigh',
  'swe',
  'swe-1-7',
  'swe-1-7-lightning',
  'swe-1-7-medium',
]);
const DEVIN_DEFAULT_MODEL = 'swe';

function buildDevinLineageCommand(lineage, prompt, resolvedSandbox, resolvedPermission, options) {
  if (!isDevinBinaryAvailable(options.env || process.env)) {
    throw inputError('cli-devin executor unavailable: command -v devin failed');
  }
  const webSearch = effectiveWebSearchPolicy(lineage);
  const model = lineage.model || DEVIN_DEFAULT_MODEL;
  if (!DEVIN_ALLOWED_MODELS.has(model)) {
    throw inputError(
      `cli-devin model '${model}' is not in the enforced allowlist: ${[...DEVIN_ALLOWED_MODELS].join(', ')}`,
    );
  }
  // Devin has no --reasoning-effort and no service-tier flag: both the thinking
  // tier and priority routing are encoded in the model uid itself (`glm-5-2` vs
  // `glm-5-2-max`, `gpt-5-6-sol-high` vs `gpt-5-6-sol-high-priority`), so
  // reasoningEffort/serviceTier are never forwarded here — matching the
  // flag-support declaration in executor-config.ts.
  //
  // Permission mapping, grounded in the live headless behavior of the installed
  // devin: --sandbox forces the "autonomous" permission mode and IGNORES
  // --permission-mode, and without explicitly granted Write(...) scopes (which
  // the CLI only accepts via --agent-config, not passed here) the sandbox
  // defaults to a writable working directory. So:
  //   - read-only uses "auto" WITHOUT --sandbox: in non-interactive mode devin
  //     cleanly rejects the shell/exec and write tools while still auto-approving
  //     native file reads, giving genuine read-only. --sandbox must NOT be added
  //     here — it would flip the leaf to autonomous and let it write to cwd.
  //   - workspace-write uses "dangerous" WITH --sandbox: --sandbox makes the leaf
  //     autonomous so it never stalls on a permission prompt, and confines writes
  //     to the sandbox scope (the working directory) at the OS level; "dangerous"
  //     is the honest label for that autonomous behavior.
  //   - full access uses "dangerous" WITHOUT --sandbox: autonomous and unconfined.
  const args = ['-p', prompt, '--model', model];
  if (resolvedSandbox === 'danger-full-access') {
    args.push('--permission-mode', 'dangerous');
  } else if (resolvedSandbox === 'read-only') {
    args.push('--permission-mode', 'auto');
  } else {
    args.push('--permission-mode', 'dangerous', '--sandbox');
  }
  return finalizeLineageCommand({
    kind: lineage.kind,
    command: 'devin',
    args,
    input: undefined,
    prompt,
    promptArgIndexes: [1],
    executableVersion: resolveExecutableVersion('devin', options),
    model,
    reasoningEffort: null,
    serviceTier: null,
    resolvedSandbox,
    resolvedPermission,
    webSearch,
  });
}

// Provider that fronts each allowlisted Pi model, captured from `pi --list-models`
// (openai-codex fronts the GPT-5.6 tunes; deepseek, minimax, and xiaomi front
// their own families). Pi selects a model as `<provider>/<id>`; without the
// provider prefix it falls back to its default provider and dispatches the wrong
// model. Hand-duplicated as a plain literal so command construction stays
// synchronous and unit-testable, matching this file's per-kind convention.
const PI_MODEL_PROVIDERS = new Map([
  ['deepseek-v4-pro', 'deepseek'],
  ['deepseek-v4-flash', 'opencode-go'],
  ['minimax-m3', 'minimax'],
  ['gpt-5.6-luna', 'openai-codex'],
  ['gpt-5.6-sol', 'openai-codex'],
  ['gpt-5.6-terra', 'openai-codex'],
  ['mimo-v2.5-pro', 'xiaomi'],
  ['mimo-v2.5-pro-ultraspeed', 'xiaomi'],
  ['qwen3.8-max', 'opencode-go'],
]);
// Map each shared reasoningEffort level to the name Pi's `--thinking` uses (from the
// installed `pi --help`): the config's 'none' is Pi's 'off', and the config's 'ultra'
// caps at Pi's top level 'max'; every other level is identity. A map (not a plain
// allowlist) is required so a valid reasoningEffort never fails closed on a naming gap.
const REASONING_TO_PI_THINKING = new Map([
  ['none', 'off'],
  ['minimal', 'minimal'],
  ['low', 'low'],
  ['medium', 'medium'],
  ['high', 'high'],
  ['xhigh', 'xhigh'],
  ['max', 'max'],
  ['ultra', 'max'],
]);

function buildPiLineageCommand(lineage, prompt, resolvedSandbox, resolvedPermission, options) {
  if (!isPiBinaryAvailable(options.env || process.env)) {
    throw inputError('cli-pi executor unavailable: command -v pi failed');
  }
  const model = lineage.model || PI_DEFAULT_MODEL;
  if (!PI_ALLOWED_MODELS.has(model)) {
    throw inputError(
      `cli-pi model '${model}' is not in the enforced allowlist: ${[...PI_ALLOWED_MODELS].join(', ')}`,
    );
  }
  const provider = PI_MODEL_PROVIDERS.get(model);
  if (!provider) {
    throw inputError(`cli-pi model '${model}' has no known provider mapping`);
  }
  // Pi has no --dir flag (it runs in the spawned working directory) and no
  // service-tier surface, so neither is forwarded. --offline is mandatory: a
  // non-interactive dispatch without it can hang for minutes on startup network
  // probes. The caller must read the OUTPUT TEXT for the result and for
  // "No API key found" — Pi's exit code is not a reliable success or auth signal.
  const args = ['-p', '--offline', '--model', `${provider}/${model}`];
  // Pi enforces no OS-level sandbox (its flag support intentionally omits one);
  // a read-only leaf is bounded by restricting the tool allowlist to reads AND by
  // disabling auto-discovered extensions, skills, and prompt templates. Their
  // lifecycle code loads and can run independent of the tool allowlist, so a
  // genuinely read-only leaf must not load a write-capable extension/skill/template.
  if (resolvedSandbox === 'read-only') {
    args.push('--tools', 'read,grep,find,ls', '--no-extensions', '--no-skills', '--no-prompt-templates');
  }
  if (lineage.reasoningEffort) {
    const thinking = REASONING_TO_PI_THINKING.get(lineage.reasoningEffort);
    if (!thinking) {
      throw inputError(
        `cli-pi reasoningEffort '${lineage.reasoningEffort}' has no pi --thinking mapping: ${[...REASONING_TO_PI_THINKING.keys()].join(', ')}`,
      );
    }
    args.push('--thinking', thinking);
  }
  args.push(prompt);
  return finalizeLineageCommand({
    kind: lineage.kind,
    command: 'pi',
    args,
    input: '',
    prompt,
    promptArgIndexes: [args.length - 1],
    executableVersion: resolveExecutableVersion('pi', options),
    model,
    reasoningEffort: lineage.reasoningEffort || null,
    serviceTier: null,
    resolvedSandbox,
    resolvedPermission,
    webSearch: effectiveWebSearchPolicy(lineage),
  });
}

const LINEAGE_COMMAND_ADAPTERS = Object.freeze({
  native: buildNativeLineageCommand,
  'cli-codex': buildCodexLineageCommand,
  'cli-claude-code': buildClaudeLineageCommand,
  'cli-opencode': buildOpencodeLineageCommand,
  'cli-cursor': buildCursorLineageCommand,
  'cli-devin': buildDevinLineageCommand,
  'cli-pi': buildPiLineageCommand,
});

/**
 * Build the subprocess command and deterministic invocation identity for a lineage.
 *
 * @returns {{command:string,args:string[],input?:string,effectiveConfig:Object,invocationFingerprint:string}}
 */
function buildLineageCommand(lineage, prompt, resolvedSandbox, resolvedPermission, options = {}) {
  const adapter = LINEAGE_COMMAND_ADAPTERS[lineage.kind];
  if (!adapter) {
    throw inputError(`Unknown fan-out executor kind: ${lineage.kind}`);
  }
  return adapter(lineage, prompt, resolvedSandbox, resolvedPermission, options);
}

function isCodexBinaryAvailable(env = process.env) {
  const result = spawnSync('/bin/sh', ['-c', 'command -v codex >/dev/null 2>&1'], {
    env,
    stdio: 'ignore',
  });
  return result.status === 0;
}

// `cursor-agent -p` exits 0 even on an auth failure, so this PATH preflight is
// the only availability signal buildCursorLineageCommand may use — never the
// dispatch exit code.
function isCursorBinaryAvailable(env = process.env) {
  const result = spawnSync('/bin/sh', ['-c', 'command -v cursor-agent >/dev/null 2>&1'], {
    env,
    stdio: 'ignore',
  });
  return result.status === 0;
}

// PATH preflight only. Devin auth lives in a credentials file rather than the
// environment, so an authenticated shell and an unauthenticated one look
// identical here — `devin auth status` is the operator-facing check, not
// something this builder can meaningfully gate on.
function isDevinBinaryAvailable(env = process.env) {
  const result = spawnSync('/bin/sh', ['-c', 'command -v devin >/dev/null 2>&1'], {
    env,
    stdio: 'ignore',
  });
  return result.status === 0;
}

function isPiBinaryAvailable(env = process.env) {
  const result = spawnSync('/bin/sh', ['-c', 'command -v pi >/dev/null 2>&1'], {
    env,
    stdio: 'ignore',
  });
  return result.status === 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();
  const specFolder = validateNamespaceValue(ensureString(args, 'specFolder'), 'specFolder', inputError);
  const loopType = ensureString(args, 'loopType');
  assertActiveFanoutLoopType(loopType);
  // Optional shared research question, threaded into each lineage prompt so a research
  // fan-out can bind research_topic. Absent for review, which scopes by folder.
  const researchTopic = typeof args.researchTopic === 'string' && args.researchTopic.trim()
    ? args.researchTopic.trim()
    : null;
  const fanoutConfigJson = ensureString(args, 'fanoutConfigJson');
  const baseArtifactDir = validateBaseArtifactDir(ensureString(args, 'baseArtifactDir'), specFolder, loopType);
  const convergenceThreshold = parseOptionalNumber(args, 'convergenceThreshold');
  const lineageTimeoutHoursOverride = parseOptionalNumber(args, 'lineageTimeoutHours');
  assertLineageTimeoutHoursOverrideWithinCeiling(lineageTimeoutHoursOverride);
  const stopPolicy = normalizeStopPolicy(args.stopPolicy);

  const {
    parseFanoutConfig,
    expandLineages,
    preflightFanoutCapabilities,
    resolveSandboxMode,
    resolveClaudePermissionMode,
  } = await import('../lib/deep-loop/executor-config.ts');
  const { buildExecutorDispatchEnv, detectSameKindFromStack, CLI_DISPATCH_STACK_ENV } = await import('../lib/deep-loop/executor-audit.ts');
  const { snapshotOutOfScopeDirtyPaths, enforceWriteContainment } = await import('../lib/deep-loop/write-containment.ts');
  const {
    DEFAULT_LINEAGE_TIMESTAMP_TOLERANCE_MS,
    checkLineageTimestampWindow,
  } = await import('../lib/deep-loop/lineage-timestamp-window.ts');

  maybeThrowTestFault();

  let rawConfig;
  try {
    rawConfig = JSON.parse(fanoutConfigJson);
  } catch {
    throw inputError('fanoutConfigJson is not valid JSON');
  }

  const lineagesDir = path.join(baseArtifactDir, 'lineages');
  const ledgerPath = path.join(baseArtifactDir, 'orchestration-status.log');
  const summaryPath = path.join(baseArtifactDir, 'orchestration-summary.json');
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const parsedFanoutConfig = parseFanoutConfig(rawConfig);
  const rawGuardConfig = rawConfigWithCliBudgetOverrides(rawConfig, args);
  const stallWatchdogMs = normalizeStallWatchdogMs(rawGuardConfig);
  const lineageBudgetGuards = normalizeLineageBudgetGuards(rawGuardConfig);
  const guardedAssignment = applyFlatPoolAssignmentGuard(parsedFanoutConfig);
  const fanoutConfig = guardedAssignment.config;
  const allLineages = expandLineages(fanoutConfig);
  try {
    preflightFanoutCapabilities(allLineages);
  } catch (error) {
    throw inputError(error instanceof Error ? error.message : String(error));
  }

  // Aggregate budget is a SEPARATE ceiling from the per-lineage cap enforced inside the
  // worker below — both must pass, neither replaces the other. Checked upfront (before any
  // lineage spawns) because it is fully computable from static config, so failing fast here
  // avoids burning real subprocess time on a run that was already over budget at submission.
  const aggregateBudgetDecision = evaluateAggregateBudgetCap({
    lineages: allLineages,
    guards: rawGuardConfig,
    maxRetries: fanoutConfig.maxRetries,
  });
  if (!aggregateBudgetDecision.continue_allowed) {
    appendFanoutStatusLedger(ledgerPath, {
      event: 'aggregate_budget_cap_exceeded',
      at: new Date().toISOString(),
      run_id: runId,
      loop_type: loopType,
      spec_folder: specFolder,
      severity: 'error',
      stop_reasons: aggregateBudgetDecision.stop_reasons,
      upper_bound: aggregateBudgetDecision.upper_bound,
    });
    throw inputError(
      `fan-out aggregate budget exceeded: ${aggregateBudgetDecision.upper_bound.estimated_cost_units} > `
        + `${aggregateBudgetDecision.upper_bound.max_aggregate_cost_units} cost units across `
        + `${aggregateBudgetDecision.upper_bound.lineage_count} lineage(s)`,
    );
  }

  const progressHeartbeatMs = normalizeProgressHeartbeatMs(fanoutConfig.progressHeartbeatSeconds);
  const postExitGraceMs = normalizePostExitGraceMs(rawGuardConfig, progressHeartbeatMs);
  const slotIntervalMs = progressHeartbeatMs;

  logFlatPoolGuardRejections({
    rejections: guardedAssignment.rejections,
    ledgerPath,
    runId,
    loopType,
    specFolder,
  });

  // Fan-out pool owns every lineage kind. The old YAML-native branch dispatched the
  // LEAF review agent with a full-loop prompt, which is invalid; keep full-loop
  // ownership here so all lineages share the same retries and artifact validation.
  const cliLineages = allLineages;
  const checkpointPath = waitCheckpointPath(baseArtifactDir);
  const resumeWaiting = await resumeWaitingCheckpoint({
    checkpointPath,
    ledgerPath,
    runId,
    loopType,
    specFolder,
  });
  if (!resumeWaiting.didWait) {
    await persistPreDispatchWait({
      checkpointPath,
      ledgerPath,
      runId,
      loopType,
      specFolder,
      waitMs: args.preDispatchWaitMs,
    });
  }

  if (cliLineages.length === 0) {
    const summary = {
      total: 0,
      succeeded: 0,
      failed: 0,
      all_failed: false,
      gauges: { lag: 0, pending: 0, failed: 0 },
      convergence: { status: 'converged', reason: 'empty_tick', no_new_findings: true },
    };
    writeOrchestrationSummary(summaryPath, {
      run_id: runId,
      loop_type: loopType,
      spec_folder: specFolder,
      base_artifact_dir: baseArtifactDir,
      total_cli_lineages: 0,
      ...summary,
    });
    jsonOut({ status: 'ok', message: 'no CLI lineages to spawn', run_id: runId, results: [], summary });
    return;
  }

  fs.mkdirSync(lineagesDir, { recursive: true });
  const orphanedLineages = markOrphanedLineages(ledgerPath);
  const initialRetryCounts = readRetryCountsFromLedger(ledgerPath);

  const lineageSnapshots = new Map();
  const lineageSlotAccounting = new Map();
  const lineageProcessLiveness = new Map();
  let latestGauges = { lag: cliLineages.length, pending: cliLineages.length, failed: 0 };
  let stoppedSummaryWritten = false;

  const writeStoppedSummary = (signal) => {
    if (stoppedSummaryWritten) return;
    stoppedSummaryWritten = true;
    stopActiveLineageProcesses(signal);
    const stoppedAtIso = new Date().toISOString();
    const partial = summarizeSnapshots(cliLineages, lineageSnapshots);
    const gauges = {
      lag: latestGauges.lag,
      pending: latestGauges.pending,
      failed: Math.max(latestGauges.failed, partial.summary.failed),
    };
    appendFanoutStatusLedger(ledgerPath, {
      event: 'stopped',
      signal,
      at: stoppedAtIso,
      gauges,
    });
    writeOrchestrationSummary(summaryPath, {
      run_id: runId,
      loop_type: loopType,
      spec_folder: specFolder,
      base_artifact_dir: baseArtifactDir,
      total_cli_lineages: cliLineages.length,
      stopped: true,
      stopped_signal: signal,
      stopped_at_iso: stoppedAtIso,
      status: 'partial',
      ...partial.summary,
      gauges,
      results: partial.results,
    });
  };

  installFanoutSignalHandlers(writeStoppedSummary);

  const { results, summary } = await runCappedPool({
    items: cliLineages,
    concurrency: fanoutConfig.concurrency,
    maxRetries: fanoutConfig.maxRetries,
    lagCeilingMs: fanoutConfig.lagCeilingMs,
    postExitGraceMs,
    initialRetryCounts,
    getAttemptLiveness: (attempt) => lineageProcessLiveness.get(`${attempt.label}:${attempt.attempt}`) ?? { alive: true },
    onEvent: (event) => {
      const enrichedEvent = decorateSlotAccountingEvent(event, lineageSlotAccounting);
      updateLineageSnapshot(lineageSnapshots, enrichedEvent);
      if (enrichedEvent.gauges) latestGauges = enrichedEvent.gauges;
      appendFanoutStatusLedger(ledgerPath, enrichedEvent);
    },
    worker: async (lineage, context) => {
      const slotWindowStartIso = new Date().toISOString();
      const hrStart = process.hrtime();
      const attempt = Number.isFinite(Number(context.attempt)) ? Number(context.attempt) : 1;
      const livenessKey = `${lineage.label}:${attempt}`;
      const lineageDir = path.join(lineagesDir, lineage.label);
      const stateDir = path.join(lineageDir, '.executor-state');
      fs.mkdirSync(lineageDir, { recursive: true });
      fs.mkdirSync(stateDir, { recursive: true });

      const budgetDecision = evaluateLineageBudgetCap({
        lineage,
        guards: lineageBudgetGuards,
        maxRetries: fanoutConfig.maxRetries,
      });
      if (!budgetDecision.continue_allowed) {
        appendFanoutStatusLedger(ledgerPath, {
          event: 'budget_cap_exceeded',
          label: lineage.label,
          at: new Date().toISOString(),
          severity: 'error',
          stop_reasons: budgetDecision.stop_reasons,
          upper_bound: budgetDecision.upper_bound,
          gauges: latestGauges,
        });
        const failure = new Error(
          `lineage ${lineage.label} exceeds configured budget cap: `
            + `${budgetDecision.upper_bound.estimated_cost_units} > ${budgetDecision.upper_bound.max_cost_units_per_lineage} cost units`,
        );
        failure.label = lineage.label;
        failure.exitCode = null;
        failure.timedOut = false;
        failure.budgetCap = budgetDecision;
        throw failure;
      }

      const sessionId = `fanout-${lineage.label}-${runId}`;
      const prompt = buildLoopPrompt(loopType, specFolder, lineageDir, sessionId, lineage, researchTopic, {
        convergenceThreshold,
        stopPolicy,
      });

      // Sandbox resolution stays write-capable by default even for review lineages:
      // the review subprocess writes its own iteration artifacts (iterations/iteration-NNN.md,
      // deep-review-state.jsonl, review-report.md, resource-map.md) INTO lineageDir, so a
      // blanket read-only default would break those writes. The lineageDir-only write boundary
      // is enforced by the lineage prompt's explicit write-scope instruction (which also names the
      // repo tooling a weaker model must not run) rather than by a narrower sandbox; a path-scoped
      // workspace-write would be the stronger fix if the CLIs exposed one. Callers can still pass an
      // explicit sandboxMode to override.
      //
      // cli-opencode has no OS-level sandbox flag at all, so the generic workspace-write
      // default would silently ask it to honor a mode it can never enforce. An UNSPECIFIED
      // sandboxMode for this kind resolves to danger-full-access instead -- the only mode it
      // can honestly report as effective -- so ordinary dispatch proceeds normally. A caller
      // that EXPLICITLY asks for read-only/workspace-write still reaches finalizeLineageCommand
      // unmodified, where that genuine confinement request is rejected.
      const resolvedSandbox = lineage.kind === 'cli-opencode'
        && (lineage.sandboxMode === null || lineage.sandboxMode === undefined)
        ? 'danger-full-access'
        : resolveSandboxMode(lineage.sandboxMode);
      const resolvedPermission = resolveClaudePermissionMode(lineage.sandboxMode);

      const effectiveSandbox = resolvedSandbox;
      const effectivePermission = resolvedPermission;

      const { command, args: cmdArgs, input, effectiveConfig, invocationFingerprint } = buildLineageCommand(
        lineage,
        prompt,
        effectiveSandbox,
        effectivePermission,
        {
          loopType,
          specFolder,
          lineageDir,
          sessionId,
          convergenceThreshold,
          stopPolicy,
          researchTopic,
        },
      );

      // Persist invocation provenance before dispatch so the worker can read it.
      fs.writeFileSync(
        path.join(lineageDir, 'invocation-metadata.json'),
        JSON.stringify({ effectiveConfig, invocationFingerprint }) + '\n',
        'utf8',
      );

      // Advertise a per-replica state dir hint to the child via SPECKIT_<KIND>_STATE_DIR.
      // This is DETECTION-ONLY: the native CLIs read their own home env (OPENCODE_HOME /
      // OPENCODE_HOME / CLAUDE_CODE_HOME), not this var, so it does NOT relocate the
      // native lockfile. Real same-kind-replica isolation comes from each lineage's
      // unique artifact dir (lineage.label); remapping the CLI home to isolate the lock
      // is deliberately avoided here because relocating the home breaks credential/auth
      // lookup (the "Not logged in" failure the dispatch-env allowlist guards against).
      const stateEnvKey = SPECKIT_STATE_ENV_BY_KIND[lineage.kind];
      // Resolved once and reused below for write-containment attribution: a claude-code
      // lineage's own config dir (when it resolves inside the repo, e.g. a repo-local
      // `.claude*` directory) is a write location that kind legitimately touches outside
      // lineageDir, so containment must exclude it the same way it excludes sibling dirs.
      const resolvedClaudeConfigDir = lineage.kind === 'cli-claude-code' && lineage.configDir
        ? validateClaudeConfigDir(lineage.configDir)
        : null;
      const extraEnv = {
        SPECKIT_FANOUT_LINEAGE_ID: lineage.label,
        // A fan-out lineage is an orchestrated sub-session running an autonomous
        // workflow: it has no user turn to answer Gate 3, so the spec-gate must be
        // fully inert. ENFORCE=0 alone is NOT enough — that only stops the deny, while
        // the classify step still injects the Gate-3 question, which a cli-opencode
        // child then answers instead of doing its work. DISABLED makes both classify
        // and enforce no-ops; AI_SESSION_CHILD lets the worktree wrapper exec in place.
        // buildExecutorDispatchEnv filters these keys (outside the per-kind allowlist),
        // so they are re-injected here to reach the child. Harmless for the codex path.
        MK_SPEC_GATE_DISABLED: '1',
        AI_SESSION_CHILD: '1',
        ...(stateEnvKey ? { [stateEnvKey]: stateDir } : {}),
        ...(resolvedClaudeConfigDir ? { CLAUDE_CONFIG_DIR: resolvedClaudeConfigDir } : {}),
      };

      // Recursion guard (fail closed): the executor stack can already name the hosting
      // runtime before the first detached fan-out spawn. The lineage marker is added only
      // to a spawned seat, so both signals are required to prove that a seat is trying to
      // fan out its own executor kind again.
      const inheritedLineageId = process.env.SPECKIT_FANOUT_LINEAGE_ID;
      const isInsideFanoutLineage = typeof inheritedLineageId === 'string'
        && inheritedLineageId.trim() !== '';
      if (
        isInsideFanoutLineage
        && detectSameKindFromStack(process.env[CLI_DISPATCH_STACK_ENV], lineage.kind)
      ) {
        throw new Error(
          `recursive ${lineage.kind} dispatch blocked for lineage ${lineage.label}: ${lineage.kind} already on ${CLI_DISPATCH_STACK_ENV}`,
        );
      }

      // Stamp the dispatch stack with this lineage's executor kind so a seat that
      // tries to recursively launch the same kind is detectable by the runtime
      // recursion guard (detectSameKindFromStack reads SPECKIT_CLI_DISPATCH_STACK).
      // buildExecutorDispatchEnv filters the parent env to the per-kind allowlist,
      // so the SPECKIT_* lineage/state-dir keys are applied AFTER the filter to
      // preserve the per-replica lockfile isolation they provide.
      const dispatchEnv = { ...buildExecutorDispatchEnv(lineage, process.env), ...extraEnv };

      const timeoutMs = computeLineageTimeoutMs(lineage, lineageTimeoutHoursOverride);
      let lastLineageEventAtMs = Date.now();
      const markLineageEvent = () => {
        lastLineageEventAtMs = Date.now();
      };
      const stopStallWatchdog = startLineageStallWatchdog({
        thresholdMs: stallWatchdogMs,
        label: lineage.label,
        ledgerPath,
        getLastEventAtMs: () => lastLineageEventAtMs,
        getGauges: () => latestGauges,
      });

      const stopProgressHeartbeat = startLineageProgressHeartbeat({
        cadenceMs: progressHeartbeatMs,
        label: lineage.label,
        ledgerPath,
        getGauges: () => latestGauges,
      });

      // Every dispatch kind runs write-containment uniformly: a not-in-HEAD out-of-scope
      // path is preserved on disk and reported as a non-fatal advisory (never deleted),
      // and only an in-HEAD breach (git-recoverable via checkout HEAD) is fatal. That
      // makes monitoring every kind safe even for dispatch models whose CLI may
      // legitimately write outside lineageDir -- the guard can no longer destroy such a
      // write, only flag it.
      const containmentEnabled = true;
      // Sibling lineages run concurrently and write their own artifacts after this
      // leaf's baseline is captured. Those writes are indistinguishable from this
      // leaf's, so treating them as its violations reverts a sibling's legitimate
      // in-flight work — a completed lineage can be erased by an unrelated leaf
      // tripping containment. Exclude them from attribution; everything outside
      // both this leaf's dir and its siblings' stays guarded.
      const siblingLineageDirs = allLineages
        .filter((other) => other.label !== lineage.label)
        .map((other) => path.join(lineagesDir, other.label));
      // A dispatch kind's own known legitimate out-of-lineageDir write location (e.g. a
      // repo-local CLI config dir) is excluded from attribution the same way sibling
      // dirs are, so a legitimate write is never mistaken for a violation.
      const kindLegitimateDirs = resolvedClaudeConfigDir ? [resolvedClaudeConfigDir] : [];
      const containmentUnattributableDirs = [...siblingLineageDirs, ...kindLegitimateDirs];
      const preDispatchDirtyPaths = containmentEnabled
        ? snapshotOutOfScopeDirtyPaths({
          repoRoot: process.cwd(),
          artifactDir: lineageDir,
          unattributableDirs: containmentUnattributableDirs,
        })
        : [];

      let result;
      try {
        result = await runLineageProcess(command, cmdArgs, {
          cwd: process.cwd(),
          timeoutMs,
          env: dispatchEnv,
          maxBuffer: 20 * 1024 * 1024,
          abortSignal: context.signal,
          onOutput: markLineageEvent,
          onSpawn: ({ pid }) => {
            lineageProcessLiveness.set(livenessKey, { alive: true, pid });
          },
          onExit: ({ pid, exitedAtMs }) => {
            lineageProcessLiveness.set(livenessKey, { alive: false, pid, exitedAtMs });
          },
          ...(typeof input === 'string' ? { input } : {}),
        });
      } finally {
        stopProgressHeartbeat();
        stopStallWatchdog();
      }

      // Save subprocess stdout for salvage sweep (write failures in weak CLI executors).
      const logsDir = path.join(lineageDir, 'logs');
      fs.mkdirSync(logsDir, { recursive: true });
      const savedStdout = typeof result.stdout === 'string' ? result.stdout : '';
      fs.writeFileSync(path.join(logsDir, 'fanout-lineage.out'), savedStdout, 'utf8');

      // Recover missing iteration files from captured stdout when possible. Runs
      // BEFORE the failure throw below so iteration recovery is never lost.
      const salvage = runSalvageSweep(lineageDir, loopType, savedStdout);
      const slotAccounting = buildSlotAccounting(hrStart, slotIntervalMs);
      lineageSlotAccounting.set(lineage.label, slotAccounting);

      // Structural write-containment, uniform across every dispatch kind: diff the
      // working tree for NEW out-of-artifact-dir writes. An in-HEAD breach is
      // reverted from HEAD (git-recoverable) and fails the iteration fail-closed; a
      // not-in-HEAD path is preserved on disk and logged as a non-fatal advisory,
      // never deleted, since it may be a concurrent parent/sibling write this leaf
      // cannot be proven to own. The leaf must still be free to write its iteration
      // file/delta/state record inside lineageDir; only OUT-of-lineageDir writes are
      // violations. Fails open when the artifact dir is outside the git worktree
      // (hermetic test lineages).
      if (containmentEnabled) {
        const containment = enforceWriteContainment({
          repoRoot: process.cwd(),
          artifactDir: lineageDir,
          unattributableDirs: containmentUnattributableDirs,
          preDispatchDirtyPaths,
          iteration: attempt,
          label: lineage.label,
        });
        if (containment.advisories.length > 0) {
          appendFanoutStatusLedger(ledgerPath, {
            type: 'event',
            event: 'containment_advisory',
            severity: 'warning',
            at: new Date().toISOString(),
            label: lineage.label,
            run_id: runId,
            loop_type: loopType,
            spec_folder: specFolder,
            iteration: attempt,
            gauges: latestGauges,
            violations: containment.advisories.map((v) => ({ path: v.path, kind: v.kind, status: v.status })),
            reverted: containment.revertResult.reverted.filter((r) => r.action === 'preserved_untracked'),
          });
        }
        if (containment.violations.length > 0) {
          if (containment.event) {
            appendFanoutStatusLedger(ledgerPath, {
              ...containment.event,
              at: new Date().toISOString(),
              label: lineage.label,
              run_id: runId,
              loop_type: loopType,
              spec_folder: specFolder,
              gauges: latestGauges,
            });
          }
          const failure = new Error(
            `lineage ${lineage.label} violated write containment: reverted `
              + `${containment.violations.length} out-of-scope path(s): `
              + `${containment.violations.map((v) => v.path).join(', ')}`,
          );
          failure.label = lineage.label;
          failure.exitCode = 1;
          failure.timedOut = false;
          failure.containmentViolation = containment.violations;
          failure.salvage = salvage;
          throw failure;
        }
      }

      const exitCode = result.status ?? (result.error ? 1 : 0);
      const timedOut = result.signal === 'SIGTERM';
      // Any signal-kill is abnormal, not just the orchestrator's own SIGTERM timeout — a
      // stall-watchdog / lag-ceiling abort or an external SIGKILL leaves result.status null,
      // so exitCode computes to 0 and the lineage would otherwise be masked as success.
      const killedBySignal = result.signal != null;
      const missingArtifacts = findMissingLineageArtifacts(loopType, lineageDir);
      const stateRead = readLineageStateRecords(loopType, lineageDir);
      const stopPolicyViolation = findMaxIterationsPolicyViolation({
        loopType,
        stateRead,
        lineage,
        stopPolicy,
        lineageDir,
      });

      // A lineage whose CLI exits non-zero or is killed by the timeout is a FAILURE,
      // not a success. Throw so the pool settles this item as rejected and counts it
      // in summary.failed/all_failed, which drives the process exit code. Returning a
      // plain object here would let the pool record any completed worker as fulfilled
      // regardless of the underlying CLI exit, masking failed/timed-out lineages.
      //
      // Pi is the exception: it returns a non-zero exit code non-deterministically even
      // on a successful dispatch (identical unauthenticated runs returned 0 then 1), so
      // for cli-pi a non-zero exit is not a failure signal. The artifact validation below
      // is its success gate instead — a genuinely failed pi run produces no artifact and
      // is rejected there. Timeouts and signal kills remain real failures for every kind.
      const exitCodeIsFailure = exitCode !== 0 && lineage.kind !== 'cli-pi';
      if (timedOut || killedBySignal || exitCodeIsFailure) {
        const reason = timedOut
          ? 'timed out'
          : killedBySignal
            ? `killed by signal ${result.signal}`
            : `exited with code ${exitCode}`;
        const failure = new Error(`lineage ${lineage.label} ${reason}`);
        failure.label = lineage.label;
        failure.exitCode = exitCode;
        failure.timedOut = timedOut;
        failure.killedBySignal = killedBySignal;
        failure.salvage = salvage;
        throw failure;
      }

      if (missingArtifacts.length > 0) {
        const failure = new Error(
          `lineage ${lineage.label} exited 0 but did not produce expected artifact: ${missingArtifacts.join(', ')}`,
        );
        failure.label = lineage.label;
        failure.exitCode = exitCode;
        failure.timedOut = false;
        failure.salvage = { salvaged: salvage.salvaged, failed: Math.max(1, salvage.failed) };
        failure.missingArtifacts = missingArtifacts;
        throw failure;
      }

      if (stopPolicyViolation) {
        const failure = new Error(
          `lineage ${lineage.label} violated max-iterations stop policy: ${stopPolicyViolation}`,
        );
        failure.label = lineage.label;
        failure.exitCode = exitCode;
        failure.timedOut = false;
        failure.salvage = salvage;
        failure.stopPolicyViolation = stopPolicyViolation;
        throw failure;
      }

      // An exit-0 lineage whose salvage sweep could not recover every iteration
      // markdown is NOT fulfilled, even when the top-level report exists. Returning
      // here would let a lineage with a fanout_salvage_failed marker pass as complete,
      // dropping durable per-iteration evidence from merge/synthesis. Throw so the
      // pool retries it (the classifier maps salvage.failed > 0 to artifact_miss).
      if (salvage && salvage.failed > 0) {
        const failure = new Error(
          `lineage ${lineage.label} exited 0 but ${salvage.failed} iteration markdown file(s) were unrecoverable`,
        );
        failure.label = lineage.label;
        failure.exitCode = exitCode;
        failure.timedOut = false;
        failure.salvage = { salvaged: salvage.salvaged, failed: salvage.failed };
        failure.missingArtifacts = [];
        throw failure;
      }

      const output = { label: lineage.label, exitCode, timedOut, salvage, ...slotAccounting };
      if (stateRead.statePath && !stateRead.missing && !stateRead.parseError) {
        const slotWindowEndIso = new Date().toISOString();
        try {
          const timestampCheck = checkLineageTimestampWindow(stateRead.records, {
            windowStart: slotWindowStartIso,
            windowEnd: slotWindowEndIso,
            toleranceMs: DEFAULT_LINEAGE_TIMESTAMP_TOLERANCE_MS,
          });
          if (timestampCheck.anomalous > 0) {
            const timestampAnomaly = buildTimestampAnomalyPayload({
              lineage,
              statePath: stateRead.statePath,
              check: timestampCheck,
            });
            appendFanoutStatusLedger(ledgerPath, {
              event: 'timestamp_anomaly',
              status: 'warning',
              severity: 'warning',
              label: lineage.label,
              at: new Date().toISOString(),
              ...timestampAnomaly,
            });
            output.timestamp_anomaly = timestampAnomaly;
          }
        } catch {
          // Timestamp telemetry is advisory and cannot affect lineage fulfillment.
        }
      }

      return output;
    },
  });

  const timestampAnomalies = collectTimestampAnomalies(results);
  const finalSummary = timestampAnomalies.length > 0
    ? { ...summary, timestamp_anomalies: timestampAnomalies }
    : summary;

  writeOrchestrationSummary(summaryPath, {
    run_id: runId,
    loop_type: loopType,
    spec_folder: specFolder,
    base_artifact_dir: baseArtifactDir,
    total_cli_lineages: cliLineages.length,
    orphaned_lineages: orphanedLineages,
    ...finalSummary,
  });

  const exitCode = finalSummary.all_failed ? 3 : finalSummary.failed > 0 ? 2 : 0;
  jsonOut({ status: exitCode === 0 ? 'ok' : 'partial', run_id: runId, results, summary: finalSummary });
  process.exit(exitCode);
}

if (require.main === module && isTsxLoaded) {
  main().catch((err) => {
    const code = classifyExitCode(err);
    jsonOut({
      status: 'error',
      error: err instanceof Error ? err.message : String(err),
      code: err && err.code ? err.code : 'SCRIPT_ERROR',
    });
    if (code === 1) {
      process.stderr.write(
        JSON.stringify({ error: err instanceof Error ? err.message : String(err), stack: err && err.stack }) + '\n',
      );
    }
    process.exit(code);
  });
}

module.exports = {
  DEVIN_ALLOWED_MODELS,
  DEVIN_DEFAULT_MODEL,
  CURSOR_ALLOWED_MODELS,
  CURSOR_DEFAULT_MODEL,
  PI_ALLOWED_MODELS,
  PI_DEFAULT_MODEL,
  buildLineageCommand,
  buildInvocationFingerprintPayload,
  isCodexBinaryAvailable,
  isCursorBinaryAvailable,
  isDevinBinaryAvailable,
  isPiBinaryAvailable,
  buildLoopPrompt,
  findMaxIterationsPolicyViolation,
  isMaxIterationsStopReason,
  computeLineageTimeoutMs,
  assertLineageTimeoutHoursOverrideWithinCeiling,
  computeLineageBudgetUpperBound,
  evaluateLineageBudgetCap,
  computeAggregateBudgetUpperBound,
  evaluateAggregateBudgetCap,
  normalizeAggregateBudgetGuards,
  normalizeProgressHeartbeatMs,
  normalizePostExitGraceMs,
  normalizeLineageBudgetGuards,
  normalizeStallWatchdogMs,
  computeSkippedCount,
  decorateSlotAccountingEvent,
  startLineageProgressHeartbeat,
  startLineageStallWatchdog,
  statusForLedgerEvent,
  updateLineageSnapshot,
  applyFlatPoolAssignmentGuard,
};
