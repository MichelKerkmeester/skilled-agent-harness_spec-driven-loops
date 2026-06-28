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
const { spawn } = require('node:child_process');

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

if (!isTsxLoaded) {
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

// Per-kind first state-dir env var (used for lockfile isolation across same-kind replicas).
const SPECKIT_STATE_ENV_BY_KIND = {
  'cli-codex': 'SPECKIT_CODEX_STATE_DIR',
  'cli-claude-code': 'SPECKIT_CLAUDE_CODE_STATE_DIR',
  'cli-opencode': 'SPECKIT_OPENCODE_STATE_DIR',
};

const activeLineageProcesses = new Set();
const WAIT_CHECKPOINT_FILENAME = 'orchestration-wait-checkpoint.json';
const WAIT_CHECKPOINT_SCHEMA_VERSION = 1;
const WAIT_SLEEP_CHUNK_MS = 200;
const OBSERVABILITY_EVENTS_FILENAME = 'observability-events.jsonl';

function stopActiveLineageProcesses(signal) {
  for (const child of activeLineageProcesses) {
    child.kill(signal);
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

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
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
 * The subprocess reads this, loads the skill, and runs the loop to convergence
 * with config.fanout_lineage_artifact_dir overriding step_resolve_artifact_root.
 */
function buildLoopPrompt(loopType, specFolder, lineageDir, sessionId, lineage, researchTopic) {
  const skillFile =
    loopType === 'review'
      ? '.opencode/skills/deep-loop-workflows/deep-review/SKILL.md'
      : loopType === 'context'
        ? '.opencode/skills/deep-loop-workflows/deep-context/SKILL.md'
        : '.opencode/skills/deep-loop-workflows/deep-research/SKILL.md';
  const agentName = loopType === 'review' ? 'deep-review' : loopType === 'context' ? 'deep-context' : 'deep-research';
  const hasIterationCap = typeof lineage.iterations === 'number' && lineage.iterations > 0;
  const stopClause = hasIterationCap
    ? 'to convergence OR config.maxIterations, whichever comes first'
    : 'to convergence';
  const params = [
    `  spec_folder: ${specFolder}`,
    `  config.fanout_lineage_artifact_dir: ${lineageDir}`,
    `  session_id: ${sessionId}`,
    `  executor: ${lineage.kind} model=${lineage.model || 'default'}`,
    `  loop_type: ${loopType}`,
  ];
  if (researchTopic) {
    // A research lineage's phase_init binds research_topic from this line. Without it a
    // fan-out research loop has no question to investigate and degrades to an empty topic.
    // Review and context loops scope by spec_folder and intentionally pass no topic.
    params.push(`  research_topic: ${researchTopic}`);
  }
  if (hasIterationCap) {
    params.push(`  config.maxIterations: ${lineage.iterations}`);
  }
  return [
    `You are a ${agentName} agent running a fan-out lineage.`,
    ``,
    `Read ${skillFile} and execute the ${loopType} loop with these parameters:`,
    ...params,
    ``,
    `The step_resolve_artifact_root step will bind artifact_dir to ${lineageDir} via the`,
    `config.fanout_lineage_artifact_dir override — do NOT run the resolveArtifactRoot node`,
    `command; bind artifact_dir directly to the override value.`,
    ``,
    `Run phase_init, phase_main_loop (${stopClause}), and phase_synthesis.`,
    `Write all outputs to ${lineageDir}. Do not touch any path outside ${lineageDir}.`,
    ``,
    `When complete, output a single line: FANOUT_LINEAGE_COMPLETE:${lineage.label}`,
  ].join('\n');
}

/**
 * Compute a generous timeout for a full lineage loop run.
 * A single iteration is timeoutSeconds; a full loop is up to iterations * timeoutSeconds.
 * We double it for safety and cap at 4 hours.
 */
function computeLineageTimeoutMs(lineage) {
  const iters = lineage.iterations || 12;
  const perIterSecs = lineage.timeoutSeconds || 900;
  return Math.min(iters * perIterSecs * 2 * 1000, 4 * 60 * 60 * 1000);
}

function normalizeProgressHeartbeatMs(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.max(1, Math.floor(value * 1000));
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

function startLineageProgressHeartbeat({ cadenceMs, label, ledgerPath, getGauges }) {
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
  }, cadenceMs);
  timer.unref?.();
  return () => clearInterval(timer);
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
      });
    } catch (error) {
      resolvePromise({ status: null, signal: null, stdout: '', error });
      return;
    }
    activeLineageProcesses.add(child);

    let stdout = '';
    let stdoutBytes = 0;
    let truncated = false;
    let timedOut = false;
    let settled = false;
    let spawnError;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGTERM');
    }, timeoutMs);

    child.stdout?.setEncoding('utf8');
    child.stdout?.on('data', (chunk) => {
      if (truncated) return;
      stdoutBytes += Buffer.byteLength(chunk, 'utf8');
      if (stdoutBytes > maxBuffer) {
        truncated = true;
        child.kill('SIGTERM');
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
      const effectiveSignal = timedOut ? 'SIGTERM' : signal;
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

/**
 * Build the subprocess command for a CLI lineage.
 * Returns { command, args, input?, env } where input is stdin content when applicable.
 */
function buildLineageCommand(lineage, prompt, resolvedSandbox, resolvedPermission) {
  const kind = lineage.kind;

  if (kind === 'cli-codex') {
    // Only emit -c service_tier when a validated tier is set; otherwise omit the
    // pair so the Codex CLI applies its own account default. Substituting the
    // literal 'default' would push a value outside the validated tier enum.
    const args = [
      'exec',
      '--model',
      lineage.model || 'o4-mini',
      '-c',
      `model_reasoning_effort=${lineage.reasoningEffort || 'medium'}`,
    ];
    if (lineage.serviceTier) {
      args.push('-c', `service_tier=${lineage.serviceTier}`);
    }
    args.push('-c', 'approval_policy=never', '--sandbox', resolvedSandbox, '-');
    return {
      command: 'codex',
      args,
      input: prompt,
    };
  }

  if (kind === 'cli-claude-code') {
    const args = [
      '-p',
      prompt,
      '--model',
      lineage.model || 'claude-opus-4-8',
      '--permission-mode',
      resolvedPermission,
      '--output-format',
      'text',
    ];
    if (lineage.reasoningEffort) {
      args.push('--effort', lineage.reasoningEffort);
    }
    return { command: 'claude', args };
  }

  if (kind === 'cli-opencode') {
    // No --agent: current opencode treats `general` as a subagent and rejects it
    // on a top-level `run`. The default agent runs when none is named, and a
    // specific agent profile can be requested in the prompt body instead.
    const args = [
      'run',
      '--model',
      lineage.model || 'anthropic/claude-opus-4-8',
      '--format',
      'json',
      '--dangerously-skip-permissions',
      '--pure',
    ];
    if (lineage.reasoningEffort) {
      args.push('--variant', lineage.reasoningEffort);
    }
    args.push(prompt);
    return { command: 'opencode', args, input: '' };
  }

  throw inputError(`Unknown CLI executor kind: ${kind}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs();
  const specFolder = validateNamespaceValue(ensureString(args, 'specFolder'), 'specFolder', inputError);
  const loopType = ensureString(args, 'loopType');
  if (loopType !== 'research' && loopType !== 'review' && loopType !== 'context') {
    throw inputError('loopType must be "research", "review", or "context"');
  }
  // Optional shared research question, threaded into each lineage prompt so a research
  // fan-out can bind research_topic. Absent for review/context, which scope by folder.
  const researchTopic = typeof args.researchTopic === 'string' && args.researchTopic.trim()
    ? args.researchTopic.trim()
    : null;
  const fanoutConfigJson = ensureString(args, 'fanoutConfigJson');
  const baseArtifactDir = ensureString(args, 'baseArtifactDir');
  // Defense-in-depth: baseArtifactDir is host-provided, but reject path-traversal
  // segments so a malformed value cannot relocate fanout artifacts outside its tree.
  if (baseArtifactDir.split(/[\\/]/).includes('..')) {
    throw inputError('baseArtifactDir must not contain ".." path segments');
  }

  const {
    parseFanoutConfig,
    expandLineages,
    resolveCodexSandboxMode,
    resolveClaudePermissionMode,
  } = await import('../lib/deep-loop/executor-config.ts');
  const { buildExecutorDispatchEnv, detectSameKindFromStack, CLI_DISPATCH_STACK_ENV } = await import('../lib/deep-loop/executor-audit.ts');

  maybeThrowTestFault();

  let rawConfig;
  try {
    rawConfig = JSON.parse(fanoutConfigJson);
  } catch {
    throw inputError('fanoutConfigJson is not valid JSON');
  }

  const fanoutConfig = parseFanoutConfig(rawConfig);
  const allLineages = expandLineages(fanoutConfig);
  const progressHeartbeatMs = normalizeProgressHeartbeatMs(fanoutConfig.progressHeartbeatSeconds);
  const slotIntervalMs = progressHeartbeatMs;

  // Fan-out pool handles CLI lineages only; native lineages are dispatched by the YAML step.
  const cliLineages = allLineages.filter((l) => l.kind !== 'native');
  const lineagesDir = path.join(baseArtifactDir, 'lineages');
  const ledgerPath = path.join(baseArtifactDir, 'orchestration-status.log');
  const summaryPath = path.join(baseArtifactDir, 'orchestration-summary.json');
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
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
    initialRetryCounts,
    onEvent: (event) => {
      const enrichedEvent = decorateSlotAccountingEvent(event, lineageSlotAccounting);
      updateLineageSnapshot(lineageSnapshots, enrichedEvent);
      if (enrichedEvent.gauges) latestGauges = enrichedEvent.gauges;
      appendFanoutStatusLedger(ledgerPath, enrichedEvent);
    },
    worker: async (lineage) => {
      const hrStart = process.hrtime();
      const lineageDir = path.join(lineagesDir, lineage.label);
      const stateDir = path.join(lineageDir, '.executor-state');
      fs.mkdirSync(lineageDir, { recursive: true });
      fs.mkdirSync(stateDir, { recursive: true });

      const sessionId = `fanout-${lineage.label}-${runId}`;
      const prompt = buildLoopPrompt(loopType, specFolder, lineageDir, sessionId, lineage, researchTopic);

      // Sandbox resolution stays write-capable by default even for review lineages:
      // the review subprocess writes its own iteration artifacts (iterations/iteration-NNN.md,
      // deep-review-state.jsonl, review-report.md, resource-map.md) INTO lineageDir, so a
      // blanket read-only default would break those writes. The lineageDir-only write boundary
      // is enforced by the prompt ('Do not touch any path outside lineageDir') rather than by a
      // narrower sandbox; a path-scoped workspace-write would be the stronger fix if the CLIs
      // exposed one. Callers can still pass an explicit sandboxMode to override.
      const resolvedSandbox = resolveCodexSandboxMode(lineage.sandboxMode);
      const resolvedPermission = resolveClaudePermissionMode(lineage.sandboxMode);

      const effectiveSandbox = resolvedSandbox;
      const effectivePermission = resolvedPermission;

      const { command, args: cmdArgs, input } = buildLineageCommand(
        lineage,
        prompt,
        effectiveSandbox,
        effectivePermission,
      );

      // Advertise a per-replica state dir hint to the child via SPECKIT_<KIND>_STATE_DIR.
      // This is DETECTION-ONLY: the native CLIs read their own home env (CODEX_HOME /
      // OPENCODE_HOME / CLAUDE_CODE_HOME), not this var, so it does NOT relocate the
      // native lockfile. Real same-kind-replica isolation comes from each lineage's
      // unique artifact dir (lineage.label); remapping the CLI home to isolate the lock
      // is deliberately avoided here because relocating the home breaks credential/auth
      // lookup (the "Not logged in" failure the dispatch-env allowlist guards against).
      const stateEnvKey = SPECKIT_STATE_ENV_BY_KIND[lineage.kind];
      const extraEnv = {
        SPECKIT_FANOUT_LINEAGE_ID: lineage.label,
        ...(stateEnvKey ? { [stateEnvKey]: stateDir } : {}),
        ...(lineage.kind === 'cli-claude-code' && lineage.configDir
          ? { CLAUDE_CONFIG_DIR: expandHomeDir(lineage.configDir) }
          : {}),
      };

      // Recursion guard (fail closed): refuse to spawn when this executor kind is
      // already on the INHERITED dispatch stack — i.e. a seat that itself runs the loop
      // tried to fan out the SAME kind again. Only the stack layer is checked here: the
      // orchestrator legitimately runs inside one of these runtimes, so the runtime-env
      // (e.g. OPENCODE_SESSION_ID) and ancestry layers would false-positive on the
      // first-level dispatch. The stack is empty at top level and only carries a kind
      // once a parent fanout stamped it via buildExecutorDispatchEnv for its child.
      if (detectSameKindFromStack(process.env[CLI_DISPATCH_STACK_ENV], lineage.kind)) {
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

      const timeoutMs = computeLineageTimeoutMs(lineage);

      const stopProgressHeartbeat = startLineageProgressHeartbeat({
        cadenceMs: progressHeartbeatMs,
        label: lineage.label,
        ledgerPath,
        getGauges: () => latestGauges,
      });
      let result;
      try {
        result = await runLineageProcess(command, cmdArgs, {
          cwd: process.cwd(),
          timeoutMs,
          env: dispatchEnv,
          maxBuffer: 20 * 1024 * 1024,
          ...(typeof input === 'string' ? { input } : {}),
        });
      } finally {
        stopProgressHeartbeat();
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

      const exitCode = result.status ?? (result.error ? 1 : 0);
      const timedOut = result.signal === 'SIGTERM';

      // A lineage whose CLI exits non-zero or is killed by the timeout is a FAILURE,
      // not a success. Throw so the pool settles this item as rejected and counts it
      // in summary.failed/all_failed, which drives the process exit code. Returning a
      // plain object here would let the pool record any completed worker as fulfilled
      // regardless of the underlying CLI exit, masking failed/timed-out lineages.
      if (timedOut || exitCode !== 0) {
        const failure = new Error(
          `lineage ${lineage.label} ${timedOut ? 'timed out' : `exited with code ${exitCode}`}`,
        );
        failure.label = lineage.label;
        failure.exitCode = exitCode;
        failure.timedOut = timedOut;
        failure.salvage = salvage;
        throw failure;
      }

      return { label: lineage.label, exitCode, timedOut, salvage, ...slotAccounting };
    },
  });

  writeOrchestrationSummary(summaryPath, {
    run_id: runId,
    loop_type: loopType,
    spec_folder: specFolder,
    base_artifact_dir: baseArtifactDir,
    total_cli_lineages: cliLineages.length,
    orphaned_lineages: orphanedLineages,
    ...summary,
  });

  const exitCode = summary.all_failed ? 3 : summary.failed > 0 ? 2 : 0;
  jsonOut({ status: exitCode === 0 ? 'ok' : 'partial', run_id: runId, results, summary });
  process.exit(exitCode);
}

if (isTsxLoaded) {
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
  buildLineageCommand,
  buildLoopPrompt,
  normalizeProgressHeartbeatMs,
  computeSkippedCount,
  decorateSlotAccountingEvent,
  startLineageProgressHeartbeat,
  updateLineageSnapshot,
};
