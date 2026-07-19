// ───────────────────────────────────────────────────────────────
// MODULE: mk-code-index Launcher Lifecycle Tests
// ───────────────────────────────────────────────────────────────
// Regression coverage for the code-index launcher daemon-lifecycle fixes:
//   - bootstrap-lock reclaim must fire as soon as the recorded holder is provably
//     dead (PID stamp), not only after the 5-min mtime TTL — otherwise a holder
//     killed <5min ago wedges every requireLock respawn past the 120s deadline.
//   - owner-lease stale reclaim must be a single O_EXCL CAS so two racers cannot
//     both acquire (and the loser cannot delete the winner's lease).

import { createRequire } from 'node:module';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', '..');

const require = createRequire(import.meta.url);
const launcher = require('../../../../bin/mk-code-index-launcher.cjs') as {
  acquireBootstrapLock: (options?: { requireLock?: boolean; staleMs?: number; timeoutMs?: number; retrySleepMs?: number }) => Promise<boolean>;
  removeStaleBootstrapLock: (staleMs?: number) => boolean;
  readBootstrapLockOwnerPid: () => number | null;
  acquireOwnerLeaseFile: () => { acquired: boolean; lease?: { ownerPid: number }; classification?: string; reclaimed?: unknown };
  clearOwnerLeaseFile: () => void;
  ownerLeasePath: () => string;
  readOwnerLeaseFile: (filePath?: string) => { ownerPid: number; executablePath?: string } | null;
  configureLauncherPathsForTesting: (paths: { dbDir: string; lockDir: string; stateFile: string }) => void;
};

const tempDirs: string[] = [];
// The code-index owner-lease path is resolved through resolvedDbDir(), which
// enforces SPECKIT_CODE_GRAPH_DB_DIR to live within the workspace root. Point the
// override at a workspace-relative temp dir so ownerLeasePath() resolves.
const workspaceTmpRoot = resolve(repoRoot, '.opencode', 'skills', 'system-code-graph', 'mcp-server', 'database', '.vitest-lifecycle');
const originalDbDirEnv = process.env.SPECKIT_CODE_GRAPH_DB_DIR;

function findDeadPid(): number {
  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const pid = Math.floor(Math.random() * 1_000_000) + 100_000;
    try {
      process.kill(pid, 0);
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code === 'ESRCH') return pid;
    }
  }
  throw new Error('unable to find an unused pid');
}

beforeEach(() => {
  mkdirSync(workspaceTmpRoot, { recursive: true });
});

afterEach(() => {
  try { launcher.clearOwnerLeaseFile(); } catch { /* ignore */ }
  if (originalDbDirEnv === undefined) delete process.env.SPECKIT_CODE_GRAPH_DB_DIR;
  else process.env.SPECKIT_CODE_GRAPH_DB_DIR = originalDbDirEnv;
  rmSync(workspaceTmpRoot, { recursive: true, force: true });
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

function configureTempLauncher(): { dbDir: string; lockDir: string } {
  const root = mkdtempSync(join(tmpdir(), 'mk-code-index-lifecycle-'));
  tempDirs.push(root);
  const dbDir = join(root, 'database');
  mkdirSync(dbDir, { recursive: true });
  const lockDir = join(dbDir, '.mk-code-index-launcher.lockdir');
  launcher.configureLauncherPathsForTesting({ dbDir, lockDir, stateFile: join(dbDir, '.mk-code-index-launcher.json') });
  return { dbDir, lockDir };
}

describe('mk-code-index launcher bootstrap lock', () => {
  it('stamps the holder pid inside the lock dir on acquire', async () => {
    const { lockDir } = configureTempLauncher();
    await expect(launcher.acquireBootstrapLock({ requireLock: true, timeoutMs: 200, retrySleepMs: 5 })).resolves.toBe(true);
    const stamp = readFileSync(join(lockDir, 'owner.pid'), 'utf8').trim();
    expect(stamp).toBe(String(process.pid));
    expect(launcher.readBootstrapLockOwnerPid()).toBe(process.pid);
  });

  it('reclaims a fresh lock dir as soon as its stamped holder is provably dead', async () => {
    const { lockDir } = configureTempLauncher();
    // Hold the lock, then overwrite the stamp with a dead pid while keeping the mtime fresh.
    await launcher.acquireBootstrapLock({ requireLock: true, timeoutMs: 200, retrySleepMs: 5 });
    writeFileSync(join(lockDir, 'owner.pid'), String(findDeadPid()));
    // A huge staleMs means only the dead-holder path (not the mtime TTL) can reclaim it.
    expect(launcher.removeStaleBootstrapLock(5 * 60 * 1000)).toBe(true);
  });

  it('does NOT reclaim a fresh lock dir whose stamped holder is alive', async () => {
    configureTempLauncher();
    await launcher.acquireBootstrapLock({ requireLock: true, timeoutMs: 200, retrySleepMs: 5 });
    // Current process is the live holder; with a huge staleMs neither path may reclaim.
    expect(launcher.removeStaleBootstrapLock(5 * 60 * 1000)).toBe(false);
  });
});

describe('mk-code-index launcher owner-lease CAS reclaim', () => {
  beforeEach(() => {
    process.env.SPECKIT_CODE_GRAPH_DB_DIR = workspaceTmpRoot;
  });

  it('acquires a fresh owner lease and records this pid as owner', () => {
    launcher.clearOwnerLeaseFile();
    const result = launcher.acquireOwnerLeaseFile();
    expect(result.acquired).toBe(true);
    expect(result.lease?.ownerPid).toBe(process.pid);
  });

  it('reclaims a dead orphan owner lease via exclusive create (single CAS winner)', () => {
    launcher.clearOwnerLeaseFile();
    const first = launcher.acquireOwnerLeaseFile();
    expect(first.acquired).toBe(true);
    const realLease = launcher.readOwnerLeaseFile();
    expect(realLease).toBeTruthy();
    // Rewrite as a dead+orphan owner (ppid 1) keeping the full schema, then drop our
    // in-memory ownership so the next acquire behaves like a fresh racer.
    writeFileSync(launcher.ownerLeasePath(), `${JSON.stringify({ ...realLease, ownerPid: findDeadPid(), ppid: 1 }, null, 2)}\n`);
    launcher.clearOwnerLeaseFile();

    const reclaim = launcher.acquireOwnerLeaseFile();
    expect(reclaim.acquired).toBe(true);
    expect(launcher.readOwnerLeaseFile()?.ownerPid).toBe(process.pid);
  });

  it('source: launcherMain reaps the reclaimed orphan daemon before spawning a successor', () => {
    // The alive-but-stale reclaim path must reap the orphan recorded by the reclaimed
    // owner lease before launchServer(), or it would run two writers against the SQLite
    // DB. This wiring runs inside launcherMain (which spawns + exits), so assert the
    // structural fix is present.
    const src = readFileSync(resolve(repoRoot, '.opencode/bin/mk-code-index-launcher.cjs'), 'utf8');
    expect(src).toContain('reclaimedOrphanPid');
    expect(src).toContain('reapOwnerBeforeRespawn(reclaimedOrphanPid)');
    // Within launcherMain, the orphan reap must precede the launchServer() call.
    const mainBody = src.slice(src.indexOf('async function launcherMain'));
    const reapIdx = mainBody.indexOf('reapOwnerBeforeRespawn(reclaimedOrphanPid)');
    const launchIdx = mainBody.indexOf('launchServer();');
    expect(reapIdx).toBeGreaterThan(-1);
    expect(launchIdx).toBeGreaterThan(reapIdx);
  });

  it('refuses to reclaim a live owner lease', () => {
    // Acquire once to mint a schema-valid live-owner lease (ownerPid = this live pid,
    // ppid = real parent so classifyOwnerLease does not see a ppid-1 orphan), then drop
    // our in-memory ownership (ownerLeasePid -> null) WITHOUT unlinking. A second
    // acquire must see the still-live owner and refuse.
    launcher.clearOwnerLeaseFile();
    const minted = launcher.acquireOwnerLeaseFile();
    expect(minted.acquired).toBe(true);
    const liveLease = launcher.readOwnerLeaseFile();
    expect(liveLease).toBeTruthy();
    // Rewrite identical contents to reset mtime/ensure presence; ownerLeasePid is
    // cleared next so a redundant clear is a no-op and the file survives.
    writeFileSync(launcher.ownerLeasePath(), `${JSON.stringify(liveLease, null, 2)}\n`);
    launcher.clearOwnerLeaseFile(); // ownerLeasePid still set -> this DOES unlink; re-write below
    writeFileSync(launcher.ownerLeasePath(), `${JSON.stringify(liveLease, null, 2)}\n`);

    const result = launcher.acquireOwnerLeaseFile();
    expect(result.acquired).toBe(false);
    expect(result.classification).toBe('live-owner');
  });
});
