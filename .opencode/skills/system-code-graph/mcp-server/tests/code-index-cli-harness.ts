import { spawn, execFile, type ChildProcess } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

import { afterAll, afterEach, expect } from 'vitest';

const require = createRequire(import.meta.url);
const execFileAsync = promisify(execFile);

const testDir = dirname(fileURLToPath(import.meta.url));
export const mcpServerDir = resolve(testDir, '..');
export const worktreeRoot = resolve(mcpServerDir, '../../../..');
export const codeIndexCliPath = join(worktreeRoot, '.opencode/bin/code-index.cjs');
export const codeIndexLauncherPath = join(worktreeRoot, '.opencode/bin/mk-code-index-launcher.cjs');

type RunOptions = {
  timeoutMs?: number;
};

type ProcessResult = {
  exitCode: number | null;
  signal: NodeJS.Signals | null;
  stdout: string;
  stderr: string;
};

type RuntimePid = {
  pid: number;
  source: string;
};

type OwnerLeaseData = {
  ownerPid: number;
  ppid: number;
  executablePath: string;
  startedAtIso: string;
  lastHeartbeatIso: string;
  ttlMs: number;
  canonicalDbDir: string;
};

type CodeIndexHarness = {
  id: string;
  rootDir: string;
  socketDir: string;
  dbDir: string;
  env: NodeJS.ProcessEnv;
  runCli: (args: string[], options?: RunOptions) => Promise<ProcessResult>;
  callMcpTool: (name: string, args?: Record<string, unknown>) => Promise<unknown>;
  cleanup: () => Promise<void>;
  assertNoLiveRuntimePids: () => Promise<void>;
  assertSingleOwnerLease: () => OwnerLeaseData;
  assertNoRespawnLock: () => void;
  reapRecordedRuntimePids: () => Promise<void>;
  killOwnerDaemon: () => Promise<OwnerLeaseData>;
  listRuntimeProcesses: () => Promise<string[]>;
};

const activeHarnesses = new Set<CodeIndexHarness>();

export function registerCodeIndexCliTeardown(): void {
  afterEach(async () => {
    await cleanupActiveHarnesses();
  });

  afterAll(async () => {
    await cleanupActiveHarnesses();
  });
}

export function createCodeIndexHarness(name: string): CodeIndexHarness {
  const parentDir = join(worktreeRoot, '.opencode/.tmp/code-index-cli-hardening');
  mkdirSync(parentDir, { recursive: true });

  const id = sanitizeName(name);
  const rootDir = mkdtempSync(join(parentDir, `${id}-`));
  const socketDir = mkdtempSync(join(tmpdir(), 'ci-'));
  const dbDir = join(rootDir, 'db');
  mkdirSync(dbDir, { recursive: true });

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    SPECKIT_IPC_SOCKET_DIR: socketDir,
    SPECKIT_DAEMON_REELECTION: '0',
    SPECKIT_CODE_GRAPH_DB_DIR: dbDir,
    SPECKIT_CODE_GRAPH_DB_PATH: undefined,
  };

  const trackedChildren = new Set<ChildProcess>();
  const runtimePids = new Map<number, RuntimePid>();

  const harness: CodeIndexHarness = {
    id,
    rootDir,
    socketDir,
    dbDir,
    env,
    runCli: async (args, options) => {
      const result = await runChild(process.execPath, [codeIndexCliPath, ...args], env, trackedChildren, options);
      recordKnownRuntimePids(dbDir, runtimePids);
      return result;
    },
    callMcpTool: async (name, args = {}) => {
      const result = await callMcpTool(env, name, args);
      recordKnownRuntimePids(dbDir, runtimePids);
      return result;
    },
    cleanup: async () => {
      await killTrackedChildren(trackedChildren);
      await reapRuntimePids(dbDir, runtimePids);
      await assertNoLiveRuntimePids(dbDir, runtimePids);
      rmSync(rootDir, { recursive: true, force: true });
      rmSync(socketDir, { recursive: true, force: true });
      activeHarnesses.delete(harness);
    },
    assertNoLiveRuntimePids: () => assertNoLiveRuntimePids(dbDir, runtimePids),
    assertSingleOwnerLease: () => assertSingleOwnerLease(dbDir, runtimePids),
    assertNoRespawnLock: () => assertNoRespawnLock(dbDir),
    reapRecordedRuntimePids: () => reapRuntimePids(dbDir, runtimePids),
    killOwnerDaemon: async () => killOwnerDaemon(dbDir, runtimePids),
    listRuntimeProcesses: () => listRuntimeProcesses(runtimePids),
  };

  activeHarnesses.add(harness);
  return harness;
}

export function parseJsonOutput(result: ProcessResult): unknown {
  const text = result.stdout.trim();
  expect(text.length).toBeGreaterThan(0);
  return JSON.parse(text);
}

export function expectBlockedRender(value: unknown, expectedRequiredAction = 'code_graph_scan'): void {
  if (typeof value === 'string') {
    // Text format renders the normalized envelope as two fixed lines:
    //   blocked: <reason>
    //   requiredAction: <action>
    expect(value).toMatch(/^blocked: .+$/m);
    expect(value).toMatch(new RegExp(`^requiredAction: ${expectedRequiredAction}$`, 'm'));
    return;
  }

  expect(value).toBeTypeOf('object');
  expect(value).not.toBeNull();
  const envelope = value as { status?: unknown; requiredAction?: unknown; data?: { requiredAction?: unknown } };
  expect(envelope.status).toBe('blocked');
  expect(envelope.requiredAction).toBe(expectedRequiredAction);
  expect(envelope.data?.requiredAction).toBe(expectedRequiredAction);
}

export function textFromMcpResult(result: unknown): string {
  const maybeContent = (result as { content?: Array<{ text?: unknown }> }).content;
  if (Array.isArray(maybeContent)) {
    return maybeContent.map((entry) => (typeof entry.text === 'string' ? entry.text : '')).join('\n');
  }

  return JSON.stringify(result);
}

async function cleanupActiveHarnesses(): Promise<void> {
  const harnesses = Array.from(activeHarnesses);
  activeHarnesses.clear();
  await Promise.all(harnesses.map((harness) => harness.cleanup()));
}

async function runChild(
  command: string,
  args: string[],
  env: NodeJS.ProcessEnv,
  trackedChildren: Set<ChildProcess>,
  options: RunOptions = {},
): Promise<ProcessResult> {
  const child = spawn(command, args, {
    cwd: worktreeRoot,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  trackedChildren.add(child);

  let stdout = '';
  let stderr = '';
  child.stdout?.setEncoding('utf8');
  child.stderr?.setEncoding('utf8');
  child.stdout?.on('data', (chunk) => {
    stdout += chunk;
  });
  child.stderr?.on('data', (chunk) => {
    stderr += chunk;
  });

  const timeout = setTimeout(() => {
    child.kill('SIGTERM');
  }, options.timeoutMs ?? 20_000);

  return await new Promise((resolvePromise) => {
    child.on('close', (exitCode, signal) => {
      clearTimeout(timeout);
      trackedChildren.delete(child);
      resolvePromise({ exitCode, signal, stdout, stderr });
    });
  });
}

async function callMcpTool(
  env: NodeJS.ProcessEnv,
  name: string,
  args: Record<string, unknown>,
): Promise<unknown> {
  const { Client } = require('@modelcontextprotocol/sdk/client/index.js') as {
    Client: new (clientInfo: Record<string, unknown>, options: Record<string, unknown>) => {
      connect: (transport: unknown) => Promise<void>;
      callTool: (request: Record<string, unknown>) => Promise<unknown>;
      close: () => Promise<void>;
    };
  };
  const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js') as {
    StdioClientTransport: new (options: Record<string, unknown>) => { close?: () => Promise<void> };
  };

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [codeIndexLauncherPath],
    cwd: worktreeRoot,
    env,
  });
  const client = new Client({ name: 'code-index-cli-hardening', version: '0.0.0' }, { capabilities: {} });

  await client.connect(transport);
  try {
    return await client.callTool({ name, arguments: args });
  } finally {
    await client.close();
    await transport.close?.();
  }
}

async function killTrackedChildren(children: Set<ChildProcess>): Promise<void> {
  const waits = Array.from(children).map(
    (child) =>
      new Promise<void>((resolvePromise) => {
        if (child.exitCode !== null || child.signalCode !== null) {
          resolvePromise();
          return;
        }

        child.once('close', () => resolvePromise());
        child.kill('SIGTERM');
        setTimeout(() => {
          if (child.exitCode === null && child.signalCode === null) {
            child.kill('SIGKILL');
          }
        }, 1_000);
      }),
  );

  await Promise.all(waits);
  children.clear();
}

async function reapRuntimePids(dbDir: string, runtimePids: Map<number, RuntimePid>): Promise<void> {
  recordKnownRuntimePids(dbDir, runtimePids);
  for (const entry of collectRuntimePids(dbDir, runtimePids)) {
    if (!pidIsLive(entry.pid)) {
      continue;
    }

    process.kill(entry.pid, 'SIGTERM');
  }

  await delay(250);

  recordKnownRuntimePids(dbDir, runtimePids);
  for (const entry of collectRuntimePids(dbDir, runtimePids)) {
    if (pidIsLive(entry.pid)) {
      process.kill(entry.pid, 'SIGKILL');
    }
  }
}

async function assertNoLiveRuntimePids(dbDir: string, runtimePids: Map<number, RuntimePid>): Promise<void> {
  await delay(100);
  recordKnownRuntimePids(dbDir, runtimePids);
  const live = collectRuntimePids(dbDir, runtimePids).filter((entry) => pidIsLive(entry.pid));
  expect(live).toEqual([]);
}

function assertSingleOwnerLease(dbDir: string, runtimePids: Map<number, RuntimePid>): OwnerLeaseData {
  const lease = readOwnerLease(dbDir);
  expect(lease).not.toBeNull();
  expect(lease?.ownerPid).toBeGreaterThan(1);
  expect(lease?.canonicalDbDir).toBe(resolve(dbDir));
  if (lease) {
    recordRuntimePid(runtimePids, lease.ownerPid, ownerLeasePath(dbDir));
  }
  return lease as OwnerLeaseData;
}

function assertNoRespawnLock(dbDir: string): void {
  expect(existsSync(join(dbDir, '.mk-code-index-launcher.lockdir'))).toBe(false);
  expect(existsSync(join(dbDir, '.code-graph-owner.json.lock'))).toBe(false);
}

async function killOwnerDaemon(dbDir: string, runtimePids: Map<number, RuntimePid>): Promise<OwnerLeaseData> {
  const lease = assertSingleOwnerLease(dbDir, runtimePids);
  process.kill(lease.ownerPid, 'SIGTERM');
  await waitForPidExit(lease.ownerPid, 7_000);
  if (pidIsLive(lease.ownerPid)) {
    process.kill(lease.ownerPid, 'SIGKILL');
    await waitForPidExit(lease.ownerPid, 1_000);
  }
  return lease;
}

function collectRuntimePids(dbDir: string, runtimePids: Map<number, RuntimePid>): RuntimePid[] {
  const ownPid = process.pid;
  return Array.from(runtimePids.values()).filter((entry) => entry.pid !== ownPid);
}

function recordKnownRuntimePids(dbDir: string, runtimePids: Map<number, RuntimePid>): void {
  const ownerLease = readOwnerLease(dbDir);
  if (ownerLease) {
    recordRuntimePid(runtimePids, ownerLease.ownerPid, ownerLeasePath(dbDir));
  }

  const launcherLease = readJsonFile(launcherLeasePath(dbDir));
  const launcherPid = (launcherLease as { pid?: unknown } | null)?.pid;
  if (typeof launcherPid === 'number') {
    recordRuntimePid(runtimePids, launcherPid, launcherLeasePath(dbDir));
  }
}

function recordRuntimePid(runtimePids: Map<number, RuntimePid>, pid: number, source: string): void {
  if (Number.isInteger(pid) && pid > 1 && pid !== process.pid) {
    runtimePids.set(pid, { pid, source });
  }
}

function readOwnerLease(dbDir: string): OwnerLeaseData | null {
  const parsed = readJsonFile(ownerLeasePath(dbDir));
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
  const candidate = parsed as Partial<OwnerLeaseData>;
  if (
    Number.isInteger(candidate.ownerPid) &&
    Number.isInteger(candidate.ppid) &&
    typeof candidate.executablePath === 'string' &&
    typeof candidate.startedAtIso === 'string' &&
    typeof candidate.lastHeartbeatIso === 'string' &&
    Number.isInteger(candidate.ttlMs) &&
    typeof candidate.canonicalDbDir === 'string'
  ) {
    return candidate as OwnerLeaseData;
  }
  return null;
}

function readJsonFile(filePath: string): unknown {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8')) as unknown;
  } catch {
    return null;
  }
}

function ownerLeasePath(dbDir: string): string {
  return join(dbDir, '.code-graph-owner.json');
}

function launcherLeasePath(dbDir: string): string {
  return join(dbDir, '.mk-code-index-launcher.json');
}

function pidIsLive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function delay(ms: number): Promise<void> {
  await new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

async function waitForPidExit(pid: number, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() <= deadline) {
    if (!pidIsLive(pid)) return;
    await delay(100);
  }
}

function sanitizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'case';
}

async function listRuntimeProcesses(runtimePids: Map<number, RuntimePid>): Promise<string[]> {
  const knownPids = new Set(runtimePids.keys());
  const { stdout } = await execFileAsync('ps', ['-axo', 'pid=,command=']);
  return stdout
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => {
      const pid = Number.parseInt(line, 10);
      return knownPids.has(pid)
        && /mk-code-index-launcher|system-code-graph\/mcp-server\/dist\/index\.js/.test(line);
    });
}
