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

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../..');
const launcherRelativePath = '.opencode/bin/mk-code-index-launcher.cjs';
const pidFileRelativePath = '.opencode/.spec-kit/code-graph/database/.mk-code-index-launcher.json';
const tempDirs: string[] = [];
const launcherRuns: LauncherRun[] = [];

function createWorkspace(): { root: string; launcherPath: string; pidFilePath: string } {
  const root = mkdtempSync(join(tmpdir(), 'mk-code-index-lease-'));
  tempDirs.push(root);

  const launcherPath = join(root, launcherRelativePath);
  mkdirSync(dirname(launcherPath), { recursive: true });
  copyFileSync(join(repoRoot, launcherRelativePath), launcherPath);

  const directServer = join(root, '.opencode/skills/system-code-graph/mcp_server/dist/index.js');
  const nestedServer = join(root, '.opencode/skills/system-code-graph/dist/system-code-graph/mcp_server/index.js');
  mkdirSync(dirname(directServer), { recursive: true });
  mkdirSync(dirname(nestedServer), { recursive: true });
  writeFileSync(
    directServer,
    "process.on('SIGTERM', () => process.exit(0)); process.on('SIGINT', () => process.exit(0)); setInterval(() => {}, 1000);\n",
    'utf8',
  );
  writeFileSync(nestedServer, 'export {};\n', 'utf8');

  return { root, launcherPath, pidFilePath: join(root, pidFileRelativePath) };
}

function spawnLauncher(launcherPath: string, root: string, env: NodeJS.ProcessEnv = {}): LauncherRun {
  const baseEnv = { ...process.env };
  delete baseEnv.MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER;
  delete baseEnv.MK_CODE_INDEX_STRICT_SINGLE_WRITER;
  delete baseEnv.MK_SPEC_MEMORY_STRICT_SINGLE_WRITER;
  delete baseEnv.SPECKIT_CODE_GRAPH_DB_DIR;

  const run: LauncherRun = {
    child: spawn(process.execPath, [launcherPath], {
      cwd: root,
      env: { ...baseEnv, ...env },
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

function readLeasePid(pidFilePath: string): number | null {
  try {
    const parsed = JSON.parse(readFileSync(pidFilePath, 'utf8')) as { pid?: unknown };
    return typeof parsed.pid === 'number' ? parsed.pid : null;
  } catch {
    return null;
  }
}

async function waitForLeasePid(pidFilePath: string, pid: number | undefined): Promise<void> {
  if (typeof pid !== 'number') throw new Error('launcher pid was not assigned');
  await waitFor(() => readLeasePid(pidFilePath) === pid, 2000, `lease pid ${pid}`);
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

describe('mk-code-index launcher lease', () => {
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

  // REQ-001: duplicate launcher exits before opening SQLite.
  it('exits with LEASE_HELD_BY when a live owner exists', async () => {
    const workspace = createWorkspace();
    const first = spawnLauncher(workspace.launcherPath, workspace.root);
    await waitForLeasePid(workspace.pidFilePath, first.child.pid);

    const second = spawnLauncher(workspace.launcherPath, workspace.root);
    await waitForStdoutClose(second);
    const exit = await waitForExit(second.child, 8000);

    expect(exit.code).toBe(0);
    expect(second.stdout).toContain(`LEASE_HELD_BY:${first.child.pid}`);
    expect(second.stdout).toMatch(new RegExp(`^LEASE_HELD_BY:${first.child.pid} startedAt=\\d{4}-\\d{2}-\\d{2}T`, 'm'));
  });

  // REQ-002: live-owner diagnostics include the recorded startedAt value.
  it('reports the lease startedAt value for a live owner', async () => {
    const workspace = createWorkspace();
    const holder = await createLivePid();
    const startedAt = '2026-05-18T00:00:00.000Z';

    try {
      mkdirSync(dirname(workspace.pidFilePath), { recursive: true });
      writeFileSync(workspace.pidFilePath, JSON.stringify({ pid: holder.pid, startedAt }));

      const run = spawnLauncher(workspace.launcherPath, workspace.root);
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

  // REQ-012: the launcher lease follows the resolved code-graph DB directory.
  it('stores the PID file next to SPECKIT_CODE_GRAPH_DB_DIR when overridden', async () => {
    const workspace = createWorkspace();
    const dbDir = join(workspace.root, 'shared-code-graph-db');
    const pidFilePath = join(dbDir, '.mk-code-index-launcher.json');

    const run = spawnLauncher(workspace.launcherPath, workspace.root, {
      SPECKIT_CODE_GRAPH_DB_DIR: dbDir,
    });
    await waitForLeasePid(pidFilePath, run.child.pid);

    expect(existsSync(pidFilePath)).toBe(true);
    expect(existsSync(workspace.pidFilePath)).toBe(false);
  });

  // REQ-004: dead-PID lease files are reclaimable.
  it('reclaims a dead-pid lease file and logs staleReclaimed', async () => {
    const workspace = createWorkspace();
    mkdirSync(dirname(workspace.pidFilePath), { recursive: true });
    writeFileSync(workspace.pidFilePath, JSON.stringify({ pid: await createDeadPid(), startedAt: new Date().toISOString() }));

    const run = spawnLauncher(workspace.launcherPath, workspace.root);
    await waitFor(() => /^.*staleReclaimed: true\b/m.test(run.stderr), 2000, 'stale reclaim log');
    expect(run.stderr).toMatch(/^.*staleReclaimed: true\b/m);
    await waitForLeasePid(workspace.pidFilePath, run.child.pid);

    expect(readLeasePid(workspace.pidFilePath)).toBe(run.child.pid);
  });

  // REQ-003: clean child exit removes the lease file.
  it('removes the PID file on clean exit', async () => {
    const workspace = createWorkspace();
    const run = spawnLauncher(workspace.launcherPath, workspace.root);
    await waitForLeasePid(workspace.pidFilePath, run.child.pid);

    run.child.kill('SIGTERM');
    await waitForExit(run.child, 5000);

    expect(existsSync(workspace.pidFilePath)).toBe(false);
  });

  // REQ-011: SIGQUIT follows the same lease cleanup path.
  it('removes the PID file on SIGQUIT', async () => {
    const workspace = createWorkspace();
    const run = spawnLauncher(workspace.launcherPath, workspace.root);
    await waitForLeasePid(workspace.pidFilePath, run.child.pid);

    run.child.kill('SIGQUIT');
    await waitForExit(run.child, 5000);

    expect(existsSync(workspace.pidFilePath)).toBe(false);
  });

  // REQ-005: strict single-writer can be disabled for intentional parallel runs.
  it('boots a sibling when strict single-writer is disabled', async () => {
    const workspace = createWorkspace();
    const first = spawnLauncher(workspace.launcherPath, workspace.root);
    await waitForLeasePid(workspace.pidFilePath, first.child.pid);

    const second = spawnLauncher(workspace.launcherPath, workspace.root, {
      MK_CODE_INDEX_STRICT_SINGLE_WRITER: '0',
    });
    await waitForLeasePid(workspace.pidFilePath, second.child.pid);

    expect(second.child.exitCode).toBeNull();
    expect(second.stderr).toContain('MK_CODE_INDEX_STRICT_SINGLE_WRITER is disabled; skipping lease check');
    expect(existsSync(workspace.pidFilePath)).toBe(true);
  });
});
