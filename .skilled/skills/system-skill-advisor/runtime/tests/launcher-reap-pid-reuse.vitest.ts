// ───────────────────────────────────────────────────────────────
// MODULE: system-skill-advisor Launcher Reap PID-Reuse + Owner-Lease CAS Tests
// ───────────────────────────────────────────────────────────────
// Regression coverage for:
//   - reapOwnerBeforeRespawn must NOT SIGKILL a recorded pid that the OS recycled
//     to an unrelated process: when the live pid's executable basename provably
//     differs from the lease's recorded executablePath, treat it as already-dead.
//   - owner-lease stale reclaim must be a single exclusive CAS (no double-acquire).
//   - a claim is published complete, and a loser never names itself the holder.

import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
// The launcher's own fs module object, so a spy sees the launcher's calls.
const launcherFs = require('fs') as typeof import('node:fs');
const launcher = require('../../../../bin/system-skill-advisor-launcher.cjs') as {
  reapOwnerBeforeRespawn: (ownerPid: number, expectedExecutablePath?: string | null) => Promise<{ allowed: boolean; reason: string }>;
  readProcessExecutableBasename: (pid: number) => string | null;
  acquireOwnerLeaseFile: () => {
    acquired: boolean;
    lease?: { ownerPid: number };
    holder?: { ownerPid: number };
    classification?: string;
  };
  clearOwnerLeaseFile: () => void;
  ownerLeasePath: () => string;
  readOwnerLeaseFile: (filePath?: string) => Record<string, unknown> | null;
  configureLauncherPathsForTesting: (paths: { runtimeDir?: string; dbDir: string; lockDir: string; stateFile: string }) => void;
};

const tempDirs: string[] = [];

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

function configureTempLauncher(): void {
  const root = mkdtempSync(join(tmpdir(), 'system-skill-advisor-reap-'));
  tempDirs.push(root);
  const runtimeDir = join(root, 'runtime');
  const dbDir = join(runtimeDir, 'database');
  mkdirSync(dbDir, { recursive: true });
  launcher.configureLauncherPathsForTesting({
    runtimeDir,
    dbDir,
    lockDir: join(dbDir, '.system-skill-advisor-launcher.lockdir'),
    stateFile: join(dbDir, '.system-skill-advisor-launcher.json'),
  });
}

afterEach(() => {
  try { launcher.clearOwnerLeaseFile(); } catch { /* ignore */ }
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('system-skill-advisor reapOwnerBeforeRespawn PID-reuse guard', () => {
  it('reads the executable basename of a live process (this test runner is node)', () => {
    const basename = launcher.readProcessExecutableBasename(process.pid);
    expect(basename).toBeTruthy();
    // The vitest runner executes under node; comm should reflect that.
    expect(String(basename).toLowerCase()).toContain('node');
  });

  it('skips the reap (treats as already-dead) when the live pid executable mismatches the recorded one', async () => {
    // This live pid runs `node`; claim the lease recorded a totally different
    // executable, so the PID-reuse guard must refuse to kill this innocent process.
    const result = await launcher.reapOwnerBeforeRespawn(process.pid, '/usr/bin/some-unrelated-daemon');
    expect(result.allowed).toBe(true);
    expect(result.reason).toBe('owner-pid-reused');
  });

  it('returns already-dead for a dead pid regardless of expected executable', async () => {
    const result = await launcher.reapOwnerBeforeRespawn(findDeadPid(), '/opt/node');
    expect(result.allowed).toBe(true);
    expect(result.reason).toBe('owner-already-dead');
  });
});

describe('system-skill-advisor owner-lease CAS reclaim', () => {
  it('acquires a fresh owner lease and records this pid as owner', () => {
    configureTempLauncher();
    launcher.clearOwnerLeaseFile();
    const result = launcher.acquireOwnerLeaseFile();
    expect(result.acquired).toBe(true);
    expect(result.lease?.ownerPid).toBe(process.pid);
  });

  it('reclaims a dead orphan owner lease via exclusive create', () => {
    configureTempLauncher();
    launcher.clearOwnerLeaseFile();
    const first = launcher.acquireOwnerLeaseFile();
    expect(first.acquired).toBe(true);
    const realLease = launcher.readOwnerLeaseFile();
    writeFileSync(launcher.ownerLeasePath(), `${JSON.stringify({ ...realLease, ownerPid: findDeadPid(), ppid: 1 }, null, 2)}\n`);
    launcher.clearOwnerLeaseFile();
    const reclaim = launcher.acquireOwnerLeaseFile();
    expect(reclaim.acquired).toBe(true);
    expect(launcher.readOwnerLeaseFile()?.ownerPid).toBe(process.pid);
  });

  it('keeps a live owner whose parent is pid 1 and whose heartbeat is fresh', () => {
    const spawned = spawnSync('/bin/sh', ['-c', 'sleep 120 >/dev/null 2>&1 & echo $!'], { encoding: 'utf8' });
    const pid = Number.parseInt(String(spawned.stdout).trim(), 10);
    try {
      configureTempLauncher();
      launcher.clearOwnerLeaseFile();
      const first = launcher.acquireOwnerLeaseFile();
      expect(first.acquired).toBe(true);
      const realLease = launcher.readOwnerLeaseFile();
      writeFileSync(launcher.ownerLeasePath(), `${JSON.stringify({
        ...realLease,
        ownerPid: pid,
        ppid: process.pid,
        lastHeartbeatIso: new Date().toISOString(),
        ttlMs: 60000,
      }, null, 2)}\n`);
      const before = readFileSync(launcher.ownerLeasePath());
      const reclaim = launcher.acquireOwnerLeaseFile();
      expect(reclaim.acquired).toBe(false);
      expect(reclaim.classification).toBe('live-owner');
      expect(readFileSync(launcher.ownerLeasePath())).toEqual(before);
    } finally {
      try {
        process.kill(pid, 'SIGKILL');
      } catch {
        // The sleeper may already have exited.
      }
    }
  });

  it('claims an owner lease file that names no owner instead of taking itself for the holder', () => {
    configureTempLauncher();
    launcher.clearOwnerLeaseFile();
    // An empty file is what a peer's claim left in place while it was still being
    // written, and what stays behind when that writer dies mid-write.
    writeFileSync(launcher.ownerLeasePath(), '');
    const result = launcher.acquireOwnerLeaseFile();
    expect(result.holder?.ownerPid).not.toBe(process.pid);
    expect(result.acquired).toBe(true);
    expect(launcher.readOwnerLeaseFile()?.ownerPid).toBe(process.pid);
  });

  it('keeps a live lease a peer published after this launcher read the stale one', () => {
    configureTempLauncher();
    launcher.clearOwnerLeaseFile();
    const first = launcher.acquireOwnerLeaseFile();
    expect(first.acquired).toBe(true);
    const realLease = launcher.readOwnerLeaseFile();
    launcher.clearOwnerLeaseFile();
    const ownerPath = launcher.ownerLeasePath();
    writeFileSync(ownerPath, `${JSON.stringify({ ...realLease, ownerPid: findDeadPid(), ppid: 1 }, null, 2)}\n`);
    // The parent of this test runner is alive, so its lease is a live owner.
    const peerLease = `${JSON.stringify({
      ...realLease,
      ownerPid: process.ppid,
      ppid: 1,
      lastHeartbeatIso: new Date().toISOString(),
      ttlMs: 60000,
    }, null, 2)}\n`;
    const realReadFileSync = launcherFs.readFileSync;
    let injected = false;
    // The peer publishes right after this launcher's first read of the stale lease.
    const spy = vi.spyOn(launcherFs, 'readFileSync').mockImplementation(((...args: Parameters<typeof launcherFs.readFileSync>) => {
      const result = realReadFileSync(...args);
      if (!injected && args[0] === ownerPath) {
        injected = true;
        writeFileSync(ownerPath, peerLease);
      }
      return result;
    }) as typeof launcherFs.readFileSync);
    let result: ReturnType<typeof launcher.acquireOwnerLeaseFile>;
    try {
      result = launcher.acquireOwnerLeaseFile();
    } finally {
      spy.mockRestore();
    }
    expect(injected).toBe(true);
    expect(result.acquired).toBe(false);
    expect(result.holder?.ownerPid).toBe(process.ppid);
    expect(readFileSync(ownerPath, 'utf8')).toBe(peerLease);
  });

  it('never exposes a half-written owner lease while a claim is being written', () => {
    configureTempLauncher();
    launcher.clearOwnerLeaseFile();
    const ownerPath = launcher.ownerLeasePath();
    const observed: string[] = [];
    const realWriteFileSync = launcherFs.writeFileSync;
    const spy = vi.spyOn(launcherFs, 'writeFileSync').mockImplementation(((...args: Parameters<typeof launcherFs.writeFileSync>) => {
      if (existsSync(ownerPath)) {
        observed.push(launcher.readOwnerLeaseFile(ownerPath) ? 'complete' : 'unreadable');
      } else {
        observed.push('absent');
      }
      return realWriteFileSync(...args);
    }) as typeof launcherFs.writeFileSync);
    try {
      expect(launcher.acquireOwnerLeaseFile().acquired).toBe(true);
    } finally {
      spy.mockRestore();
    }
    expect(observed.length).toBeGreaterThan(0);
    expect(observed).not.toContain('unreadable');
    expect(launcher.readOwnerLeaseFile()?.ownerPid).toBe(process.pid);
  });
});

describe('system-skill-advisor heartbeat self-shutdown escalation', () => {
  it('source: the heartbeat-failure shutdown escalates SIGTERM -> wait -> SIGKILL before exit', async () => {
    // The escalation runs on process.exit(128) so it cannot be unit-driven in-process;
    // assert the structural fix is present (the path previously sent SIGTERM only).
    const { readFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const { dirname, resolve } = await import('node:path');
    const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', '..');
    const src = readFileSync(resolve(repoRoot, '.skilled/bin/system-skill-advisor-launcher.cjs'), 'utf8');
    const heartbeat = src.slice(src.indexOf('startOwnerLeaseHeartbeat'), src.indexOf('function ownsOwnerLeaseFile'));
    expect(heartbeat).toContain("childProcess.kill('SIGTERM')");
    expect(heartbeat).toContain('waitForChildExit(childProcess, 5000)');
    expect(heartbeat).toContain("childProcess.kill('SIGKILL')");
  });
});
