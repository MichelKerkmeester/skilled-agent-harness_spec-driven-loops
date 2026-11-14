// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Loop Lock Release Nonce Test
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

const ASSETS = resolve(SKILLS_ROOT, 'commands', 'deep', 'assets');
const RESEARCH_YAML_PATH = resolve(ASSETS, 'deep-research.yaml');
const REVIEW_YAML_PATH = resolve(ASSETS, 'deep-review.yaml');
// Every workflow that takes the loop lock: acquire stamps a nonce, and release
// refuses without it, so a release line that drops it leaves the lock behind.
const YAML_PATHS = [
  'deep-research',
  'deep-review',
].map((name) => resolve(ASSETS, `${name}.yaml`));

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

describe('deep-loop lock release carries the acquire nonce', () => {
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

  for (const yamlPath of [RESEARCH_YAML_PATH, REVIEW_YAML_PATH]) it(`releases the ${basename(yamlPath)} lock when given the acquired owner pid and nonce`, () => {
    const dir = mkdtempSync(join(tmpdir(), 'deep-loop-lock-release-'));
    tempDirs.push(dir);
    const lockPath = join(dir, '.deep-loop.lock');

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

    const commandMatch = /command:\s*"([^"]+)"/u.exec(stepBlock(readFileSync(yamlPath, 'utf8'), 'step_release_lock'));
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

describe('every terminal path after the acquire releases the lock', () => {
  const LOCKED_WORKFLOWS = [
    'deep-research',
    'deep-review',
  ];

  for (const name of LOCKED_WORKFLOWS) {
    it(`${name} routes to step_release_lock on every terminal path`, () => {
      const text = readFileSync(resolve(ASSETS, `${name}.yaml`), 'utf8');
      const lines = text.split(/\r?\n/u);
      const acquireIndex = lines.indexOf('      step_acquire_lock:');
      expect(acquireIndex).toBeGreaterThanOrEqual(0);

      const problems: string[] = [];
      let haltCount = 0;

      for (let index = acquireIndex + 1; index < lines.length; index += 1) {
        const line = lines[index];
        const trimmed = line.trim();
        const indent = line.slice(0, line.length - line.trimStart().length);

        if (trimmed === 'halt: true') {
          haltCount += 1;
          const next = lines[index + 1] ?? '';
          const nextTrimmed = next.trim();
          const nextIndent = next.slice(0, next.length - next.trimStart().length);
          if (nextIndent !== indent || nextTrimmed !== 'release_lock: step_release_lock') {
            problems.push(
              `line ${index + 1}: halt: true is not followed by release_lock: step_release_lock at the same indentation`,
            );
          }
        }

        if (
          line.includes('fail closed: lost the packet lock')
          && !line.includes('step_release_lock')
        ) {
          problems.push(`line ${index + 1}: a lost-lock failure does not route to step_release_lock`);
        }

        if (
          (trimmed.startsWith('on_fail:') || trimmed.startsWith('on_missing_counters:'))
          && /\bhalt\b/iu.test(line)
          && !line.includes('step_release_lock')
        ) {
          problems.push(`line ${index + 1}: a halting failure branch does not route to step_release_lock`);
        }

        if (
          line.includes('status: "CANCELLED"')
          && !line.includes('release_lock: step_release_lock')
        ) {
          problems.push(`line ${index + 1}: a cancelled branch does not route to step_release_lock`);
        }
      }

      // Shared defaults sit above the `workflow:` key and run only where a step refers to them,
      // so the order check covers the step sequence alone.
      const workflowStart = Math.max(0, lines.findIndex((line) => line.trim() === 'workflow:'));
      for (let index = workflowStart; index < acquireIndex; index += 1) {
        if (lines[index].includes('step_release_lock')) {
          problems.push(`line ${index + 1}: step_release_lock appears before the lock is acquired`);
        }
      }

      for (let index = 0; index < lines.length; index += 1) {
        if (lines[index].includes('applies_to: [')) {
          problems.push(`line ${index + 1}: the retired applies_to list is still present`);
        }
      }

      const releaseSteps = lines.filter((line) => line === '      step_release_lock:');
      if (releaseSteps.length !== 1) {
        problems.push(
          `file: expected exactly one step_release_lock step, found ${releaseSteps.length}`,
        );
      }

      expect(problems).toEqual([]);
      expect(haltCount).toBeGreaterThan(0);
    });
  }
});
