#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────────
// MODULE: Fan-Out Lineage Pool Runner
// ───────────────────────────────────────────────────────────────────

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');
const { createHash } = require('node:crypto');

const { resolveOpencodeBinary } = require('./opencode-version.cjs');
const { STOP_REASONS } = require('../lib/deep-loop/lifecycle-taxonomy.cjs');

const {
  classifyExitCode,
  detectPendingQuestion,
  detectQuotaExhaustion,
  assertKnownFlags,
  maybeThrowTestFault,
  validateNamespaceValue,
} = require('./lib/cli-guards.cjs');

const FANOUT_FLAGS = [
  'specFolder', 'loopType', 'researchTopic', 'reviewFocus', 'reviewTarget', 'reviewTargetType', 'fanoutConfigJson', 'baseArtifactDir',
  'researchTopicFile', 'reviewFocusFile', 'reviewTargetFile', 'fanoutConfigJsonFile',
  'convergenceThreshold', 'lineageTimeoutHours', 'stopPolicy', 'convergenceMode', 'depthMode', 'containmentMode',
  'preDispatchWaitMs', 'stallWatchdogMs', 'maxCostUnitsPerLineage',
  'maxAggregateCostUnits', 'maxTokensPerLineage', 'maxTokenBudget', 'maxTokenBudgetPerLineage',
  'costUnitsPerIteration', 'estimatedTokensPerIteration', 'onlyLineage', 'preview', 'status',
  'stop', 'maxIterations',
];

const {
  runCappedPool,
  appendStatusLedger,
  detectLiveLineages,
  isLineageAlive,
  markOrphanedLineages,
  readLedgerRecords,
  readRetryCountsFromLedger,
  createWavePlannerInterface,
  writeOrchestrationSummary,
  CONTAINMENT_ADVISORY_STATUS,
} = require('./fanout-pool.cjs');

const {
  runSalvageSweep,
  extractTextFromOpencodeJson,
  readLineageProviderCostUsd,
  readLineagePassSummary,
  summarizeProviderCost,
} = require('./fanout-salvage.cjs');

const {
  appendObservabilityEvent,
} = require('../lib/deep-loop/observability-events.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. TSX BOOTSTRAP
// ─────────────────────────────────────────────────────────────────────────────

const TSX_LOADER = require.resolve('tsx');
const isTsxLoaded = process.env.DEEP_LOOP_TSX_LOADED === '1';
// A hangup is how a closed terminal or a dropped SSH session ends the run, so it is
// forwarded beside the two signals an operator sends by hand.
const FORWARDED_SIGNALS = ['SIGINT', 'SIGTERM', 'SIGHUP'];
// The bootstrap parent as the child first saw it. Read at load, before main() spends
// seconds on imports, so a parent that dies during them is still noticed.
const BOOTSTRAP_PARENT_PID = isTsxLoaded ? process.ppid : null;

function runTsxBootstrap() {
  const child = spawn(
    process.execPath,
    ['--import', TSX_LOADER, __filename, ...process.argv.slice(2)],
    {
      cwd: process.cwd(),
      env: require('./runtime-bootstrap.cjs').tsxChildEnv({ DEEP_LOOP_TSX_LOADED: '1' }),
      stdio: [process.stdin.isTTY ? 'ignore' : 'pipe', 'pipe', 'pipe'],
    },
  );

  if (!process.stdin.isTTY && child.stdin) {
    child.stdin.on('error', () => {});
    process.stdin.pipe(child.stdin);
  }

  child.stdout?.pipe(process.stdout);
  child.stderr?.pipe(process.stderr);

  for (const signal of FORWARDED_SIGNALS) {
    process.once(signal, () => {
      child.kill(signal);
    });
  }

  child.on('close', (status, signal) => {
    if (status !== null) {
      process.exit(status);
    }
    process.exit(FORWARDED_SIGNALS.includes(signal) ? signalExitCode(signal) : 1);
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
  assertKnownFlags(args, FANOUT_FLAGS, inputError);
  return args;
}

// Each file flag carries the same text as its inline flag. A workflow writes that
// text with its file tool and passes the path, because inside a shell argument a backtick,
// $() or quote in the text is expanded or ends the argument before this script reads it.
const TEXT_FILE_FLAGS = Object.freeze({
  researchTopicFile: 'researchTopic',
  reviewFocusFile: 'reviewFocus',
  reviewTargetFile: 'reviewTarget',
  fanoutConfigJsonFile: 'fanoutConfigJson',
});

/**
 * Replace each file flag with the text its file holds.
 *
 * The text lands under the inline flag's key, so both paths share one normalization.
 *
 * @param {Record<string, unknown>} args - The parsed argv.
 * @returns {Record<string, unknown>} The argv with every file flag read into its text flag.
 */
function readTextFileFlags(args) {
  const resolved = { ...args };
  for (const [fileKey, textKey] of Object.entries(TEXT_FILE_FLAGS)) {
    if (resolved[fileKey] === undefined) continue;
    if (typeof resolved[fileKey] !== 'string') {
      throw inputError(`${fileKey} must be a file path`);
    }
    if (resolved[textKey] !== undefined) {
      throw inputError(`pass ${textKey} inline or from a file, not both`);
    }
    try {
      resolved[textKey] = fs.readFileSync(resolved[fileKey], 'utf8');
    } catch (error) {
      throw inputError(`cannot read ${fileKey} ${resolved[fileKey]}: ${error instanceof Error ? error.message : String(error)}`);
    }
    delete resolved[fileKey];
  }
  return resolved;
}

function inputError(message) {
  const err = new Error(message);
  err.code = 'INPUT_VALIDATION';
  return err;
}

function agentPersonaBlock(agentName, repoRoot) {
  const personaPath = path.join(repoRoot, '.skilled', 'agents', `${agentName}.md`);
  let persona;
  try {
    persona = fs.readFileSync(personaPath, 'utf8');
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      throw inputError(`Agent persona file not found: ${personaPath}`);
    }
    throw err;
  }

  return [
    `=== BEGIN AGENT PERSONA (resolved runtime path: .skilled/agents/${agentName}.md) ===`,
    persona.trimEnd(),
    `=== END AGENT PERSONA (resolved persona: ${agentName}) ===`,
    `You are dispatched AS the @${agentName} agent defined above. Obey its role, tool-scope, verification gates, and output contract.`,
  ].join('\n');
}

function withAgentPersona(agentName, prompt, repoRoot) {
  return `${agentPersonaBlock(agentName, repoRoot)}\n\n${prompt}`;
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

const REVIEW_FOCUS_MAX_LENGTH = 1000;
// C0 and C1 controls, DEL, and the Unicode line and paragraph separators. Each would
// split a one-line setup binding into a second line.
const REVIEW_FOCUS_CONTROL_PATTERN = /[\u0000-\u001F\u007F-\u009F\u2028\u2029]/g;

/**
 * Normalize the operator's optional review focus into one bounded line.
 *
 * The focus travels as a single `review_focus:` setup binding in every lineage prompt, so a
 * control character would end that binding early and let the rest read as new instructions.
 *
 * @param {unknown} raw - The `--review-focus` value as parsed from argv.
 * @returns {string|null} The single-line focus text, or null when no focus was given.
 */
function normalizeReviewFocus(raw) {
  if (raw === undefined || raw === null || raw === false || raw === '') {
    return null;
  }
  if (typeof raw !== 'string') {
    throw inputError('reviewFocus must be a text value');
  }
  const focus = raw.replace(REVIEW_FOCUS_CONTROL_PATTERN, ' ').replace(/\s+/g, ' ').trim();
  if (focus === '') {
    return null;
  }
  if (focus.length > REVIEW_FOCUS_MAX_LENGTH) {
    throw inputError(`reviewFocus must be at most ${REVIEW_FOCUS_MAX_LENGTH} characters, got ${focus.length}`);
  }
  return focus;
}

const REVIEW_TARGET_TYPES = Object.freeze(['spec-folder', 'skill', 'agent', 'track', 'files']);

/**
 * Resolve the review target every lineage is bound to.
 *
 * A review can audit something other than its own packet. Without an explicit target each
 * lineage is told to review the spec folder, whatever the operator asked for.
 *
 * @param {unknown} rawTarget - The `--review-target` value as parsed from argv.
 * @param {unknown} rawType - The `--review-target-type` value as parsed from argv.
 * @param {string} specFolder - The packet that owns the run, and the default target.
 * @returns {{target:string,type:string}} The single-line target and its type.
 */
function resolveReviewTarget(rawTarget, rawType, specFolder) {
  if (rawTarget !== undefined && rawTarget !== null && rawTarget !== false && typeof rawTarget !== 'string') {
    throw inputError('reviewTarget must be a text value');
  }
  const target = typeof rawTarget === 'string'
    ? rawTarget.replace(REVIEW_FOCUS_CONTROL_PATTERN, ' ').replace(/\s+/g, ' ').trim()
    : '';
  if (target.length > REVIEW_FOCUS_MAX_LENGTH) {
    throw inputError(`reviewTarget must be at most ${REVIEW_FOCUS_MAX_LENGTH} characters, got ${target.length}`);
  }
  const type = typeof rawType === 'string' ? rawType.trim() : '';
  if (type && !REVIEW_TARGET_TYPES.includes(type)) {
    throw inputError(`reviewTargetType must be one of ${REVIEW_TARGET_TYPES.join(', ')}, got ${type}`);
  }
  if (!target || target === specFolder) {
    return { target: specFolder, type: type || 'spec-folder' };
  }
  return { target, type: type || 'files' };
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

// The command surface documents --convergence-mode, but a fan-out lineage had no
// way to carry it: the runner never read the flag, so every lineage silently took
// the default while the caller believed convergence was disabled. Only the stop
// policy reached the leaf, which happens to produce the same no-early-stop
// behaviour and hid the gap.
function normalizeConvergenceMode(raw) {
  if (raw === undefined || raw === false || raw === null || raw === '') {
    return null;
  }
  const allowed = ['default', 'off', 'sliding-window', 'divergent'];
  if (raw === true || typeof raw !== 'string' || !allowed.includes(raw)) {
    throw inputError(`convergenceMode must be one of: ${allowed.join(', ')}`);
  }
  return raw;
}

function normalizeDepthMode(raw) {
  if (raw === undefined || raw === false || raw === null || raw === '' || raw === 'default') return null;
  if (raw !== 'expansive') throw inputError('depthMode must be one of: default, expansive');
  return raw;
}

// Open depth-1 nodes are dealt round-robin in node-id order, so the same seed
// always gives each lineage the same share and the merge guard can check it.
function partitionFrontierNodes(baseArtifactDir, labels) {
  const { readNodeStore } = require('./frontier-admit.cjs');
  const nodes = [...readNodeStore(path.join(baseArtifactDir, 'frontier-nodes.jsonl')).values()]
    .filter((node) => node.depth === 1 && (node.status === 'open' || node.status === 'active'))
    .sort((left, right) => (left.nodeId < right.nodeId ? -1 : left.nodeId > right.nodeId ? 1 : 0));
  const partition = Object.fromEntries(labels.map((label) => [label, []]));
  nodes.forEach((node, index) => { partition[labels[index % labels.length]].push(node); });
  return partition;
}

// The spawn step needs the same deal the budget step already made, so it reuses that
// partition and reads the node store again only when no budget step ran, as for a
// loop type the budget step does not size.
function resolveFrontierPartition({ depthMode, budgetPartition, baseArtifactDir, labels }) {
  if (depthMode !== 'expansive') return null;
  return budgetPartition || partitionFrontierNodes(baseArtifactDir, labels);
}

// The root config cannot tell an operator's explicit iteration count from the workflow
// default, so an explicit count arrives as --max-iterations. It binds every lineage the
// matrix gave no iterations, in either depth mode, ahead of any seed-share derivation.
// A matrix iterations value is still kept as given.
function parseMaxIterationsFlag(args) {
  const raw = args.maxIterations;
  if (raw === undefined) return null;
  const value = typeof raw === 'string' && /^\d+$/.test(raw) ? Number(raw) : NaN;
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw inputError('maxIterations must be a positive integer');
  }
  return value;
}

function flagLineageBudgets(lineages, maxIterations) {
  if (maxIterations === null) return lineages;
  return lineages.map((lineage) => (
    Number.isInteger(lineage.iterations) && lineage.iterations > 0
      ? lineage
      : { ...lineage, iterations: maxIterations }
  ));
}

function flagLineageBudgetNotes(expanded, budgeted) {
  return budgeted.flatMap((lineage, index) => (lineage === expanded[index]
    ? []
    : [`[fanout-run] lineage ${lineage.label} budget ${lineage.iterations} iterations, from --max-iterations`]));
}

// Under expansive depth a lineage the matrix gave no iterations is sized from its own
// share of the seed, the way a single-executor run is sized after its seed step. The
// floor is the budget that lineage would otherwise have run, the workflow default for
// its loop, and a lineage dealt no seed node runs at that floor. Every such lineage gets an explicit iteration count, so a max-iterations
// stop policy never finds it uncapped. A review lineage reviews the canonical four
// dimensions. A matrix iterations value is explicit and always kept.
function expansiveLineageBudgets(lineages, { loopType, partition }) {
  const { expansiveBudget, LOOP_DEFAULT_MAX_ITERATIONS } = require('./frontier-admit.cjs');
  return lineages.map((lineage) => {
    if (Number.isInteger(lineage.iterations) && lineage.iterations > 0) return lineage;
    const share = partition && Array.isArray(partition[lineage.label]) ? partition[lineage.label].length : 0;
    const iterations = expansiveBudget({
      target: loopType,
      seeded: share,
      loopDefault: LOOP_DEFAULT_MAX_ITERATIONS[loopType],
    });
    return { ...lineage, iterations };
  });
}

// The stderr lines that explain each derived lineage budget. A lineage dealt no seed
// node is named as such, and one warning says when there are more lineages than open
// seed nodes, since the extra lineages have no frontier to work.
function expansiveLineageBudgetNotes(expanded, budgeted, partition) {
  const shareOf = (label) => (partition && Array.isArray(partition[label]) ? partition[label].length : 0);
  const seedCount = expanded.reduce((total, lineage) => total + shareOf(lineage.label), 0);
  const notes = [];
  if (expanded.length > seedCount) {
    const idle = expanded.length - seedCount;
    notes.push(`[fanout-run] ${expanded.length} lineages share ${seedCount} open seed node${seedCount === 1 ? '' : 's'}, `
      + `so ${idle} lineage${idle === 1 ? '' : 's'} get${idle === 1 ? 's' : ''} no seed share`);
  }
  budgeted.forEach((lineage, index) => {
    if (lineage === expanded[index]) return;
    notes.push(shareOf(lineage.label) === 0
      ? `[fanout-run] lineage ${lineage.label} got no seed share and runs at its loop default of ${lineage.iterations} iterations`
      : `[fanout-run] lineage ${lineage.label} budget ${lineage.iterations} iterations, derived from its seed share`);
  });
  return notes;
}

// A lineage starts from its own store and inbox. They are written only when the
// lineage has no store yet, so a resumed lineage keeps the nodes it already closed.
// Review carries no inbox: its nodes reach the leaf through the FRONTIER block, so
// a seeded inbox would only hand the finding pipeline a file nothing reads.
// The store is the seeded marker, so it is written last: a failed inbox write leaves
// no store, and the next spawn attempt seeds both. A retry after the inbox landed but
// the store did not appends the rows again, which the research reducer folds by text.
function writeLineageFrontierStore(lineageDir, nodes, options = {}) {
  const storePath = path.join(lineageDir, 'frontier-nodes.jsonl');
  if (fs.existsSync(storePath) || nodes.length === 0) return false;
  fs.mkdirSync(lineageDir, { recursive: true });
  if (options.inbox !== false) {
    const inboxRows = nodes.map((node) => JSON.stringify({ id: node.nodeId, text: node.question, source: 'frontier', origin: 'frontier', injectedAtIteration: 0 }));
    fs.appendFileSync(path.join(lineageDir, 'inbox.jsonl'), `${inboxRows.join('\n')}\n`, 'utf8');
  }
  fs.writeFileSync(storePath, nodes.map((node) => `${JSON.stringify(node)}\n`).join(''), 'utf8');
  return true;
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

// Returns null when the flag is absent, so the fan-out config value can supply the mode
// instead. Preserve is the default because the guard cannot prove which writer made an
// out-of-scope change on a shared checkout, and a restore acts on that guess by overwriting
// the bytes on disk; restore stays reachable only by asking for it, here or in the config.
function normalizeContainmentMode(raw) {
  if (raw === undefined || raw === false || raw === null || raw === '') {
    return null;
  }
  if (raw === true || typeof raw !== 'string') {
    throw inputError('containmentMode must be preserve or restore');
  }
  if (raw !== 'preserve' && raw !== 'restore') {
    throw inputError('containmentMode must be preserve or restore');
  }
  return raw;
}

function jsonOut(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

function signalExitCode(signal) {
  if (signal === 'SIGINT') return 130;
  if (signal === 'SIGHUP') return 129;
  return 143;
}

const PARENT_DEATH_POLL_MS = 1000;

/**
 * Call onParentDeath once the bootstrap parent is gone.
 *
 * A SIGKILL of the bootstrap is never forwarded, and the lineage groups are detached, so
 * without this the runner and every lineage outlive it. The child's ppid changes when its
 * parent dies, which holds for every launch. Its stdin closing does not: the bootstrap
 * hands the child an ignored stdin when its own stdin is a terminal.
 */
function watchBootstrapParent(onParentDeath, parentPid = BOOTSTRAP_PARENT_PID) {
  if (!parentPid) return;
  const timer = setInterval(() => {
    if (process.ppid === parentPid) return;
    clearInterval(timer);
    onParentDeath();
  }, PARENT_DEATH_POLL_MS);
  timer.unref();
}

let fanoutSignalHandlersInstalled = false;

function installFanoutSignalHandlers(onStop) {
  if (fanoutSignalHandlersInstalled) return;
  fanoutSignalHandlersInstalled = true;

  const stopAndExit = (signal) => {
    try {
      onStop(signal);
    } finally {
      process.exit(signalExitCode(signal));
    }
  };
  for (const signal of FORWARDED_SIGNALS) {
    process.once(signal, () => stopAndExit(signal));
  }
  // A dead parent is the hangup the terminal would have sent, so it is recorded as one.
  watchBootstrapParent(() => stopAndExit('SIGHUP'));
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

/**
 * Render the fan-out's per-lineage table from its status ledger: each lineage's
 * latest status and the fields its latest progress row carries.
 *
 * @param {Object[]} records - The status ledger's rows in append order.
 * @returns {string} A fixed-width table, one line per lineage.
 */
function formatFanoutStatusTable(records) {
  const rows = new Map();
  for (const record of records) {
    if (!record || typeof record.label !== 'string') continue;
    const row = rows.get(record.label) || { label: record.label, status: 'unknown', progress: null };
    // A warning row such as a containment notice names no lifecycle state, and a beat
    // whose fields could not be read carries none, so neither replaces the last known one.
    const status = statusForLedgerEvent(record);
    if (status !== 'unknown') row.status = status;
    if (record.event === 'progress' && (record.iterations !== undefined || !row.progress)) row.progress = record;
    rows.set(record.label, row);
  }
  const show = (value) => (value === null ? 'unknown' : String(value));
  const header = ['lineage', 'status', 'iterations', 'last commit', 'nodes answered/open/total', 'flagged passes', 'updated'];
  const lines = [...rows.values()].map(({ label, status, progress }) => {
    if (!progress || progress.iterations === undefined) return [label, status, '-', '-', '-', '-', progress ? progress.at : '-'];
    const nodes = progress.nodes || {};
    return [
      label,
      status,
      show(progress.iterations),
      show(progress.lastCommitAt),
      `${show(nodes.answered)}/${show(nodes.open)}/${show(nodes.total)}`,
      show(progress.flaggedPasses),
      progress.at,
    ];
  });
  const widths = header.map((title, column) => Math.max(title.length, ...lines.map((line) => String(line[column]).length)));
  return [header, ...lines]
    .map((line) => line.map((cell, column) => String(cell).padEnd(widths[column])).join('  ').trimEnd())
    .join('\n');
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
  if (entry.event === 'stopped' || entry.event === 'run_stopped') return 'stopped';
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
const LINEAGE_CONFIG_BY_LOOP_TYPE = {
  research: 'deep-research-config.json',
  review: 'deep-review-config.json',
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
  'cli-deepseek-harness': 'SPECKIT_DEEPSEEK_HARNESS_STATE_DIR',
  'cli-mistral-vibe': 'SPECKIT_MISTRAL_VIBE_STATE_DIR',
};

const activeLineageProcesses = new Set();
const WAIT_CHECKPOINT_FILENAME = 'orchestration-wait-checkpoint.json';
const WAIT_CHECKPOINT_SCHEMA_VERSION = 1;
const WAIT_SLEEP_CHUNK_MS = 200;
const OBSERVABILITY_EVENTS_FILENAME = 'observability-events.jsonl';
const DEFAULT_POST_EXIT_GRACE_MS = 5 * 60 * 1000;
// The iteration count fan-out assumes for a lineage the matrix gives none: the budget
// and timeout bounds size every such lineage from it.
const DEFAULT_LINEAGE_ITERATIONS = 12;
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

/**
 * The session id a lineage's config stored at init, or null when there is none to reuse.
 *
 * A resumed run writes its state under the session id its config already names, so minting a
 * fresh id on every dispatch would strand the prior run's records under a name nothing reads
 * back. A complete config is deliberately not reused: that run is over, and the next dispatch
 * of the same label starts a new session rather than continuing a finished one.
 */
function readStoredLineageSessionId(loopType, lineageDir) {
  const configName = LINEAGE_CONFIG_BY_LOOP_TYPE[loopType];
  if (!configName) return null;
  let config;
  try {
    config = JSON.parse(fs.readFileSync(path.join(lineageDir, configName), 'utf8'));
  } catch {
    return null;
  }
  if (!config || typeof config !== 'object' || config.status === 'complete') return null;
  const storedId = loopType === 'review'
    ? config.sessionId
    : config.lineage?.sessionId ?? config.sessionId;
  if (typeof storedId !== 'string' || storedId.trim() === '') return null;
  return storedId;
}

// A research config nests its lineage fields under `lineage`; a review config keeps them flat.
function lineageFieldsOf(loopType, config) {
  if (loopType === 'review') return config;
  return isRecord(config.lineage) ? config.lineage : null;
}

/**
 * The lineage values every lineage of this run inherits from the root config, or null.
 *
 * Each lineage is a new session one level under the root session, in the root's generation.
 * A missing or partial root config yields null, so nothing is invented in its place.
 */
function readRootLineageValues(loopType, baseArtifactDir) {
  const config = readJsonRecord(path.join(baseArtifactDir, LINEAGE_CONFIG_BY_LOOP_TYPE[loopType]));
  const fields = config ? lineageFieldsOf(loopType, config) : null;
  if (!fields || !Number.isInteger(fields.generation)) return null;
  if (typeof fields.sessionId !== 'string' || fields.sessionId.trim() === '') return null;
  return { generation: fields.generation, parentSessionId: fields.sessionId, lineageMode: 'new' };
}

/**
 * Write the root's lineage values into the config a lineage's model created.
 *
 * The model writes the config from the workflow template, which knows nothing of the
 * fan-out, so runtimes have filled these fields differently. The runner cannot write the
 * config before the lineage starts: the workflow reads a config with no state log beside it
 * as a broken session and halts. Every other field, the session id among them, is kept.
 */
function writeLineageValues(loopType, lineageDir, rootValues) {
  if (!rootValues) return;
  const configPath = path.join(lineageDir, LINEAGE_CONFIG_BY_LOOP_TYPE[loopType]);
  const config = readJsonRecord(configPath);
  if (!config) return;
  const next = loopType === 'review'
    ? { ...config, ...rootValues }
    : { ...config, lineage: { ...(lineageFieldsOf(loopType, config) || {}), ...rootValues } };
  atomicWriteJson(configPath, next);
}

/**
 * Artifact directories under this packet owned by a DIFFERENT deep-loop run that is still live.
 *
 * A run in a sibling phase folder writes its own lock, ledgers, iterations and receipts for the
 * whole life of this leaf's dispatch. Those writes land after this leaf's baseline was taken and
 * a tree diff cannot tell them from the leaf's own, so blaming this leaf for them is unsound in
 * exactly the way a sibling lineage's writes are — with a sharper edge: any of them already in
 * HEAD is restored from HEAD, so the guard destroys the live work of a run it never dispatched.
 *
 * The live lock is the evidence of ownership. A stale lock left behind by a finished run proves
 * nothing and grants no exemption (the repo carries many), so a leaf that writes junk into a
 * quiet sibling phase folder still fails the iteration exactly as before.
 */
async function discoverForeignLiveRunDirs({ specFolder, baseArtifactDir }) {
  const { discoverForeignLiveRunDirs: discover } = await import('../lib/deep-loop/write-containment.ts');
  return discover({ repoRoot: process.cwd(), artifactDir: baseArtifactDir || specFolder });
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
  // An absolute path skips the repository-only namespace rule: the root check below is the
  // rule for it, and a workflow may hand over a home path it already expanded.
  if (path.isAbsolute(configDir)) {
    if (configDir.includes('\0')) {
      throw inputError('configDir must not contain null bytes');
    }
  } else {
    validateNamespaceValue(configDir, 'configDir', inputError);
  }

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

const STOP_CONFIRM_TIMEOUT_MS = 10_000;

function signalIfPresent(target, signal) {
  try {
    process.kill(target, signal);
  } catch {
    // Gone already, which is the outcome a stop wants.
  }
}

/**
 * The runner that spawned a live lineage, or null.
 *
 * Read from the kernel's parent link, not from a pid written down earlier, which may since
 * belong to an unrelated process. Only a parent running this script is returned.
 */
function fanoutRunnerPidOf(lineagePid) {
  if (process.platform === 'win32') return null;
  const psField = (field, pid) => {
    const result = spawnSync('ps', ['-o', `${field}=`, '-p', String(pid)], { encoding: 'utf8' });
    return result.status === 0 ? result.stdout.trim() : '';
  };
  const parentPid = Number(psField('ppid', lineagePid));
  if (!Number.isInteger(parentPid) || parentPid <= 1) return null;
  return psField('command', parentPid).includes(path.basename(__filename)) ? parentPid : null;
}

/**
 * The kernel's start time for a pid, or '' when it cannot be read.
 *
 * A pid is reused once its process exits; the start time is not, so the pair names one
 * process. The locale and zone are pinned so the runner and a later --stop, run from
 * different shells, render the same process the same way.
 */
function processStartOf(pid) {
  if (process.platform === 'win32') return '';
  const result = spawnSync('ps', ['-o', 'lstart=', '-p', String(pid)], {
    encoding: 'utf8',
    env: { ...process.env, LC_ALL: 'C', TZ: 'UTC' },
  });
  return result.status === 0 ? result.stdout.trim() : '';
}

function spawnedRowOf(records, lineage) {
  return records.filter((record) => record
    && record.event === 'spawned'
    && record.label === lineage.label
    && Number(record.pid) === lineage.pid).at(-1);
}

function recordedProcessStart(records, lineage) {
  const spawnedRow = spawnedRowOf(records, lineage);
  return spawnedRow && typeof spawnedRow.process_start === 'string' ? spawnedRow.process_start : '';
}

/**
 * The runner the spawned row names, or null when it is gone or cannot be proven to be it.
 *
 * An exited leader takes the kernel's parent link with it, and its members are reparented
 * away from the runner, so the row is the only way back to a runner that is still waiting
 * on their output. The recorded start time is checked like a lineage pid's, since the
 * number alone may now belong to an unrelated process.
 */
function recordedRunnerPidOf(records, lineage) {
  const spawnedRow = spawnedRowOf(records, lineage);
  const runnerPid = spawnedRow ? Number(spawnedRow.runner_pid) : Number.NaN;
  const recorded = spawnedRow && typeof spawnedRow.runner_start === 'string' ? spawnedRow.runner_start : '';
  if (!Number.isInteger(runnerPid) || runnerPid <= 1 || !recorded) return null;
  return processStartOf(runnerPid) === recorded ? runnerPid : null;
}

/**
 * Why a live ledger pid may not be signalled, or null when it is still its lineage.
 *
 * Fails closed: a row with no recorded start time, as an older runner wrote, or a pid whose
 * start time cannot be read, is refused like a mismatch.
 */
function lineageIdentityRefusal(records, lineage) {
  const recorded = recordedProcessStart(records, lineage);
  if (!recorded) return 'no_recorded_identity';
  const current = processStartOf(lineage.pid);
  if (!current) return 'identity_unreadable';
  return current === recorded ? null : 'identity_mismatch';
}

const LSTART_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * An lstart rendering as epoch milliseconds, or NaN when it is not one.
 *
 * Read field by field rather than through Date.parse, which would take the zone-less text in
 * the stopping shell's zone; both sides are rendered under TZ=UTC, so UTC is the right zone.
 */
function lstartMs(text) {
  const match = /^[A-Za-z]{3}\s+([A-Za-z]{3})\s+(\d{1,2})\s+(\d{2}):(\d{2}):(\d{2})\s+(\d{4})$/.exec(String(text).trim());
  const month = match ? LSTART_MONTHS.indexOf(match[1]) : -1;
  if (month < 0) return Number.NaN;
  return Date.UTC(Number(match[6]), month, Number(match[2]), Number(match[3]), Number(match[4]), Number(match[5]));
}

function pidAnswers(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return !(error && error.code === 'ESRCH');
  }
}

/**
 * The live members of an exited leader's process group, split by whether they can be the
 * lineage's, or null when the leader itself still answers.
 *
 * A group outlives its leader, and the leader's children may still be doing lineage work. A
 * member started before the leader's recorded start cannot descend from it, so it is set aside
 * rather than signalled; one whose start time cannot be read is set aside too.
 */
function exitedLeaderGroupMembers(recordedStart, groupId) {
  if (process.platform === 'win32' || pidAnswers(groupId)) return null;
  const spawnMs = lstartMs(recordedStart);
  const result = spawnSync('ps', ['-A', '-o', 'pid=,pgid=,lstart='], {
    encoding: 'utf8',
    env: { ...process.env, LC_ALL: 'C', TZ: 'UTC' },
  });
  const members = [];
  const spared = [];
  if (result.status !== 0 || !Number.isFinite(spawnMs)) return { members, spared };
  for (const line of result.stdout.split('\n')) {
    const match = /^\s*(\d+)\s+(\d+)\s+(.+?)\s*$/.exec(line);
    if (!match || Number(match[2]) !== groupId) continue;
    const pid = Number(match[1]);
    if (pid === process.pid) continue;
    const startedMs = lstartMs(match[3]);
    if (Number.isFinite(startedMs) && startedMs >= spawnMs) members.push(pid);
    else spared.push({ pid, process_start: match[3] });
  }
  return { members, spared };
}

/**
 * Stop the lineages the ledger shows as live, from a process other than their runner.
 *
 * Live means what a re-run refuses on: a spawned row after the lineage's latest start, no
 * terminal row since, and a group or pid that still answers. A live pid is signalled only
 * when its process start time still matches the one recorded at spawn, since the number
 * alone may now belong to an unrelated process group; the others are reported as refused.
 * When the leader has exited but its group still answers, each member started at or after the
 * recorded start is signalled on its own, and the others are listed under spared; with no such
 * member the lineage stays refused. The runner goes first: it stops its own lineages, and once it is gone it cannot retry
 * the ones stopped here. A lineage is recorded as stopped only once it no longer answers.
 *
 * @param {string} ledgerPath - The run's orchestration-status.log.
 * @param {string[]} argv - The run's own argv plus --stop, which the rerun command drops.
 * @returns {Promise<{stopped: Array<{label: string, pid: number}>, survivors: Array<{label: string, pid: number}>, refused: Array<{label: string, pid: number, reason: string}>, spared: Array<{label: string, pid: number, process_start: string}>}>}
 */
async function stopLiveFanoutRun(ledgerPath, argv = process.argv.slice(2)) {
  const records = readLedgerRecords(ledgerPath);
  const live = [];
  const refused = [];
  const spared = [];
  for (const lineage of detectLiveLineages(records)) {
    const reason = lineageIdentityRefusal(records, lineage);
    // Only an unreadable start time can mean an exited leader; a mismatch is a reused pid,
    // whose new group must never be searched for members.
    const group = reason === 'identity_unreadable'
      ? exitedLeaderGroupMembers(recordedProcessStart(records, lineage), lineage.pid)
      : null;
    if (group) spared.push(...group.spared.map((member) => ({ label: lineage.label, ...member })));
    if (group && group.members.length > 0) live.push({ ...lineage, members: group.members });
    else if (reason) refused.push({ label: lineage.label, pid: lineage.pid, reason });
    else live.push(lineage);
  }
  // A runner still waiting on a leaderless group would settle the lineage again once its
  // members end, so it is stopped first and closes the lineage itself, as it does when the
  // leader still answers.
  const runnerOf = (lineage) => (lineage.members
    ? recordedRunnerPidOf(records, lineage)
    : fanoutRunnerPidOf(lineage.pid));
  const runnerPids = new Set(live.map(runnerOf).filter(Boolean));
  for (const runnerPid of runnerPids) signalIfPresent(runnerPid, 'SIGTERM');
  for (const lineage of live) {
    if (lineage.members) for (const memberPid of lineage.members) signalIfPresent(memberPid, 'SIGTERM');
    else signalIfPresent(process.platform === 'win32' ? lineage.pid : -lineage.pid, 'SIGTERM');
  }
  // A spared member keeps the group answering, so a lineage stopped member by member is
  // confirmed by its signalled members alone.
  const answers = (lineage) => (lineage.members
    ? lineage.members.some(pidAnswers)
    : isLineageAlive(lineage.pid));

  let survivors = live;
  let runners = [...runnerPids];
  const deadline = Date.now() + STOP_CONFIRM_TIMEOUT_MS;
  while ((survivors.length > 0 || runners.length > 0) && Date.now() < deadline) {
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));
    survivors = survivors.filter(answers);
    runners = runners.filter((runnerPid) => isLineageAlive(runnerPid));
  }

  // A runner that took the signal has already closed its lineages, so only the ones still
  // open get a row here, and a lineage is never closed twice.
  const stillOpen = new Set(detectLiveLineages(readLedgerRecords(ledgerPath), { isAlive: () => true })
    .map((lineage) => lineage.label));
  const runArgv = argv.filter((token) => token !== '--stop');
  const stopped = live.filter((lineage) => !survivors.includes(lineage));
  // The ledger sits in the base artifact directory, beside the lineages directory.
  const lineagesDir = path.join(path.dirname(ledgerPath), 'lineages');
  for (const lineage of stopped) {
    if (!stillOpen.has(lineage.label)) continue;
    appendFanoutStatusLedger(ledgerPath, stoppedLineageRow({ label: lineage.label, pid: lineage.pid, argv: runArgv }));
    redactTerminalLineageLogs(path.join(lineagesDir, lineage.label));
  }
  const brief = ({ label, pid }) => ({ label, pid });
  return { stopped: stopped.map(brief), survivors: survivors.map(brief), refused, spared };
}

/**
 * The ledger row that closes a lineage a stop ended, with the command that reruns it alone.
 *
 * Both stop paths write this one shape: an operator's --stop from a second process, and the
 * runner itself when a signal or its parent's death ends it.
 */
function stoppedLineageRow({ label, pid, argv, signal }) {
  return {
    event: 'stopped',
    status: 'stopped',
    label,
    pid: Number.isInteger(pid) ? pid : null,
    ...(signal ? { signal } : {}),
    at: new Date().toISOString(),
    rerun_command: rerunCommandFor(label, argv),
  };
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

// A failed attempt's log moves to the first free numbered name instead of being replaced.
// The artifact directory is committed, so the kept copy is masked like a ledger row.
function rotateLineageLog(logPath) {
  if (!hasNonEmptyFile(logPath)) return;
  const { dir, name, ext } = path.parse(logPath);
  let index = 1;
  while (fs.existsSync(path.join(dir, `${name}.${index}${ext}`))) index += 1;
  writeRedactedLineageLog(logPath, path.join(dir, `${name}.${index}${ext}`));
  fs.unlinkSync(logPath);
}

function writeRedactedLineageLog(fromPath, toPath) {
  fs.writeFileSync(toPath, redactProviderText(fs.readFileSync(fromPath, 'utf8')), 'utf8');
}

// Every lineage keeps its last log in the committed artifact directory, whether it
// succeeded, failed with no retry left or was stopped, and a provider echoes account
// ids and the repository author's email into that log. So the log is masked once the
// lineage has settled, after the worker's own reads of the raw text. Masking is
// idempotent, so a log masked by an earlier run is left as it is.
function redactTerminalLineageLogs(lineageDir) {
  for (const name of ['fanout-lineage.out', 'fanout-lineage.err']) {
    const logPath = path.join(lineageDir, 'logs', name);
    if (hasNonEmptyFile(logPath)) writeRedactedLineageLog(logPath, logPath);
  }
}

// A provider's refusal body names the account it refused: workspace, organisation and
// session ids, and console links that carry them. The failure message reaches the
// ledger, the summary, the observability log and stdout, all of which can be committed,
// so those parts are masked here while the error type, status and retry-after stay.
const PROVIDER_ID_FIELD_PATTERN = /("(?:workspace|workspace_?id|session_?id|org|org_?id|organization_?id|account_?id|user_?id|email)"\s*:\s*)"[^"]*"/gi;
const PROVIDER_ID_TOKEN_PATTERN = /\b(?:wrk|ws|org|acct|ses|usr|user|proj|key|sk)_[A-Za-z0-9]{6,}\b/g;
const PROVIDER_URL_PATTERN = /\bhttps?:\/\/[^\s"'\\<>)]+/gi;
const PROVIDER_EMAIL_PATTERN = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

function redactProviderText(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(PROVIDER_ID_FIELD_PATTERN, '$1"<redacted>"')
    .replace(PROVIDER_URL_PATTERN, '<url>')
    .replace(PROVIDER_EMAIL_PATTERN, '<email>')
    .replace(PROVIDER_ID_TOKEN_PATTERN, '<id>');
}

function hasNonEmptyFile(filePath) {
  try {
    return fs.statSync(filePath).isFile() && fs.statSync(filePath).size > 0;
  } catch {
    return false;
  }
}

function iterationNumbersOnDisk(lineageDir) {
  try {
    const iterDir = path.join(lineageDir, 'iterations');
    if (!fs.statSync(iterDir).isDirectory()) return [];
    return fs.readdirSync(iterDir)
      .map((name) => /^iteration-(\d+)\.md$/.exec(name))
      .filter(Boolean)
      .map((match) => Number.parseInt(match[1], 10))
      .sort((left, right) => left - right);
  } catch {
    return [];
  }
}

function countIterationFiles(lineageDir) {
  return iterationNumbersOnDisk(lineageDir).length;
}
function retainIterationRecords(records) {
  // Collapse repeated iteration numbers to one record each, preferring the copy the
  // append gateway wrote over a bare direct-write copy of the same iteration.
  const routeProofFields = ['target_agent', 'resolved_route', 'agent_definition_loaded', 'mode'];
  const hasRouteProof = (record) => routeProofFields.every((field) => record[field] !== undefined);
  const retained = new Map();
  for (const record of records || []) {
    if (!record || record.type !== 'iteration' || !Number.isInteger(record.iteration)) continue;
    const kept = retained.get(record.iteration);
    if (kept === undefined || (!hasRouteProof(kept) && hasRouteProof(record))) {
      retained.set(record.iteration, record);
    }
  }
  return retained;
}

// A count alone lets a gapped or out-of-range set pass for a full run: files 1, 2
// and 4 count as three, and a stray iteration-099 fills in for a missing one.
// Forced depth means every iteration from 1 to the cap ran once, so the set on
// disk and the set the state log recorded both have to be exactly 1..cap.
//
// A repeated state record is not that failure. Two independent executor models
// recorded every iteration twice, once by writing the state log directly and once
// through the append gateway, so the contract this validator would enforce is one
// the leaves already broke. Duplicates collapse to one record per iteration,
// preferring the copy that carries the gateway's route-proof fields and the first
// copy when neither does. A duplicate iteration file on disk stays a violation:
// that is an extra artifact, not one artifact recorded twice.
//
// A log that names its iteration under another key is a different failure, and the
// quieter one: those records collapse to nothing, so the set check below passes
// vacuously and a lane with a full set of iteration files and not one usable record
// is reported complete. Zero usable records is therefore a violation in its own
// right — the state log has to prove the depth the artifact files suggest, and a log
// that never numbered an iteration proves nothing about it.
function forcedDepthIterationViolation({ diskNumbers, records, cap, stateLogPath }) {
  const expected = Array.from({ length: cap }, (_, index) => index + 1);
  const describe = (numbers) => (numbers.length === 0 ? 'none' : numbers.join(','));
  const unique = (numbers) => [...new Set(numbers)].sort((left, right) => left - right);
  const sameSet = (numbers) => {
    const set = unique(numbers);
    return set.length === expected.length && set.every((value, index) => value === expected[index]);
  };
  if (Array.isArray(diskNumbers)) {
    if (diskNumbers.length !== unique(diskNumbers).length) {
      return `duplicate iteration files on disk: ${describe(diskNumbers)}`;
    }
    if (!sameSet(diskNumbers)) {
      return `expected iteration files 1..${cap}, got ${describe(diskNumbers)}`;
    }
  }
  const stateLog = stateLogPath || 'the lineage state log';
  const iterationRecords = (records || []).filter((record) => record && record.type === 'iteration');
  const recorded = [...retainIterationRecords(records).keys()];
  if (recorded.length === 0) {
    return iterationRecords.length > 0
      ? `no usable iteration records in ${stateLog}: ${iterationRecords.length} iteration records carry no integer iteration`
      : `no usable iteration records in ${stateLog}: it holds no iteration record at all`;
  }
  if (!sameSet(recorded)) {
    return `expected state records for iterations 1..${cap}, got ${describe(unique(recorded))}`;
  }
  return null;
}

function findMissingLineageArtifacts(loopType, lineageDir) {
  return expectedLineageArtifactPaths(loopType, lineageDir)
    .filter((artifactPath) => !hasNonEmptyFile(artifactPath));
}

// A projection refusal comes after the event is durable; a provenance refusal
// comes before it, when the state log already holds a config row the ledger never
// produced. Either one means retrying the lineage replays the same refusal, and its
// record carries the code that names which one it was.
const GATEWAY_STATE_REFUSAL_PHASES = new Set(['projection', 'provenance']);

function readGatewayProjectionRefusal(lineageDir, attemptStartedAtIso) {
  const attemptStartedAtMs = Date.parse(attemptStartedAtIso);
  if (!Number.isFinite(attemptStartedAtMs)) return null;

  let lines;
  try {
    lines = fs.readFileSync(path.join(lineageDir, 'gateway-refusals.jsonl'), 'utf8').split(/\r?\n/);
  } catch {
    return null;
  }

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index].trim();
    if (!line) continue;

    let record;
    try {
      record = JSON.parse(line);
    } catch {
      continue;
    }

    const refusedAtMs = Date.parse(record?.at);
    if (
      GATEWAY_STATE_REFUSAL_PHASES.has(record?.phase)
      && Number.isFinite(refusedAtMs)
      && refusedAtMs >= attemptStartedAtMs
    ) {
      return record;
    }
  }
  return null;
}

function attachGatewayProjectionRefusal(failure, record) {
  if (!record) return;
  failure.projectionRefused = true;
  if (record.code === UNATTRIBUTED_STATE_LOG_CODE) failure.unattributedStateLog = true;
  if (typeof record.code === 'string') failure.code = record.code;
  if (typeof record.reason === 'string') failure.reason = record.reason;
}

// The code the append gateway gives a state log whose rows its ledger never
// produced; the runner names a lineage that never reached the gateway the same way.
const UNATTRIBUTED_STATE_LOG_CODE = 'STATE_LOG_UNATTRIBUTED';

const LEDGER_DIR_BY_LOOP_TYPE = {
  research: 'deep-research-ledger',
  review: 'deep-review-ledger',
};

function countLineageLedgerFrames(loopType, lineageDir) {
  const ledgerName = LEDGER_DIR_BY_LOOP_TYPE[loopType];
  if (!ledgerName) return null;
  try {
    return fs.readdirSync(path.join(lineageDir, ledgerName, 'frames'))
      .filter((name) => name.endsWith('.frame'))
      .length;
  } catch {
    return 0;
  }
}

/**
 * Name a CLI lineage whose state log has rows while its ledger has none.
 *
 * The state log is a projection the append gateway rebuilds from the ledger,
 * so a lineage that ran the workflow leaves at least one ledger record behind
 * every state row. Rows with no ledger record were written straight to the
 * file, and the gateway itself never saw the run, so no refusal record exists
 * to explain it.
 */
function findUnledgeredStateLog({ loopType, lineageDir, stateRead }) {
  if (!stateRead || !stateRead.statePath || stateRead.missing) return null;
  const frames = countLineageLedgerFrames(loopType, lineageDir);
  if (frames === null || frames > 0) return null;
  const rowCount = stateRead.records.length;
  const rows = stateRead.parseError ? 'rows' : `${rowCount} row${rowCount === 1 ? '' : 's'}`;
  return `${path.basename(stateRead.statePath)} holds ${rows} but ${LEDGER_DIR_BY_LOOP_TYPE[loopType]} `
    + 'holds no records: the lineage wrote its state log without the append gateway';
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

// Registry file a settled lineage is expected to have written, per loop type. Research also
// has a compatibility name the merge reads, so either name counts as the lane's registry.
const LINEAGE_REGISTRY_FILES = {
  research: ['findings-registry.json', 'deep-research-findings-registry.json'],
  review: ['deep-review-findings-registry.json'],
};

// The findings field each loop type's registry aggregates. Research collects `keyFindings`;
// review collects `openFindings`, so reading one loop's field for the other would report every
// lane that did register findings as empty.
const LINEAGE_REGISTRY_FINDINGS_FIELDS = {
  research: 'keyFindings',
  review: 'openFindings',
};

// Count the finding rows a lane recorded across its delta files. Rows other than findings are
// ignored: only findings are what the registry exists to aggregate.
function countDeltaFindingRecords(lineageDir) {
  const deltaDir = path.join(lineageDir, 'deltas');
  let fileNames;
  try {
    fileNames = fs.readdirSync(deltaDir).filter((name) => /^iter-\d+\.jsonl$/.test(name));
  } catch {
    return 0;
  }

  let count = 0;
  for (const fileName of fileNames) {
    let records;
    try {
      records = parseJsonlRecords(path.join(deltaDir, fileName));
    } catch {
      // A malformed delta is surfaced by the reducer's own corruption path; this advisory
      // counts only the rows readable here.
      continue;
    }
    for (const record of records) {
      if (record && typeof record === 'object' && record.type === 'finding') {
        count += 1;
      }
    }
  }
  return count;
}

function hasLineageRegisteredFindings(loopType, lineageDir) {
  const findingsField = LINEAGE_REGISTRY_FINDINGS_FIELDS[loopType];
  for (const registryName of LINEAGE_REGISTRY_FILES[loopType] ?? []) {
    const registryPath = path.join(lineageDir, registryName);
    if (!hasNonEmptyFile(registryPath)) {
      continue;
    }
    try {
      const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
      if (findingsField && hasNonEmptyArrayField(registry?.[findingsField])) {
        return true;
      }
    } catch {
      // An unreadable registry cannot evidence findings; the delta count still decides.
    }
  }
  return false;
}

// The warning payload for a lane that fulfilled with fragments the merge cannot aggregate,
// or null when the lane either recorded no findings or registered some.
function findEmptyLineageRegistry(loopType, lineageDir) {
  const deltaFindingCount = countDeltaFindingRecords(lineageDir);
  if (deltaFindingCount === 0 || hasLineageRegisteredFindings(loopType, lineageDir)) {
    return null;
  }
  return { delta_finding_count: deltaFindingCount };
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

// The state-log row that proves a lineage reached a legal stop. A review loop runs its
// terminal gates on every path into synthesis, so that row and not a synthesis row is the
// stop; a synthesis row alone can be written by a lineage that skipped every stop gate.
// The research loop has no gate step: its closeout records a synthesis row carrying the stop
// reason once the loop has stopped, on a cap stop and a converged stop alike. A
// `synthesis_incomplete` row is the closeout reporting the synthesis failed its invariants,
// so it proves a stop but not a finished lineage.
const TERMINAL_STOP_EVENTS_BY_LOOP_TYPE = {
  research: [...SYNTHESIS_EVENT_NAMES],
  review: ['terminal_gates'],
};

// Research writes no stop-check row, so its closeout row is the only stop evidence: it must
// name a stop reason from the frozen enum the workflow writes, and a cap stop must have run
// to the cap in the lineage's own config. A review stop is proved by its gate row instead.
const RESEARCH_STOP_REASONS = Object.freeze(Object.values(STOP_REASONS));

function shellQuoteArg(value) {
  const text = String(value);
  return /^[A-Za-z0-9_/.,:=@%+-]+$/.test(text) ? text : `'${text.replace(/'/g, `'\\''`)}'`;
}

// The command that reruns one lineage of this run against the same matrix: the run's own
// argv with any earlier --only-lineage pair replaced, so the lineage keeps its budget share.
// Path values are resolved against this process's cwd, so the command runs from any directory.
const RERUN_PATH_FLAGS = new Set(['baseArtifactDir', ...Object.keys(TEXT_FILE_FLAGS)]);

function rerunCommandFor(label, argv = process.argv.slice(2)) {
  const kept = [];
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--only-lineage') {
      if (argv[index + 1] !== undefined && !argv[index + 1].startsWith('--')) index += 1;
      continue;
    }
    kept.push(argv[index]);
    const flag = argv[index].startsWith('--') ? argv[index].slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase()) : null;
    const value = argv[index + 1];
    if (flag && RERUN_PATH_FLAGS.has(flag) && value !== undefined && !value.startsWith('--')) {
      kept.push(path.resolve(value));
      index += 1;
    }
  }
  return [process.execPath, __filename, ...kept, '--only-lineage', label].map(shellQuoteArg).join(' ');
}

// One row per lineage so a reader sees which lineage failed and how to rerun it alone. A
// succeeded or skipped lineage gets no rerun command: a rerun would skip it as finished.
// Nor does a failed lineage whose config is complete: the workflow halts at its
// completed-session check in that folder, so the folder must be archived before a rerun.
function buildLineageOutcomes(results, { loopType, lineagesDir, argv } = {}) {
  return results.filter(Boolean).map((result) => {
    if (result.status === 'fulfilled') {
      const output = result.output || {};
      return {
        label: result.label,
        status: output.skipped === true ? 'skipped_complete' : 'succeeded',
        failure_class: null,
        exit_code: Number.isInteger(output.exitCode) ? output.exitCode : null,
        rerun_command: null,
      };
    }
    const error = result.error || {};
    const outcome = {
      label: result.label,
      status: 'failed',
      failure_class: typeof error.failure_class === 'string' ? error.failure_class : 'exit',
      exit_code: Number.isInteger(error.exit_code) ? error.exit_code : null,
      rerun_command: rerunCommandFor(result.label, argv),
    };
    const lineageDir = lineagesDir ? path.join(lineagesDir, result.label) : null;
    if (lineageDir && lineageConfigStatus(loopType, lineageDir) === 'complete') {
      outcome.rerun_note = `archive ${lineageDir} first: its config is complete, so a rerun in place `
        + `cannot run it again; then rerun it with ${outcome.rerun_command}`;
      outcome.rerun_command = null;
    }
    return outcome;
  });
}

function lineageConfigStatus(loopType, lineageDir) {
  const configName = LINEAGE_CONFIG_BY_LOOP_TYPE[loopType];
  if (!configName) return null;
  try {
    const config = JSON.parse(fs.readFileSync(path.join(lineageDir, configName), 'utf8'));
    return config && typeof config.status === 'string' ? config.status : null;
  } catch {
    return null;
  }
}

function lineageCompletionPolicy(loopType, lineageDir) {
  const terminalEvents = TERMINAL_STOP_EVENTS_BY_LOOP_TYPE[loopType];
  if (loopType !== 'research') return { terminalEvents };
  let iterationCap = null;
  try {
    const config = JSON.parse(fs.readFileSync(path.join(lineageDir, LINEAGE_CONFIG_BY_LOOP_TYPE.research), 'utf8'));
    if (Number.isInteger(config && config.maxIterations) && config.maxIterations > 0) iterationCap = config.maxIterations;
  } catch {
    // No readable config leaves the cap unknown, which fails a cap stop rather than passing it.
  }
  return { terminalEvents, stopReasons: RESEARCH_STOP_REASONS, iterationCap };
}

// Claude Code in print mode refuses every tool call that needs an approval, and still exits
// 0, so a lineage below bypassPermissions cannot run the append gateway or the reducer.
function claudePermissionHint(lineage, resolvedPermission) {
  if (lineage.kind !== 'cli-claude-code' || resolvedPermission === 'bypassPermissions') return null;
  return `cli-claude-code lineage ${lineage.label} runs under --permission-mode ${resolvedPermission}, `
    + 'which cannot run Bash non-interactively, so it cannot record state; add '
    + '--sandbox-mode=danger-full-access to its --executor group (sandboxMode "danger-full-access" '
    + 'in an --executors matrix)';
}

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
 * Without a forced depth there is no cap to meet, so one recorded iteration beside the report
 * is enough: a lineage that converged early stopped legally.
 *
 * @param {Object} params - Validation inputs.
 * @returns {{complete: boolean, reason: string}} Verdict and, when incomplete, why.
 */
function completionFromArtifacts({ lineageDir, lineage, records, loopType, forcedDepth = true }) {
  if (!lineageDir) return { complete: false, reason: 'no lineage artifact directory to check' };
  const dir = lineageDir;

  // The terminal report artifact differs by loop type: a research lineage leaves research.md,
  // a review lineage leaves review-report.md. Research also never emits a review-style
  // synthesis event (its terminal event is maxIterationsReached), so this artifact check is
  // the authoritative completion signal for a forced-depth research run.
  const reportName = loopType === 'research' ? 'research.md' : 'review-report.md';
  const reportPath = path.join(dir, reportName);
  if (!fs.existsSync(reportPath)) return { complete: false, reason: `no ${reportName} on disk` };

  const diskNumbers = iterationNumbersOnDisk(dir);
  const recordCount = records.filter((r) => r && r.type === 'iteration').length;
  const observed = Math.max(diskNumbers.length, recordCount);
  if (!forcedDepth) {
    return observed > 0 ? { complete: true, reason: '' } : { complete: false, reason: 'no iteration on disk' };
  }
  if (observed < lineage.iterations) {
    return { complete: false, reason: `only ${observed} of ${lineage.iterations} iterations on disk` };
  }
  const violation = forcedDepthIterationViolation({
    diskNumbers: diskNumbers.length > 0 ? diskNumbers : null,
    records,
    cap: lineage.iterations,
    stateLogPath: requiredLineageStateLogPath(loopType, dir),
  });
  if (violation) return { complete: false, reason: violation };
  return { complete: true, reason: '' };
}

/**
 * Why a lineage is already finished and needs no new attempt, or null when it should run.
 *
 * A finished lineage re-dispatched under its label would start a new session, halt at the
 * workflow's completed-session check without recording a stop, and fail the post-attempt
 * completion check. So the runner skips it. A lineage that recorded a terminal stop row must
 * pass the same stop-reason and cap checks the post-attempt check applies to that row, or a
 * lineage that run rejected would be skipped as finished on its rerun. Only an older lineage
 * with no terminal row is judged more loosely: it finished before that row was demanded, and
 * its config and artifacts are the evidence it ran to a stop.
 */
function finishedLineageSkipReason({ loopType, lineageDir, lineage, stopPolicy }) {
  if (lineageConfigStatus(loopType, lineageDir) !== 'complete') return null;
  const stateRead = readLineageStateRecords(loopType, lineageDir);
  if (stateRead.parseError) return null;
  const evidence = completionFromArtifacts({
    lineageDir,
    lineage,
    records: stateRead.records,
    loopType,
    forcedDepth: stopPolicy === 'max-iterations',
  });
  if (!evidence.complete) return null;
  const { checkLineageStopEvidence } = require('../lib/deep-loop/lineage-timestamp-window.ts');
  const stop = checkLineageStopEvidence(stateRead.records, lineageCompletionPolicy(loopType, lineageDir));
  if (!stop.complete && stop.failure !== 'no_terminal_event') return null;
  return `${LINEAGE_CONFIG_BY_LOOP_TYPE[loopType]} is complete and its artifacts are on disk`;
}

const FINISHED_LINEAGE_MISMATCH_REASON = 'finished_lineage_mismatch';
// Said before the recorded values, so a long topic cannot push the remedy out of a clipped line.
const FINISHED_LINEAGE_REFUSAL_GUIDANCE = ', so it is refused rather than respawned into its finished '
  + 'folder; rerun the fan-out with --restart, which archives this packet and starts a fresh session';

// The recorded executor fields a finished lineage must share with this run's build of it. The
// executable path and version are left out: a CLI upgrade changes them without changing the
// executor, and refusing on that would force a restart that archives the whole packet.
const FINISHED_LINEAGE_EXECUTOR_FIELDS = Object.freeze([
  'kind', 'model', 'reasoningEffort', 'serviceTier', 'sandboxMode', 'permissionMode', 'webSearch',
]);

function readJsonRecord(filePath) {
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function collapseBindingText(value) {
  return typeof value === 'string' ? value.replace(REVIEW_FOCUS_CONTROL_PATTERN, ' ').replace(/\s+/g, ' ').trim() : '';
}

/**
 * The refusal for a finished lineage that belongs to a different run than this one, or null.
 *
 * A skipped lineage hands its old results to this run's synthesis, so it may be skipped only
 * when it finished on this run's topic (research) or review target (review) and under the same
 * executor. A side with no recorded value is an older lineage and is not judged on it.
 */
function finishedLineageMismatch({ loopType, lineageDir, label, binding, effectiveConfig }) {
  const field = loopType === 'review' ? 'reviewTarget' : 'topic';
  const config = readJsonRecord(path.join(lineageDir, LINEAGE_CONFIG_BY_LOOP_TYPE[loopType]));
  const recorded = collapseBindingText(config && config[field]);
  const current = collapseBindingText(binding);
  if (recorded && current && recorded !== current) {
    return `lineage ${label} finished on a different ${field}${FINISHED_LINEAGE_REFUSAL_GUIDANCE}`
      + `: recorded ${JSON.stringify(recorded)}, this run ${JSON.stringify(current)}`;
  }
  const metadata = readJsonRecord(path.join(lineageDir, 'invocation-metadata.json'));
  const prior = metadata && isRecord(metadata.effectiveConfig) ? metadata.effectiveConfig : null;
  if (!prior || !isRecord(effectiveConfig)) return null;
  const changed = FINISHED_LINEAGE_EXECUTOR_FIELDS.filter((name) => (
    Object.prototype.hasOwnProperty.call(effectiveConfig, name)
    && (prior[name] ?? null) !== (effectiveConfig[name] ?? null)
  ));
  if (changed.length === 0) return null;
  return `lineage ${label} finished under a different executor${FINISHED_LINEAGE_REFUSAL_GUIDANCE}: `
    + changed.map((name) => `${name} ${JSON.stringify(prior[name] ?? null)} -> ${JSON.stringify(effectiveConfig[name] ?? null)}`).join(', ');
}

function findMaxIterationsPolicyViolation({ loopType, stateRead, lineage, stopPolicy, lineageDir }) {
  // Forced-depth validation applies to both loop types: stopPolicy=max-iterations means the
  // lineage must run every iteration and convergence before the cap is telemetry only. The
  // iteration count is the shared signal, but the terminal completion artifact differs — a
  // research lineage leaves research.md plus a terminal maxIterationsReached event (no review-
  // style synthesis event), a review lineage leaves review-report.md — so completion detection
  // is loop-type-aware below.
  if ((loopType !== 'review' && loopType !== 'research') || stopPolicy !== 'max-iterations') return null;
  if (typeof lineage.iterations !== 'number' || lineage.iterations <= 0) {
    return 'stopPolicy=max-iterations requires a positive lineage iteration cap';
  }

  const stateFile = lineageStateLogName(loopType) || 'the lineage state log';
  if (!stateRead || stateRead.missing) {
    return `missing ${stateFile} for max-iterations stop-policy validation`;
  }
  if (stateRead.parseError) {
    return `could not parse ${stateFile}: ${stateRead.parseError}`;
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
    const evidence = completionFromArtifacts({ lineageDir, lineage, records, loopType });
    if (evidence.complete) return null;
    return `missing synthesis event and ${evidence.reason} for max-iterations stop-policy validation`;
  }

  const totalIterations = lineageDir
    ? countIterationFiles(lineageDir)
    : iterationCount;
  if (totalIterations !== lineage.iterations) {
    return `expected ${lineage.iterations} iterations, got ${totalIterations}`;
  }
  const setViolation = forcedDepthIterationViolation({
    diskNumbers: lineageDir ? iterationNumbersOnDisk(lineageDir) : null,
    records,
    cap: lineage.iterations,
    stateLogPath: stateRead.statePath
      || (lineageDir ? requiredLineageStateLogPath(loopType, lineageDir) : null),
  });
  if (setViolation) return setViolation;
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
  const iterations = Number.isFinite(rawIterations) && rawIterations > 0 ? Math.floor(rawIterations) : DEFAULT_LINEAGE_ITERATIONS;
  const normalizedRetries = Number.isFinite(Number(maxRetries)) && Number(maxRetries) >= 0
    ? Math.floor(Number(maxRetries))
    : 0;
  const totalAttempts = normalizedRetries + 1;
  // base_cost_units is the GUARANTEED spend: one attempt, no retries. Retries only
  // fire on failure, so they are contingency, not a certainty -- the pre-dispatch
  // cap gates on base_cost_units below. estimated_cost_units keeps the old
  // worst-case-if-every-attempt-fails total for logging/visibility only; treating
  // it as guaranteed spend used to block legitimate long configs (e.g. a
  // 20-iteration lineage with the default 5 retries) before a single attempt ran.
  const baseCostUnits = iterations * guards.cost_units_per_iteration;
  return {
    ...guards,
    iterations,
    total_attempts: totalAttempts,
    base_cost_units: baseCostUnits,
    estimated_cost_units: baseCostUnits * totalAttempts,
  };
}

function evaluateLineageBudgetCap(input = {}) {
  const upperBound = computeLineageBudgetUpperBound(
    input.lineage || {},
    input.guards || input,
    input.maxRetries,
  );
  const exceeded = upperBound.max_cost_units_per_lineage > 0
    && upperBound.base_cost_units > upperBound.max_cost_units_per_lineage;
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
    return {
      label: lineage && lineage.label,
      base_cost_units: upperBound.base_cost_units,
      estimated_cost_units: upperBound.estimated_cost_units,
    };
  });
  // Sum guaranteed (base) spend across lineages, matching the per-lineage cap's
  // guaranteed-vs-contingency split above -- the worst-case retry ladder for every
  // lineage failing and exhausting retries simultaneously is not guaranteed spend.
  const estimatedCostUnits = perLineage.reduce((sum, entry) => sum + entry.base_cost_units, 0);
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
      ? '.skilled/skills/system-deep-loop/deep-review/SKILL.md'
      : '.skilled/skills/system-deep-loop/deep-research/SKILL.md';
  // The child copies one directory path into every tool call; a repo-relative form drops the
  // home prefix that a retyped absolute path most often corrupts. A cursor leaf runs in a
  // neutral workspace outside the repository, where only the absolute form resolves.
  const absoluteLineageDir = path.resolve(process.cwd(), lineageDir);
  const relativeLineageDir = path.relative(process.cwd(), absoluteLineageDir);
  const lineageDirStaysInsideCwd = relativeLineageDir !== ''
    && !relativeLineageDir.startsWith('..')
    && !path.isAbsolute(relativeLineageDir);
  const promptDir = lineage.kind === 'cli-cursor' || !lineageDirStaysInsideCwd
    ? absoluteLineageDir
    : relativeLineageDir;
  const agentName = loopType === 'review' ? 'deep-review' : 'deep-research';
  const detachedIntro = lineage.kind === 'cli-opencode'
    ? [
        `This is an explicit parallel-detached OpenCode lineage, not a self-invocation of the parent session.`,
        `Use the separate lineage directory and session id below as the detached state boundary.`,
        ``,
      ]
    : [];
  // A CLI lineage subprocess IS the executor for its own iterations. Left unsaid, a leaf reads
  // the workflow YAML's per-iteration executor-dispatch step literally and spawns a nested CLI
  // from inside its own sandbox, where nested dispatch is denied — the lineage then burns every
  // iteration on dispatch failures and produces zero findings.
  // A state row written beside the ledger carries keys the projection cannot rebuild,
  // so the gateway refuses every later projection and the lineage records nothing.
  const stateLogName = lineageStateLogName(loopType);
  // The workflow keeps its reducer on the lineage directory during fan-out, and the
  // merge reads the reducer's dashboard stamp as proof the lineage registry was
  // reduced rather than left as the seeded empty file. A leaf that runs each
  // iteration inline reads this list as the whole job, so the reducer is named here.
  const reducerCommand = loopType === 'review'
    ? `node .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs ${specFolder} --artifact-dir ${promptDir} --create-missing-anchors`
    : `node .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs ${specFolder} --artifact-dir ${promptDir}`;
  const inProcessDirective = [
    `EXECUTION MODE (read this first): THIS process is the executor for EVERY iteration.`,
    `Perform each iteration yourself in THIS session — read the sources, then write the iteration`,
    `file, its delta, and the synthesis into the lineage directory below.`,
    `State records go through the append gateway instead: hand every one, from the run-opening`,
    `config row (step_create_state_log) to the terminal synthesis record, to`,
    `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs exactly as the workflow YAML runs it.`,
    `Never create, append to, or rewrite ${stateLogName} yourself: a row written there beside the`,
    `ledger makes the gateway refuse every later projection, and the lineage fails.`,
    `After each iteration's gateway append, run the workflow's step_reduce_state reducer exactly as the YAML runs it:`,
    `${reducerCommand}`,
    `It writes the lineage registry, dashboard, and strategy the merge reads; skipping it leaves the lineage merged with unverified provenance.`,
    `NEVER spawn a nested CLI, agent, or subprocess to run an iteration: no 'codex exec', no`,
    `'opencode run', no 'cursor-agent', no 'devin', no 'pi', no 'claude', no Task/agent dispatch.`,
    `The workflow YAML's per-iteration executor-dispatch steps are ALREADY SATISFIED by this`,
    `process: treat them as done and run the iteration inline. A nested dispatch is a failure of`,
    `this lineage, not a way to run it.`,
    ``,
  ];
  // Detached executors receive one prompt for the whole loop, so repeat the
  // mode's artifact contract where the per-iteration prompt would have rendered.
  const iterationTemplateFile = `.skilled/skills/system-deep-loop/${agentName}/assets/prompt-pack-iteration.md.tmpl`;
  const leafContract = loopType === 'review'
    ? [
        `CLI OUTPUT CONTRACT (binds every iteration even though per-iteration prompt rendering is already satisfied):`,
        `Before iteration 1, read ${iterationTemplateFile}; follow its OUTPUT CONTRACT for each iteration.`,
        `- The narrative uses Findings by Severity with numbered findings under P0 Findings, P1 Findings, and P2 Findings.`,
        `- The canonical iteration state record includes findingDetails with one object per finding, each carrying id, severity, and title.`,
        `- Use only P0, P1, or P2. A positive findingsCount or findingsSummary needs a non-empty findingDetails that lists the findings behind it.`,
        `- The delta contains the iteration row followed by one {"type":"finding","id":"<id>","severity":"P0|P1|P2","title":"<text>","file":"<path:line>","iteration":N} row per finding.`,
        `- End the narrative with exactly one final Review verdict: PASS, CONDITIONAL, or FAIL line.`,
        `- Read the timestamp from the clock when writing and hand the iteration record to the gateway immediately after its iteration, never in a batch at the end.`,
        ``,
      ]
    : [
        `CLI OUTPUT CONTRACT (binds every iteration even though per-iteration prompt rendering is already satisfied):`,
        `Before iteration 1, read ${iterationTemplateFile}; follow its OUTPUT CONTRACT for each iteration.`,
        `- The iteration narrative has a ## Findings section with one numbered line per finding.`,
        `- The delta contains the iteration row followed by one {"type":"finding","id":"<id>","label":"<text>","iteration":N,"sources":["<path or URL>"]} row per finding.`,
        `- The delta's iteration row and the iteration record handed to the gateway carry findingsCount equal to the number of findings enumerated for that iteration.`,
        `- Read the timestamp from the clock when writing and hand the iteration record to the gateway immediately after its iteration, never in a batch at the end.`,
        ``,
      ];
  // A CLI leaf runs every iteration from this one prompt, so the operator's focus has to be
  // restated where the leaf reads its per-iteration contract, not only in the setup bindings.
  const reviewFocus = loopType === 'review' && options.reviewFocus ? options.reviewFocus : null;
  if (reviewFocus) {
    leafContract.splice(
      leafContract.length - 1,
      0,
      `- Every iteration covers its dimension AND the operator review focus bound as review_focus, and the narrative says how that iteration addressed the focus.`,
    );
  }
  if (options.depthMode === 'expansive' && loopType === 'research' && leafContract.length > 0) {
    leafContract.splice(
      leafContract.length - 1,
      0,
      `- Expansive depth: work the frontier nodes bound as frontier_scope. Before each iteration, write its focus to ${promptDir}/frontier-focus.txt with the file-write tool, then print its FRONTIER block with: node .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs block --artifact-dir ${promptDir} --focus-file ${promptDir}/frontier-focus.txt. Propose follow-up questions only as frontier_proposal delta rows under the node your focus names, at most the slots that block allows and none when it prints nothing, and never write the inbox or the node store.`,
    );
  }
  if (options.depthMode === 'expansive' && loopType === 'review' && leafContract.length > 0) {
    leafContract.splice(
      leafContract.length - 1,
      0,
      `- Expansive depth: work the frontier nodes bound as frontier_scope, one node and its next uncovered dimension per iteration. Before each iteration, print that node's FRONTIER block with: node .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs block --target review --artifact-dir ${promptDir} --node-id <node id> --dimension <dimension>. Propose sub-targets only as frontier_proposal delta rows under that node, at most the slots that block allows and none when it prints nothing, never outside the review target, and never write the node store or a coverage surface.`,
    );
  }
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
  if (options.convergenceMode) {
    params.push(`  config.convergenceMode: ${options.convergenceMode}`);
  }
  if (options.depthMode === 'expansive') {
    params.push(`  config.depthMode: expansive`);
    params.push(`  frontier_scope: ${(options.frontierScope || []).join(', ') || 'none'}`);
  }
  // Review lineages scope by spec_folder but the auto-workflow preflight still requires
  // the review setup bindings. Without these, a detached CLI lineage can fail first-run
  // initialization or infer a different setup contract than the workflow expects.
  const setupBindings =
    loopType === 'review'
      ? [
          ``,
          `Review setup bindings (emit before any writes, as PRE-BOUND SETUP ANSWERS):`,
          `review_target: ${options.reviewTarget || specFolder}`,
          `review_target_type: ${options.reviewTargetType || 'spec-folder'}`,
          `review_dimensions: all`,
          ...(reviewFocus ? [`review_focus: ${reviewFocus}`] : []),
          ...(options.depthMode === 'expansive' ? [`frontier_scope: ${(options.frontierScope || []).join(', ') || 'none'}`] : []),
          `spec_folder: ${specFolder}`,
          `execution_mode: AUTONOMOUS`,
          `lineage_mode: auto`,
          ``,
        ]
      : [];
  const prompt = [
    `GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.`,
    `You are a non-interactive dispatched worker: AI_SESSION_CHILD=1 is set, which AGENTS.md defines as the autonomous child-dispatch exemption. Nobody is at a prompt, so no answer can reach you.`,
    `Your write authority is already bound to ${promptDir}. The dispatcher's answer to every other stop-and-ask rule (Halt Conditions, Logic-Sync, stop-for-yes): follow the workflow within this prompt's write limits, record the conflict in the current iteration, and continue. Never end a turn with a question or A/B/C/D options.`,
    `A failed call means re-check the path and retry; halt only after three failures on the same call. The lineage is complete only when its files exist on disk and the completion line below is printed.`,
    ``,
    `You are orchestrating the ${agentName} workflow YAML as a detached fan-out lineage.`,
    ...detachedIntro,
    ``,
    ...inProcessDirective,
    agentPersonaBlock(agentName, path.resolve(__dirname, '../../../../../')),
    ...leafContract,
    `Read ${skillFile} and execute the ${loopType} loop with these parameters:`,
    ...params,
    ...setupBindings,
    `The step_resolve_artifact_root step will bind artifact_dir to ${lineageDir} via the`,
    `config.fanout_lineage_artifact_dir override — do NOT run the resolveArtifactRoot node`,
    `command; bind artifact_dir directly to the override value.`,
    ``,
    `Run phase_init, phase_main_loop (${stopClause}), and phase_synthesis.`,
    `Write EVERY file you create or modify inside ${promptDir} and nowhere else — that directory is`,
    `your entire write surface. Its absolute path is ${absoluteLineageDir}; the`,
    `relative form is resolved from the repository root, so a path that drops the leading`,
    `directories (for example one starting with review/ or research/) lands OUTSIDE the lineage and`,
    `fails it. You may read anywhere, but do NOT modify, create, or delete any file`,
    `outside ${promptDir}, and do NOT run any command that writes outside it: in particular do NOT`,
    `run generate-context.js, validate.sh (especially --recursive), or any git write/checkout/commit`,
    `command. Producing findings does not mean running the repo's tooling — a single out-of-scope`,
    `write fails this whole lineage.`,
    `Use the repository-relative form ${promptDir} in every tool call, copied character for character; never type the absolute home prefix or rebuild the path from the packet or track name.`,
    `A "file not found" on a path you just wrote means the path was mistyped: re-copy ${promptDir} and retry.`,
    // A CLI lineage runs every iteration from this one prompt, so a lead's review file reaches
    // later iterations only when the prompt names it.
    `Before init, before each iteration, and before resolving any conflict, read ${path.join(promptDir, 'steer.md')} when it exists.`,
    `It is the lead's channel: its rulings are the dispatcher's answers to questions this lineage would otherwise ask, and they bind inside the lineage directory.`,
    `It grants no write outside the lineage. When you read it, list it among that iteration's sources.`,
    ...(hasIterationCap && stopPolicy === 'max-iterations'
      ? [
          `The terminal synthesis record must carry stopReason "maxIterationsReached"; the runner`,
          `rejects a lineage whose synthesis reaches the cap without recording that reason.`,
        ]
      : []),
    ``,
    `When complete, output a single line: FANOUT_LINEAGE_COMPLETE:${lineage.label}`,
  ].join('\n');
  return prompt;
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
  const iters = lineage.iterations || DEFAULT_LINEAGE_ITERATIONS;
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

/**
 * The fields a lineage's progress row carries: committed passes, the last commit,
 * its frontier nodes and the passes its own log flags as unexamined.
 *
 * @param {string} lineageDir - The lineage's artifact directory.
 * @param {string} [liveStdout] - The running attempt's stdout so far.
 * @returns {{iterations:number, lastCommitAt:string|null,
 *   nodes:{answered:number, open:number, total:number}, flaggedPasses:number|null}}
 */
function readLineageProgressFields(lineageDir, liveStdout = '') {
  const { readNodeStore } = require('./frontier-admit.cjs');
  const { iterations, lastCommitAt, flaggedPasses } = readLineagePassSummary(lineageDir, liveStdout);
  // A review node's answered status is derived by the reducer into its registry
  // frontier and never written back to the store, so that derived status wins
  // where the registry has the node; a node admitted after the last reduce keeps
  // its stored status.
  const derivedStatus = new Map();
  try {
    const registry = JSON.parse(fs.readFileSync(path.join(lineageDir, 'deep-review-findings-registry.json'), 'utf8'));
    for (const node of Array.isArray(registry?.frontier?.nodes) ? registry.frontier.nodes : []) {
      if (node && typeof node.nodeId === 'string') derivedStatus.set(node.nodeId, node.status);
    }
  } catch {
    // No reduced frontier yet, or a torn write: the store's own statuses stand.
  }
  const nodes = { answered: 0, open: 0, total: 0 };
  for (const node of readNodeStore(path.join(lineageDir, 'frontier-nodes.jsonl'), { warnings: [] }).values()) {
    const status = derivedStatus.has(node.nodeId) ? derivedStatus.get(node.nodeId) : node.status;
    nodes.total += 1;
    if (status === 'answered') nodes.answered += 1;
    else if (status === 'open' || status === 'active') nodes.open += 1;
  }
  return { iterations, lastCommitAt, nodes, flaggedPasses };
}

function startLineageProgressHeartbeat({ cadenceMs, label, ledgerPath, getGauges, onProgress, getProgress }) {
  if (!Number.isFinite(cadenceMs) || cadenceMs <= 0) {
    return () => {};
  }
  const startedAtMs = Date.now();
  const timer = setInterval(() => {
    let progress = {};
    try {
      if (typeof getProgress === 'function') progress = getProgress();
    } catch {
      // The fields are a view of the lineage's own files; a torn read skips them for
      // this beat rather than throwing out of the timer and killing the run.
    }
    appendFanoutStatusLedger(ledgerPath, {
      event: 'progress',
      label,
      at: new Date().toISOString(),
      duration_ms: Math.max(0, Date.now() - startedAtMs),
      ...progress,
        gauges: getGauges(),
      });
      if (typeof onProgress === 'function') onProgress();
    }, cadenceMs);
  timer.unref?.();
  return () => clearInterval(timer);
}

/**
 * Shared-checkout churn detector.
 *
 * Write containment cannot tell its own leaf's churn from a second writer's, and its
 * remedy is destructive: a restore overwrites bytes this run never wrote. The tree
 * alone cannot name the writer, but the timing can. A lineage edits under its own
 * artifact dir, so a BURST of newly dirty paths outside that dir between two
 * heartbeats is another writer, while a couple of files coming and going is ordinary
 * working-tree life. A burst is not the only shape a second writer has: one that
 * spreads its paths a heartbeat apart stays under any per-window count, so the same
 * sample also feeds a running total, and either count crossing its own threshold is
 * proof enough. Sampling reuses the containment snapshot so the detector and the
 * guard agree on what "dirty outside the lineage" means; a threshold of 0 disables
 * that arm, and both at 0 disable the detector.
 *
 * Returns a sample function. The first sample only establishes the baseline, and a
 * detection is final: sampling stops because the run's remaining heartbeats cannot
 * make a restore safe once a foreign writer is proven.
 */
function startSharedCheckoutChurnDetector({
  threshold,
  cumulativeThreshold,
  sampleDirtyPaths,
  onDetected,
}) {
  const limit = Number(threshold);
  const limitEnabled = Number.isFinite(limit) && limit > 0;
  const cumulativeLimit = Number(cumulativeThreshold);
  const cumulativeEnabled = Number.isFinite(cumulativeLimit) && cumulativeLimit > 0;
  if (!limitEnabled && !cumulativeEnabled) return () => {};
  let previousPaths = null;
  let cumulativeDirty = 0;
  let stopped = false;
  return () => {
    if (stopped) return;
    try {
      const currentPaths = new Set(sampleDirtyPaths());
      const newlyDirty = previousPaths === null
        ? 0
        : Array.from(currentPaths).filter((path) => !previousPaths.has(path)).length;
      previousPaths = currentPaths;
      cumulativeDirty += newlyDirty;
      const burstDetected = limitEnabled && newlyDirty > limit;
      const cumulativeDetected = cumulativeEnabled && cumulativeDirty > cumulativeLimit;
      if (burstDetected || cumulativeDetected) {
        // Both counts are reported whichever arm fired, so the ledger says how close
        // the other one came without a second sample to recompute it from.
        stopped = true;
        onDetected({ newlyDirty, cumulativeDirty });
      }
    } catch {
      // A detector that can fail a lane is worse than no detector: an unreadable
      // tree (git absent, checkout gone) ends sampling and changes nothing.
      stopped = true;
    }
  };
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
 * Cheap, monotonic-ish signature of a lineage's on-disk artifacts. It advances
 * whenever files are added, grown, or rewritten, so a change between polls means
 * the lineage produced real output — the liveness signal a non-streaming executor
 * cannot express through incremental stdout.
 */
function computeLineageArtifactSignature(dir) {
  let count = 0;
  let bytes = 0;
  let maxMtimeMs = 0;
  const walk = (current) => {
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      let stat;
      try {
        stat = fs.statSync(full);
      } catch {
        continue;
      }
      count += 1;
      bytes += stat.size;
      if (stat.mtimeMs > maxMtimeMs) maxMtimeMs = stat.mtimeMs;
    }
  };
  walk(dir);
  return { count, bytes, maxMtimeMs };
}

function lineageArtifactProgressed(prev, next) {
  if (!prev) return next.count > 0 || next.bytes > 0;
  return next.count > prev.count || next.bytes > prev.bytes || next.maxMtimeMs > prev.maxMtimeMs;
}

/**
 * Poll cadence for artifact progress: a few checks per heartbeat window so a write
 * is noticed well before any stall/lag threshold keyed off the same cadence, floored
 * and capped so it neither busy-loops nor lags a slow writer.
 */
function computeArtifactPollCadenceMs(progressHeartbeatMs) {
  const base = Number.isFinite(progressHeartbeatMs) && progressHeartbeatMs > 0
    ? progressHeartbeatMs
    : 60000;
  return Math.max(5000, Math.min(30000, Math.floor(base / 2)));
}

/**
 * Watch a lineage's artifact directory and fire onArtifactProgress whenever its
 * on-disk output advances. Baselines the current signature at start so only writes
 * made after dispatch count (a retry that reuses a populated dir does not false-fire).
 */
function startLineageArtifactProgressPoller({ lineageDir, cadenceMs, onArtifactProgress }) {
  if (!Number.isFinite(cadenceMs) || cadenceMs <= 0) return () => {};
  let lastSignature = computeLineageArtifactSignature(lineageDir);
  const timer = setInterval(() => {
    const signature = computeLineageArtifactSignature(lineageDir);
    if (lineageArtifactProgressed(lastSignature, signature)) {
      lastSignature = signature;
      try {
        onArtifactProgress();
      } catch {
        // The progress signal is best-effort liveness; never let it break the run.
      }
    }
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
const LINEAGE_STDERR_CAP_BYTES = 256 * 1024;

function runLineageProcess(command, cmdArgs, opts) {
  const { cwd, env, timeoutMs, maxBuffer } = opts;
  const hasInput = typeof opts.input === 'string';

  return new Promise((resolvePromise) => {
    let child;
    try {
      child = spawn(command, cmdArgs, {
        cwd,
        // spawn() moves the working directory but passes the parent's PWD on unchanged,
        // and some executors read PWD to tell the model where it is.
        env: cwd ? { ...(env || process.env), PWD: path.resolve(cwd) } : env,
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
    let stderr = '';
    let stderrBytes = 0;
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
      if (typeof opts.onOutput === 'function') opts.onOutput(chunk);
      if (truncated) return;
      stdoutBytes += Buffer.byteLength(chunk, 'utf8');
      if (stdoutBytes > maxBuffer) {
        truncated = true;
        terminateLineageProcess(child, 'SIGTERM');
        return;
      }
      stdout += chunk;
    });
    // Keep a bounded copy of stderr: an executor refusal (usage limit, auth,
    // sandbox) is reported there and nowhere else, and without it a failed
    // lineage shows only an exit code. Past the cap the pipe is still drained
    // so the child never blocks.
    child.stderr?.setEncoding('utf8');
    child.stderr?.on('data', (chunk) => {
      if (stderrBytes >= LINEAGE_STDERR_CAP_BYTES) return;
      stderrBytes += Buffer.byteLength(chunk, 'utf8');
      stderr += chunk;
    });

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
        stderr,
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

function resolveOpencodeExecutableVersion(executablePath, options = {}) {
  if (executablePath.includes(path.sep)) {
    return resolveExecutableVersion(path.basename(executablePath), {
      ...options,
      env: {
        ...(options.env || process.env),
        PATH: path.dirname(executablePath),
      },
    });
  }
  return resolveExecutableVersion(executablePath, options);
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

// The value the command passes to --permission-mode, or null when it passes none. Each kind
// owns its own vocabulary, so the resolved Claude mode is never reported for another kind.
function emittedPermissionMode(input) {
  const promptIndexes = new Set(input.promptArgIndexes || []);
  const flagIndex = input.args.findIndex((arg, index) => arg === '--permission-mode' && !promptIndexes.has(index));
  return flagIndex >= 0 && flagIndex + 1 < input.args.length ? input.args[flagIndex + 1] : null;
}

// preventive: the executor's own confinement is on in this command. compensating: the builder
// emitted a non-OS restriction (an approval mode or a tool allowlist). none: neither.
function sandboxEnforcementFor(input) {
  const { EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY } = require('../lib/deep-loop/executor-config.ts');
  const confines = input.confines ?? (input.resolvedSandbox !== 'danger-full-access'
    && input.resolvedPermission !== 'bypassPermissions');
  if (EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY[input.kind] === true && confines) return 'preventive';
  return input.compensatingControl === true ? 'compensating' : 'none';
}

function finalizeLineageCommand(input) {
  // cli-opencode has no OS-level sandbox. workspace-write is honoured only as a permission
  // rule (external_directory denied for its file tools), and its Bash tool can still write
  // anywhere, so no read-only boundary exists. A read-only request must be refused rather
  // than recorded as a boundary the process never had, so dispatch fails closed.
  if (input.kind === 'cli-opencode' && input.resolvedSandbox
    && input.resolvedSandbox !== 'danger-full-access' && input.resolvedSandbox !== 'workspace-write') {
    throw inputError(
      `cli-opencode cannot enforce sandbox mode '${input.resolvedSandbox}': its Bash tool can write anywhere, `
        + 'so no read-only boundary exists; use \'workspace-write\' (file tools denied outside the working '
        + 'directory, Bash not confined), \'danger-full-access\', or a dispatch kind that can enforce this sandbox mode',
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
    permissionMode: emittedPermissionMode(input),
    sandboxEnforcement: sandboxEnforcementFor(input),
    effortApplied: input.effortApplied ?? (input.reasoningEffort ? 'flag' : 'none'),
    webSearch: input.webSearch,
  };
  // The fingerprint keeps the resolved permission so a lineage's invocation identity
  // stays stable across runs; effectiveConfig reports what the command actually passes.
  const fingerprintPayload = buildInvocationFingerprintPayload(input);
  const invocationFingerprint = `inv:${digestText(JSON.stringify(fingerprintPayload))}`;
  return {
    command: input.command,
    args: input.args,
    ...(Object.prototype.hasOwnProperty.call(input, 'input') ? { input: input.input } : {}),
    ...(input.cwd ? { cwd: input.cwd } : {}),
    ...(input.env ? { env: input.env } : {}),
    effectiveConfig,
    invocationFingerprint,
    // The argv with every prompt argument replaced by its digest, for a preview to print.
    redactedArgs: fingerprintPayload.argv,
  };
}

function buildCodexLineageCommand(lineage, prompt, resolvedSandbox, resolvedPermission, options) {
  if (!isCodexBinaryAvailable(options.env || process.env)) {
    throw inputError('cli-codex executor unavailable: command -v codex failed');
  }
  const webSearch = effectiveWebSearchPolicy(lineage);
  const model = lineage.model || CODEX_DEFAULT_MODEL;
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
  if (!isClaudeBinaryAvailable(options.env || process.env)) {
    throw inputError('cli-claude-code executor unavailable: command -v claude failed');
  }
  const model = lineage.model || CLAUDE_DEFAULT_MODEL;
  const args = [
    '-p',
    prompt,
    '--model',
    model,
    '--permission-mode',
    resolvedPermission,
    // One JSON event per line gives the log its tool calls, their timestamps and the
    // session cost; print mode refuses stream-json without --verbose.
    '--output-format',
    'stream-json',
    '--verbose',
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

// Mirrors isFlashMaxPinnedModel in executor-config.ts. DeepSeek V4 Flash and
// GLM-5.3-Flash are reasoning models whose top tier is `max`, pinned there by operator
// policy — never dispatched below max. DeepSeek is bare on cli-pi as the 4.1 line,
// provider-prefixed on cli-opencode, and its OpenRouter `-latest` variant is the same family
// and pinned too; on
// cli-pi the bare literal reaches DevPass, whose ladder tops at `max`;
// GLM-5.3-Flash matches its bare DevPass literal and its OpenRouter `z-ai/` literal.
//
// A top tier belongs to the ROUTE, not to the model name. GLM-5.3-Flash offers
// low/high/max on OpenRouter, opencode-go and DevPass — the routes whose literals
// reach here — and no xhigh on the first two.
//
// Gemini 3.7 Flash tops at `high` (no `max`) and is intentionally not matched; the devin
// `-max` uid bakes the tier into the id and is not matched. Duplicated as a plain function
// so the pin lands inside the synchronous command builders below.
function isFlashMaxPinnedModel(model) {
  return /(^|\/)(deepseek-v4-flash(-latest|-vision-exp)?|deepseek-v4\.1-flash(-1017)?|glm-5\.3-flash)$/.test(model);
}

// Effective reasoning effort after the Flash top-tier pin.
// Mirrors pinReasoningEffortForModel in executor-config.ts.
function pinReasoningEffortForModel(model, reasoningEffort) {
  return isFlashMaxPinnedModel(model) ? 'max' : reasoningEffort;
}

// OpenCode reads OPENCODE_CONFIG_CONTENT as inline config that overrides the project's
// opencode.json, so a workspace-write lineage gets its external_directory deny there. An
// inherited value keeps every other key; one this cannot merge into is refused rather than
// replaced, because replacing it would silently drop the caller's own settings.
function opencodeWorkspaceWriteConfigContent(inherited) {
  let config = {};
  if (inherited !== undefined && inherited !== '') {
    try {
      config = JSON.parse(inherited);
    } catch (error) {
      throw inputError(`cli-opencode workspace-write cannot merge into OPENCODE_CONFIG_CONTENT: not valid JSON (${error.message})`);
    }
    if (!isRecord(config)) {
      throw inputError('cli-opencode workspace-write cannot merge into OPENCODE_CONFIG_CONTENT: it is not a JSON object');
    }
  }
  if (config.permission !== undefined && !isRecord(config.permission)) {
    throw inputError('cli-opencode workspace-write cannot merge into OPENCODE_CONFIG_CONTENT: its permission key is not an object');
  }
  return JSON.stringify({ ...config, permission: { ...(config.permission || {}), external_directory: 'deny' } });
}

function buildOpencodeLineageCommand(lineage, prompt, resolvedSandbox, resolvedPermission, options) {
  const parentEnv = options.env || process.env;
  let opencode;
  try {
    opencode = resolveOpencodeBinary(parentEnv);
  } catch (error) {
    throw inputError(`cli-opencode executor unavailable: ${error.message}`);
  }

  const model = lineage.model || OPENCODE_DEFAULT_MODEL;
  const opencodeEffort = pinReasoningEffortForModel(model, lineage.reasoningEffort);
  // Every headless mode runs with --auto, which approves any permission not explicitly
  // denied. workspace-write adds an explicit external_directory deny, which stops the file
  // tools (edit, write, read) at the working directory. Bash is not path-confined in either
  // mode, so this is a compensating control, never a sandbox.
  const workspaceWrite = resolvedSandbox === 'workspace-write';
  const args = [
    'run',
    '--standalone',
    '-m',
    opencodeEffort ? `${model}#${opencodeEffort}` : model,
    '--format',
    'json',
    '--auto',
    prompt,
  ];

  const built = finalizeLineageCommand({
    kind: lineage.kind,
    command: opencode.command,
    args,
    input: '',
    prompt,
    promptArgIndexes: [args.length - 1],
    executableVersion: resolveOpencodeExecutableVersion(opencode.command, options),
    model,
    reasoningEffort: opencodeEffort || null,
    serviceTier: null,
    resolvedSandbox,
    resolvedPermission,
    compensatingControl: workspaceWrite,
    webSearch: effectiveWebSearchPolicy(lineage),
    cwd: options.directoryRoot || process.cwd(),
    ...(workspaceWrite
      ? { env: { OPENCODE_CONFIG_CONTENT: opencodeWorkspaceWriteConfigContent(parentEnv.OPENCODE_CONFIG_CONTENT) } }
      : {}),
  });
  process.stderr.write(workspaceWrite
    ? `WARN: lineage ${lineage.label || '(cli-opencode)'} runs with --auto and external_directory denied: `
      + 'file tools outside the working directory are refused, but Bash is not confined and can still '
      + 'write anywhere, so the lineageDir write boundary is prompt-only for Bash.\n'
    : `WARN: lineage ${lineage.label || '(cli-opencode)'} runs with --auto and no path restriction. `
      + 'The lineageDir write boundary is prompt-only, not sandbox-enforced.\n');
  return built;
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
// Gemini 3.8 Flash High (gemini-3.8-flash-high) replaced the 3.7 tier on 2026-09-04; the first
// Gemini id in the curated Cursor scope — list-verified and dispatch-tested.
// Grok 4.7 (grok-4.7-*) joined alongside Grok 4.5 and 4.6 on 2026-09-26, list-verified and
// dispatch-tested. Cursor lists it without the cursor- prefix the older Grok ids carry.
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
  'gemini-3.8-flash-high',
  'glm-5.2-high',
  'glm-5.2-max',
  'gpt-5.6-luna-max',
  'gpt-5.6-luna-max-fast',
  'grok-4.7-high',
  'grok-4.7-high-fast',
  'grok-4.7-low',
  'grok-4.7-low-fast',
  'grok-4.7-medium',
  'grok-4.7-medium-fast',
  'grok-4.7-xhigh',
  'grok-4.7-xhigh-fast',
]);
// An unpinned lineage falls back to these. They are deliberately NOT the model each
// packet recommends for a hand-written dispatch: that recommendation is advice to an
// operator choosing a model, while these keep an existing fan-out reproducible. A test
// asserts each one matches the fallback its packet documents, so the two cannot drift
// apart again in silence.
//
// Both OpenCode majors share one fallback: OpenCode 2 lists no opencode-go provider at all,
// and llmgateway serves the same model on either major, so a version split would only make
// an unpinned lineage depend on which binary PATH happened to resolve.
const CODEX_DEFAULT_MODEL = 'gpt-6-luna';
const CLAUDE_DEFAULT_MODEL = 'claude-opus-4-8';
const OPENCODE_DEFAULT_MODEL = 'llmgateway/deepseek-v4.1-flash-1017';
const CURSOR_DEFAULT_MODEL = 'composer-2.5';

// Mirrors PI_SUPPORTED_MODELS in executor-config.ts. Pi is a provider
// pass-through with no house model, so this synchronous duplicate keeps
// command construction fail-closed without importing the TypeScript module.
const PI_ALLOWED_MODELS = new Set([
  // DeepSeek V4.1 Flash is DevPass-fronted on pi under its dated 2026-10-17 literal, the
  // default pi model. The undated September literal is not registered in .pi/models.json,
  // so pi cannot run it and it stays off this set. The gateway deactivated the older
  // vision-exp id and returns 410 for it, so the 4.1 line is the live route.
  'deepseek-v4.1-flash-1017',
  // Provider-qualified DeepSeek V4.1 Flash route, for runs that must bill through
  // opencode-go instead of DevPass. The literal names its provider, so it maps to exactly
  // one route and the dated literal above keeps DevPass.
  'opencode-go/deepseek-v4.1-flash',
  'minimax-m3',
  'gpt-6-luna',
  'gpt-6-sol',
  'gpt-6.1-terra',
  'qwen3.8-max',
  // OpenRouter carries exactly DeepSeek V4 Flash and GLM-5.3-Flash; each id keeps its
  // upstream provider path so `${provider}/${model}` composes the full
  // openrouter/<upstream>/<model> selector. A live catalog is not a roster: no other model
  // routes through OpenRouter from here.
  'deepseek/deepseek-v4-flash-vision-exp',
  'z-ai/glm-5.3-flash',
  // DevPass fronts GLM-5.3-Flash under a bare literal, so `${provider}/${model}` composes
  // llmgateway/glm-5.3-flash — distinct from the OpenRouter `z-ai/` literal above. opencode-go
  // fronts the same model, but one literal maps to one provider, so that route is
  // direct-dispatch only and absent here.
  'glm-5.3-flash',
]);
const PI_DEFAULT_MODEL = 'deepseek-v4.1-flash-1017';

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
    const repoRoot = (options && options.readRoot) || (options && options.cwd) || process.cwd();
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
    // Only --sandbox enabled is OS confinement; read-only's plan mode is an approval mode.
    confines: args[args.indexOf('--sandbox') + 1] === 'enabled',
    compensatingControl: args.includes('--mode'),
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
// Gemini 3.8 Flash High returns to this scope by operator decision, accepting the
// billing premium and daily-quota pressure that retired it, and stays reachable
// through cursor as well. Mirrors the note on DEVIN_SUPPORTED_MODELS, including
// the uid spelling: Devin publishes the dashed form, cursor the dotted one.
// The three SWE-2 effort ids joined 2026-09-12. Cognition had already repointed
// the bare `swe` alias to that family, so the default was reaching SWE-2 before
// these ids were pinnable. `swe-2-max` is dispatch-verified on 3000.10.21; the
// other two are list-verified only. There is no bare `swe-2` id to pin.
// The GPT-6 Luna max pair joined 2026-09-24 beside the GPT-5.6 pair, which stays
// because Devin lists the two generations as separate families.
// gpt-6-luna-max-priority is dispatch-verified on 3000.11.1; gpt-6-luna-max is
// list-verified only.
const DEVIN_ALLOWED_MODELS = new Set([
  'deepseek-v4-1-flash-high',
  'deepseek-v4-1-flash-max',
  'deepseek-v4-flash-max',
  'gemini-3-8-flash-high',
  'glm-5-2',
  'glm-5-2-1m',
  'glm-5-2-max',
  'glm-5-2-max-1m',
  'glm-5-2-none',
  'glm-5-2-none-1m',
  'glm-5-3-flash-high',
  'glm-5-3-flash-max',
  'gpt-5-6-luna-max',
  'gpt-5-6-luna-max-priority',
  'gpt-6-luna-max',
  'gpt-6-luna-max-priority',
  'swe',
  'swe-1-7',
  'swe-1-7-lightning',
  'swe-1-7-medium',
  'swe-2-high',
  'swe-2-max',
  'swe-2-medium',
]);
const DEVIN_DEFAULT_MODEL = 'swe-2-max';

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
  // devin CLI. Its --sandbox flag forces an "autonomous" permission mode that
  // IGNORES --permission-mode dangerous and, in non-interactive print mode, rejects
  // every write tool call (there is no one to confirm with). A leaf that must write
  // therefore cannot be given --sandbox. Confinement for write-lineages comes from
  // the fan-out software write-containment guard, not from an OS sandbox. That guard
  // detects an out-of-scope path, records it and quarantines a copy under the lineage;
  // it leaves the bytes in place unless the run opts into restoring, because a path it
  // cannot attribute may belong to a concurrent writer. So the confinement here is
  // after the fact and reported, never prevented. So:
  //   - read-only uses "auto" WITHOUT --sandbox: non-interactive devin auto-approves
  //     native file reads while rejecting shell/exec and write tools, giving genuine
  //     read-only. --sandbox must NOT be added here.
  //   - workspace-write uses "dangerous" WITHOUT --sandbox: writes must be
  //     auto-approved, which --sandbox's autonomous mode refuses; the write-containment
  //     guard reports anything it writes outside its lineage dir instead.
  //   - full access uses "dangerous" WITHOUT --sandbox: autonomous and unconfined.
  const args = ['-p', prompt, '--model', model];
  if (resolvedSandbox === 'read-only') {
    args.push('--permission-mode', 'auto');
  } else {
    // workspace-write and danger-full-access both need auto-approved writes, which
    // the current devin CLI only grants without --sandbox.
    args.push('--permission-mode', 'dangerous');
  }
  // Non-interactive print mode cannot answer the workspace-trust prompt the current
  // devin CLI shows in untrusted dirs, so fresh dispatch directories otherwise fail
  // closed (the leaf explores then exits without producing its artifact).
  args.push('--respect-workspace-trust', 'false');
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
    compensatingControl: resolvedSandbox === 'read-only',
    webSearch,
  });
}

// Provider that fronts each allowlisted Pi model, captured from `pi --list-models`
// (openai fronts the GPT-6 tunes; minimax fronts its own family; opencode-go fronts
// Qwen 3.8 Max; DevPass fronts DeepSeek V4 Flash under its bare literal since 2026-09-07, for
// the same flat-price reason GLM moved there — the direct DeepSeek API provider was retired
// from the roster). Pi selects a model as `<provider>/<id>`; without the
// provider prefix it falls back to its default provider and dispatches the wrong
// model. Hand-duplicated as a plain literal so command construction stays
// synchronous and unit-testable, matching this file's per-kind convention.
const PI_MODEL_PROVIDERS = new Map([
  ['deepseek-v4.1-flash-1017', 'llmgateway'],
  ['opencode-go/deepseek-v4.1-flash', 'opencode-go'],
  ['minimax-m3', 'minimax'],
  ['gpt-6-luna', 'openai'],
  ['gpt-6-sol', 'openai'],
  ['gpt-6.1-terra', 'openai'],
  ['qwen3.8-max', 'opencode-go'],
  // OpenRouter fronts exactly DeepSeek V4 Flash and GLM-5.3-Flash here. Each model id
  // already carries its upstream provider path, so `${provider}/${model}` yields the
  // 3-segment openrouter/<upstream>/<model> selector Pi's OpenRouter roster expects.
  ['deepseek/deepseek-v4-flash-vision-exp', 'openrouter'],
  ['z-ai/glm-5.3-flash', 'openrouter'],
  // DevPass (LLM Gateway) fronts GLM-5.3-Flash under a bare literal, so `${provider}/${model}`
  // yields the two-segment llmgateway/glm-5.3-flash selector the gateway requires: it 400s on a
  // provider-prefixed id. Distinct from the OpenRouter `z-ai/` literal above. opencode-go also
  // fronts this model under the same bare literal, and one literal maps to one provider, so the
  // opencode-go GLM route is direct-dispatch only. DevPass wins the fan-out slot
  // because it is a flat-price subscription and the other two routes bill per token.
  ['glm-5.3-flash', 'llmgateway'],
]);
// A provider-qualified literal already carries its route, so the default
// `${provider}/${model}` composition would repeat the provider. These literals map to the
// exact selector Pi lists for them instead: opencode-go names the model bare.
const PI_MODEL_SELECTORS = new Map([
  ['opencode-go/deepseek-v4.1-flash', 'opencode-go/deepseek-v4.1-flash'],
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
  const selector = PI_MODEL_SELECTORS.get(model) ?? `${provider}/${model}`;
  const args = ['-p', '--offline', '--model', selector];
  // Pi enforces no OS-level sandbox (its flag support intentionally omits one);
  // a read-only leaf is bounded by restricting the tool allowlist to reads AND by
  // disabling auto-discovered extensions, skills, and prompt templates. Their
  // lifecycle code loads and can run independent of the tool allowlist, so a
  // genuinely read-only leaf must not load a write-capable extension/skill/template.
  if (resolvedSandbox === 'read-only') {
    args.push('--tools', 'read,grep,find,ls', '--no-extensions', '--no-skills', '--no-prompt-templates');
  }
  const piEffort = pinReasoningEffortForModel(model, lineage.reasoningEffort);
  if (piEffort) {
    const thinking = REASONING_TO_PI_THINKING.get(piEffort);
    if (!thinking) {
      throw inputError(
        `cli-pi reasoningEffort '${piEffort}' has no pi --thinking mapping: ${[...REASONING_TO_PI_THINKING.keys()].join(', ')}`,
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
    reasoningEffort: piEffort || null,
    serviceTier: null,
    resolvedSandbox,
    resolvedPermission,
    compensatingControl: args.includes('--tools'),
    webSearch: effectiveWebSearchPolicy(lineage),
  });
}

const DSH_ALLOWED_MODELS = new Set([
  'deepseek-v4.1-flash-1017',
  'deepseek-v4.1-flash',
]);
const DSH_DEFAULT_MODEL = 'deepseek-v4.1-flash-1017';
const DSH_VERSION = '0.2.2-rc.3';
const DSH_PERSONA_NAME = /^[a-z0-9][a-z0-9-]{0,63}$/;

// A lineage can throw between creating its harness home and spawning, which skips the
// removal after the run. One exit listener sweeps whatever homes are still pending.
const pendingDshHomes = new Set();
let dshHomeSweepRegistered = false;

const STALE_DSH_HOME_MS = 24 * 60 * 60 * 1000;
// Only the exact name shape mkdtempSync mints is a harness home this runner owns. A link
// is never one, because its target may sit outside the temp folder and a sweep would then
// remove a folder this runner did not create.
const DSH_HOME_NAME = /^dsh-home-[A-Za-z0-9]{6}$/;

/**
 * Remove harness homes a killed lineage left in the temp folder.
 *
 * A harness home is removed in a finally block, but an outer kill skips that block and
 * leaves the home behind for good. A sweep at the next start bounds that leak to one day.
 *
 * @param {number} now - Current time in milliseconds, injectable for tests.
 * @param {string} tmpRoot - Folder to sweep, defaults to the system temp folder.
 * @returns {string[]} The names of the folders removed.
 */
function sweepStaleDshHomes(now = Date.now(), tmpRoot = os.tmpdir()) {
  const removed = [];
  let entries;
  try {
    entries = fs.readdirSync(tmpRoot, { withFileTypes: true });
  } catch {
    return removed;
  }

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.isSymbolicLink() || !DSH_HOME_NAME.test(entry.name)) continue;
    const home = path.join(tmpRoot, entry.name);
    if (pendingDshHomes.has(home)) continue;

    let stat;
    try {
      stat = fs.lstatSync(home);
    } catch {
      continue;
    }
    if (!stat.isDirectory() || stat.isSymbolicLink()) continue;
    if (now - stat.mtimeMs <= STALE_DSH_HOME_MS) continue;

    try {
      fs.rmSync(home, { recursive: true, force: true });
      removed.push(entry.name);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      process.stderr.write(`[fanout-run] could not sweep ${entry.name}: ${message}\n`);
    }
  }

  return removed;
}

function createDshHome() {
  sweepStaleDshHomes();
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-home-'));
  pendingDshHomes.add(home);
  if (!dshHomeSweepRegistered) {
    dshHomeSweepRegistered = true;
    process.once('exit', () => {
      for (const pending of pendingDshHomes) fs.rmSync(pending, { recursive: true, force: true });
    });
  }
  return home;
}

function removeDshHome(home) {
  fs.rmSync(home, { recursive: true, force: true });
  pendingDshHomes.delete(home);
}

function buildDshLineageCommand(lineage, prompt, resolvedSandbox, resolvedPermission, options) {
  const env = options.env || process.env;
  if (!isDshBinaryAvailable(env)) {
    throw inputError('cli-deepseek-harness executor unavailable: command -v dsh failed');
  }
  // Even a version probe creates harness state, so it runs in a throwaway home outside the checkout.
  const probeHome = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-version-'));
  const versionResult = spawnSync('dsh', ['--version'], {
    env: { ...env, DSH_HOME: probeHome },
    cwd: probeHome,
    encoding: 'utf8',
    timeout: 5000,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  fs.rmSync(probeHome, { recursive: true, force: true });
  const actualVersion = typeof versionResult.stdout === 'string' ? versionResult.stdout.trim() : '';
  if (versionResult.error || versionResult.status !== 0 || actualVersion !== DSH_VERSION) {
    throw inputError(
      `cli-deepseek-harness requires dsh ${DSH_VERSION}; found '${actualVersion || 'unknown'}'`,
    );
  }

  const model = lineage.model || DSH_DEFAULT_MODEL;
  if (!DSH_ALLOWED_MODELS.has(model)) {
    throw inputError(
      `cli-deepseek-harness model '${model}' is not in the enforced allowlist: ${[...DSH_ALLOWED_MODELS].join(', ')}`,
    );
  }
  if (typeof options.lineageDir !== 'string' || options.lineageDir.trim() === '') {
    throw inputError('cli-deepseek-harness requires a lineage directory');
  }

  const repoRoot = options.repoRoot || path.resolve(__dirname, '../../../../..');
  const routeName = model === 'deepseek-v4.1-flash-1017'
    ? 'route-llmgateway-deepseek.patch.yml'
    : 'route-opencode-go-deepseek.patch.yml';
  const routePatch = path.join(repoRoot, '.dsh', 'patches', routeName);
  const lineagePatch = path.join(repoRoot, '.dsh', 'patches', 'lineage.patch.yml');
  if (!fs.existsSync(routePatch) || !fs.existsSync(lineagePatch)) {
    throw inputError('cli-deepseek-harness route or lineage patch is missing');
  }

  const args = ['--profile', 'headless', '--patch', routePatch, '--patch', lineagePatch];
  const persona = typeof lineage.agentPersona === 'string' ? lineage.agentPersona.trim() : '';
  if (persona) {
    if (!DSH_PERSONA_NAME.test(persona)) {
      throw inputError(`cli-deepseek-harness agentPersona '${persona}' is not a valid patch name`);
    }
    const personaPatch = path.join(repoRoot, '.dsh', 'agents', `${persona}.patch.yml`);
    if (!fs.existsSync(personaPatch)) {
      throw inputError(`cli-deepseek-harness persona patch '${persona}' is missing`);
    }
    args.push('--patch', personaPatch);
  }
  // An unguarded dispatch must not start, so a missing guards bundle is an input error.
  const guardsPatch = path.join(repoRoot, '.dsh', 'patches', 'guards.patch.yml');
  if (!fs.existsSync(guardsPatch)) {
    throw inputError('cli-deepseek-harness guards patch is missing');
  }
  args.push('--patch', guardsPatch);
  // MCP is opt-in: only a lineage that names code_mode gets the server, and dsh has no other.
  const mcpServers = Array.isArray(lineage.liveTools?.mcpServers) ? lineage.liveTools.mcpServers : [];
  if (mcpServers.some((name) => name !== 'code_mode')) {
    throw inputError('cli-deepseek-harness liveTools.mcpServers may name only code_mode');
  }
  if (mcpServers.length > 0) {
    const mcpPatch = path.join(repoRoot, '.dsh', 'patches', 'mcp-code-mode.patch.yml');
    if (!fs.existsSync(mcpPatch)) {
      throw inputError('cli-deepseek-harness MCP patch is missing');
    }
    args.push('--patch', mcpPatch);
  }

  const permissionMode = resolvedSandbox === 'read-only' ? 'read-only' : 'workspace-write';
  args.push('--json', '--permission-mode', permissionMode, '--approval-policy', 'never', '-');
  const reasoningEffort = pinReasoningEffortForModel(model, lineage.reasoningEffort || 'max');
  return finalizeLineageCommand({
    kind: lineage.kind,
    command: 'dsh',
    args,
    input: prompt,
    prompt,
    promptArgIndexes: [],
    cwd: path.resolve(options.lineageDir),
    executableVersion: resolveExecutableVersion('dsh', options),
    model,
    reasoningEffort,
    // The route patch sets the effort; no flag carries it.
    effortApplied: 'baked',
    serviceTier: null,
    resolvedSandbox,
    resolvedPermission: permissionMode,
    webSearch: effectiveWebSearchPolicy(lineage),
  });
}

// A plugin that fails to load only prints this line and the run carries on unguarded.
const DSH_INACTIVE_PLUGIN = /\bdid not activate\b/;

function validateDshCompletion(exitCode, stdout, stderr = '') {
  if (exitCode !== 0) return `exited with code ${exitCode}`;
  if (DSH_INACTIVE_PLUGIN.test(String(stderr || ''))) return 'reported a plugin that did not activate';
  const lines = String(stdout || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const events = [];
  for (const line of lines) {
    try {
      const event = JSON.parse(line);
      if (event && typeof event === 'object') events.push(event);
    } catch {
      continue;
    }
  }
  if (events.some((event) => event.type === 'error' || event.event === 'error')) {
    return 'emitted an error event';
  }
  if (lines.length === 0) return 'did not emit a final event';
  let finalEvent;
  try {
    finalEvent = JSON.parse(lines[lines.length - 1]);
  } catch {
    return 'did not emit a final event';
  }
  if (!finalEvent || finalEvent.type !== 'final') return 'did not emit a final event';
  if (finalEvent.reason?.kind === 'error') return 'reported an error final reason';
  if (finalEvent.reason?.kind !== 'completed') return 'did not complete successfully';
  return null;
}

const VIBE_VERSION = '3.1.2';
// Mirrors VIBE_SUPPORTED_MODELS in lib/deep-loop/executor-config.ts; the runner and the
// config validator must refuse the same aliases, and a test asserts the copies agree.
const VIBE_ALLOWED_MODELS = new Set(['deepseek-flash', 'glm-flash']);
const VIBE_PARTIAL_REASON = 'partial';

/**
 * True when the `vibe` binary is on PATH for this environment.
 * @param {NodeJS.ProcessEnv} [env] - The environment the probe runs in.
 * @returns {boolean} Whether `command -v vibe` succeeded.
 */
function isVibeBinaryAvailable(env = process.env) {
  const result = spawnSync('/bin/sh', ['-c', 'command -v vibe >/dev/null 2>&1'], {
    env,
    stdio: 'ignore',
  });
  return result.status === 0;
}

function readVibeExportRecord(lineageDir) {
  if (typeof lineageDir !== 'string' || lineageDir.trim() === '') return null;
  try {
    const parsed = JSON.parse(fs.readFileSync(path.join(lineageDir, 'vibe-output', 'export.json'), 'utf8'));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * The verdict a Vibe lineage's export record supports, independent of the pool's settle status.
 *
 * Exit 3 is Vibe's "stopped without finishing" code, so it is a partial run rather than a
 * plain failure, but it still must not count as succeeded. A clean exit with no record, or a
 * record whose exit_code is not the integer 0, is a failure: a denied tool call can leave
 * stdout clean while the run itself did not finish, and a null or string value is not a code.
 */
function resolveVibeLineageOutcome(exitCode, lineageDir) {
  const exportRecord = readVibeExportRecord(lineageDir);
  if (
    exitCode === 0
    && exportRecord
    && Number.isInteger(exportRecord.exit_code)
    && exportRecord.exit_code === 0
    && (exportRecord.outcome === undefined || exportRecord.outcome === 'finished')
  ) {
    return 'success';
  }
  if (exitCode === 3 && exportRecord) return 'partial';
  return 'failure';
}

/**
 * The failure message for a Vibe lineage, or null when it finished cleanly.
 * @param {number} exitCode - The executor process exit code.
 * @param {string} lineageDir - The lineage folder holding vibe-output/export.json.
 * @returns {string|null} The reason the lineage failed, or null on success.
 */
function validateVibeCompletion(exitCode, lineageDir) {
  const outcome = resolveVibeLineageOutcome(exitCode, lineageDir);
  if (outcome === 'success') return null;
  if (outcome === 'partial') return 'reported a partial run (exit 3)';
  const exportRecord = readVibeExportRecord(lineageDir);
  if (!exportRecord) return `exited with code ${exitCode} without an export.json record`;
  // The record's own outcome is the only place an unfinished run is named, so the
  // message carries it; otherwise a failed run reads as a clean exit with a zero code.
  const recordedOutcome = typeof exportRecord.outcome === 'string' && exportRecord.outcome
    ? `, outcome ${exportRecord.outcome}`
    : '';
  return `exited with code ${exitCode} with export.json exit_code ${exportRecord.exit_code}${recordedOutcome}`;
}

/**
 * Build the print-mode `vibe` command for one lineage, with a lineage-local home.
 * @param {object} lineage - The executor row, carrying the model alias.
 * @param {string|object} prompt - The prompt text, or an options object.
 * @param {string} resolvedSandbox - The resolved sandbox policy.
 * @param {string} resolvedPermission - The resolved permission policy.
 * @param {object} [options] - Environment, repo root, prompt and lineage directory.
 * @returns {object} The finalized lineage command.
 */
function buildVibeLineageCommand(lineage, prompt, resolvedSandbox, resolvedPermission, options) {
  // The adapter registry passes the prompt positionally; a direct caller may pass one
  // options object instead, since Vibe reads the prompt from a file rather than argv.
  if (options === undefined && prompt && typeof prompt === 'object') {
    options = prompt;
    prompt = typeof options.prompt === 'string' ? options.prompt : '';
  }
  options = options || {};
  const env = options.env || process.env;
  if (!isVibeBinaryAvailable(env)) {
    throw inputError('cli-mistral-vibe executor unavailable: command -v vibe failed');
  }
  // A version probe still touches Vibe's home, so it runs in a throwaway home outside the
  // checkout and is removed before the lineage's own home is created.
  const probeHome = fs.mkdtempSync(path.join(os.tmpdir(), 'vibe-version-'));
  const versionResult = spawnSync('vibe', ['--version'], {
    env: { ...env, VIBE_HOME: probeHome },
    cwd: probeHome,
    encoding: 'utf8',
    timeout: 5000,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  fs.rmSync(probeHome, { recursive: true, force: true });
  const versionOutput = typeof versionResult.stdout === 'string' ? versionResult.stdout.trim() : '';
  const reportedVersion = versionOutput.replace(/^vibe\s+/i, '').split(/\s+/)[0] || '';
  if (versionResult.error || versionResult.status !== 0 || reportedVersion !== VIBE_VERSION) {
    throw inputError(
      `cli-mistral-vibe requires vibe ${VIBE_VERSION}; found '${reportedVersion || 'unknown'}'`,
    );
  }

  const model = lineage.model;
  if (!VIBE_ALLOWED_MODELS.has(model)) {
    throw inputError(
      `cli-mistral-vibe model '${model}' is not in the enforced allowlist: ${[...VIBE_ALLOWED_MODELS].join(', ')}`,
    );
  }
  if (typeof options.lineageDir !== 'string' || options.lineageDir.trim() === '') {
    throw inputError('cli-mistral-vibe requires a lineage directory');
  }

  const repoRoot = options.repoRoot || path.resolve(__dirname, '../../../../..');
  const repoConfig = path.join(repoRoot, '.vibe', 'config.toml');
  if (!fs.existsSync(repoConfig)) {
    throw inputError('cli-mistral-vibe repository config is missing: .vibe/config.toml');
  }
  // A lineage without the repository's guards would run --auto-approve unguarded, so a
  // missing hooks file refuses the lineage rather than starting it.
  if (!fs.existsSync(path.join(repoRoot, '.vibe', 'hooks.toml'))) {
    throw inputError('cli-mistral-vibe repository hooks are missing: .vibe/hooks.toml');
  }

  fs.mkdirSync(path.resolve(options.lineageDir), { recursive: true });
  // Vibe matches trust entries against the resolved cwd, so a lineage under a symlinked
  // temp root (/var -> /private/var) must be spelled resolved or no project config loads.
  const lineageDir = fs.realpathSync(path.resolve(options.lineageDir));
  const promptFile = path.join(lineageDir, 'vibe-prompt.txt');
  fs.writeFileSync(promptFile, typeof prompt === 'string' ? prompt : '', 'utf8');

  // Vibe reads its model roster and trust store from VIBE_HOME. A fresh home per lineage
  // keeps the operator's ~/.vibe untouched and gives two replicas independent state.
  const vibeHome = path.join(lineageDir, 'vibe-home');
  fs.mkdirSync(vibeHome, { recursive: true });
  fs.copyFileSync(repoConfig, path.join(vibeHome, 'config.toml'));
  fs.writeFileSync(
    path.join(vibeHome, 'trusted_folders.toml'),
    `trusted = [${JSON.stringify(lineageDir)}]\nuntrusted = []\n`,
    'utf8',
  );
  // The lineage folder holds no .vibe/hooks.toml, so the project hooks never load there.
  // The home copy loads whatever the cwd, with each script anchored to the checkout. The
  // renderer is loaded here rather than at module scope, so a checkout without .vibe/
  // fails only its Vibe lineages, never the runner's other executor kinds.
  const rendererPath = path.resolve(
    __dirname,
    '../../../../../.vibe/plugins/repo-guards/render-home-hooks.cjs',
  );
  const { renderHomeHooks } = require(rendererPath);
  renderHomeHooks({ vibeHome, repoRoot });

  const outputDir = path.join(lineageDir, 'vibe-output');
  const args = [
    '--prompt-file', promptFile,
    '--output-dir', outputDir,
    '--trust',
    '--model', model,
    '--auto-approve',
  ];
  return finalizeLineageCommand({
    kind: lineage.kind,
    command: 'vibe',
    args,
    input: '',
    prompt,
    cwd: lineageDir,
    env: { VIBE_HOME: vibeHome },
    executableVersion: resolveExecutableVersion('vibe', options),
    model,
    reasoningEffort: null,
    serviceTier: null,
    // Vibe exposes no confinement flag; recording the requested sandbox as effective would
    // claim a boundary the process never had.
    resolvedSandbox: null,
    resolvedPermission: null,
    webSearch: effectiveWebSearchPolicy(lineage),
  });
}

// A native lineage ran the whole loop as `opencode run --command deep/<loop>`. OpenCode 2
// run has no --command and does not expand a slash message, so that adapter has no
// supported host. Native stays the single-executor kind, dispatched by the workflow.
const NATIVE_LINEAGE_REFUSAL = 'native fan-out lineages are not supported: OpenCode 2 run cannot start a '
  + 'registered command. Give each fan-out lineage a cli-* executor kind, or run the single-executor '
  + 'workflow with --executor=native.';

const LINEAGE_COMMAND_ADAPTERS = Object.freeze({
  'cli-codex': buildCodexLineageCommand,
  'cli-claude-code': buildClaudeLineageCommand,
  'cli-opencode': buildOpencodeLineageCommand,
  'cli-cursor': buildCursorLineageCommand,
  'cli-devin': buildDevinLineageCommand,
  'cli-pi': buildPiLineageCommand,
  'cli-deepseek-harness': buildDshLineageCommand,
  'cli-mistral-vibe': buildVibeLineageCommand,
});

/**
 * Build the subprocess command and deterministic invocation identity for a lineage.
 *
 * @returns {{command:string,args:string[],input?:string,cwd?:string,effectiveConfig:Object,invocationFingerprint:string}}
 */
function buildLineageCommand(lineage, prompt, resolvedSandbox, resolvedPermission, options = {}) {
  if (lineage.kind === 'native') {
    throw inputError(NATIVE_LINEAGE_REFUSAL);
  }
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

// Claude and OpenCode were the only two kinds spawning without this check, so an absent
// binary surfaced as a spawn failure mid-lineage rather than a refusal before the run.
function isClaudeBinaryAvailable(env = process.env) {
  const result = spawnSync('/bin/sh', ['-c', 'command -v claude >/dev/null 2>&1'], {
    env,
    stdio: 'ignore',
  });
  return result.status === 0;
}

function isOpencodeBinaryAvailable(env = process.env) {
  try {
    resolveOpencodeBinary(env);
    return true;
  } catch {
    return false;
  }
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

function isDshBinaryAvailable(env = process.env) {
  const result = spawnSync('/bin/sh', ['-c', 'command -v dsh >/dev/null 2>&1'], {
    env,
    stdio: 'ignore',
  });
  return result.status === 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const args = readTextFileFlags(parseArgs());
  // A read-only view of a run in flight or settled: it reads the ledger and exits
  // before any config, lineage or ledger write is touched.
  if (args.status === true || args.status === 'true') {
    const statusLedgerPath = path.join(ensureString(args, 'baseArtifactDir'), 'orchestration-status.log');
    if (!fs.existsSync(statusLedgerPath)) throw inputError(`no fan-out status ledger at ${statusLedgerPath}`);
    process.stdout.write(`${formatFanoutStatusTable(readLedgerRecords(statusLedgerPath))}\n`);
    return;
  }
  const specFolder = validateNamespaceValue(ensureString(args, 'specFolder'), 'specFolder', inputError);
  const loopType = ensureString(args, 'loopType');
  assertActiveFanoutLoopType(loopType);
  // Optional shared research question, threaded into each lineage prompt so a research
  // fan-out can bind research_topic. Absent for review, which scopes by folder. Collapsed
  // to one line like the review focus, so a line break cannot forge a binding below it.
  const normalizedTopic = typeof args.researchTopic === 'string'
    ? args.researchTopic.replace(REVIEW_FOCUS_CONTROL_PATTERN, ' ').replace(/\s+/g, ' ').trim()
    : '';
  const researchTopic = normalizedTopic || null;
  // Optional operator review focus, carried into every review lineage beside its dimensions.
  const reviewFocus = normalizeReviewFocus(args.reviewFocus);
  if (reviewFocus && loopType !== 'review') {
    throw inputError('reviewFocus applies only to the review loop type');
  }
  if ((args.reviewTarget || args.reviewTargetType) && loopType !== 'review') {
    throw inputError('reviewTarget applies only to the review loop type');
  }
  const reviewTargetBinding = resolveReviewTarget(args.reviewTarget, args.reviewTargetType, specFolder);
  const fanoutConfigJson = ensureString(args, 'fanoutConfigJson');
  const baseArtifactDir = validateBaseArtifactDir(ensureString(args, 'baseArtifactDir'), specFolder, loopType);
  const convergenceThreshold = parseOptionalNumber(args, 'convergenceThreshold');
  const lineageTimeoutHoursOverride = parseOptionalNumber(args, 'lineageTimeoutHours');
  const maxIterationsFlag = parseMaxIterationsFlag(args);
  assertLineageTimeoutHoursOverrideWithinCeiling(lineageTimeoutHoursOverride);
  const stopPolicy = normalizeStopPolicy(args.stopPolicy);
  const convergenceMode = normalizeConvergenceMode(args.convergenceMode);
  const depthMode = normalizeDepthMode(args.depthMode);
  const containmentModeOverride = normalizeContainmentMode(args.containmentMode);

  const {
    parseFanoutConfig,
    expandLineages,
    preflightFanoutCapabilities,
    resolveSandboxMode,
    resolveClaudePermissionMode,
  } = await import('../lib/deep-loop/executor-config.ts');
  const { buildExecutorDispatchEnv, detectSameKindFromStack, CLI_DISPATCH_STACK_ENV } = await import('../lib/deep-loop/executor-audit.ts');
  const { snapshotOutOfScopeDirtyPaths, enforceWriteContainment, drainGitContentionWarnings, __internals: containmentInternals } = await import('../lib/deep-loop/write-containment.ts');
  const {
    DEFAULT_LINEAGE_TIMESTAMP_TOLERANCE_MS,
    checkLineageCompletion,
    checkLineageTimestampWindow,
  } = await import('../lib/deep-loop/lineage-timestamp-window.ts');
  // Route the executor spawn through the shipped effect gateway so a
  // fail-closed intent is recorded before the subprocess runs and a
  // confirmation after, into the effect ledger the enablement step reads.
  const { dispatchExecutorEffect } = await import('../lib/deep-loop/fanout-effect-dispatch.ts');

  maybeThrowTestFault();

  let rawConfig;
  try {
    rawConfig = JSON.parse(fanoutConfigJson);
  } catch {
    throw inputError('fanoutConfigJson is not valid JSON');
  }

  const lineagesDir = path.join(baseArtifactDir, 'lineages');
  const ledgerPath = path.join(baseArtifactDir, 'orchestration-status.log');
  // Placed before the live-lineage refusal, which throws in exactly the state a stop is for.
  if (args.stop !== undefined) {
    if (args.stop !== true) throw inputError('--stop takes no value');
    const stopOutcome = await stopLiveFanoutRun(ledgerPath);
    const stopExitCode = stopOutcome.survivors.length > 0 || stopOutcome.refused.length > 0 ? 2 : 0;
    jsonOut({ status: stopExitCode === 0 ? 'ok' : 'partial', ...stopOutcome });
    process.exit(stopExitCode);
  }
  const summaryPath = path.join(baseArtifactDir, 'orchestration-summary.json');
  // This process appends to its own ledgers throughout every lineage's dispatch —
  // a heartbeat on a timer, plus each start and settle. They sit above every
  // lineage dir, so a tree diff attributes the supervisor's own bookkeeping to
  // whichever leaf happened to be running, and once these files are committed the
  // revert restores them from HEAD and erases the record of the run in progress.
  // Named as whole paths so a neighbour sharing a prefix stays guarded.
  const orchestratorOwnedPaths = [
    ledgerPath,
    summaryPath,
    observabilityPathForLedger(ledgerPath),
  ];
  // Repo root for write containment, resolved once for the whole run: the working
  // directory, unless an operator pins DEEP_LOOP_REPO_ROOT or the artifact tree
  // resolves into a different checkout via symlink. Every lineage lives under the
  // same tree, so this is the same for all of them (see runtime-bootstrap).
  const containmentRepoRoot = require('./runtime-bootstrap.cjs')
    .resolveContainmentRepoRoot(process.env, process.cwd(), {
      artifactDir: lineagesDir,
      gitToplevel: (dir) => containmentInternals.resolveGitToplevel(dir),
    });
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const parsedFanoutConfig = parseFanoutConfig(rawConfig);
  // CLI flag first, then the fan-out config value, then the schema default. Mutable
  // because a detected second writer latches this run into preserve for good.
  let containmentMode = containmentModeOverride ?? parsedFanoutConfig.containment.mode ?? 'preserve';
  const containmentChurnThreshold = parsedFanoutConfig.containment.churnThreshold;
  // The cumulative arm needs no flag of its own: it takes the same config route the per-window
  // threshold already takes, and a caller who wants one arm and not the other sets the other
  // to 0.
  const containmentChurnCumulativeThreshold = parsedFanoutConfig.containment.churnCumulativeThreshold;

  const rawGuardConfig = rawConfigWithCliBudgetOverrides(rawConfig, args);
  const stallWatchdogMs = normalizeStallWatchdogMs(rawGuardConfig);
  const lineageBudgetGuards = normalizeLineageBudgetGuards(rawGuardConfig);
  const guardedAssignment = applyFlatPoolAssignmentGuard(parsedFanoutConfig);
  const fanoutConfig = guardedAssignment.config;
  const matrixExpandedLineages = expandLineages(fanoutConfig);
  const expandedLineages = flagLineageBudgets(matrixExpandedLineages, maxIterationsFlag);
  for (const note of flagLineageBudgetNotes(matrixExpandedLineages, expandedLineages)) {
    process.stderr.write(`${note}\n`);
  }
  const nativeLineages = expandedLineages.filter((lineage) => lineage.kind === 'native');
  if (nativeLineages.length > 0) {
    const labels = nativeLineages.map((lineage) => lineage.label).join(', ');
    throw inputError(`fan-out refused for lineage(s) ${labels}: ${NATIVE_LINEAGE_REFUSAL}`);
  }
  const expansiveBudgets = depthMode === 'expansive' && ACTIVE_FANOUT_LOOP_TYPES.has(loopType);
  const budgetPartition = expansiveBudgets
    ? partitionFrontierNodes(baseArtifactDir, expandedLineages.map((lineage) => lineage.label))
    : null;
  const matrixLineages = expansiveBudgets
    ? expansiveLineageBudgets(expandedLineages, { loopType, partition: budgetPartition })
    : expandedLineages;
  if (expansiveBudgets) {
    for (const note of expansiveLineageBudgetNotes(expandedLineages, matrixLineages, budgetPartition)) {
      process.stderr.write(`${note}\n`);
    }
  }
  // A rerun of one lineage names it against the same matrix, so the lineage keeps the
  // budget and frontier share it had in the full run and nobody edits the matrix by hand.
  if (args.onlyLineage !== undefined
    && (typeof args.onlyLineage !== 'string'
      || !matrixLineages.some((lineage) => lineage.label === args.onlyLineage))) {
    throw inputError(
      `--only-lineage must name a lineage of this executor matrix (${matrixLineages.map((lineage) => lineage.label).join(', ')})`,
    );
  }
  const allLineages = args.onlyLineage === undefined
    ? matrixLineages
    : matrixLineages.filter((lineage) => lineage.label === args.onlyLineage);
  // One lineage is not a fan-out. A caller who lands here with one lineage has left the
  // workflow that owns the packet init, synthesis and save phases, and a CLI lineage
  // would then run every iteration in one process.
  if (ACTIVE_FANOUT_LOOP_TYPES.has(loopType)
    && matrixLineages.length === 1
    && args.onlyLineage === undefined) {
    throw inputError(
      `fan-out refused: this ${loopType} executor matrix expands to one lineage. `
        + `Run the single-executor /deep:${loopType} workflow instead; it runs the packet `
        + 'init, synthesis and save phases, which this runner does not.',
    );
  }
  if ((loopType === 'research' || loopType === 'review') && stopPolicy === 'max-iterations') {
    const uncappedLineages = allLineages.filter((lineage) => (
      !Number.isInteger(lineage.iterations) || lineage.iterations <= 0
    ));
    if (uncappedLineages.length > 0) {
      const labels = uncappedLineages.map((lineage) => lineage.label).join(', ');
      throw inputError(
        `stopPolicy=max-iterations requires a positive lineage iteration cap for lineage(s): ${labels}`,
      );
    }
  }
  try {
    preflightFanoutCapabilities(allLineages);
  } catch (error) {
    throw inputError(error instanceof Error ? error.message : String(error));
  }
  for (const lineage of allLineages) {
    const hint = claudePermissionHint(lineage, resolveClaudePermissionMode(lineage.sandboxMode));
    if (hint) process.stderr.write(`[fanout-run] warning: ${hint}\n`);
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

  // One builder for the real dispatch and the preview, so the preview shows the command
  // a run would spawn and not a reconstruction of it.
  const buildLineageDispatch = (lineage, lineageDir, frontierScope) => {
    const sessionId = readStoredLineageSessionId(loopType, lineageDir) || `fanout-${lineage.label}-${runId}`;
    const promptLineageDir = path.resolve(process.cwd(), lineageDir);
    const prompt = buildLoopPrompt(loopType, specFolder, promptLineageDir, sessionId, lineage, researchTopic, {
      convergenceThreshold,
      convergenceMode,
      depthMode,
      frontierScope,
      stopPolicy,
      reviewFocus,
      reviewTarget: reviewTargetBinding.target,
      reviewTargetType: reviewTargetBinding.type,
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
    // cli-opencode takes the same workspace-write default. It has no OS-level sandbox, so its
    // builder honours workspace-write by denying external_directory to the file tools and
    // records that as a compensating control: Bash can still write outside the working
    // directory. An explicit read-only is refused in finalizeLineageCommand.
    const effectiveSandbox = resolveSandboxMode(lineage.sandboxMode);
    const effectivePermission = resolveClaudePermissionMode(lineage.sandboxMode);

    const built = buildLineageCommand(lineage, prompt, effectiveSandbox, effectivePermission, {
      loopType,
      specFolder,
      lineageDir: promptLineageDir,
      sessionId,
      convergenceThreshold,
      convergenceMode,
      depthMode,
      frontierScope,
      stopPolicy,
      researchTopic,
      reviewFocus,
      reviewTarget: reviewTargetBinding.target,
      reviewTargetType: reviewTargetBinding.type,
    });
    return { ...built, sessionId, prompt, promptLineageDir, effectivePermission };
  };

  // A preview builds every lineage's command exactly as a run would, prints it with the
  // prompt replaced by its digest, and exits before any directory, ledger, lock,
  // checkpoint or frontier store is written.
  if (args.preview === true || args.preview === 'true') {
    const previewPartition = resolveFrontierPartition({
      depthMode,
      budgetPartition,
      baseArtifactDir,
      labels: allLineages.map((lineage) => lineage.label),
    });
    const lineages = allLineages.map((lineage) => {
      if (lineage.kind === 'cli-mistral-vibe') {
        return {
          label: lineage.label,
          kind: lineage.kind,
          command: null,
          note: 'cli-mistral-vibe writes its home and prompt file into the lineage directory '
            + 'while its command is built, so the preview does not build it',
        };
      }
      const frontierScope = previewPartition ? (previewPartition[lineage.label] || []).map((node) => node.nodeId) : [];
      const built = buildLineageDispatch(lineage, path.join(lineagesDir, lineage.label), frontierScope);
      const promptToken = `<prompt:${digestText(built.prompt)}>`;
      return {
        label: lineage.label,
        kind: lineage.kind,
        command: built.command,
        args: built.redactedArgs,
        ...(typeof built.input === 'string' ? { stdin: built.input === built.prompt ? promptToken : '<input>' } : {}),
        cwd: built.cwd ?? process.cwd(),
        // The Claude config dir reaches the child through its environment, not the argv.
        ...(lineage.kind === 'cli-claude-code' && lineage.configDir
          ? { config_dir: validateClaudeConfigDir(lineage.configDir) }
          : {}),
        session_id: built.sessionId,
        iterations: lineage.iterations ?? null,
        frontier_scope: frontierScope,
        effective_config: built.effectiveConfig,
        invocation_fingerprint: built.invocationFingerprint,
      };
    });
    // The aggregate sums one attempt per lineage, which is what its cap gates on, while each
    // lineage's estimated_cost_units also counts every retry. The two keys share a name, so
    // the preview says what each one counts.
    const aggregateBudget = {
      ...aggregateBudgetDecision,
      units: {
        'upper_bound.estimated_cost_units':
          'sum of every lineage\'s base_cost_units: one attempt each, the spend the aggregate cap gates on',
        'upper_bound.per_lineage[].base_cost_units':
          'iterations x cost units per iteration for one attempt of this lineage',
        'upper_bound.per_lineage[].estimated_cost_units':
          'base_cost_units x (retries + 1): the worst case if every retry runs; reported, never gated',
      },
    };
    // The halt line a dry run prints for the spawn this preview withheld, written here so it
    // does not depend on the conductor composing it.
    const dryRunHalt = {
      type: 'event',
      event: 'dry_run_halt',
      mode: loopType,
      boundary: 'child-spawn',
      step: 'step_fanout_spawn',
      timestamp: new Date().toISOString(),
      detail: `fanout-run --preview previewed ${lineages.length} lineage(s) `
        + `(${lineages.map((lineage) => lineage.label).join(', ')}), spawned none and wrote nothing`,
    };
    const topicDigest = researchTopic ? digestText(researchTopic) : null;
    jsonOut({
      status: 'preview', topic_digest: topicDigest, dry_run_halt: dryRunHalt, lineages, aggregate_budget: aggregateBudget,
    });
    return;
  }
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
  const frontierPartition = resolveFrontierPartition({
    depthMode,
    budgetPartition,
    baseArtifactDir,
    labels: cliLineages.map((lineage) => lineage.label),
  });
  const frontierPartitionSummary = frontierPartition
    ? { frontier_partition: Object.fromEntries(Object.entries(frontierPartition).map(([label, nodes]) => [label, nodes.map((node) => node.nodeId)])) }
    : {};
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
  // A lineage that outlived its runner still holds the lineage directory and the
  // stored session id. Dispatching under that same directory would put a second
  // writer beside it, so refuse the whole run before any orphan mark or spawn and
  // let the operator stop the surviving process first.
  const liveLineages = detectLiveLineages(readLedgerRecords(ledgerPath));
  if (liveLineages.length > 0) {
    const running = liveLineages
      .map((lineage) => `${lineage.label} (pid ${lineage.pid})`)
      .join(', ');
    throw inputError(
      `fan-out refused: lineage still running from an earlier run: ${running}. `
        + 'Stop it before re-running.',
    );
  }
  // Judged once, before any attempt: a retry of a lineage that failed after writing its
  // completed config must meet the strict check again, not be waved through as finished.
  const finishedLineageSkipReasons = new Map();
  const finishedLineageRefusals = [];
  // A vibe command writes its home and prompt file into the lineage folder while it is built,
  // so a finished vibe lineage is matched on its kind alone instead of being built in place.
  const currentEffectiveConfig = (lineage, lineageDir) => {
    if (lineage.kind === 'cli-mistral-vibe') return { kind: lineage.kind };
    const frontierScope = frontierPartition ? (frontierPartition[lineage.label] || []).map((node) => node.nodeId) : [];
    try {
      return buildLineageDispatch(lineage, lineageDir, frontierScope).effectiveConfig;
    } catch {
      return null;
    }
  };
  for (const lineage of cliLineages) {
    const lineageDir = path.join(lineagesDir, lineage.label);
    const skipReason = finishedLineageSkipReason({ loopType, lineageDir, lineage, stopPolicy });
    if (!skipReason) continue;
    const mismatch = finishedLineageMismatch({
      loopType,
      lineageDir,
      label: lineage.label,
      binding: loopType === 'review' ? reviewTargetBinding.target : researchTopic,
      effectiveConfig: currentEffectiveConfig(lineage, lineageDir),
    });
    if (mismatch) finishedLineageRefusals.push(mismatch);
    else finishedLineageSkipReasons.set(lineage.label, skipReason);
  }
  // A skipped lineage hands its old results to the merge, which reads every lineage folder.
  // Refusing only the mismatched ones would still merge them beside the fresh ones, so one
  // mismatch refuses the whole run before any orphan mark, spawn or summary write.
  if (finishedLineageRefusals.length > 0) {
    throw inputError(`fan-out refused (${FINISHED_LINEAGE_MISMATCH_REASON}): ${finishedLineageRefusals.join('; ')}`);
  }
  const orphanedLineages = markOrphanedLineages(ledgerPath);
  const initialRetryCounts = readRetryCountsFromLedger(ledgerPath);
  const rootLineageValues = readRootLineageValues(loopType, baseArtifactDir);

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
    // Each lineage still running is closed with its own row, so the next run neither
    // requeues it as an orphan nor charges it a retry, and the summary reads it as stopped.
    const ledgerRecords = readLedgerRecords(ledgerPath);
    for (const lineage of cliLineages) {
      const snapshot = lineageSnapshots.get(lineage.label);
      if (!snapshot || snapshot.status !== 'running') continue;
      const spawnedRow = ledgerRecords.filter((record) => record
        && record.event === 'spawned'
        && record.label === lineage.label).at(-1);
      appendFanoutStatusLedger(ledgerPath, stoppedLineageRow({
        label: lineage.label,
        pid: spawnedRow ? Number(spawnedRow.pid) : null,
        signal,
      }));
      redactTerminalLineageLogs(path.join(lineagesDir, lineage.label));
      lineageSnapshots.set(lineage.label, { ...snapshot, status: 'stopped', stopped_at_iso: stoppedAtIso });
    }
    const partial = summarizeSnapshots(cliLineages, lineageSnapshots);
    const gauges = {
      lag: latestGauges.lag,
      pending: latestGauges.pending,
      failed: Math.max(latestGauges.failed, partial.summary.failed),
    };
    appendFanoutStatusLedger(ledgerPath, {
      event: 'run_stopped',
      status: 'stopped',
      run_id: runId,
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
      ...frontierPartitionSummary,
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
  // Recorded with each spawn, so a --stop can still reach this runner once a lineage's
  // leader has exited and its kernel parent link is gone.
  const runnerProcessStart = processStartOf(process.pid);

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
      if (enrichedEvent.event === 'completed' && enrichedEvent.label) {
        redactTerminalLineageLogs(path.join(lineagesDir, enrichedEvent.label));
      }
      // Only the pool knows when a failure has no retry left. Said the moment it settles,
      // so an operator watching the run learns a lineage is gone before the run ends.
      if (enrichedEvent.event === 'failed' && enrichedEvent.terminal === true) {
        if (enrichedEvent.label) redactTerminalLineageLogs(path.join(lineagesDir, enrichedEvent.label));
        const error = enrichedEvent.error || {};
        process.stderr.write(
          `[fanout-run] lineage ${enrichedEvent.label} failed (${error.failure_class || 'unknown'}): `
            + `${String(error.message || 'no message').slice(0, 400)}\n`,
        );
      }
    },
    worker: async (lineage, context) => {
      const slotWindowStartIso = new Date().toISOString();
      const hrStart = process.hrtime();
      const attempt = Number.isFinite(Number(context.attempt)) ? Number(context.attempt) : 1;
      const livenessKey = `${lineage.label}:${attempt}`;
      const lineageDir = path.join(lineagesDir, lineage.label);
      const skipReason = finishedLineageSkipReasons.get(lineage.label);
      if (skipReason) {
        appendFanoutStatusLedger(ledgerPath, {
          event: 'skipped_complete',
          status: 'skipped',
          label: lineage.label,
          attempt,
          run_id: runId,
          reason: skipReason,
          at: new Date().toISOString(),
        });
        process.stderr.write(`[fanout-run] lineage ${lineage.label} skipped: ${skipReason}\n`);
        return { label: lineage.label, exitCode: 0, timedOut: false, skipped: true, skipReason };
      }
      if (frontierPartition) writeLineageFrontierStore(lineageDir, frontierPartition[lineage.label] || [], { inbox: loopType !== 'review' });
      const frontierScope = frontierPartition ? (frontierPartition[lineage.label] || []).map((node) => node.nodeId) : [];

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

      const stateDir = path.join(lineageDir, '.executor-state');
      fs.mkdirSync(lineageDir, { recursive: true });
      fs.mkdirSync(stateDir, { recursive: true });
      // The harness writes profiles and an anonymous id into its home, so the home sits outside
      // the checkout where nothing can commit it, and it is removed once the lineage settles.
      const dshHome = lineage.kind === 'cli-deepseek-harness'
        ? createDshHome()
        : null;

      const {
        sessionId,
        promptLineageDir,
        effectivePermission,
        command,
        args: cmdArgs,
        input,
        cwd: commandCwd,
        env: commandEnv,
        effectiveConfig,
        invocationFingerprint,
      } = buildLineageDispatch(lineage, lineageDir, frontierScope);

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
        // fully inert. ENFORCE=0 alone is NOT enough -- that only stops the deny, while
        // an unbound child could still open the gate and meet the mutation-time notice
        // instead of doing its work. DISABLED makes both classify and enforce no-ops;
        // AI_SESSION_CHILD lets the session wrapper exec in place.
        // buildExecutorDispatchEnv filters these keys (outside the per-kind allowlist),
        // so they are re-injected here to reach the child. Harmless for the codex path.
        SYSTEM_SPEC_GATE_DISABLED: '1',
        AI_SESSION_CHILD: '1',
        // The coverage graph store defaults to the shared runtime database, which sits
        // outside the lineage's write surface, so a leaf that honors the write limit
        // skips every graph step and the lineage stops only at its cap. Each lineage
        // keeps its own store inside its directory instead.
        DEEP_LOOP_COVERAGE_DB_DIR: path.join(promptLineageDir, 'graph-db'),
        ...(stateEnvKey ? { [stateEnvKey]: stateDir } : {}),
        ...(dshHome ? { DSH_HOME: dshHome } : {}),
        // The adapter names its own lineage-local home; applying it after the allowlist
        // filter keeps an inherited VIBE_HOME from reaching the child.
        ...(commandEnv || {}),
        // The repo-guards goal bridge names the packet from this marker. The env allowlist
        // drops every DSH_ key, and the lineage runs from its own folder, so the path is
        // re-injected here as an absolute path.
        ...(lineage.kind === 'cli-deepseek-harness'
          ? { DSH_SPEC_FOLDER: path.resolve(process.cwd(), specFolder) }
          : {}),
        // The Vibe session-start hook names the packet from this marker, on the same terms.
        // Every Vibe lineage runs the session-start dist check, and its default self-heal
        // compiles into the checkout; parallel lineages would race that compile, so a
        // lineage keeps the warning and leaves the rebuild to the parent session.
        ...(lineage.kind === 'cli-mistral-vibe'
          ? { VIBE_SPEC_FOLDER: path.resolve(process.cwd(), specFolder), SPECKIT_DIST_AUTO_REBUILD: '0' }
          : {}),
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

      // A non-streaming executor (a print-mode CLI that returns output only at the
      // end) emits no incremental stdout, so the stall-watchdog and the pool's stall
      // clock -- both fed by streamed output -- would flag a genuinely-working lineage
      // as idle and, where the abort/orphan guards are armed, requeue it. Count real
      // artifact writes under the lineage dir as liveness: while iteration and state
      // files keep appearing, the lineage is making progress regardless of streaming,
      // and a lineage that writes nothing at all is still caught by its own timeout.
      const stopArtifactProgressPoller = startLineageArtifactProgressPoller({
        lineageDir,
        cadenceMs: computeArtifactPollCadenceMs(progressHeartbeatMs),
        onArtifactProgress: () => {
          markLineageEvent();
          if (typeof context.reportProgress === 'function') context.reportProgress();
        },
      });

      // Every dispatch kind runs write-containment uniformly: an out-of-scope path is
      // preserved on disk and reported (never deleted, and never restored from HEAD by
      // default). That makes monitoring every kind safe even for dispatch models whose
      // CLI may legitimately write outside lineageDir -- the guard can no longer destroy
      // such a write, only flag it.
      const containmentEnabled = true;
      // containmentRepoRoot is resolved once per run above.
      // A snapshot that spends its whole retry budget losing to a neighbour's
      // .git/index.lock returns exactly what a clean tree returns. The loss is reported
      // on the ledger rather than left to read as a clean tree, and the lane's verdict
      // is untouched: an empty snapshot stays the guard's fail-open answer.
      const appendContainmentGitContentionWarnings = () => {
        for (const warning of drainGitContentionWarnings()) {
          appendFanoutStatusLedger(ledgerPath, {
            type: 'event',
            event: 'containment_git_contention',
            severity: 'warning',
            at: new Date().toISOString(),
            label: lineage.label,
            run_id: runId,
            loop_type: loopType,
            spec_folder: specFolder,
            iteration: attempt,
            command: warning.command,
            attempts: warning.attempts,
            gauges: latestGauges,
          });
        }
      };
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
      // A concurrent run in a sibling PHASE folder is the same unattributable-writer problem as
      // a sibling lineage, one level up: its artifact dir is not under this run's base dir, so
      // nothing above knows about it. Discovered from the live locks under the shared packet, and
      // re-discovered before the containment check because such a run can start mid-iteration.

      const staticUnattributableDirs = [
        ...siblingLineageDirs,
        ...kindLegitimateDirs,
        // The run's artifact plane is written live by the supervisor and by siblings as they
        // publish, so a checkout-rooted scan cannot tell those writes from a lane's stray one.
        // Exempting the plane also covers the published, staging and claim names a scan would
        // otherwise read as new paths; the exemption is inert for a tree-rooted scan, which
        // never reaches outside its own tree.
        lineagesDir,
      ];

      // Kept for the containment check as well as the baseline: a run that was live when this
      // leaf started but released its lock before the check would otherwise have the files it
      // left behind become unowned, and land back on this leaf.
      const preDispatchForeignRunDirs = containmentEnabled
        ? await discoverForeignLiveRunDirs({ specFolder, baseArtifactDir })
        : [];
      const preDispatchDirtyPaths = containmentEnabled
        ? snapshotOutOfScopeDirtyPaths({
          repoRoot: containmentRepoRoot,
          artifactDir: lineageDir,
          captureContentDir: lineageDir,
          unattributableDirs: [...staticUnattributableDirs, ...preDispatchForeignRunDirs],
          unattributablePaths: orchestratorOwnedPaths,
        })
        : [];
      appendContainmentGitContentionWarnings();

      // Churn sampling reuses the containment snapshot, exclusions included, so a
      // sibling lineage's in-flight writes are not mistaken for a foreign writer's.
      const sampleSharedCheckoutChurn = startSharedCheckoutChurnDetector({
        threshold: containmentChurnThreshold,
        cumulativeThreshold: containmentChurnCumulativeThreshold,
        sampleDirtyPaths: () => {
          const dirtyPaths = snapshotOutOfScopeDirtyPaths({
            repoRoot: containmentRepoRoot,
            artifactDir: lineageDir,
            unattributableDirs: [...staticUnattributableDirs, ...preDispatchForeignRunDirs],
            unattributablePaths: orchestratorOwnedPaths,
          }).map((entry) => entry.path);
          appendContainmentGitContentionWarnings();
          return dirtyPaths;
        },
        onDetected: ({ newlyDirty, cumulativeDirty }) => {
          // Latch preserve for the rest of the run, overriding the flag and the
          // config: a later quiet sample cannot un-prove the foreign writer this
          // sample shows, and restore acts on bytes this run did not write. Set
          // before the append so a ledger write failure cannot leave the
          // destructive mode armed on a checkout another writer shares.
          containmentMode = 'preserve';
          appendFanoutStatusLedger(ledgerPath, {
            event: 'shared_checkout_detected',
            label: lineage.label,
            at: new Date().toISOString(),
            severity: 'warning',
            newly_dirty_paths: newlyDirty,
            churn_threshold: containmentChurnThreshold,
            // Reported whichever arm fired, so a burst that pre-empted the running total
            // still says how far along it was.
            cumulative_dirty_paths: cumulativeDirty,
            churn_cumulative_threshold: containmentChurnCumulativeThreshold,
            gauges: latestGauges,
          });
        },
      });

      // The attempt's stdout reaches its log file only on exit, so the progress row
      // judges the passes of the attempt in flight from the copy kept here.
      let liveStdout = '';
      // Started here so the sampler exists for every heartbeat it takes; the first
      // sample is the baseline, so no detection can fire before dispatch.
      const stopProgressHeartbeat = startLineageProgressHeartbeat({
        cadenceMs: progressHeartbeatMs,
        label: lineage.label,
        ledgerPath,
        getGauges: () => latestGauges,
        onProgress: () => {
          sampleSharedCheckoutChurn();

        },
        getProgress: () => readLineageProgressFields(lineageDir, liveStdout),
      });

      let result;
      try {
        // The dispatch options carry the liveness callbacks, abort signal, and
        // streaming hooks the runner needs; they are forwarded verbatim through
        // the effect gateway so liveness tracking stays identical to a direct
        // spawn. The canonical mode name (not the raw loopType) keys the effect
        // ledger so the enablement consumer can read it back.
        const dispatchOpts = {
          cwd: commandCwd ?? process.cwd(),
          timeoutMs,
          env: dispatchEnv,
          maxBuffer: 20 * 1024 * 1024,
          abortSignal: context.signal,
          onOutput: (chunk) => {
            markLineageEvent();
            if (typeof chunk === 'string') liveStdout += chunk;
          },
          onSpawn: ({ pid }) => {
            lineageProcessLiveness.set(livenessKey, { alive: true, pid });
            // The in-memory map dies with this runner, so the pid a later run needs
            // to prove this lineage is still alive has to reach the durable ledger.
            // The start time lets a later --stop tell this process from a reuse of its pid.
            const processStart = processStartOf(pid);
            appendFanoutStatusLedger(ledgerPath, {
              event: 'spawned',
              label: lineage.label,
              attempt,
              pid,
              at: new Date().toISOString(),
              status: 'running',
              ...(processStart ? { process_start: processStart } : {}),
              ...(runnerProcessStart ? { runner_pid: process.pid, runner_start: runnerProcessStart } : {}),
            });
          },
          onExit: ({ pid, exitedAtMs }) => {
            lineageProcessLiveness.set(livenessKey, { alive: false, pid, exitedAtMs });
          },
          ...(typeof input === 'string' ? { input } : {}),
        };
        result = await dispatchExecutorEffect({
          lineageDir,
          canonicalMode: loopType === 'review' ? 'deep-review' : 'deep-research',
          sessionId,
          lineageLabel: lineage.label,
          attempt,
          command,
          cmdArgs,
          dispatchOpts,
          dispatch: (cmd, args, opts) => runLineageProcess(cmd, args, opts),
        });
      } finally {
        stopArtifactProgressPoller();
        stopProgressHeartbeat();
        stopStallWatchdog();
      }

      // Write-containment observes the tree once the lane process has ended and BEFORE any
      // verdict gate below decides the outcome. A lane that exits non-zero, is killed, or
      // leaves artifacts missing is exactly the one whose out-of-scope writes must still be
      // snapshotted, quarantined and reported; running the guard after the gates would skip
      // those lanes entirely. The gates keep their own verdict: a finding is recorded on the
      // ledger and never turns a failed lane into a passing one.
      //
      // Uniform across every dispatch kind: diff the working tree for NEW
      // out-of-artifact-dir writes. Under the default preserve mode the path stays on disk
      // and is reported, never deleted, since it may be a concurrent parent/sibling write
      // this leaf cannot be proven to own; restore mode is an explicit opt-in that rolls a
      // path back. The leaf must still be free to write its iteration file/delta/state
      // record inside lineageDir; only OUT-of-lineageDir writes are detected. Fails open
      // when the artifact dir is outside the git worktree (hermetic test lineages).
      let containmentFindings = null;
      let containmentRecoveryHint = null;
      let containmentQuarantinePath = null;
      let containmentContested = null;
      if (containmentEnabled) {
        const containment = enforceWriteContainment({
          repoRoot: containmentRepoRoot,
          artifactDir: lineageDir,
          unattributableDirs: [
            ...staticUnattributableDirs,
            ...preDispatchForeignRunDirs,
            ...(await discoverForeignLiveRunDirs({ specFolder, baseArtifactDir })),
          ],
          unattributablePaths: orchestratorOwnedPaths,
          preDispatchDirtyPaths,
          baselineContentRoot: lineageDir,
          mode: containmentMode,
          iteration: attempt,
          label: lineage.label,
        });
        appendContainmentGitContentionWarnings();
        // A path someone else already had dirty before the dispatch and that changed again is
        // reported here and nowhere else: the tree cannot say whose bytes they are, so the lane
        // is not charged with them and nothing is copied under its directory.
        if (containment.contested.length > 0) {
          containmentContested = {
            paths: containment.contested.map((v) => ({ path: v.path, kind: v.kind, status: v.status })),
            note: containment.contestedNote,
          };
          appendFanoutStatusLedger(ledgerPath, {
            type: 'event',
            event: 'containment_contested',
            severity: 'warning',
            at: new Date().toISOString(),
            label: lineage.label,
            run_id: runId,
            loop_type: loopType,
            spec_folder: specFolder,
            iteration: attempt,
            gauges: latestGauges,
            ...containmentContested,
          });
        }
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
            detected: containment.revertResult.reverted.filter((r) => r.action === 'preserved_untracked'),
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
          containmentFindings = containment.violations;
          containmentRecoveryHint = containment.recoveryHint;
          containmentQuarantinePath = containment.quarantinePath;
        }
      }

      // After the containment snapshot, so the runner's own write is never charged to the lane.
      writeLineageValues(loopType, lineageDir, rootLineageValues);

      // Save subprocess stdout for salvage sweep (write failures in weak CLI executors).
      // An earlier attempt's log is kept beside this one, since it may be the only
      // record of why that attempt failed.
      const logsDir = path.join(lineageDir, 'logs');
      fs.mkdirSync(logsDir, { recursive: true });
      const savedStdout = typeof result.stdout === 'string' ? result.stdout : '';
      rotateLineageLog(path.join(logsDir, 'fanout-lineage.out'));
      fs.writeFileSync(path.join(logsDir, 'fanout-lineage.out'), savedStdout, 'utf8');
      const savedStderr = typeof result.stderr === 'string' ? result.stderr : '';
      rotateLineageLog(path.join(logsDir, 'fanout-lineage.err'));
      fs.writeFileSync(path.join(logsDir, 'fanout-lineage.err'), savedStderr, 'utf8');
      if (dshHome) removeDshHome(dshHome);

      // A lineage can exit cleanly on a question the operator still owes an answer to. That
      // failure is terminal until answered, so the exit-0 gates below mark it needs_input
      // instead of letting the salvage branches label it a retryable artifact gap.
      const pendingQuestion = detectPendingQuestion(savedStdout);

      // Recover missing iteration files from captured stdout when possible. Runs
      // BEFORE the failure throw below so iteration recovery is never lost.
      const salvage = runSalvageSweep(lineageDir, loopType, savedStdout);
      const slotAccounting = buildSlotAccounting(hrStart, slotIntervalMs);
      lineageSlotAccounting.set(lineage.label, slotAccounting);

      const exitCode = result.status ?? (result.error ? 1 : 0);
      const timedOut = result.signal === 'SIGTERM';
      // Any signal-kill is abnormal, not just the orchestrator's own SIGTERM timeout — a
      // stall-watchdog / lag-ceiling abort or an external SIGKILL leaves result.status null,
      // so exitCode computes to 0 and the lineage would otherwise be masked as success.
      const killedBySignal = result.signal != null;
      const dshCompletionFailure = lineage.kind === 'cli-deepseek-harness'
        ? validateDshCompletion(exitCode, savedStdout, savedStderr)
        : null;
      const vibeOutcome = lineage.kind === 'cli-mistral-vibe'
        ? resolveVibeLineageOutcome(exitCode, lineageDir)
        : null;
      const vibeCompletionFailure = vibeOutcome !== null && vibeOutcome !== 'success'
        ? validateVibeCompletion(exitCode, lineageDir)
        : null;
      const missingArtifacts = findMissingLineageArtifacts(loopType, lineageDir);
      const stateRead = readLineageStateRecords(loopType, lineageDir);
      const stopPolicyViolation = findMaxIterationsPolicyViolation({
        loopType,
        stateRead,
        lineage,
        stopPolicy,
        lineageDir,
      });
      const gatewayProjectionRefusal = readGatewayProjectionRefusal(lineageDir, slotWindowStartIso);

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
      const exitCodeIsFailure = (exitCode !== 0 && lineage.kind !== 'cli-pi')
        || dshCompletionFailure !== null
        || vibeCompletionFailure !== null;
      if (timedOut || killedBySignal || exitCodeIsFailure) {
        const reason = timedOut
          ? 'timed out'
          : killedBySignal
            ? `killed by signal ${result.signal}`
            : dshCompletionFailure
              ? dshCompletionFailure
              : vibeCompletionFailure
                ? vibeCompletionFailure
                : `exited with code ${exitCode}`;
        // A provider that refuses the run on an exhausted allowance exits like any crash.
        // Name it and keep its own words, so the roll-up shows an outage the operator can
        // act on instead of an anonymous exit.
        const quotaExhaustion = !timedOut && !killedBySignal
          ? detectQuotaExhaustion(savedStderr, savedStdout)
          : null;
        const failure = new Error(
          quotaExhaustion
            ? `lineage ${lineage.label} ${reason}: provider quota exhausted (${redactProviderText(quotaExhaustion.cause)})`
            : `lineage ${lineage.label} ${reason}`,
        );
        failure.label = lineage.label;
        failure.exitCode = exitCode;
        failure.timedOut = timedOut;
        failure.killedBySignal = killedBySignal;
        if (quotaExhaustion) {
          failure.quotaExhausted = true;
          failure.reason = 'quota';
        }
        if (
          lineage.kind === 'cli-mistral-vibe'
          && vibeOutcome === 'partial'
          && !timedOut
          && !killedBySignal
        ) {
          // The pool keeps only a bounded error shape, so the partial verdict travels in
          // `reason`; the settled result record reads it back into `outcome`. A timeout or
          // signal kill is a failure even when the interrupted run left an export behind.
          failure.reason = VIBE_PARTIAL_REASON;
        }
        failure.salvage = salvage;
        attachGatewayProjectionRefusal(failure, gatewayProjectionRefusal);
        throw failure;
      }

      if (missingArtifacts.length > 0) {
        const hint = claudePermissionHint(lineage, effectivePermission);
        const failure = new Error(
          `lineage ${lineage.label} exited 0 but did not produce expected artifact: ${missingArtifacts.join(', ')}`
            + (hint ? `; ${hint}` : ''),
        );
        failure.label = lineage.label;
        failure.exitCode = exitCode;
        failure.timedOut = false;
        failure.salvage = { salvaged: salvage.salvaged, failed: Math.max(1, salvage.failed) };
        failure.missingArtifacts = missingArtifacts;
        if (pendingQuestion) {
          failure.needsInput = true;
          failure.reason = 'needs_input';
          appendFanoutStatusLedger(ledgerPath, {
            event: 'needs_input',
            status: 'needs_input',
            label: lineage.label,
            attempt,
            run_id: runId,
            question: pendingQuestion.question,
            at: new Date().toISOString(),
          });
        }
        attachGatewayProjectionRefusal(failure, gatewayProjectionRefusal);
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
        attachGatewayProjectionRefusal(failure, gatewayProjectionRefusal);
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
        if (pendingQuestion) {
          failure.needsInput = true;
          failure.reason = 'needs_input';
          appendFanoutStatusLedger(ledgerPath, {
            event: 'needs_input',
            status: 'needs_input',
            label: lineage.label,
            attempt,
            run_id: runId,
            question: pendingQuestion.question,
            at: new Date().toISOString(),
          });
        }
        attachGatewayProjectionRefusal(failure, gatewayProjectionRefusal);
        throw failure;
      }

      const unledgeredStateLog = findUnledgeredStateLog({ loopType, lineageDir, stateRead });
      if (unledgeredStateLog) {
        const failure = new Error(`lineage ${lineage.label} ${unledgeredStateLog}`);
        failure.label = lineage.label;
        failure.exitCode = exitCode;
        failure.timedOut = false;
        failure.salvage = salvage;
        failure.unattributedStateLog = true;
        failure.code = UNATTRIBUTED_STATE_LOG_CODE;
        failure.reason = unledgeredStateLog;
        throw failure;
      }

      // An exit-0 lineage with its report on disk is still not done until its state log
      // proves it reached a legal stop in this attempt, in order, before its process ended.
      const completion = stateRead.missing || stateRead.parseError
        ? {
          complete: false,
          detail: stateRead.parseError
            ? `its state log could not be parsed: ${stateRead.parseError}`
            : `it landed no iteration state in ${lineageStateLogName(loopType)}`,
        }
        : checkLineageCompletion(stateRead.records, {
          ...lineageCompletionPolicy(loopType, lineageDir),
          windowStart: slotWindowStartIso,
          windowEnd: new Date().toISOString(),
        });
      if (!completion.complete) {
        const hint = claudePermissionHint(lineage, effectivePermission);
        const failure = new Error(
          `lineage ${lineage.label} exited 0 but is not complete: ${completion.detail}${hint ? `; ${hint}` : ''}`,
        );
        failure.label = lineage.label;
        failure.exitCode = exitCode;
        failure.timedOut = false;
        failure.salvage = salvage;
        failure.reason = completion.failure || 'no_iteration_records';
        throw failure;
      }

      const output = {
        label: lineage.label,
        exitCode,
        timedOut,
        salvage,
        ...slotAccounting,
        ...(vibeOutcome ? { outcome: vibeOutcome } : {}),
      };
      if (containmentContested !== null) output.containmentContested = containmentContested;
      if (containmentFindings !== null) {
        // Every artifact and stop-policy gate has passed by the time this output is built,
        // so an out-of-scope write found by the guard describes a COMPLETE lineage: report
        // it as an advisory rather than reject a lineage whose deliverables all exist. A
        // lane that failed its gates threw before the findings could reach here, keeping
        // its own verdict.
        output.status = CONTAINMENT_ADVISORY_STATUS;
        output.containment = { violations: containmentFindings, recoveryHint: containmentRecoveryHint, quarantinePath: containmentQuarantinePath };
      }
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

      // A fulfilled lane whose deltas hold finding records but whose registry holds none
      // leaves the merge with evidence it cannot aggregate. Every artifact gate above
      // already passed, so the lane keeps its verdict and the gap is named on the ledger.
      const emptyRegistry = findEmptyLineageRegistry(loopType, lineageDir);
      if (emptyRegistry) {
        appendFanoutStatusLedger(ledgerPath, {
          type: 'event',
          event: 'lineage_registry_empty',
          severity: 'warning',
          at: new Date().toISOString(),
          label: lineage.label,
          run_id: runId,
          loop_type: loopType,
          spec_folder: specFolder,
          gauges: latestGauges,
          ...emptyRegistry,
        });
      }

      return output;
    },
  });

  // A Vibe lineage's verdict is the export record's pair, not the pool's settle status:
  // exit 3 settles like a failure but records `partial`. The pool result is the record the
  // JSON output carries, so the outcome is attached there for Vibe only.
  const vibeLabels = new Set(
    cliLineages.filter((lineage) => lineage.kind === 'cli-mistral-vibe').map((lineage) => lineage.label),
  );
  for (const result of results) {
    if (!result || !vibeLabels.has(result.label)) continue;
    if (result.status === 'fulfilled') {
      result.outcome = result.output?.outcome || 'success';
    } else {
      result.outcome = result.error?.reason === VIBE_PARTIAL_REASON ? 'partial' : 'failure';
    }
  }

  const timestampAnomalies = collectTimestampAnomalies(results);
  const finalSummary = {
    ...summary,
    lineages: buildLineageOutcomes(results, { loopType, lineagesDir }),
    ...(timestampAnomalies.length > 0 ? { timestamp_anomalies: timestampAnomalies } : {}),
    provider_cost_usd: summarizeProviderCost(Object.fromEntries(cliLineages.map((lineage) => (
      [lineage.label, readLineageProviderCostUsd(path.join(lineagesDir, lineage.label))]
    )))),
  };

  writeOrchestrationSummary(summaryPath, {
    run_id: runId,
    loop_type: loopType,
    spec_folder: specFolder,
    base_artifact_dir: baseArtifactDir,
    total_cli_lineages: cliLineages.length,
    ...frontierPartitionSummary,
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
  expansiveLineageBudgets,
  flagLineageBudgets,
  redactProviderText,
  rerunCommandFor,
  expansiveLineageBudgetNotes,
  runLineageProcess,
  forcedDepthIterationViolation,
  retainIterationRecords,
  findEmptyLineageRegistry,
  iterationNumbersOnDisk,
  DEVIN_ALLOWED_MODELS,
  DEVIN_DEFAULT_MODEL,
  CURSOR_ALLOWED_MODELS,
  CURSOR_DEFAULT_MODEL,
  CODEX_DEFAULT_MODEL,
  CLAUDE_DEFAULT_MODEL,
  OPENCODE_DEFAULT_MODEL,
  PI_ALLOWED_MODELS,
  PI_DEFAULT_MODEL,
  DSH_ALLOWED_MODELS,
  DSH_DEFAULT_MODEL,
  DSH_VERSION,
  buildLineageCommand,
  validateDshCompletion,
  sweepStaleDshHomes,
  buildInvocationFingerprintPayload,
  isCodexBinaryAvailable,
  isOpencodeBinaryAvailable,
  isCursorBinaryAvailable,
  isDevinBinaryAvailable,
  isPiBinaryAvailable,
  isDshBinaryAvailable,
  isVibeBinaryAvailable,
  VIBE_ALLOWED_MODELS,
  VIBE_VERSION,
  buildVibeLineageCommand,
  validateVibeCompletion,
  resolveVibeLineageOutcome,
  withAgentPersona,
  validateClaudeConfigDir,
  buildLoopPrompt,
  normalizeReviewFocus,
  normalizeDepthMode,
  partitionFrontierNodes,
  resolveFrontierPartition,
  writeLineageFrontierStore,
  REVIEW_FOCUS_MAX_LENGTH,
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
  discoverForeignLiveRunDirs,
  readStoredLineageSessionId,
  finishedLineageSkipReason,
  finishedLineageMismatch,
  TERMINAL_STOP_EVENTS_BY_LOOP_TYPE,
  lineageCompletionPolicy,
  startLineageProgressHeartbeat,
  readLineageProgressFields,
  formatFanoutStatusTable,
  startLineageStallWatchdog,
  statusForLedgerEvent,
  updateLineageSnapshot,
  applyFlatPoolAssignmentGuard,
};
