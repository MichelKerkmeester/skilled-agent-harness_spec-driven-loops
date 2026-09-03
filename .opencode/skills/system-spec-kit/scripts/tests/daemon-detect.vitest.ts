// ───────────────────────────────────────────────────────────────────
// MODULE: Daemon Detect Tests
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';

import { describe, expect, it } from 'vitest';

import * as daemonDetect from '../core/daemon-detect';

// ───────────────────────────────────────────────────────────────────
// 2. TESTS
// ───────────────────────────────────────────────────────────────────

// Determinism: liveness is probed through the real process.kill(pid, 0).
// process.pid is guaranteed LIVE (this test process); a guaranteed-DEAD pid comes
// from spawning an immediately-exiting child and reusing its reaped pid.
const spawnDeadPid = (): number => spawnSync(process.execPath, ['-e', ''], { stdio: 'ignore' }).pid ?? 999_999;

describe('isProcessAlive', () => {
  it('reports a live pid as alive', () => {
    expect(daemonDetect.isProcessAlive(process.pid)).toBe(true);
  });

  it('reports a reaped pid as not alive', () => {
    expect(daemonDetect.isProcessAlive(spawnDeadPid())).toBe(false);
  });

  it('rejects non-positive and non-integer pids without throwing', () => {
    expect(daemonDetect.isProcessAlive(0)).toBe(false);
    expect(daemonDetect.isProcessAlive(-1)).toBe(false);
    expect(daemonDetect.isProcessAlive(Number.NaN)).toBe(false);
  });
});

describe('spec-memory launcher lease detection', () => {
  // The save path owns no daemon probe any more: retrieval is a generated artifact and
  // the save never opens the index, so no launcher lease is read and none may come back.
  it('exposes no launcher-lease surface', () => {
    expect(Object.keys(daemonDetect)).toEqual(['isProcessAlive']);
  });
});
