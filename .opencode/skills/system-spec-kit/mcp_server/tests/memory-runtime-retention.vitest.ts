// ───────────────────────────────────────────────────────────────
// TEST: Memory Runtime Retention Stress Fixtures
// ───────────────────────────────────────────────────────────────

import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { acquireLoopLock, releaseLoopLock } from '../lib/deep-loop/loop-lock.js';
import { BoundedMap, TtlMap } from '../lib/memory/bounded-cache.js';
import { listRotatedAuditFiles, rotateIfNeeded } from '../lib/memory/audit-rotation.js';
import { clearAllTimers, getRegisteredTimerCount, registerInterval } from '../lib/runtime/timer-registry.js';
import { clearShutdownHooksForTests, registerShutdownHook, runShutdownHooks } from '../lib/runtime/shutdown-hooks.js';

describe('memory runtime retention stress fixtures', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join('/private/tmp', 'memory-runtime-retention-'));
  });

  afterEach(() => {
    clearAllTimers();
    clearShutdownHooksForTests();
    vi.useRealTimers();
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('bounds simulated save/search/index retained state under concurrent load', async () => {
    const saveRouting = new BoundedMap<string, number>(50);
    const searchSessions = new TtlMap<string, string[]>(25);
    const indexJobs = new BoundedMap<string, { state: string }>(10);

    await Promise.all(Array.from({ length: 250 }, async (_value, index) => {
      saveRouting.set(`save-${index}`, index);
      searchSessions.set(`session-${index}`, [`result-${index}`], 60_000);
      indexJobs.set(`job-${index}`, { state: 'queued' });
    }));

    expect(saveRouting.size).toBe(50);
    expect(searchSessions.size).toBe(25);
    expect(indexJobs.size).toBe(10);
  });

  it('releases leases through shutdown hooks', async () => {
    const lockPath = join(tmpDir, 'scan.lock');
    const acquired = acquireLoopLock(lockPath, {
      ownerPid: process.pid,
      startedAtIso: new Date().toISOString(),
      ttlMs: 1_000,
      lastHeartbeatIso: new Date().toISOString(),
      packetId: 'phase-009-test',
      runtimeKind: 'main',
    });
    expect(acquired.acquired).toBe(true);
    expect(existsSync(lockPath)).toBe(true);

    registerShutdownHook(() => {
      releaseLoopLock(lockPath, process.pid);
    });
    await runShutdownHooks();

    expect(existsSync(lockPath)).toBe(false);
  });

  it('clears all registered timers during shutdown', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    registerInterval(fn, 10);
    registerInterval(fn, 10);

    expect(getRegisteredTimerCount()).toBe(2);
    clearAllTimers();
    vi.advanceTimersByTime(50);

    expect(fn).not.toHaveBeenCalled();
    expect(getRegisteredTimerCount()).toBe(0);
  });

  it('caps audit rotations during repeated search audit writes', () => {
    const auditPath = join(tmpDir, 'search-decisions.jsonl');
    for (let index = 0; index < 5; index += 1) {
      writeFileSync(auditPath, 'x'.repeat(20), 'utf8');
      rotateIfNeeded(auditPath, 10, 2, new Date(2026, 4, 22, 0, 0, index));
    }

    expect(listRotatedAuditFiles(auditPath)).toHaveLength(2);
  });
});
