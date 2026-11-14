// ───────────────────────────────────────────────────────────────────
// MODULE: Workflow Lock Lifetime Contract
// ───────────────────────────────────────────────────────────────────

// The workflow assets are read as plain text. The lock TTL has to scale with
// the dispatch timeout, and every dispatch has to refresh the lock it holds.
// A fixed TTL shorter than a dispatch leaves the lock stale while the run is
// still working, so another run can reclaim the packet mid-iteration.

import { afterEach, describe, expect, it } from 'vitest';

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';

import { runtimeRoot } from '../helpers/spawn-cjs';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const SKILLS_ROOT = resolve(runtimeRoot, '..', '..', '..');
const ASSETS = resolve(SKILLS_ROOT, 'commands', 'deep', 'assets');
const LOOP_LOCK_CLI = resolve(runtimeRoot, 'scripts', 'loop-lock.cjs');

const FILES = [
  'deep-research-auto',
  'deep-research-confirm',
  'deep-review-auto',
  'deep-review-confirm',
];

const REFRESH_COMMAND =
  'loop-lock.cjs refresh --lock-path {state_paths.lock_file} --owner-pid {captured_owner_pid} --nonce {captured_acquire_nonce}';

const tempDirs: string[] = [];

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function leadingWhitespace(line: string): string {
  return /^\s*/u.exec(line)?.[0] ?? '';
}

function phaseStep(text: string, name: string): string {
  const marker = `      ${name}:\n`;
  const start = text.indexOf(marker);
  if (start === -1) return '';
  const rest = text.slice(start + marker.length);
  const end = rest.search(/\n      [a-z_0-9]+:\n/u);
  return end === -1 ? rest : rest.slice(0, end);
}

function keyBlock(block: string, key: string): string {
  const lines = block.split(/\r?\n/u);
  const start = lines.findIndex((line) => line.trim() === `${key}:`);
  if (start === -1) return '';
  const baseIndent = leadingWhitespace(lines[start]).length;
  let end = start;
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim() === '') continue;
    if (leadingWhitespace(line).length <= baseIndent) break;
    end = index;
  }
  return lines.slice(start, end + 1).join('\n');
}

function lastJsonLine(stdout: string): Record<string, unknown> {
  const line = stdout.split(/\r?\n/u).filter(Boolean).at(-1) ?? '{}';
  return JSON.parse(line) as Record<string, unknown>;
}

function acquireLock(lockPath: string, ttlMs: number): void {
  const acquire = spawnSync(
    process.execPath,
    [
      LOOP_LOCK_CLI,
      'acquire',
      '--lock-path',
      lockPath,
      '--packet-id',
      'fixture-packet',
      '--ttl-ms',
      String(ttlMs),
    ],
    { cwd: runtimeRoot, encoding: 'utf8' },
  );
  expect(acquire.status).toBe(0);
  expect(lastJsonLine(acquire.stdout).acquired).toBe(true);
}

function statusOf(lockPath: string): Record<string, unknown> {
  const status = spawnSync(
    process.execPath,
    [LOOP_LOCK_CLI, 'status', '--lock-path', lockPath],
    { cwd: runtimeRoot, encoding: 'utf8' },
  );
  expect(status.status).toBe(0);
  return lastJsonLine(status.stdout);
}

function ageHeartbeat(lockPath: string, seconds: number): void {
  const lock = JSON.parse(readFileSync(lockPath, 'utf8')) as Record<string, unknown>;
  expect(typeof lock.last_heartbeat_iso).toBe('string');
  lock.last_heartbeat_iso = new Date(Date.now() - seconds * 1000).toISOString();
  writeFileSync(lockPath, JSON.stringify(lock), 'utf8');
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

// ───────────────────────────────────────────────────────────────────
// 3. TESTS
// ───────────────────────────────────────────────────────────────────

describe('workflow lock lifetime', () => {
  for (const name of FILES) {
    const text = readFileSync(resolve(ASSETS, `${name}.yaml`), 'utf8');

    it(`${name} derives the lock TTL from the dispatch timeout`, () => {
      const step = phaseStep(text, 'step_acquire_lock');
      expect(step).not.toBe('');
      expect(step).toContain('ttl_ms: "lock_ttl_ms = max(1800000, executor_timeout * 1000).');
      expect(step).toContain('--ttl-ms {lock_ttl_ms}');
      expect(text).not.toContain('--ttl-ms 1800000');
    });

    it(`${name} refreshes the lock before and after dispatch`, () => {
      const step = phaseStep(text, 'step_dispatch_iteration');
      expect(step).not.toBe('');

      const pre = keyBlock(step, 'pre_dispatch_refresh_lock');
      const post = keyBlock(step, 'post_dispatch_refresh_lock');
      expect(pre).not.toBe('');
      expect(post).not.toBe('');
      expect(pre).toContain(REFRESH_COMMAND);
      expect(post).toContain(REFRESH_COMMAND);
      expect(pre).toContain('step_release_lock');
      expect(post).toContain('step_release_lock');
      expect(step.indexOf(pre)).toBeLessThan(step.indexOf(post));
    });

    it(`${name} bounds the native dispatch by the dispatch timeout`, () => {
      const step = phaseStep(text, 'step_dispatch_iteration');
      expect(step).not.toBe('');

      const native = keyBlock(step, 'if_native');
      expect(native).not.toBe('');
      expect(native).toContain('timeout_seconds: "{config.executor.timeoutSeconds}"');
    });
  }

  it('a lock at the derived TTL is not stale 3600 seconds after its last refresh', () => {
    const dispatchSeconds = 3600;
    const derivedTtl = Math.max(1800000, dispatchSeconds * 1000);

    const dir = mkdtempSync(join(tmpdir(), 'deep-loop-lock-lifetime-'));
    tempDirs.push(dir);
    const lockPath = join(dir, '.deep-loop.lock');

    acquireLock(lockPath, derivedTtl);
    ageHeartbeat(lockPath, dispatchSeconds);

    expect(statusOf(lockPath).stale).toBe(false);
  });

  it('a lock at the old fixed TTL is stale after one full dispatch', () => {
    const dispatchSeconds = 3600;
    const fixedTtl = 1800000;

    const dir = mkdtempSync(join(tmpdir(), 'deep-loop-lock-lifetime-'));
    tempDirs.push(dir);
    const lockPath = join(dir, '.deep-loop.lock');

    acquireLock(lockPath, fixedTtl);
    ageHeartbeat(lockPath, dispatchSeconds + 1);

    expect(statusOf(lockPath).stale).toBe(true);
  });
});
