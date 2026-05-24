import { spawn, spawnSync, type ChildProcess, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
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

function canonicalizePath(pathValue) {
  const resolvedPath = path.resolve(pathValue);
  try {
    return fs.realpathSync.native(resolvedPath);
  } catch (error) {
    if (error.code === 'ENOENT') return resolvedPath;
    throw error;
  }
}

function leaseFile(workspaceRoot) {
  const dir = process.env.MK_SKILL_ADVISOR_DB_DIR
    ? canonicalizePath(process.env.MK_SKILL_ADVISOR_DB_DIR)
    : path.join(workspaceRoot, '.opencode', 'skills', 'system-skill-advisor', 'mcp_server', 'database');
  return path.join(dir, '.mk-skill-advisor-launcher.json');
}

function legacyLeaseFile(workspaceRoot) {
  return path.join(canonicalizePath(workspaceRoot), '.opencode', 'skills', '.advisor-state', 'skill-graph-daemon-lease.sqlite');
}

function readLease(filePath) {
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (typeof parsed.pid === 'number') return parsed;
  } catch {
  }
  return null;
}

function leaseHeldFromFile(filePath, legacyPath = null) {
  const lease = readLease(filePath);
  if (!lease) return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath };
  const startedAt = lease.startedAt ?? new Date(0).toISOString();
  try {
    process.kill(lease.pid, 0);
    return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath };
  } catch (error) {
    if (error.code === 'ESRCH') return { held: false, ownerPid: lease.pid, staleReclaimable: true, startedAt, legacyPath };
    if (error.code === 'EPERM') return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath };
    throw error;
  }
}

exports.isLeaseHeld = function isLeaseHeld(workspaceRoot) {
  const primary = leaseHeldFromFile(leaseFile(workspaceRoot));
  if (primary.held) return primary;
  const legacyPath = legacyLeaseFile(workspaceRoot);
  const legacy = leaseHeldFromFile(legacyPath, legacyPath);
  if (legacy.held || legacy.staleReclaimable) return legacy;
  return primary;
};
`;
}

function advisorServerSource(options: { ignoreSigterm?: boolean } = {}): string {
  return `
${options.ignoreSigterm ? "process.on('SIGTERM', () => {});" : "process.on('SIGTERM', () => { process.exit(0); });"}
process.on('SIGINT', () => { process.exit(0); });
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

function countLauncherProcesses(launcherPath: string): number | null {
  const result = spawnSync('ps', ['-A', '-o', 'command='], { encoding: 'utf8' });
  if (result.error || result.status !== 0) {
    return null;
  }
  return result.stdout
    .split('\n')
    .filter((line) => line.includes(launcherPath)).length;
}

describe('mk-skill-advisor launcher lease', () => {
  const tempDirs: string[] = [];
  const launcherRuns: LauncherRun[] = [];

  function createWorkspace(options: { ignoreChildSigterm?: boolean } = {}): Workspace {
    const root = mkdtempSync(join(tmpdir(), 'mk-skill-advisor-lease-'));
    tempDirs.push(root);

    const launcherPath = join(root, launcherRelativePath);
    mkdirSync(dirname(launcherPath), { recursive: true });
    copyFileSync(join(repoRoot, launcherRelativePath), launcherPath);

    const advisorServer = join(root, '.opencode/skills/system-skill-advisor/mcp_server/dist/mcp_server/advisor-server.js');
    const leaseModule = join(root, '.opencode/skills/system-skill-advisor/mcp_server/dist/mcp_server/lib/daemon/lease.js');
    mkdirSync(dirname(advisorServer), { recursive: true });
    mkdirSync(dirname(leaseModule), { recursive: true });
    writeFileSync(advisorServer, advisorServerSource({ ignoreSigterm: options.ignoreChildSigterm }), 'utf8');
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
    delete baseEnv.MK_SKILL_ADVISOR_DB_DIR;
    delete baseEnv.SYSTEM_SKILL_ADVISOR_DB_DIR;

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

  // 001-REQ-001: duplicate launcher exits before opening SQLite.
  it('001-REQ-001: spawning launcher #2 while #1 is alive exits 0 with LEASE_HELD_BY', async () => {
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

  // 007-REQ-001: skill-advisor must reject concurrent launcher spawns; closes the 3-zombie observation from 2026-05-18T16:47Z.
  it('007-REQ-001: spawn-three leaves only the first launcher alive', async () => {
    const workspace = createWorkspace();
    const first = spawnLauncher(workspace);
    const ownerPid = await waitForLeaseOwner(workspace);

    const second = spawnLauncher(workspace);
    await waitForStdoutClose(second);
    const secondExit = await waitForExit(second.child, 8000);

    const third = spawnLauncher(workspace);
    await waitForStdoutClose(third);
    const thirdExit = await waitForExit(third.child, 8000);

    expect(first.child.exitCode).toBeNull();
    expect(first.child.pid).toBe(ownerPid);
    expect(secondExit.code).toBe(0);
    expect(thirdExit.code).toBe(0);
    expect(second.stdout).toContain(`LEASE_HELD_BY:${ownerPid}`);
    expect(third.stdout).toContain(`LEASE_HELD_BY:${ownerPid}`);

    const launcherCount = countLauncherProcesses(workspace.launcherPath);
    if (launcherCount === null) {
      expect(second.child.exitCode).toBe(0);
      expect(third.child.exitCode).toBe(0);
    } else {
      expect(launcherCount).toBe(1);
    }
  });

  // 004-REQ-001: live-owner diagnostics include the recorded startedAt value.
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

  // 005-REQ-011: different workspaces sharing one resolved DB directory share one lease.
  it('uses the resolved DB directory as the launcher lease boundary', async () => {
    const firstWorkspace = createWorkspace();
    const secondWorkspace = createWorkspace();
    secondWorkspace.dbDir = firstWorkspace.dbDir;
    secondWorkspace.leaseFilePath = firstWorkspace.leaseFilePath;
    spawnLauncher(firstWorkspace);
    const ownerPid = await waitForLeaseOwner(firstWorkspace);

    const second = spawnLauncher(secondWorkspace);
    await waitForStdoutClose(second);
    const exit = await waitForExit(second.child, 8000);

    expect(exit.code).toBe(0);
    expect(second.stdout).toContain(`LEASE_HELD_BY:${ownerPid}`);
  });

  // 006-REQ-001: symlink aliases to one real DB directory share one lease boundary.
  it('uses the real DB directory as the launcher lease boundary across symlink aliases', async () => {
    const workspace = createWorkspace();
    const realDbDir = join(workspace.root, 'real-skill-advisor-db');
    const aliasOne = join(workspace.root, 'alias-one-db');
    const aliasTwo = join(workspace.root, 'alias-two-db');
    mkdirSync(realDbDir, { recursive: true });
    symlinkSync(realDbDir, aliasOne, 'dir');
    symlinkSync(realDbDir, aliasTwo, 'dir');
    workspace.dbDir = aliasOne;
    workspace.leaseFilePath = join(realDbDir, '.mk-skill-advisor-launcher.json');

    spawnLauncher(workspace);
    const ownerPid = await waitForLeaseOwner(workspace);

    const second = spawnLauncher(workspace, { MK_SKILL_ADVISOR_DB_DIR: aliasTwo });
    await waitForStdoutClose(second);
    const exit = await waitForExit(second.child, 8000);

    expect(exit.code).toBe(0);
    expect(second.stdout).toContain(`LEASE_HELD_BY:${ownerPid}`);
  });

  // 006-REQ-002: live legacy daemon lease blocks rolling-start duplicates.
  it('reports LEASE_HELD_BY from the legacy daemon lease path', async () => {
    const workspace = createWorkspace();
    const holder = await createLivePid();
    const startedAt = '2026-05-18T00:00:00.000Z';
    const legacyPath = join(workspace.root, '.opencode', 'skills', '.advisor-state', 'skill-graph-daemon-lease.sqlite');

    try {
      mkdirSync(dirname(legacyPath), { recursive: true });
      writeFileSync(legacyPath, JSON.stringify({ pid: holder.pid, startedAt }));

      const run = spawnLauncher(workspace);
      await waitForStdoutClose(run);
      const exit = await waitForExit(run.child, 8000);

      expect(exit.code).toBe(0);
      expect(run.stdout).toContain(`LEASE_HELD_BY:${holder.pid} startedAt=${startedAt} (legacy path)`);
    } finally {
      holder.kill('SIGTERM');
      try {
        await waitForExit(holder, 1000);
      } catch {
        holder.kill('SIGKILL');
      }
    }
  });

  // 003-REQ-009 / 001-REQ-004: dead-PID lease files are reclaimable.
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

  // 002-REQ-003: clean child exit removes the lease file.
  it('removes the PID file on clean exit', async () => {
    const workspace = createWorkspace();
    const run = spawnLauncher(workspace);
    await waitForLeaseOwner(workspace);

    run.child.kill('SIGTERM');
    await waitForExit(run.child, 5000);

    expect(existsSync(workspace.leaseFilePath)).toBe(false);
  });

  // 004-REQ-002 / 005-REQ-013: SIGQUIT follows the same lease cleanup path.
  it('removes the PID file on SIGQUIT', async () => {
    const workspace = createWorkspace();
    const run = spawnLauncher(workspace);
    await waitForLeaseOwner(workspace);

    run.child.kill('SIGQUIT');
    await waitForExit(run.child, 5000);

    expect(existsSync(workspace.leaseFilePath)).toBe(false);
  });

  // 006-REQ-003: parent SIGTERM backstop clears lease when child ignores SIGTERM.
  it('removes the PID file when the child ignores SIGTERM until the SIGKILL backstop', async () => {
    const workspace = createWorkspace({ ignoreChildSigterm: true });
    const run = spawnLauncher(workspace);
    await waitForLeaseOwner(workspace);

    run.child.kill('SIGTERM');
    await waitForExit(run.child, 8000);

    expect(existsSync(workspace.leaseFilePath)).toBe(false);
  });

  // 003-REQ-003 / 001-REQ-004: strict single-writer can be disabled for intentional parallel runs.
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
