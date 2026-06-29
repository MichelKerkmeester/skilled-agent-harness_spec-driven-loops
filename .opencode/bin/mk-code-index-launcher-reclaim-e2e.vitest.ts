import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

type OwnerLease = {
  ownerPid: number;
  childSpawnedAtIso: string;
  lastHeartbeatIso: string;
  ttlMs: number;
  socketPath: string;
};

type LeaseResult = {
  ownerPid: number;
  socketPath: string;
};

type LiveOwnerReclaimResult = {
  decision: string;
  input: {
    pidAlive: boolean;
    socketServing: boolean;
    childSpawnedAtMs: number | null;
    heartbeatAgeMs: number | null;
    nowMs: number;
    graceMs: number;
    maxInitMs: number;
    heartbeatTtlMs: number;
  };
  probe: {
    status: string;
    kind: string;
  };
  socketPath: string | null;
};

type ClassifyLiveOwnerReclaim = (
  ownerLease: OwnerLease,
  leaseResult: LeaseResult,
) => Promise<LiveOwnerReclaimResult | null>;

const envKeys = [
  'SPECKIT_LAUNCHER_RECLAIM_DEAD_SOCKET',
  'SPECKIT_LAUNCHER_STARTUP_GRACE_MS',
  'SPECKIT_LAUNCHER_MAX_INIT_MS',
  'SPECKIT_PROBE_TIMEOUT_MS',
] as const;

const testDir = dirname(fileURLToPath(import.meta.url));
const launcherPath = join(testDir, 'mk-code-index-launcher.cjs');
const requireLauncherRelative = createRequire(launcherPath);

function loadClassifyLiveOwnerReclaim(): ClassifyLiveOwnerReclaim {
  const source = readFileSync(launcherPath, 'utf8').replace(/^#!.*\n/, '');
  const testModule = {
    exports: {} as Record<string, unknown>,
    filename: launcherPath,
    id: launcherPath,
    loaded: false,
    parent: null,
  };
  const wrapper = new Function(
    'exports',
    'require',
    'module',
    '__filename',
    '__dirname',
    `${source}\nmodule.exports.__testOnly = { classifyLiveOwnerReclaim };\n`,
  );

  wrapper(testModule.exports, requireLauncherRelative, testModule, launcherPath, testDir);

  const loaded = testModule.exports.__testOnly as {
    classifyLiveOwnerReclaim: ClassifyLiveOwnerReclaim;
  };
  return loaded.classifyLiveOwnerReclaim;
}

const classifyLiveOwnerReclaim = loadClassifyLiveOwnerReclaim();

function isoMsAgo(ageMs: number): string {
  return new Date(Date.now() - ageMs).toISOString();
}

function createAbsentSocketPath(): { tmpRoot: string; socketPath: string } {
  const tmpRoot = mkdtempSync(join(tmpdir(), 'mk-code-index-reclaim-e2e-'));
  return {
    tmpRoot,
    socketPath: join(tmpRoot, 'missing', 'daemon-ipc.sock'),
  };
}

function leaseFor(socketPath: string, overrides: Partial<OwnerLease> = {}): OwnerLease {
  return {
    ownerPid: process.pid,
    childSpawnedAtIso: isoMsAgo(500),
    lastHeartbeatIso: isoMsAgo(1_500),
    ttlMs: 1_000,
    socketPath,
    ...overrides,
  };
}

function leaseResultFor(socketPath: string): LeaseResult {
  return {
    ownerPid: process.pid,
    socketPath,
  };
}

describe('classifyLiveOwnerReclaim dead-socket path', () => {
  const originalEnv: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const key of envKeys) {
      originalEnv[key] = process.env[key];
    }

    process.env.SPECKIT_LAUNCHER_RECLAIM_DEAD_SOCKET = '1';
    process.env.SPECKIT_LAUNCHER_STARTUP_GRACE_MS = '100';
    process.env.SPECKIT_LAUNCHER_MAX_INIT_MS = '200';
    process.env.SPECKIT_PROBE_TIMEOUT_MS = '25';
  });

  afterEach(() => {
    for (const key of envKeys) {
      if (originalEnv[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = originalEnv[key];
      }
    }
  });

  it('keeps a recent child with an absent socket in still-starting', async () => {
    const { tmpRoot, socketPath } = createAbsentSocketPath();
    try {
      const result = await classifyLiveOwnerReclaim(
        leaseFor(socketPath, {
          childSpawnedAtIso: isoMsAgo(10),
          lastHeartbeatIso: isoMsAgo(1_500),
        }),
        leaseResultFor(socketPath),
      );

      expect(result?.decision).toBe('still-starting');
      expect(result?.input.pidAlive).toBe(true);
      expect(result?.input.socketServing).toBe(false);
      expect(result?.probe).toEqual({ status: 'dead', kind: 'enoent' });
      expect(result?.socketPath).toBe(socketPath);
    } finally {
      rmSync(tmpRoot, { recursive: true, force: true });
    }
  });

  it('reclaims an aged child with an aged heartbeat and absent socket', async () => {
    const { tmpRoot, socketPath } = createAbsentSocketPath();
    try {
      const result = await classifyLiveOwnerReclaim(
        leaseFor(socketPath, {
          childSpawnedAtIso: isoMsAgo(500),
          lastHeartbeatIso: isoMsAgo(1_500),
        }),
        leaseResultFor(socketPath),
      );

      expect(result?.decision).toBe('reclaimable');
      expect(result?.input.pidAlive).toBe(true);
      expect(result?.input.socketServing).toBe(false);
      expect(result?.probe).toEqual({ status: 'dead', kind: 'enoent' });
      expect(result?.socketPath).toBe(socketPath);
    } finally {
      rmSync(tmpRoot, { recursive: true, force: true });
    }
  });

  it('does not reclaim an aged child with a fresh heartbeat', async () => {
    const { tmpRoot, socketPath } = createAbsentSocketPath();
    try {
      const result = await classifyLiveOwnerReclaim(
        leaseFor(socketPath, {
          childSpawnedAtIso: isoMsAgo(500),
          lastHeartbeatIso: isoMsAgo(10),
        }),
        leaseResultFor(socketPath),
      );

      expect(result?.decision).toBe('recheck');
      expect(result?.input.pidAlive).toBe(true);
      expect(result?.input.socketServing).toBe(false);
      expect(result?.probe).toEqual({ status: 'dead', kind: 'enoent' });
      expect(result?.socketPath).toBe(socketPath);
    } finally {
      rmSync(tmpRoot, { recursive: true, force: true });
    }
  });

  it('short-circuits when dead-socket reclaim is disabled', async () => {
    const { tmpRoot, socketPath } = createAbsentSocketPath();
    try {
      process.env.SPECKIT_LAUNCHER_RECLAIM_DEAD_SOCKET = '0';

      await expect(classifyLiveOwnerReclaim(
        leaseFor(socketPath, {
          childSpawnedAtIso: isoMsAgo(500),
          lastHeartbeatIso: isoMsAgo(1_500),
        }),
        leaseResultFor(socketPath),
      )).resolves.toBeNull();
    } finally {
      rmSync(tmpRoot, { recursive: true, force: true });
    }
  });
});
