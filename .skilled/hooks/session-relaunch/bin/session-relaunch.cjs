// ───────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch CLI
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const core = require('../lib/relaunch-core.cjs');
const nudge = require('../lib/nudge.cjs');
const hopHistory = require('../lib/hop-history.cjs');
const withdraw = require('../lib/withdraw.cjs');
const { isHookEnabled, loadConfigFile, configPath } = require('../../shared/hook-flags.cjs');
// Must match the runtimes skilled-loop can launch, or prepare refuses a loop the wrapper started.
const LOOP_RUNTIMES = core.RUNTIMES;
const GOAL_FILENAME = 'goal.md';
// Non-shell children run no job the killer could interrupt, so they are not detected.
const LIVE_SHELL_NAMES = new Set([
  'sh', 'bash', 'zsh', 'fish', 'dash', 'ksh', 'mksh', 'tcsh', 'csh', 'nu', 'pwsh',
]);
// The invocation every hook prints, so a caller copying the help text runs the same command.
const USAGE_PROGRAM = 'node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs';
// One row per subcommand and the only place its syntax is written, so the help listing
// and the failure hint cannot drift apart.
const SUBCOMMANDS = {
  prepare: {
    syntax: 'prepare --handoff <handoff-path> [--session <session-id>] [--runtime <runtime>]',
    summary: 'Validate the note and write the pending record that the runtime arms on its own stop event;'
      + ' outside a loop, or at the hop limit inside one, it prints the claim command and exits 3.',
  },
  'should-relaunch': {
    syntax: 'should-relaunch --loop-id <loop-id>',
    summary: 'Print the relaunch decision as JSON; exits 0 to relaunch and 1 to stay.',
  },
  keep: {
    syntax: 'keep --handoff <handoff-path> [--session <session-id>] [--runtime <runtime>]',
    summary: 'Outside a loop, validate the note, record it in the hop history and print the'
      + ' claim command for after auto-compaction.',
  },
  claim: {
    syntax: 'claim <handoff-path> [--session <session-id>]',
    summary: 'Mark an open note claimed and print its body, then the goal packet it carries.',
  },
  complete: {
    syntax: 'complete <handoff-path>',
    summary: 'Mark a claimed note done.',
  },
  consume: {
    syntax: 'consume --loop-id <loop-id>',
    summary: 'Print the handoff path, its spec folder and its goal packet, then remove the'
      + ' relaunch record.',
  },
  cancel: {
    syntax: 'cancel [--loop-id <loop-id>]',
    summary: 'Call off this loop\'s prepared hand-over so the session keeps running; the note'
      + ' stays open. The loop id defaults to SKILLED_LOOP_ID.',
  },
  'hand-over': {
    syntax: 'hand-over --handoff <handoff-path> [--hop <hop>] [--runtime <runtime>]',
    summary: 'When the note is open, record the hand-over and its notice; the wrapper calls it'
      + ' once it is about to relaunch, and it prints nothing and consumes nothing.',
  },
  history: {
    syntax: 'history [--last <count>]',
    summary: `Print the latest hops from the hop history, ${hopHistory.DEFAULT_HISTORY_LINES}`
      + ' by default.',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// An argument-parser failure is always a malformed invocation, so it carries the flag that
// main needs to answer with the subcommand syntax instead of the error message alone.
function invocationError(message) {
  const error = new Error(message);
  error.showUsage = true;
  return error;
}

function usageText() {
  const lines = [`Usage: ${USAGE_PROGRAM} <command> [options]`, '', 'Commands:'];
  for (const { syntax, summary } of Object.values(SUBCOMMANDS)) {
    lines.push(`  ${syntax}`, `    ${summary}`);
  }
  lines.push('', 'Options:', '  -h, --help  Print this text and exit 0', '');
  return lines.join('\n');
}

function usageHint(command) {
  const syntax = Object.hasOwn(SUBCOMMANDS, command) ? SUBCOMMANDS[command].syntax : null;
  // A known subcommand gets the single line it needed; an unknown one gets the listing.
  return syntax === null ? usageText() : `Usage: ${syntax}\n`;
}

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
    if (!allowedFlags.has(value)) throw invocationError(`unknown option ${value}`);
    if (options[value] !== undefined) throw invocationError(`duplicate option ${value}`);
    const next = args[index + 1];
    if (next === undefined || next.startsWith('--')) {
      throw invocationError(`missing value for ${value}`);
    }
    options[value] = next;
    index += 1;
  }

  if (positional.length !== positionalCount) {
    throw invocationError('unexpected or missing command arguments');
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
  const repository = nudge.resolveRepoRoot(process.env);
  // The nudge plans notes in this directory, so taking it from there keeps the two in step.
  const handoffDirectory = path.resolve(nudge.handoffDir(repository));
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
  // Both real paths below resolve through a linked directory, so containment alone
  // would pass a note stored anywhere. The directory must be the repository's own,
  // reached without a link below the repository root.
  const realRepository = fs.realpathSync(repository);
  const sameRelativePath = path.relative(realRepository, realDirectory)
    === path.relative(repository, handoffDirectory);
  if (!sameRelativePath) {
    throw new Error(
      'session-relaunch handoffs directory must be a real directory inside the repository',
    );
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

// Reads `comm` too for live-shell detection and fails closed: prepare refuses rather than
// arm a session whose running work it could not inspect.
function readProcessTableWithCommands(runtime) {
  const name = runtime.charAt(0).toUpperCase() + runtime.slice(1);
  let table;
  try {
    table = core.readProcessTable({ withCommand: true, throwOnFailure: true });
  } catch (error) {
    throw new Error(`could not inspect ${name} child processes: ${error.message}`);
  }
  return parseProcessTable(table);
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

// The runtime is found the way the killer target is: a preferred pid is kept only while it
// descends from the loop, and otherwise the walk from this process finds the loop's child.
function runtimePidFromLoop(loopId, processes, preferredPid) {
  const processTable = [...processes.values()]
    .map((processInfo) => `${processInfo.pid} ${processInfo.ppid}`)
    .join('\n');
  return core.resolveKillerTarget(loopId, { preferredPid, pid: process.pid, processTable });
}

function shellChildOfRuntime(
  runtimePid,
  runtime,
  processes = readProcessTableWithCommands(runtime),
) {
  const cliAncestors = cliAncestorsOf(processes);

  return [...processes.values()].find((processInfo) => (
    processInfo.ppid === runtimePid
    // A login shell reports its argv[0] with a leading dash, so strip one before the lookup.
    && LIVE_SHELL_NAMES.has(processInfo.command.replace(/^-/, ''))
    && !cliAncestors.has(processInfo.pid)
  )) || null;
}

function refuseForShellChild(loopId, runtime) {
  const rawClaudePid = runtime === 'claude' ? process.env.CLAUDE_PID : undefined;
  if (rawClaudePid !== undefined && rawClaudePid !== '') {
    const claudePid = Number(rawClaudePid);
    if (!Number.isInteger(claudePid) || claudePid <= 0) {
      throw new Error('CLAUDE_PID must be a positive process id');
    }
  }
  // An inherited or nested CLAUDE_PID names another session's runtime, whose shell
  // children say nothing about this loop, so it counts only from inside the loop.
  const processes = readProcessTableWithCommands(runtime);
  const runtimePid = runtimePidFromLoop(loopId, processes, rawClaudePid);
  if (runtimePid === null) {
    try {
      core.appendLog('running-work-check-skipped', { loopId });
    } catch {}
    return;
  }
  const child = shellChildOfRuntime(runtimePid, runtime, processes);
  if (child) {
    const name = runtime.charAt(0).toUpperCase() + runtime.slice(1);
    throw new Error(
      `${name} still has a live shell child (${child.command}, pid ${child.pid})`,
    );
  }
}

// The command still prints when the wrapper's template is unusable, in its plain form, so
// stderr says why the launch options it would have repeated are missing.
function printManualClaim(handoffPath, runtime, specFolder) {
  const templateProblem = core.manualTemplateProblem(process.env);
  if (templateProblem !== null) {
    process.stderr.write(
      `[session-relaunch] warning: ${templateProblem}; printing the plain command,`
        + ' so add any launch options back by hand\n',
    );
  }
  process.stdout.write(
    `${core.manualClaimCommand(runtime, handoffPath, specFolder, process.env)}\n`,
  );
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

function sessionIdFor(options, runtime) {
  const sessionId = options['--session']
    || (runtime === 'claude' ? process.env.CLAUDE_CODE_SESSION_ID : undefined);
  if (!sessionId) {
    const sessionSource = runtime === 'claude'
      ? '--session or CLAUDE_CODE_SESSION_ID'
      : '--session';
    throw new Error(`session id is required through ${sessionSource}`);
  }
  return sessionId;
}

// The checkouts a note's packet may live in: this repository, and the working directory the
// fresh session starts in, which a git worktree session does not share with the CLI's checkout.
function goalRoots(noteCwd) {
  const roots = [nudge.resolveRepoRoot(process.env)];
  if (path.isAbsolute(noteCwd)) roots.push(noteCwd);
  return roots;
}

// A packet the note carries and the receiver may be given: the switch is on and the packet
// still holds a goal.md, which it may have lost since the note was written.
function usableGoalPacket(frontmatter) {
  const packet = typeof frontmatter.goal_packet === 'string' ? frontmatter.goal_packet : '';
  if (packet === '' || !core.goalSwitchOn(resolvedSwitches())) return '';
  const noteCwd = typeof frontmatter.cwd === 'string' ? frontmatter.cwd : '';
  return core.goalPacketProblem(packet, goalRoots(noteCwd)) === null ? packet : '';
}

// The field belongs to this command and not to whoever wrote the note. Every prepare and keep
// resolves the sending session's goal again and writes the result, removing the field when no
// goal can be proven, so a note prepared after its goal ended does not hand the dead goal on. A
// failed write leaves the note as it was, since a hand-over never fails for want of a goal.
function recordGoalPacket({ handoffPath, noteCwd, specFolder, runtime, sessionId }) {
  if (!core.goalSwitchOn(resolvedSwitches())) return;
  const resolved = core.resolveGoalPacket({
    runtime,
    sessionId,
    specFolder: specFolder === 'none' ? '' : specFolder,
    roots: goalRoots(noteCwd),
    env: process.env,
  });
  try {
    core.recordGoalPacket(handoffPath, resolved);
  } catch {
    // The note stays as written, and the receiver is simply told nothing.
  }
}

// prepare and keep accept the same note, so they share one check of it.
function validatedNote(options, runtime) {
  if (!options['--handoff']) throw new Error('--handoff is required');
  const handoffPath = handoffPathWithinRepo(options['--handoff']);
  const sessionId = sessionIdFor(options, runtime);
  const validation = core.validateHandoff(handoffPath, { sessionId });
  if (!validation.ok) throw new Error(validation.reason);

  // An answer the note cannot carry forward would drop silently downstream.
  let specFolder = '';
  let noteCwd = '';
  try {
    const note = core.parseHandoff(fs.readFileSync(handoffPath, 'utf8'));
    specFolder = typeof note.frontmatter.spec_folder === 'string'
      ? note.frontmatter.spec_folder
      : '';
    noteCwd = typeof note.frontmatter.cwd === 'string' ? note.frontmatter.cwd : '';
  } catch {}
  if (specFolder !== '' && specFolder !== 'none' && !core.validSpecFolder(specFolder)) {
    throw new Error(
      'spec_folder must be the repo-relative packet path, none, or empty',
    );
  }
  // A shaped path can still name a packet this repository never had, and the fresh session
  // would then answer Gate 3 with a folder that is not there. Notes live in the checkout the
  // CLI runs from, yet the session may work in a git worktree whose packet that checkout does
  // not hold yet, and the fresh session starts in the note's own working directory.
  if (specFolder !== '' && specFolder !== 'none') {
    const roots = [nudge.resolveRepoRoot(process.env)];
    if (path.isAbsolute(noteCwd)) roots.push(noteCwd);
    const isDirectory = roots.some((root) => {
      try {
        return fs.statSync(path.join(root, specFolder)).isDirectory();
      } catch {
        // An unreadable path is a missing one, and the check below names it.
        return false;
      }
    });
    if (!isDirectory) {
      throw new Error(`spec_folder ${specFolder} does not exist in this repository`);
    }
  }
  recordGoalPacket({ handoffPath, noteCwd, specFolder, runtime, sessionId });
  return { handoffPath, sessionId, specFolder };
}

function stateForLoop(loopId) {
  if (typeof loopId !== 'string' || !loopId.trim()) throw new Error('--loop-id is required');
  return core.readRelaunchFile(loopId);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. COMMANDS
// ─────────────────────────────────────────────────────────────────────────────

function prepare(args) {
  // A runtime started from this loop session's shell inherits the loop variables, so it
  // must act as a session outside the loop.
  core.dropNestedLoop(process.env);

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

  const { handoffPath, sessionId, specFolder } = validatedNote(options, runtime);

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

  // At the hop cap the wrapper declines any record this session prepares, while the
  // killer its record arms would still end the session. So decline here instead: the
  // note stays open for the operator's own claim and nothing is armed.
  const maxHops = numericSwitch(
    'SESSION_RELAUNCH_MAX_HOPS',
    core.DEFAULT_MAX_HOPS,
    resolvedSwitches(),
    { integer: true },
  );
  if (hops >= maxHops) {
    process.stdout.write(
      '[session-relaunch] hop limit reached; continue in this session'
        + ' (auto-compaction remains the fallback)\n',
    );
    printManualClaim(handoffPath, runtime, specFolder);
    // The decline is the prepare result; its log is best-effort.
    try {
      core.appendLog('prepare-declined', { loopId, reason: 'hop-cap' });
    } catch {}
    return 3;
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
  // A caller that shows output but not the exit status reads a silent success as a
  // command that never ran, so the arming run states its outcome and the one action
  // left: end the turn and let the idle hop take over.
  process.stdout.write(
    '[session-relaunch] handoff prepared; stop now and end this turn.'
      + ' The loop ends this session when it goes idle and a fresh session continues from '
      + `${handoffPath}.\n`,
  );
  return 0;
}

// Outside the wrapper nothing can relaunch the session, so the note is kept for the same
// session to claim after auto-compaction, and the hop history records that it was kept.
function keep(args) {
  // A runtime started from this loop session's shell inherits the loop variables, so it
  // must act as a session outside the loop.
  core.dropNestedLoop(process.env);

  if (process.env.SKILLED_LOOP_ID) {
    throw new Error('this session runs under skilled-loop; run prepare instead');
  }
  const { options } = parseArgs(args, { flags: ['--handoff', '--session', '--runtime'] });
  const runtime = options['--runtime'] ?? 'claude';
  if (!LOOP_RUNTIMES.includes(runtime)) {
    throw new Error(`--runtime must be one of ${LOOP_RUNTIMES.join(', ')}`);
  }
  const { handoffPath, sessionId } = validatedNote(options, runtime);
  supersedeClaimedNotes(handoffPath, { sessionId });
  hopHistory.recordHop('note-kept', handoffPath, { runtime });
  process.stdout.write(
    '[session-relaunch] note kept; this session cannot relaunch, so keep working.'
      + ' After auto-compaction, run '
      + `\`${nudge.claimCommandFor(handoffPath, sessionId, USAGE_PROGRAM)}\`,`
      + ' continue its Remaining work, then run '
      + `\`${nudge.completeCommandFor(handoffPath, USAGE_PROGRAM)}\`.\n`,
  );
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
    maxHops: numericSwitch(
      'SESSION_RELAUNCH_MAX_HOPS',
      core.DEFAULT_MAX_HOPS,
      switches,
      { integer: true },
    ),
    maxAgeMin: numericSwitch('SESSION_RELAUNCH_MAX_AGE_MIN', core.DEFAULT_MAX_AGE_MIN, switches),
  });
  const result = {
    relaunch: decision.relaunch,
    reason: decision.reason ?? null,
    cwd: record?.cwd ?? null,
    handoff: record?.handoff ?? null,
    name: record?.name ?? null,
    runtime: record?.runtime ?? null,
    hops: record?.hops ?? null,
    signalled: typeof record?.signalledAt === 'string',
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
  const claimed = core.claimHandoff(handoffPath, { sessionId });
  hopHistory.recordHop('claimed', handoffPath, { session: sessionId });
  printHandoffBody(handoffPath);
  const goalPacket = usableGoalPacket(claimed.frontmatter);
  if (goalPacket !== '') {
    process.stdout.write(
      `\nGoal packet: ${goalPacket} (the goal the sending session worked under;`
        + ` read its ${GOAL_FILENAME})\n`,
    );
  }
  return 0;
}

function complete(args) {
  const { positional } = parseArgs(args, { positionalCount: 1 });
  const handoffPath = handoffPathWithinRepo(positional[0]);
  core.completeHandoff(handoffPath);
  hopHistory.recordHop('done', handoffPath);
  return 0;
}

function acceptedSpecFolder(candidate) {
  return candidate === 'none' || core.validSpecFolder(candidate);
}

// A note whose frontmatter no longer parses can still carry a usable Gate 3 answer for the
// manual command. One spec_folder line holding an accepted value, with no stray
// continuation below it, is kept; any other non-empty answer is dropped and logged.
function specFolderFromBrokenNote(handoffText) {
  const frontmatter = handoffText.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  const fields = frontmatter ? frontmatter[1].split(/\r?\n/) : [];
  const answers = [];
  fields.forEach((field, index) => {
    if (!/^\s*spec_folder\s*:/.test(field)) return;
    const continuation = fields.slice(index + 1).find((line) => line.trim() !== '');
    answers.push({
      candidate: field.slice(field.indexOf(':') + 1).trim(),
      continued: Boolean(continuation) && !/^[A-Za-z0-9_-]+\s*:/.test(continuation.trim()),
    });
  });
  if (
    answers.length === 1
    && !answers[0].continued
    && acceptedSpecFolder(answers[0].candidate)
  ) {
    return { specFolder: answers[0].candidate, invalid: false };
  }
  return {
    specFolder: '',
    invalid: answers.some(({ candidate, continued }) => candidate || continued),
  };
}

function consume(args) {
  const { options } = parseArgs(args, { flags: ['--loop-id'] });
  const loopId = options['--loop-id'];
  if (!loopId) throw new Error('--loop-id is required');
  const record = core.readRelaunchFile(loopId);
  const handoffPath = typeof record?.handoff === 'string' ? record.handoff : '';
  let specFolder = '';
  let goalPacket = '';
  let invalidSpecFolder = false;
  if (handoffPath) {
    let handoffText = '';
    try {
      handoffText = fs.readFileSync(handoffPath, 'utf8');
      const note = core.parseHandoff(handoffText);
      const candidate = typeof note.frontmatter.spec_folder === 'string'
        ? note.frontmatter.spec_folder
        : '';
      if (acceptedSpecFolder(candidate)) specFolder = candidate;
      else if (candidate) invalidSpecFolder = true;
      goalPacket = usableGoalPacket(note.frontmatter);
    } catch {
      ({ specFolder, invalid: invalidSpecFolder } = specFolderFromBrokenNote(handoffText));
    }
  }
  // The wrapper relaunches only an open note: a claim seed for any other state fails in
  // the fresh session and loses the hop, so it prints the manual command instead.
  const note = core.noteState(handoffPath);
  const statePath = core.relaunchFilePath(loopId);
  // A withdraw rewrites the record under its lock, so the unlink waits for the same lock.
  core.withAppendLock(statePath, () => {
    try {
      fs.unlinkSync(statePath);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  });
  if (invalidSpecFolder) {
    try {
      core.appendLog('spec-folder-dropped', { loopId });
    } catch {}
  }
  // A note with no goal packet keeps the output it always had.
  const consumed = { handoff: handoffPath, spec_folder: specFolder, note };
  if (goalPacket !== '') consumed.goal_packet = goalPacket;
  process.stdout.write(`${JSON.stringify(consumed)}\n`);
  return 0;
}

// The wrapper still declines after an approved decision when the note is not open or its
// consumed record cannot be read, so the hand-over is recorded here, in a call of its own
// made once the wrapper is about to relaunch. Nothing the wrapper needs comes back through
// it, so a hop is never held up by this call.
function handOver(args) {
  const { options } = parseArgs(args, { flags: ['--handoff', '--hop', '--runtime'] });
  if (!options['--handoff']) throw invocationError('--handoff is required');
  const handoffPath = handoffPathWithinRepo(options['--handoff']);
  const runtime = options['--runtime'];
  if (runtime !== undefined && !LOOP_RUNTIMES.includes(runtime)) {
    throw invocationError(`--runtime must be one of ${LOOP_RUNTIMES.join(', ')}`);
  }
  let hop = null;
  if (options['--hop'] !== undefined) {
    hop = Number(options['--hop']);
    if (!Number.isInteger(hop) || hop < 1) {
      throw invocationError('--hop must be a positive whole number');
    }
  }
  if (core.noteState(handoffPath) !== 'open') return 0;
  try {
    hopHistory.recordHop('handed-over', handoffPath, { hop, runtime });
    hopHistory.notifyHandOver(handoffPath, { switches: resolvedSwitches(), runtime });
  } catch {
    // The history and the notice are a record for the operator; the hop goes ahead without them.
  }
  return 0;
}

// A disarmed record is one no arm path takes and the killer refuses to act on, so the
// session keeps running. The note stays open, and the session gets one more nudge, since
// it may already have spent its last.
function cancel(args) {
  // A runtime started from this loop session's shell inherits the loop variables, and the
  // outer loop's id would then cancel the outer hand-over. An explicit --loop-id still
  // names the loop to cancel.
  core.dropNestedLoop(process.env);

  const { options } = parseArgs(args, { flags: ['--loop-id'] });
  const loopId = options['--loop-id'] || process.env.SKILLED_LOOP_ID;
  if (!loopId) throw new Error('--loop-id is required outside a loop');
  // The helper reads, judges and disarms under one lock, so a record a Stop armed or a
  // withdraw replaced in the meantime is never cancelled on the strength of an older read.
  const cancelled = withdraw.withdrawHandOver({ loopId, reason: 'cancelled', pending: 'any' });
  if (cancelled === null) {
    process.stdout.write('no prepared hand-over to cancel\n');
    return 1;
  }
  try {
    // Only an armed record carries an armedAt, so the stamp says which state was cancelled.
    core.appendLog('cancel', { loopId, status: cancelled.armedAt ? 'armed' : 'pending' });
  } catch {
    // The cancel is already done; its log is best-effort.
  }
  process.stdout.write(
    `cancelled the prepared hand-over for ${path.basename(String(cancelled.handoff ?? ''))};`
      + ' the note stays open\n',
  );
  return 0;
}

function history(args) {
  const { options } = parseArgs(args, { flags: ['--last'] });
  let last = hopHistory.DEFAULT_HISTORY_LINES;
  if (options['--last'] !== undefined) {
    last = Number(options['--last']);
    if (!Number.isInteger(last) || last < 1) {
      throw invocationError('--last must be a positive whole number');
    }
  }
  const lines = hopHistory.readHistory({ last });
  process.stdout.write(lines.length
    ? `${lines.join('\n')}\n`
    : `no hop recorded yet (${hopHistory.historyPath()})\n`);
  const openLine = hopHistory.openNotesLine();
  if (openLine !== null) process.stdout.write(`${openLine}\n`);
  return 0;
}

/**
 * Execute one session-relaunch CLI command.
 *
 * @param {string[]} [args=process.argv.slice(2)] - Command and arguments.
 * @returns {number} Process exit code.
 */
function main(args = process.argv.slice(2)) {
  const [command, ...commandArgs] = args;
  // Help answers before dispatch, because asking for the syntax must never fail on the
  // syntax of the arguments that asked for it.
  if (command === undefined || args.includes('--help') || args.includes('-h')) {
    process.stdout.write(usageText());
    return 0;
  }

  try {
    switch (command) {
      case 'prepare': return prepare(commandArgs);
      case 'keep': return keep(commandArgs);
      case 'should-relaunch': return shouldRelaunch(commandArgs);
      case 'claim': return claim(commandArgs);
      case 'complete': return complete(commandArgs);
      case 'consume': return consume(commandArgs);
      case 'hand-over': return handOver(commandArgs);
      case 'cancel': return cancel(commandArgs);
      case 'history': return history(commandArgs);
      default: throw invocationError(
        `command must be one of ${Object.keys(SUBCOMMANDS).join(', ')}`,
      );
    }
  } catch (error) {
    process.stderr.write(`[session-relaunch] ${error.message}\n`);
    // A malformed invocation answers with the syntax it missed, not the error alone.
    if (error.showUsage === true) process.stderr.write(usageHint(command));
    return 2;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXECUTION
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) process.exitCode = main();

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { main };
