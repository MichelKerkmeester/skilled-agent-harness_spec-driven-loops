// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Lock Release Nonce Test
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';

import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { basename, join, resolve } from 'node:path';

import { runtimeRoot } from '../helpers/spawn-cjs';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const SKILLS_ROOT = resolve(runtimeRoot, '..', '..', '..');
const REPO_ROOT = resolve(SKILLS_ROOT, '..');
const LOOP_LOCK_CLI = resolve(runtimeRoot, 'scripts', 'loop-lock.cjs');

const AUTO_YAML_PATH = resolve(SKILLS_ROOT, 'commands', 'deep', 'assets', 'deep-research-auto.yaml');
const CONFIRM_YAML_PATH = resolve(SKILLS_ROOT, 'commands', 'deep', 'assets', 'deep-research-confirm.yaml');
const YAML_PATHS = [AUTO_YAML_PATH, CONFIRM_YAML_PATH];

const tempDirs: string[] = [];

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function stepBlock(text: string, stepName: string): string {
  const marker = `      ${stepName}:\n`;
  const start = text.indexOf(marker);
  if (start === -1) {
    throw new Error(`${stepName} was not found in the workflow asset`);
  }

  const rest = text.slice(start + marker.length);
  const nextStep = rest.search(/\n      [a-zA-Z0-9_]+:\n/u);
  return nextStep === -1 ? rest : rest.slice(0, nextStep);
}

function releaseLines(text: string): string[] {
  return text.split(/\r?\n/u).filter((line) => line.includes('loop-lock.cjs release'));
}

function lastJsonLine(stdout: string): Record<string, unknown> {
  const line = stdout.split(/\r?\n/u).filter(Boolean).at(-1) ?? '{}';
  return JSON.parse(line) as Record<string, unknown>;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

// ───────────────────────────────────────────────────────────────────
// 4. TESTS
// ───────────────────────────────────────────────────────────────────

describe('deep research lock release carries the acquire nonce', () => {
  for (const yamlPath of YAML_PATHS) {
    it(`passes --nonce on every release in ${basename(yamlPath)}`, () => {
      const text = readFileSync(yamlPath, 'utf8');
      const lines = releaseLines(text);

      expect(lines.length).toBeGreaterThanOrEqual(4);
      for (const line of lines) {
        expect(line).toContain('--nonce {captured_acquire_nonce}');
      }
      expect(stepBlock(text, 'step_acquire_lock')).toContain('acquireNonce');
    });
  }

  it('releases the auto workflow lock when given the acquired owner pid and nonce', () => {
    const dir = mkdtempSync(join(tmpdir(), 'deep-research-lock-release-'));
    tempDirs.push(dir);
    const lockPath = join(dir, '.deep-research.lock');

    const acquire = spawnSync(
      process.execPath,
      [LOOP_LOCK_CLI, 'acquire', '--lock-path', lockPath, '--packet-id', 'specs/x'],
      { cwd: runtimeRoot, encoding: 'utf8' },
    );
    expect(acquire.status).toBe(0);

    const acquired = lastJsonLine(acquire.stdout);
    expect(acquired.acquired).toBe(true);
    const lock = acquired.lock as { ownerPid: number; acquireNonce: string } | undefined;
    if (!lock) {
      throw new Error('acquire output did not carry the lock record');
    }
    expect(Number.isInteger(lock.ownerPid)).toBe(true);
    expect(typeof lock.acquireNonce).toBe('string');
    expect(lock.acquireNonce.length).toBeGreaterThan(0);
    expect(existsSync(lockPath)).toBe(true);

    const commandMatch = /command:\s*"([^"]+)"/u.exec(stepBlock(readFileSync(AUTO_YAML_PATH, 'utf8'), 'step_release_lock'));
    const template = commandMatch?.[1];
    if (!template) {
      throw new Error('step_release_lock has no command');
    }
    const rendered = template
      .replaceAll('{state_paths.lock_file}', lockPath)
      .replaceAll('{captured_owner_pid}', String(lock.ownerPid))
      .replaceAll('{captured_acquire_nonce}', lock.acquireNonce);

    const argv = rendered.split(/\s+/u);
    expect(argv[0]).toBe('node');
    const release = spawnSync(process.execPath, argv.slice(1), { cwd: REPO_ROOT, encoding: 'utf8' });

    expect(release.status).toBe(0);
    expect(release.stdout).toContain('"released":true');
    expect(lastJsonLine(release.stdout).released).toBe(true);
    expect(existsSync(lockPath)).toBe(false);
  });
});
