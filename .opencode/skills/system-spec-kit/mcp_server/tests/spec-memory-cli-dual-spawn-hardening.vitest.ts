// -----------------------------------------------------------------------------
// MODULE: Spec Memory CLI Dual Spawn Hardening Tests
// -----------------------------------------------------------------------------

import { mkdtempSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import net from 'node:net';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { StringDecoder } from 'node:string_decoder';

import { afterAll, afterEach, describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

interface LauncherModule {
  readonly contextServerSpawnIo: (reelectionEnabled: boolean) => { readonly detached: boolean; readonly stdio: [string, string, string] };
  readonly daemonReelectionEnabled: (env?: Record<string, string | undefined>) => boolean;
  readonly shouldReleaseDaemonForReelection: (args?: { readonly enabled?: boolean; readonly hasLiveDaemon?: boolean }) => boolean;
}

interface LeaseResult {
  readonly ownerPid: number;
  readonly startedAt?: string;
  readonly legacyPath?: string | null;
  readonly socketPath?: string | null;
}

interface BridgeResult {
  readonly action: string;
  readonly reason?: string;
  readonly socketPath?: string;
}

interface BridgeModule {
  readonly maybeBridgeLeaseHolder: (options: {
    readonly serviceName: string;
    readonly leaseResult: LeaseResult;
    readonly loggerPrefix: string;
    readonly dbDir: string;
    readonly probeTimeoutMs?: number;
    readonly bridge?: (socketPath: string) => unknown;
  }) => Promise<BridgeResult>;
}

interface RuntimeScope {
  readonly rootDir: string;
  readonly ownerSocketDir: string;
  readonly secondarySocketDir: string;
  readonly memoryDbPath: string;
}

const launcher = require('../../../../bin/mk-spec-memory-launcher.cjs') as LauncherModule;
const bridge = require('../../../../bin/lib/launcher-ipc-bridge.cjs') as BridgeModule;
const launcherPath = require.resolve('../../../../bin/mk-spec-memory-launcher.cjs') as string;

const tempDirs: string[] = [];
const servers: net.Server[] = [];
const originalEnv = new Map<string, string | undefined>();
for (const key of ['SPECKIT_IPC_SOCKET_DIR', 'SPECKIT_DAEMON_REELECTION', 'MEMORY_DB_PATH', 'SPECKIT_LEASE_PROBE_RETRIES']) {
  originalEnv.set(key, process.env[key]);
}

function restoreEnv(): void {
  for (const [key, value] of originalEnv) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

function createRuntimeScope(reelection: 'on' | 'off'): RuntimeScope {
  const rootDir = mkdtempSync(join(tmpdir(), 'spec-memory-dual-spawn-'));
  const ownerSocketDir = join(rootDir, 'owner-ipc');
  const secondarySocketDir = join(rootDir, 'secondary-ipc');
  mkdirSync(ownerSocketDir, { recursive: true, mode: 0o700 });
  mkdirSync(secondarySocketDir, { recursive: true, mode: 0o700 });
  tempDirs.push(rootDir);
  process.env.SPECKIT_IPC_SOCKET_DIR = secondarySocketDir;
  process.env.SPECKIT_DAEMON_REELECTION = reelection === 'on' ? 'on' : '0';
  process.env.MEMORY_DB_PATH = join(rootDir, 'memory.sqlite');
  return { rootDir, ownerSocketDir, secondarySocketDir, memoryDbPath: process.env.MEMORY_DB_PATH };
}

async function startProbeDaemon(socketPath: string): Promise<net.Server> {
  mkdirSync(dirname(socketPath), { recursive: true, mode: 0o700 });
  const server = net.createServer((socket) => {
    let buffer = '';
    const decoder = new StringDecoder('utf8');
    socket.on('data', (chunk) => {
      buffer += Buffer.isBuffer(chunk) ? decoder.write(chunk) : String(chunk ?? '');
      let newlineIndex = buffer.indexOf('\n');
      while (newlineIndex !== -1) {
        const line = buffer.slice(0, newlineIndex).trim();
        buffer = buffer.slice(newlineIndex + 1);
        newlineIndex = buffer.indexOf('\n');
        if (!line) continue;
        const request = JSON.parse(line) as { readonly id?: unknown; readonly method?: unknown };
        if (request.method === 'initialize' && request.id !== undefined) {
          socket.write(`${JSON.stringify({
            jsonrpc: '2.0',
            id: request.id,
            result: {
              protocolVersion: '2025-06-18',
              capabilities: {},
              serverInfo: { name: 'test-daemon', version: '0.0.0' },
            },
          })}\n`);
        }
      }
    });
  });

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(socketPath, () => {
      server.off('error', reject);
      resolve();
    });
  });
  servers.push(server);
  return server;
}

async function closeTrackedServers(): Promise<void> {
  while (servers.length > 0) {
    const server = servers.pop();
    if (!server) continue;
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

async function cleanup(): Promise<void> {
  await closeTrackedServers();
  restoreEnv();
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
}

afterEach(async () => {
  await cleanup();
});

afterAll(async () => {
  await cleanup();
});

describe('spec-memory CLI dual simultaneous spawn hardening', () => {
  it.each(['off', 'on'] as const)('pins daemon re-election %s before evaluating spawn ownership', (reelection) => {
    createRuntimeScope(reelection);

    const enabled = launcher.daemonReelectionEnabled(process.env);
    expect(enabled).toBe(reelection === 'on');
    expect(launcher.contextServerSpawnIo(enabled)).toEqual(reelection === 'on'
      ? { detached: true, stdio: ['ignore', 'ignore', 'ignore'] }
      : { detached: false, stdio: ['ignore', 'ignore', 'inherit'] });
    expect(launcher.shouldReleaseDaemonForReelection({ enabled, hasLiveDaemon: true })).toBe(reelection === 'on');
    expect(process.env.SPECKIT_IPC_SOCKET_DIR).toContain('secondary-ipc');
    expect(process.env.MEMORY_DB_PATH).toContain('memory.sqlite');
  });

  it('keeps owner, respawn, and bootstrap ownership serialized in the launcher contract', () => {
    createRuntimeScope('on');
    const source = readFileSync(launcherPath, 'utf8');

    expect(source).toContain("fs.openSync(currentLeasePath, 'wx', 0o600)");
    expect(source).toContain('staleRespawnLock = acquireRespawnLockFile()');
    expect(source).toContain('lockHeld = await acquireBootstrapLock()');
  });

  it('bridges a secondary launcher through the owner-recorded socket when socket dirs diverge', async () => {
    const scope = createRuntimeScope('on');
    const ownerSocketPath = join(scope.ownerSocketDir, 'daemon-ipc.sock');
    await startProbeDaemon(ownerSocketPath);
    const bridgedSockets: string[] = [];

    const result = await bridge.maybeBridgeLeaseHolder({
      serviceName: 'mk-spec-memory',
      leaseResult: {
        ownerPid: process.pid,
        startedAt: new Date().toISOString(),
        legacyPath: null,
        socketPath: ownerSocketPath,
      },
      loggerPrefix: 'spec-memory-test',
      dbDir: scope.secondarySocketDir,
      probeTimeoutMs: 250,
      bridge: (socketPath) => {
        bridgedSockets.push(socketPath);
      },
    });

    expect(result.action).toBe('bridge');
    expect(result.socketPath).toBe(ownerSocketPath);
    expect(bridgedSockets).toEqual([ownerSocketPath]);
  });
});
