import { spawn, type ChildProcess, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { copyFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

// These paths are test fixtures coupled to the production launcher layout.
// If a launcher moves, update the fixture path and copied production file together.
//
// The fixture must copy the launcher's local lib/ tree alongside the launcher: the launcher
// requires ./lib/model-server-supervision.cjs, ./lib/launcher-session-proxy.cjs, and
// ./lib/launcher-ipc-bridge.cjs at load time. Copying only the launcher .cjs makes every spawned
// launcher die with MODULE_NOT_FOUND before it writes a lease — the earlier "process lifecycle
// flake" was actually this hard, deterministic boot failure.

interface LauncherRun {
  child: ChildProcessWithoutNullStreams;
  stdout: string;
  stderr: string;
}

interface Workspace {
  root: string;
  launcherPath: string;
  pidFilePath: string;
  socketDir: string;
}

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../..');
const launcherRelativePath = '.opencode/bin/mk-spec-memory-launcher.cjs';
const libRelativeDir = '.opencode/bin/lib';
const pidFileRelativePath = '.opencode/skills/system-spec-kit/mcp_server/database/.mk-spec-memory-launcher.json';
const SOCKET_FILE_NAME = 'daemon-ipc.sock';
const tempDirs: string[] = [];
const launcherRuns: LauncherRun[] = [];

// Stub context-server bodies. The launcher spawns dist/context-server.js as its daemon child; the
// integration suite only needs the child to occupy a pid and respond to signals. The socket-binding
// variant additionally listens on SPECKIT_IPC_SOCKET_DIR/daemon-ipc.sock with a minimal JSON-RPC
// echo so the IPC liveness probe (deepProbe) classifies it alive and a secondary launcher bridges.
const STUB_INERT = "process.on('SIGTERM', () => process.exit(0)); process.on('SIGINT', () => process.exit(0)); setInterval(() => {}, 1000);\n";
const STUB_IGNORE_SIGTERM = "process.on('SIGTERM', () => {}); process.on('SIGINT', () => process.exit(0)); setInterval(() => {}, 1000);\n";
const STUB_IPC_DAEMON = `
const net = require('net');
const path = require('path');
const dir = process.env.SPECKIT_IPC_SOCKET_DIR;
if (!dir) { process.on('SIGTERM', () => process.exit(0)); setInterval(() => {}, 1000); return; }
const sockPath = path.join(dir, '${SOCKET_FILE_NAME}');
const server = net.createServer((conn) => {
  let buf = '';
  conn.on('data', (chunk) => {
    buf += chunk.toString('utf8');
    let idx;
    while ((idx = buf.indexOf('\\n')) >= 0) {
      const line = buf.slice(0, idx).trim();
      buf = buf.slice(idx + 1);
      if (!line) continue;
      try {
        const req = JSON.parse(line);
        conn.write(JSON.stringify({ jsonrpc: '2.0', id: req.id, result: {} }) + '\\n');
      } catch { /* ignore malformed frames */ }
    }
  });
  conn.on('error', () => {});
});
server.on('error', () => {});
server.listen(sockPath, () => { process.stderr.write('STUB_DAEMON_LISTENING ' + sockPath + '\\n'); });
process.on('SIGTERM', () => { try { server.close(); } catch {} process.exit(0); });
process.on('SIGINT', () => process.exit(0));
setInterval(() => {}, 1000);
`;

function createWorkspace(options: { childStub?: string } = {}): Workspace {
  const root = mkdtempSync(join(tmpdir(), 'mk-spec-memory-lease-'));
  tempDirs.push(root);

  const launcherPath = join(root, launcherRelativePath);
  mkdirSync(dirname(launcherPath), { recursive: true });
  copyFileSync(join(repoRoot, launcherRelativePath), launcherPath);
  // The launcher require()s ./lib/*.cjs at module-load time; copy the whole lib tree or it dies
  // with MODULE_NOT_FOUND before writing a lease.
  cpSync(join(repoRoot, libRelativeDir), join(root, libRelativeDir), { recursive: true });

  const contextServer = join(root, '.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js');
  const graphBackfill = join(root, '.opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js');
  const descriptionGenerator = join(root, '.opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js');
  mkdirSync(dirname(contextServer), { recursive: true });
  mkdirSync(dirname(graphBackfill), { recursive: true });
  mkdirSync(dirname(descriptionGenerator), { recursive: true });
  writeFileSync(contextServer, options.childStub ?? STUB_INERT, 'utf8');
  writeFileSync(graphBackfill, 'export {};\n', 'utf8');
  writeFileSync(descriptionGenerator, 'export {};\n', 'utf8');

  // Per-test isolated IPC socket dir INSIDE the temp root. Every spawned launcher binds/probes here,
  // never the live /tmp/mk-spec-memory daemon socket. Removed with the temp root in afterEach.
  const socketDir = join(root, 'ipc');
  mkdirSync(socketDir, { recursive: true });

  return { root, launcherPath, pidFilePath: join(root, pidFileRelativePath), socketDir };
}

function spawnLauncher(workspace: Workspace, env: NodeJS.ProcessEnv = {}): LauncherRun {
  const baseEnv = { ...process.env };
  delete baseEnv.MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER;
  delete baseEnv.MK_CODE_INDEX_STRICT_SINGLE_WRITER;
  delete baseEnv.MK_SPEC_MEMORY_STRICT_SINGLE_WRITER;
  // Pin the IPC socket dir per workspace so the recorded lease socketPath and every probe/bridge
  // stay inside the isolated temp root. A caller can override it to model a divergent worktree env.
  baseEnv.SPECKIT_IPC_SOCKET_DIR = workspace.socketDir;

  const run: LauncherRun = {
    child: spawn(process.execPath, [workspace.launcherPath], {
      cwd: workspace.root,
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
    await waitForExit(run.child, 2000);
  } catch {
    run.child.kill('SIGKILL');
    try {
      await waitForExit(run.child, 2000);
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

function readLease(pidFilePath: string): Record<string, unknown> | null {
  try {
    return JSON.parse(readFileSync(pidFilePath, 'utf8')) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function waitForLeasePid(pidFilePath: string, pid: number | undefined): Promise<void> {
  if (typeof pid !== 'number') throw new Error('launcher pid was not assigned');
  await waitFor(() => readLeasePid(pidFilePath) === pid, 8000, `lease pid ${pid}`);
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
  await waitForExit(child, 2000);
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

describe('mk-spec-memory launcher lease', () => {
  afterEach(async () => {
    // Reap every spawned launcher (SIGTERM then SIGKILL) before deleting temp dirs so the run never
    // leaks launcher/daemon processes.
    while (launcherRuns.length > 0) {
      const run = launcherRuns.pop();
      if (run) await terminate(run);
    }
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  // duplicate launcher exits before opening SQLite.
  it('exits with LEASE_HELD_BY when a live owner exists', async () => {
    const workspace = createWorkspace();
    const first = spawnLauncher(workspace);
    await waitForLeasePid(workspace.pidFilePath, first.child.pid);

    // Second launcher in the SAME socket dir: the owner's stub child binds nothing, so the bridge
    // probe finds no socket, falls through to the plaintext LEASE_HELD_BY diagnostic, and exits.
    const second = spawnLauncher(workspace, { SPECKIT_LAUNCHER_BRIDGE_DISABLED: '1' });
    await waitForStdoutClose(second);
    const exit = await waitForExit(second.child, 10000);

    expect(exit.code).toBe(0);
    expect(second.stdout).toContain(`LEASE_HELD_BY:${first.child.pid}`);
    expect(second.stdout).toMatch(new RegExp(`^LEASE_HELD_BY:${first.child.pid} startedAt=\\d{4}-\\d{2}-\\d{2}T`, 'm'));
  });

  // live-owner diagnostics include the recorded startedAt value.
  it('reports the lease startedAt value for a live owner', async () => {
    const workspace = createWorkspace();
    const holder = await createLivePid();
    const startedAt = '2026-05-18T00:00:00.000Z';

    try {
      mkdirSync(dirname(workspace.pidFilePath), { recursive: true });
      writeFileSync(workspace.pidFilePath, JSON.stringify({ pid: holder.pid, startedAt }));

      // No socketPath in the planted lease + bridge disabled -> deterministic plaintext diagnostic.
      const run = spawnLauncher(workspace, { SPECKIT_LAUNCHER_BRIDGE_DISABLED: '1' });
      await waitForStdoutClose(run);
      const exit = await waitForExit(run.child, 10000);

      expect(exit.code).toBe(0);
      expect(run.stdout).toContain(`LEASE_HELD_BY:${holder.pid} startedAt=${startedAt}`);
    } finally {
      holder.kill('SIGTERM');
      try {
        await waitForExit(holder, 2000);
      } catch {
        holder.kill('SIGKILL');
      }
    }
  });

  // dead-PID lease files are reclaimable.
  it('reclaims a dead-pid lease file and logs staleReclaimed', async () => {
    const workspace = createWorkspace();
    mkdirSync(dirname(workspace.pidFilePath), { recursive: true });
    writeFileSync(workspace.pidFilePath, JSON.stringify({ pid: await createDeadPid(), startedAt: new Date().toISOString() }));

    const run = spawnLauncher(workspace);
    await waitFor(() => /^.*staleReclaimed: true\b/m.test(run.stderr), 8000, 'stale reclaim log');
    expect(run.stderr).toMatch(/^.*staleReclaimed: true\b/m);
    await waitForLeasePid(workspace.pidFilePath, run.child.pid);

    expect(readLeasePid(workspace.pidFilePath)).toBe(run.child.pid);
  });

  // clean child exit removes the lease file.
  it('removes the PID file on clean exit', async () => {
    const workspace = createWorkspace();
    const run = spawnLauncher(workspace);
    await waitForLeasePid(workspace.pidFilePath, run.child.pid);

    run.child.kill('SIGTERM');
    await waitForExit(run.child, 8000);

    expect(existsSync(workspace.pidFilePath)).toBe(false);
  });

  // SIGQUIT follows the same lease cleanup path.
  it('removes the PID file on SIGQUIT', async () => {
    const workspace = createWorkspace();
    const run = spawnLauncher(workspace);
    await waitForLeasePid(workspace.pidFilePath, run.child.pid);

    run.child.kill('SIGQUIT');
    await waitForExit(run.child, 8000);

    expect(existsSync(workspace.pidFilePath)).toBe(false);
  });

  // live legacy launcher lease blocks rolling-start duplicates.
  it('reports LEASE_HELD_BY from the legacy launcher lease path', async () => {
    const workspace = createWorkspace();
    const holder = await createLivePid();
    const startedAt = '2026-05-18T00:00:00.000Z';
    const legacyPath = join(
      workspace.root,
      '.opencode',
      'skill',
      'system-spec-kit',
      'mcp_server',
      'database',
      '.mk-spec-memory-launcher.json',
    );

    try {
      mkdirSync(dirname(legacyPath), { recursive: true });
      writeFileSync(legacyPath, JSON.stringify({ pid: holder.pid, startedAt }));

      const run = spawnLauncher(workspace, { SPECKIT_LAUNCHER_BRIDGE_DISABLED: '1' });
      await waitForStdoutClose(run);
      const exit = await waitForExit(run.child, 10000);

      expect(exit.code).toBe(0);
      expect(run.stdout).toContain(`LEASE_HELD_BY:${holder.pid} startedAt=${startedAt} (legacy path)`);
    } finally {
      holder.kill('SIGTERM');
      try {
        await waitForExit(holder, 2000);
      } catch {
        holder.kill('SIGKILL');
      }
    }
  });

  // parent SIGTERM backstop clears lease when child ignores SIGTERM.
  it('removes the PID file when the child ignores SIGTERM until the SIGKILL backstop', async () => {
    const workspace = createWorkspace({ childStub: STUB_IGNORE_SIGTERM });
    const run = spawnLauncher(workspace);
    await waitForLeasePid(workspace.pidFilePath, run.child.pid);

    run.child.kill('SIGTERM');
    await waitForExit(run.child, 10000);

    expect(existsSync(workspace.pidFilePath)).toBe(false);
  });

  // strict single-writer can be disabled for intentional parallel runs.
  it('boots a sibling when strict single-writer is disabled', async () => {
    const workspace = createWorkspace();
    const first = spawnLauncher(workspace);
    await waitForLeasePid(workspace.pidFilePath, first.child.pid);

    const second = spawnLauncher(workspace, {
      MK_SPEC_MEMORY_STRICT_SINGLE_WRITER: '0',
    });
    await waitForLeasePid(workspace.pidFilePath, second.child.pid);

    expect(second.child.exitCode).toBeNull();
    expect(second.stderr).toContain('MK_SPEC_MEMORY_STRICT_SINGLE_WRITER is disabled; skipping lease check');
    expect(existsSync(workspace.pidFilePath)).toBe(true);
  });

  // End-to-end lease.socketPath: a real spawned owner records its actual IPC socket path in the lease,
  // and a secondary launcher under a DIVERGENT SPECKIT_IPC_SOCKET_DIR prefers that stored path (bridges)
  // instead of recomputing a divergent path that would false-report no-bridge-socket. The owner's
  // stub context-server binds the JSON-RPC socket so the liveness deepProbe classifies it alive.
  it('records the owner socketPath and lets a divergent-env launcher bridge to it', async () => {
    const owner = createWorkspace({ childStub: STUB_IPC_DAEMON });
    const first = spawnLauncher(owner);
    await waitForLeasePid(owner.pidFilePath, first.child.pid);

    // Mirror production's path.resolve so the strict equality holds even where the
    // temp root is symlinked (e.g. /tmp -> /private/tmp); the launcher stores a resolved path.
    const ownerSocket = join(resolve(owner.socketDir), SOCKET_FILE_NAME);
    const lease = readLease(owner.pidFilePath);
    expect(lease?.socketPath).toBe(ownerSocket);

    // The owner's stub daemon must actually be listening before a bridge can succeed.
    await waitFor(() => existsSync(ownerSocket), 10000, 'owner daemon socket bound');
    await waitFor(() => first.stderr.includes('STUB_DAEMON_LISTENING'), 10000, 'owner daemon listening log');

    // Secondary launcher: SAME workspace root (reads the same lease file) but a DIVERGENT socket dir.
    // If the bridge recomputed from this dir it would find no socket and report no-bridge-socket;
    // honoring the stored socketPath makes it bridge to the owner's real socket instead.
    const divergentSocketDir = mkdtempSync(join(tmpdir(), 'mk-spec-memory-divergent-'));
    tempDirs.push(divergentSocketDir);
    const second = spawnLauncher(owner, { SPECKIT_IPC_SOCKET_DIR: divergentSocketDir });

    await waitFor(
      () => /bridging to lease holder|no-bridge-socket|failed liveness probe/.test(second.stderr),
      12000,
      'secondary bridge decision',
    );

    // Prefers the stored owner socket, not the divergent recompute.
    expect(second.stderr).toContain(`bridging to lease holder pid=${first.child.pid} socket=${ownerSocket}`);
    expect(second.stderr).not.toMatch(/no-bridge-socket/);
    expect(second.stderr).not.toContain(join(divergentSocketDir, SOCKET_FILE_NAME));
  });
});
