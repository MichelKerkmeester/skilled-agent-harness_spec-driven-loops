// ───────────────────────────────────────────────────────────────────
// MODULE: Completed Lineage State CLI Tests
// ───────────────────────────────────────────────────────────────────
//
// Stub executors written as shell scripts call the lineage state fixture as a CLI, so a
// missing lineage dir must fail with usage text and the bad-argument exit code rather
// than a stack trace from deep inside the filesystem calls.

import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

import { afterEach, describe, expect, it } from 'vitest';

import { runtimeRoot } from '../helpers/spawn-cjs';

const helperScript = join(runtimeRoot, 'tests', 'helpers', 'completed-lineage-state.cjs');
const USAGE_EXIT = 2;
const scratchDirs: string[] = [];

afterEach(() => {
  while (scratchDirs.length > 0) rmSync(scratchDirs.pop() as string, { recursive: true, force: true });
});

function runHelper(args: string[]) {
  return spawnSync(process.execPath, [helperScript, ...args], { encoding: 'utf8' });
}

describe('completed-lineage-state CLI', () => {
  it('writes the terminal state row for the named loop type', () => {
    const lineageDir = mkdtempSync(join(tmpdir(), 'completed-lineage-cli-'));
    scratchDirs.push(lineageDir);
    const result = runHelper([lineageDir, 'review']);
    expect(result.status).toBe(0);
    const rows = readFileSync(join(lineageDir, 'deep-review-state.jsonl'), 'utf8').trim().split('\n');
    expect(JSON.parse(rows.at(-1) as string)).toMatchObject({ type: 'event', event: 'terminal_gates' });
    expect(existsSync(join(lineageDir, 'deep-research-state.jsonl'))).toBe(false);
  });

  it('prints usage and exits 2 when the lineage dir is missing', () => {
    const result = runHelper([]);
    expect(result.status).toBe(USAGE_EXIT);
    expect(result.stdout).toBe('');
    expect(result.stderr).toMatch(/^Usage: node completed-lineage-state\.cjs <lineageDir> \[research\|review \.\.\.\]\n$/);
  });
});
