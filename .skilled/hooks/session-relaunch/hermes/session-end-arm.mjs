// ───────────────────────────────────────────────────────────────────
// MODULE: Hermes Session End Arm
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

function done(armed = false) {
  process.stdout.write(`${JSON.stringify({ armed })}\n`, () => process.exit(0));
}

function logEvent(event, fields, env) {
  try {
    appendLog(event, fields, env);
  } catch {}
}

function positivePid(value) {
  const pid = Number(value);
  return Number.isSafeInteger(pid) && pid > 0 ? pid : null;
}

function logSpawnError(loopId, env, error) {
  logEvent('session-end-arm-error', {
    stage: 'spawn',
    loopId,
    message: error?.message || 'killer spawn failed',
  }, env);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Arm this session's relaunch record at session end and detach the killer that ends it.
 *
 * @param {Object} payload - Parsed Hermes session-end payload.
 * @param {Object} [dependencies] - Seams for tests.
 * @param {NodeJS.ProcessEnv} [dependencies.env=process.env] - Runtime environment.
 * @param {number} [dependencies.targetPid] - Target pid; the loop-child walk when omitted.
 * @param {number} [dependencies.pid=process.pid] - Pid the loop-child walk climbs from.
 * @param {string} [dependencies.processTable] - `pid ppid` pairs; the live table when omitted.
 * @param {Function} [dependencies.spawn] - Spawns the killer; child_process.spawn when omitted.
 * @returns {Object|null} The armed record, or null when nothing was armed.
 */
function armPendingRecord(payload, dependencies = {}) {
  const env = dependencies.env || process.env;
  try {
    if (!isHookEnabled(CONCERN, dependencies.env)) return null;
    const loopId = env.SKILLED_LOOP_ID;
    const sessionId = payload?.session_id;
    if (!loopId || typeof sessionId !== 'string' || !sessionId) return null;
    if (payloadEventName(payload, { runtime: 'hermes', expected: 'on_session_end' }) === null) {
      return null;
    }
    if (env.SKILLED_LOOP_RUNTIME && env.SKILLED_LOOP_RUNTIME !== 'hermes') return null;

    const record = readRelaunchFile(loopId, env);
    if (!armableRecord(record, { loopId, sessionId, runtime: 'hermes', env }).armable) return null;

    const targetPid = positivePid(dependencies.targetPid)
      ?? findLoopChildPid(loopId, {
        pid: dependencies.pid ?? process.pid,
        processTable: dependencies.processTable,
      });
    if (targetPid === null) {
      logEvent('session-end-arm-error', { stage: 'target-pid', loopId }, env);
      return null;
    }

    // The plugin hands in the model and provider this session last asked for, so the
    // relaunched session starts on them.
    const settings = {};
    for (const key of ['model', 'provider']) {
      if (typeof payload[key] === 'string' && payload[key] !== '') settings[key] = payload[key];
    }
    const armed = arm({
      loopId,
      cwd: payload.cwd || record.cwd || process.cwd(),
      settings,
      env,
    });
    if (armed?.status !== 'armed') return null;

    try {
      const child = (dependencies.spawn || spawn)(
        process.execPath,
        [
          KILLER_PATH,
          '--loop-id',
          loopId,
          '--target-pid',
          String(targetPid),
        ],
        { detached: true, stdio: 'ignore', env },
      );
      if (typeof child?.once === 'function') {
        child.once('error', (error) => logSpawnError(loopId, env, error));
      }
      if (typeof child?.unref === 'function') child.unref();
    } catch (error) {
      logSpawnError(loopId, env, error);
    }

    return armed;
  } catch (error) {
    logEvent('session-end-arm-error', {
      stage: 'arm',
      message: error.message,
    }, env);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  let enabled = false;
  try {
    enabled = isHookEnabled(CONCERN);
  } catch {}
  if (!enabled) return done();

  const payload = parseJsonFailOpen(await readStdin());
  if (!payload || typeof payload !== 'object') return done();
  return done(armPendingRecord(payload) !== null);
}

if (isEntrypoint(import.meta.url)) main().catch(() => done());

export { armPendingRecord };
