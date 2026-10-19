// ───────────────────────────────────────────────────────────────────
// MODULE: Codex Session Stop Arm
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
  findLoopChildPid,
  isEntrypoint,
  payloadEventName,
  readRelaunchFile,
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

function logEvent(event, fields, env) {
  try {
    appendLog(event, fields, env);
  } catch {}
}

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
 * @param {Object} payload - Parsed Codex Stop payload.
 * @param {Object} [dependencies] - Seams for tests.
 * @param {NodeJS.ProcessEnv} [dependencies.env=process.env] - Runtime environment.
 * @param {number} [dependencies.pid=process.pid] - Pid the loop-child walk climbs from.
 * @param {string} [dependencies.processTable] - `pid ppid` pairs; the live table when omitted.
 * @param {Function} [dependencies.spawn] - Spawns the killer; child_process.spawn when omitted.
 * @returns {Promise<Object|null>} The armed record, or null when nothing was armed.
 */
async function armPendingRecord(payload, dependencies = {}) {
  const env = dependencies.env || process.env;
  if (payloadEventName(payload, { runtime: 'codex', expected: 'Stop' }) === null) return null;

  const loopId = env.SKILLED_LOOP_ID;
  if (!loopId) return null;

  let record;
  try {
    record = readRelaunchFile(loopId, env);
  } catch (error) {
    logEvent('stop-arm-error', { stage: 'read', loopId, message: error.message }, env);
    return null;
  }
  const sessionId = payload.session_id;
  if (!armableRecord(record, { loopId, sessionId, runtime: 'codex', env }).armable) return null;

  if (typeof payload.transcript_path !== 'string' || !payload.transcript_path) {
    logEvent('missing-transcript-path', { loopId, sessionId: record.sessionId }, env);
    return null;
  }

  // Resolve before arming so a missing ancestor leaves the record pending.
  const targetPid = findLoopChildPid(loopId, {
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
