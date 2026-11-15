// ───────────────────────────────────────────────────────────────────
// MODULE: Workflow Max Duration Contract
// ───────────────────────────────────────────────────────────────────

// The workflow assets are read as plain text. A loop that has used its
// wall-clock budget must stop dispatching and still synthesize the findings
// it already has, so the duration check sits at the top of every loop pass
// and routes to synthesis rather than halting without a report.

import { afterEach, describe, expect, it } from 'vitest';

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';

import { runtimeRoot } from '../helpers/spawn-cjs';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const nodeRequire = createRequire(import.meta.url);

const taxonomy = nodeRequire('../../lib/deep-loop/lifecycle-taxonomy.cjs') as {
  STOP_REASONS: Record<string, string>;
};

const SKILLS_ROOT = resolve(runtimeRoot, '..', '..', '..');
const REPO_ROOT = resolve(SKILLS_ROOT, '..');
const ASSETS = resolve(SKILLS_ROOT, 'commands', 'deep', 'assets');

const FILES = [
  'deep-research',
  'deep-review',
];

const MAX_DURATION_MINUTES = 120;

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

function blockScalar(block: string, key: string): string {
  const lines = block.split(/\r?\n/u);
  const start = lines.findIndex((line) => new RegExp(`^\\s*${key}:\\s*\\|\\s*$`, 'u').test(line));
  if (start === -1) return '';
  const baseIndent = leadingWhitespace(lines[start]).length;
  const body: string[] = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim() === '') {
      body.push('');
      continue;
    }
    if (leadingWhitespace(line).length <= baseIndent) break;
    body.push(line);
  }
  while (body.length > 0 && body.at(-1) === '') body.pop();
  const indents = body
    .filter((line) => line.trim() !== '')
    .map((line) => leadingWhitespace(line).length);
  const removal = indents.length > 0 ? Math.min(...indents) : 0;
  return body.map((line) => (line.trim() === '' ? '' : line.slice(removal))).join('\n');
}

function lastJsonLine(stdout: string): Record<string, unknown> {
  const line = stdout.split(/\r?\n/u).filter(Boolean).at(-1) ?? '{}';
  return JSON.parse(line) as Record<string, unknown>;
}

function runDurationCommand(
  commandTemplate: string,
  createdAt: string,
): Record<string, unknown> {
  const dir = mkdtempSync(join(tmpdir(), 'deep-loop-max-duration-'));
  tempDirs.push(dir);
  const configPath = join(dir, 'config.json');
  writeFileSync(
    configPath,
    JSON.stringify({ maxDurationMinutes: MAX_DURATION_MINUTES, createdAt }),
    'utf8',
  );

  const rendered = commandTemplate.replaceAll('{state_paths.config}', configPath);
  const result = spawnSync('sh', ['-c', rendered], { cwd: REPO_ROOT, encoding: 'utf8' });
  expect(result.status).toBe(0);
  return lastJsonLine(result.stdout);
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

describe('workflow max duration', () => {
  for (const name of FILES) {
    const text = readFileSync(resolve(ASSETS, `${name}.yaml`), 'utf8');

    it(`${name} checks the duration after step_read_state, where every pass re-enters`, () => {
      const refreshIndex = text.indexOf('      step_refresh_lock:\n');
      const durationIndex = text.indexOf('      step_check_max_duration:\n');
      const dispatchIndex = text.indexOf('      step_dispatch_iteration:\n');
      const readStateIndex = text.indexOf('      step_read_state:\n');

      expect(refreshIndex).toBeGreaterThanOrEqual(0);
      expect(durationIndex).not.toBe(-1);
      expect(refreshIndex).toBeLessThan(durationIndex);
      expect(readStateIndex).toBeGreaterThanOrEqual(0);
      expect(readStateIndex).toBeLessThan(durationIndex);
      expect(durationIndex).toBeLessThan(dispatchIndex);

      const step = phaseStep(text, 'step_check_max_duration');
      expect(step).not.toBe('');

      const ifReached = keyBlock(step, 'if_reached');
      expect(ifReached).not.toBe('');
      expect(ifReached).toContain('reason: "maxDurationReached"');
      expect(ifReached).toContain('stopReason: "maxDurationReached"');
      expect(ifReached).toContain('skip_to: phase_synthesis');
      expect(ifReached).not.toContain('halt: true');

      expect(Object.values(taxonomy.STOP_REASONS)).toContain('maxDurationReached');
    });

    it(`${name} stops and synthesizes when the limit is reached`, () => {
      const step = phaseStep(text, 'step_check_max_duration');
      expect(step).not.toBe('');

      const command = blockScalar(step, 'command');
      expect(command).not.toBe('');

      const now = Date.now();
      const reached = runDurationCommand(command, new Date(now - 121 * 60000).toISOString());
      expect(reached.reached).toBe(true);
      expect(Number(reached.elapsedMinutes)).toBeGreaterThanOrEqual(MAX_DURATION_MINUTES);

      const notReached = runDurationCommand(command, new Date(now - 119 * 60000).toISOString());
      expect(notReached.reached).toBe(false);
    });
  }
});
