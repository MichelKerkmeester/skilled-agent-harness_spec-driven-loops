import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

interface LauncherRun {
  child: ChildProcessWithoutNullStreams;
  stdout: string;
  stderr: string;
}

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../..');
const launcherRelativePath = '.opencode/bin/mk-spec-memory-launcher.cjs';
const pidFileRelativePath = '.opencode/skills/system-spec-kit/mcp_server/database/.mk-spec-memory-launcher.json';
const tempDirs: string[] = [];
const launcherRuns: LauncherRun[] = [];

function createWorkspace(): { root: string; launcherPath: string; pidFilePath: string } {
  const root = mkdtempSync(join(tmpdir(), 'mk-spec-memory-lease-'));
  tempDirs.push(root);

  const launcherPath = join(root, launcherRelativePath);
  mkdirSync(dirname(launcherPath), { recursive: true });
  copyFileSync(join(repoRoot, launcherRelativePath), launcherPath);

  const contextServer = join(root, '.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js');
  const graphBackfill = join(root, '.opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js');
  const descriptionGenerator = join(root, '.opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js');
  mkdirSync(dirname(contextServer), { recursive: true });
  mkdirSync(dirname(graphBackfill), { recursive: true });
  mkdirSync(dirname(descriptionGenerator), { recursive: true });
  writeFileSync(
    contextServer,
    "process.on('SIGTERM', () => process.exit(0)); process.on('SIGINT', () => process.exit(0)); setInterval(() => {}, 1000);\n",
    'utf8',
  );
  writeFileSync(graphBackfill, 'export {};\n', 'utf8');
  writeFileSync(descriptionGenerator, 'export {};\n', 'utf8');

  return { root, launcherPath, pidFilePath: join(root, pidFileRelativePath) };
}

function spawnLauncher(launcherPath: string, root: string, env: NodeJS.ProcessEnv = {}): LauncherRun {
  const baseEnv = { ...process.env };
  delete baseEnv.MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER;
  delete baseEnv.MK_CODE_INDEX_STRICT_SINGLE_WRITER;
  delete baseEnv.MK_SPEC_MEMORY_STRICT_SINGLE_WRITER;

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
  child: ChildProcessWithoutNullStreams,
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
    await waitForExit(run.child, 1000);
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

function findDeadPid(): number {
  for (let pid = 999_999; pid > 900_000; pid--) {
    try {
      process.kill(pid, 0);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ESRCH') return pid;
    }
  }
  throw new Error('Could not find a dead pid for stale lease testing');
}

describe('mk-spec-memory launcher lease', () => {
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
    const first = spawnLauncher(workspace.launcherPath, workspace.root);
    await waitForLeasePid(workspace.pidFilePath, first.child.pid);

    const second = spawnLauncher(workspace.launcherPath, workspace.root);
    await waitForStdoutClose(second);
    const exit = await waitForExit(second.child, 5000);

    expect(exit.code).toBe(0);
    expect(second.stdout).toContain(`LEASE_HELD_BY:${first.child.pid}`);
  });

  it('reclaims a dead-pid lease file and logs staleReclaimed', async () => {
    const workspace = createWorkspace();
    mkdirSync(dirname(workspace.pidFilePath), { recursive: true });
    writeFileSync(workspace.pidFilePath, JSON.stringify({ pid: findDeadPid(), startedAt: new Date().toISOString() }));

    const run = spawnLauncher(workspace.launcherPath, workspace.root);
    await waitFor(() => run.stderr.includes('staleReclaimed: true'), 2000, 'stale reclaim log');
    await waitForLeasePid(workspace.pidFilePath, run.child.pid);

    expect(readLeasePid(workspace.pidFilePath)).toBe(run.child.pid);
  });

  it('boots a sibling when strict single-writer is disabled', async () => {
    const workspace = createWorkspace();
    const first = spawnLauncher(workspace.launcherPath, workspace.root);
    await waitForLeasePid(workspace.pidFilePath, first.child.pid);

    const second = spawnLauncher(workspace.launcherPath, workspace.root, {
      MK_SPEC_MEMORY_STRICT_SINGLE_WRITER: '0',
    });
    await waitForLeasePid(workspace.pidFilePath, second.child.pid);

    expect(second.child.exitCode).toBeNull();
    expect(second.stderr).toContain('MK_SPEC_MEMORY_STRICT_SINGLE_WRITER is disabled; skipping lease check');
    expect(existsSync(workspace.pidFilePath)).toBe(true);
  });
});
