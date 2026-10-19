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
import { arm, appendLog, liveKillerPid, readRelaunchFile } from '../lib/relaunch-core.cjs';

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
function logEvent(event, fields) {
  try {
    appendLog(event, fields, process.env);
  } catch {}
}

// The killer supervises a dying session, so it must outlive this hook process.
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

  const loopId = process.env.SKILLED_LOOP_ID;
  if (!loopId) return done();

  let record;
  try {
    record = readRelaunchFile(loopId, process.env);
  } catch (error) {
    logEvent('stop-arm-error', { stage: 'read', loopId, message: error.message });
    return done();
  }
  if (record === null || record.sessionId !== payload.session_id) return done();

  // An already-armed record belongs to a killer, so a repeated Stop spawns a
  // second one only when no live killer owns the lock.
  if (
    record.status === 'armed'
    && liveKillerPid(loopId, process.env) !== null
  ) return done();

  // The killer watches the transcript for idleness, so a payload without its
  // path can never finish arming: the record stays pending for the next Stop
  // rather than stranding armed with no killer running.
  if (typeof payload.transcript_path !== 'string' || !payload.transcript_path) {
    logEvent('missing-transcript-path', { loopId, sessionId: record.sessionId });
    return done();
  }

  // Live background work would be killed mid-run, so the record stays pending
  // and the next Stop retries once the tasks have drained.
  if (
    record.status === 'pending'
    && Array.isArray(payload.background_tasks)
    && payload.background_tasks.length > 0
  ) {
    logEvent('deferred-background-tasks', {
      loopId,
      sessionId: record.sessionId,
      tasks: payload.background_tasks.length,
    });
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

  const targetPid = process.env.CLAUDE_PID || String(process.ppid);
  await spawnKiller(loopId, targetPid, payload.transcript_path);
  return done();
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch(done);
