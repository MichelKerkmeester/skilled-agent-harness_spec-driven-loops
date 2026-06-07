#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep Context Loop Lock                                                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// Thin host-facing wrapper over the deep-loop-runtime loop-lock helper so the
// host-driven context loop gets single-writer, cross-session advisory locking
// (stale-lock reclaim + clean release) from the same source of truth the mature
// loops use, instead of a prose-only lock step.

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const path = require('node:path');

// In-process tsx CJS register so this dual-use script can import the runtime's
// TypeScript loop-lock helper without re-execing (safe to require() as a module).
const TSX_CJS_REGISTER = path.join(__dirname, '..', '..', 'system-spec-kit', 'scripts', 'node_modules', 'tsx', 'dist', 'cjs', 'index.cjs');
const RUNTIME_LOOP_LOCK = path.join(__dirname, '..', '..', 'deep-loop-runtime', 'lib', 'deep-loop', 'loop-lock.ts');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function loadLoopLock() {
  require(TSX_CJS_REGISTER);
  return require(RUNTIME_LOOP_LOCK);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function emit(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CLI ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const [action, ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);
  const lockPath = typeof args.lock === 'string' ? args.lock : null;

  if (!lockPath) {
    process.stderr.write('Usage: loop-lock.cjs <acquire|refresh|release> --lock <path> [--packet <id>] [--owner <int>] [--ttl <ms>] [--runtime <kind>]\n');
    process.exit(3);
  }

  // A host-driven loop has no single long-lived process, so the owner id is
  // host-provided and stable across the acquire/release pair (defaults to this
  // process pid for standalone use). Acquire and release MUST share the owner.
  const owner = Number.isFinite(Number(args.owner)) ? Number(args.owner) : process.pid;

  let lib;
  try {
    lib = loadLoopLock();
  } catch (error) {
    process.stderr.write(`[deep-context] loop-lock helper unavailable: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  }

  try {
    if (action === 'acquire') {
      const now = new Date().toISOString();
      const data = {
        ownerPid: owner,
        startedAtIso: now,
        ttlMs: Number.isFinite(Number(args.ttl)) ? Number(args.ttl) : 3600000,
        lastHeartbeatIso: now,
        packetId: typeof args.packet === 'string' ? args.packet : '',
        runtimeKind: typeof args.runtime === 'string' ? args.runtime : 'main',
      };
      const result = lib.acquireLoopLock(lockPath, data);
      emit({ action, ...result });
      process.exit(result.acquired ? 0 : 1);
    } else if (action === 'refresh') {
      emit({ action, refreshed: lib.refreshLoopLock(lockPath, owner) });
      process.exit(0);
    } else if (action === 'release') {
      emit({ action, released: lib.releaseLoopLock(lockPath, owner) });
      process.exit(0);
    } else {
      process.stderr.write(`Unknown action: ${String(action)} (expected acquire|refresh|release)\n`);
      process.exit(3);
    }
  } catch (error) {
    process.stderr.write(`[deep-context] loop-lock ${String(action)} failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { parseArgs, loadLoopLock, main };
