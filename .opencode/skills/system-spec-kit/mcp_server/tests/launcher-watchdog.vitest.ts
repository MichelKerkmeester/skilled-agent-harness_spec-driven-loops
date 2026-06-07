import { createRequire } from 'node:module';

import { afterEach, describe, expect, it, vi } from 'vitest';

type ProcessRowsRunner = () => string | Array<Record<string, number>>;
type SignalFn = (pid: number, sig: number | string) => boolean;

const require = createRequire(import.meta.url);
const launcher = require('../../../../bin/mk-spec-memory-launcher.cjs') as {
  bridgeStdioThroughSessionProxy: (socketPath: string, options?: Record<string, unknown>) => Promise<unknown>;
  buildLeaseObject: (childPid?: number | null, startedAt?: string) => Record<string, unknown>;
  createCrashLoopGuard: (options?: Record<string, unknown>) => { recordDeath: () => Record<string, unknown> };
  getWatchdogConfig: (env?: Record<string, string | undefined>, warn?: (message: string) => void) => Record<string, unknown>;
  normalizeWatchdogGraceMs: (rawGraceMs: unknown, warn?: (message: string) => void) => number;
  reapProcessTreeGroups: (
    childPid: number,
    options?: { runner?: ProcessRowsRunner; signal?: SignalFn; snapshotPids?: number[] },
  ) => void;
  isRespawnLockStale: (raw: string, options?: { liveness?: (pid: number) => string; nowMs?: number; staleMs?: number }) => boolean;
  refreshDescendantSnapshot: (childPid: number, runner?: ProcessRowsRunner) => number[];
  sampleProcessTreeRssMb: (childPid: number, runner?: ProcessRowsRunner) => number | null;
  shouldAbortRelaunchOnFire: (args: { shuttingDown: boolean; currentPpid: number; initialPpid: number }) => boolean;
  shouldSkipLaunch: (child: { exitCode: number | null; signalCode: string | null } | null) => boolean;
  signalProcess: (pid: number, sig: number | string) => boolean;
  superviseChildExit: (
    event: Record<string, unknown>,
    actions: Record<string, unknown>,
  ) => Record<string, unknown>;
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('launcher watchdog helpers', () => {
  it('rolls up daemon child and grandchild RSS from an injectable process table', () => {
    const rssMb = launcher.sampleProcessTreeRssMb(100, () => `
      1 0 100
      100 1 1024
      101 100 2048
      102 101 3072
      200 1 8192
    `);

    expect(rssMb).toBe(6);
  });

  it('bridges a secondary launcher through its own reconnecting session proxy', async () => {
    let captured: Record<string, unknown> | undefined;
    const start = vi.fn(() => Promise.resolve('started'));
    const createProxy = vi.fn((opts: Record<string, unknown>) => {
      captured = opts;
      return { start, stop: () => undefined };
    });
    const stdin = {};
    const stdout = {};

    const result = await launcher.bridgeStdioThroughSessionProxy('tcp://127.0.0.1:65500', {
      createProxy,
      stdin,
      stdout,
      onError: () => { throw new Error('onError must not be used by the proxy bridge'); },
    });

    expect(createProxy).toHaveBeenCalledTimes(1);
    expect(captured?.socketPath).toBe('tcp://127.0.0.1:65500');
    expect(captured?.stdin).toBe(stdin);
    expect(captured?.stdout).toBe(stdout);
    expect(typeof captured?.log).toBe('function');
    expect(start).toHaveBeenCalledTimes(1);
    expect(result).toBe('started');
  });

  it('treats EPERM sampling failures as unknown instead of a recycle signal', () => {
    const error = Object.assign(new Error('operation not permitted'), { code: 'EPERM' });

    expect(launcher.sampleProcessTreeRssMb(100, () => { throw error; })).toBeNull();
  });

  it('backs off and relaunches after a single unexpected child death', () => {
    const calls: string[] = [];
    const result = launcher.superviseChildExit(
      { code: 1, signal: null, childPid: 123, intentional: false },
      {
        crashLoopGuard: launcher.createCrashLoopGuard({ maxDeaths: 2, windowMs: 1000, initialBackoffMs: 25, maxBackoffMs: 100 }),
        clearLease: () => calls.push('clearLease'),
        reapProcessGroup: () => calls.push('reapProcessGroup'),
        mirrorSignal: () => calls.push('mirrorSignal'),
        exit: () => calls.push('exit'),
        scheduleRelaunch: (backoffMs: number) => calls.push(`relaunch:${backoffMs}`),
      },
    );

    expect(result).toMatchObject({ action: 'relaunch', deathsInWindow: 1, backoffMs: 25 });
    expect(calls).toEqual(['relaunch:25']);
  });

  it('fails loud and group-reaps only after the crash-loop threshold is reached', () => {
    const calls: string[] = [];
    const guard = launcher.createCrashLoopGuard({ maxDeaths: 2, windowMs: 1000, initialBackoffMs: 25, maxBackoffMs: 100 });
    const actions = {
      crashLoopGuard: guard,
      clearLease: () => calls.push('clearLease'),
      reapProcessGroup: (pid: number) => calls.push(`reap:${pid}`),
      mirrorSignal: () => calls.push('mirrorSignal'),
      exit: (code: number) => calls.push(`exit:${code}`),
      scheduleRelaunch: (backoffMs: number) => calls.push(`relaunch:${backoffMs}`),
    };

    launcher.superviseChildExit({ code: 1, signal: null, childPid: 321, intentional: false }, actions);
    const result = launcher.superviseChildExit({ code: 1, signal: null, childPid: 321, intentional: false }, actions);

    expect(result).toMatchObject({ action: 'give-up', deathsInWindow: 2 });
    expect(calls).toEqual(['relaunch:25', 'clearLease', 'reap:321', 'exit:1']);
  });

  it('clamps configured RSS self-exit grace to exceed the daemon shutdown deadline', () => {
    const warnings: string[] = [];
    const graceMs = launcher.normalizeWatchdogGraceMs('5000', (message) => warnings.push(message));
    const config = launcher.getWatchdogConfig(
      {
        SPECKIT_CONTEXT_SERVER_MAX_RSS_MB: '1024',
        SPECKIT_LAUNCHER_RSS_SELF_EXIT: '1',
        SPECKIT_LAUNCHER_RSS_GRACE_MS: '5000',
      },
      (message) => warnings.push(message),
    );

    expect(graceMs).toBeGreaterThan(5000);
    expect(config).toMatchObject({ enabled: true, graceMs });
    expect(warnings.length).toBeGreaterThanOrEqual(1);
  });

  it('keeps RSS breach self-exit default-off until explicit opt-in is set', () => {
    expect(launcher.getWatchdogConfig({ SPECKIT_CONTEXT_SERVER_MAX_RSS_MB: '1024' })).toMatchObject({
      enabled: false,
      maxRssMb: 1024,
    });
  });

  // The give-up reap must still kill an orphaned sidecar after a HARD daemon death, when the
  // detached sidecar has re-parented to pid 1 and the dead childPid is gone from `ps`. This is the case
  // a fresh-walk-anchored-on-childPid reap silently no-ops on; the before-death snapshot closes it.
  it('reaps a re-parented orphan sidecar from the before-death snapshot when the dead child is gone from ps (REQ-007)', () => {
    vi.useFakeTimers();
    try {
      const signals: Array<[number, number | string]> = [];
      const alive = new Set([101]);
      launcher.reapProcessTreeGroups(100, {
        // childPid 100 is DEAD (absent); sidecar 101 re-parented to pid 1; 200 is unrelated.
        runner: () => `
          1 0 100
          101 1 2048
          200 1 8192
        `,
        signal: (pid, sig) => {
          if (sig === 0) return alive.has(pid);
          signals.push([pid, sig]);
          return true;
        },
        snapshotPids: [101],
      });
      expect(signals).toEqual([[-101, 'SIGTERM'], [101, 'SIGTERM']]);
      vi.advanceTimersByTime(1000);
      expect(signals).toEqual([[-101, 'SIGTERM'], [101, 'SIGTERM'], [-101, 'SIGKILL'], [101, 'SIGKILL']]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('reaps the live childPid subtree when the child is still present (REQ-007 fast path)', () => {
    const signals: Array<[number, number | string]> = [];
    launcher.reapProcessTreeGroups(100, {
      runner: () => `
        1 0 100
        100 1 1024
        101 100 2048
      `,
      signal: (pid, sig) => {
        if (sig === 0) return true;
        signals.push([pid, sig]);
        return true;
      },
      snapshotPids: [],
    });
    expect(signals).toEqual([[-101, 'SIGTERM'], [101, 'SIGTERM']]);
  });

  it('skips snapshot pids that are no longer alive (pid-reuse / dead-pid guard, REQ-007)', () => {
    const signals: Array<[number, number | string]> = [];
    launcher.reapProcessTreeGroups(100, {
      runner: () => '1 0 100',
      signal: (pid, sig) => {
        if (sig === 0) return false; // nothing alive
        signals.push([pid, sig]);
        return true;
      },
      snapshotPids: [999],
    });
    expect(signals).toEqual([]);
  });

  it('refreshDescendantSnapshot captures descendants and keeps the prior snapshot on an unknown read (REQ-002/006)', () => {
    const captured = launcher.refreshDescendantSnapshot(100, () => `
      1 0 100
      100 1 1024
      101 100 2048
      102 101 3072
    `);
    expect(captured).toHaveLength(2);
    expect(captured).toEqual(expect.arrayContaining([101, 102]));

    const eperm = Object.assign(new Error('operation not permitted'), { code: 'EPERM' });
    const kept = launcher.refreshDescendantSnapshot(100, () => {
      throw eperm;
    });
    expect(kept).toEqual(captured); // unknown read must NOT erase the only handle on an orphan-able sidecar
  });

  it('buildLeaseObject includes childPid only for a real child pid (REQ-005 additive lease field)', () => {
    const withChild = launcher.buildLeaseObject(4242, '2026-05-28T00:00:00.000Z');
    expect(withChild).toMatchObject({ startedAt: '2026-05-28T00:00:00.000Z', childPid: 4242 });
    expect(typeof withChild.pid).toBe('number');
    expect(typeof withChild.ownerPid).toBe('number');

    for (const invalid of [null, 0, -1]) {
      const lease = launcher.buildLeaseObject(invalid, '2026-05-28T00:00:00.000Z');
      expect('childPid' in lease).toBe(false);
      expect(lease).toMatchObject({ startedAt: '2026-05-28T00:00:00.000Z' });
    }
  });

  it('signalProcess swallows EPERM/ESRCH as false and rethrows other errors (REQ-006 kill-path)', () => {
    const spy = vi.spyOn(process, 'kill');

    spy.mockImplementation(() => true);
    expect(launcher.signalProcess(4242, 'SIGTERM')).toBe(true);

    spy.mockImplementation(() => {
      throw Object.assign(new Error('no perm'), { code: 'EPERM' });
    });
    expect(launcher.signalProcess(4242, 'SIGTERM')).toBe(false);

    spy.mockImplementation(() => {
      throw Object.assign(new Error('no such process'), { code: 'ESRCH' });
    });
    expect(launcher.signalProcess(4242, 'SIGKILL')).toBe(false);

    spy.mockImplementation(() => {
      throw Object.assign(new Error('boom'), { code: 'EINVAL' });
    });
    expect(() => launcher.signalProcess(4242, 'SIGKILL')).toThrow('boom');
  });

  // Regression: the F3 duplicate-spawn guard must NOT permanently disable F1's crash-loop relaunch.
  // A one-shot "ever launched" flag blocked scheduleRelaunch->launchServer after a child exited;
  // the correct guard blocks only while a child is CURRENTLY running.
  it('shouldSkipLaunch blocks only a currently-running child, allowing relaunch after exit (REQ-004 / F1 relaunch)', () => {
    expect(launcher.shouldSkipLaunch(null)).toBe(false); // first launch allowed
    expect(launcher.shouldSkipLaunch({ exitCode: null, signalCode: null })).toBe(true); // running -> skip duplicate
    expect(launcher.shouldSkipLaunch({ exitCode: 1, signalCode: null })).toBe(false); // exited -> relaunch ALLOWED (the fix)
    expect(launcher.shouldSkipLaunch({ exitCode: null, signalCode: 'SIGKILL' })).toBe(false); // killed -> relaunch allowed
  });

  it('isRespawnLockStale reclaims dead/unparseable/aged locks but keeps a live fresh one (REQ-003 stale-lock reclaim)', () => {
    const liveness = (pid: number) => (pid === 111 ? 'alive' : 'dead');
    const now = Date.parse('2026-05-28T00:01:00.000Z');
    // live holder, fresh (<60s) -> NOT stale
    expect(
      launcher.isRespawnLockStale(JSON.stringify({ pid: 111, startedAt: '2026-05-28T00:00:55.000Z' }), { liveness, nowMs: now }),
    ).toBe(false);
    // dead holder -> stale (reclaim)
    expect(
      launcher.isRespawnLockStale(JSON.stringify({ pid: 222, startedAt: '2026-05-28T00:00:55.000Z' }), { liveness, nowMs: now }),
    ).toBe(true);
    // live holder, even aged out -> NOT stale: a live owner still holds the lock, so age alone must
    // never reclaim it out from under a long-lived demand listener
    expect(
      launcher.isRespawnLockStale(JSON.stringify({ pid: 111, startedAt: '2026-05-27T00:00:00.000Z' }), { liveness, nowMs: now }),
    ).toBe(false);
    // no live owner + aged past the TTL -> stale: the age backstop applies only when the owner is not
    // confirmably alive (absent / invalid pid here)
    expect(
      launcher.isRespawnLockStale(JSON.stringify({ startedAt: '2026-05-27T00:00:00.000Z' }), { liveness, nowMs: now }),
    ).toBe(true);
    // unparseable / empty -> stale
    expect(launcher.isRespawnLockStale('not json', { liveness, nowMs: now })).toBe(true);
    expect(launcher.isRespawnLockStale('', { liveness, nowMs: now })).toBe(true);
  });
});

describe('launcher disposal relaunch gate', () => {
  const INITIAL_PPID = 4242;

  it('relaunches when the owner is alive and no shutdown is in progress', () => {
    // Normal case: the owning runtime still holds the same parent pid, so a delayed relaunch
    // is still the right move.
    expect(
      launcher.shouldAbortRelaunchOnFire({ shuttingDown: false, currentPpid: INITIAL_PPID, initialPpid: INITIAL_PPID }),
    ).toBe(false);
  });

  it('aborts when the launcher has begun shutting down', () => {
    // A shutdown that started after the backoff was scheduled must win: reviving the daemon
    // now would only flap it back down.
    expect(
      launcher.shouldAbortRelaunchOnFire({ shuttingDown: true, currentPpid: INITIAL_PPID, initialPpid: INITIAL_PPID }),
    ).toBe(true);
  });

  it('aborts when the owning runtime is gone (parent pid changed)', () => {
    // The MCP host is the launcher's parent; a changed ppid means that host exited, so a
    // respawn would drop every bridged transport under a dying session.
    expect(
      launcher.shouldAbortRelaunchOnFire({ shuttingDown: false, currentPpid: 5001, initialPpid: INITIAL_PPID }),
    ).toBe(true);
  });

  it('aborts when the launcher has been reparented to pid 1 (orphaned)', () => {
    // Reparenting to the init/subreaper pid is the clearest orphan signal.
    expect(
      launcher.shouldAbortRelaunchOnFire({ shuttingDown: false, currentPpid: 1, initialPpid: INITIAL_PPID }),
    ).toBe(true);
  });

  it('still relaunches a crash or recycle under a live owner (gate is additive)', () => {
    // Crash-recovery and RSS-recycle fire with the owner alive and a matching ppid, so the
    // gate must stay a no-op for them.
    expect(
      launcher.shouldAbortRelaunchOnFire({ shuttingDown: false, currentPpid: 7777, initialPpid: 7777 }),
    ).toBe(false);
  });
});
