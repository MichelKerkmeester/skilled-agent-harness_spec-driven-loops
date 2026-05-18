import { spawn, type ChildProcess, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

// These paths are test fixtures coupled to the production launcher layout.
// If a launcher moves, update the fixture path and copied production file together.

interface LauncherRun {
  child: ChildProcessWithoutNullStreams;
  stdout: string;
  stderr: string;
}

interface Workspace {
  root: string;
  launcherPath: string;
  dbDir: string;
  leaseFilePath: string;
}

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../..');
const launcherRelativePath = '.opencode/bin/mk-skill-advisor-launcher.cjs';

function leaseModuleSource(): string {
  return `
const fs = require('fs');
const path = require('path');

function leaseFile(workspaceRoot) {
  const dir = process.env.MK_SKILL_ADVISOR_DB_DIR
    ? path.resolve(process.env.MK_SKILL_ADVISOR_DB_DIR)
    : path.join(workspaceRoot, '.opencode', 'skills', 'system-skill-advisor', 'mcp_server', 'database');
  return path.join(dir, '.mk-skill-advisor-launcher.json');
}

function readLease(workspaceRoot) {
  try {
    const parsed = JSON.parse(fs.readFileSync(leaseFile(workspaceRoot), 'utf8'));
    if (typeof parsed.pid === 'number') return parsed;
  } catch {
  }
  return null;
}

exports.isLeaseHeld = function isLeaseHeld(workspaceRoot) {
  const lease = readLease(workspaceRoot);
  if (!lease) return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null };
  const startedAt = lease.startedAt ?? new Date(0).toISOString();
  try {
    process.kill(lease.pid, 0);
    return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt };
  } catch (error) {
    if (error.code === 'ESRCH') return { held: false, ownerPid: lease.pid, staleReclaimable: true, startedAt };
    if (error.code === 'EPERM') return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt };
    throw error;
  }
};
`;
}

function advisorServerSource(): string {
  return `
const fs = require('fs');
const path = require('path');

const dbDir = process.env.MK_SKILL_ADVISOR_DB_DIR
  ? path.resolve(process.env.MK_SKILL_ADVISOR_DB_DIR)
  : path.join(process.cwd(), '.opencode', 'skills', 'system-skill-advisor', 'mcp_server', 'database');
const leasePath = path.join(dbDir, '.mk-skill-advisor-launcher.json');

function readLease() {
  try {
    return JSON.parse(fs.readFileSync(leasePath, 'utf8'));
  } catch {
    return null;
  }
}

function writeLease() {
  fs.mkdirSync(dbDir, { recursive: true });
  fs.writeFileSync(leasePath, JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }));
}

function clearLease() {
  const lease = readLease();
  if (lease && lease.pid === process.pid) {
    fs.unlinkSync(leasePath);
  }
}

writeLease();
process.on('SIGTERM', () => { clearLease(); process.exit(0); });
process.on('SIGINT', () => { clearLease(); process.exit(0); });
setInterval(() => {}, 1000);
`;
}

async function waitFor(predicate: () => boolean, timeoutMs: number, label: string): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() <= deadline) {
    if (predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  throw new Error(`Timed out waiting for ${label}`);
}

async function waitForExit(
  child: ChildProcess,
  timeoutMs: number,
): Promise<{ code: number | null; signal: NodeJS.Signals | null }> {
  if (child.exitCode !== null || child.signalCode !== null) {
    return { code: child.exitCode, signal: child.signalCode };
  }
  return await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      child.off('exit', onExit);
      reject(new Error(`Timed out waiting for pid ${child.pid} to exit`));
    }, timeoutMs);
    const onExit = (code: number | null, signal: NodeJS.Signals | null) => {
      clearTimeout(timeout);
      resolve({ code, signal });
    };
    child.once('exit', onExit);
  });
}

async function waitForStdoutClose(run: LauncherRun): Promise<void> {
  if (run.child.stdout.closed) return;
  await new Promise<void>((resolve) => {
    run.child.stdout.once('close', () => resolve());
  });
}

async function createDeadPid(): Promise<number> {
  const child = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000);'], {
    stdio: 'ignore',
  });
  await new Promise<void>((resolve, reject) => {
    child.once('spawn', () => resolve());
    child.once('error', reject);
  });
  if (typeof child.pid !== 'number') {
    throw new Error('dead-pid child did not get a pid');
  }
  const pid = child.pid;
  child.kill('SIGTERM');
  await waitForExit(child, 1000);
  return pid;
}

async function createLivePid(): Promise<ChildProcess> {
  const child = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000);'], {
    stdio: 'ignore',
  });
  await new Promise<void>((resolve, reject) => {
    child.once('spawn', () => resolve());
    child.once('error', reject);
  });
  if (typeof child.pid !== 'number') {
    throw new Error('live-pid child did not get a pid');
  }
  return child;
}

function readLeasePid(leaseFilePath: string): number | null {
  try {
    const parsed = JSON.parse(readFileSync(leaseFilePath, 'utf8')) as { pid?: unknown };
    return typeof parsed.pid === 'number' ? parsed.pid : null;
  } catch {
    return null;
  }
}

describe('mk-skill-advisor launcher lease', () => {
  const tempDirs: string[] = [];
  const launcherRuns: LauncherRun[] = [];

  function createWorkspace(): Workspace {
    const root = mkdtempSync(join(tmpdir(), 'mk-skill-advisor-lease-'));
    tempDirs.push(root);

    const launcherPath = join(root, launcherRelativePath);
    mkdirSync(dirname(launcherPath), { recursive: true });
    copyFileSync(join(repoRoot, launcherRelativePath), launcherPath);

    const advisorServer = join(root, '.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/mcp_server/advisor-server.js');
    const leaseModule = join(root, '.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/mcp_server/lib/daemon/lease.js');
    mkdirSync(dirname(advisorServer), { recursive: true });
    mkdirSync(dirname(leaseModule), { recursive: true });
    writeFileSync(advisorServer, advisorServerSource(), 'utf8');
    writeFileSync(leaseModule, leaseModuleSource(), 'utf8');

    const dbDir = join(root, 'skill-advisor-db');
    return {
      root,
      launcherPath,
      dbDir,
      leaseFilePath: join(dbDir, '.mk-skill-advisor-launcher.json'),
    };
  }

  function spawnLauncher(workspace: Workspace, env: NodeJS.ProcessEnv = {}): LauncherRun {
    const baseEnv = { ...process.env };
    delete baseEnv.MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER;
    delete baseEnv.MK_CODE_INDEX_STRICT_SINGLE_WRITER;
    delete baseEnv.MK_SPEC_MEMORY_STRICT_SINGLE_WRITER;

    const run: LauncherRun = {
      child: spawn(process.execPath, [workspace.launcherPath], {
        cwd: workspace.root,
        env: { ...baseEnv, MK_SKILL_ADVISOR_DB_DIR: workspace.dbDir, ...env },
        stdio: ['ignore', 'pipe', 'pipe'],
      }),
      stdout: '',
      stderr: '',
    };
    run.child.stdout.setEncoding('utf8');
    run.child.stderr.setEncoding('utf8');
    run.child.stdout.on('data', (chunk) => {
      run.stdout += chunk;
    });
    run.child.stderr.on('data', (chunk) => {
      run.stderr += chunk;
    });
    launcherRuns.push(run);
    return run;
  }

  async function terminate(run: LauncherRun): Promise<void> {
    if (run.child.exitCode !== null || run.child.signalCode !== null) return;
    run.child.kill('SIGTERM');
    try {
      await waitForExit(run.child, 1000);
    } catch {
      run.child.kill('SIGKILL');
      try {
        await waitForExit(run.child, 1000);
      } catch {
        // Best-effort teardown; the temp dir cleanup below is authoritative.
      }
    }
  }

  async function waitForLeaseOwner(workspace: Workspace): Promise<number> {
    await waitFor(() => readLeasePid(workspace.leaseFilePath) !== null, 2000, 'lease owner pid');
    const pid = readLeasePid(workspace.leaseFilePath);
    if (pid === null) throw new Error('lease owner pid disappeared');
    return pid;
  }

  afterEach(async () => {
    while (launcherRuns.length > 0) {
      const run = launcherRuns.pop();
      if (run) await terminate(run);
    }
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  it('exits with LEASE_HELD_BY when a live owner exists', async () => {
    const workspace = createWorkspace();
    spawnLauncher(workspace);
    const ownerPid = await waitForLeaseOwner(workspace);

    const second = spawnLauncher(workspace);
    await waitForStdoutClose(second);
    const exit = await waitForExit(second.child, 8000);

    expect(exit.code).toBe(0);
    expect(second.stdout).toContain(`LEASE_HELD_BY:${ownerPid}`);
    expect(second.stdout).toMatch(new RegExp(`^LEASE_HELD_BY:${ownerPid} startedAt=\\d{4}-\\d{2}-\\d{2}T`, 'm'));
  });

  it('reports the lease startedAt value for a live owner', async () => {
    const workspace = createWorkspace();
    const holder = await createLivePid();
    const startedAt = '2026-05-18T00:00:00.000Z';

    try {
      mkdirSync(dirname(workspace.leaseFilePath), { recursive: true });
      writeFileSync(workspace.leaseFilePath, JSON.stringify({ pid: holder.pid, startedAt }));

      const run = spawnLauncher(workspace);
      await waitForStdoutClose(run);
      const exit = await waitForExit(run.child, 8000);

      expect(exit.code).toBe(0);
      expect(run.stdout).toContain(`LEASE_HELD_BY:${holder.pid} startedAt=${startedAt}`);
    } finally {
      holder.kill('SIGTERM');
      try {
        await waitForExit(holder, 1000);
      } catch {
        holder.kill('SIGKILL');
      }
    }
  });

  it('reclaims a dead-pid lease file and logs staleReclaimed', async () => {
    const workspace = createWorkspace();
    const deadPid = await createDeadPid();
    mkdirSync(dirname(workspace.leaseFilePath), { recursive: true });
    writeFileSync(workspace.leaseFilePath, JSON.stringify({ pid: deadPid, startedAt: new Date().toISOString() }));

    const run = spawnLauncher(workspace);
    await waitFor(() => /^.*staleReclaimed: true\b/m.test(run.stderr), 2000, 'stale reclaim log');
    expect(run.stderr).toMatch(/^.*staleReclaimed: true\b/m);
    // Wait for the launcher's stub server to overwrite the pre-written deadPid lease.
    await waitFor(() => {
      const pid = readLeasePid(workspace.leaseFilePath);
      return pid !== null && pid !== deadPid;
    }, 2000, 'lease owner replacement after stale reclaim');
    const ownerPid = readLeasePid(workspace.leaseFilePath);

    expect(ownerPid).not.toBe(deadPid);
    expect(existsSync(workspace.leaseFilePath)).toBe(true);
  });

  it('removes the PID file on clean exit', async () => {
    const workspace = createWorkspace();
    const run = spawnLauncher(workspace);
    await waitForLeaseOwner(workspace);

    run.child.kill('SIGTERM');
    await waitForExit(run.child, 5000);

    expect(existsSync(workspace.leaseFilePath)).toBe(false);
  });

  it('removes the PID file on SIGQUIT', async () => {
    const workspace = createWorkspace();
    const run = spawnLauncher(workspace);
    await waitForLeaseOwner(workspace);

    run.child.kill('SIGQUIT');
    await waitForExit(run.child, 5000);

    expect(existsSync(workspace.leaseFilePath)).toBe(false);
  });

  it('boots a sibling when strict single-writer is disabled', async () => {
    const workspace = createWorkspace();
    spawnLauncher(workspace);
    const firstOwnerPid = await waitForLeaseOwner(workspace);

    const second = spawnLauncher(workspace, {
      MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER: '0',
    });
    await waitFor(() => readLeasePid(workspace.leaseFilePath) !== firstOwnerPid, 2000, 'second lease owner');

    expect(second.child.exitCode).toBeNull();
    expect(second.stderr).toContain('MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER is disabled; skipping lease check');
    expect(existsSync(workspace.leaseFilePath)).toBe(true);
  });
});
