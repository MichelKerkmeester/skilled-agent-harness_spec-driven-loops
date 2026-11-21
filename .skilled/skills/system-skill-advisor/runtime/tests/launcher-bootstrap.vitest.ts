// ───────────────────────────────────────────────────────────────
// MODULE: Launcher Bootstrap Tests
// ───────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { initDb, getDb, closeDb, resolveSkillGraphDbDir } from '../lib/skill-graph/skill-graph-db.js';
import { isLeaseHeld, acquireSkillGraphLease, openLeaseDatabase } from '../lib/daemon/lease.js';
import { ADVISOR_DISABLED_FLAGS } from '../lib/advisor-disabled.js';
import { rebuildAdvisorIndex } from '../handlers/advisor-rebuild.js';
import type { AdvisorStatusOutput } from '../schemas/advisor-tool-schemas.js';

const require = createRequire(import.meta.url);
// The launcher hands its child the socket directory the bridge resolves, which may
// be relocated when the database path would push a unix socket past the platform
// limit. Deriving the expectation through the same call keeps the test asserting the
// contract rather than a literal path that cannot bind under a deep temp directory.
const ipcBridge = require('../../../../bin/lib/launcher-ipc-bridge.cjs') as {
  resolveIpcSocketDir: (serviceName: string, options?: { dbDir?: string; env?: NodeJS.ProcessEnv }) => string;
};
const modelServerSupervision = require('../../../../bin/lib/model-server-supervision.cjs') as {
  DEFAULT_MODEL_SERVER_SOCKET_DIR: string;
};
const launcher = require('../../../../bin/system-skill-advisor-launcher.cjs') as {
  acquireBootstrapLock: (options?: { staleMs?: number; timeoutMs?: number; retrySleepMs?: number }) => Promise<boolean>;
  advisorDbPath: () => string;
  artifactsReady: () => boolean;
  configureLauncherPathsForTesting: (paths: { runtimeDir: string; dbDir: string; lockDir: string; stateFile: string }) => void;
  createChildEnv: (sourceEnv?: NodeJS.ProcessEnv) => Record<string, string>;
  resolveModelServerSocketPath: (
    env?: NodeJS.ProcessEnv,
    options?: { dbDir?: string },
  ) => string;
};

// The child's socket directory is resolved by the shared IPC bridge, which since the
// memory decommission no longer derives it from the database directory. The test
// asks the bridge the same question the launcher does instead of assuming the answer.
function expectedChildSocketDir(memoryDbPath: string): string {
  return ipcBridge.resolveIpcSocketDir('system-skill-advisor', { dbDir: dirname(memoryDbPath), env: {} });
}

// configureTempLauncher leaves the model-server file directory on the supervision
// default. The child address is the launcher resolver's answer for that source env.
function expectedModelServerUrl(sourceEnv: NodeJS.ProcessEnv): string {
  return launcher.resolveModelServerSocketPath(sourceEnv, {
    dbDir: modelServerSupervision.DEFAULT_MODEL_SERVER_SOCKET_DIR,
  });
}

describe('system-skill-advisor launcher bootstrap', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  function configureTempLauncher(): { runtimeDir: string; lockDir: string } {
    const root = mkdtempSync(join(tmpdir(), 'system-skill-advisor-launcher-'));
    tempDirs.push(root);
    const runtimeDir = join(root, 'runtime');
    const dbDir = join(runtimeDir, 'database');
    const lockDir = join(dbDir, '.system-skill-advisor-launcher.lockdir');
    mkdirSync(join(runtimeDir, 'dist/runtime'), { recursive: true });
    launcher.configureLauncherPathsForTesting({
      runtimeDir,
      dbDir,
      lockDir,
      stateFile: join(dbDir, '.system-skill-advisor-launcher.json'),
    });
    return { runtimeDir, lockDir };
  }

  it('removes a stale bootstrap lockdir before acquiring the lock', async () => {
    const { lockDir } = configureTempLauncher();
    mkdirSync(lockDir, { recursive: true });
    const stale = new Date(Date.now() - 10_000);
    utimesSync(lockDir, stale, stale);

    await expect(launcher.acquireBootstrapLock({ staleMs: 1, timeoutMs: 50, retrySleepMs: 1 })).resolves.toBe(true);
  });

  it('marks artifacts stale when source files are newer than dist output', () => {
    const { runtimeDir } = configureTempLauncher();
    const serverPath = join(runtimeDir, 'dist/runtime/advisor-server.js');
    const sourcePath = join(runtimeDir, 'advisor-server.ts');
    writeFileSync(serverPath, '// old dist\n', 'utf8');
    writeFileSync(sourcePath, '// new source\n', 'utf8');
    const oldDate = new Date(Date.now() - 10_000);
    const newDate = new Date();
    utimesSync(serverPath, oldDate, oldDate);
    utimesSync(sourcePath, newDate, newDate);

    expect(launcher.artifactsReady()).toBe(false);
  });

  it('filters parent environment before spawning npm or the advisor server', () => {
    configureTempLauncher();
    const memoryDbPath = launcher.advisorDbPath();
    const socketDir = expectedChildSocketDir(memoryDbPath);
    const sourceEnv = {
      PATH: '/bin',
      HOME: '/tmp/home',
      SYSTEM_SKILL_ADVISOR_DB_DIR: '/tmp/db',
      AWS_SECRET_ACCESS_KEY: 'should-not-leak',
      RANDOM_PARENT_ENV: 'should-not-leak',
    };
    expect(launcher.createChildEnv(sourceEnv)).toEqual({
      PATH: '/bin',
      HOME: '/tmp/home',
      SYSTEM_SKILL_ADVISOR_DB_DIR: '/tmp/db',
      SYSTEM_SKILL_ADVISOR_LAUNCHER_PID: String(process.pid),
      MEMORY_DB_PATH: memoryDbPath,
      SPECKIT_IPC_SOCKET_DIR: socketDir,
      HF_EMBED_SERVER_URL: expectedModelServerUrl(sourceEnv),
    });
  });

  it('keeps the per-request advisor switch out of the daemon env', () => {
    configureTempLauncher();
    const memoryDbPath = launcher.advisorDbPath();
    const socketDir = expectedChildSocketDir(memoryDbPath);
    const sourceEnv: NodeJS.ProcessEnv = { PATH: '/bin' };
    for (const name of ADVISOR_DISABLED_FLAGS) sourceEnv[name] = '1';
    const switchNames = Object.keys(sourceEnv).filter((name) => name !== 'PATH');
    // A short list would quietly narrow this case back to one concern, so the
    // fixture's size is asserted before the env assertion below.
    expect(switchNames).toHaveLength(10);
    // Each caller reads the switch in its own process. A daemon that inherited it
    // would abstain for every later caller in the checkout, so it stays out.
    expect(launcher.createChildEnv(sourceEnv)).toEqual({
      PATH: '/bin',
      // The server must use the launcher's database directory, so the child env
      // always carries it even when the parent did not set one.
      SYSTEM_SKILL_ADVISOR_DB_DIR: dirname(memoryDbPath),
      SYSTEM_SKILL_ADVISOR_LAUNCHER_PID: String(process.pid),
      MEMORY_DB_PATH: memoryDbPath,
      SPECKIT_IPC_SOCKET_DIR: socketDir,
      HF_EMBED_SERVER_URL: expectedModelServerUrl(sourceEnv),
    });
  });

  it('passes an explicit daemon trust default through to the advisor child env', () => {
    configureTempLauncher();
    const memoryDbPath = launcher.advisorDbPath();
    const socketDir = expectedChildSocketDir(memoryDbPath);
    const sourceEnv = {
      SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT: 'trusted',
      AWS_SECRET_ACCESS_KEY: 'should-not-leak',
    };

    // The daemon reads the trust default from its own environment; this pins the
    // child-env allowlist to that reader so the two cannot drift apart.
    expect(sourceText('../advisor-server.ts')).toContain('process.env.SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT');
    expect(launcher.createChildEnv(sourceEnv)).toEqual({
      SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT: 'trusted',
      // The server must use the launcher's database directory, so the child env
      // always carries it even when the parent did not set one.
      SYSTEM_SKILL_ADVISOR_DB_DIR: dirname(memoryDbPath),
      SYSTEM_SKILL_ADVISOR_LAUNCHER_PID: String(process.pid),
      MEMORY_DB_PATH: memoryDbPath,
      SPECKIT_IPC_SOCKET_DIR: socketDir,
      HF_EMBED_SERVER_URL: expectedModelServerUrl(sourceEnv),
    });
  });

  it('passes advisor shadow feature flags through to the child env', () => {
    configureTempLauncher();
    const memoryDbPath = launcher.advisorDbPath();
    const socketDir = expectedChildSocketDir(memoryDbPath);
    const sourceEnv = {
      SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW: 'true',
      SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_SHADOW: 'true',
      AWS_SECRET_ACCESS_KEY: 'should-not-leak',
    };
    expect(launcher.createChildEnv(sourceEnv)).toEqual({
      SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW: 'true',
      SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_SHADOW: 'true',
      // The server must use the launcher's database directory, so the child env
      // always carries it even when the parent did not set one.
      SYSTEM_SKILL_ADVISOR_DB_DIR: dirname(memoryDbPath),
      SYSTEM_SKILL_ADVISOR_LAUNCHER_PID: String(process.pid),
      MEMORY_DB_PATH: memoryDbPath,
      SPECKIT_IPC_SOCKET_DIR: socketDir,
      HF_EMBED_SERVER_URL: expectedModelServerUrl(sourceEnv),
    });
  });

  it('defaults the child MEMORY_DB_PATH to the advisor own database, not a foreign context-index.sqlite', () => {
    configureTempLauncher();
    const childEnv = launcher.createChildEnv({ PATH: '/bin' });

    expect(childEnv.MEMORY_DB_PATH).toBe(launcher.advisorDbPath());
    expect(childEnv.MEMORY_DB_PATH).toMatch(/skill-graph\.sqlite$/);
    expect(childEnv.MEMORY_DB_PATH).not.toMatch(/context-index\.sqlite$/);
  });

  it('honors an explicit SYSTEM_SKILL_ADVISOR_MEMORY_DB_PATH override instead of the default', () => {
    configureTempLauncher();
    const explicitOverride = '/tmp/some-other-test-or-external-db/custom.sqlite';

    const childEnv = launcher.createChildEnv({
      PATH: '/bin',
      SYSTEM_SKILL_ADVISOR_MEMORY_DB_PATH: explicitOverride,
    });

    expect(childEnv.MEMORY_DB_PATH).toBe(explicitOverride);
  });

  it('009-REQ-004/005: ignores an ambient MEMORY_DB_PATH that was not set via the dedicated override var', () => {
    configureTempLauncher();
    const memoryDbPath = launcher.advisorDbPath();
    // MEMORY_DB_PATH is a generic name any other service may already export —
    // a legacy shell/script exporting it must not silently reopen the
    // cross-server DB-path leak the advisor default protects against.
    const ambientMemoryDbPath = '/tmp/some-other-service/context-index.sqlite';

    const childEnv = launcher.createChildEnv({ PATH: '/bin', MEMORY_DB_PATH: ambientMemoryDbPath });

    expect(childEnv.MEMORY_DB_PATH).toBe(memoryDbPath);
    expect(childEnv.MEMORY_DB_PATH).not.toBe(ambientMemoryDbPath);
  });

  it('009-REQ-004: the dedicated override wins even when a hostile ambient MEMORY_DB_PATH is also present', () => {
    configureTempLauncher();
    const explicitOverride = '/tmp/some-other-test-or-external-db/custom.sqlite';
    const ambientMemoryDbPath = '/tmp/some-other-service/context-index.sqlite';

    const childEnv = launcher.createChildEnv({
      PATH: '/bin',
      MEMORY_DB_PATH: ambientMemoryDbPath,
      SYSTEM_SKILL_ADVISOR_MEMORY_DB_PATH: explicitOverride,
    });

    expect(childEnv.MEMORY_DB_PATH).toBe(explicitOverride);
  });

  it('points the child at the model server socket while the daemon socket stays in its database scope', () => {
    configureTempLauncher();
    const memoryDbPath = launcher.advisorDbPath();
    // Only the shared default socket directory is database-scoped. A private
    // directory is left as-is, so this root is the one that splits the two paths.
    const socketRoot = '/tmp/system-skill-advisor';
    const sourceEnv = {
      PATH: '/bin',
      SPECKIT_IPC_SOCKET_DIR: socketRoot,
    };
    const childEnv = launcher.createChildEnv(sourceEnv);

    expect(childEnv.HF_EMBED_SERVER_URL).toBe(join(socketRoot, 'hf-embed.sock'));
    expect(childEnv.HF_EMBED_SERVER_URL).toBe(expectedModelServerUrl(sourceEnv));
    expect(childEnv.SPECKIT_IPC_SOCKET_DIR).toBe(
      ipcBridge.resolveIpcSocketDir('system-skill-advisor', {
        dbDir: dirname(memoryDbPath),
        env: sourceEnv,
      }),
    );
    expect(childEnv.SPECKIT_IPC_SOCKET_DIR.startsWith(`${socketRoot}/`)).toBe(true);
    expect(dirname(childEnv.HF_EMBED_SERVER_URL)).not.toBe(childEnv.SPECKIT_IPC_SOCKET_DIR);
  });

  it('forwards an explicit model server address to the child unchanged', () => {
    configureTempLauncher();
    // The resolver rewrites http to tcp. An unchanged forward keeps the parent string.
    const explicit = 'http://127.0.0.1:9';
    const childEnv = launcher.createChildEnv({
      PATH: '/bin',
      HF_EMBED_SERVER_URL: explicit,
      SPECKIT_IPC_SOCKET_DIR: '/tmp/system-skill-advisor',
    });

    expect(childEnv.HF_EMBED_SERVER_URL).toBe(explicit);
  });
});

function sourceText(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

function findDeadPid(): number {
  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const pid = Math.floor(Math.random() * 1_000_000) + 100_000;
    try {
      process.kill(pid, 0);
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code === 'ESRCH') {
        return pid;
      }
    }
  }
  throw new Error('unable to find an unused pid for stale lease coverage');
}

function advisorStatus(freshness: AdvisorStatusOutput['freshness'], generation: number): AdvisorStatusOutput {
  const checkedAt = new Date().toISOString();
  return {
    freshness,
    generation,
    trustState: {
      state: freshness,
      reason: freshness === 'live' ? null : 'runtime-test',
      generation,
      checkedAt,
      lastLiveAt: freshness === 'live' ? checkedAt : null,
    },
    lastGenerationBump: null,
    lastScanAt: null,
    skillCount: 0,
    laneWeights: {
      explicit_author: 0.42,
      lexical: 0.28,
      graph_causal: 0.13,
      derived_generated: 0.12,
    },
  };
}

describe('lease-held single-writer enforcement', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    closeDb();
    delete process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  it('isLeaseHeld returns held: true when lease is acquired by current process', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'lease-test-'));
    tempDirs.push(tempDir);

    const lease = acquireSkillGraphLease({ workspaceRoot: tempDir });
    const result = isLeaseHeld(tempDir);

    expect(result.held).toBe(true);
    expect(result.ownerPid).toBe(process.pid);
    expect(result.staleReclaimable).toBe(false);

    lease.close();
  });

  it('isLeaseHeld returns staleReclaimable: true for a dead-pid lease', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'lease-test-'));
    tempDirs.push(tempDir);
    const leaseDbPath = join(tempDir, 'lease.sqlite');
    const deadPid = findDeadPid();
    const timestamp = Date.now() - 60_000;
    const leaseDb = openLeaseDatabase(tempDir, leaseDbPath);

    try {
      leaseDb.prepare(`
        INSERT INTO skill_graph_daemon_lease (workspace_key, owner_id, pid, acquired_at, heartbeat_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(realpathSync.native(dirname(leaseDbPath)), 'dead-owner', deadPid, timestamp, timestamp);
    } finally {
      leaseDb.close();
    }

    const result = isLeaseHeld(tempDir, { leaseDbPath });

    expect(result.held).toBe(false);
    expect(result.ownerPid).toBe(deadPid);
    expect(result.staleReclaimable).toBe(true);
  });

  it('isLeaseHeld keys ownership by resolved DB directory override', () => {
    const firstWorkspace = mkdtempSync(join(tmpdir(), 'lease-workspace-a-'));
    const secondWorkspace = mkdtempSync(join(tmpdir(), 'lease-workspace-b-'));
    const sharedDbDir = mkdtempSync(join(tmpdir(), 'lease-shared-db-'));
    tempDirs.push(firstWorkspace, secondWorkspace, sharedDbDir);
    process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = sharedDbDir;

    const lease = acquireSkillGraphLease({ workspaceRoot: firstWorkspace });
    const result = isLeaseHeld(secondWorkspace);

    expect(result.held).toBe(true);
    expect(result.ownerPid).toBe(process.pid);
    expect(result.staleReclaimable).toBe(false);

    lease.close();
  });

  it('isLeaseHeld returns held: false when no lease exists', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'lease-test-'));
    tempDirs.push(tempDir);

    const result = isLeaseHeld(tempDir);

    expect(result.held).toBe(false);
    expect(result.ownerPid).toBe(null);
    expect(result.staleReclaimable).toBe(false);
  });

  it('WAL pragma is set on every fresh DB open', () => {
    const tempDbDir = mkdtempSync(join(tmpdir(), 'skill-graph-db-test-'));
    tempDirs.push(tempDbDir);
    process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = tempDbDir;

    const db = initDb(tempDbDir);
    const journalMode = db.pragma('journal_mode', { simple: true }) as string;
    const busyTimeout = db.pragma('busy_timeout', { simple: true }) as number;

    expect(journalMode).toBe('wal');
    expect(busyTimeout).toBe(5000);
  });

  it('005-REQ-009 runtime: advisor_rebuild opens DB with WAL and busy_timeout pragmas', () => {
    const workspaceRoot = mkdtempSync(join(tmpdir(), 'skill-graph-runtime-open-'));
    const tempDbDir = mkdtempSync(join(tmpdir(), 'skill-graph-db-test-'));
    tempDirs.push(workspaceRoot, tempDbDir);
    mkdirSync(join(workspaceRoot, '.skilled', 'skills'), { recursive: true });
    process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = tempDbDir;
    let statusCalls = 0;

    rebuildAdvisorIndex({ workspaceRoot, force: true }, {
      readStatus: () => {
        statusCalls += 1;
        return advisorStatus(statusCalls > 1 ? 'live' : 'stale', statusCalls);
      },
      publishGeneration: () => undefined,
      sourceSignature: () => 'runtime-test-signature',
    });

    const db = getDb();
    const resolvedDir = resolveSkillGraphDbDir();
    const journalMode = db.pragma('journal_mode', { simple: true }) as string;
    const busyTimeout = db.pragma('busy_timeout', { simple: true }) as number;

    expect(resolvedDir).toBe(tempDbDir);
    expect(journalMode).toBe('wal');
    expect(busyTimeout).toBe(5000);
  });

  it('005-REQ-009 static: watcher refresh path uses the shared DB opener', () => {
    const dbSource = sourceText('../lib/skill-graph/skill-graph-db.ts');
    const serverSource = sourceText('../advisor-server.ts');
    const watcherSource = sourceText('../lib/daemon/watcher.ts');

    expect(dbSource).toMatch(/export function getDb\(\): Database\.Database \{\s*if \(!db\) initDb\(resolveSkillGraphDbDir\(\)\)/);
    expect(watcherSource).toMatch(/const defaultReindex = async \(\): Promise<ReindexResult> => indexSkillMetadata\(skillsRoot\);/);

    const initDbIndex = serverSource.indexOf('initSkillGraphDb(');
    const heartbeatIndex = serverSource.indexOf('startHeartbeat(');
    const ipcServerIndex = serverSource.indexOf('startIpcSocketServer(');
    expect(initDbIndex).toBeGreaterThanOrEqual(0);
    expect(heartbeatIndex).toBeGreaterThan(initDbIndex);
    expect(ipcServerIndex).toBeGreaterThan(heartbeatIndex);
  });
});
