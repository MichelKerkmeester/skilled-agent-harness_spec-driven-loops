import { afterEach, describe, expect, it } from 'vitest';

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

import {
  acquireLoopLock,
  isStaleLoopLock,
  processAlive,
  refreshLoopLock,
  releaseLoopLock,
  type LoopLockData,
} from '../../lib/deep-loop/loop-lock.js';

const here = dirname(fileURLToPath(import.meta.url));
const LOOP_LOCK_CLI = resolve(here, '..', '..', 'scripts', 'loop-lock.cjs');

type CliResult = { exitCode: number | null; json: Record<string, unknown>; stderr: string };

function runCli(args: string[]): CliResult {
  const result = spawnSync(process.execPath, [LOOP_LOCK_CLI, ...args], { encoding: 'utf8' });
  const stdout = (result.stdout ?? '').trim();
  const lastLine = stdout.split(/\r?\n/).filter(Boolean).at(-1) ?? '{}';
  return {
    exitCode: result.status,
    json: JSON.parse(lastLine) as Record<string, unknown>,
    stderr: result.stderr ?? '',
  };
}

const tempDirs: string[] = [];

function tempLock(): string {
  const dir = mkdtempSync(join(tmpdir(), 'loop-lock-cli-'));
  tempDirs.push(dir);
  return join(dir, '.deep-loop.lock');
}

function knownDeadPid(): number {
  for (let pid = 999_999; pid > 900_000; pid -= 1) {
    if (!processAlive(pid)) return pid;
  }
  throw new Error('Could not find a known-dead pid');
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('loop-lock CLI adapter mirrors the library', () => {
  it('acquire writes the snake_case on-disk format the library produces', () => {
    const lockPath = tempLock();
    const result = runCli(['acquire', '--lock-path', lockPath, '--packet-id', 'pkt-A', '--runtime-kind', 'cli-claude-code', '--owner-pid', String(process.pid)]);

    expect(result.exitCode).toBe(0);
    expect(result.json).toMatchObject({ command: 'acquire', acquired: true });

    const disk = JSON.parse(readFileSync(lockPath, 'utf8'));
    expect(disk).toMatchObject({
      owner_pid: process.pid,
      ttl_ms: 300_000,
      packet_id: 'pkt-A',
      runtime_kind: 'cli-claude-code',
    });
  });

  it('status reflects the same staleness/liveness the library computes', () => {
    const lockPath = tempLock();
    runCli(['acquire', '--lock-path', lockPath, '--packet-id', 'pkt-A', '--owner-pid', String(process.pid)]);

    const status = runCli(['status', '--lock-path', lockPath]);
    expect(status.json).toMatchObject({ command: 'status', exists: true, held: true, stale: false, alive: true });

    const holder = status.json.holder as LoopLockData;
    expect(isStaleLoopLock(holder)).toBe(false);
    expect(processAlive(holder.ownerPid)).toBe(true);
  });

  it('refuses a second acquire while a live holder is fresh (held refusal)', () => {
    const lockPath = tempLock();
    runCli(['acquire', '--lock-path', lockPath, '--packet-id', 'pkt-A', '--owner-pid', String(process.pid)]);

    const second = runCli(['acquire', '--lock-path', lockPath, '--packet-id', 'pkt-B', '--owner-pid', String(process.pid)]);
    expect(second.json).toMatchObject({ command: 'acquire', acquired: false });
    expect((second.json.holder as { packetId: string }).packetId).toBe('pkt-A');

    // The library, given the same on-disk holder, also refuses.
    const now = new Date().toISOString();
    const libResult = acquireLoopLock(lockPath, {
      ownerPid: process.pid, startedAtIso: now, ttlMs: 300_000, lastHeartbeatIso: now, packetId: 'pkt-lib', runtimeKind: 'main',
    });
    expect(libResult.acquired).toBe(false);
  });

  it('refresh and release honor owner-pid gating like the library', () => {
    const lockPath = tempLock();
    const acquired = runCli(['acquire', '--lock-path', lockPath, '--packet-id', 'pkt-A', '--owner-pid', String(process.pid)]);
    const acquireNonce = (acquired.json.lock as { acquireNonce?: string }).acquireNonce;
    expect(typeof acquireNonce).toBe('string');

    expect(
      runCli(['refresh', '--lock-path', lockPath, '--owner-pid', String(process.pid + 100_000), '--nonce', String(acquireNonce)]).json,
    ).toMatchObject({ refreshed: false });
    expect(
      runCli(['refresh', '--lock-path', lockPath, '--owner-pid', String(process.pid), '--nonce', String(acquireNonce)]).json,
    ).toMatchObject({ refreshed: true });

    expect(
      runCli(['release', '--lock-path', lockPath, '--owner-pid', String(process.pid + 100_000), '--nonce', String(acquireNonce)]).json,
    ).toMatchObject({ released: false });
    expect(existsSync(lockPath)).toBe(true);
    expect(
      runCli(['release', '--lock-path', lockPath, '--owner-pid', String(process.pid), '--nonce', String(acquireNonce)]).json,
    ).toMatchObject({ released: true });
    expect(existsSync(lockPath)).toBe(false);
  });

  it('refresh and release reject a nonce-bearing lock when --nonce is missing or wrong', () => {
    const lockPath = tempLock();
    runCli(['acquire', '--lock-path', lockPath, '--packet-id', 'pkt-A', '--owner-pid', String(process.pid)]);

    expect(runCli(['refresh', '--lock-path', lockPath, '--owner-pid', String(process.pid)]).json).toMatchObject({ refreshed: false });
    expect(
      runCli(['refresh', '--lock-path', lockPath, '--owner-pid', String(process.pid), '--nonce', 'wrong-nonce']).json,
    ).toMatchObject({ refreshed: false });

    expect(runCli(['release', '--lock-path', lockPath, '--owner-pid', String(process.pid)]).json).toMatchObject({ released: false });
    expect(
      runCli(['release', '--lock-path', lockPath, '--owner-pid', String(process.pid), '--nonce', 'wrong-nonce']).json,
    ).toMatchObject({ released: false });
    expect(existsSync(lockPath)).toBe(true);
  });

  it('reclaims a stale (dead-owner) lock, matching library reclaim semantics', () => {
    const lockPath = tempLock();
    const dead = knownDeadPid();
    const acquireStale = runCli(['acquire', '--lock-path', lockPath, '--packet-id', 'old', '--owner-pid', String(dead)]);
    expect(acquireStale.json).toMatchObject({ acquired: true });

    const reclaim = runCli(['acquire', '--lock-path', lockPath, '--packet-id', 'new', '--owner-pid', String(process.pid)]);
    expect(reclaim.json).toMatchObject({ command: 'acquire', acquired: true });
    expect(reclaim.json).toHaveProperty('reclaimed');
    expect((reclaim.json.reclaimed as { packetId: string }).packetId).toBe('old');
    expect(JSON.parse(readFileSync(lockPath, 'utf8')).packet_id).toBe('new');

    // Cross-check: release with the matching pid and nonce succeeds via the library.
    const reclaimNonce = (reclaim.json.lock as { acquireNonce?: string }).acquireNonce;
    expect(releaseLoopLock(lockPath, process.pid, reclaimNonce)).toBe(true);
  });

  it('returns exit 3 + INPUT_VALIDATION on bad input', () => {
    expect(runCli(['acquire', '--packet-id', 'x']).exitCode).toBe(3);
    expect(runCli(['frobnicate', '--lock-path', '/tmp/x']).exitCode).toBe(3);
    const noSub = runCli([]);
    expect(noSub.exitCode).toBe(3);
    expect(noSub.json).toMatchObject({ status: 'error', code: 'INPUT_VALIDATION' });
  });
});
