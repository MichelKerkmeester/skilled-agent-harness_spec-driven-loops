// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Research Reducer Usage Line Tests
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const testDirectory = dirname(fileURLToPath(import.meta.url));
const reducerScript = resolve(testDirectory, '../../../deep-research/scripts/reduce-state.cjs');
const tempDirs: string[] = [];

// Every flag the reducer accepts. The usage line must name each one, or an operator
// reading the rejection has no way to find the flag they meant.
const acceptedFlags = [
  '--artifact-dir <path>',
  '--lenient',
  '--create-missing-anchors',
  '--emit-resource-map',
  '--fanout-resource-map-only',
  '--require-existing-state',
];

function runReducer(args: string[]) {
  const cwd = mkdtempSync(join(tmpdir(), 'deep-research-usage-'));
  tempDirs.push(cwd);
  return spawnSync(process.execPath, [reducerScript, ...args], { cwd, encoding: 'utf8', timeout: 10000 });
}

function usageLine(stderr: string): string {
  return stderr.split('\n').find((line) => line.startsWith('Usage:')) ?? '';
}

afterEach(() => {
  for (const directory of tempDirs.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe('deep-research reducer usage line', () => {
  it('lists every accepted flag when an unknown option is rejected', () => {
    const result = runReducer(['spec-folder', '--bogus-option']);

    expect(result.status).toBe(3);
    const usage = usageLine(result.stderr);
    for (const flag of acceptedFlags) expect(usage).toContain(`[${flag}]`);
  });

  it('prints the same full usage line when the spec folder is missing', () => {
    const result = runReducer(['--lenient']);

    expect(result.status).toBe(1);
    const usage = usageLine(result.stderr);
    for (const flag of acceptedFlags) expect(usage).toContain(`[${flag}]`);
  });
});
