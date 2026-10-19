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
  findLoopChildPid,
  liveKillerPid,
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

function isMain() {
  return process.argv[1]
    && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
}

function logEvent(event, fields) {
  try {
    appendLog(event, fields, process.env);
  } catch {}
}

async function spawnKiller(loopId, targetPid, transcriptPath) {
  try {
    const child = spawn(
      process.execPath,
      [KILLER_PATH, '--loop-id', loopId, '--target-pid', targetPid, '--transcript', transcriptPath],
      { detached: true, stdio: 'ignore' },
    );
    if (typeof child?.once !== 'function') {
      child.unref();
      return;
    }
    const started = await new Promise((resolve) => {
      child.once('error', (error) => {
        logEvent('stop-arm-error', { stage: 'spawn', loopId, message: error.message });
        resolve(false);
      });
      child.once('spawn', () => resolve(true));
    });
    if (started) child.unref();
  } catch (error) {
    logEvent('stop-arm-error', { stage: 'spawn', loopId, message: error.message });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  let enabled = false;
  try {
    enabled = isHookEnabled(CONCERN);
  } catch {}
  if (!enabled) return done();

  const payload = parseJsonFailOpen(await readStdin());
  if (payload === null || typeof payload !== 'object') return done();
  if (payload.hook_event_name !== 'Stop') return done();

  const loopId = process.env.SKILLED_LOOP_ID;
  if (!loopId) return done();

  let record;
  try {
    record = readRelaunchFile(loopId, process.env);
  } catch (error) {
    logEvent('stop-arm-error', { stage: 'read', loopId, message: error.message });
    return done();
  }
  if (
    record === null
    || record.loopId !== loopId
    || record.sessionId !== payload.session_id
  ) return done();
  // Pending arms here; an armed record belongs to a killer, so it respawns
  // only when no live killer owns the lock.
  if (
    record.status !== 'pending'
    && (record.status !== 'armed' || liveKillerPid(loopId, process.env) !== null)
  ) return done();

  if (typeof payload.transcript_path !== 'string' || !payload.transcript_path) {
    logEvent('missing-transcript-path', { loopId, sessionId: record.sessionId });
    return done();
  }

  // Resolve before arming so a missing ancestor leaves the record pending.
  const targetPid = findLoopChildPid(loopId);
  if (targetPid === null) {
    logEvent('stop-arm-error', { stage: 'target-pid', loopId });
    return done();
  }

  let armed;
  try {
    armed = arm({ loopId, cwd: payload.cwd || process.cwd(), env: process.env });
  } catch (error) {
    logEvent('stop-arm-error', { stage: 'arm', loopId, message: error.message });
    return done();
  }
  if (armed === null || armed.status !== 'armed') return done();

  await spawnKiller(loopId, String(targetPid), payload.transcript_path);
  return done();
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

if (isMain()) main().catch(done);

export { findLoopChildPid as findCodexPid };
