// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: deep-loop dispatch-guard core (runtime-neutral policy)        ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Runtime-agnostic parsing + policy for Task-tool dispatches      ║
// ║          targeting deep-loop sub-agents. Owns registry indexing, target ║
// ║          identity resolution, Deep Route mode-mismatch detection,       ║
// ║          command-driven iteration recognition, session-scoped           ║
// ║          loop-repeat state, the bounded warning log, and the            ║
// ║          age-based sweep/archive/prune of its own state directory.      ║
// ║          evaluateDispatch() returns a transport-free decision so each   ║
// ║          runtime adapter (the OpenCode plugin, the Claude PreToolUse    ║
// ║          Task hook) can surface it in its own protocol. This module     ║
// ║          performs the loop-state persistence and the state-dir          ║
// ║          maintenance but NEVER writes to stdout/stderr and NEVER writes ║
// ║          the warning log itself -- the adapter appends warnings/audits  ║
// ║          so both runtimes share one bounded log path.                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const {
  appendFileSync,
  closeSync,
  linkSync,
  mkdirSync,
  openSync,
  readdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} = require('node:fs');
const { randomUUID } = require('node:crypto');
const { isAbsolute, join, relative, sep } = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const REGISTRY_RELATIVE_PATH = '.skilled/skills/system-deep-loop/mode-registry.json';
const LOOP_GUARD_STATE_DIR_RELATIVE_PATH = '.skilled/skills/.state/loop-guard';
const LOOP_GUARD_ARCHIVE_DIR_NAME = '.archive';
const WARN_LOG_FILENAME = 'guard-warnings.log';
const WARN_LOG_BACKUP_SUFFIX = '.1';
const WARN_LOG_MAX_BYTES_ENV = 'SYSTEM_DEEP_LOOP_GUARD_WARNING_LOG_MAX_BYTES';
const REJECT_MODE_ENV = 'SYSTEM_DEEP_LOOP_GUARD_REJECT';
const REJECT_LOOP_ENV = 'SYSTEM_DEEP_LOOP_GUARD_REJECT_LOOP';
const SWEEP_LOCK_DIR_NAME = '.sweep.lock';
const LOOP_STATE_LOCK_SUFFIX = '.lock';
const LOOP_STATE_LOCK_BREAK_SUFFIX = '.break';
const LOOP_STATE_LOCK_RETRY_MS = 10;
const LOOP_STATE_LOCK_TIMEOUT_MS = 2000;
const LOOP_STATE_LOCK_STALE_MS = 10000;
const LOOP_STATE_LOCK_TEMP_REGEX = /\.lock(?:\.break)?\.tmp-(\d+)-[0-9a-f-]+$/;
const LOOP_STATE_TEMP_FILE_REGEX = /^[0-9a-f]+\.json\.\d+\.\d+\.tmp$/;

// Retention/cleanup env vars, mirroring the opencode-goal.js sweep/archive/prune
// pattern: an active state file untouched past ACTIVE_RETENTION_DAYS is
// archived, and an archived file untouched past ARCHIVE_RETENTION_DAYS is
// deleted. Defaults match the goal plugin's current tuning.
const LOOP_GUARD_ACTIVE_RETENTION_DAYS_ENV = 'SYSTEM_DEEP_LOOP_GUARD_ACTIVE_RETENTION_DAYS';
const LOOP_GUARD_ARCHIVE_RETENTION_DAYS_ENV = 'SYSTEM_DEEP_LOOP_GUARD_ARCHIVE_RETENTION_DAYS';
const LOOP_GUARD_SWEEP_INTERVAL_MS_ENV = 'SYSTEM_DEEP_LOOP_GUARD_SWEEP_INTERVAL_MS';
const DEFAULT_ACTIVE_RETENTION_DAYS = 2;
const DEFAULT_ARCHIVE_RETENTION_DAYS = 90;
const DEFAULT_SWEEP_INTERVAL_MS = 60 * 60 * 1000;
const DEFAULT_WARN_LOG_MAX_BYTES = 256 * 1024;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Command-owned loop executors: dispatched only by their parent /deep:* command,
// which owns iteration state and convergence. One bounded external hand-off is
// tolerated, while repeated hand-offs re-implement the loop outside its owning
// command. Each of these owns its iteration state, and its LEAF agent forbids
// direct Task dispatch, so repeated hand-offs are the loop-outside-its-command
// smell the guard counts.
// Generic subagents (context/review/write/debug) and ai-council (also reachable
// via /deep:ai-council for multi-turn planning) are intentionally excluded from
// loop-repeat counting.
const LOOP_EXECUTOR_AGENTS = new Set(['deep-research', 'deep-review']);

// The parent commands retain a readable iteration line. Anchoring it and
// checking its bounds prevents incidental prose from gaining command authority.
const ITERATION_MARKER_REGEX = /(?:^|\n)\s*(?:Review\s+)?Iteration:\s*(\d+)\s+of\s+(\d+)\b/i;

const WARN_AT_COUNT = 2;
const BLOCK_AT_COUNT = 3;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS -- registry + mode mismatch
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Index the deep-loop mode registry by agent, mapping each agent to the set of
 * workflow modes it is registered for.
 *
 * @param {string} registryPath - absolute path to mode-registry.json
 * @returns {Map<string, { workflowModes: Set<string> }>|null} agent index, or null when unreadable
 */
function loadRegistryAgents(registryPath) {
  try {
    const raw = readFileSync(registryPath, 'utf8');
    const data = JSON.parse(raw);
    const map = new Map();
    for (const mode of data.modes || []) {
      const agent = typeof mode.agent === 'string' ? mode.agent.toLowerCase() : '';
      const workflowMode = typeof mode.workflowMode === 'string'
        ? mode.workflowMode.toLowerCase()
        : '';
      if (!agent || !workflowMode) continue;

      const entry = map.get(agent) || { workflowModes: new Set() };
      entry.workflowModes.add(workflowMode);
      map.set(agent, entry);
    }
    return map;
  } catch (_) {
    return null;
  }
}

/**
 * Read the workflow mode a dispatch prompt declares.
 *
 * @param {string} promptText - raw args.prompt value
 * @returns {string|null} lowercased declared mode, or null when absent
 */
function declaredModeFromPrompt(promptText) {
  const text = promptText || '';
  const deepRouteMatch = /(?:^|\n)\s*Deep Route:[^\n]*?\bmode=([a-z0-9-]+)/i.exec(text);
  const match = deepRouteMatch || /mode=([a-z0-9-]+)/i.exec(text);
  return match ? match[1].toLowerCase() : null;
}

/**
 * Render the operator-facing detail for a Deep Route mode mismatch.
 *
 * @param {string} subagentType - resolved agent identity
 * @param {Set<string>} registryModes - modes the agent is registered for
 * @param {string} declaredMode - mode the prompt declares
 * @returns {string} one-line mismatch detail
 */
function mismatchDetail(subagentType, registryModes, declaredMode) {
  const allowedModes = [...registryModes].sort().join('|');
  return [
    'system-deep-loop-guard: Deep Route mode mismatch --',
    `dispatch targets subagent_type="${subagentType}"`,
    `(registry modes="${allowedModes}")`,
    `but the prompt declares mode="${declaredMode}"`,
  ].join(' ');
}

// A real per-iteration prompt pack from a /deep:* command always names its own
// config artifact under a "Config:" line (e.g. "- Config: {spec_folder}/review/
// deep-review-config.json"). A bare "Iteration: N of M" marker alone is just
// prompt text -- any caller, or untrusted content echoed into a prompt via
// injection, can include that string with no relationship to a real dispatch.
// Requiring the marker to co-occur with a Config: path that resolves to a real,
// on-disk deep-loop config ties the exemption to filesystem state a forger
// cannot produce with text alone.
const STATE_CONFIG_PATH_REGEX = /(?:^|\n)\s*-?\s*Config:\s*(\S+)/i;

/**
 * Test whether one real path is a descendant of another.
 *
 * @param {string} realPath - fully resolved candidate path
 * @param {string} realRoot - fully resolved root path
 * @returns {boolean} true when the candidate sits inside the root
 */
function isWithinRoot(realPath, realRoot) {
  const relativePath = relative(realRoot, realPath);
  return relativePath !== ''
    && !isAbsolute(relativePath)
    && relativePath !== '..'
    && !relativePath.startsWith(`..${sep}`);
}

/**
 * Resolve the deep-loop config artifact a prompt's "Config:" line names.
 *
 * Rejecting a literal '..' only blocks the naive escape: any absolute path
 * would still pass, so a prompt could borrow the command-driven exemption with
 * any JSON file on the machine carrying a `mode` string and a numeric
 * `maxIterations`. The config therefore has to live inside the project, and
 * both sides are resolved through their real paths so a symlink planted inside
 * the project cannot back the exemption with a file that lives outside it.
 *
 * @param {string} promptText - raw args.prompt value
 * @param {string} projectDir - project root; relative config paths resolve against it
 * @returns {string|null} real config path inside the project, or null when the
 *   project root or the file is missing, or the file resolves outside the project
 */
function resolveCommandConfigPath(promptText, projectDir) {
  const match = STATE_CONFIG_PATH_REGEX.exec(promptText || '');
  if (!match) return null;
  const rawPath = match[1].trim();
  if (!rawPath || !projectDir || rawPath.includes('..')) return null;

  try {
    const realProjectDir = realpathSync(projectDir);
    const candidatePath = isAbsolute(rawPath) ? rawPath : join(realProjectDir, rawPath);
    const realConfigPath = realpathSync(candidatePath);
    return isWithinRoot(realConfigPath, realProjectDir) ? realConfigPath : null;
  } catch (_) {
    // A missing project root or config file cannot back an iteration exemption.
    return null;
  }
}

/**
 * Decide whether a prompt looks like a command-owned iteration pack: an
 * in-bounds iteration marker plus a Config: path resolving to a real deep-loop
 * config that lives inside the project. It checks shape and project ownership,
 * not who wrote the file.
 *
 * @param {string} promptText - raw args.prompt value
 * @param {string} projectDir - project root used to resolve relative paths
 * @returns {boolean} true when the dispatch carries command-owned iteration state
 */
function isCommandDrivenIteration(promptText, projectDir) {
  const match = ITERATION_MARKER_REGEX.exec(promptText || '');
  if (!match) return false;

  const iteration = Number(match[1]);
  const maxIterations = Number(match[2]);
  if (!(iteration >= 1 && maxIterations >= 1 && iteration <= maxIterations)) return false;

  const configPath = resolveCommandConfigPath(promptText, projectDir);
  if (!configPath) return false;

  try {
    const raw = readFileSync(configPath, 'utf8');
    const config = JSON.parse(raw);
    // Not an exact match against the claimed N/M -- a slightly stale prompt pack
    // from an earlier reducer sync is legitimate. This only proves the referenced
    // path is a genuine, on-disk deep-loop config artifact, not a phantom string.
    return Boolean(config) && typeof config === 'object'
      && typeof config.mode === 'string'
      && Number.isFinite(Number(config.maxIterations));
  } catch (_) {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. HELPERS -- target identity resolution
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve the real dispatch target's agent identity.
 *
 * orchestrate's own dispatch convention sets subagent_type="general" for every
 * Task call regardless of target (the specialized agent's definition file is
 * pasted into the prompt body instead), so subagent_type alone cannot identify
 * the target. Parse the prompt's "Agent: @<name>" / "Deep Route: ... target_agent=@<name>"
 * fields first; fall back to subagent_type only when it is not the generic
 * "general" placeholder (covers callers that do set it directly, e.g. this
 * repo's own fan-out lineage prompts).
 *
 * @param {string} subagentType - raw args.subagent_type / args.subagentType value
 * @param {string} promptText - raw args.prompt value
 * @returns {string|null} resolved agent identity, or null if unresolvable
 */
function resolveTargetIdentity(subagentType, promptText) {
  const text = promptText || '';
  const deepRouteMatch = /target_agent=@?([a-z0-9-]+)/i.exec(text);
  if (deepRouteMatch) return deepRouteMatch[1].toLowerCase();

  const agentLineMatch = /(?:^|\n)\s*Agent:\s*@?([a-z0-9-]+)/i.exec(text);
  if (agentLineMatch) return agentLineMatch[1].toLowerCase();

  if (typeof subagentType === 'string' && subagentType.toLowerCase() !== 'general') {
    return subagentType.toLowerCase();
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. HELPERS -- session-scoped loop-repeat state (atomic file persistence)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Encode a session id into a filesystem-safe state-file key.
 *
 * @param {string} sessionID - current session id
 * @returns {string} hex-encoded session key
 */
function sessionStateKey(sessionID) {
  return Buffer.from(String(sessionID), 'utf8').toString('hex');
}

/**
 * Build the per-session loop-state file path.
 *
 * @param {string} stateDir - loop-guard state directory
 * @param {string} sessionID - current session id
 * @returns {string} absolute state-file path
 */
function loopStatePath(stateDir, sessionID) {
  return join(stateDir, `${sessionStateKey(sessionID)}.json`);
}

/**
 * Read the persisted loop state for one session, tolerating a missing or
 * unreadable file.
 *
 * @param {string} stateDir - loop-guard state directory
 * @param {string} sessionID - current session id
 * @returns {object} parsed state, or an empty object when unavailable
 */
function readLoopState(stateDir, sessionID) {
  try {
    const raw = readFileSync(loopStatePath(stateDir, sessionID), 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (_) {
    return {};
  }
}

/**
 * Persist one session's loop state through a temp-file rename so a concurrent
 * reader never observes a partial write.
 *
 * @param {string} stateDir - loop-guard state directory
 * @param {string} sessionID - current session id
 * @param {object} state - state to persist
 * @returns {boolean} true when the state reached its final path
 */
function writeLoopStateAtomic(stateDir, sessionID, state) {
  try {
    mkdirSync(stateDir, { recursive: true });
  } catch (_) {
    return false;
  }
  const finalPath = loopStatePath(stateDir, sessionID);
  const tempPath = `${finalPath}.${process.pid}.${Date.now()}.tmp`;
  try {
    writeFileSync(tempPath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
    renameSync(tempPath, finalPath);
    return true;
  } catch (_) {
    try { unlinkSync(tempPath); } catch (_ignored) { /* best-effort cleanup */ }
    // Fail open: a persistence error must never block the dispatch it guards.
    return false;
  }
}

/**
 * Sleep synchronously without spinning a CPU core.
 *
 * @param {number} milliseconds - wait duration
 * @returns {void}
 */
function sleepSync(milliseconds) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
}

/**
 * Read a loop-state lock's recorded owner. Acquisition installs the record
 * atomically with the lock, so content without both a pid and a token can only
 * be corruption; its age, not an owner probe, has to decide staleness.
 *
 * @param {string} lockPath - per-session lock or break-lock path
 * @returns {{ pid: number|null, token: string|null }} recorded owner, or nulls
 */
function readLoopStateLock(lockPath) {
  try {
    const match = /^(\d+)\s+(\S+)\s*$/.exec(readFileSync(lockPath, 'utf8').trim());
    if (!match) return { pid: null, token: null };
    const pid = Number(match[1]);
    if (!Number.isSafeInteger(pid) || pid <= 0) return { pid: null, token: null };
    return { pid, token: match[2] };
  } catch (_) {
    return { pid: null, token: null };
  }
}

/**
 * Probe whether a lock owner's pid still refers to a running process.
 *
 * @param {number|null} pid - recorded owner pid
 * @returns {boolean} true unless the kernel reports the pid gone
 */
function processIsAlive(pid) {
  if (!Number.isSafeInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    // EPERM names a live process owned by another user; only ESRCH proves death.
    return error.code !== 'ESRCH';
  }
}

/**
 * Decide whether a lock may be removed. A readable owner is authoritative and
 * only its death makes the lock stale; unreadable content (corruption, since
 * acquisition installs the record atomically) falls back to the stale window.
 *
 * @param {{ pid: number|null, token: string|null }} owner - recorded owner
 * @param {number} ageMs - lock file age
 * @returns {boolean} true when the lock is abandoned
 */
function loopStateLockIsStale(owner, ageMs) {
  if (owner.pid !== null) return !processIsAlive(owner.pid);
  return ageMs > LOOP_STATE_LOCK_STALE_MS;
}

/**
 * Create a lock file with this process's pid and a fresh token. The record is
 * written to a private temp file and hard-linked into place, so the lock path
 * is never visible without a complete owner record and a held lock reports
 * EEXIST from the link rather than from the initial create.
 *
 * @param {string} lockPath - per-session lock or break-lock path
 * @returns {string|null} this process's token, or null when the path is already held
 */
function createLoopStateLock(lockPath) {
  const token = randomUUID();
  const tempPath = `${lockPath}.tmp-${process.pid}-${token}`;
  const descriptor = openSync(tempPath, 'wx', 0o600);
  try {
    writeFileSync(descriptor, `${process.pid} ${token}\n`, 'utf8');
  } catch (error) {
    closeSync(descriptor);
    try { unlinkSync(tempPath); } catch (_ignored) { /* best-effort cleanup */ }
    throw error;
  }
  closeSync(descriptor);
  try {
    linkSync(tempPath, lockPath);
  } catch (error) {
    if (error && error.code === 'EEXIST') return null;
    throw error;
  } finally {
    try { unlinkSync(tempPath); } catch (_ignored) { /* best-effort cleanup */ }
  }
  return token;
}

/**
 * Remove a lock this process created once its update is complete. Only the
 * owner whose token still sits in the file may remove it, so a stalled process
 * that lost a per-session lock cannot delete its breaker's lock, and a breaker
 * that lost the break lock cannot delete the next breaker's.
 *
 * @param {string} lockPath - per-session lock or break-lock path
 * @param {string} token - token returned by acquisition
 * @returns {void}
 */
function releaseLoopStateLock(lockPath, token) {
  const owner = readLoopStateLock(lockPath);
  if (owner.pid !== process.pid || owner.token !== token) return;
  try {
    unlinkSync(lockPath);
  } catch (_) {
    // Fail open: a lost lock is recovered through the dead-owner break path.
  }
}

/**
 * Take the break lock that serializes lock removal, retiring one whose breaker
 * died so a crashed breaker cannot block every later contender.
 *
 * Retiring an abandoned break lock is left as the whole attempt's progress:
 * returning null makes the retiring contender wait a retry before it competes for
 * the fresh lock, which narrows but does not close a race that needs a breaker to
 * have died while holding the break lock.
 *
 * @param {string} breakPath - break-lock path
 * @param {number} now - current clock in ms
 * @returns {string|null} this process's break-lock token, or null when another
 *   live breaker holds it
 */
function acquireLoopStateBreakLock(breakPath, now) {
  let token;
  try {
    token = createLoopStateLock(breakPath);
  } catch (_) {
    return null;
  }
  if (token) return token;

  let breakStats;
  try {
    breakStats = statSync(breakPath);
  } catch (_) {
    // The prior breaker released it between the create and the stat; retry later.
    return null;
  }
  const owner = readLoopStateLock(breakPath);
  if (!loopStateLockIsStale(owner, now - breakStats.mtimeMs)) return null;
  try {
    unlinkSync(breakPath);
  } catch (_) {
    // Another contender retired it first; this attempt made no progress either way.
  }
  return null;
}

/**
 * Remove a per-session lock that is abandoned, under a `<lockPath>.break` mutex
 * so only one contender removes it at a time.
 *
 * Breaking by rename cannot work: a claimed lock has to be renamed back when it
 * turns out to be a live replacement, and a contender can create a fresh lock
 * between that rename and the restore, leaving two owners updating one state. A
 * break lock installed by a hard link is never moved out from under another
 * contender, and the per-session lock is unlinked only after a re-read held by
 * the break lock still finds it abandoned, so a live owner keeps its lock.
 *
 * Staleness is judged by owner liveness: a readable owner whose pid is dead is
 * abandoned immediately, while unreadable content (corruption, since acquisition
 * installs the record atomically) falls back to the stale window. The same rule
 * retires a break lock whose breaker died.
 *
 * Remaining limit: a pid reused by an unrelated process makes a dead owner look
 * alive, which only delays acquisition until it times out. The break-lock
 * retirement race is a second limit: two contenders that both judge the same
 * breaker dead can interleave so one removes the fresh break lock the other
 * created.
 *
 * @param {string} lockPath - per-session lock path
 * @param {number} now - current clock in ms
 * @returns {void}
 */
function breakAbandonedLoopStateLock(lockPath, now) {
  const breakPath = `${lockPath}${LOOP_STATE_LOCK_BREAK_SUFFIX}`;
  const breakToken = acquireLoopStateBreakLock(breakPath, now);
  if (!breakToken) return;

  try {
    let lockStats;
    try {
      lockStats = statSync(lockPath);
    } catch (_) {
      // Its owner released it before the break lock was taken.
      return;
    }
    const owner = readLoopStateLock(lockPath);
    if (!loopStateLockIsStale(owner, now - lockStats.mtimeMs)) return;
    try {
      unlinkSync(lockPath);
    } catch (_) {
      // Fail open: an unremovable lock is judged again on the next attempt.
    }
  } finally {
    releaseLoopStateLock(breakPath, breakToken);
  }
}

/**
 * Take the per-session loop-state lock, waiting briefly when another hook
 * process holds it. A lock whose owner died is removed through the break lock,
 * so contenders that all judge it abandoned cannot each remove it and update the
 * state at once. Acquisition always retries the atomic link and never installs
 * the per-session lock itself by renaming.
 *
 * @param {string} stateDir - loop-guard state directory
 * @param {string} lockPath - per-session lock path
 * @returns {string|null} this process's lock token, or null when acquisition timed out
 */
function acquireLoopStateLock(stateDir, lockPath) {
  try {
    mkdirSync(stateDir, { recursive: true });
  } catch (_) {
    return null;
  }

  const deadline = Date.now() + LOOP_STATE_LOCK_TIMEOUT_MS;
  for (;;) {
    if (Date.now() >= deadline) return null;

    let token;
    try {
      token = createLoopStateLock(lockPath);
    } catch (_) {
      return null;
    }
    if (token) return token;

    // This judgement only decides whether a break is worth attempting; the break
    // re-judges under the break lock before it unlinks anything.
    let lockStats;
    try {
      lockStats = statSync(lockPath);
    } catch (_) {
      // The prior holder released it between attempts; retry the create now.
      continue;
    }

    const owner = readLoopStateLock(lockPath);
    if (loopStateLockIsStale(owner, Date.now() - lockStats.mtimeMs)) {
      breakAbandonedLoopStateLock(lockPath, Date.now());
    }

    if (Date.now() >= deadline) return null;
    sleepSync(LOOP_STATE_LOCK_RETRY_MS);
  }
}

/**
 * Extract one target's dispatch entry, defaulting a missing session or target
 * to a zero count so the locked and unlocked paths report counts alike.
 *
 * @param {object} state - parsed session state
 * @param {string} targetAgent - resolved loop-executor identity
 * @returns {{ dispatches: object, entry: { count?: number } }} dispatches map and target entry
 */
function readDispatchEntry(state, targetAgent) {
  const dispatches = state.dispatches && typeof state.dispatches === 'object'
    ? state.dispatches
    : {};
  const entry = dispatches[targetAgent] && typeof dispatches[targetAgent] === 'object'
    ? dispatches[targetAgent]
    : { count: 0 };
  return { dispatches, entry };
}

/**
 * Record one dispatch to a loop-executor target and return the updated
 * non-command-driven count for that target in this session.
 *
 * @param {string} stateDir - loop-guard state directory
 * @param {string} sessionID - current session id
 * @param {string} targetAgent - resolved loop-executor identity
 * @param {boolean} commandDriven - true when the dispatch carries iteration-state markers
 * @returns {{ count: number, persisted: boolean }} updated count and persistence status
 */
function recordLoopDispatch(stateDir, sessionID, targetAgent, commandDriven) {
  // Concurrent hook processes share one state file, so the read-modify-write
  // needs mutual exclusion or one hand-off overwrites another's increment.
  const lockPath = `${loopStatePath(stateDir, sessionID)}${LOOP_STATE_LOCK_SUFFIX}`;
  const lockToken = acquireLoopStateLock(stateDir, lockPath);
  if (!lockToken) {
    // An unlocked update would race the lock holder and can lose an increment,
    // so report the count already on disk and leave persistence to a later hook.
    const { entry } = readDispatchEntry(readLoopState(stateDir, sessionID), targetAgent);
    return {
      count: (entry.count || 0) + (commandDriven ? 0 : 1),
      persisted: false,
    };
  }

  try {
    const { dispatches, entry } = readDispatchEntry(
      readLoopState(stateDir, sessionID),
      targetAgent,
    );

    if (!commandDriven) entry.count = (entry.count || 0) + 1;
    entry.lastCommandDriven = commandDriven;
    entry.lastTimestamp = new Date().toISOString();
    dispatches[targetAgent] = entry;

    const persisted = writeLoopStateAtomic(stateDir, sessionID, {
      sessionId: sessionID,
      dispatches,
    });

    return { count: entry.count, persisted };
  } finally {
    releaseLoopStateLock(lockPath, lockToken);
  }
}

/**
 * Render the operator-facing detail for repeated hand-offs to a loop executor.
 *
 * @param {string} targetAgent - resolved loop-executor identity
 * @param {number} count - non-command-driven hand-off count this session
 * @returns {string} one-line repeat detail
 */
function loopRepeatDetail(targetAgent, count) {
  return [
    'system-deep-loop-guard: loop-like repeated dispatch --',
    `"${targetAgent}" received ${count} non-command-driven hand-offs`,
    'in this session without a command-driven iteration marker;',
    'command-owned loop executors should be dispatched by their parent /deep:* command,',
    'not repeatedly handed off by another agent.',
  ].join(' ');
}

/**
 * Append one warning line to the bounded state-dir log, rotating it first.
 *
 * Soft warnings must never reach stdout/stderr: OpenCode's TUI paints plugin
 * console output onto the prompt input line during tool.execute.before, where it
 * sticks until a redraw. Persisting to a state-dir log keeps the signal auditable
 * without corrupting the interactive session. Fail-open -- a logging error must
 * never affect or block the dispatch this hook guards.
 *
 * @param {string} stateDir - loop-guard state directory
 * @param {string} detail - warning detail to record
 * @returns {boolean} true when the line was written
 */
function appendWarningLog(stateDir, detail) {
  const line = `${new Date().toISOString()} [system-deep-loop-guard] WARN: ${detail}\n`;
  try {
    mkdirSync(stateDir, { recursive: true });
    const logPath = join(stateDir, WARN_LOG_FILENAME);
    maintainWarningLogPath(logPath, Buffer.byteLength(line));
    appendFileSync(logPath, line, 'utf8');
    return true;
  } catch (_) {
    // Fail open: swallow logging errors so the guarded dispatch is untouched.
    return false;
  }
}

/**
 * Record that reject mode could not enforce its decision, so the dispatch was
 * allowed. Falls back to a sibling log path when the state dir is unusable.
 *
 * @param {string} stateDir - loop-guard state directory
 * @param {string} reason - why reject mode degraded
 * @returns {void}
 */
function appendRejectModeDegradedAudit(stateDir, reason) {
  const detail = `reject-mode degraded -- ${reason}; dispatch allowed`;
  if (appendWarningLog(stateDir, detail)) return;

  // A sibling fallback remains writable when the configured state path is a file.
  const fallbackPath = `${stateDir}.${WARN_LOG_FILENAME}`;
  const line = `${new Date().toISOString()} [system-deep-loop-guard] WARN: ${detail}\n`;
  try {
    maintainWarningLogPath(fallbackPath, Buffer.byteLength(line));
    appendFileSync(fallbackPath, line, 'utf8');
  } catch (_) {
    // Fail open even when both audit locations are unavailable.
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5b. HELPERS -- retention (age-based sweep, archive, prune)
// ─────────────────────────────────────────────────────────────────────────────

function positiveIntFromEnv(envName, fallback) {
  const raw = Number(process.env[envName]);
  return Number.isFinite(raw) && raw > 0 ? Math.trunc(raw) : fallback;
}

function maintainWarningLogPath(logPath, incomingBytes = 0) {
  const retentionMs = positiveIntFromEnv(
    LOOP_GUARD_ARCHIVE_RETENTION_DAYS_ENV,
    DEFAULT_ARCHIVE_RETENTION_DAYS,
  ) * MS_PER_DAY;

  for (const candidatePath of [logPath, `${logPath}${WARN_LOG_BACKUP_SUFFIX}`]) {
    try {
      const fileStats = statSync(candidatePath);
      if (Date.now() - fileStats.mtimeMs > retentionMs) unlinkSync(candidatePath);
    } catch (_) {
      // Absent or unreadable logs require no maintenance.
    }
  }

  try {
    const fileStats = statSync(logPath);
    const maxBytes = positiveIntFromEnv(WARN_LOG_MAX_BYTES_ENV, DEFAULT_WARN_LOG_MAX_BYTES);
    if (fileStats.size + incomingBytes <= maxBytes) return;

    const backupPath = `${logPath}${WARN_LOG_BACKUP_SUFFIX}`;
    try { unlinkSync(backupPath); } catch (_ignored) { /* A prior generation is optional. */ }
    renameSync(logPath, backupPath);
  } catch (_) {
    // Absent or unreadable logs require no rotation.
  }
}

/**
 * Rotate and age-prune the state-dir warning log.
 *
 * @param {string} stateDir - loop-guard state directory
 * @returns {void}
 */
function maintainWarningLog(stateDir) {
  maintainWarningLogPath(join(stateDir, WARN_LOG_FILENAME));
}

function ensureLoopGuardArchiveDir(stateDir) {
  const archiveDir = join(stateDir, LOOP_GUARD_ARCHIVE_DIR_NAME);
  try {
    mkdirSync(archiveDir, { recursive: true, mode: 0o700 });
  } catch (_) {
    return null;
  }
  return archiveDir;
}

// Deletes archived per-session state files whose mtime exceeds the archive
// retention window. Called only from within the already-throttled sweep below,
// so it does not need its own separate throttle.
function pruneLoopGuardArchive(stateDir) {
  const archiveDir = join(stateDir, LOOP_GUARD_ARCHIVE_DIR_NAME);
  let entries;
  try {
    entries = readdirSync(archiveDir, { withFileTypes: true });
  } catch (_) {
    return;
  }
  const retentionMs = positiveIntFromEnv(
    LOOP_GUARD_ARCHIVE_RETENTION_DAYS_ENV,
    DEFAULT_ARCHIVE_RETENTION_DAYS,
  ) * MS_PER_DAY;
  const now = Date.now();
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const filePath = join(archiveDir, entry.name);
    try {
      const fileStats = statSync(filePath);
      if (now - fileStats.mtimeMs > retentionMs) unlinkSync(filePath);
    } catch (_) {
      // Fail open on a single entry; the rest of the prune pass still runs.
    }
  }
}

function acquireSweepLock(stateDir, intervalMs, now) {
  try {
    mkdirSync(stateDir, { recursive: true });
  } catch (_) {
    return null;
  }

  const lockPath = join(stateDir, SWEEP_LOCK_DIR_NAME);
  try {
    mkdirSync(lockPath, { mode: 0o700 });
    return lockPath;
  } catch (error) {
    if (!error || error.code !== 'EEXIST') return null;
  }

  try {
    const lockStats = statSync(lockPath);
    if (now - lockStats.mtimeMs <= intervalMs) return null;
    rmdirSync(lockPath);
    mkdirSync(lockPath, { mode: 0o700 });
    return lockPath;
  } catch (_) {
    return null;
  }
}

/**
 * Archive per-session loop-guard state files that have gone untouched past the
 * active-retention window, then prune the archive itself. Throttled to once
 * per sweep interval via runtimeState, mirroring opencode-goal.js's
 * sweepOrphanedActiveStates/maybePruneArchive pair.
 *
 * The state directory is shared by multiple OpenCode processes. An atomic
 * directory lock prevents concurrent sweep passes, while a final re-stat keeps
 * freshly touched state active.
 *
 * @param {string} stateDir - loop-guard state directory
 * @param {{ lastLoopGuardSweepAtMs?: number }} runtimeState - per-plugin-instance throttle state
 */
function sweepStaleLoopGuardStates(stateDir, runtimeState) {
  let lockPath = null;
  try {
    const intervalMs = positiveIntFromEnv(
      LOOP_GUARD_SWEEP_INTERVAL_MS_ENV,
      DEFAULT_SWEEP_INTERVAL_MS,
    );
    const now = Date.now();
    if (now - (runtimeState.lastLoopGuardSweepAtMs || 0) <= intervalMs) return;
    lockPath = acquireSweepLock(stateDir, intervalMs, now);
    if (!lockPath) return;
    runtimeState.lastLoopGuardSweepAtMs = now;

    maintainWarningLog(stateDir);

    let entries;
    try {
      entries = readdirSync(stateDir, { withFileTypes: true });
    } catch (_) {
      return;
    }
    const archiveDir = ensureLoopGuardArchiveDir(stateDir);
    if (!archiveDir) return;

    const activeRetentionMs = positiveIntFromEnv(
      LOOP_GUARD_ACTIVE_RETENTION_DAYS_ENV,
      DEFAULT_ACTIVE_RETENTION_DAYS,
    ) * MS_PER_DAY;
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const sourcePath = join(stateDir, entry.name);

      if (LOOP_STATE_TEMP_FILE_REGEX.test(entry.name)) {
        try {
          const fileStats = statSync(sourcePath);
          if (now - fileStats.mtimeMs > activeRetentionMs) unlinkSync(sourcePath);
        } catch (_) {
          // Fail open on a single entry; the rest of the sweep pass still runs.
        }
        continue;
      }

      const lockTempMatch = LOOP_STATE_LOCK_TEMP_REGEX.exec(entry.name);
      if (lockTempMatch) {
        // A creator killed between writing its temp file and linking it leaves this
        // behind; its embedded pid or the stale window proves it is not in flight.
        try {
          const fileStats = statSync(sourcePath);
          const tempPid = Number(lockTempMatch[1]);
          if (!processIsAlive(tempPid) || now - fileStats.mtimeMs > LOOP_STATE_LOCK_STALE_MS) {
            unlinkSync(sourcePath);
          }
        } catch (_) {
          // Fail open on a single entry; the rest of the sweep pass still runs.
        }
        continue;
      }

      if (entry.name.endsWith(LOOP_STATE_LOCK_SUFFIX)) {
        // The sweep removes a lock on the same owner-liveness rule as acquisition:
        // age alone only decides for content that names no readable owner.
        breakAbandonedLoopStateLock(sourcePath, now);
        continue;
      }

      if (!entry.name.endsWith('.json')) continue;
      try {
        const candidateStats = statSync(sourcePath);
        if (now - candidateStats.mtimeMs <= activeRetentionMs) continue;
        const currentStats = statSync(sourcePath);
        if (now - currentStats.mtimeMs <= activeRetentionMs) continue;
        renameSync(sourcePath, join(archiveDir, entry.name));
      } catch (_) {
        // Fail open on a single entry; the rest of the sweep pass still runs.
      }
    }

    pruneLoopGuardArchive(stateDir);
  } catch (_) {
    // Fail open: a sweep error must never affect session startup.
  } finally {
    if (lockPath) {
      try { rmdirSync(lockPath); } catch (_) { /* A lost lock must not affect startup. */ }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. PATHS + POLICY EVALUATION (runtime-neutral)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve the registry file and per-project state directory both runtime
 * adapters read/write. Keeping this in the core guarantees the OpenCode plugin
 * and the Claude hook agree on one bounded warning-log path and one state dir.
 *
 * @param {string} projectDir - project root (OpenCode ctx.directory / Claude cwd)
 * @returns {{ registryPath: string, stateDir: string }}
 */
function resolveGuardPaths(projectDir) {
  const dir = projectDir || process.cwd();
  return {
    registryPath: join(dir, REGISTRY_RELATIVE_PATH),
    stateDir: join(dir, LOOP_GUARD_STATE_DIR_RELATIVE_PATH),
  };
}

/**
 * Evaluate one Task dispatch against both guard checks and return a
 * transport-free decision. This function performs the required loop-state
 * persistence (the only way to compute the per-session count) but does NOT
 * append the warning log or emit any output -- the caller applies `warnings`
 * and `audits` through appendWarningLog/appendRejectModeDegradedAudit and then
 * surfaces the decision in its own runtime protocol (throw for OpenCode, a deny
 * JSON for Claude). The sequencing mirrors the original single-runtime plugin:
 * Check 1 (mode mismatch) runs first and short-circuits to `reject` under the
 * mode-reject env before Check 2 (loop-repeat) can run; a mismatch warning is
 * recorded and Check 2 still runs.
 *
 * Fail-open: any unexpected internal error resolves to an allow with no side
 * effects, so a bug here never blocks unrelated, correctly-routed work.
 *
 * @param {{ subagentType?: string, prompt?: string, sessionID?: string, projectDir?: string, env?: NodeJS.ProcessEnv }} request
 * @returns {{ decision: 'allow'|'warn'|'reject', detail: string|null, warnings: string[], audits: string[] }}
 */
function evaluateDispatch(request = {}) {
  const { subagentType, prompt, sessionID, projectDir } = request;
  const environment = request.env || process.env;
  const warnings = [];
  const audits = [];

  try {
    const { registryPath, stateDir } = resolveGuardPaths(projectDir);
    const targetAgent = resolveTargetIdentity(subagentType, prompt);
    if (!targetAgent) return { decision: 'allow', detail: null, warnings, audits };

    // -- Check 1: Deep Route mode mismatch --
    const registry = loadRegistryAgents(registryPath);
    if (!registry) {
      if (environment[REJECT_MODE_ENV] === '1') audits.push('mode registry unavailable');
    } else {
      const entry = registry.get(targetAgent);
      if (entry) {
        const declaredMode = declaredModeFromPrompt(prompt);
        if (declaredMode && !entry.workflowModes.has(declaredMode)) {
          const detail = mismatchDetail(targetAgent, entry.workflowModes, declaredMode);
          if (environment[REJECT_MODE_ENV] === '1') {
            return { decision: 'reject', detail, warnings, audits };
          }
          warnings.push(detail);
        }
      }
    }

    // -- Check 2: loop-like repeated hand-off to a command-owned loop executor --
    if (LOOP_EXECUTOR_AGENTS.has(targetAgent) && sessionID) {
      const commandDriven = isCommandDrivenIteration(prompt, projectDir || process.cwd());
      const { count, persisted } = recordLoopDispatch(
        stateDir,
        sessionID,
        targetAgent,
        commandDriven,
      );

      if (!persisted) {
        if (environment[REJECT_LOOP_ENV] === '1') audits.push('loop state persistence unavailable');
        return finalize(warnings, audits);
      }

      if (!commandDriven && count >= WARN_AT_COUNT) {
        const detail = loopRepeatDetail(targetAgent, count);
        if (count >= BLOCK_AT_COUNT && environment[REJECT_LOOP_ENV] === '1') {
          return { decision: 'reject', detail, warnings, audits };
        }
        warnings.push(detail);
      }
    }
  } catch (_) {
    // Fail open on any unexpected internal error -- never block unrelated dispatches.
    return { decision: 'allow', detail: null, warnings: [], audits: [] };
  }

  return finalize(warnings, audits);
}

function finalize(warnings, audits) {
  if (warnings.length > 0) {
    return { decision: 'warn', detail: warnings[0], warnings, audits };
  }
  return { decision: 'allow', detail: null, warnings, audits };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  // constants
  REGISTRY_RELATIVE_PATH,
  LOOP_GUARD_STATE_DIR_RELATIVE_PATH,
  WARN_LOG_FILENAME,
  REJECT_MODE_ENV,
  REJECT_LOOP_ENV,
  LOOP_EXECUTOR_AGENTS,
  ITERATION_MARKER_REGEX,
  WARN_AT_COUNT,
  BLOCK_AT_COUNT,
  // parsing + policy helpers
  loadRegistryAgents,
  declaredModeFromPrompt,
  mismatchDetail,
  isCommandDrivenIteration,
  resolveCommandConfigPath,
  resolveTargetIdentity,
  // loop-state helpers
  sessionStateKey,
  loopStatePath,
  readLoopState,
  writeLoopStateAtomic,
  recordLoopDispatch,
  loopRepeatDetail,
  // logging + maintenance
  appendWarningLog,
  appendRejectModeDegradedAudit,
  maintainWarningLog,
  sweepStaleLoopGuardStates,
  // runtime-neutral entrypoints
  resolveGuardPaths,
  evaluateDispatch,
};
