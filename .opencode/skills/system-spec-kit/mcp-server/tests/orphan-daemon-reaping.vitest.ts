import { createRequire } from 'node:module';
import { spawn, type ChildProcess } from 'node:child_process';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { buildHarnessSnapshot } from '../../scripts/ops/process-memory-harness.js';
import { applySweep, planSweep, type SweepOwnershipEvidence } from '../../scripts/ops/process-sweep.js';

const require = createRequire(import.meta.url);
const launcherPath = fileURLToPath(new URL('../../../../bin/system-spec-memory-launcher.cjs', import.meta.url));
const launcher = require(launcherPath) as {
  installStdinCloseHandler: (input: NodeJS.ReadableStream, shutdown: () => unknown, logger?: (message: string) => void) => () => void;
  isRespawnLockStale: (raw: string, options?: Record<string, unknown>) => boolean;
};

const childFixtureCode = `
  const fs = require('node:fs');
  const path = require('node:path');
  const dir = process.argv[1];
  const statePath = path.join(dir, 'state.json');
  const lockPath = path.join(dir, 'respawn.lock');
  const startedAt = new Date().toISOString();
  const writeState = (terminated = false) => fs.writeFileSync(statePath, JSON.stringify({
    pid: process.pid,
    ppid: process.ppid,
    startedAt,
    terminated,
  }));
  fs.writeFileSync(lockPath, JSON.stringify({ pid: process.pid, startedAt }));
  writeState();
  setInterval(() => writeState(), 20);
  process.on('SIGTERM', () => {
    try { fs.unlinkSync(lockPath); } catch {}
    writeState(true);
    process.exit(0);
  });
`;

const orphanParentCode = `
  const fs = require('node:fs');
  const { spawn } = require('node:child_process');
  const child = spawn(process.execPath, ['-e', ${JSON.stringify(childFixtureCode)}, process.argv[1]], {
    stdio: 'ignore',
    detached: true,
  });
  fs.writeFileSync(process.argv[2], String(child.pid));
  child.unref();
`;

const fixtures: Array<{ child: ChildProcess; dir: string }> = [];

async function waitFor(predicate: () => boolean, timeoutMs = 3000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (predicate()) return;
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 20));
  }
  throw new Error('fixture did not reach the expected state before timeout');
}

function isAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function spawnFixture(orphan: boolean): { child: ChildProcess; dir: string } {
  const dir = mkdtempSync(join(tmpdir(), 'orphan-daemon-reaping-'));
  if (orphan) {
    const childPidPath = join(dir, 'child.pid');
    const parent = spawn(process.execPath, ['-e', orphanParentCode, dir, childPidPath], { stdio: 'ignore' });
    const fixture = { child: parent, dir };
    fixtures.push(fixture);
    return fixture;
  }
  const child = spawn(process.execPath, ['-e', childFixtureCode, dir], { stdio: 'ignore' });
  const fixture = { child, dir };
  fixtures.push(fixture);
  return fixture;
}

function fixturePid(dir: string): number {
  return Number(readFileSync(join(dir, 'child.pid'), 'utf8').trim());
}

function fixtureEvidence(dir: string, pid: number, nowMs: number): SweepOwnershipEvidence {
  const ownerLeasePath = join(dir, '.spec-memory-owner.json');
  const startedAtMs = nowMs - 600001;
  writeFileSync(ownerLeasePath, JSON.stringify({
    ownerPid: pid,
    canonicalDbDir: dir,
    startedAtIso: new Date(startedAtMs).toISOString(),
  }));
  return {
    pid,
    ownerPid: pid,
    launcherPath,
    ownerLeasePath,
    canonicalDbDir: dir,
    ownerLeaseStartedAtMs: startedAtMs,
    processStartedAtMs: startedAtMs,
    socketPeerConnected: false,
  };
}

function fixtureInventory(pid: number, ppid: number, command = launcherPath, currentPid = process.pid) {
  return buildHarnessSnapshot({
    psOutput: `  PID  PPID STAT RSS COMMAND\n ${pid} ${ppid} S 1000 ${command}\n`,
    vmStatOutput: 'Mach Virtual Memory Statistics: (page size of 16384 bytes)\nPages free: 1.\n',
    currentPid,
  });
}

async function stopFixture(fixture: { child: ChildProcess; dir: string }): Promise<void> {
  const pids = new Set<number>();
  if (fixture.child.pid && isAlive(fixture.child.pid)) pids.add(fixture.child.pid);
  const childPidPath = join(fixture.dir, 'child.pid');
  if (existsSync(childPidPath)) {
    const orphanPid = Number(readFileSync(childPidPath, 'utf8').trim());
    if (Number.isInteger(orphanPid) && orphanPid > 0 && isAlive(orphanPid)) pids.add(orphanPid);
  }
  for (const pid of pids) {
    process.kill(pid, 'SIGTERM');
  }
  if (pids.size > 0) {
    await waitFor(() => [...pids].every((pid) => !isAlive(pid)));
  }
  if (existsSync(fixture.dir)) rmSync(fixture.dir, { recursive: true, force: true });
}

afterEach(async () => {
  await Promise.all(fixtures.splice(0).map(stopFixture));
  vi.unstubAllEnvs();
});

describe('orphan daemon reaping', () => {
  it('exits when its stdio peer closes', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'orphan-daemon-stdio-'));
    const readyPath = join(dir, 'ready');
    const closedPath = join(dir, 'closed');
    const child = spawn(process.execPath, ['-e', `
      const fs = require('node:fs');
      const launcher = require(${JSON.stringify(launcherPath)});
      launcher.installStdinCloseHandler(process.stdin, () => {
        fs.writeFileSync(${JSON.stringify(closedPath)}, 'closed');
        process.exit(0);
      }, () => {});
      fs.writeFileSync(${JSON.stringify(readyPath)}, 'ready');
    `], { stdio: ['pipe', 'ignore', 'ignore'] });
    try {
      await waitFor(() => existsSync(readyPath));
      child.stdin?.end();
      await new Promise<void>((resolvePromise, reject) => {
        child.once('exit', () => resolvePromise());
        child.once('error', reject);
      });
      expect(existsSync(closedPath)).toBe(true);
    } finally {
      if (child.pid && isAlive(child.pid)) process.kill(child.pid, 'SIGTERM');
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('uses the existing heartbeat to evaluate the orphan relaunch predicate', async () => {
    const fixture = spawnFixture(false);
    await waitFor(() => existsSync(join(fixture.dir, 'state.json')));
    const source = readFileSync(launcherPath, 'utf8');
    expect(source).toMatch(/startOwnerLeaseHeartbeat[\s\S]*shouldAbortRelaunchOnFire/);
    expect(source).not.toMatch(/setInterval\([^)]*shouldAbortRelaunchOnFire/);
  });

  it('reclaims an aged lock held by a live orphan owner', async () => {
    const fixture = spawnFixture(true);
    await waitFor(() => existsSync(join(fixture.dir, 'child.pid')));
    const pid = fixturePid(fixture.dir);
    await waitFor(() => existsSync(join(fixture.dir, 'state.json'))
      && readFileSync(join(fixture.dir, 'state.json'), 'utf8').includes('"ppid":1'));
    const lock = readFileSync(join(fixture.dir, 'respawn.lock'), 'utf8');
    const state = JSON.parse(readFileSync(join(fixture.dir, 'state.json'), 'utf8')) as { startedAt: string };
    const nowMs = Date.parse(state.startedAt) + 60001;

    expect(launcher.isRespawnLockStale(lock, {
      liveness: () => 'alive',
      parentPid: 1,
      nowMs,
      staleMs: 60000,
    })).toBe(true);
    expect(isAlive(pid)).toBe(true);
  });

  it('reaps only an aged, exactly owned orphan and releases its lock', async () => {
    const fixture = spawnFixture(true);
    await waitFor(() => existsSync(join(fixture.dir, 'child.pid')));
    const pid = fixturePid(fixture.dir);
    await waitFor(() => existsSync(join(fixture.dir, 'state.json'))
      && readFileSync(join(fixture.dir, 'state.json'), 'utf8').includes('"ppid":1'));
    const nowMs = Date.now();
    const inventory = fixtureInventory(pid, 1);
    const plan = planSweep(inventory, { selfPid: process.pid });
    expect(plan.rows.find((row) => row.pid === pid)).toMatchObject({
      classification: 'orphaned-project-daemon',
      eligibleForTermination: true,
    });

    const signals: number[] = [];
    const result = applySweep(inventory, {
      enabled: true,
      selfPid: process.pid,
      nowMs,
      startupGraceMs: 1000,
      evidenceByPid: new Map([[pid, fixtureEvidence(fixture.dir, pid, nowMs)]]),
      getParentPid: () => 1,
      getSocketPeerConnected: () => false,
      signal: (candidatePid, signal) => {
        expect(signal).toBe('SIGTERM');
        signals.push(candidatePid);
        process.kill(candidatePid, signal);
        return true;
      },
    });

    await waitFor(() => !isAlive(pid));
    expect(result.appliedPids).toEqual([pid]);
    expect(signals).toEqual([pid]);
    expect(JSON.parse(readFileSync(join(fixture.dir, 'state.json'), 'utf8'))).toMatchObject({ terminated: true });
    expect(existsSync(join(fixture.dir, 'respawn.lock'))).toBe(false);
  });

  it('never signals a fixture launcher with a live parent', async () => {
    const fixture = spawnFixture(false);
    const pid = fixture.child.pid as number;
    await waitFor(() => existsSync(join(fixture.dir, 'state.json')));
    const nowMs = Date.now();
    const inventory = fixtureInventory(pid, process.pid, launcherPath, 999999);
    const signals: number[] = [];
    const result = applySweep(inventory, {
      enabled: true,
      selfPid: process.pid,
      nowMs,
      startupGraceMs: 1000,
      evidenceByPid: new Map([[pid, fixtureEvidence(fixture.dir, pid, nowMs)]]),
      getParentPid: () => process.pid,
      getSocketPeerConnected: () => false,
      signal: (candidatePid) => {
        signals.push(candidatePid);
        return true;
      },
    });

    expect(result.appliedPids).toEqual([]);
    expect(result.rows.find((row) => row.pid === pid)).toMatchObject({
      classification: 'project-daemon',
      eligibleForTermination: false,
    });
    // A live-parented daemon is now evaluated and explicitly refused rather than filtered out
    // before evaluation. Asserting the recorded reason is stronger than asserting silence: it
    // proves the refusal was a decision, not an omission.
    expect(result.skipped).toEqual([{ pid, reason: 'classification-not-reapable' }]);
    expect(signals).toEqual([]);
    expect(isAlive(pid)).toBe(true);
  });

  it('never signals an orphan with a connected socket peer', async () => {
    const fixture = spawnFixture(true);
    await waitFor(() => existsSync(join(fixture.dir, 'child.pid')));
    const pid = fixturePid(fixture.dir);
    await waitFor(() => existsSync(join(fixture.dir, 'state.json'))
      && readFileSync(join(fixture.dir, 'state.json'), 'utf8').includes('"ppid":1'));
    const nowMs = Date.now();
    const inventory = fixtureInventory(pid, 1);
    const signals: number[] = [];
    const result = applySweep(inventory, {
      enabled: true,
      selfPid: process.pid,
      nowMs,
      startupGraceMs: 1000,
      evidenceByPid: new Map([[pid, { ...fixtureEvidence(fixture.dir, pid, nowMs), socketPeerConnected: true }]]),
      getParentPid: () => 1,
      getSocketPeerConnected: () => true,
      signal: (candidatePid) => {
        signals.push(candidatePid);
        return true;
      },
    });

    expect(result.appliedPids).toEqual([]);
    expect(result.skipped).toEqual([{ pid, reason: 'connected-socket-peer' }]);
    expect(signals).toEqual([]);
    expect(isAlive(pid)).toBe(true);
  });

  it('keeps an orphan alive and reports the kill switch', async () => {
    const fixture = spawnFixture(true);
    await waitFor(() => existsSync(join(fixture.dir, 'child.pid')));
    const pid = fixturePid(fixture.dir);
    await waitFor(() => existsSync(join(fixture.dir, 'state.json'))
      && readFileSync(join(fixture.dir, 'state.json'), 'utf8').includes('"ppid":1'));
    const nowMs = Date.now();
    const inventory = fixtureInventory(pid, 1);
    const result = applySweep(inventory, {
      selfPid: process.pid,
      enabled: false,
      nowMs,
      evidenceByPid: new Map([[pid, fixtureEvidence(fixture.dir, pid, nowMs)]]),
    });

    expect(result.reason).toBe('kill-switch-disabled');
    expect(result.appliedPids).toEqual([]);
    expect(result.skipped).toEqual([{ pid, reason: 'kill-switch-disabled' }]);
    expect(isAlive(pid)).toBe(true);
    expect(existsSync(join(fixture.dir, 'respawn.lock'))).toBe(true);
  });

  it('invokes the ownership-checked sweep at session start', async () => {
    const fixture = spawnFixture(false);
    await waitFor(() => existsSync(join(fixture.dir, 'state.json')));
    const { default: sessionCleanupPlugin } = await import('../../../../plugins/session-cleanup.js');
    const calls: Array<{ command: string; args: string[] }> = [];
    const hooks = await sessionCleanupPlugin(
      { worktree: process.cwd() },
      {
        spawn: () => ({ once: () => undefined, unref: () => undefined }),
        spawnSync: (command: string, args: string[]) => {
          calls.push({ command, args });
          return { status: 0, stdout: '', stderr: '' };
        },
      },
    );

    await hooks.event({ event: { type: 'session.created', properties: { info: { id: 'fixture-session' } } } });
    expect(calls).toHaveLength(4);
    expect(calls[3]).toMatchObject({
      command: process.execPath,
      args: [expect.stringContaining('.opencode/skills/system-spec-kit/scripts/dist/ops/process-sweep.js'), 'apply'],
    });
  });

  it('reports the sweep kill switch without invoking the apply command', async () => {
    const fixture = spawnFixture(false);
    await waitFor(() => existsSync(join(fixture.dir, 'state.json')));
    vi.stubEnv('SPECKIT_SESSION_START_ORPHAN_SWEEP', 'off');
    const { default: sessionCleanupPlugin } = await import('../../../../plugins/session-cleanup.js');
    const calls: string[] = [];
    const diagnostics: string[] = [];
    const hooks = await sessionCleanupPlugin(
      { worktree: process.cwd() },
      {
        spawn: () => ({ once: () => undefined, unref: () => undefined }),
        spawnSync: (command: string) => {
          calls.push(command);
          return { status: 0, stdout: '', stderr: '' };
        },
        writeDiagnostic: (detail: string) => diagnostics.push(detail),
      },
    );

    await hooks.event({ event: { type: 'session.created', properties: { info: { id: 'switch-session' } } } });
    expect(calls).toHaveLength(3);
    expect(diagnostics).toEqual([]);
    const output: { system?: string[] } = { system: [] };
    await hooks['experimental.chat.system.transform']({ sessionID: 'switch-session' }, output);
    expect(output.system?.join('\n')).toContain('kill-switch-disabled');
  });

  // Two regression guards for defects a multi-model review found in the first cut of this
  // sweep. Both are decision-only: a synthetic inventory row plus injected callbacks, so no
  // real process is ever signalled.

  it('refuses to apply when the enable decision is omitted rather than defaulting to execute', () => {
    const dir = mkdtempSync(join(tmpdir(), 'sweep-failclosed-'));
    const pid = 424242;
    const nowMs = Date.now();
    const signals: number[] = [];
    const result = applySweep(fixtureInventory(pid, 1), {
      selfPid: process.pid,
      nowMs,
      startupGraceMs: 1000,
      evidenceByPid: new Map([[pid, fixtureEvidence(dir, pid, nowMs)]]),
      getParentPid: () => 1,
      getSocketPeerConnected: () => false,
      getProcessStartTimeMs: () => nowMs - 600001,
      signal: (candidatePid) => {
        signals.push(candidatePid);
        return true;
      },
      // `enabled` deliberately omitted: an caller that forgets the switch must not terminate.
    });

    expect(signals).toEqual([]);
    expect(result.appliedPids).toEqual([]);
    rmSync(dir, { recursive: true, force: true });
  });

  it('reaps a daemon whose parent died after the inventory snapshot was taken', () => {
    const dir = mkdtempSync(join(tmpdir(), 'sweep-latereap-'));
    const pid = 424243;
    const nowMs = Date.now();
    const signals: number[] = [];
    // Inventory saw a live parent; by apply time that parent is gone. Fresh evidence, not the
    // snapshot, must decide — otherwise a daemon orphaned mid-sweep is never collected.
    const result = applySweep(fixtureInventory(pid, 99991), {
      enabled: true,
      selfPid: process.pid,
      nowMs,
      startupGraceMs: 1000,
      evidenceByPid: new Map([[pid, fixtureEvidence(dir, pid, nowMs)]]),
      getParentPid: () => 1,
      getSocketPeerConnected: () => false,
      getProcessStartTimeMs: () => nowMs - 600001,
      signal: (candidatePid) => {
        signals.push(candidatePid);
        return true;
      },
    });

    expect(signals).toEqual([pid]);
    expect(result.appliedPids).toEqual([pid]);
    rmSync(dir, { recursive: true, force: true });
  });
});
