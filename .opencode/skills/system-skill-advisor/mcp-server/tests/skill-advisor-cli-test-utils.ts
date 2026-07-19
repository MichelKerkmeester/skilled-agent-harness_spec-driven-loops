import { spawn, spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface CliRunResult {
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
  readonly durationMs: number;
  readonly signal: NodeJS.Signals | null;
}

export interface IsolatedCliScope {
  readonly rootDir: string;
  readonly inWorktreeDir: string;
  readonly socketDir: string;
  readonly socketPath: string;
  readonly skillAdvisorDbDir: string;
  readonly memoryDbPath: string;
  readonly codeGraphDbDir: string;
  readonly shadowDeltaPath: string;
  readonly env: NodeJS.ProcessEnv;
}

interface ProcessRow {
  readonly pid: number;
  readonly ppid: number;
  readonly command: string;
}

export const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../..');
export const skillAdvisorShim = join(repoRoot, '.opencode/bin/skill-advisor.cjs');
export const pythonAdvisorScript = join(
  repoRoot,
  '.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py',
);
export const testsDir = join(repoRoot, '.opencode/skills/system-skill-advisor/mcp-server/tests');

function uniqueSuffix(label: string): string {
  const safeLabel = label.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  return `${safeLabel}-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createIsolatedCliScope(label: string): IsolatedCliScope {
  const suffix = uniqueSuffix(label);
  const rootDir = mkdtempSync('/tmp/sa-');
  const inWorktreeDir = join(testsDir, `.tmp-${suffix}`);
  const socketDir = join(rootDir, 'ipc');
  const skillAdvisorDbDir = join(rootDir, 'skill-advisor-db');
  const memoryDbPath = join(rootDir, 'memory.sqlite');
  const codeGraphDbDir = join(inWorktreeDir, 'code-graph-db');
  const shadowDeltaPath = join(inWorktreeDir, 'shadow-deltas.jsonl');

  mkdirSync(socketDir, { recursive: true, mode: 0o700 });
  mkdirSync(skillAdvisorDbDir, { recursive: true, mode: 0o700 });
  mkdirSync(codeGraphDbDir, { recursive: true, mode: 0o700 });

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    SPECKIT_IPC_SOCKET_DIR: socketDir,
    SPECKIT_DAEMON_REELECTION: 'on',
    SPECKIT_LEASE_PROBE_RETRIES: '1',
    SPECKIT_PROBE_TIMEOUT_MS: '500',
    SPECKIT_LEASE_PROBE_RETRY_TIMEOUT_MS: '200',
    SPECKIT_LEASE_PROBE_RETRY_BACKOFF_MS: '10',
    MK_SKILL_ADVISOR_DB_DIR: skillAdvisorDbDir,
    MEMORY_DB_PATH: memoryDbPath,
    SPECKIT_CODE_GRAPH_DB_DIR: codeGraphDbDir,
    SPECKIT_ADVISOR_SHADOW_DELTA_PATH: shadowDeltaPath,
    SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED: '0',
    SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC: '1',
  };
  delete env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED;

  return {
    rootDir,
    inWorktreeDir,
    socketDir,
    socketPath: join(socketDir, 'daemon-ipc.sock'),
    skillAdvisorDbDir,
    memoryDbPath,
    codeGraphDbDir,
    shadowDeltaPath,
    env,
  };
}

export function runSkillAdvisorShim(
  args: readonly string[],
  env: NodeJS.ProcessEnv,
  options: { readonly timeoutMs?: number; readonly input?: string } = {},
): CliRunResult {
  const startedAt = Date.now();
  const result = spawnSync(process.execPath, [skillAdvisorShim, ...args], {
    cwd: repoRoot,
    env,
    input: options.input,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 20,
    stdio: ['pipe', 'pipe', 'pipe'],
    timeout: options.timeoutMs ?? 120_000,
  }) as SpawnSyncReturns<string>;
  return {
    exitCode: result.status ?? (result.signal ? 128 : 1),
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    durationMs: Date.now() - startedAt,
    signal: result.signal,
  };
}

export async function runSkillAdvisorShimAsync(
  args: readonly string[],
  env: NodeJS.ProcessEnv,
  options: { readonly timeoutMs?: number; readonly input?: string } = {},
): Promise<CliRunResult> {
  const startedAt = Date.now();
  const child = spawn(process.execPath, [skillAdvisorShim, ...args], {
    cwd: repoRoot,
    env,
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  let stdout = '';
  let stderr = '';
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  child.stdout.on('data', (chunk) => {
    stdout += chunk;
  });
  child.stderr.on('data', (chunk) => {
    stderr += chunk;
  });

  return await new Promise<CliRunResult>((resolve) => {
    let settled = false;
    const finish = (exitCode: number, signal: NodeJS.Signals | null, extraStderr = ''): void => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({
        exitCode,
        stdout,
        stderr: `${stderr}${extraStderr}`,
        durationMs: Date.now() - startedAt,
        signal,
      });
    };
    const timer = setTimeout(() => {
      void terminatePidTree(child.pid).catch((error: unknown) => {
        stderr += `${error instanceof Error ? error.message : String(error)}\n`;
      });
    }, options.timeoutMs ?? 120_000);

    child.once('error', (error) => {
      finish(1, null, `${error.message}\n`);
    });
    child.once('close', (code, signal) => {
      finish(code ?? (signal ? 128 : 1), signal);
    });
    if (child.exitCode !== null || child.signalCode !== null) {
      finish(child.exitCode ?? (child.signalCode ? 128 : 1), child.signalCode);
      return;
    }
    if (options.input !== undefined) {
      child.stdin.end(options.input);
    } else {
      child.stdin.end();
    }
  });
}

export function parseJsonOutput<T = Record<string, unknown>>(run: Pick<CliRunResult, 'stdout' | 'stderr'>): T {
  const raw = run.stdout.trim() || run.stderr.trim();
  if (!raw) throw new Error('CLI produced no JSON output');
  return JSON.parse(raw) as T;
}

export function readJsonFile<T = Record<string, unknown>>(filePath: string): T | null {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8')) as T;
  } catch {
    return null;
  }
}

export function skillAdvisorLauncherLeasePath(dbDir: string): string {
  return join(dbDir, '.mk-skill-advisor-launcher.json');
}

export function readSkillAdvisorLauncherPid(dbDir: string): number | null {
  const lease = readJsonFile<{ readonly pid?: unknown }>(skillAdvisorLauncherLeasePath(dbDir));
  return typeof lease?.pid === 'number' ? lease.pid : null;
}

export function processLive(pid: number | null | undefined): boolean {
  if (!Number.isInteger(pid) || (pid ?? 0) <= 0) return false;
  try {
    process.kill(pid as number, 0);
    return true;
  } catch (error: unknown) {
    return (error as NodeJS.ErrnoException).code === 'EPERM';
  }
}

export async function waitFor(
  predicate: () => boolean,
  timeoutMs: number,
  label: string,
  intervalMs = 25,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() <= deadline) {
    if (predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  throw new Error(`Timed out waiting for ${label}`);
}

export async function waitForPidExit(pid: number, timeoutMs: number): Promise<void> {
  await waitFor(() => !processLive(pid), timeoutMs, `pid ${pid} to exit`, 50);
}

function processRows(): ProcessRow[] {
  const result = spawnSync('ps', ['-A', '-o', 'pid=', '-o', 'ppid=', '-o', 'command='], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }) as SpawnSyncReturns<string>;
  if (result.status !== 0 || result.error) return [];
  return (result.stdout ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(\d+)\s+(\d+)\s+(.*)$/);
      if (!match) return null;
      return {
        pid: Number.parseInt(match[1], 10),
        ppid: Number.parseInt(match[2], 10),
        command: match[3],
      };
    })
    .filter((row): row is ProcessRow => row !== null);
}

export function countProcessesMatching(needle: string): number {
  return processRows().filter((row) => row.command.includes(needle)).length;
}

export function descendantPids(rootPid: number): number[] {
  const rows = processRows();
  const byParent = new Map<number, number[]>();
  for (const row of rows) {
    byParent.set(row.ppid, [...(byParent.get(row.ppid) ?? []), row.pid]);
  }
  const pending = [...(byParent.get(rootPid) ?? [])];
  const descendants: number[] = [];
  while (pending.length > 0) {
    const pid = pending.pop();
    if (!pid || descendants.includes(pid)) continue;
    descendants.push(pid);
    pending.push(...(byParent.get(pid) ?? []));
  }
  return descendants;
}

export async function terminatePidTree(pid: number | null | undefined, timeoutMs = 5000): Promise<void> {
  if (!Number.isInteger(pid) || (pid ?? 0) <= 0) return;
  const targets = [...descendantPids(pid as number).reverse(), pid as number];
  for (const target of targets) {
    try {
      process.kill(target, 'SIGTERM');
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code !== 'ESRCH') throw error;
    }
  }
  const deadline = Date.now() + timeoutMs;
  for (const target of targets) {
    const remaining = Math.max(1, deadline - Date.now());
    try {
      await waitForPidExit(target, remaining);
    } catch {
      try {
        process.kill(target, 'SIGKILL');
      } catch (error: unknown) {
        if ((error as NodeJS.ErrnoException).code !== 'ESRCH') throw error;
      }
    }
  }
}

export async function cleanupSkillAdvisorScope(scope: IsolatedCliScope): Promise<void> {
  await terminatePidTree(readSkillAdvisorLauncherPid(scope.skillAdvisorDbDir));
  rmSync(scope.rootDir, { recursive: true, force: true });
  rmSync(scope.inWorktreeDir, { recursive: true, force: true });
}

export function removeIfExists(pathValue: string): void {
  if (existsSync(pathValue)) rmSync(pathValue, { recursive: true, force: true });
}
