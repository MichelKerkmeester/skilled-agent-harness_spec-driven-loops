// ───────────────────────────────────────────────────────────────────
// MODULE: Codex Session Stop Arm
// ───────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { readStdin, parseJsonFailOpen } from '../../shared/hook-adapter-shared.cjs';
import { isHookEnabled } from '../../shared/hook-flags.mjs';
import { arm, appendLog, readRelaunchFile } from '../lib/relaunch-core.cjs';

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

function readProcessTable() {
  try {
    const result = spawnSync('ps', ['-A', '-o', 'pid=,ppid='], {
      encoding: 'utf8',
    });
    if (result.error || result.status !== 0) return null;
    return result.stdout;
  } catch {
    return null;
  }
}

/**
 * Resolve the loop's direct child above this adapter.
 * The adapter can run below a transient shell, so process.ppid is not a stable kill target.
 *
 * @param {string} loopId - Owning loop pid carried by SKILLED_LOOP_ID.
 * @param {Object} [options] - Dependency seams for tests.
 * @param {number} [options.pid=process.pid] - Adapter pid to climb from.
 * @param {string} [options.processTable] - `pid ppid` pairs; the live table when omitted.
 * @returns {number|null} The ancestor pid whose parent is the loop, or null when unmatched.
 */
function findCodexPid(loopId, { pid = process.pid, processTable } = {}) {
  const loopPid = Number(loopId);
  if (!Number.isSafeInteger(loopPid) || loopPid < 1) return null;
  const table = typeof processTable === 'string' ? processTable : readProcessTable();
  if (typeof table !== 'string') return null;

  const parents = new Map();
  for (const line of table.split(/\r?\n/)) {
    const match = line.trim().match(/^(\d+)\s+(\d+)$/);
    if (match) parents.set(Number(match[1]), Number(match[2]));
  }

  let current = Number(pid);
  const visited = new Set();
  while (Number.isSafeInteger(current) && current > 0 && !visited.has(current)) {
    visited.add(current);
    const parent = parents.get(current);
    if (parent === loopPid) return current;
    current = parent;
  }
  return null;
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
    || record.status !== 'pending'
    || record.sessionId !== payload.session_id
  ) return done();

  if (typeof payload.transcript_path !== 'string' || !payload.transcript_path) {
    logEvent('missing-transcript-path', { loopId, sessionId: record.sessionId });
    return done();
  }

  // Resolve before arming so a missing ancestor leaves the record pending.
  const targetPid = findCodexPid(loopId);
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

export { findCodexPid };
