import { spawn, type ChildProcessByStdio } from 'node:child_process';
import { copyFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { Readable } from 'node:stream';

import { afterEach, describe, expect, it } from 'vitest';

import {
  countProcessesMatching,
  processLive,
  readJsonFile,
  repoRoot,
  terminatePidTree,
  waitFor,
  waitForPidExit,
} from './skill-advisor-cli-test-utils.js';

interface AsyncRun {
  readonly child: ChildProcessByStdio<null, Readable, Readable>;
  stdout: string;
  stderr: string;
}

interface TriSandbox {
  readonly root: string;
  readonly specMemoryShim: string;
  readonly codeIndexShim: string;
  readonly skillAdvisorShim: string;
  readonly specMemoryDbDir: string;
  readonly codeIndexDbDir: string;
  readonly skillAdvisorDbDir: string;
  readonly specSocketDir: string;
  readonly codeSocketDir: string;
  readonly advisorSocketDir: string;
  readonly socketRoot: string;
  readonly memoryDbPath: string;
  readonly specChildPidFile: string;
  readonly codeChildPidFile: string;
  readonly advisorChildPidFile: string;
  readonly advisorDaemonLeaseFile: string;
  readonly advisorOwnerLeaseFile: string;
}

const describeTriDaemon = process.env.SPECKIT_RUN_TRI_DAEMON_DRILL === '1' ? describe : describe.skip;
const sandboxes: TriSandbox[] = [];
const runs: AsyncRun[] = [];

function writeExecutable(filePath: string, source: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, source, { encoding: 'utf8', mode: 0o755 });
}

function stubCliSource(rootDepth: string, launcherName: string, serviceName: string): string {
  return `
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, ${JSON.stringify(rootDepth)});
const launcher = path.join(root, '.opencode/bin/${launcherName}');
const holder = path.join(root, '.opencode/bin/daemon-holder.js');
const child = spawn(process.execPath, [holder, launcher], { cwd: root, env: process.env, detached: true, stdio: 'ignore' });
child.unref();
setTimeout(() => {
  process.stdout.write(JSON.stringify({ status: 'ok', service: ${JSON.stringify(serviceName)} }) + '\\n');
}, 250);
`;
}

// Stand-in for the live MCP host that owns a launcher in production. A launcher
// whose spawner dies reparents to pid 1, and the relaunch guard then refuses to
// recycle a SIGTERM'd daemon child (it releases the lease and exits instead).
// The holder stays alive as the launcher's parent for exactly the launcher's
// lifetime so the divergent supervision behavior under test can be observed.
function holderSource(): string {
  return `
const { spawn } = require('node:child_process');
const child = spawn(process.execPath, [process.argv[2]], { cwd: process.cwd(), env: process.env, stdio: 'ignore' });
child.on('exit', () => { process.exit(0); });
process.on('SIGTERM', () => { process.exit(0); });
process.on('SIGINT', () => { process.exit(0); });
setInterval(() => {}, 1000);
`;
}

function longRunningServerSource(pidFile: string, extra = ''): string {
  return `
const fs = require('fs');
const path = require('path');
fs.mkdirSync(path.dirname(${JSON.stringify(pidFile)}), { recursive: true });
fs.writeFileSync(${JSON.stringify(pidFile)}, String(process.pid));
${extra}
process.on('SIGTERM', () => { process.exit(0); });
process.on('SIGINT', () => { process.exit(0); });
setInterval(() => {}, 1000);
`;
}

function advisorLeaseModuleSource(): string {
  return `
const fs = require('fs');
const path = require('path');

function leasePath() {
  const dir = process.env.MK_SKILL_ADVISOR_DB_DIR || path.join(process.cwd(), '.opencode/skills/system-skill-advisor/mcp_server/database');
  return path.join(dir, 'skill-graph-daemon-lease.sqlite');
}

exports.isLeaseHeld = function isLeaseHeld() {
  try {
    const parsed = JSON.parse(fs.readFileSync(leasePath(), 'utf8'));
    if (typeof parsed.pid !== 'number') throw new Error('missing pid');
    try {
      process.kill(parsed.pid, 0);
      return { held: true, ownerPid: parsed.pid, staleReclaimable: false, startedAt: parsed.startedAt || new Date(0).toISOString() };
    } catch (error) {
      if (error.code === 'ESRCH') return { held: false, ownerPid: parsed.pid, staleReclaimable: true, startedAt: parsed.startedAt || new Date(0).toISOString() };
      if (error.code === 'EPERM') return { held: true, ownerPid: parsed.pid, staleReclaimable: false, startedAt: parsed.startedAt || new Date(0).toISOString() };
      throw error;
    }
  } catch {
    return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null };
  }
};
`;
}

function createTriSandbox(): TriSandbox {
  // Root in /tmp: an in-repo root would inherit mcp_server's "type": "module"
  // package scope, which crashes the CommonJS `.js` stub children at startup.
  // A short prefix also keeps derived socket paths under Darwin's sun_path limit.
  const root = mkdtempSync('/tmp/tri-');
  const binDir = join(root, '.opencode/bin');
  const binLibDir = join(binDir, 'lib');
  mkdirSync(binLibDir, { recursive: true });
  for (const fileName of [
    'spec-memory.cjs',
    'code-index.cjs',
    'skill-advisor.cjs',
    'mk-spec-memory-launcher.cjs',
    'mk-code-index-launcher.cjs',
    'mk-skill-advisor-launcher.cjs',
  ]) {
    copyFileSync(join(repoRoot, '.opencode/bin', fileName), join(binDir, fileName));
  }
  cpSync(join(repoRoot, '.opencode/bin/lib'), binLibDir, { recursive: true });
  writeExecutable(join(binDir, 'daemon-holder.js'), holderSource());

  const specMemoryDbDir = join(root, '.opencode/skills/system-spec-kit/mcp_server/database');
  const codeIndexDbDir = join(root, 'runtime/code-graph-db');
  const skillAdvisorDbDir = join(root, 'runtime/skill-advisor-db');
  const socketRoot = mkdtempSync('/tmp/trid-');
  const specSocketDir = join(socketRoot, 'm');
  const codeSocketDir = join(socketRoot, 'c');
  const advisorSocketDir = join(socketRoot, 'a');
  const memoryDbPath = join(root, 'runtime/memory.sqlite');
  const specChildPidFile = join(root, 'runtime/spec-memory-child.pid');
  const codeChildPidFile = join(root, 'runtime/code-index-child.pid');
  const advisorChildPidFile = join(root, 'runtime/skill-advisor-child.pid');
  const advisorDaemonLeaseFile = join(skillAdvisorDbDir, 'skill-graph-daemon-lease.sqlite');
  const advisorOwnerLeaseFile = join(skillAdvisorDbDir, '.skill-advisor-owner.json');
  const advisorLeaseModulePath = join(root, '.opencode/skills/system-skill-advisor/mcp_server/dist/mcp_server/lib/daemon/lease.js');

  for (const dir of [
    specMemoryDbDir,
    codeIndexDbDir,
    skillAdvisorDbDir,
    specSocketDir,
    codeSocketDir,
    advisorSocketDir,
  ]) {
    mkdirSync(dir, { recursive: true, mode: 0o700 });
  }

  writeExecutable(
    join(root, '.opencode/skills/system-spec-kit/mcp_server/dist/spec-memory-cli.js'),
    stubCliSource('../../../../..', 'mk-spec-memory-launcher.cjs', 'mk-spec-memory'),
  );
  writeExecutable(
    join(root, '.opencode/skills/system-code-graph/mcp_server/dist/code-index-cli.js'),
    stubCliSource('../../../../..', 'mk-code-index-launcher.cjs', 'mk-code-index'),
  );
  writeExecutable(
    join(root, '.opencode/skills/system-skill-advisor/mcp_server/dist/mcp_server/skill-advisor-cli.js'),
    stubCliSource('../../../../../..', 'mk-skill-advisor-launcher.cjs', 'mk-skill-advisor'),
  );
  writeFileSync(
    join(root, '.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js'),
    longRunningServerSource(specChildPidFile),
    'utf8',
  );
  // The spec-memory launcher checks these scripts artifacts for existence at
  // boot and runs a real npm install/build in the sandbox when they are missing.
  for (const scriptArtifact of [
    'scripts/dist/graph/backfill-graph-metadata.js',
    'scripts/dist/spec-folder/generate-description.js',
  ]) {
    writeExecutable(join(root, '.opencode/skills/system-spec-kit', scriptArtifact), '');
  }
  writeFileSync(
    join(root, '.opencode/skills/system-code-graph/mcp_server/dist/index.js'),
    longRunningServerSource(codeChildPidFile),
    'utf8',
  );
  writeFileSync(
    join(root, '.opencode/skills/system-skill-advisor/mcp_server/dist/mcp_server/advisor-server.js'),
    longRunningServerSource(
      advisorChildPidFile,
      `fs.mkdirSync(${JSON.stringify(skillAdvisorDbDir)}, { recursive: true });\nfs.writeFileSync(${JSON.stringify(advisorDaemonLeaseFile)}, JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }));`,
    ),
    'utf8',
  );
  mkdirSync(dirname(advisorLeaseModulePath), { recursive: true });
  writeFileSync(advisorLeaseModulePath, advisorLeaseModuleSource(), 'utf8');

  const sandbox = {
    root,
    specMemoryShim: join(binDir, 'spec-memory.cjs'),
    codeIndexShim: join(binDir, 'code-index.cjs'),
    skillAdvisorShim: join(binDir, 'skill-advisor.cjs'),
    specMemoryDbDir,
    codeIndexDbDir,
    skillAdvisorDbDir,
    specSocketDir,
    codeSocketDir,
    advisorSocketDir,
    socketRoot,
    memoryDbPath,
    specChildPidFile,
    codeChildPidFile,
    advisorChildPidFile,
    advisorDaemonLeaseFile,
    advisorOwnerLeaseFile,
  };
  sandboxes.push(sandbox);
  return sandbox;
}

function serviceEnv(sandbox: TriSandbox, socketDir: string): NodeJS.ProcessEnv {
  return {
    ...process.env,
    SPECKIT_DAEMON_REELECTION: 'on',
    SPECKIT_IPC_SOCKET_DIR: socketDir,
    MEMORY_DB_PATH: sandbox.memoryDbPath,
    SPECKIT_CODE_GRAPH_DB_DIR: sandbox.codeIndexDbDir,
    MK_SKILL_ADVISOR_DB_DIR: sandbox.skillAdvisorDbDir,
    SPECKIT_LEASE_PROBE_RETRIES: '1',
    SPECKIT_PROBE_TIMEOUT_MS: '250',
    SPECKIT_LEASE_PROBE_RETRY_TIMEOUT_MS: '100',
    SPECKIT_LEASE_PROBE_RETRY_BACKOFF_MS: '10',
  };
}

function spawnShim(shimPath: string, args: readonly string[], env: NodeJS.ProcessEnv, cwd: string): AsyncRun {
  const run: AsyncRun = {
    child: spawn(process.execPath, [shimPath, ...args], {
      cwd,
      env,
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
  runs.push(run);
  return run;
}

async function waitForRun(run: AsyncRun, timeoutMs: number): Promise<{ code: number | null; signal: NodeJS.Signals | null }> {
  if (run.child.exitCode !== null || run.child.signalCode !== null) {
    return { code: run.child.exitCode, signal: run.child.signalCode };
  }
  return await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timed out waiting for shim pid ${run.child.pid}`)), timeoutMs);
    run.child.once('exit', (code, signal) => {
      clearTimeout(timer);
      resolve({ code, signal });
    });
  });
}

function readPidFile(filePath: string): number | null {
  try {
    const parsed = Number.parseInt(readFileSync(filePath, 'utf8').trim(), 10);
    return Number.isInteger(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function specLauncherLeasePath(sandbox: TriSandbox): string {
  return join(sandbox.specMemoryDbDir, '.mk-spec-memory-launcher.json');
}

function specOwnerLeasePath(sandbox: TriSandbox): string {
  return join(sandbox.specMemoryDbDir, '.spec-memory-owner.json');
}

function codeLauncherLeasePath(sandbox: TriSandbox): string {
  return join(sandbox.codeIndexDbDir, '.mk-code-index-launcher.json');
}

function codeOwnerLeasePath(sandbox: TriSandbox): string {
  return join(sandbox.codeIndexDbDir, '.code-graph-owner.json');
}

function advisorLauncherLeasePath(sandbox: TriSandbox): string {
  return join(sandbox.skillAdvisorDbDir, '.mk-skill-advisor-launcher.json');
}

function advisorOwnerLeasePath(sandbox: TriSandbox): string {
  return sandbox.advisorOwnerLeaseFile;
}

function leasePid(filePath: string, field: 'pid' | 'ownerPid' | 'childPid'): number | null {
  const lease = readJsonFile<Record<string, unknown>>(filePath);
  return typeof lease?.[field] === 'number' ? lease[field] : null;
}

async function cleanup(): Promise<void> {
  for (const run of runs.splice(0)) {
    if (run.child.pid) await terminatePidTree(run.child.pid);
  }
  for (const sandbox of sandboxes.splice(0)) {
    const pids = [
      leasePid(specLauncherLeasePath(sandbox), 'pid'),
      leasePid(specLauncherLeasePath(sandbox), 'childPid'),
      leasePid(specOwnerLeasePath(sandbox), 'ownerPid'),
      leasePid(codeLauncherLeasePath(sandbox), 'pid'),
      leasePid(codeOwnerLeasePath(sandbox), 'ownerPid'),
      leasePid(advisorLauncherLeasePath(sandbox), 'pid'),
      leasePid(advisorOwnerLeasePath(sandbox), 'ownerPid'),
      readPidFile(sandbox.specChildPidFile),
      readPidFile(sandbox.codeChildPidFile),
      readPidFile(sandbox.advisorChildPidFile),
    ];
    for (const pid of pids) {
      await terminatePidTree(pid);
    }
    await waitFor(() => countProcessesMatching(sandbox.root) === 0, 5000, 'tri-daemon process cleanup').catch(() => undefined);
    rmSync(sandbox.root, { recursive: true, force: true });
    rmSync(sandbox.socketRoot, { recursive: true, force: true });
  }
}

afterEach(async () => {
  await cleanup();
});

describeTriDaemon('tri-daemon-drill program gate', () => {
  it('spawns all three CLI shims with isolated owners and divergent SIGTERM behavior', async () => {
    const sandbox = createTriSandbox();
    const specRun = spawnShim(
      sandbox.specMemoryShim,
      ['memory_health', '--format', 'json'],
      serviceEnv(sandbox, sandbox.specSocketDir),
      sandbox.root,
    );
    const codeRun = spawnShim(
      sandbox.codeIndexShim,
      ['code_graph_status', '--format', 'json'],
      serviceEnv(sandbox, sandbox.codeSocketDir),
      sandbox.root,
    );
    const advisorRun = spawnShim(
      sandbox.skillAdvisorShim,
      ['advisor_status', '--workspace-root', sandbox.root, '--format', 'json'],
      serviceEnv(sandbox, sandbox.advisorSocketDir),
      sandbox.root,
    );

    const exits = await Promise.all([
      waitForRun(specRun, 5000),
      waitForRun(codeRun, 5000),
      waitForRun(advisorRun, 5000),
    ]);
    expect(exits.map((exit) => exit.code)).toEqual([0, 0, 0]);
    await waitFor(() => existsSync(specOwnerLeasePath(sandbox)), 5000, 'spec-memory owner lease');
    await waitFor(() => existsSync(codeOwnerLeasePath(sandbox)), 5000, 'code-index owner lease');
    await waitFor(() => existsSync(advisorLauncherLeasePath(sandbox)), 5000, 'skill-advisor launcher lease');
    await waitFor(() => existsSync(advisorOwnerLeasePath(sandbox)), 5000, 'skill-advisor owner lease');
    await waitFor(() => existsSync(sandbox.advisorDaemonLeaseFile), 5000, 'skill-advisor daemon lease');

    expect(leasePid(specOwnerLeasePath(sandbox), 'ownerPid')).toEqual(expect.any(Number));
    expect(leasePid(codeOwnerLeasePath(sandbox), 'ownerPid')).toEqual(expect.any(Number));
    expect(leasePid(advisorLauncherLeasePath(sandbox), 'pid')).toEqual(expect.any(Number));
    expect(leasePid(advisorOwnerLeasePath(sandbox), 'ownerPid')).toEqual(expect.any(Number));
    expect(existsSync(join(sandbox.specMemoryDbDir, '.mk-spec-memory-launcher.lockdir'))).toBe(false);
    expect(existsSync(join(sandbox.codeIndexDbDir, '.mk-code-index-launcher.lockdir'))).toBe(false);
    expect(existsSync(join(sandbox.skillAdvisorDbDir, '.mk-skill-advisor-launcher.lockdir'))).toBe(false);

    const specLauncherPid = leasePid(specLauncherLeasePath(sandbox), 'pid');
    const specChildPid = leasePid(specLauncherLeasePath(sandbox), 'childPid');
    expect(specLauncherPid).toEqual(expect.any(Number));
    expect(specChildPid).toEqual(expect.any(Number));
    process.kill(specChildPid as number, 'SIGTERM');
    await waitFor(() => {
      const nextChildPid = leasePid(specLauncherLeasePath(sandbox), 'childPid');
      return typeof nextChildPid === 'number' && nextChildPid !== specChildPid;
    }, 10_000, 'spec-memory child recycle');
    expect(processLive(specLauncherPid)).toBe(true);

    const codeLauncherPid = leasePid(codeLauncherLeasePath(sandbox), 'pid');
    const codeChildPid = leasePid(codeOwnerLeasePath(sandbox), 'ownerPid');
    expect(codeLauncherPid).toEqual(expect.any(Number));
    expect(codeChildPid).toEqual(expect.any(Number));
    process.kill(codeChildPid as number, 'SIGTERM');
    await waitForPidExit(codeLauncherPid as number, 10_000);

    const advisorLauncherPid = leasePid(advisorLauncherLeasePath(sandbox), 'pid');
    const advisorChildPid = readPidFile(sandbox.advisorChildPidFile);
    expect(advisorLauncherPid).toEqual(expect.any(Number));
    expect(advisorChildPid).toEqual(expect.any(Number));
    process.kill(advisorChildPid as number, 'SIGTERM');
    await waitForPidExit(advisorLauncherPid as number, 10_000);

    await cleanup();
    expect(countProcessesMatching(sandbox.root)).toBe(0);
  }, 60_000);
});
