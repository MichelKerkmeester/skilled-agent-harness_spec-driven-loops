// ───────────────────────────────────────────────────────────────
// DURABILITY: daemon re-election RELEASE-vs-KILL (real OS-level integration)
// ───────────────────────────────────────────────────────────────
//
// Validates the OS-level contract the re-election feature depends on: with the
// flag ON, when the OWNER disposes (SIGTERM) it RELEASES the detached daemon
// (leaves it alive for a secondary to adopt); with the flag OFF it KILLS the
// daemon. It uses the REAL exported production decision functions from the
// launcher — contextServerSpawnIo() and shouldReleaseDaemonForReelection() —
// driving a real detached child and real SIGTERM/reparent semantics.
//
// SAFETY: this never imports config, never opens any sqlite, and never reads
// or writes a lease file or the IPC socket. The launcher's lease/socket dir is
// hardcoded relative to its own script location with no env override, so spawning
// the real repo launcher would bridge to (or clobber) the LIVE owner. Instead a
// throwaway "owner" harness in an OS temp dir spawns a trivial sleeper "daemon"
// stand-in using the real spawn-io the feature produces. Only processes this test
// starts are signalled, tracked by pid, and force-reaped in teardown.

import { spawn, type ChildProcess } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
// stress-test/durability/<file> -> repo root is six levels up.
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../../..');
const launcherPath = join(repoRoot, '.opencode/bin/mk-spec-memory-launcher.cjs');

// The real production primitives under test. require() is side-effect-free here:
// the launcher only runs main() under `require.main === module`, never on import.
const launcher = require(launcherPath) as {
  daemonReelectionEnabled: (env?: Record<string, string | undefined>) => boolean;
  contextServerSpawnIo: (enabled: boolean) => { detached: boolean; stdio: [string, string, string] };
  shouldReleaseDaemonForReelection: (a?: { enabled?: boolean; hasLiveDaemon?: boolean }) => boolean;
};

// A throwaway owner harness. It requires the REAL launcher, computes spawn-io and
// the release-vs-kill decision from the production functions, spawns a trivial
// long-lived "daemon" (a sleeper), prints its pid, and stays alive until SIGTERM.
// On SIGTERM it applies the real decision: release (don't kill) or kill.
const OWNER_HARNESS = String.raw`
'use strict';
const { spawn } = require('node:child_process');
const launcher = require(process.env.LAUNCHER_PATH);

const enabled = launcher.daemonReelectionEnabled(process.env);
const io = launcher.contextServerSpawnIo(enabled);

// Trivial daemon stand-in: a sleeper that keeps its own event loop alive.
const daemon = spawn(process.execPath, ['-e', 'setInterval(() => {}, 2147483647)'], {
  detached: io.detached,
  stdio: io.stdio,
});
// Re-election only: don't keep the detached daemon tethered to the owner (mirrors the launcher's unref()).
if (enabled) daemon.unref();

// Keep the owner alive and "owning" until it is disposed, independent of the daemon ref.
const keepAlive = setInterval(() => {}, 2147483647);

let shuttingDown = false;
function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  clearInterval(keepAlive);
  const hasLiveDaemon = daemon.exitCode === null && daemon.signalCode === null && typeof daemon.pid === 'number';
  if (launcher.shouldReleaseDaemonForReelection({ enabled, hasLiveDaemon })) {
    // RELEASE: leave the detached daemon alive for a secondary to adopt; just exit.
    process.stdout.write('RELEASED\n', () => process.exit(0));
  } else {
    // KILL: tear the daemon down, matching the non-reelection shutdown path.
    try { daemon.kill('SIGTERM'); } catch (_) {}
    process.stdout.write('KILLED\n', () => process.exit(0));
  }
}
for (const s of ['SIGTERM', 'SIGINT']) process.on(s, shutdown);

// Announce readiness only once the daemon is live and handlers are installed.
process.stdout.write('DAEMON_PID:' + daemon.pid + '\n');
`;

const BOOT_TIMEOUT_MS = 15_000;
const DEATH_TIMEOUT_MS = 8_000;
const SURVIVAL_CONFIRM_MS = 2_000;

let workDir: string;
let harnessPath: string;
const trackedPids = new Set<number>();

function track(pid: number | undefined): void {
  if (typeof pid === 'number' && pid > 0) trackedPids.add(pid);
}

function isAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    // EPERM = the process exists but we may not signal it -> still alive.
    return (err as NodeJS.ErrnoException).code === 'EPERM';
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForDeath(pid: number, timeoutMs: number): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (!isAlive(pid)) return true;
    await delay(50);
  }
  return !isAlive(pid);
}

function waitForOwnerExit(owner: ChildProcess, timeoutMs: number): Promise<void> {
  return new Promise((resolveExit, rejectExit) => {
    if (owner.exitCode !== null || owner.signalCode !== null) return resolveExit();
    const timer = setTimeout(() => rejectExit(new Error('owner did not exit in time')), timeoutMs);
    owner.once('exit', () => {
      clearTimeout(timer);
      resolveExit();
    });
  });
}

// Spawn the owner harness and resolve with { owner, daemonPid } once it prints DAEMON_PID.
function spawnOwner(enabled: boolean): Promise<{ owner: ChildProcess; daemonPid: number }> {
  const owner = spawn(process.execPath, [harnessPath], {
    cwd: workDir,
    env: {
      ...process.env,
      LAUNCHER_PATH: launcherPath,
      SPECKIT_DAEMON_REELECTION: enabled ? '1' : '0',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  track(owner.pid);

  return new Promise((resolveSpawn, rejectSpawn) => {
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      rejectSpawn(new Error(`owner never reported DAEMON_PID in ${BOOT_TIMEOUT_MS}ms; stderr: ${stderr}`));
    }, BOOT_TIMEOUT_MS);

    owner.stdout!.setEncoding('utf8');
    owner.stderr!.setEncoding('utf8');
    owner.stderr!.on('data', (chunk) => { stderr += chunk; });
    owner.stdout!.on('data', (chunk) => {
      stdout += chunk;
      const m = stdout.match(/DAEMON_PID:(\d+)/);
      if (m) {
        clearTimeout(timer);
        const daemonPid = Number(m[1]);
        track(daemonPid);
        resolveSpawn({ owner, daemonPid });
      }
    });
    owner.once('error', (err) => { clearTimeout(timer); rejectSpawn(err); });
  });
}

beforeAll(() => {
  workDir = mkdtempSync(join(tmpdir(), 'speckit-reelect-'));
  harnessPath = join(workDir, 'owner-harness.cjs');
  writeFileSync(harnessPath, OWNER_HARNESS, 'utf8');
});

afterEach(async () => {
  // Force-reap ONLY processes this test started (owner + daemon stand-in). The
  // detached flag-ON daemon has reparented to init, so SIGKILL by pid is required.
  for (const pid of trackedPids) {
    try { process.kill(pid, 'SIGKILL'); } catch (_) { /* already gone */ }
  }
  // Give the OS a moment to release the reaped pids before the next case.
  await delay(100);
  trackedPids.clear();
});

afterAll(() => {
  rmSync(workDir, { recursive: true, force: true });
});

describe('daemon re-election: real release-vs-kill integration', () => {
  it('uses the real exported production primitives (not a mock)', () => {
    expect(typeof launcher.contextServerSpawnIo).toBe('function');
    expect(typeof launcher.shouldReleaseDaemonForReelection).toBe('function');
    expect(launcher.daemonReelectionEnabled({ SPECKIT_DAEMON_REELECTION: '1' })).toBe(true);
    expect(launcher.contextServerSpawnIo(true)).toEqual({ detached: true, stdio: ['ignore', 'ignore', 'ignore'] });
    expect(launcher.contextServerSpawnIo(false)).toEqual({ detached: false, stdio: ['ignore', 'ignore', 'inherit'] });
  });

  it('flag ON: owner SIGTERM RELEASES the detached daemon (it survives)', async () => {
    const { owner, daemonPid } = await spawnOwner(true);
    expect(isAlive(daemonPid)).toBe(true);

    owner.kill('SIGTERM');
    await waitForOwnerExit(owner, DEATH_TIMEOUT_MS);

    // The released daemon must outlive its owner. Confirm it stays alive across a window.
    await delay(SURVIVAL_CONFIRM_MS);
    expect(isAlive(daemonPid)).toBe(true);
    expect(isAlive(owner.pid!)).toBe(false);
  });

  it('flag OFF: owner SIGTERM KILLS the daemon (it dies)', async () => {
    const { owner, daemonPid } = await spawnOwner(false);
    expect(isAlive(daemonPid)).toBe(true);

    owner.kill('SIGTERM');
    await waitForOwnerExit(owner, DEATH_TIMEOUT_MS);

    const died = await waitForDeath(daemonPid, DEATH_TIMEOUT_MS);
    expect(died).toBe(true);
    expect(isAlive(owner.pid!)).toBe(false);
  });
});
