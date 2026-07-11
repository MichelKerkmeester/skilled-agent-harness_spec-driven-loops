#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Runtime — Loop-Lock CLI Adapter                               ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Thin CLI front door over lib/deep-loop/loop-lock.ts so non-TS callers    ║
// ║ (command YAML, shells, other runtimes) share one locking contract        ║
// ║ instead of drifting per mode. Every subcommand is a direct pass-through  ║
// ║ to the library; the adapter adds only argv parsing and JSON framing.     ║
// ║                                                                          ║
// ║ Subcommands:                                                             ║
// ║   acquire --lock-path P --packet-id X [--ttl-ms N] [--runtime-kind K]    ║
// ║           [--owner-pid PID]                                              ║
// ║   status  --lock-path P                                                  ║
// ║   refresh --lock-path P --owner-pid PID [--nonce N]                      ║
// ║   release --lock-path P --owner-pid PID [--nonce N]                      ║
// ║ Output: one JSON object on stdout.                                       ║
// ║ Exit:   0=ok, 1=script error, 3=input validation error.                 ║
// ║                                                                          ║
// ║ deep_research / deep_review / deep_ai-council YAMLs call THIS adapter.    ║
// ║ The retired standalone context loop used to keep a separate host wrapper; ║
// ║ no active workflow should dispatch that wrapper or recreate that surface. ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TSX_LOADER = require.resolve('tsx');

// ─────────────────────────────────────────────────────────────────────────────
// 3. TSX BOOTSTRAP
// ─────────────────────────────────────────────────────────────────────────────

// loop-lock.ts is a TypeScript ESM module; re-exec under the tsx loader once so
// the dynamic import below resolves it. Mirrors convergence.cjs.
if (process.env.DEEP_LOOP_TSX_LOADED !== '1') {
  const child = spawnSync(
    process.execPath,
    ['--import', TSX_LOADER, __filename, ...process.argv.slice(2)],
    {
      cwd: process.cwd(),
      env: { ...process.env, DEEP_LOOP_TSX_LOADED: '1' },
      encoding: 'utf8',
    },
  );
  if (child.stdout) process.stdout.write(child.stdout);
  if (child.stderr) process.stderr.write(child.stderr);
  process.exit(child.status === null ? 1 : child.status);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function inputError(message) {
  const err = new Error(message);
  err.code = 'INPUT_VALIDATION';
  return err;
}

function parseFlags(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      throw inputError(`Unexpected positional argument: ${token}`);
    }
    const key = token.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      flags[key] = true;
    } else {
      flags[key] = next;
      i += 1;
    }
  }
  return flags;
}

function requireString(flags, key) {
  const value = flags[key];
  if (typeof value !== 'string' || !value) {
    throw inputError(`--${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)} is required`);
  }
  return value;
}

function resolveOwnerPid(flags) {
  if (flags.ownerPid === undefined) {
    return process.pid;
  }
  const pid = Number(flags.ownerPid);
  if (!Number.isInteger(pid) || pid <= 0) {
    throw inputError('--owner-pid must be a positive integer');
  }
  return pid;
}

// Nonce is optional on the CLI: nonce-less legacy locks still refresh/release
// on pid match alone, so callers that never captured a nonce keep working.
function resolveOptionalNonce(flags) {
  if (flags.nonce === undefined) {
    return undefined;
  }
  if (typeof flags.nonce !== 'string' || !flags.nonce) {
    throw inputError('--nonce must be a non-empty string when provided');
  }
  return flags.nonce;
}

function jsonOut(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

// Map the snake_case on-disk lock record to the camelCase LoopLockData shape so
// status can run it through the same staleness check the library uses.
function readDiskLock(lockPath) {
  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  } catch {
    return null;
  }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }
  return {
    ownerPid: raw.owner_pid,
    startedAtIso: raw.started_at_iso,
    ttlMs: raw.ttl_ms,
    lastHeartbeatIso: raw.last_heartbeat_iso,
    packetId: raw.packet_id,
    runtimeKind: raw.runtime_kind,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const argv = process.argv.slice(2);
  const subcommand = argv[0];
  if (!subcommand || subcommand.startsWith('--')) {
    throw inputError('A subcommand is required: acquire | status | refresh | release');
  }
  const flags = parseFlags(argv.slice(1));

  const lib = await import('../lib/deep-loop/loop-lock.ts');

  if (subcommand === 'acquire') {
    const lockPath = requireString(flags, 'lockPath');
    const packetId = requireString(flags, 'packetId');
    const ttlMs = flags.ttlMs === undefined ? 300000 : Number(flags.ttlMs);
    if (!Number.isFinite(ttlMs) || ttlMs < 0) {
      throw inputError('--ttl-ms must be a non-negative number');
    }
    const runtimeKind = typeof flags.runtimeKind === 'string' && flags.runtimeKind
      ? flags.runtimeKind
      : 'main';
    const ownerPid = resolveOwnerPid(flags);
    const now = new Date().toISOString();
    const result = lib.acquireLoopLock(lockPath, {
      ownerPid,
      startedAtIso: now,
      ttlMs,
      lastHeartbeatIso: now,
      packetId,
      runtimeKind,
    });
    jsonOut({ command: 'acquire', ...result });
    return;
  }

  if (subcommand === 'status') {
    const lockPath = requireString(flags, 'lockPath');
    const holder = fs.existsSync(lockPath) ? readDiskLock(lockPath) : null;
    if (!holder) {
      jsonOut({ command: 'status', exists: false, stale: false, alive: false, holder: null });
      return;
    }
    const stale = lib.isStaleLoopLock(holder);
    const alive = lib.processAlive(holder.ownerPid);
    jsonOut({ command: 'status', exists: true, held: !stale, stale, alive, holder });
    return;
  }

  if (subcommand === 'refresh') {
    const lockPath = requireString(flags, 'lockPath');
    const ownerPid = resolveOwnerPid(flags);
    const acquireNonce = resolveOptionalNonce(flags);
    const refreshed = lib.refreshLoopLock(lockPath, ownerPid, new Date(), { acquireNonce });
    jsonOut({ command: 'refresh', refreshed });
    return;
  }

  if (subcommand === 'release') {
    const lockPath = requireString(flags, 'lockPath');
    const ownerPid = resolveOwnerPid(flags);
    const acquireNonce = resolveOptionalNonce(flags);
    const released = lib.releaseLoopLock(lockPath, ownerPid, acquireNonce);
    jsonOut({ command: 'release', released });
    return;
  }

  throw inputError(`Unknown subcommand "${subcommand}": expected acquire | status | refresh | release`);
}

main().catch((err) => {
  const code = err && err.code === 'INPUT_VALIDATION' ? 3 : 1;
  jsonOut({
    status: 'error',
    error: err instanceof Error ? err.message : String(err),
    code: err && err.code ? err.code : 'SCRIPT_ERROR',
  });
  process.exit(code);
});
