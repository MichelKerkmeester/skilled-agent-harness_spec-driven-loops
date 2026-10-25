// ───────────────────────────────────────────────────────────────────
// MODULE: Claude Session Stop Arm
// ───────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { readStdin, parseJsonFailOpen } from '../../shared/hook-adapter-shared.cjs';
import { isHookEnabled } from '../../shared/hook-flags.mjs';
import {
  arm,
  appendLog,
  armableRecord,
  dropNestedLoop,
  isEntrypoint,
  markDeferred,
  readRelaunchFile,
  resolveKillerTarget,
} from '../lib/relaunch-core.cjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CONCERN = 'session-relaunch';
const KILLER_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)), '..', 'lib', 'killer.cjs',
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function done() {
  process.exit(0);
}

// Logging is best-effort: a state-dir failure must never break the hook.
function logEvent(event, fields, env) {
  try {
    appendLog(event, fields, env);
  } catch {}
}

// The killer supervises a dying session, so it must outlive this hook process.
async function spawnKiller(loopId, targetPid, transcriptPath, env, spawnProcess) {
  try {
    const child = spawnProcess(
      process.execPath,
      [KILLER_PATH, '--loop-id', loopId, '--target-pid', targetPid, '--transcript', transcriptPath],
      { detached: true, stdio: 'ignore', env },
    );
    if (typeof child?.once !== 'function') {
      child.unref();
      return;
    }
    const started = await new Promise((resolve) => {
      child.once('error', (error) => {
        logEvent('stop-arm-error', { stage: 'spawn', loopId, message: error.message }, env);
        resolve(false);
      });
      child.once('spawn', () => resolve(true));
    });
    if (started) child.unref();
  } catch (error) {
    logEvent('stop-arm-error', { stage: 'spawn', loopId, message: error.message }, env);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Arm this session's relaunch record at Stop and start the killer that ends the session.
 *
 * @param {Object} payload - Parsed Claude Stop payload.
 * @param {Object} [dependencies] - Seams for tests.
 * @param {NodeJS.ProcessEnv} [dependencies.env=process.env] - Runtime environment.
 * @param {number} [dependencies.pid=process.pid] - Pid the loop-child walk climbs from.
 * @param {string} [dependencies.processTable] - `pid ppid` pairs; the live table when omitted.
 * @param {Function} [dependencies.spawn] - Spawns the killer; child_process.spawn when omitted.
 * @returns {Promise<Object|null>} The armed record, or null when nothing was armed.
 */
async function armPendingRecord(payload, dependencies = {}) {
  const env = dependencies.env || process.env;
  // A runtime started from this loop session's shell inherits the loop variables, so it
  // must act as a session outside the loop.
  dropNestedLoop(env);
  const loopId = env.SKILLED_LOOP_ID;
  if (!loopId) return null;

  let record;
  try {
    record = readRelaunchFile(loopId, env);
  } catch (error) {
    logEvent('stop-arm-error', { stage: 'read', loopId, message: error.message }, env);
    return null;
  }
  const sessionId = payload?.session_id;
  if (!armableRecord(record, { loopId, sessionId, runtime: 'claude', env }).armable) return null;

  // The killer watches the transcript for idleness, so a payload without its
  // path can never finish arming: the record stays pending for the next Stop
  // rather than stranding armed with no killer running.
  if (typeof payload.transcript_path !== 'string' || !payload.transcript_path) {
    logEvent('missing-transcript-path', { loopId, sessionId: record.sessionId }, env);
    return null;
  }

  // Live background work would be killed mid-run, so the record stays as it is and
  // the next Stop retries once the tasks have drained. An armed record reaches here
  // only when its killer has died, and a fresh killer would end the same live work.
  if (
    Array.isArray(payload.background_tasks)
    && payload.background_tasks.length > 0
  ) {
    logEvent('deferred-background-tasks', {
      loopId,
      sessionId: record.sessionId,
      tasks: payload.background_tasks.length,
    }, env);
    // The mark lets a prompt the operator sends while the record waits withdraw it.
    try {
      markDeferred({ loopId, env });
    } catch (error) {
      logEvent('stop-arm-error', { stage: 'defer', loopId, message: error.message }, env);
    }
    return null;
  }

  // The hook runs under a `bash -c` shell, so its parent is no stable target. CLAUDE_PID
  // is kept while it names a process below the loop; otherwise the walk finds the loop's
  // direct child. Resolving before arming leaves the record pending when neither exists.
  const targetPid = resolveKillerTarget(loopId, {
    preferredPid: env.CLAUDE_PID,
    pid: dependencies.pid ?? process.pid,
    processTable: dependencies.processTable,
  });
  if (targetPid === null) {
    logEvent('stop-arm-error', { stage: 'target-pid', loopId }, env);
    return null;
  }

  let armed;
  try {
    armed = arm({ loopId, cwd: payload.cwd || process.cwd(), env });
  } catch (error) {
    logEvent('stop-arm-error', { stage: 'arm', loopId, message: error.message }, env);
    return null;
  }
  if (armed === null || armed.status !== 'armed') return null;

  await spawnKiller(
    loopId,
    String(targetPid),
    payload.transcript_path,
    env,
    dependencies.spawn || spawn,
  );
  return armed;
}

async function main() {
  let enabled = false;
  try {
    enabled = isHookEnabled(CONCERN);
  } catch {}
  if (!enabled) return done();

  const payload = parseJsonFailOpen(await readStdin());
  if (payload === null || typeof payload !== 'object') return done();

  await armPendingRecord(payload);
  return done();
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

if (isEntrypoint(import.meta.url)) main().catch(done);

export { armPendingRecord };
