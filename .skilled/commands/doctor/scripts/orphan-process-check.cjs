// ───────────────────────────────────────────────────────────────────
// MODULE: Orphan Process Check
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_MIN_AGE_MINUTES = 60;
const INITIAL_PS_ARGS = ['-axo', 'pid=,ppid=,uid=,etime=,rss=,command='];
const MAX_PS_BUFFER = 4 * 1024 * 1024;
const MAX_REAP_WAIT_MS = 3000;
const REAP_POLL_INTERVAL_MS = 100;
const SCRIPT_PATH_MARKERS = ['/.skilled/', '/.opencode/'];
const SETUP_COMMAND = 'node .skilled/commands/doctor/scripts/orphan-process-check.cjs';
const SHELL_EXECUTABLES = new Set(['bash', 'csh', 'dash', 'fish', 'ksh', 'sh', 'tcsh', 'zsh']);

// ─────────────────────────────────────────────────────────────────────────────
// 3. PARSING AND CLASSIFICATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert ps elapsed time into seconds.
 *
 * @param {string} value - Elapsed time in MM:SS, HH:MM:SS, or D-HH:MM:SS form.
 * @returns {number|null} Elapsed seconds, or null when the value is invalid.
 */
function parseEtime(value) {
  const text = String(value).trim();
  let match = /^(\d+)-(\d{1,2}):(\d{2}):(\d{2})$/.exec(text);
  if (match) {
    const days = Number(match[1]);
    const hours = Number(match[2]);
    const minutes = Number(match[3]);
    const seconds = Number(match[4]);
    if (hours > 23 || minutes > 59 || seconds > 59) return null;
    return (((days * 24) + hours) * 60 + minutes) * 60 + seconds;
  }

  match = /^(\d+):(\d{2}):(\d{2})$/.exec(text);
  if (match) {
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    const seconds = Number(match[3]);
    if (minutes > 59 || seconds > 59) return null;
    return (hours * 60 + minutes) * 60 + seconds;
  }

  match = /^(\d+):(\d{2})$/.exec(text);
  if (!match || Number(match[2]) > 59) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

/**
 * Parse whitespace-separated ps rows while preserving the command column.
 *
 * @param {string} output - Output from the process table command.
 * @returns {Array<Object>} Parsed process rows with elapsed seconds and RSS KB.
 */
function parsePsOutput(output) {
  const rows = [];
  for (const line of String(output).split(/\r?\n/)) {
    if (line.trim() === '') continue;
    const match = /^\s*(\d+)\s+(\d+)\s+(\d+)\s+(\S+)\s+(\d+)\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    const ageSeconds = parseEtime(match[4]);
    if (ageSeconds === null) continue;
    rows.push({
      pid: Number(match[1]),
      ppid: Number(match[2]),
      uid: Number(match[3]),
      ageSeconds,
      rssKb: Number(match[5]),
      command: match[6],
    });
  }
  return rows;
}

function commandTokens(command) {
  const tokens = String(command).match(/"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|[^\s]+/g) || [];
  return tokens.map((token) => token.replace(/^(["'])(.*)\1$/, '$2'));
}

function findOptionPath(tokens, optionNames) {
  for (let index = 0; index < tokens.length; index += 1) {
    for (const optionName of optionNames) {
      if (tokens[index] === optionName && tokens[index + 1]) return tokens[index + 1];
      if (tokens[index].startsWith(`${optionName}=`)) {
        return tokens[index].slice(optionName.length + 1);
      }
    }
  }
  return null;
}

function scriptPathFromCommand(command, scriptSuffixes) {
  const normalized = String(command).replace(/\\/g, '/');
  const suffix = scriptSuffixes.find((candidate) => normalized.includes(candidate));
  if (!suffix) return null;

  const suffixEnd = normalized.indexOf(suffix) + suffix.length;
  const firstToken = commandTokens(normalized)[0] || '';
  const executableName = path.posix.basename(firstToken.replace(/\\/g, '/'));
  const isInterpreter = executableName === 'node'
    || executableName === 'nodejs'
    || SHELL_EXECUTABLES.has(executableName);
  let scriptStart = normalized.search(/\S/);
  if (scriptStart < 0) return null;

  if (isInterpreter) {
    const executableMatch = /^\s*(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\S+)/.exec(normalized);
    if (!executableMatch) return null;
    scriptStart = executableMatch[0].length;
    while (/\s/.test(normalized[scriptStart] || '')) scriptStart += 1;
  }
  if (normalized[scriptStart] === '"' || normalized[scriptStart] === "'") {
    scriptStart += 1;
  }

  const scriptPath = normalized.slice(scriptStart, suffixEnd).trim();
  return path.isAbsolute(scriptPath) ? scriptPath : null;
}

function checkoutPathFromScript(scriptPath) {
  if (!scriptPath || !path.isAbsolute(scriptPath)) return null;
  const normalized = scriptPath.replace(/\\/g, '/');
  const markerIndexes = SCRIPT_PATH_MARKERS
    .map((marker) => normalized.indexOf(marker))
    .filter((index) => index >= 0);
  if (markerIndexes.length === 0) return null;
  return path.resolve(normalized.slice(0, Math.min(...markerIndexes)));
}

function staleCheckoutKind(command, scriptSuffixes, kind, pathExists) {
  const tokens = commandTokens(command);
  const explicitPath = findOptionPath(tokens, ['--workspace-root', '--repo-root', '--repo', '-C']);
  const scriptPath = scriptPathFromCommand(command, scriptSuffixes);
  const checkoutPath = explicitPath && path.isAbsolute(explicitPath)
    ? path.resolve(explicitPath)
    : checkoutPathFromScript(scriptPath);
  if (!checkoutPath || !path.isAbsolute(checkoutPath)) return null;
  return pathExists(checkoutPath) ? null : kind;
}

function isDirectScriptCommand(command, scriptPath) {
  const normalized = String(command).replace(/\\/g, '/').trimStart();
  const quote = normalized[0] === '"' || normalized[0] === "'" ? normalized[0] : '';
  const scriptStart = quote ? 1 : 0;
  if (normalized.slice(scriptStart, scriptStart + scriptPath.length) !== scriptPath) return false;
  const suffix = normalized.slice(scriptStart + scriptPath.length);
  if (quote && suffix[0] === quote) return suffix.length === 1 || /^\s/.test(suffix.slice(1));
  return suffix === '' || /^\s/.test(suffix);
}

function hasNodeTest(tokens) {
  const executableName = path.posix.basename(String(tokens[0] || '').replace(/\\/g, '/'));
  if (executableName !== 'node' && executableName !== 'nodejs') return false;
  return tokens.some((token, index) => {
    if (index !== 0) return false;
    return tokens.slice(index + 1).some((arg) => arg === '--test' || arg.startsWith('--test='));
  });
}

function hasVitest(tokens) {
  const executableName = path.posix.basename(String(tokens[0] || '').replace(/\\/g, '/'));
  if (!['node', 'nodejs', 'vitest'].includes(executableName)) return false;
  return tokens.some((token) => {
    const normalized = token.replace(/\\/g, '/');
    const basename = path.posix.basename(normalized);
    return basename === 'vitest'
      || basename === 'vitest.mjs'
      || normalized.includes('/node_modules/vitest/');
  });
}

function hasTailMonitor(tokens) {
  return tokens.some((token, index) => {
    if (index !== 0) return false;
    if (path.posix.basename(token) !== 'tail') return false;
    return tokens.slice(index + 1).some((arg) => /^-[^-]*[fF]/.test(arg));
  });
}

function hasGrepSearch(tokens) {
  return tokens.some((token, index) => {
    if (index !== 0) return false;
    const basename = path.posix.basename(token.replace(/\\/g, '/'));
    if (basename === 'rg') return true;
    if (basename !== 'grep') return false;
    return tokens.slice(index + 1).some((arg) => arg === '--recursive' || /^-[^-]*[rR]/.test(arg));
  });
}

/**
 * Classify a process command using an injected filesystem predicate.
 *
 * @param {string} command - The process command column.
 * @param {(candidatePath: string) => boolean} [pathExists] - Checkout existence check.
 * @returns {string|null} Helper kind, or null for daemons and unrelated commands.
 */
function classify(command, pathExists = () => false) {
  const tokens = commandTokens(command);
  const executableName = path.posix.basename(String(tokens[0] || '').replace(/\\/g, '/'));
  const isNodeExecutable = executableName === 'node' || executableName === 'nodejs';
  const isShellExecutable = SHELL_EXECUTABLES.has(executableName);
  const advisorKind = isNodeExecutable ? staleCheckoutKind(
    command,
    ['/.skilled/bin/system-skill-advisor-launcher.cjs'],
    'stale-advisor-launcher',
    pathExists,
  ) : null;
  if (advisorKind) return advisorKind;

  const modelKind = isNodeExecutable ? staleCheckoutKind(
    command,
    ['/.skilled/bin/hf-model-server.cjs'],
    'stale-model-server',
    pathExists,
  ) : null;
  if (modelKind) return modelKind;

  const followExecutable = ['git-live-follow', 'git-live-follow.sh'].includes(executableName);
  const followScriptSuffixes = [
    '/.skilled/bin/git-live-follow.sh',
    '/.skilled/bin/git-live-follow',
  ];
  const followScriptPath = scriptPathFromCommand(command, followScriptSuffixes);
  const directShellFollow = isShellExecutable && followScriptPath !== null;
  const directScriptFollow = followScriptPath !== null
    && isDirectScriptCommand(command, followScriptPath);
  const followKind = followExecutable || directShellFollow || directScriptFollow ? staleCheckoutKind(
    command,
    followScriptSuffixes,
    'stale-live-follow',
    pathExists,
  ) : null;
  if (followKind) return followKind;

  if (isShellExecutable) return null;

  const normalizedCommand = String(command).replace(/\\/g, '/');
  const relaunchPath = normalizedCommand.indexOf('.skilled/hooks/session-relaunch/');
  if (isNodeExecutable && relaunchPath >= 0 && /test|helper/i.test(normalizedCommand.slice(relaunchPath))) {
    return 'relaunch-test-helper';
  }
  if (hasNodeTest(tokens)) return 'node-test';
  if (hasVitest(tokens)) return 'vitest';
  if (hasTailMonitor(tokens)) return 'tail-monitor';
  if (hasGrepSearch(tokens)) return 'grep-search';

  if (executableName === 'pi') return 'executor-worker';
  if (executableName === 'codex' && tokens[1] === 'exec') return 'executor-worker';
  if (executableName === 'devin' && tokens.slice(1).includes('-p')) return 'executor-worker';
  return null;
}

/**
 * Select old, current-user orphan helpers from parsed process rows.
 *
 * @param {Array<Object>} rows - Parsed process rows.
 * @param {Object} options - Current uid, age threshold, and path predicate.
 * @returns {Array<Object>} Reportable orphan rows with their helper kind and RSS MB.
 */
function selectOrphans(rows, options = {}) {
  const uid = Number(options.uid);
  const minAgeMinutes = options.minAgeMinutes === undefined
    ? DEFAULT_MIN_AGE_MINUTES
    : Number(options.minAgeMinutes);
  const pathExists = options.pathExists || (() => false);
  if (!Number.isInteger(uid) || !Number.isFinite(minAgeMinutes) || minAgeMinutes < 0) return [];

  const selected = [];
  for (const row of rows) {
    if (row.uid !== uid || row.ppid !== 1 || row.ageSeconds < minAgeMinutes * 60) continue;
    const kind = classify(row.command, pathExists);
    if (!kind) continue;
    selected.push({
      ...row,
      kind,
      ageMinutes: row.ageSeconds / 60,
      rssMb: Number((row.rssKb / 1024).toFixed(1)),
    });
  }
  return selected;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. REPORTING
// ─────────────────────────────────────────────────────────────────────────────

function roundMb(rssKb) {
  return Number((rssKb / 1024).toFixed(1));
}

function totalRssKb(orphans) {
  return orphans.reduce((total, row) => total + row.rssKb, 0);
}

function totalLine(orphans) {
  return `orphans: ${orphans.length}, about ${Math.round(totalRssKb(orphans) / 1024)} MB`;
}

function summaryLine(orphans) {
  return orphans.length === 0
    ? 'orphans: none'
    : `${totalLine(orphans)}; list them with ${SETUP_COMMAND} --reap`;
}

function formatAge(ageSeconds) {
  const days = Math.floor(ageSeconds / 86400);
  const hours = Math.floor((ageSeconds % 86400) / 3600);
  const minutes = Math.floor((ageSeconds % 3600) / 60);
  const seconds = ageSeconds % 60;
  const clock = [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ].join(':');
  if (days > 0) return `${days}-${clock}`;
  if (hours > 0) return clock;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function truncateCommand(command) {
  const characters = Array.from(command);
  return characters.length <= 120 ? command : `${characters.slice(0, 117).join('')}...`;
}

function renderTable(orphans) {
  const lines = ['PID    KIND                     AGE          RSS MB  COMMAND'];
  for (const row of orphans) {
    lines.push(
      `${String(row.pid).padEnd(6)} ${row.kind.padEnd(24)} ${formatAge(row.ageSeconds).padEnd(12)} `
        + `${row.rssMb.toFixed(1).padStart(6)}  ${truncateCommand(row.command)}`,
    );
  }
  lines.push(totalLine(orphans));
  return `${lines.join('\n')}\n`;
}

function renderJson(orphans) {
  const publicRows = orphans.map((row) => ({
    pid: row.pid,
    ppid: row.ppid,
    uid: row.uid,
    kind: row.kind,
    ageSeconds: row.ageSeconds,
    ageMinutes: row.ageMinutes,
    rssKb: row.rssKb,
    rssMb: row.rssMb,
    command: row.command,
  }));
  return `${JSON.stringify({
    orphans: publicRows,
    count: publicRows.length,
    totalRssMb: roundMb(totalRssKb(orphans)),
  }, null, 2)}\n`;
}

function errorReason(error) {
  const stderr = error && error.stderr;
  const stderrText = Buffer.isBuffer(stderr) ? stderr.toString('utf8') : String(stderr || '');
  return (stderrText || (error && error.message) || String(error)).replace(/\s+/g, ' ').trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. GUARDED REAP
// ─────────────────────────────────────────────────────────────────────────────

function parseRecheckedProcess(output) {
  const line = String(output).split(/\r?\n/, 1)[0].trim();
  if (line === '') return null;
  const match = /^(\S+)\s+(\d+)\s+(.+?)\s*$/.exec(line);
  if (!match) return null;
  const ageSeconds = parseEtime(match[1]);
  const uid = Number(match[2]);
  if (ageSeconds === null || !Number.isInteger(uid)) return null;
  return { ageSeconds, uid, command: match[3].trimEnd() };
}

function hasOriginalStartAge(recheckedAgeSeconds, row, observedAtMs, recheckedAtMs) {
  const elapsedSeconds = Math.max(0, recheckedAtMs - observedAtMs) / 1000;
  const expectedAgeSeconds = row.ageSeconds + elapsedSeconds;
  return Math.abs(recheckedAgeSeconds - expectedAgeSeconds) <= 2;
}

function processIsAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code !== 'ESRCH';
  }
}

async function waitForExit(pid, isAlive, sleep) {
  for (let waitedMs = 0; waitedMs < MAX_REAP_WAIT_MS; waitedMs += REAP_POLL_INTERVAL_MS) {
    if (!isAlive(pid)) return true;
    await sleep(Math.min(REAP_POLL_INTERVAL_MS, MAX_REAP_WAIT_MS - waitedMs));
  }
  return !isAlive(pid);
}

async function reapOrphans(orphans, dependencies, observedAtMs, currentUid) {
  const outcomes = [];
  for (const row of orphans) {
    let identityOutput;
    try {
      identityOutput = dependencies.runPs(['-o', 'etime=,uid=,command=', '-p', String(row.pid)]);
    } catch (error) {
      outcomes.push(`skipped pid=${row.pid}: unable to re-check process (${errorReason(error)})`);
      continue;
    }

    const identity = parseRecheckedProcess(identityOutput);
    if (!identity) {
      outcomes.push(`skipped pid=${row.pid}: process is gone`);
      continue;
    }
    if (identity.command !== row.command) {
      outcomes.push(`skipped pid=${row.pid}: command changed`);
      continue;
    }
    if (!hasOriginalStartAge(identity.ageSeconds, row, observedAtMs, dependencies.now())) {
      outcomes.push(`skipped pid=${row.pid}: start time changed`);
      continue;
    }

    if (identity.uid !== currentUid) {
      outcomes.push(`skipped pid=${row.pid}: uid changed to ${identity.uid}`);
      continue;
    }

    try {
      dependencies.signalProcess(row.pid, 'SIGTERM');
    } catch (error) {
      if (error && error.code === 'ESRCH') {
        outcomes.push(`skipped pid=${row.pid}: process is gone`);
      } else {
        outcomes.push(`skipped pid=${row.pid}: SIGTERM failed (${errorReason(error)})`);
      }
      continue;
    }

    const exited = await waitForExit(row.pid, dependencies.isAlive, dependencies.sleep);
    outcomes.push(`${exited ? 'killed' : 'still-alive'} pid=${row.pid} kind=${row.kind}`);
  }
  return outcomes;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const options = {
    json: false,
    summary: false,
    reap: false,
    yes: false,
    minAgeMinutes: DEFAULT_MIN_AGE_MINUTES,
    minAgeExplicit: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--json') options.json = true;
    else if (argument === '--summary') options.summary = true;
    else if (argument === '--reap') options.reap = true;
    else if (argument === '--yes') options.yes = true;
    else if (argument === '--min-age-min' || argument.startsWith('--min-age-min=')) {
      const value = argument === '--min-age-min'
        ? argv[index + 1]
        : argument.slice('--min-age-min='.length);
      if (value === undefined || value === '' || value.startsWith('--')) {
        return { error: 'missing value for --min-age-min' };
      }
      const minAgeMinutes = Number(value);
      if (!Number.isFinite(minAgeMinutes) || minAgeMinutes < 0) {
        return { error: '--min-age-min must be a non-negative number' };
      }
      options.minAgeMinutes = minAgeMinutes;
      options.minAgeExplicit = true;
      if (argument === '--min-age-min') index += 1;
    } else {
      return { error: `unknown argument: ${argument}` };
    }
  }
  if (options.yes && !options.reap) return { error: '--yes requires --reap' };
  if (options.reap && (options.json || options.summary)) {
    return { error: '--reap cannot be combined with --json or --summary' };
  }
  if (options.json && options.summary) return { error: '--json cannot be combined with --summary' };
  return options;
}

function defaultRunPs(args) {
  return execFileSync('ps', args, {
    encoding: 'utf8',
    env: { ...process.env, LC_ALL: 'C', LANG: 'C' },
    maxBuffer: MAX_PS_BUFFER,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function confirmationCommand(options) {
  const ageOption = options.minAgeExplicit ? ` --min-age-min ${options.minAgeMinutes}` : '';
  return `${SETUP_COMMAND}${ageOption} --reap --yes`;
}

/**
 * Run the orphan scan or guarded reap.
 *
 * @param {string[]} argv - CLI arguments after the script path.
 * @param {Object} [dependencies] - Optional process and output dependencies for tests.
 * @returns {Promise<number>} Exit code, with ps failures kept informational.
 */
async function main(argv = process.argv.slice(2), dependencies = {}) {
  const options = parseArgs(argv);
  const write = dependencies.write || ((text) => process.stdout.write(text));
  if (options.error) {
    write(`orphan-process-check: ${options.error}\n`);
    return 2;
  }

  const runPs = dependencies.runPs || defaultRunPs;
  const pathExists = dependencies.pathExists || fs.existsSync;
  const now = dependencies.now || Date.now;
  const currentUid = dependencies.uid === undefined
    ? (typeof process.getuid === 'function' ? process.getuid() : null)
    : Number(dependencies.uid);
  if (!Number.isInteger(currentUid)) {
    write('orphan check could not run: current uid is unavailable\n');
    return 0;
  }

  let psOutput;
  try {
    psOutput = runPs(INITIAL_PS_ARGS);
  } catch (error) {
    write(`orphan check could not run: ${errorReason(error)}\n`);
    return 0;
  }

  const observedAtMs = now();
  const orphans = selectOrphans(parsePsOutput(psOutput), {
    uid: currentUid,
    minAgeMinutes: options.minAgeMinutes,
    pathExists,
  });

  if (options.summary) {
    write(`${summaryLine(orphans)}\n`);
    return 0;
  }
  if (options.json) {
    write(renderJson(orphans));
    return 0;
  }

  write(renderTable(orphans));
  if (!options.reap) return 0;
  if (!options.yes) {
    write(`To confirm, run: ${confirmationCommand(options)}\n`);
    return 0;
  }

  const reapDependencies = {
    runPs,
    now,
    signalProcess: dependencies.signalProcess || ((pid, signal) => process.kill(pid, signal)),
    isAlive: dependencies.isAlive || processIsAlive,
    sleep: dependencies.sleep || ((milliseconds) => new Promise(
      (resolve) => setTimeout(resolve, milliseconds),
    )),
  };
  const outcomes = await reapOrphans(orphans, reapDependencies, observedAtMs, currentUid);
  if (outcomes.length > 0) write(`${outcomes.join('\n')}\n`);
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { parseEtime, parsePsOutput, classify, selectOrphans, main };

if (require.main === module) {
  main().then(
    (code) => {
      process.exitCode = code;
    },
    (error) => {
      process.stderr.write(`orphan-process-check: ${errorReason(error)}\n`);
      process.exitCode = 1;
    },
  );
}
