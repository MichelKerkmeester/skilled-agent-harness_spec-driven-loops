// ───────────────────────────────────────────────────────────────────
// MODULE: Hermes Session End Arm
// ───────────────────────────────────────────────────────────────────

import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { readStdin, parseJsonFailOpen } from '../../shared/hook-adapter-shared.cjs';
import { isHookEnabled } from '../../shared/hook-flags.mjs';
import {
  arm,
  appendLog,
  findLoopChildPid,
  liveKillerPid,
  readRelaunchFile,
} from '../lib/relaunch-core.cjs';

const CONCERN = 'session-relaunch';
const KILLER_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)), '..', 'lib', 'killer.cjs',
);

function done(armed = false) {
  process.stdout.write(`${JSON.stringify({ armed })}\n`, () => process.exit(0));
}

function isMain() {
  return process.argv[1]
    && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
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

function armPendingRecord(payload, dependencies = {}) {
  const env = dependencies.env || process.env;
  try {
    if (!isHookEnabled(CONCERN, dependencies.env)) return null;
    const loopId = env.SKILLED_LOOP_ID;
    const sessionId = payload?.session_id;
    if (!loopId || typeof sessionId !== 'string' || !sessionId) return null;
    // The plugin bridge may omit the event name, so only a present, different one refuses.
    if (
      payload.hook_event_name !== undefined
      && payload.hook_event_name !== 'on_session_end'
    ) return null;
    if (env.SKILLED_LOOP_RUNTIME && env.SKILLED_LOOP_RUNTIME !== 'hermes') return null;

    const record = readRelaunchFile(loopId, env);
    if (
      record === null
      || record.sessionId !== sessionId
      || record.runtime !== 'hermes'
    ) return null;
    // Pending arms here; an armed record belongs to a killer, so it respawns
    // only when no live killer owns the lock.
    if (
      record.status !== 'pending'
      && (record.status !== 'armed' || liveKillerPid(loopId, env) !== null)
    ) return null;

    const targetPid = positivePid(dependencies.targetPid)
      ?? findLoopChildPid(loopId, {
        pid: dependencies.pid ?? process.pid,
        processTable: dependencies.processTable,
      });
    if (targetPid === null) {
      logEvent('session-end-arm-error', { stage: 'target-pid', loopId }, env);
      return null;
    }

    const armed = arm({
      loopId,
      cwd: payload.cwd || record.cwd || process.cwd(),
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

if (isMain()) main().catch(() => done());

export { armPendingRecord, findLoopChildPid as findHermesPid };
