// ───────────────────────────────────────────────────────────────
// MODULE: mk-skill-advisor Launcher Reap PID-Reuse + Owner-Lease CAS Tests
// ───────────────────────────────────────────────────────────────
// Regression coverage for:
//   - reapOwnerBeforeRespawn must NOT SIGKILL a recorded pid that the OS recycled
//     to an unrelated process: when the live pid's executable basename provably
//     differs from the lease's recorded executablePath, treat it as already-dead.
//   - owner-lease stale reclaim must be a single O_EXCL CAS (no double-acquire).

import { createRequire } from 'node:module';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const launcher = require('../../../../bin/mk-skill-advisor-launcher.cjs') as {
  reapOwnerBeforeRespawn: (ownerPid: number, expectedExecutablePath?: string | null) => Promise<{ allowed: boolean; reason: string }>;
  readProcessExecutableBasename: (pid: number) => string | null;
  acquireOwnerLeaseFile: () => { acquired: boolean; lease?: { ownerPid: number }; classification?: string };
  clearOwnerLeaseFile: () => void;
  ownerLeasePath: () => string;
  readOwnerLeaseFile: (filePath?: string) => Record<string, unknown> | null;
  configureLauncherPathsForTesting: (paths: { mcpDir?: string; dbDir: string; lockDir: string; stateFile: string }) => void;
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
  const root = mkdtempSync(join(tmpdir(), 'mk-skill-advisor-reap-'));
  tempDirs.push(root);
  const mcpDir = join(root, 'mcp_server');
  const dbDir = join(mcpDir, 'database');
  mkdirSync(dbDir, { recursive: true });
  launcher.configureLauncherPathsForTesting({
    mcpDir,
    dbDir,
    lockDir: join(dbDir, '.mk-skill-advisor-launcher.lockdir'),
    stateFile: join(dbDir, '.mk-skill-advisor-launcher.json'),
  });
}

afterEach(() => {
  try { launcher.clearOwnerLeaseFile(); } catch { /* ignore */ }
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('mk-skill-advisor reapOwnerBeforeRespawn PID-reuse guard', () => {
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

describe('mk-skill-advisor owner-lease CAS reclaim', () => {
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
});

describe('mk-skill-advisor heartbeat self-shutdown escalation', () => {
  it('source: the heartbeat-failure shutdown escalates SIGTERM -> wait -> SIGKILL before exit', async () => {
    // The escalation runs on process.exit(128) so it cannot be unit-driven in-process;
    // assert the structural fix is present (the path previously sent SIGTERM only).
    const { readFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const { dirname, resolve } = await import('node:path');
    const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', '..');
    const src = readFileSync(resolve(repoRoot, '.opencode/bin/mk-skill-advisor-launcher.cjs'), 'utf8');
    const heartbeat = src.slice(src.indexOf('startOwnerLeaseHeartbeat'), src.indexOf('function ownsOwnerLeaseFile'));
    expect(heartbeat).toContain("childProcess.kill('SIGTERM')");
    expect(heartbeat).toContain('waitForChildExit(childProcess, 5000)');
    expect(heartbeat).toContain("childProcess.kill('SIGKILL')");
  });
});
