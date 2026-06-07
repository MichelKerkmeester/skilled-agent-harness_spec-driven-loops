// ───────────────────────────────────────────────────────────────────
// MODULE: Daemon Detect Tests
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { isSpecMemoryDaemonAlive, resolveSpecMemoryDaemonLeasePath } from '../core/daemon-detect';

// ───────────────────────────────────────────────────────────────────
// 2. TESTS
// ───────────────────────────────────────────────────────────────────

describe('isSpecMemoryDaemonAlive', () => {
  let tempDir: string;
  let leasePath: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-daemon-detect-'));
    leasePath = path.join(tempDir, '.mk-spec-memory-launcher.json');
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('returns alive=true for a lease with a live pid', () => {
    fs.writeFileSync(leasePath, JSON.stringify({
      pid: process.pid,
      ownerPid: process.pid,
      startedAt: '2026-05-29T00:00:00.000Z',
    }));

    expect(isSpecMemoryDaemonAlive(leasePath)).toEqual({
      alive: true,
      pid: process.pid,
    });
  });

  it('returns alive=false for a lease with a dead pid', () => {
    const exited = spawnSync(process.execPath, ['-e', ''], { stdio: 'ignore' });
    const deadPid = exited.pid ?? 999_999;
    fs.writeFileSync(leasePath, JSON.stringify({
      pid: deadPid,
      ownerPid: deadPid,
      startedAt: '2026-05-29T00:00:00.000Z',
    }));

    expect(isSpecMemoryDaemonAlive(leasePath)).toEqual({ alive: false });
  });

  it('returns alive=false for a missing lease', () => {
    expect(isSpecMemoryDaemonAlive(leasePath)).toEqual({ alive: false });
  });

  // Regression guard: the default lease path MUST resolve to the launcher's real
  // location <system-spec-kit>/mcp_server/database/, NOT scripts/mcp_server/. A fixed up-count from
  // dist/core previously landed at the nonexistent scripts/mcp_server/database -> the guard was dead code.
  it('resolves the default lease path to the launcher-canonical system-spec-kit/mcp_server/database dir', () => {
    const resolved = resolveSpecMemoryDaemonLeasePath();
    expect(resolved.endsWith(path.join('system-spec-kit', 'mcp_server', 'database', '.mk-spec-memory-launcher.json'))).toBe(true);
    expect(resolved.includes(path.join('scripts', 'mcp_server'))).toBe(false);
  });

  // ─────────────────────────────────────────────────────────────────
  // A stale-LOOKING launcher lease whose recorded childPid (the
  // real SQLite writer the launcher spawned) is still LIVE must NOT be
  // reclaimed. If it were reported not-alive, the standalone-save
  // Step-11.5 path would open a SECOND writer on context-index.sqlite
  // (corruption risk).
  //
  // Determinism: liveness is probed via the real process.kill(pid, 0).
  // process.pid is guaranteed LIVE (this test process). A guaranteed-DEAD
  // pid is obtained the same way the suite already does it — spawnSync an
  // immediately-exiting child and reuse its (now-reaped) pid. No timers,
  // no sleeps; only the tmp lease file + these pids.
  // ─────────────────────────────────────────────────────────────────

  // Reuse the established idiom for a guaranteed-dead pid.
  const spawnDeadPid = (): number => spawnSync(process.execPath, ['-e', ''], { stdio: 'ignore' }).pid ?? 999_999;

  it('DR-016: does NOT reclaim when launcher pid is dead but childPid is LIVE', () => {
    // Launcher (pid) looks stale, but the daemon it spawned (childPid) is still up.
    fs.writeFileSync(leasePath, JSON.stringify({ pid: spawnDeadPid(), childPid: process.pid }));
    // RED without the fix: readLeasePid ignored childPid, so a dead launcher pid collapsed
    // to { alive: false } and Step-11.5 would proceed as a 2nd writer. The reported pid pins
    // to the live writer (childPid) since the launcher is dead.
    expect(isSpecMemoryDaemonAlive(leasePath)).toEqual({ alive: true, pid: process.pid });
  });

  it('DR-016: still reports alive when both launcher pid and childPid are LIVE (pid wins)', () => {
    fs.writeFileSync(leasePath, JSON.stringify({ pid: process.pid, childPid: process.pid }));
    expect(isSpecMemoryDaemonAlive(leasePath)).toEqual({ alive: true, pid: process.pid });
  });

  it('DR-016: IS reclaimable when launcher pid AND childPid are both dead', () => {
    // Genuinely stale: neither the launcher nor its child is alive → reclaim is correct.
    fs.writeFileSync(leasePath, JSON.stringify({ pid: spawnDeadPid(), childPid: spawnDeadPid() }));
    expect(isSpecMemoryDaemonAlive(leasePath)).toEqual({ alive: false });
  });

  it('DR-016: honors a LIVE childPid even when the launcher pid field is absent', () => {
    fs.writeFileSync(leasePath, JSON.stringify({ childPid: process.pid }));
    expect(isSpecMemoryDaemonAlive(leasePath)).toEqual({ alive: true, pid: process.pid });
  });

  it('DR-016: ignores a non-positive / malformed childPid (stays reclaimable, no crash)', () => {
    fs.writeFileSync(leasePath, JSON.stringify({ pid: spawnDeadPid(), childPid: 'not-a-pid' }));
    expect(isSpecMemoryDaemonAlive(leasePath)).toEqual({ alive: false });
  });
});
