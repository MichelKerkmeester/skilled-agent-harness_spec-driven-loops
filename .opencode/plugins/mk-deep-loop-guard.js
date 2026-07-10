// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-deep-loop-guard OpenCode Plugin                            ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Detection-layer enforcement for Task-tool dispatches targeting  ║
// ║          deep-loop sub-agents -- flags/blocks a Deep Route header whose  ║
// ║          declared mode disagrees with mode-registry.json's entry for    ║
// ║          the resolved target agent, and flags/blocks repeated/loop-like ║
// ║          non-command-driven dispatches to command-owned loop executors   ║
// ║          within a session while allowing one bounded hand-off.          ║
// ║          Also sweeps/archives/prunes its own per-session state so the   ║
// ║          .loop-guard-state directory does not grow unbounded.          ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import {
  appendFileSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const REGISTRY_RELATIVE_PATH = '.opencode/skills/system-deep-loop/mode-registry.json';
const LOOP_GUARD_STATE_DIR_RELATIVE_PATH = '.opencode/skills/.loop-guard-state';
const LOOP_GUARD_ARCHIVE_DIR_NAME = '.archive';
const WARN_LOG_FILENAME = 'guard-warnings.log';
const WARN_LOG_BACKUP_SUFFIX = '.1';
const WARN_LOG_MAX_BYTES_ENV = 'MK_DEEP_LOOP_GUARD_WARNING_LOG_MAX_BYTES';
const REJECT_MODE_ENV = 'MK_DEEP_LOOP_GUARD_REJECT';
const REJECT_LOOP_ENV = 'MK_DEEP_LOOP_GUARD_REJECT_LOOP';
const SWEEP_LOCK_DIR_NAME = '.sweep.lock';
const LOOP_STATE_TEMP_FILE_REGEX = /^[0-9a-f]+\.json\.\d+\.\d+\.tmp$/;

// Retention/cleanup env vars, mirroring the mk-goal.js sweep/archive/prune
// pattern: an active state file untouched past ACTIVE_RETENTION_DAYS is
// archived, and an archived file untouched past ARCHIVE_RETENTION_DAYS is
// deleted. Defaults match the goal plugin's current tuning.
const LOOP_GUARD_ACTIVE_RETENTION_DAYS_ENV = 'MK_DEEP_LOOP_GUARD_ACTIVE_RETENTION_DAYS';
const LOOP_GUARD_ARCHIVE_RETENTION_DAYS_ENV = 'MK_DEEP_LOOP_GUARD_ARCHIVE_RETENTION_DAYS';
const LOOP_GUARD_SWEEP_INTERVAL_MS_ENV = 'MK_DEEP_LOOP_GUARD_SWEEP_INTERVAL_MS';
const DEFAULT_ACTIVE_RETENTION_DAYS = 2;
const DEFAULT_ARCHIVE_RETENTION_DAYS = 90;
const DEFAULT_SWEEP_INTERVAL_MS = 60 * 60 * 1000;
const DEFAULT_WARN_LOG_MAX_BYTES = 256 * 1024;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Command-owned loop executors: dispatched only by their parent /deep:* command,
// which owns iteration state and convergence. One bounded external hand-off is
// tolerated, while repeated hand-offs re-implement the loop outside its owning
// command. Generic subagents (context/review/write/debug) and
// ai-council (also reachable via /deep:ai-council for multi-turn planning) are
// intentionally excluded from loop-repeat counting.
const LOOP_EXECUTOR_AGENTS = new Set(['deep-research', 'deep-review', 'deep-improvement']);

// The parent commands retain a readable iteration line. Anchoring it and
// checking its bounds prevents incidental prose from gaining command authority.
const ITERATION_MARKER_REGEX = /(?:^|\n)\s*(?:Review\s+)?Iteration:\s*(\d+)\s+of\s+(\d+)\b/i;

const WARN_AT_COUNT = 2;
const BLOCK_AT_COUNT = 3;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS -- registry + mode mismatch
// ─────────────────────────────────────────────────────────────────────────────

function loadRegistryAgents(registryPath) {
  try {
    const raw = readFileSync(registryPath, 'utf8');
    const data = JSON.parse(raw);
    const map = new Map();
    for (const mode of data.modes || []) {
      const agent = typeof mode.agent === 'string' ? mode.agent.toLowerCase() : '';
      const workflowMode = typeof mode.workflowMode === 'string' ? mode.workflowMode.toLowerCase() : '';
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

function declaredModeFromPrompt(promptText) {
  const text = promptText || '';
  const deepRouteMatch = /(?:^|\n)\s*Deep Route:[^\n]*?\bmode=([a-z0-9-]+)/i.exec(text);
  const match = deepRouteMatch || /mode=([a-z0-9-]+)/i.exec(text);
  return match ? match[1].toLowerCase() : null;
}

function mismatchDetail(subagentType, registryModes, declaredMode) {
  const allowedModes = [...registryModes].sort().join('|');
  return [
    'mk-deep-loop-guard: Deep Route mode mismatch --',
    `dispatch targets subagent_type="${subagentType}"`,
    `(registry modes="${allowedModes}")`,
    `but the prompt declares mode="${declaredMode}"`,
  ].join(' ');
}

function isCommandDrivenIteration(promptText) {
  const match = ITERATION_MARKER_REGEX.exec(promptText || '');
  if (!match) return false;

  const iteration = Number(match[1]);
  const maxIterations = Number(match[2]);
  return iteration >= 1 && maxIterations >= 1 && iteration <= maxIterations;
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

function sessionStateKey(sessionID) {
  return Buffer.from(String(sessionID), 'utf8').toString('hex');
}

function loopStatePath(stateDir, sessionID) {
  return join(stateDir, `${sessionStateKey(sessionID)}.json`);
}

function readLoopState(stateDir, sessionID) {
  try {
    const raw = readFileSync(loopStatePath(stateDir, sessionID), 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (_) {
    return {};
  }
}

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
  const state = readLoopState(stateDir, sessionID);
  const dispatches = state.dispatches && typeof state.dispatches === 'object' ? state.dispatches : {};
  const entry = dispatches[targetAgent] && typeof dispatches[targetAgent] === 'object'
    ? dispatches[targetAgent]
    : { count: 0 };

  if (!commandDriven) entry.count = (entry.count || 0) + 1;
  entry.lastCommandDriven = commandDriven;
  entry.lastTimestamp = new Date().toISOString();
  dispatches[targetAgent] = entry;

  const persisted = writeLoopStateAtomic(stateDir, sessionID, {
    sessionId: sessionID,
    dispatches,
  });

  return { count: entry.count, persisted };
}

function loopRepeatDetail(targetAgent, count) {
  return [
    'mk-deep-loop-guard: loop-like repeated dispatch --',
    `"${targetAgent}" received ${count} non-command-driven hand-offs`,
    'in this session without a command-driven iteration marker;',
    'command-owned loop executors should be dispatched by their parent /deep:* command,',
    'not repeatedly handed off by another agent.',
  ].join(' ');
}

// Soft warnings must never reach stdout/stderr: OpenCode's TUI paints plugin
// console output onto the prompt input line during tool.execute.before, where it
// sticks until a redraw. Persisting to a state-dir log keeps the signal auditable
// without corrupting the interactive session. Fail-open -- a logging error must
// never affect or block the dispatch this hook guards.
function appendWarningLog(stateDir, detail) {
  const line = `${new Date().toISOString()} [mk-deep-loop-guard] WARN: ${detail}\n`;
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

function appendRejectModeDegradedAudit(stateDir, reason) {
  const detail = `reject-mode degraded -- ${reason}; dispatch allowed`;
  if (appendWarningLog(stateDir, detail)) return;

  // A sibling fallback remains writable when the configured state path is a file.
  const fallbackPath = `${stateDir}.${WARN_LOG_FILENAME}`;
  const line = `${new Date().toISOString()} [mk-deep-loop-guard] WARN: ${detail}\n`;
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
  const retentionMs = positiveIntFromEnv(LOOP_GUARD_ARCHIVE_RETENTION_DAYS_ENV, DEFAULT_ARCHIVE_RETENTION_DAYS) * MS_PER_DAY;
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
 * per sweep interval via runtimeState, mirroring mk-goal.js's
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
    const intervalMs = positiveIntFromEnv(LOOP_GUARD_SWEEP_INTERVAL_MS_ENV, DEFAULT_SWEEP_INTERVAL_MS);
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

    const activeRetentionMs = positiveIntFromEnv(LOOP_GUARD_ACTIVE_RETENTION_DAYS_ENV, DEFAULT_ACTIVE_RETENTION_DAYS) * MS_PER_DAY;
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
// 6. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the mk-deep-loop-guard OpenCode plugin hooks.
 *
 * Hard limits (by design, not oversight):
 * - Cannot create hard runtime identity; that remains host/FIX-5 territory.
 * - Does not catch a schema-valid, route-matched artifact that internally
 *   does semantically wrong-mode work.
 * - Loop-repeat detection is session-scoped and per-target-agent; it cannot
 *   detect a cross-executor meta-loop (e.g. deep-research, deep-review,
 *   deep-research again) -- only repeated hand-offs to the SAME executor.
 * - Fails open on its own errors (missing/unreadable registry or state,
 *   unexpected arg shapes) so a bug here never blocks unrelated, correctly-
 *   routed work. Reject enforcement is best-effort and emits an audit line when
 *   a required dependency is unavailable.
 *
 * @param {{ directory?: string } | undefined} ctx - OpenCode plugin context.
 * @returns {Promise<object>} Hooks object for the OpenCode plugin loader.
 */
export default async function MkDeepLoopGuardPlugin(ctx) {
  const projectDir = ctx?.directory || process.cwd();
  const registryPath = join(projectDir, REGISTRY_RELATIVE_PATH);
  const loopStateDir = join(projectDir, LOOP_GUARD_STATE_DIR_RELATIVE_PATH);
  const runtimeState = { lastLoopGuardSweepAtMs: 0 };

  return {
    async event(input = {}) {
      try {
        const type = input?.event?.type || input?.type;
        if (type === 'session.created') sweepStaleLoopGuardStates(loopStateDir, runtimeState);
      } catch (_) {
        // Fail open: a sweep error must never affect session startup.
      }
    },
    async 'tool.execute.before'(input, output) {
      try {
        if (!input || input.tool !== 'task') return;
        const args = output && output.args;
        if (!args || typeof args !== 'object') return;

        const rawSubagentType = args.subagent_type || args.subagentType;
        const targetAgent = resolveTargetIdentity(rawSubagentType, args.prompt);
        if (!targetAgent) return;

        // -- Check 1: Deep Route mode mismatch (existing behavior, identity-fixed) --
        const registry = loadRegistryAgents(registryPath);
        if (!registry) {
          if (process.env[REJECT_MODE_ENV] === '1') {
            appendRejectModeDegradedAudit(loopStateDir, 'mode registry unavailable');
          }
        } else {
          const entry = registry.get(targetAgent);
          if (entry) {
            const declaredMode = declaredModeFromPrompt(args.prompt);
            if (declaredMode && !entry.workflowModes.has(declaredMode)) {
              const detail = mismatchDetail(targetAgent, entry.workflowModes, declaredMode);
              if (process.env[REJECT_MODE_ENV] === '1') throw new Error(detail);
              appendWarningLog(loopStateDir, detail);
            }
          }
        }

        // -- Check 2: loop-like repeated hand-off to a command-owned loop executor --
        if (LOOP_EXECUTOR_AGENTS.has(targetAgent) && input.sessionID) {
          const commandDriven = isCommandDrivenIteration(args.prompt);
          const { count, persisted } = recordLoopDispatch(
            loopStateDir,
            input.sessionID,
            targetAgent,
            commandDriven,
          );

          if (!persisted) {
            if (process.env[REJECT_LOOP_ENV] === '1') {
              appendRejectModeDegradedAudit(loopStateDir, 'loop state persistence unavailable');
            }
            return;
          }

          if (!commandDriven && count >= WARN_AT_COUNT) {
            const detail = loopRepeatDetail(targetAgent, count);
            if (count >= BLOCK_AT_COUNT && process.env[REJECT_LOOP_ENV] === '1') {
              throw new Error(detail);
            }
            appendWarningLog(loopStateDir, detail);
          }
        }
      } catch (err) {
        if (err instanceof Error && err.message.startsWith('mk-deep-loop-guard:')) throw err;
        // Fail open on any unexpected internal error -- never block unrelated dispatches.
      }
    },
  };
}
