// ───────────────────────────────────────────────────────────────
// HARNESS A: single-writer / no-orphan supervision cluster
// ───────────────────────────────────────────────────────────────
// Deterministic regression coverage for the coordinated single-writer / durability cluster,
// Family 1 (respawn lock) + Family 2 (root reaping), all in model-server-supervision.cjs:
//
//   isRespawnLockStale: a LIVE demand listener deliberately holds the respawn lock across its
//           whole bind + idle-listener window (> RESPAWN_LOCK_STALE_MS). The wall-clock branch must NOT
//           expire the lock while the recorded owner pid is still alive — only age-out a dead/absent
//           owner. (RED before: wall-clock alone marks an alive owner's lock stale.)
//   handleModelServerDemand: when launch() returns false (spawn produced no pid), the demand
//           server was already torn down and the respawn lock released, so the launcher must RE-ARM the
//           lazy demand listener — otherwise it is stranded (no listener, no resident, no relaunch).
//           (RED before: no second listener handler is created after a failed launch.)
//   tickIdleMonitor: idle eviction must reap the model-server ROOT pid (not just descendants +
//           the lease) by routing through reapBeforeRespawn, the shared root-liveness authority.
//           (RED before: only descendants are signalled; the root pid never receives SIGTERM/SIGKILL.)
//
// No real sleeps: nowMs / liveness / spawnFn / signal / setInterval are all injected; tmp dirs only.

import { EventEmitter } from 'node:events';
import { mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
const mss = require('../../../../../bin/lib/model-server-supervision.cjs') as typeof import('../../../../../bin/lib/model-server-supervision.cjs');

class FakeChild extends EventEmitter {
  public exitCode: number | null = null;
  public signalCode: string | null = null;

  constructor(public readonly pid: number | undefined) {
    super();
  }

  public kill(): boolean {
    return true;
  }
}

function createPidAccessors(socketPath: string) {
  const pidPath = join(dirname(socketPath), mss.HF_MODEL_SERVER_PID_FILE_NAME);
  return {
    path: pidPath,
    write: vi.fn((pid: number | null) => {
      if (!Number.isInteger(pid) || (pid as number) <= 0) {
        try {
          unlinkSync(pidPath);
        } catch {
          // Cleared is the desired state.
        }
        return;
      }
      mkdirSync(dirname(pidPath), { recursive: true, mode: 0o700 });
      const tmp = `${pidPath}.tmp.${process.pid}`;
      writeFileSync(tmp, JSON.stringify({ pid }, null, 2), { mode: 0o600 });
      renameSync(tmp, pidPath);
    }),
    read: vi.fn((): number | null => {
      try {
        const parsed = JSON.parse(readFileSync(pidPath, 'utf8')) as { pid?: unknown };
        return Number.isInteger(parsed.pid) && Number(parsed.pid) > 0 ? Number(parsed.pid) : null;
      } catch {
        return null;
      }
    }),
  };
}

function createFakeHttpServerHarness() {
  const handlers: Array<(request: { url: string; method: string }, response: {
    writeHead: (statusCode: number, headers: Record<string, unknown>) => void;
    end: (body: string) => void;
  }) => void> = [];
  const listenCalls: string[] = [];
  return {
    handlers,
    listenCalls,
    createServer(handler: (request: { url: string; method: string }, response: {
      writeHead: (statusCode: number, headers: Record<string, unknown>) => void;
      end: (body: string) => void;
    }) => void) {
      handlers.push(handler);
      const server = new EventEmitter() as EventEmitter & {
        listen: (socketPath: string) => void;
        close: (callback?: () => void) => void;
      };
      server.listen = (socketPath: string) => {
        listenCalls.push(socketPath);
        writeFileSync(socketPath, 'fake-bound-socket', 'utf8');
        queueMicrotask(() => server.emit('listening'));
      };
      server.close = (callback?: () => void) => {
        queueMicrotask(() => callback?.());
      };
      return server;
    },
  };
}

function invokeDemand(handler: ReturnType<typeof createFakeHttpServerHarness>['handlers'][number]): Promise<{
  statusCode: number;
  body: Record<string, unknown>;
}> {
  return new Promise((resolve) => {
    let statusCode = 0;
    handler(
      { url: '/api/health', method: 'GET' },
      {
        writeHead(nextStatusCode) {
          statusCode = nextStatusCode;
        },
        end(body) {
          resolve({ statusCode, body: JSON.parse(body) as Record<string, unknown> });
        },
      },
    );
  });
}

async function flushAsyncWork(): Promise<void> {
  for (let attempt = 0; attempt < 20; attempt++) {
    await Promise.resolve();
  }
}

async function waitForHandlerCount(harness: ReturnType<typeof createFakeHttpServerHarness>, count: number): Promise<void> {
  for (let attempt = 0; attempt < 50; attempt++) {
    if (harness.handlers.length >= count) return;
    await Promise.resolve();
  }
  throw new Error(`Timed out waiting for ${count} demand handler(s); saw ${harness.handlers.length}`);
}

describe('single-writer / no-orphan supervision cluster (031/009 Family 1+2)', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    vi.restoreAllMocks();
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  function tempDir(prefix: string): string {
    const dir = mkdtempSync(join('/private/tmp', prefix));
    tempDirs.push(dir);
    return dir;
  }

  // ── Respawn lock liveness ────────────────────────────────────────────────
  it('DR-005: does not age-out the respawn lock while the recorded owner pid is alive', () => {
    const ownerPid = 4321;
    // startedAt is far in the past — well beyond the stale cap — so the ONLY thing keeping this lock
    // non-stale is the live owner. Pre-fix, the wall-clock branch fires regardless of liveness.
    const raw = JSON.stringify({ pid: ownerPid, startedAt: '2026-05-29T00:00:00.000Z' });
    const nowMs = Date.parse('2026-05-29T00:10:00.000Z'); // +600_000ms >> RESPAWN_LOCK_STALE_MS (60_000)

    const aliveOwner = mss.isRespawnLockStale(raw, {
      liveness: (pid: number) => (pid === ownerPid ? 'alive' : 'dead'),
      nowMs,
      staleMs: 60000,
    });
    expect(aliveOwner).toBe(false); // live owner still holds the lock — NOT stale

    // Control 1: same age, but the owner is dead -> stale (age-out applies to a non-live owner).
    const deadOwner = mss.isRespawnLockStale(raw, {
      liveness: () => 'dead',
      nowMs,
      staleMs: 60000,
    });
    expect(deadOwner).toBe(true);

    // Control 2: an aged lock with NO recorded pid still ages out (wall-clock branch still reachable
    // when there is no live owner to protect).
    const noPid = mss.isRespawnLockStale(JSON.stringify({ startedAt: '2026-05-29T00:00:00.000Z' }), {
      liveness: () => 'dead',
      nowMs,
      staleMs: 60000,
    });
    expect(noPid).toBe(true);

    // Control 3: a fresh lock owned by a live pid is obviously not stale either.
    const freshAlive = mss.isRespawnLockStale(
      JSON.stringify({ pid: ownerPid, startedAt: new Date(nowMs).toISOString() }),
      { liveness: () => 'alive', nowMs, staleMs: 60000 },
    );
    expect(freshAlive).toBe(false);
  });

  // ── Demand listener re-arm ───────────────────────────────────────────────
  it('DR-006: re-arms the lazy demand listener when a demand-driven spawn produces no pid', async () => {
    const socketDir = tempDir('hf-sw-spawn-nopid-');
    const socketPath = join(socketDir, 'hf-embed.sock');
    const pidAccessors = createPidAccessors(socketPath);
    const serverHarness = createFakeHttpServerHarness();
    // spawnFn returns a child with NO pid -> launch() hits the !Number.isInteger(childPid) branch and
    // returns false. Pre-fix: the listener is torn down on demand and never re-armed -> stranded.
    const spawnFn = vi.fn(() => new FakeChild(undefined));

    const control = mss.createModelServerControl({
      log: () => undefined,
      env: {},
      rootDir: process.cwd(),
      opencodeDir: join(process.cwd(), '.opencode'),
      dbDir: () => socketDir,
      bridge: { probeModelServer: vi.fn(async () => ({ status: 'dead', reason: 'test-dead' })) },
      spawnFn,
      writeModelServerPid: pidAccessors.write,
      readModelServerPid: pidAccessors.read,
      httpCreateServer: serverHarness.createServer,
      liveness: () => 'dead',
      watchdogConfig: () => ({ enabled: false, maxRssMb: null, intervalMs: 1000, consecutiveBreaches: 1, graceMs: 7000 }),
      nowMs: () => 1000,
    });

    await expect(control.startDemandListener({ socketPath })).resolves.toMatchObject({ started: true, socketPath });
    expect(serverHarness.handlers).toHaveLength(1);

    const demand = await invokeDemand(serverHarness.handlers[0]);
    // The demand response still reports the spawn outcome honestly (launched=false)...
    expect(demand.statusCode).toBe(503);
    expect(demand.body).toMatchObject({ state: 'loading', modelServerLaunchRequested: true, launched: false });
    expect(spawnFn).toHaveBeenCalledTimes(1);

    // ...but the launcher must NOT be stranded: a fresh demand listener is re-armed (a second handler
    // is registered + a second listen() to the same socket). This is the GREEN-after assertion; pre-fix
    // there is exactly ONE handler forever (the demand server was torn down and never re-armed).
    await waitForHandlerCount(serverHarness, 2);
    expect(serverHarness.handlers).toHaveLength(2);
    expect(serverHarness.listenCalls).toEqual([socketPath, socketPath]);

    // The re-armed listener is live and accepts another demand (it routes to the demand handler again),
    // which is the recovery the fix restores. (We intentionally do NOT assert a second spawn here: a
    // no-pid child legitimately lingers in state.child, so the next launch() short-circuits via
    // shouldSkipLaunch — that is orthogonal to the re-arm being fixed.)
    const retryDemand = await invokeDemand(serverHarness.handlers[1]);
    expect(retryDemand.statusCode).toBe(503);
    expect(retryDemand.body).toMatchObject({ modelServerLaunchRequested: true });

    control.clearTimers();
    await control.stopDemandListener();
  });

  // ── Idle root reaping ────────────────────────────────────────────────────
  it('DR-012: idle eviction reaps the model-server ROOT pid via the root-liveness authority', async () => {
    const socketDir = tempDir('hf-sw-idle-root-reap-');
    const socketPath = join(socketDir, 'hf-embed.sock');
    const pidAccessors = createPidAccessors(socketPath);
    const serverHarness = createFakeHttpServerHarness();
    const intervalCallbacks: Array<() => void> = [];
    const rootPid = 8311;
    const descendantPid = 8312;
    const child = new FakeChild(rootPid);

    // Record every signal so we can prove the ROOT pid is targeted (not just descendants). The reap
    // authority (reapBeforeRespawn) signals the root directly; reapProcessTreeGroups signals the tree.
    const rootSignals: Array<number | string> = [];
    const signal = vi.fn((pid: number, sig: number | string) => {
      if (sig === 0) {
        // Liveness probe inside reapProcessTreeGroups: keep root + descendant "present" so the tree
        // walk has candidates; everything else absent.
        return pid === rootPid || pid === descendantPid;
      }
      if (pid === rootPid || pid === -rootPid) rootSignals.push(sig);
      return true;
    });

    // First waitForExit (post-SIGTERM) reports "not exited" so the authority escalates to SIGKILL,
    // proving the full root-termination ladder runs; the second (post-SIGKILL) reports exited.
    const waitForExit = vi.fn()
      .mockResolvedValueOnce(false)
      .mockResolvedValue(true);

    const control = mss.createModelServerControl({
      log: () => undefined,
      env: { SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN: '0.001' },
      dbDir: () => socketDir,
      bridge: {
        probeModelServer: vi.fn(async () => ({
          status: 'alive',
          reason: 'health-ready',
          health: { lastSuccessfulEmbedAt: 1000, inFlight: 0 },
        })),
      },
      spawnFn: vi.fn(() => child),
      writeModelServerPid: pidAccessors.write,
      readModelServerPid: pidAccessors.read,
      httpCreateServer: serverHarness.createServer,
      // Root + descendant are alive when probed by liveness (reapBeforeRespawn root check).
      liveness: (pid: number) => (pid === rootPid || pid === descendantPid ? 'alive' : 'dead'),
      signal,
      waitForExit,
      processRowsRunner: () => `${rootPid} 1 2048\n${descendantPid} ${rootPid} 1024`,
      setInterval: (callback: () => void, timeoutMs: number) => {
        expect(timeoutMs).toBe(60);
        intervalCallbacks.push(callback);
        return { unref: vi.fn() };
      },
      clearInterval: vi.fn(),
      nowMs: () => 1061, // > lastSuccessfulEmbedAt + idle timeout -> eviction fires
      watchdogConfig: () => ({ enabled: false, maxRssMb: null, intervalMs: 1000, consecutiveBreaches: 1, graceMs: 7000 }),
    });

    await expect(control.startDemandListener({ socketPath })).resolves.toMatchObject({ started: true, socketPath });
    expect(intervalCallbacks).toHaveLength(1);
    const spawnDemand = await invokeDemand(serverHarness.handlers[0]);
    expect(spawnDemand.body).toMatchObject({ modelServerLaunchRequested: true });
    expect(pidAccessors.read()).toBe(rootPid);

    // Fire the idle tick.
    intervalCallbacks[0]();
    await flushAsyncWork();

    // GREEN-after: the ROOT pid received SIGTERM then SIGKILL (the full termination ladder from the
    // shared root-liveness authority). Pre-fix, reapProcessTree() filtered the root out, so rootSignals
    // would be empty.
    expect(rootSignals).toContain('SIGTERM');
    expect(rootSignals).toContain('SIGKILL');
    expect(waitForExit).toHaveBeenCalled();

    // The lease is still cleared and the listener re-armed (existing idle-evict contract preserved).
    expect(pidAccessors.write).toHaveBeenLastCalledWith(null);
    expect(pidAccessors.read()).toBeNull();
    expect(serverHarness.handlers).toHaveLength(2);

    control.clearTimers();
    await control.stopDemandListener();
  });

  it('DR-012: idle eviction still clears the lease cleanly when the root pid is already dead', async () => {
    // Boundary: if the resident died on its own just before the idle tick, reapBeforeRespawn must
    // short-circuit (model-server-already-dead) WITHOUT signalling, and still clear the lease + re-arm.
    const socketDir = tempDir('hf-sw-idle-root-dead-');
    const socketPath = join(socketDir, 'hf-embed.sock');
    const pidAccessors = createPidAccessors(socketPath);
    const serverHarness = createFakeHttpServerHarness();
    const intervalCallbacks: Array<() => void> = [];
    const rootPid = 8411;
    const child = new FakeChild(rootPid);
    const killSignals: Array<number | string> = [];
    let evicting = false;

    const control = mss.createModelServerControl({
      log: () => undefined,
      env: { SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN: '0.001' },
      dbDir: () => socketDir,
      bridge: {
        probeModelServer: vi.fn(async () => ({
          status: 'alive',
          reason: 'health-ready',
          health: { lastSuccessfulEmbedAt: 1000, inFlight: 0 },
        })),
      },
      spawnFn: vi.fn(() => child),
      writeModelServerPid: pidAccessors.write,
      readModelServerPid: pidAccessors.read,
      httpCreateServer: serverHarness.createServer,
      // Root is alive until the eviction reap probes it, then reports dead (it exited on its own).
      liveness: (pid: number) => (pid === rootPid && !evicting ? 'alive' : 'dead'),
      signal: vi.fn((pid: number, sig: number | string) => {
        if (sig !== 0) killSignals.push(sig);
        return true;
      }),
      waitForExit: vi.fn(async () => true),
      processRowsRunner: () => '',
      setInterval: (callback: () => void) => {
        intervalCallbacks.push(callback);
        return { unref: vi.fn() };
      },
      clearInterval: vi.fn(),
      nowMs: () => 1061,
      watchdogConfig: () => ({ enabled: false, maxRssMb: null, intervalMs: 1000, consecutiveBreaches: 1, graceMs: 7000 }),
    });

    await control.startDemandListener({ socketPath });
    await invokeDemand(serverHarness.handlers[0]);
    expect(pidAccessors.read()).toBe(rootPid);

    evicting = true;
    intervalCallbacks[0]();
    await flushAsyncWork();

    // Already-dead root -> no kill signals sent, but the lease is cleared and the listener re-armed.
    expect(killSignals).toEqual([]);
    expect(pidAccessors.write).toHaveBeenLastCalledWith(null);
    expect(pidAccessors.read()).toBeNull();
    expect(serverHarness.handlers).toHaveLength(2);

    control.clearTimers();
    await control.stopDemandListener();
  });
});
