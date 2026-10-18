// ────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch CLI
// ────────────────────────────────────────────────────────────────
'use strict';

// ────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const core = require('../lib/relaunch-core.cjs');
const { isHookEnabled, loadConfigFile, configPath } = require('../../shared/hook-flags.cjs');
// Must match the runtimes skilled-loop can launch, or prepare refuses a loop the wrapper started.
const LOOP_RUNTIMES = ['claude', 'pi', 'opencode', 'codex', 'cursor', 'hermes', 'devin'];

// ────────────────────────────────────────────────────────────────
// 2. HELPERS
// ────────────────────────────────────────────────────────────────

function parseArgs(args, { flags = [], positionalCount = 0 } = {}) {
  const allowedFlags = new Set(flags);
  const options = {};
  const positional = [];

  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (!value.startsWith('--')) {
      positional.push(value);
      continue;
    }
    if (!allowedFlags.has(value)) throw new Error(`unknown option ${value}`);
    if (options[value] !== undefined) throw new Error(`duplicate option ${value}`);
    const next = args[index + 1];
    if (next === undefined || next.startsWith('--')) throw new Error(`missing value for ${value}`);
    options[value] = next;
    index += 1;
  }

  if (positional.length !== positionalCount) {
    throw new Error('unexpected or missing command arguments');
  }
  return { options, positional };
}

function resolvedSwitches() {
  return { ...loadConfigFile(configPath()), ...process.env };
}

function numericSwitch(name, fallback, switches, { integer = false } = {}) {
  const rawValue = switches[name];
  if (
    rawValue === undefined
    || rawValue === null
    || String(rawValue).trim() === ''
  ) {
    return fallback;
  }
  const parsed = Number(rawValue);
  if (
    !Number.isFinite(parsed)
    || parsed < 0
    || (integer && !Number.isInteger(parsed))
  ) {
    return fallback;
  }
  return parsed;
}

function handoffPathWithinRepo(filePath) {
  const repository = path.resolve(
    process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..'),
  );
  const handoffDirectory = path.resolve(
    repository,
    '.skilled',
    'skills',
    '.state',
    'session-relaunch',
    'handoffs',
  );
  const candidate = path.resolve(filePath);
  const relative = path.relative(handoffDirectory, candidate);
  if (
    !relative
    || relative.startsWith(`..${path.sep}`)
    || relative === '..'
    || path.isAbsolute(relative)
  ) {
    throw new Error('handoff path must be inside the session-relaunch handoffs directory');
  }

  let realDirectory;
  try {
    realDirectory = fs.realpathSync(handoffDirectory);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error('session-relaunch handoffs directory is missing');
    }
    throw error;
  }

  let realParent;
  try {
    realParent = fs.realpathSync(path.dirname(candidate));
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error('handoff path parent directory is missing');
    }
    throw error;
  }
  const realCandidate = path.join(realParent, path.basename(candidate));
  const realRelative = path.relative(realDirectory, realCandidate);
  if (
    realRelative.startsWith(`..${path.sep}`)
    || realRelative === '..'
    || path.isAbsolute(realRelative)
  ) {
    throw new Error('handoff path resolves outside the session-relaunch handoffs directory');
  }
  try {
    const realFile = fs.realpathSync(candidate);
    const fileRelative = path.relative(realDirectory, realFile);
    if (
      fileRelative.startsWith(`..${path.sep}`)
      || fileRelative === '..'
      || path.isAbsolute(fileRelative)
    ) {
      throw new Error('handoff path resolves outside the session-relaunch handoffs directory');
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  return candidate;
}

function parseProcessTable(stdout) {
  const processes = new Map();
  for (const line of String(stdout).split(/\r?\n/)) {
    const match = line.trim().match(/^(\d+)\s+(\d+)\s+(.+)$/);
    if (!match) continue;
    const pid = Number(match[1]);
    const ppid = Number(match[2]);
    const command = path.basename(match[3].trim());
    if (Number.isInteger(pid) && Number.isInteger(ppid)) processes.set(pid, { pid, ppid, command });
  }
  return processes;
}

function readProcessTable(runtime) {
  const name = runtime.charAt(0).toUpperCase() + runtime.slice(1);
  const result = spawnSync('ps', ['-A', '-o', 'pid=,ppid=,comm='], { encoding: 'utf8' });
  if (result.error) {
    throw new Error(
      `could not inspect ${name} child processes: ${result.error.message}`,
    );
  }
  if (result.status !== 0) {
    const reason = String(result.stderr || '').trim() || `ps exited ${result.status}`;
    throw new Error(`could not inspect ${name} child processes: ${reason}`);
  }

  return parseProcessTable(result.stdout);
}

function cliAncestorsOf(processes) {
  const cliAncestors = new Set();
  let pid = process.pid;
  while (Number.isInteger(pid) && pid > 0 && !cliAncestors.has(pid)) {
    cliAncestors.add(pid);
    pid = processes.get(pid)?.ppid;
  }
  return cliAncestors;
}

function runtimePidFromLoop(loopId, processes) {
  const visited = new Set();
  let pid = process.pid;
  while (Number.isInteger(pid) && pid > 0 && !visited.has(pid)) {
    visited.add(pid);
    const current = processes.get(pid);
    if (!current) return null;
    if (current.ppid === loopId) return current.pid;
    pid = current.ppid;
  }
  return null;
}

function shellChildOfRuntime(runtimePid, runtime, processes = readProcessTable(runtime)) {
  const cliAncestors = cliAncestorsOf(processes);

  return [...processes.values()].find((processInfo) => (
    processInfo.ppid === runtimePid
    && ['zsh', 'bash', 'sh'].includes(processInfo.command)
    && !cliAncestors.has(processInfo.pid)
  )) || null;
}

function refuseForShellChild(loopId, runtime) {
  const rawClaudePid = runtime === 'claude' ? process.env.CLAUDE_PID : undefined;
  let runtimePid;
  let processes;
  if (rawClaudePid !== undefined && rawClaudePid !== '') {
    runtimePid = Number(rawClaudePid);
    if (!Number.isInteger(runtimePid) || runtimePid <= 0) {
      throw new Error('CLAUDE_PID must be a positive process id');
    }
  } else {
    processes = readProcessTable(runtime);
    const loopPid = Number(loopId);
    runtimePid = Number.isInteger(loopPid) && loopPid > 0
      ? runtimePidFromLoop(loopPid, processes)
      : null;
    if (runtimePid === null) {
      try {
        core.appendLog('running-work-check-skipped', { loopId });
      } catch {}
      return;
    }
  }
  const child = shellChildOfRuntime(runtimePid, runtime, processes);
  if (child) {
    const name = runtime.charAt(0).toUpperCase() + runtime.slice(1);
    throw new Error(
      `${name} still has a live shell child (${child.command}, pid ${child.pid})`,
    );
  }
}

function printManualClaim(handoffPath, runtime, specFolder) {
  process.stdout.write(`${core.manualClaimCommand(runtime, handoffPath, specFolder)}\n`);
}

function supersedeClaimedNotes(handoffPath, { loopId, sessionId }) {
  try {
    const supersededPaths = core.supersedeClaimed(handoffPath, { sessionId });
    for (const supersededPath of supersededPaths) {
      const fields = {
        note: path.basename(supersededPath),
        supersededBy: path.basename(handoffPath),
      };
      if (loopId) fields.loopId = loopId;
      try {
        core.appendLog('superseded', fields);
      } catch {}
    }
  } catch (error) {
    // The sweep is best-effort: log its failure and keep the prepare result.
    const fields = { reason: error?.code || error?.message || 'unknown' };
    if (loopId) fields.loopId = loopId;
    try {
      core.appendLog('supersede-failed', fields);
    } catch {}
  }
}

function printHandoffBody(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const match = text.match(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error('missing frontmatter fences');
  const body = text.slice(match[0].length).trim();
  process.stdout.write(`${body}${body ? '\n' : ''}`);
}

function stateForLoop(loopId) {
  if (typeof loopId !== 'string' || !loopId.trim()) throw new Error('--loop-id is required');
  return core.readRelaunchFile(loopId);
}

// ────────────────────────────────────────────────────────────────
// 3. COMMANDS
// ────────────────────────────────────────────────────────────────

function prepare(args) {
  const envRuntime = process.env.SKILLED_LOOP_RUNTIME || 'claude';
  if (!LOOP_RUNTIMES.includes(envRuntime)) {
    throw new Error(`SKILLED_LOOP_RUNTIME must be one of ${LOOP_RUNTIMES.join(', ')}`);
  }

  const { options } = parseArgs(args, { flags: ['--handoff', '--session', '--runtime'] });
  const flagRuntime = options['--runtime'];
  if (flagRuntime !== undefined && !LOOP_RUNTIMES.includes(flagRuntime)) {
    throw new Error(`--runtime must be one of ${LOOP_RUNTIMES.join(', ')}`);
  }
  const loopId = process.env.SKILLED_LOOP_ID;
  if (loopId && flagRuntime !== undefined && flagRuntime !== envRuntime) {
    throw new Error(
      `--runtime ${flagRuntime} conflicts with SKILLED_LOOP_RUNTIME ${envRuntime}`,
    );
  }
  // Inside the loop the exported runtime wins; outside it the flag names the runtime.
  const runtime = loopId ? envRuntime : (flagRuntime ?? envRuntime);

  if (!options['--handoff']) throw new Error('--handoff is required');
  const handoffPath = handoffPathWithinRepo(options['--handoff']);
  const sessionId = options['--session']
    || (runtime === 'claude' ? process.env.CLAUDE_CODE_SESSION_ID : undefined);
  if (!sessionId) {
    const sessionSource = runtime === 'claude'
      ? '--session or CLAUDE_CODE_SESSION_ID'
      : '--session';
    throw new Error(`session id is required through ${sessionSource}`);
  }
  const validation = core.validateHandoff(handoffPath, { sessionId });
  if (!validation.ok) throw new Error(validation.reason);

  // An answer prepare cannot carry forward would drop silently downstream.
  let specFolder = '';
  try {
    const note = core.parseHandoff(fs.readFileSync(handoffPath, 'utf8'));
    specFolder = typeof note.frontmatter.spec_folder === 'string'
      ? note.frontmatter.spec_folder
      : '';
  } catch {}
  if (specFolder !== '' && specFolder !== 'none' && !core.validSpecFolder(specFolder)) {
    throw new Error(
      'spec_folder must be the repo-relative packet path, none, or empty',
    );
  }

  if (!loopId) {
    supersedeClaimedNotes(handoffPath, { sessionId });
    printManualClaim(handoffPath, runtime, specFolder);
    return 3;
  }

  if (!isHookEnabled('session-relaunch')) {
    throw new Error('session relaunch is disabled by hook flags');
  }

  refuseForShellChild(loopId, runtime);

  const hopsValue = process.env.SKILLED_LOOP_HOPS;
  const hops = hopsValue === undefined || hopsValue === '' ? 0 : Number(hopsValue);
  if (!Number.isInteger(hops) || hops < 0) {
    throw new Error('SKILLED_LOOP_HOPS must be a non-negative integer');
  }

  const record = core.preparePending({
    loopId,
    handoffPath,
    sessionId,
    runtime,
    name: process.env.SKILLED_LOOP_NAME || null,
    cwd: process.cwd(),
    hops,
    env: process.env,
  });
  supersedeClaimedNotes(handoffPath, { loopId, sessionId });
  // The pending record is the prepare result; its log is best-effort.
  try {
    core.appendLog('prepare', { loopId, status: record.status, sessionId });
  } catch {}
  return 0;
}

function shouldRelaunch(args) {
  const { options } = parseArgs(args, { flags: ['--loop-id'] });
  const loopId = options['--loop-id'];
  if (!loopId) throw new Error('--loop-id is required');
  let record;
  try {
    record = stateForLoop(loopId);
  } catch (error) {
    if (!['ENOTDIR', 'EACCES', 'EISDIR'].includes(error.code)) throw error;
    record = null;
  }
  const switches = resolvedSwitches();
  const decision = core.shouldRelaunch(record, {
    now: Date.now(),
    maxHops: numericSwitch('SESSION_RELAUNCH_MAX_HOPS', 10, switches, { integer: true }),
    maxAgeMin: numericSwitch('SESSION_RELAUNCH_MAX_AGE_MIN', 10, switches),
  });
  const result = {
    relaunch: decision.relaunch,
    reason: decision.reason ?? null,
    cwd: record?.cwd ?? null,
    handoff: record?.handoff ?? null,
    name: record?.name ?? null,
    runtime: record?.runtime ?? null,
    hops: record?.hops ?? null,
  };
  process.stdout.write(`${JSON.stringify(result)}\n`);
  // The JSON decision is the command result; its log is best-effort.
  try {
    core.appendLog(decision.relaunch ? 'relaunch' : 'decline', {
      loopId,
      reason: decision.reason ?? 'ready',
    });
  } catch {}
  return decision.relaunch ? 0 : 1;
}

function claim(args) {
  const { options, positional } = parseArgs(args, { flags: ['--session'], positionalCount: 1 });
  const handoffPath = handoffPathWithinRepo(positional[0]);
  const runtime = process.env.SKILLED_LOOP_RUNTIME || 'claude';
  const sessionId = options['--session']
    || (runtime === 'claude' ? process.env.CLAUDE_CODE_SESSION_ID : undefined);
  if (!sessionId) {
    const sessionSource = runtime === 'claude'
      ? '--session or CLAUDE_CODE_SESSION_ID'
      : '--session';
    throw new Error(`session id is required through ${sessionSource}`);
  }
  core.claimHandoff(handoffPath, { sessionId });
  printHandoffBody(handoffPath);
  return 0;
}

function complete(args) {
  const { positional } = parseArgs(args, { positionalCount: 1 });
  core.completeHandoff(handoffPathWithinRepo(positional[0]));
  return 0;
}

function consume(args) {
  const { options } = parseArgs(args, { flags: ['--loop-id'] });
  const loopId = options['--loop-id'];
  if (!loopId) throw new Error('--loop-id is required');
  const record = core.readRelaunchFile(loopId);
  const handoffPath = typeof record?.handoff === 'string' ? record.handoff : '';
  let specFolder = '';
  let invalidSpecFolder = false;
  if (handoffPath) {
    let handoffText = '';
    try {
      handoffText = fs.readFileSync(handoffPath, 'utf8');
      const note = core.parseHandoff(handoffText);
      const candidate = typeof note.frontmatter.spec_folder === 'string'
        ? note.frontmatter.spec_folder
        : '';
      if (candidate === 'none' || core.validSpecFolder(candidate)) specFolder = candidate;
      else if (candidate) invalidSpecFolder = true;
    } catch {
      const frontmatter = handoffText.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
      const fields = frontmatter ? frontmatter[1].split(/\r?\n/) : [];
      fields.forEach((field, index) => {
        if (!/^\s*spec_folder\s*:/.test(field)) return;
        const candidate = field.slice(field.indexOf(':') + 1).trim();
        const continuation = fields.slice(index + 1)
          .find((line) => line.trim() !== '');
        if (
          candidate
          || (continuation && !/^[A-Za-z0-9_-]+\s*:/.test(continuation.trim()))
        ) {
          invalidSpecFolder = true;
        }
      });
    }
  }
  const statePath = core.relaunchFilePath(loopId);
  try {
    fs.unlinkSync(statePath);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (invalidSpecFolder) {
    try {
      core.appendLog('spec-folder-dropped', { loopId });
    } catch {}
  }
  process.stdout.write(`${JSON.stringify({ handoff: handoffPath, spec_folder: specFolder })}\n`);
  return 0;
}

/**
 * Execute one session-relaunch CLI command.
 *
 * @param {string[]} [args=process.argv.slice(2)] - Command and arguments.
 * @returns {number} Process exit code.
 */
function main(args = process.argv.slice(2)) {
  try {
    const [command, ...commandArgs] = args;
    switch (command) {
      case 'prepare': return prepare(commandArgs);
      case 'should-relaunch': return shouldRelaunch(commandArgs);
      case 'claim': return claim(commandArgs);
      case 'complete': return complete(commandArgs);
      case 'consume': return consume(commandArgs);
      default: throw new Error(
        'command must be prepare, should-relaunch, claim, complete, or consume',
      );
    }
  } catch (error) {
    process.stderr.write(`[session-relaunch] ${error.message}\n`);
    return 2;
  }
}

// ────────────────────────────────────────────────────────────────
// 4. EXECUTION
// ────────────────────────────────────────────────────────────────

if (require.main === module) process.exitCode = main();

// ────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ────────────────────────────────────────────────────────────────

module.exports = { main };
