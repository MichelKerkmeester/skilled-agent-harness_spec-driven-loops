// ───────────────────────────────────────────────────────────────────
// MODULE: Bounded Process Fixture
// ───────────────────────────────────────────────────────────────────

import { spawn, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

export interface BoundedProcessResult {
  readonly pid: number;
  readonly descendantPids: readonly number[];
  readonly status: number | null;
  readonly signal: NodeJS.Signals | null;
  readonly stdout: string;
  readonly stderr: string;
  readonly timedOut: boolean;
  readonly durationMs: number;
}

export interface BoundedProcessOptions {
  readonly cwd: string;
  readonly env: NodeJS.ProcessEnv;
  readonly input?: string;
  readonly timeoutMs: number;
  readonly killGraceMs?: number;
  readonly descendantPidFile?: string;
}

export function processIsAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function descendantPids(rootPid: number): number[] {
  if (process.platform === 'win32') return [];
  const result = spawnSync('ps', ['-axo', 'pid=,ppid='], {
    encoding: 'utf8',
    timeout: 1_000,
  });
  if (result.status !== 0) return [];

  const childrenByParent = new Map<number, number[]>();
  for (const line of result.stdout.split('\n')) {
    const [pidText, parentText] = line.trim().split(/\s+/);
    const pid = Number(pidText);
    const parent = Number(parentText);
    if (!Number.isInteger(pid) || !Number.isInteger(parent)) continue;
    const children = childrenByParent.get(parent) ?? [];
    children.push(pid);
    childrenByParent.set(parent, children);
  }

  const found: number[] = [];
  const pending = [...(childrenByParent.get(rootPid) ?? [])];
  while (pending.length > 0) {
    const pid = pending.shift();
    if (pid === undefined) continue;
    found.push(pid);
    pending.push(...(childrenByParent.get(pid) ?? []));
  }
  return found;
}

function capturedPids(filePath: string | undefined): number[] {
  if (!filePath) return [];
  try {
    const parsed = JSON.parse(readFileSync(filePath, 'utf8')) as Record<string, unknown>;
    return Object.values(parsed)
      .filter((value): value is number => Number.isInteger(value))
      .filter((pid) => pid !== parsed['root']);
  } catch {
    return [];
  }
}

function signalProcessTree(pid: number, signal: NodeJS.Signals): void {
  try {
    process.kill(process.platform === 'win32' ? pid : -pid, signal);
  } catch {
    // A process that exited between the liveness probe and signal needs no cleanup.
  }
}

async function waitForProcessesToExit(pids: readonly number[], timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (pids.every((pid) => !processIsAlive(pid))) return;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}

export async function runBoundedProcess(
  command: string,
  args: readonly string[],
  options: BoundedProcessOptions,
): Promise<BoundedProcessResult> {
  const startedAt = Date.now();
  const child = spawn(command, [...args], {
    cwd: options.cwd,
    env: options.env,
    detached: process.platform !== 'win32',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  const pid = child.pid;
  if (pid === undefined) throw new Error('Bounded process did not expose a pid');

  const stdout: Buffer[] = [];
  const stderr: Buffer[] = [];
  child.stdout.on('data', (chunk: Buffer) => stdout.push(chunk));
  child.stderr.on('data', (chunk: Buffer) => stderr.push(chunk));
  child.stdin.on('error', () => {});
  child.stdin.end(options.input ?? '');

  let timedOut = false;
  let capturedDescendants: number[] = [];
  const graceMs = options.killGraceMs ?? 100;

  const outcome = await new Promise<{ status: number | null; signal: NodeJS.Signals | null }>((resolve) => {
    const timeout = setTimeout(() => {
      timedOut = true;
      capturedDescendants = [
        ...new Set([
          ...descendantPids(pid),
          ...capturedPids(options.descendantPidFile),
        ]),
      ];
      signalProcessTree(pid, 'SIGTERM');
      setTimeout(() => signalProcessTree(pid, 'SIGKILL'), graceMs).unref();
    }, options.timeoutMs);

    child.once('error', (error) => {
      clearTimeout(timeout);
      stderr.push(Buffer.from(error.message));
      resolve({ status: null, signal: null });
    });
    child.once('close', (status, signal) => {
      clearTimeout(timeout);
      resolve({ status, signal });
    });
  });

  if (timedOut) {
    await waitForProcessesToExit([pid, ...capturedDescendants], graceMs + 500);
    for (const descendant of capturedDescendants) {
      if (processIsAlive(descendant)) {
        try {
          process.kill(descendant, 'SIGKILL');
        } catch {
          // The descendant completed during the last liveness probe.
        }
      }
    }
  }

  return {
    pid,
    descendantPids: capturedDescendants,
    status: outcome.status,
    signal: outcome.signal,
    stdout: Buffer.concat(stdout).toString('utf8'),
    stderr: Buffer.concat(stderr).toString('utf8'),
    timedOut,
    durationMs: Date.now() - startedAt,
  };
}
