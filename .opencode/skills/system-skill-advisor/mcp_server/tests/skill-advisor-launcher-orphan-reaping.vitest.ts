import { spawn, type ChildProcess, type ChildProcessByStdio } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import net from 'node:net';
import { dirname, join } from 'node:path';
import type { Readable } from 'node:stream';
import { StringDecoder } from 'node:string_decoder';

import { afterEach, describe, expect, it } from 'vitest';

import {
  countProcessesMatching,
  processLive,
  readJsonFile,
  repoRoot,
  terminatePidTree,
  waitFor,
} from './skill-advisor-cli-test-utils.js';

interface LauncherRun {
  readonly child: ChildProcessByStdio<null, Readable, Readable>;
  stdout: string;
  stderr: string;
}

interface Workspace {
  readonly root: string;
  readonly launcherPath: string;
  readonly bridgePath: string;
  readonly dbDir: string;
  readonly socketDir: string;
  readonly socketPath: string;
  readonly leaseFilePath: string;
  readonly childPidFile: string;
}

interface FlakyDaemon {
  readonly server: net.Server;
  readonly attempts: () => number;
}

const launcherRuns: LauncherRun[] = [];
const tempDirs: string[] = [];
const servers: net.Server[] = [];

function advisorServerSource(childPidFile: string): string {
  return `
const fs = require('fs');
fs.mkdirSync(${JSON.stringify(dirname(childPidFile))}, { recursive: true });
fs.writeFileSync(${JSON.stringify(childPidFile)}, String(process.pid));
process.on('SIGTERM', () => { process.exit(0); });
process.on('SIGINT', () => { process.exit(0); });
setInterval(() => {}, 1000);
`;
}

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
  return leaseHeldFromFile(leaseFile(workspaceRoot));
};
`;
}

function createWorkspace(): Workspace {
  const root = mkdtempSync('/tmp/sao-');
  tempDirs.push(root);
  const launcherPath = join(root, '.opencode/bin/mk-skill-advisor-launcher.cjs');
  const bridgePath = join(root, '.opencode/bin/lib/launcher-ipc-bridge.cjs');
  const childPidFile = join(root, 'runtime', 'advisor-child.pid');
  const advisorServer = join(root, '.opencode/skills/system-skill-advisor/mcp_server/dist/mcp_server/advisor-server.js');
  const leaseModule = join(root, '.opencode/skills/system-skill-advisor/mcp_server/dist/mcp_server/lib/daemon/lease.js');
  mkdirSync(dirname(launcherPath), { recursive: true });
  mkdirSync(dirname(bridgePath), { recursive: true });
  mkdirSync(dirname(advisorServer), { recursive: true });
  mkdirSync(dirname(leaseModule), { recursive: true });
  copyFileSync(join(repoRoot, '.opencode/bin/mk-skill-advisor-launcher.cjs'), launcherPath);
  copyFileSync(join(repoRoot, '.opencode/bin/lib/launcher-ipc-bridge.cjs'), bridgePath);
  writeFileSync(advisorServer, advisorServerSource(childPidFile), 'utf8');
  writeFileSync(leaseModule, leaseModuleSource(), 'utf8');
  const dbDir = join(root, 'skill-advisor-db');
  const socketDir = join(root, 'ipc');
  mkdirSync(dbDir, { recursive: true, mode: 0o700 });
  mkdirSync(socketDir, { recursive: true, mode: 0o700 });
  return {
    root,
    launcherPath,
    bridgePath,
    dbDir,
    socketDir,
    socketPath: join(socketDir, 'daemon-ipc.sock'),
    leaseFilePath: join(dbDir, '.mk-skill-advisor-launcher.json'),
    childPidFile,
  };
}

function spawnLauncher(workspace: Workspace, env: NodeJS.ProcessEnv = {}): LauncherRun {
  const run: LauncherRun = {
    child: spawn(process.execPath, [workspace.launcherPath], {
      cwd: workspace.root,
      env: {
        ...process.env,
        MK_SKILL_ADVISOR_DB_DIR: workspace.dbDir,
        SPECKIT_IPC_SOCKET_DIR: workspace.socketDir,
        SPECKIT_DAEMON_REELECTION: 'on',
        SPECKIT_LEASE_PROBE_RETRIES: '1',
        SPECKIT_PROBE_TIMEOUT_MS: '250',
        SPECKIT_LEASE_PROBE_RETRY_TIMEOUT_MS: '100',
        SPECKIT_LEASE_PROBE_RETRY_BACKOFF_MS: '10',
        ...env,
      },
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

async function waitForExit(child: ChildProcess, timeoutMs: number): Promise<{ code: number | null; signal: NodeJS.Signals | null }> {
  if (child.exitCode !== null || child.signalCode !== null) {
    return { code: child.exitCode, signal: child.signalCode };
  }
  return await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      child.off('exit', onExit);
      reject(new Error(`timed out waiting for pid ${child.pid} to exit`));
    }, timeoutMs);
    const onExit = (code: number | null, signal: NodeJS.Signals | null): void => {
      clearTimeout(timer);
      resolve({ code, signal });
    };
    child.once('exit', onExit);
  });
}

async function waitForStdoutClose(run: LauncherRun): Promise<void> {
  if (run.child.stdout.closed) return;
  await new Promise<void>((resolve) => run.child.stdout.once('close', () => resolve()));
}

async function createDeadPid(): Promise<number> {
  const child = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000);'], { stdio: 'ignore' });
  await new Promise<void>((resolve, reject) => {
    child.once('spawn', resolve);
    child.once('error', reject);
  });
  if (!child.pid) throw new Error('dead-pid fixture did not start');
  const pid = child.pid;
  child.kill('SIGTERM');
  await waitForExit(child, 1000);
  return pid;
}

async function createLivePid(): Promise<ChildProcess> {
  const child = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000);'], { stdio: 'ignore' });
  await new Promise<void>((resolve, reject) => {
    child.once('spawn', resolve);
    child.once('error', reject);
  });
  if (!child.pid) throw new Error('live-pid fixture did not start');
  return child;
}

function readLeasePid(workspace: Workspace): number | null {
  const lease = readJsonFile<{ readonly pid?: unknown }>(workspace.leaseFilePath);
  return typeof lease?.pid === 'number' ? lease.pid : null;
}

function readChildPid(workspace: Workspace): number | null {
  try {
    const parsed = Number.parseInt(readFileSync(workspace.childPidFile, 'utf8').trim(), 10);
    return Number.isInteger(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function startFlakyWarmDaemon(socketPath: string): Promise<FlakyDaemon> {
  let attempts = 0;
  const server = net.createServer((socket) => {
    attempts += 1;
    if (attempts === 1) {
      socket.destroy();
      return;
    }
    const decoder = new StringDecoder('utf8');
    let buffer = '';
    socket.on('data', (chunk) => {
      buffer += Buffer.isBuffer(chunk) ? decoder.write(chunk) : String(chunk ?? '');
      let newlineIndex = buffer.indexOf('\n');
      while (newlineIndex !== -1) {
        const line = buffer.slice(0, newlineIndex).trim();
        buffer = buffer.slice(newlineIndex + 1);
        newlineIndex = buffer.indexOf('\n');
        if (!line) continue;
        const request = JSON.parse(line) as { readonly id?: unknown; readonly method?: string };
        if (request.method === 'initialize' && request.id !== undefined) {
          socket.write(`${JSON.stringify({
            jsonrpc: '2.0',
            id: request.id,
            result: { protocolVersion: '2025-06-18', capabilities: {}, serverInfo: { name: 'warm-advisor', version: 'fixture' } },
          })}\n`);
          setTimeout(() => socket.end(), 10);
        }
      }
    });
  });
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(socketPath, () => {
      server.off('error', reject);
      resolve();
    });
  });
  servers.push(server);
  return { server, attempts: () => attempts };
}

async function cleanup(): Promise<void> {
  while (servers.length > 0) {
    const server = servers.pop();
    if (!server) continue;
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
  while (launcherRuns.length > 0) {
    const run = launcherRuns.pop();
    if (run?.child.pid) await terminatePidTree(run.child.pid);
  }
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
}

afterEach(async () => {
  await cleanup();
});

describe('skill-advisor launcher orphan reaping fixtures', () => {
  it('reclaims a stale launcher lease with no socket and leaves no extra launchers', async () => {
    const workspace = createWorkspace();
    const deadPid = await createDeadPid();
    writeFileSync(workspace.leaseFilePath, JSON.stringify({ pid: deadPid, startedAt: new Date().toISOString() }));

    const run = spawnLauncher(workspace);
    await waitFor(() => /staleReclaimed: true/.test(run.stderr), 2000, 'stale reclaim log');
    await waitFor(() => readLeasePid(workspace) !== null && readLeasePid(workspace) !== deadPid, 2000, 'replacement lease');
    const ownerPid = readLeasePid(workspace);

    expect(ownerPid).not.toBe(deadPid);
    expect(countProcessesMatching(workspace.launcherPath)).toBe(1);
    if (ownerPid) await terminatePidTree(ownerPid);
    await waitFor(() => countProcessesMatching(workspace.launcherPath) === 0, 3000, 'zero stale-lease launchers');
  });

  it('exits when the daemon child receives SIGTERM instead of recycling the child', async () => {
    const workspace = createWorkspace();
    const run = spawnLauncher(workspace);
    await waitFor(() => readLeasePid(workspace) !== null, 2000, 'launcher lease');
    await waitFor(() => readChildPid(workspace) !== null, 2000, 'stub child pid');
    const childPid = readChildPid(workspace);
    expect(childPid).toEqual(expect.any(Number));

    process.kill(childPid as number, 'SIGTERM');
    const exit = await waitForExit(run.child, 5000);

    expect(exit.signal).toBeNull();
    expect([0, 128]).toContain(exit.code);
    expect(processLive(childPid)).toBe(false);
    await waitFor(() => countProcessesMatching(workspace.launcherPath) === 0, 3000, 'zero child-sigterm launchers');
  });

  it('cleans a launcher whose workspace directory has been removed', async () => {
    const workspace = createWorkspace();
    const run = spawnLauncher(workspace);
    await waitFor(() => readLeasePid(workspace) !== null, 2000, 'launcher lease');
    const ownerPid = readLeasePid(workspace);
    expect(ownerPid).toEqual(expect.any(Number));

    rmSync(workspace.root, { recursive: true, force: true });
    await terminatePidTree(ownerPid);
    await waitForExit(run.child, 5000).catch(() => undefined);

    expect(processLive(ownerPid)).toBe(false);
    await waitFor(() => countProcessesMatching(workspace.launcherPath) === 0, 3000, 'zero removed-worktree launchers');
  });

  it('adopts a warm daemon after one failed deep probe without spawning another launcher', async () => {
    const workspace = createWorkspace();
    const holder = await createLivePid();
    const startedAt = new Date().toISOString();
    writeFileSync(workspace.leaseFilePath, JSON.stringify({ pid: holder.pid, startedAt }));
    const daemon = await startFlakyWarmDaemon(workspace.socketPath);

    try {
      const run = spawnLauncher(workspace);
      await waitForStdoutClose(run);
      const exit = await waitForExit(run.child, 5000);

      expect(exit.code).toBe(0);
      expect(run.stderr).toContain('probe 1/2 not alive');
      expect(run.stderr).toContain('bridging to lease holder');
      expect(daemon.attempts()).toBeGreaterThanOrEqual(2);
      expect(existsSync(workspace.childPidFile)).toBe(false);
      expect(countProcessesMatching(workspace.launcherPath)).toBe(0);
    } finally {
      if (holder.pid) await terminatePidTree(holder.pid);
    }
  });
});
